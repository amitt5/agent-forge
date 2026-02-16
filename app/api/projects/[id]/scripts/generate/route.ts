import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound, badRequest } from '@/lib/api-error'
import { dbToAgentConfig, dbToPersona, dbToScenario, dbToTestScript } from '@/lib/db-transforms'
import { generateWithStructure } from '@/lib/openai/client'
import {
  getDiscussionGuideGenerationSystemPrompt,
  getDiscussionGuideGenerationUserPrompt
} from '@/lib/openai/prompts'
import { discussionGuideJsonSchema, type DiscussionGuideResponse } from '@/lib/openai/schemas'
import type { AgentConfig, DbAgentConfig, Persona, DbPersona, Scenario, DbScenario, TestScript, DbTestScript, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// POST /api/projects/[id]/scripts/generate - Generate test script using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const { scenario, goal, expectedOutcome } = body

    if (!scenario || !goal || !expectedOutcome) {
      throw badRequest('scenario, goal, and expectedOutcome are required')
    }

    // Get current agent config
    const { data: configData, error: configError } = await supabaseAdmin
      .from('agent_configs')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_current', true)
      .single()

    if (configError || !configData) {
      throw notFound('Agent configuration')
    }

    const agentConfig = dbToAgentConfig(configData as DbAgentConfig)

    // Generate discussion guide using OpenAI (persona-agnostic)
    const systemPrompt = getDiscussionGuideGenerationSystemPrompt()
    const userPrompt = `Generate a discussion guide for testing an AI agent.

Agent Configuration:
- Agent Name: ${agentConfig.agentName}
- Agent Type: ${agentConfig.agentType || 'General purpose'}
- Primary Goal: ${agentConfig.primaryGoal || 'Not specified'}
- Tone: ${agentConfig.tonePersonality || 'Professional'}

Test Case Details:
- Scenario: ${scenario}
- Goal: ${goal}
- Expected Outcome: ${expectedOutcome}

Create a discussion guide that will help test the agent's ability to handle this scenario.`

    const result = await generateWithStructure<DiscussionGuideResponse>(
      systemPrompt,
      userPrompt,
      discussionGuideJsonSchema,
      { temperature: 0.7 }
    )

    // Insert generated discussion guide into database
    const scriptToInsert: Partial<DbTestScript> = {
      id: nanoid(10),
      project_id: projectId,
      scenario_id: null, // No longer tied to a scenario
      name: scenario, // Use the scenario description as the name
      goal,
      expected_outcome: expectedOutcome,
      turns: 0, // Discussion guides don't have predetermined turns
      status: 'Approved', // Auto-approve as per requirements
      ai_generated: true,
      script_data: result.guide as any // Store the discussion guide structure
    }

    const { data, error } = await supabaseAdmin
      .from('test_scripts')
      .insert(scriptToInsert)
      .select()
      .single()

    if (error) throw error

    const script = dbToTestScript(data as DbTestScript)

    return NextResponse.json<ApiResponse<TestScript>>({
      success: true,
      data: script
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
