import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { Scenario } from '@/types'
import { toast } from 'sonner'

// Get all scenarios for a project
export function useScenarios(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'scenarios'],
    queryFn: () => apiClient.get<Scenario[]>(`/projects/${projectId}/scenarios`),
    enabled: !!projectId
  })
}

// Get single scenario
export function useScenario(projectId: string, scenarioId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'scenarios', scenarioId],
    queryFn: () => apiClient.get<Scenario>(`/projects/${projectId}/scenarios/${scenarioId}`),
    enabled: !!projectId && !!scenarioId
  })
}

// Generate scenarios using AI
export function useGenerateScenarios(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { personaId: string; count?: number }) =>
      apiClient.post<Scenario[]>(`/projects/${projectId}/scenarios/generate`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scenarios'] })
      toast.success('Scenarios generated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate scenarios')
    }
  })
}

// Create scenario manually
export function useCreateScenario(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Scenario>) =>
      apiClient.post<Scenario>(`/projects/${projectId}/scenarios`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scenarios'] })
      toast.success('Scenario created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create scenario')
    }
  })
}

// Update scenario
export function useUpdateScenario(projectId: string, scenarioId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Scenario>) =>
      apiClient.patch<Scenario>(`/projects/${projectId}/scenarios/${scenarioId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scenarios'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scenarios', scenarioId] })
      toast.success('Scenario updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update scenario')
    }
  })
}

// Delete scenario
export function useDeleteScenario(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scenarioId: string) =>
      apiClient.delete<{ id: string }>(`/projects/${projectId}/scenarios/${scenarioId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scenarios'] })
      toast.success('Scenario deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete scenario')
    }
  })
}
