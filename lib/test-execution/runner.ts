import { supabaseAdmin } from '@/lib/supabase/client'
import { vapiClient, mockVapiTextEval } from '@/lib/vapi/client'
import { evaluateConversation, formatConversation } from '@/lib/evaluation/evaluator'
import { dbToAgentConfig, dbToTestScript, dbToScenario, dbToPersona, dbToTestRun, testRunToDb, testResultToDb } from '@/lib/db-transforms'
import { generateWithStructure } from '@/lib/openai/client'
import { getCallerTurnSystemPrompt, getCallerTurnUserPrompt } from '@/lib/openai/prompts'
import type { AgentConfig, DbAgentConfig, TestScript, DbTestScript, Scenario, DbScenario, Persona, DbPersona, DbTestRun, DbTestResult } from '@/types'
import { nanoid } from 'nanoid'

export interface TestExecutionOptions {
  projectId: string
  scriptIds: string[]
  useVapi?: boolean // If false, uses mock VAPI
}

export interface TestExecutionResult {
  runId: string
  totalTests: number
  avgScore: number
  flaggedCount: number
  results: Array<{
    scriptId: string
    score: number
    status: string
  }>
}

/**
 * Execute a test run with multiple test scripts
 * This is the main orchestration function for running tests
 */
export async function executeTestRun(options: TestExecutionOptions): Promise<TestExecutionResult> {
  const { projectId, scriptIds, useVapi = false } = options

  // Get current agent config
  const { data: configData, error: configError } = await supabaseAdmin
    .from('agent_configs')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_current', true)
    .single()

  if (configError || !configData) {
    throw new Error('Agent configuration not found')
  }

  const agentConfig = dbToAgentConfig(configData as DbAgentConfig)

  // Get project to retrieve VAPI assistant ID and current tests count
  const { data: projectData } = await supabaseAdmin
    .from('projects')
    .select('vapi_assistant_id, tests_run')
    .eq('id', projectId)
    .single()

  const vapiAssistantId = projectData?.vapi_assistant_id || null

  // Get the next run number
  const { data: lastRun } = await supabaseAdmin
    .from('test_runs')
    .select('run_number')
    .eq('project_id', projectId)
    .order('run_number', { ascending: false })
    .limit(1)
    .single()

  const runNumber = lastRun ? lastRun.run_number + 1 : 1
  const runId = crypto.randomUUID()

  // Create test run record
  const newRun: Partial<DbTestRun> = {
    id: runId,
    project_id: projectId,
    run_number: runNumber,
    agent_config_id: agentConfig.id,
    total_tests: scriptIds.length,
    status: 'running',
    flagged_count: 0
  }

  await supabaseAdmin.from('test_runs').insert(newRun)

  // Execute tests for each script
  const results = []
  let totalScore = 0
  let flaggedCount = 0

  for (const scriptId of scriptIds) {
    try {
      const result = await executeTestScript(
        projectId,
        scriptId,
        agentConfig,
        runId,
        useVapi,
        vapiAssistantId
      )

      results.push({
        scriptId,
        score: result.score,
        status: result.status
      })

      totalScore += result.score
      if (result.flaggedTurns > 0) {
        flaggedCount++
      }
    } catch (error) {
      console.error(`Error executing script ${scriptId}:`, error)

      // Record failed result
      results.push({
        scriptId,
        score: 0,
        status: 'Failed'
      })
    }
  }

  // Calculate average score
  const avgScore = scriptIds.length > 0 ? totalScore / scriptIds.length : 0

  // Update test run with results
  await supabaseAdmin
    .from('test_runs')
    .update({
      avg_score: avgScore,
      flagged_count: flaggedCount,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', runId)

  // Update project stats
  // Use the tests_run count we fetched earlier
  const currentTestsRun = projectData?.tests_run || 0

  await supabaseAdmin
    .from('projects')
    .update({
      latest_avg_score: avgScore,
      last_tested: new Date().toISOString(),
      tests_run: currentTestsRun + scriptIds.length,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)

  return {
    runId,
    totalTests: scriptIds.length,
    avgScore,
    flaggedCount,
    results
  }
}

/**
 * Execute a single test script using discussion guide approach
 */
async function executeTestScript(
  projectId: string,
  scriptId: string,
  agentConfig: AgentConfig,
  runId: string,
  useVapi: boolean,
  vapiAssistantId: string | null
): Promise<{
  score: number
  status: string
  flaggedTurns: number
}> {
  const MAX_TURNS = 3 // Testing with limited turns
  const WRAP_UP_TURN = 25

  // Get test script (discussion guide)
  const { data: scriptData, error: scriptError } = await supabaseAdmin
    .from('test_scripts')
    .select('*')
    .eq('id', scriptId)
    .single()

  if (scriptError || !scriptData) {
    throw new Error('Test script not found')
  }

  const script = dbToTestScript(scriptData as DbTestScript)
  const discussionGuide = script.scriptData as any // This is now a discussion guide

  // Get scenario
  const { data: scenarioData } = await supabaseAdmin
    .from('scenarios')
    .select('*')
    .eq('id', script.scenarioId)
    .single()

  const scenario = scenarioData ? dbToScenario(scenarioData as DbScenario) : null

  // Get persona
  const { data: personaData } = await supabaseAdmin
    .from('personas')
    .select('*')
    .eq('id', scenario?.personaId)
    .single()

  const persona = personaData ? dbToPersona(personaData as DbPersona) : null

  if (!persona) {
    throw new Error('Persona not found')
  }

  // Build conversation dynamically
  const conversationHistory: { role: string; text: string }[] = []
  const callerSystemPrompt = getCallerTurnSystemPrompt(
    persona.name,
    persona.age,
    persona.gender,
    persona.profession,
    persona.description,
    persona.difficulty
  )

  // Execute conversation turn by turn
  for (let turnNumber = 1; turnNumber <= MAX_TURNS; turnNumber++) {
    try {
      // Determine if we should start wrapping up
      const shouldWrapUp = turnNumber >= WRAP_UP_TURN

      // Generate caller's next statement using OpenAI
      const callerPrompt = getCallerTurnUserPrompt(
        {
          objective: discussionGuide.objective,
          steps: discussionGuide.steps,
          behaviors: discussionGuide.behaviors
        },
        conversationHistory,
        turnNumber,
        shouldWrapUp
      )

      const callerResponse = await generateWithStructure<{ statement: string }>(
        callerSystemPrompt,
        callerPrompt,
        {
          type: 'object',
          properties: {
            statement: { type: 'string' }
          },
          required: ['statement'],
          additionalProperties: false
        },
        { temperature: 0.8, model: 'gpt-4o-mini' }
      )

      const callerText = callerResponse.statement

      // Add caller's statement to history
      conversationHistory.push({ role: 'caller', text: callerText })

      // Send to VAPI to get agent's response
      let agentText: string

      if (useVapi && process.env.VAPI_API_KEY && vapiAssistantId) {
        // Use real VAPI - send full conversation context
        const vapiResponse = await vapiClient.runTextEvaluation({
          assistantId: vapiAssistantId,
          systemPrompt: agentConfig.systemPrompt,
          callerMessages: conversationHistory
            .filter(turn => turn.role === 'caller')
            .map(turn => turn.text)
        })

        // Get the latest agent response
        const latestAgentTurn = vapiResponse.turns.reverse().find(t => t.role === 'assistant')
        agentText = latestAgentTurn?.message || 'Thank you for calling.'
      } else {
        // Use mock VAPI for development
        const mockResponse = await mockVapiTextEval(
          agentConfig.systemPrompt,
          [callerText]
        )
        agentText = mockResponse.turns.find(t => t.role === 'assistant')?.message || 'Thank you for calling.'
      }

      // Add agent's response to history
      conversationHistory.push({ role: 'agent', text: agentText })

      // Check for natural ending (goodbye phrases)
      const endingPhrases = ['goodbye', 'bye', 'thank you for your time', 'have a nice day', 'end call']
      const hasEnding = endingPhrases.some(phrase =>
        callerText.toLowerCase().includes(phrase) || agentText.toLowerCase().includes(phrase)
      )

      if (hasEnding && turnNumber >= 10) {
        // End conversation naturally if we've had at least 10 turns
        break
      }

    } catch (error) {
      console.error(`Error at turn ${turnNumber}:`, error)
      // Continue to next turn or break if critical error
      if (turnNumber < 5) {
        // If error in first few turns, break
        break
      }
      // Otherwise continue
    }
  }

  // Evaluate the conversation with OpenAI
  const evaluation = await evaluateConversation(
    agentConfig,
    conversationHistory,
    scenario?.goal || 'Complete the conversation successfully',
    scenario?.expectedOutcome || 'Agent handles the conversation appropriately'
  )

  // Store test result
  const resultId = crypto.randomUUID()
  const newResult: Partial<DbTestResult> = {
    id: resultId,
    test_run_id: runId,
    test_script_id: scriptId,
    persona_id: scenario?.personaId || null,
    score: evaluation.overallScore,
    summary: evaluation.summary,
    status: evaluation.status,
    conversation_data: conversationHistory,
    evaluation_data: evaluation
  }

  const { error: insertError } = await supabaseAdmin.from('test_results').insert(newResult)

  if (insertError) {
    console.error('Error inserting test result:', insertError)
    throw new Error(`Failed to store test result: ${insertError.message}`)
  }

  return {
    score: evaluation.overallScore,
    status: evaluation.status,
    flaggedTurns: evaluation.flaggedTurns.length
  }
}
