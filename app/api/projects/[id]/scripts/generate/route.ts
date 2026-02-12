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
    const { scenarioId } = body

    if (!scenarioId) {
      throw badRequest('scenarioId is required')
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

    // Get scenario
    const { data: scenarioData, error: scenarioError } = await supabaseAdmin
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .eq('project_id', projectId)
      .single()

    if (scenarioError || !scenarioData) {
      throw notFound('Scenario')
    }

    const scenario = dbToScenario(scenarioData as DbScenario)

    // Get persona
    const { data: personaData, error: personaError } = await supabaseAdmin
      .from('personas')
      .select('*')
      .eq('id', scenario.personaId)
      .single()

    if (personaError || !personaData) {
      throw notFound('Persona')
    }

    const persona = dbToPersona(personaData as DbPersona)

    // Generate discussion guide using OpenAI
    const systemPrompt = getDiscussionGuideGenerationSystemPrompt()
    const userPrompt = getDiscussionGuideGenerationUserPrompt(
      agentConfig,
      persona.name,
      persona.description,
      persona.difficulty,
      scenario.goal,
      scenario.expectedOutcome
    )

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
      scenario_id: scenarioId,
      name: result.guide.name,
      turns: 0, // Discussion guides don't have predetermined turns
      status: 'Pending',
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
