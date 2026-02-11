"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Play, AlertTriangle, CheckCircle } from "lucide-react"
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
import { testRuns, run12Results, testScripts } from "@/lib/data"
import { toast } from "sonner"

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-500"
  if (score >= 6) return "text-amber-500"
  return "text-red-500"
}

export default function TestRunsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Runs</h1>
          <p className="text-sm text-muted-foreground">Execute tests and review scored results</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Play className="h-4 w-4" />
          Run Tests
        </Button>
      </div>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Run #12 — Completed 2 hours ago</p>
              <p className="text-xs text-muted-foreground">20 tests executed</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">7.8</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-amber-500">3</p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              {testRuns.map((run) => (
                <TableRow key={run.id} className="border-border">
                  <TableCell className="text-sm font-medium text-foreground">#{run.number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{run.totalTests}</TableCell>
                  <TableCell className={`text-sm font-medium ${getScoreColor(run.avgScore)}`}>{run.avgScore}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-sm text-amber-500">
                      {run.flagged > 0 && <AlertTriangle className="h-3 w-3" />}
                      {run.flagged}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{run.completedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">Run #12 Results</CardTitle>
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
              {run12Results.map((r) => (
                <TableRow key={r.id} className="border-border">
                  <TableCell className="text-sm font-medium text-foreground">{r.scriptName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.persona}</TableCell>
                  <TableCell className={`text-sm font-semibold ${getScoreColor(r.score)}`}>{r.score}</TableCell>
                  <TableCell className="hidden max-w-64 text-sm text-muted-foreground md:table-cell">{r.summary}</TableCell>
                  <TableCell>
                    {r.status === "Passed" ? (
                      <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Passed</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Review</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/projects/${id}/runs/run-12/conversations/${r.id}`}>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Run Tests</DialogTitle>
            <DialogDescription>Select which scripts to include in this test run.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {testScripts.filter(s => s.status === "Approved").map((s) => (
              <label key={s.id} className="flex items-center gap-3 text-sm text-foreground">
                <Checkbox defaultChecked />
                {s.name}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => { setModalOpen(false); toast.info("This is a demo — sign up to use the real thing") }}>
              Start Run
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
