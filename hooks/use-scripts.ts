import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { TestScript } from '@/types'
import { toast } from 'sonner'

// Get all test scripts for a project
export function useTestScripts(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'scripts'],
    queryFn: () => apiClient.get<TestScript[]>(`/projects/${projectId}/scripts`),
    enabled: !!projectId
  })
}

// Get single test script
export function useTestScript(projectId: string, scriptId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'scripts', scriptId],
    queryFn: () => apiClient.get<TestScript>(`/projects/${projectId}/scripts/${scriptId}`),
    enabled: !!projectId && !!scriptId
  })
}

// Generate test script using AI
export function useGenerateTestScript(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { scenarioId: string }) =>
      apiClient.post<TestScript>(`/projects/${projectId}/scripts/generate`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scripts'] })
      toast.success('Test script generated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate test script')
    }
  })
}

// Create test script manually
export function useCreateTestScript(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<TestScript>) =>
      apiClient.post<TestScript>(`/projects/${projectId}/scripts`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scripts'] })
      toast.success('Test script created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create test script')
    }
  })
}

// Update test script
export function useUpdateTestScript(projectId: string, scriptId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<TestScript>) =>
      apiClient.patch<TestScript>(`/projects/${projectId}/scripts/${scriptId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scripts'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scripts', scriptId] })
      toast.success('Test script updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update test script')
    }
  })
}

// Delete test script
export function useDeleteTestScript(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scriptId: string) =>
      apiClient.delete<{ id: string }>(`/projects/${projectId}/scripts/${scriptId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scripts'] })
      toast.success('Test script deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete test script')
    }
  })
}
