import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, badRequest } from '@/lib/api-error'
import { dbToTestRun } from '@/lib/db-transforms'
import { executeTestRun } from '@/lib/test-execution/runner'
import type { TestRun, DbTestRun, ApiResponse } from '@/types'

// GET /api/projects/[id]/runs - Get all test runs for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('test_runs')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const runs = (data as DbTestRun[]).map(dbToTestRun)

    return NextResponse.json<ApiResponse<TestRun[]>>({
      success: true,
      data: runs
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/projects/[id]/runs - Execute a new test run
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()

    const { scriptIds, useVapi } = body

    if (!scriptIds || !Array.isArray(scriptIds) || scriptIds.length === 0) {
      throw badRequest('scriptIds array is required and must not be empty')
    }

    // Execute the test run
    const result = await executeTestRun({
      projectId,
      scriptIds,
      useVapi: useVapi || false
    })

    // Fetch the created run
    const { data: runData, error: runError } = await supabaseAdmin
      .from('test_runs')
      .select('*')
      .eq('id', result.runId)
      .single()

    if (runError || !runData) {
      throw new Error('Failed to fetch created test run')
    }

    const run = dbToTestRun(runData as DbTestRun)

    return NextResponse.json<ApiResponse<TestRun>>({
      success: true,
      data: run
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
