import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToAgentConfig, dbToPersona } from '@/lib/db-transforms'
import { generateWithStructure } from '@/lib/openai/client'
import {
  getPersonaGenerationSystemPrompt,
  getPersonaGenerationUserPrompt
} from '@/lib/openai/prompts'
import { personasJsonSchema, type PersonasResponse } from '@/lib/openai/schemas'
import type { AgentConfig, DbAgentConfig, Persona, DbPersona, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// POST /api/projects/[id]/personas/generate - Generate personas using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const { count = 3 } = body

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

    // Generate personas using OpenAI
    const systemPrompt = getPersonaGenerationSystemPrompt()
    const userPrompt = getPersonaGenerationUserPrompt(agentConfig, count)

    const result = await generateWithStructure<PersonasResponse>(
      systemPrompt,
      userPrompt,
      personasJsonSchema,
      { temperature: 0.8 }
    )

    // Insert generated personas into database
    const personasToInsert: Partial<DbPersona>[] = result.personas.map(p => ({
      id: nanoid(10),
      project_id: projectId,
      name: p.name,
      description: p.description,
      difficulty: p.difficulty,
      tag: p.tag,
      approved: false,
      ai_generated: true
    }))

    const { data, error } = await supabaseAdmin
      .from('personas')
      .insert(personasToInsert)
      .select()

    if (error) throw error

    const personas = (data as DbPersona[]).map(dbToPersona)

    return NextResponse.json<ApiResponse<Persona[]>>({
      success: true,
      data: personas
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
