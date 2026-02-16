import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, badRequest, notFound } from '@/lib/api-error'
import { dbToTestScript, testScriptToDb } from '@/lib/db-transforms'
import type { TestScript, DbTestScript, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// GET /api/projects/[id]/scripts - Get all test scripts for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('test_scripts')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const scripts = (data as DbTestScript[]).map(dbToTestScript)

    return NextResponse.json<ApiResponse<TestScript[]>>({
      success: true,
      data: scripts
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/projects/[id]/scripts - Create a new test script
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()

    const { name, goal, expectedOutcome, scriptData, status, aiGenerated, scenarioId } = body

    if (!name || !goal || !expectedOutcome || !scriptData) {
      throw badRequest('Name, goal, expectedOutcome, and scriptData are required')
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

    const scriptId = nanoid(10)
    const turns = 0 // Discussion guides don't have predetermined turns

    const newScript: Partial<DbTestScript> = {
      id: scriptId,
      project_id: projectId,
      scenario_id: scenarioId || null, // Optional for backward compatibility
      name,
      goal,
      expected_outcome: expectedOutcome,
      turns,
      status: status || 'Approved', // Default to Approved as per requirements
      ai_generated: aiGenerated || false,
      script_data: scriptData
    }

    const { data, error } = await supabaseAdmin
      .from('test_scripts')
      .insert(newScript)
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
