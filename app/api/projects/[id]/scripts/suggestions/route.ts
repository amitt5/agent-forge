import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToAgentConfig } from '@/lib/db-transforms'
import { generateWithStructure } from '@/lib/openai/client'
import type { AgentConfig, DbAgentConfig, ApiResponse } from '@/types'

interface TestCaseSuggestions {
  scenario: string
  goal: string
  expectedOutcome: string
}

// POST /api/projects/[id]/scripts/suggestions - Generate suggestions for test case creation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

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

    // Generate suggestions using OpenAI
    const systemPrompt = `You are an AI testing expert. Generate a realistic test case scenario for an AI agent based on the agent's configuration.`

    const userPrompt = `Generate a test case scenario for this AI agent:

Agent Name: ${agentConfig.agentName}
Agent Type: ${agentConfig.agentType || 'General purpose'}
Primary Goal: ${agentConfig.primaryGoal || 'Not specified'}
Target Group: ${agentConfig.targetGroup || 'General users'}

Please generate:
1. A brief scenario description (1-2 sentences describing the test situation)
2. A specific goal for this test (what the caller is trying to achieve)
3. The expected outcome (what should happen if the agent handles it correctly)

Make it realistic and relevant to the agent's purpose.`

    const result = await generateWithStructure<TestCaseSuggestions>(
      systemPrompt,
      userPrompt,
      {
        type: 'object',
        properties: {
          scenario: {
            type: 'string',
            description: 'Brief scenario description (1-2 sentences)'
          },
          goal: {
            type: 'string',
            description: 'Specific goal the caller is trying to achieve'
          },
          expectedOutcome: {
            type: 'string',
            description: 'Expected outcome if agent handles correctly'
          }
        },
        required: ['scenario', 'goal', 'expectedOutcome'],
        additionalProperties: false
      },
      { temperature: 0.8, model: 'gpt-4o-mini' }
    )

    return NextResponse.json<ApiResponse<TestCaseSuggestions>>({
      success: true,
      data: result
    })
  } catch (error) {
    return handleApiError(error)
  }
}
