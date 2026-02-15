"use client"

import { use, useState } from "react"
import { Check, Loader2, Sparkles, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { usePersonas, useDeletePersona } from "@/hooks/use-personas"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { PersonaEditorModal, type BasicPersona } from "@/components/personas/persona-editor-modal"

function getDifficultyColor(d: string) {
  if (d === "Easy") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
  if (d === "Medium") return "bg-amber-500/15 text-amber-500 border-amber-500/20"
  return "bg-red-500/15 text-red-500 border-red-500/20"
}

export default function PersonasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const { data: personas, isLoading } = usePersonas(projectId)
  const deletePersona = useDeletePersona(projectId)
  const queryClient = useQueryClient()
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [basicPersonas, setBasicPersonas] = useState<BasicPersona[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const approvedPersonas = personas?.filter(p => p.approved) || []
  const pendingPersonas = personas?.filter(p => !p.approved) || []

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await apiClient.post<any>(`/projects/${projectId}/personas/generate`, {
        mode: 'basic'
      })

      console.log('Frontend received response:', response)

      // apiClient automatically extracts the 'data' field, so response is directly the data
      if (response?.personas && Array.isArray(response.personas)) {
        console.log('Setting basic personas:', response.personas)
        setBasicPersonas(response.personas)
        setIsModalOpen(true)
      } else {
        console.error('Invalid response format:', response)
        toast.error('Failed to generate personas')
      }
    } catch (error: any) {
      console.error('Error generating personas:', error)
      toast.error(error.message || 'Failed to generate personas')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitPersonas = async (editedPersonas: BasicPersona[]) => {
    setIsSubmitting(true)
    try {
      const response = await apiClient.post<any>(`/projects/${projectId}/personas/generate`, {
        mode: 'full',
        personas: editedPersonas
      })

      // apiClient automatically extracts the 'data' field, so response is directly the data (array of personas)
      if (response && Array.isArray(response)) {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas'] })
        toast.success(`Generated ${response.length} personas successfully`)
        setIsModalOpen(false)
      } else {
        toast.error('Failed to create personas')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create personas')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async (personaId: string) => {
    setApprovingId(personaId)
    try {
      await apiClient.patch(`/projects/${projectId}/personas/${personaId}`, { approved: true })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'personas'] })
      toast.success('Persona approved successfully')
    } catch (error) {
      toast.error('Failed to approve persona')
    } finally {
      setApprovingId(null)
    }
  }

  const handleDelete = async (personaId: string) => {
    if (confirm("Are you sure you want to delete this persona?")) {
      await deletePersona.mutateAsync(personaId)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Caller Personas</h1>
          <p className="text-sm text-muted-foreground">Define who your agent will be tested against</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="pt-5">
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="mb-3 h-12 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Caller Personas</h1>
          <p className="text-sm text-muted-foreground">Define who your agent will be tested against</p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              AI Generate Personas
            </>
          )}
        </Button>
      </div>

      {personas && personas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-muted-foreground">No personas yet. Generate some using AI!</p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Personas"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Approved Personas */}
          {approvedPersonas.map((persona) => (
            <Card key={persona.id} className="border-border bg-card">
              <CardContent className="pt-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{persona.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{persona.description}</p>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={getDifficultyColor(persona.difficulty)}>
                    {persona.difficulty}
                  </Badge>
                  {persona.tag && <Badge variant="secondary" className="text-xs">{persona.tag}</Badge>}
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">
                    <Check className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                  {persona.aiGenerated && (
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-xs text-primary">
                      AI
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
                    onClick={() => handleDelete(persona.id)}
                    disabled={deletePersona.isPending}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pending Personas */}
          {pendingPersonas.map((persona) => (
            <Card key={persona.id} className="border-dashed border-border bg-card opacity-70">
              <CardContent className="pt-5">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-xs text-amber-500">
                    Pending Approval
                  </Badge>
                  {persona.aiGenerated && (
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-xs text-primary">
                      AI Generated
                    </Badge>
                  )}
                </div>
                <p className="mt-2 font-medium text-foreground">{persona.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{persona.description}</p>
                <div className="mb-3 mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={getDifficultyColor(persona.difficulty)}>
                    {persona.difficulty}
                  </Badge>
                  {persona.tag && <Badge variant="secondary" className="text-xs">{persona.tag}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => handleApprove(persona.id)}
                    disabled={approvingId === persona.id}
                  >
                    {approvingId === persona.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={() => handleDelete(persona.id)}
                    disabled={deletePersona.isPending}
                  >
                    <X className="h-3 w-3" /> Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Loading State for Generation */}
          {isSubmitting && (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={`loading-${i}`} className="border-dashed border-border bg-card">
                  <CardContent className="pt-5">
                    <Skeleton className="mb-2 h-5 w-32" />
                    <Skeleton className="mb-3 h-12 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* Persona Editor Modal */}
      <PersonaEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPersonas={basicPersonas}
        onSubmit={handleSubmitPersonas}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
