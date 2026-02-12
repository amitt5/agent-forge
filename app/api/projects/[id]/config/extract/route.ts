import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, badRequest } from '@/lib/api-error'
import { extractConfigFromPrompt } from '@/lib/openai/extract-config'
import type { ApiResponse } from '@/types'

// POST /api/projects/[id]/config/extract - Extract config from system prompt using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { systemPrompt } = body

    if (!systemPrompt || typeof systemPrompt !== 'string') {
      throw badRequest('systemPrompt is required')
    }

    const extracted = await extractConfigFromPrompt(systemPrompt)

    return NextResponse.json<ApiResponse<typeof extracted>>({
      success: true,
      data: extracted
    })
  } catch (error) {
    return handleApiError(error)
  }
}
