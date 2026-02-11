import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToPersona, personaToDb } from '@/lib/db-transforms'
import type { Persona, DbPersona, ApiResponse } from '@/types'

// GET /api/projects/[id]/personas/[personaId] - Get a single persona
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; personaId: string }> }
) {
  try {
    const { personaId } = await params

    const { data, error } = await supabaseAdmin
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .single()

    if (error || !data) {
      throw notFound('Persona')
    }

    const persona = dbToPersona(data as DbPersona)

    return NextResponse.json<ApiResponse<Persona>>({
      success: true,
      data: persona
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/projects/[id]/personas/[personaId] - Update a persona
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; personaId: string }> }
) {
  try {
    const { personaId } = await params
    const body = await request.json()

    const updates = personaToDb(body)

    const { data, error } = await supabaseAdmin
      .from('personas')
      .update(updates)
      .eq('id', personaId)
      .select()
      .single()

    if (error || !data) {
      throw notFound('Persona')
    }

    const persona = dbToPersona(data as DbPersona)

    return NextResponse.json<ApiResponse<Persona>>({
      success: true,
      data: persona
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/projects/[id]/personas/[personaId] - Delete a persona
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; personaId: string }> }
) {
  try {
    const { personaId } = await params

    const { error } = await supabaseAdmin
      .from('personas')
      .delete()
      .eq('id', personaId)

    if (error) throw error

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: personaId }
    })
  } catch (error) {
    return handleApiError(error)
  }
}
