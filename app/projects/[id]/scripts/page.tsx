"use client"

import { use, useState } from "react"
import { Eye, Sparkles, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTestScripts, useGenerateTestScript, useUpdateTestScript, useDeleteTestScript } from "@/hooks/use-scripts"
import { useScenarios } from "@/hooks/use-scenarios"
import { usePersonas } from "@/hooks/use-personas"
import type { TestScript } from "@/types"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export default function ScriptsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const { data: scripts, isLoading: scriptsLoading } = useTestScripts(projectId)
  const { data: scenarios, isLoading: scenariosLoading } = useScenarios(projectId)
  const { data: personas } = usePersonas(projectId)
  const generateScript = useGenerateTestScript(projectId)
  const deleteScript = useDeleteTestScript(projectId)
  const queryClient = useQueryClient()

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("")
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedScript, setSelectedScript] = useState<TestScript | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const approvedScenarios = scenarios?.filter(s => s.status === 'Approved') || []

  const handleGenerate = async () => {
    if (!selectedScenarioId) {
      toast.error("Please select a scenario first")
      return
    }
    await generateScript.mutateAsync({ scenarioId: selectedScenarioId })
  }

  const handleApprove = async (scriptId: string) => {
    setApprovingId(scriptId)
    try {
      await apiClient.patch(`/projects/${projectId}/scripts/${scriptId}`, { status: 'Approved' })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'scripts'] })
      toast.success('Script approved successfully')
    } catch (error) {
      toast.error('Failed to approve script')
    } finally {
      setApprovingId(null)
    }
  }

  const handleDelete = async (scriptId: string) => {
    if (confirm("Are you sure you want to delete this script?")) {
      await deleteScript.mutateAsync(scriptId)
    }
  }

  const handleViewScript = (script: TestScript) => {
    setSelectedScript(script)
    setViewOpen(true)
  }

  const getScenarioName = (scenarioId: string) => {
    return scenarios?.find(s => s.id === scenarioId)?.name || "Unknown"
  }

  const getPersonaName = (scenarioId: string) => {
    const scenario = scenarios?.find(s => s.id === scenarioId)
    if (!scenario) return "Unknown"
    return personas?.find(p => p.id === scenario.personaId)?.name || "Unknown"
  }

  if (scriptsLoading || scenariosLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Test Scripts</h1>
          <p className="text-sm text-muted-foreground">AI-generated conversation scripts based on your scenarios</p>
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
          <h1 className="text-2xl font-semibold text-foreground">Test Scripts</h1>
          <p className="text-sm text-muted-foreground">AI-generated conversation scripts based on your scenarios</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              {approvedScenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleGenerate}
            disabled={!selectedScenarioId || generateScript.isPending}
          >
            {generateScript.isPending ? (
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

      {scripts && scripts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-muted-foreground">
              No test scripts yet. First approve some scenarios, then generate scripts!
            </p>
            {approvedScenarios.length === 0 && (
              <p className="text-xs text-muted-foreground">
                (You need approved scenarios first)
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
                  <TableHead className="text-muted-foreground">Script Name</TableHead>
                  <TableHead className="text-muted-foreground">Scenario</TableHead>
                  <TableHead className="text-muted-foreground">Persona</TableHead>
                  <TableHead className="text-muted-foreground">Turns</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scripts?.map((script) => (
                  <TableRow key={script.id} className={`border-border ${script.status === "Pending" ? "opacity-60" : ""}`}>
                    <TableCell className="text-sm font-medium text-foreground">{script.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getScenarioName(script.scenarioId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getPersonaName(script.scenarioId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{script.turns}</TableCell>
                    <TableCell>
                      {script.status === "Approved" ? (
                        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Approved</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Pending</Badge>
                      )}
                      {script.aiGenerated && (
                        <Badge variant="outline" className="ml-2 border-primary/20 bg-primary/10 text-xs text-primary">
                          AI
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs text-muted-foreground"
                          onClick={() => handleViewScript(script)}
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                        {script.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={() => handleApprove(script.id)}
                            disabled={approvingId === script.id}
                          >
                            {approvingId === script.id ? (
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
                          onClick={() => handleDelete(script.id)}
                          disabled={deleteScript.isPending}
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

      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent className="w-full border-border bg-card sm:max-w-lg">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-foreground">{selectedScript?.name || "Script"}</SheetTitle>
            <SheetDescription>
              {selectedScript && `${getScenarioName(selectedScript.scenarioId)} - ${getPersonaName(selectedScript.scenarioId)} - ${selectedScript.turns} turns`}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <div className="flex flex-col gap-3 pb-8">
              {selectedScript?.scriptData.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "agent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
                      msg.role === "agent"
                        ? "bg-primary/15 text-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {msg.role === "agent" ? "Agent" : "Caller"}
                    </p>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
