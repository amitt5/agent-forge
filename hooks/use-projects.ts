import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { Project, AgentConfig } from '@/types'
import { toast } from 'sonner'

// Get all projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get<Project[]>('/projects')
  })
}

// Get single project
export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => apiClient.get<Project>(`/projects/${id}`),
    enabled: !!id
  })
}

// Get project config
export function useProjectConfig(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'config'],
    queryFn: () => apiClient.get<AgentConfig>(`/projects/${projectId}/config`),
    enabled: !!projectId
  })
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; tag: string }) =>
      apiClient.post<Project>('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project')
    }
  })
}

// Update project
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Project>) =>
      apiClient.patch<Project>(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', id] })
      toast.success('Project updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project')
    }
  })
}

// Update project config
export function useUpdateProjectConfig(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<AgentConfig>) =>
      apiClient.patch<AgentConfig>(`/projects/${projectId}/config`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'config'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      toast.success('Configuration updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update configuration')
    }
  })
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<{ id: string }>(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project')
    }
  })
}
