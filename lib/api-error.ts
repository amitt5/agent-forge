import { NextResponse } from 'next/server'
import type { ApiError } from '@/types'

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiException'
  }
}

export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error)

  if (error instanceof ApiException) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      }
    },
    { status: 500 }
  )
}

// Common error factories
export const notFound = (resource: string) =>
  new ApiException(404, 'NOT_FOUND', `${resource} not found`)

export const badRequest = (message: string, details?: any) =>
  new ApiException(400, 'BAD_REQUEST', message, details)

export const unauthorized = (message = 'Unauthorized') =>
  new ApiException(401, 'UNAUTHORIZED', message)

export const forbidden = (message = 'Forbidden') =>
  new ApiException(403, 'FORBIDDEN', message)

export const conflict = (message: string) =>
  new ApiException(409, 'CONFLICT', message)

export const internalError = (message = 'Internal server error') =>
  new ApiException(500, 'INTERNAL_ERROR', message)
