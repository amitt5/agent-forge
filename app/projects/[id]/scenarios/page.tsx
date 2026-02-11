"use client"

import { use, useState } from "react"
import { Sparkles, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useScenarios, useGenerateScenarios, useUpdateScenario, useDeleteScenario } from "@/hooks/use-scenarios"
import { usePersonas } from "@/hooks/use-personas"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

function getDifficultyColor(d: string) {
  if (d === "Easy") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
  if (d === "Medium") return "bg-amber-500/15 text-amber-500 border-amber-500/20"
  return "bg-red-500/15 text-red-500 border-red-500/20"
}

export default function ScenariosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const { data: scenarios, isLoading: scenariosLoading } = useScenarios(projectId)
  const { data: personas, isLoading: personasLoading } = usePersonas(projectId)
  const generateScenarios = useGenerateScenarios(projectId)
  const deleteScenario = useDeleteScenario(projectId)
  const queryClient = useQueryClient()

  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("")
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const approvedPersonas = personas?.filter(p => p.approved) || []

  const handleGenerate = async () => {
    if (!selectedPersonaId) {
      toast.error("Please select a persona first")
      return
    }
    await generateScenarios.mutateAsync({ personaId: selectedPersonaId, count: 3 })
  }

  const handleApprove = async (scenarioId: string) => {
    setApprovingId(scenarioId)
    try {
      await apiClient.patch(`/projects/${projectId}/scenarios/${scenarioId}`, { status: 'Approved' })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scenarios'] })
      toast.success('Scenario approved successfully')
    } catch (error) {
      toast.error('Failed to approve scenario')
    } finally {
      setApprovingId(null)
    }
  }

  const handleDelete = async (scenarioId: string) => {
    if (confirm("Are you sure you want to delete this scenario?")) {
      await deleteScenario.mutateAsync(scenarioId)
    }
  }

  const getPersonaName = (personaId: string) => {
    return personas?.find(p => p.id === personaId)?.name || "Unknown"
  }

  if (scenariosLoading || personasLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Test Scenarios</h1>
          <p className="text-sm text-muted-foreground">Define test scenarios pairing personas with specific goals</p>
        </div>
        <Card className="bg-card">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Scenarios</h1>
          <p className="text-sm text-muted-foreground">Define test scenarios pairing personas with specific goals</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select persona" />
            </SelectTrigger>
            <SelectContent>
              {approvedPersonas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleGenerate}
            disabled={!selectedPersonaId || generateScenarios.isPending}
          >
            {generateScenarios.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {scenarios && scenarios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-muted-foreground">
              No scenarios yet. First approve some personas, then generate scenarios!
            </p>
            {approvedPersonas.length === 0 && (
              <p className="text-xs text-muted-foreground">
                (You need approved personas first)
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Scenario</TableHead>
                  <TableHead className="text-muted-foreground">Persona</TableHead>
                  <TableHead className="text-muted-foreground">Difficulty</TableHead>
                  <TableHead className="hidden text-muted-foreground lg:table-cell">Goal</TableHead>
                  <TableHead className="hidden text-muted-foreground xl:table-cell">Expected Outcome</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios?.map((scenario) => (
                  <TableRow key={scenario.id} className={`border-border ${scenario.status === "Pending" ? "opacity-60" : ""}`}>
                    <TableCell className="text-sm font-medium text-foreground">{scenario.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getPersonaName(scenario.personaId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getDifficultyColor(scenario.difficulty)}>{scenario.difficulty}</Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-48 text-sm text-muted-foreground lg:table-cell">{scenario.goal}</TableCell>
                    <TableCell className="hidden max-w-48 text-sm text-muted-foreground xl:table-cell">{scenario.expectedOutcome}</TableCell>
                    <TableCell>
                      {scenario.status === "Approved" ? (
                        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Approved</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Pending</Badge>
                      )}
                      {scenario.aiGenerated && (
                        <Badge variant="outline" className="ml-2 border-primary/20 bg-primary/10 text-xs text-primary">
                          AI
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {scenario.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={() => handleApprove(scenario.id)}
                            disabled={approvingId === scenario.id}
                          >
                            {approvingId === scenario.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(scenario.id)}
                          disabled={deleteScenario.isPending}
                        >
                          <X className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
