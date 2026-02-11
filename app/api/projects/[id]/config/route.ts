import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { handleApiError, notFound } from '@/lib/api-error'
import { dbToAgentConfig, agentConfigToDb } from '@/lib/db-transforms'
import type { AgentConfig, DbAgentConfig, ApiResponse } from '@/types'

// GET /api/projects/[id]/config - Get current agent config
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('agent_configs')
      .select('*')
      .eq('project_id', id)
      .eq('is_current', true)
      .single()

    if (error || !data) {
      throw notFound('Agent configuration')
    }

    const config = dbToAgentConfig(data as DbAgentConfig)

    return NextResponse.json<ApiResponse<AgentConfig>>({
      success: true,
      data: config
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/projects/[id]/config - Update agent config
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Get current config
    const { data: currentConfig, error: currentError } = await supabaseAdmin
      .from('agent_configs')
      .select('*')
      .eq('project_id', id)
      .eq('is_current', true)
      .single()

    if (currentError || !currentConfig) {
      throw notFound('Agent configuration')
    }

    // Check if this is a version change (creates new config)
    const isVersionChange = body.version && body.version !== currentConfig.version

    if (isVersionChange) {
      // Mark current config as not current
      await supabaseAdmin
        .from('agent_configs')
        .update({ is_current: false })
        .eq('id', currentConfig.id)

      // Create new config version
      const newConfig = agentConfigToDb({
        projectId: id,
        version: body.version,
        agentName: body.agentName || currentConfig.agent_name,
        agentType: body.agentType !== undefined ? body.agentType : currentConfig.agent_type,
        primaryGoal: body.primaryGoal !== undefined ? body.primaryGoal : currentConfig.primary_goal,
        tonePersonality: body.tonePersonality !== undefined ? body.tonePersonality : currentConfig.tone_personality,
        mustNeverDo: body.mustNeverDo !== undefined ? body.mustNeverDo : currentConfig.must_never_do,
        systemPrompt: body.systemPrompt || currentConfig.system_prompt,
        isCurrent: true
      })

      const { data: newConfigData, error: newConfigError } = await supabaseAdmin
        .from('agent_configs')
        .insert(newConfig)
        .select()
        .single()

      if (newConfigError) throw newConfigError

      // Update project version
      await supabaseAdmin
        .from('projects')
        .update({
          current_version: body.version,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      const config = dbToAgentConfig(newConfigData as DbAgentConfig)

      return NextResponse.json<ApiResponse<AgentConfig>>({
        success: true,
        data: config
      })
    } else {
      // Update existing config
      const updates = agentConfigToDb(body)

      const { data, error } = await supabaseAdmin
        .from('agent_configs')
        .update(updates)
        .eq('id', currentConfig.id)
        .select()
        .single()

      if (error) throw error

      // Update project timestamp
      await supabaseAdmin
        .from('projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)

      const config = dbToAgentConfig(data as DbAgentConfig)

      return NextResponse.json<ApiResponse<AgentConfig>>({
        success: true,
        data: config
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
}
