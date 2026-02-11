import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError } from '@/lib/api-error'
import { dbToTestResult } from '@/lib/db-transforms'
import type { TestResult, DbTestResult, ApiResponse } from '@/types'

// GET /api/projects/[id]/runs/[runId]/results - Get all results for a test run
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; runId: string }> }
) {
  try {
    const { runId } = await params

    const { data, error } = await supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('test_run_id', runId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const results = (data as DbTestResult[]).map(dbToTestResult)

    return NextResponse.json<ApiResponse<TestResult[]>>({
      success: true,
      data: results
    })
  } catch (error) {
    return handleApiError(error)
  }
}
