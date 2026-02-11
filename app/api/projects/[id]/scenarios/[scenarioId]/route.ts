import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToScenario, scenarioToDb } from '@/lib/db-transforms'
import type { Scenario, DbScenario, ApiResponse } from '@/types'

// GET /api/projects/[id]/scenarios/[scenarioId] - Get a single scenario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scenarioId: string }> }
) {
  try {
    const { scenarioId } = await params

    const { data, error } = await supabaseAdmin
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single()

    if (error || !data) {
      throw notFound('Scenario')
    }

    const scenario = dbToScenario(data as DbScenario)

    return NextResponse.json<ApiResponse<Scenario>>({
      success: true,
      data: scenario
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/projects/[id]/scenarios/[scenarioId] - Update a scenario
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scenarioId: string }> }
) {
  try {
    const { scenarioId } = await params
    const body = await request.json()

    const updates = scenarioToDb(body)

    const { data, error } = await supabaseAdmin
      .from('scenarios')
      .update(updates)
      .eq('id', scenarioId)
      .select()
      .single()

    if (error || !data) {
      throw notFound('Scenario')
    }

    const scenario = dbToScenario(data as DbScenario)

    return NextResponse.json<ApiResponse<Scenario>>({
      success: true,
      data: scenario
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/projects/[id]/scenarios/[scenarioId] - Delete a scenario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scenarioId: string }> }
) {
  try {
    const { scenarioId } = await params

    const { error } = await supabaseAdmin
      .from('scenarios')
      .delete()
      .eq('id', scenarioId)

    if (error) throw error

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: scenarioId }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
