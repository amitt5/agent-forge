import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToProject, projectToDb } from '@/lib/db-transforms'
import type { Project, DbProject, ApiResponse } from '@/types'

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw notFound('Project')
    }

    const project = dbToProject(data as DbProject)

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: project
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Convert camelCase to snake_case
    const updates = projectToDb(body)

    // Add updated_at timestamp
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updatesWithTimestamp)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      throw notFound('Project')
    }

    const project = dbToProject(data as DbProject)

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: project
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
