import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound, badRequest } from '@/lib/api-error'
import { dbToAgentConfig, dbToPersona, dbToScenario } from '@/lib/db-transforms'
import { generateWithStructure } from '@/lib/openai/client'
import {
  getScenarioGenerationSystemPrompt,
  getScenarioGenerationUserPrompt
} from '@/lib/openai/prompts'
import { scenariosJsonSchema, type ScenariosResponse } from '@/lib/openai/schemas'
import type { AgentConfig, DbAgentConfig, Persona, DbPersona, Scenario, DbScenario, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// POST /api/projects/[id]/scenarios/generate - Generate scenarios using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const { personaId, count = 3 } = body

    if (!personaId) {
      throw badRequest('personaId is required')
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

    // Get persona
    const { data: personaData, error: personaError } = await supabaseAdmin
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .eq('project_id', projectId)
      .single()

    if (personaError || !personaData) {
      throw notFound('Persona')
    }

    const persona = dbToPersona(personaData as DbPersona)

    // Generate scenarios using OpenAI
    const systemPrompt = getScenarioGenerationSystemPrompt()
    const userPrompt = getScenarioGenerationUserPrompt(
      agentConfig,
      persona.name,
      persona.description,
      persona.difficulty,
      count
    )

    const result = await generateWithStructure<ScenariosResponse>(
      systemPrompt,
      userPrompt,
      scenariosJsonSchema,
      { temperature: 0.8 }
    )

    // Insert generated scenarios into database
    const scenariosToInsert: Partial<DbScenario>[] = result.scenarios.map(s => ({
      id: nanoid(10),
      project_id: projectId,
      name: s.name,
      persona_id: personaId,
      difficulty: s.difficulty,
      goal: s.goal,
      expected_outcome: s.expectedOutcome,
      status: 'Pending',
      ai_generated: true
    }))

    const { data, error } = await supabaseAdmin
      .from('scenarios')
      .insert(scenariosToInsert)
      .select()

    if (error) throw error

    const scenarios = (data as DbScenario[]).map(dbToScenario)

    return NextResponse.json<ApiResponse<Scenario[]>>({
      success: true,
      data: scenarios
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
