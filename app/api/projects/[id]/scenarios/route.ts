import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, badRequest, notFound } from '@/lib/api-error'
import { dbToScenario, scenarioToDb } from '@/lib/db-transforms'
import type { Scenario, DbScenario, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// GET /api/projects/[id]/scenarios - Get all scenarios for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('scenarios')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const scenarios = (data as DbScenario[]).map(dbToScenario)

    return NextResponse.json<ApiResponse<Scenario[]>>({
      success: true,
      data: scenarios
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/projects/[id]/scenarios - Create a new scenario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()

    const { name, personaId, difficulty, goal, expectedOutcome, status, aiGenerated } = body

    if (!name || !personaId || !difficulty || !goal || !expectedOutcome) {
      throw badRequest('Name, personaId, difficulty, goal, and expectedOutcome are required')
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

    // Verify persona exists and belongs to project
    const { data: persona, error: personaError } = await supabaseAdmin
      .from('personas')
      .select('id')
      .eq('id', personaId)
      .eq('project_id', projectId)
      .single()

    if (personaError || !persona) {
      throw notFound('Persona')
    }

    const scenarioId = nanoid(10)

    const newScenario: Partial<DbScenario> = {
      id: scenarioId,
      project_id: projectId,
      name,
      persona_id: personaId,
      difficulty,
      goal,
      expected_outcome: expectedOutcome,
      status: status || 'Pending',
      ai_generated: aiGenerated || false
    }

    const { data, error } = await supabaseAdmin
      .from('scenarios')
      .insert(newScenario)
      .select()
      .single()

    if (error) throw error

    const scenario = dbToScenario(data as DbScenario)

    return NextResponse.json<ApiResponse<Scenario>>({
      success: true,
      data: scenario
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
