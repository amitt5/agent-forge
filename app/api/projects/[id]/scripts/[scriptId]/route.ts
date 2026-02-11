import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToTestScript, testScriptToDb } from '@/lib/db-transforms'
import type { TestScript, DbTestScript, ApiResponse } from '@/types'

// GET /api/projects/[id]/scripts/[scriptId] - Get a single test script
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scriptId: string }> }
) {
  try {
    const { scriptId } = await params

    const { data, error } = await supabaseAdmin
      .from('test_scripts')
      .select('*')
      .eq('id', scriptId)
      .single()

    if (error || !data) {
      throw notFound('Test script')
    }

    const script = dbToTestScript(data as DbTestScript)

    return NextResponse.json<ApiResponse<TestScript>>({
      success: true,
      data: script
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/projects/[id]/scripts/[scriptId] - Update a test script
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scriptId: string }> }
) {
  try {
    const { scriptId } = await params
    const body = await request.json()

    const updates = testScriptToDb(body)

    // Update turns count if scriptData is being updated
    if (body.scriptData) {
      updates.turns = body.scriptData.length
    }

    const { data, error } = await supabaseAdmin
      .from('test_scripts')
      .update(updates)
      .eq('id', scriptId)
      .select()
      .single()

    if (error || !data) {
      throw notFound('Test script')
    }

    const script = dbToTestScript(data as DbTestScript)

    return NextResponse.json<ApiResponse<TestScript>>({
      success: true,
      data: script
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/projects/[id]/scripts/[scriptId] - Delete a test script
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; scriptId: string }> }
) {
  try {
    const { scriptId } = await params

    const { error } = await supabaseAdmin
      .from('test_scripts')
      .delete()
      .eq('id', scriptId)

    if (error) throw error

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: scriptId }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
