import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToTestResult } from '@/lib/db-transforms'
import type { TestResult, DbTestResult, ApiResponse } from '@/types'

// GET /api/projects/[id]/runs/[runId]/results/[resultId] - Get a single test result
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; runId: string; resultId: string }> }
) {
  try {
    const { resultId } = await params

    const { data, error } = await supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('id', resultId)
      .single()

    if (error || !data) {
      throw notFound('Test result')
    }

    const result = dbToTestResult(data as DbTestResult)

    return NextResponse.json<ApiResponse<TestResult>>({
      success: true,
      data: result
    })
  } catch (error) {
    return handleApiError(error)
  }
}
