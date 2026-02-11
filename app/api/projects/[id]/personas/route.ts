import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, badRequest, notFound } from '@/lib/api-error'
import { dbToPersona, personaToDb } from '@/lib/db-transforms'
import type { Persona, DbPersona, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// GET /api/projects/[id]/personas - Get all personas for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('personas')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const personas = (data as DbPersona[]).map(dbToPersona)

    return NextResponse.json<ApiResponse<Persona[]>>({
      success: true,
      data: personas
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/projects/[id]/personas - Create a new persona
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()

    const { name, description, difficulty, tag, approved, aiGenerated } = body

    if (!name || !description || !difficulty) {
      throw badRequest('Name, description, and difficulty are required')
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      throw notFound('Project')
    }

    const personaId = nanoid(10)

    const newPersona: Partial<DbPersona> = {
      id: personaId,
      project_id: projectId,
      name,
      description,
      difficulty,
      tag: tag || null,
      approved: approved || false,
      ai_generated: aiGenerated || false
    }

    const { data, error } = await supabaseAdmin
      .from('personas')
      .insert(newPersona)
      .select()
      .single()

    if (error) throw error

    const persona = dbToPersona(data as DbPersona)

    return NextResponse.json<ApiResponse<Persona>>({
      success: true,
      data: persona
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
