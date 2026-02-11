import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToTestRun } from '@/lib/db-transforms'
import type { TestRun, DbTestRun, ApiResponse } from '@/types'

// GET /api/projects/[id]/runs/[runId] - Get a single test run
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; runId: string }> }
) {
  try {
    const { runId } = await params

    const { data, error } = await supabaseAdmin
      .from('test_runs')
      .select('*')
      .eq('id', runId)
      .single()

    if (error || !data) {
      throw notFound('Test run')
    }

    const run = dbToTestRun(data as DbTestRun)

    return NextResponse.json<ApiResponse<TestRun>>({
      success: true,
      data: run
    })
  } catch (error) {
    return handleApiError(error)
  }
}
