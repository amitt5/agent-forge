import { supabaseAdmin } from '@/lib/supabase/client'
import { vapiClient, mockVapiTextEval } from '@/lib/vapi/client'
import { evaluateConversation, formatConversation } from '@/lib/evaluation/evaluator'
import { dbToAgentConfig, dbToTestScript, dbToScenario, dbToTestRun, testRunToDb, testResultToDb } from '@/lib/db-transforms'
import type { AgentConfig, DbAgentConfig, TestScript, DbTestScript, Scenario, DbScenario, DbTestRun, DbTestResult } from '@/types'
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

  // Get the next run number
  const { data: lastRun } = await supabaseAdmin
    .from('test_runs')
    .select('run_number')
    .eq('project_id', projectId)
    .order('run_number', { ascending: false })
    .limit(1)
    .single()

  const runNumber = lastRun ? lastRun.run_number + 1 : 1
  const runId = nanoid(10)

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
        useVapi
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
  await supabaseAdmin
    .from('projects')
    .update({
      latest_avg_score: avgScore,
      last_tested: new Date().toISOString(),
      tests_run: supabaseAdmin.raw('tests_run + ?', [scriptIds.length]),
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
 * Execute a single test script
 */
async function executeTestScript(
  projectId: string,
  scriptId: string,
  agentConfig: AgentConfig,
  runId: string,
  useVapi: boolean
): Promise<{
  score: number
  status: string
  flaggedTurns: number
}> {
  // Get test script
  const { data: scriptData, error: scriptError } = await supabaseAdmin
    .from('test_scripts')
    .select('*')
    .eq('id', scriptId)
    .single()

  if (scriptError || !scriptData) {
    throw new Error('Test script not found')
  }

  const script = dbToTestScript(scriptData as DbTestScript)

  // Get scenario
  const { data: scenarioData } = await supabaseAdmin
    .from('scenarios')
    .select('*')
    .eq('id', script.scenarioId)
    .single()

  const scenario = scenarioData ? dbToScenario(scenarioData as DbScenario) : null

  // Extract caller messages from script
  const callerMessages = script.scriptData
    .filter(turn => turn.role === 'caller')
    .map(turn => turn.text)

  // Run VAPI text evaluation (or mock)
  let vapiResponse

  if (useVapi && process.env.VAPI_API_KEY) {
    // Use real VAPI
    vapiResponse = await vapiClient.runTextEvaluation({
      systemPrompt: agentConfig.systemPrompt,
      callerMessages
    })
  } else {
    // Use mock VAPI for development
    vapiResponse = await mockVapiTextEval(agentConfig.systemPrompt, callerMessages)
  }

  // Format conversation for evaluation
  const conversation = formatConversation(vapiResponse.turns)

  // Evaluate the conversation with OpenAI
  const evaluation = await evaluateConversation(
    agentConfig,
    conversation,
    scenario?.goal || 'Complete the conversation successfully',
    scenario?.expectedOutcome || 'Agent handles the conversation appropriately'
  )

  // Store test result
  const resultId = nanoid()
  const newResult: Partial<DbTestResult> = {
    id: resultId,
    test_run_id: runId,
    test_script_id: scriptId,
    persona_id: scenario?.personaId || null,
    score: evaluation.overallScore,
    summary: evaluation.summary,
    status: evaluation.status,
    conversation_data: conversation,
    evaluation_data: evaluation
  }

  await supabaseAdmin.from('test_results').insert(newResult)

  return {
    score: evaluation.overallScore,
    status: evaluation.status,
    flaggedTurns: evaluation.flaggedTurns.length
  }
}
