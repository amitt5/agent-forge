import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { TestRun, TestResult } from '@/types'
import { toast } from 'sonner'

// Get all test runs for a project
export function useTestRuns(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'runs'],
    queryFn: () => apiClient.get<TestRun[]>(`/projects/${projectId}/runs`),
    enabled: !!projectId
  })
}

// Get single test run
export function useTestRun(projectId: string, runId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'runs', runId],
    queryFn: () => apiClient.get<TestRun>(`/projects/${projectId}/runs/${runId}`),
    enabled: !!projectId && !!runId
  })
}

// Get results for a test run
export function useTestResults(projectId: string, runId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'runs', runId, 'results'],
    queryFn: () => apiClient.get<TestResult[]>(`/projects/${projectId}/runs/${runId}/results`),
    enabled: !!projectId && !!runId
  })
}

// Get single test result
export function useTestResult(projectId: string, runId: string, resultId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'runs', runId, 'results', resultId],
    queryFn: () => apiClient.get<TestResult>(`/projects/${projectId}/runs/${runId}/results/${resultId}`),
    enabled: !!projectId && !!runId && !!resultId
  })
}

// Execute a new test run
export function useExecuteTestRun(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { scriptIds: string[]; useVapi?: boolean }) =>
      apiClient.post<TestRun>(`/projects/${projectId}/runs`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'runs'] })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      toast.success('Test run completed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to execute test run')
    }
  })
}
