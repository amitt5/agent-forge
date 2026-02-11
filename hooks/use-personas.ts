import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { Persona } from '@/types'
import { toast } from 'sonner'

// Get all personas for a project
export function usePersonas(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'personas'],
    queryFn: () => apiClient.get<Persona[]>(`/projects/${projectId}/personas`),
    enabled: !!projectId
  })
}

// Get single persona
export function usePersona(projectId: string, personaId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'personas', personaId],
    queryFn: () => apiClient.get<Persona>(`/projects/${projectId}/personas/${personaId}`),
    enabled: !!projectId && !!personaId
  })
}

// Generate personas using AI
export function useGeneratePersonas(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { count?: number }) =>
      apiClient.post<Persona[]>(`/projects/${projectId}/personas/generate`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas'] })
      toast.success('Personas generated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate personas')
    }
  })
}

// Create persona manually
export function useCreatePersona(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Persona>) =>
      apiClient.post<Persona>(`/projects/${projectId}/personas`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas'] })
      toast.success('Persona created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create persona')
    }
  })
}

// Update persona
export function useUpdatePersona(projectId: string, personaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Persona>) =>
      apiClient.patch<Persona>(`/projects/${projectId}/personas/${personaId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas', personaId] })
      toast.success('Persona updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update persona')
    }
  })
}

// Delete persona
export function useDeletePersona(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (personaId: string) =>
      apiClient.delete<{ id: string }>(`/projects/${projectId}/personas/${personaId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas'] })
      toast.success('Persona deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete persona')
    }
  })
}
