"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Play, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useTestRuns, useTestResults, useExecuteTestRun } from "@/hooks/use-test-runs"
import { useTestScripts } from "@/hooks/use-scripts"
import { usePersonas } from "@/hooks/use-personas"
import { useScenarios } from "@/hooks/use-scenarios"

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-500"
  if (score >= 6) return "text-amber-500"
  return "text-red-500"
}

export default function TestRunsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const { data: runs, isLoading: runsLoading } = useTestRuns(projectId)
  const { data: scripts } = useTestScripts(projectId)
  const { data: personas } = usePersonas(projectId)
  const { data: scenarios } = useScenarios(projectId)
  const executeTestRun = useExecuteTestRun(projectId)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedScriptIds, setSelectedScriptIds] = useState<string[]>([])

  const latestRun = runs && runs.length > 0 ? runs[0] : null
  const { data: latestResults } = useTestResults(projectId, latestRun?.id || '')

  const approvedScripts = scripts?.filter(s => s.status === 'Approved') || []

  const handleToggleScript = (scriptId: string) => {
    setSelectedScriptIds(prev =>
      prev.includes(scriptId)
        ? prev.filter(id => id !== scriptId)
        : [...prev, scriptId]
    )
  }

  const handleStartRun = async () => {
    if (selectedScriptIds.length === 0) {
      return
    }

    setModalOpen(false)
    await executeTestRun.mutateAsync({
      scriptIds: selectedScriptIds,
      useVapi: true // Use real VAPI
    })
    setSelectedScriptIds([])
  }

  const getPersonaName = (scenarioId: string) => {
    const scenario = scenarios?.find(s => s.id === scenarioId)
    if (!scenario) return "Unknown"
    return personas?.find(p => p.id === scenario.personaId)?.name || "Unknown"
  }

  const getScriptName = (scriptId: string) => {
    return scripts?.find(s => s.id === scriptId)?.name || "Unknown"
  }

  if (runsLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Test Runs</h1>
          <p className="text-sm text-muted-foreground">Execute tests and review scored results</p>
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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Runs</h1>
          <p className="text-sm text-muted-foreground">Execute tests and review scored results</p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          disabled={approvedScripts.length === 0 || executeTestRun.isPending}
          className="gap-2"
        >
          {executeTestRun.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      {latestRun && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Run #{latestRun.runNumber} — Completed {new Date(latestRun.completedAt || latestRun.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">{latestRun.totalTests} tests executed</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className={`text-lg font-semibold ${latestRun.avgScore ? getScoreColor(latestRun.avgScore) : 'text-foreground'}`}>
                  {latestRun.avgScore?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-amber-500">{latestRun.flaggedCount}</p>
                <p className="text-xs text-muted-foreground">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {runs && runs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-muted-foreground">
              No test runs yet. Start by running your first test!
            </p>
            {approvedScripts.length === 0 && (
              <p className="text-xs text-muted-foreground">
                (You need approved test scripts first)
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">Run History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Run</TableHead>
                    <TableHead className="text-muted-foreground">Tests</TableHead>
                    <TableHead className="text-muted-foreground">Avg Score</TableHead>
                    <TableHead className="text-muted-foreground">Flagged</TableHead>
                    <TableHead className="text-muted-foreground">Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs?.map((run) => (
                    <TableRow key={run.id} className="border-border cursor-pointer hover:bg-secondary/50">
                      <TableCell className="text-sm font-medium text-foreground">#{run.runNumber}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{run.totalTests}</TableCell>
                      <TableCell className={`text-sm font-medium ${run.avgScore ? getScoreColor(run.avgScore) : 'text-foreground'}`}>
                        {run.avgScore?.toFixed(1) || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-amber-500">
                          {run.flaggedCount > 0 && <AlertTriangle className="h-3 w-3" />}
                          {run.flaggedCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {run.completedAt ? new Date(run.completedAt).toLocaleDateString() : 'In progress'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {latestRun && latestResults && latestResults.length > 0 && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">
                  Run #{latestRun.runNumber} Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Script</TableHead>
                      <TableHead className="text-muted-foreground">Persona</TableHead>
                      <TableHead className="text-muted-foreground">Score</TableHead>
                      <TableHead className="hidden text-muted-foreground md:table-cell">Summary</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestResults.map((result) => (
                      <TableRow key={result.id} className="border-border">
                        <TableCell className="text-sm font-medium text-foreground">
                          {getScriptName(result.testScriptId)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getPersonaName(scripts?.find(s => s.id === result.testScriptId)?.scenarioId || '')}
                        </TableCell>
                        <TableCell className={`text-sm font-semibold ${getScoreColor(result.score)}`}>
                          {result.score.toFixed(1)}
                        </TableCell>
                        <TableCell className="hidden max-w-64 truncate text-sm text-muted-foreground md:table-cell">
                          {result.summary}
                        </TableCell>
                        <TableCell>
                          {result.status === "Passed" ? (
                            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Passed</Badge>
                          ) : result.status === "Failed" ? (
                            <Badge variant="outline" className="border-red-500/20 bg-red-500/15 text-red-500">Failed</Badge>
                          ) : (
                            <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Review</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link href={`/projects/${projectId}/runs/${latestRun.id}/conversations/${result.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                              View Transcript
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Run Tests</DialogTitle>
            <DialogDescription>Select which scripts to include in this test run.</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <div className="flex flex-col gap-3 py-4">
              {approvedScripts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No approved scripts available.</p>
              ) : (
                approvedScripts.map((script) => (
                  <label key={script.id} className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
                    <Checkbox
                      checked={selectedScriptIds.includes(script.id)}
                      onCheckedChange={() => handleToggleScript(script.id)}
                    />
                    {script.name}
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleStartRun}
              disabled={selectedScriptIds.length === 0 || executeTestRun.isPending}
            >
              {executeTestRun.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                `Start Run (${selectedScriptIds.length})`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
