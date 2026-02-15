import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToAgentConfig, dbToPersona } from '@/lib/db-transforms'
import { generateWithStructure } from '@/lib/openai/client'
import {
  getPersonaGenerationSystemPrompt,
  getPersonaGenerationUserPrompt,
  getPersonaDescriptionSystemPrompt,
  getPersonaDescriptionUserPrompt
} from '@/lib/openai/prompts'
import {
  basicPersonasJsonSchema,
  personaDescriptionJsonSchema,
  type BasicPersonasResponse,
  type PersonaDescriptionResponse
} from '@/lib/openai/schemas'
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
    const { mode = 'basic', personas: providedPersonas } = body

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

    // Mode: basic - Generate basic persona info only (name, age, gender, tag)
    if (mode === 'basic') {
      const systemPrompt = getPersonaGenerationSystemPrompt()
      const userPrompt = getPersonaGenerationUserPrompt(agentConfig, 5, agentConfig.targetGroup || undefined)

      const result = await generateWithStructure<BasicPersonasResponse>(
        systemPrompt,
        userPrompt,
        basicPersonasJsonSchema,
        { temperature: 0.8 }
      )

      console.log('Basic personas result:', JSON.stringify(result, null, 2))

      return NextResponse.json<ApiResponse<BasicPersonasResponse>>({
        success: true,
        data: result
      })
    }

    // Mode: full - Generate full personas with descriptions
    if (mode === 'full') {
      if (!providedPersonas || !Array.isArray(providedPersonas)) {
        throw new Error('Personas array is required for full mode')
      }

      // Generate descriptions for each persona
      const personasWithDescriptions = await Promise.all(
        providedPersonas.map(async (p: any) => {
          const systemPrompt = getPersonaDescriptionSystemPrompt()
          const userPrompt = getPersonaDescriptionUserPrompt(agentConfig, p)

          const result = await generateWithStructure<PersonaDescriptionResponse>(
            systemPrompt,
            userPrompt,
            personaDescriptionJsonSchema,
            { temperature: 0.7 }
          )

          return {
            ...p,
            description: result.description,
            profession: result.profession
          }
        })
      )

      // Insert generated personas into database
      const personasToInsert: Partial<DbPersona>[] = personasWithDescriptions.map(p => ({
        id: nanoid(10),
        project_id: projectId,
        name: p.name,
        age: p.age,
        gender: p.gender,
        profession: p.profession,
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
    }

    throw new Error('Invalid mode. Use "basic" or "full"')
  } catch (error) {
    return handleApiError(error)
  }
}
