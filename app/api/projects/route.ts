import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, badRequest } from '@/lib/api-error'
import { dbToProject, projectToDb } from '@/lib/db-transforms'
import type { Project, DbProject, ApiResponse } from '@/types'
import { nanoid } from 'nanoid'

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const projects = (data as DbProject[]).map(dbToProject)

    return NextResponse.json<ApiResponse<Project[]>>({
      success: true,
      data: projects
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, tag } = body

    if (!name || !tag) {
      throw badRequest('Name and tag are required')
    }

    // Generate a unique ID
    const id = nanoid(10)

    // Create project
    const newProject: Partial<DbProject> = {
      id,
      name,
      tag,
      current_version: 'v1',
      tests_run: 0,
      status: 'Active',
      open_issues: 0,
      iterations_completed: 0
    }

    const { data: projectData, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert(newProject)
      .select()
      .single()

    if (projectError) throw projectError

    // Create initial agent config
    const { error: configError } = await supabaseAdmin
      .from('agent_configs')
      .insert({
        project_id: id,
        version: 'v1',
        agent_name: name,
        system_prompt: 'You are a helpful voice assistant.',
        is_current: true
      })

    if (configError) throw configError

    const project = dbToProject(projectData as DbProject)

    return NextResponse.json<ApiResponse<Project>>({
      success: true,
      data: project
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}
