"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreSparkline } from "@/components/score-sparkline"
import { projects } from "@/lib/data"
import { toast } from "sonner"

function getStatusColor(status: string) {
  if (status === "Active") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
  return "bg-amber-500/15 text-amber-500 border-amber-500/20"
}

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-500"
  if (score >= 6) return "text-amber-500"
  return "text-red-500"
}

export default function ProjectsDashboard() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and test your voice agents</p>
        </div>
        <Button
          onClick={() => toast.info("This is a demo — sign up to use the real thing")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="border-border bg-card transition-colors hover:border-primary/30">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div>
                <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{project.tag}</Badge>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              <ScoreSparkline data={project.scoreTrend} />
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                  <p className={`text-xl font-semibold ${getScoreColor(project.latestAvgScore)}`}>
                    {project.latestAvgScore}
                    <span className="text-sm font-normal text-muted-foreground"> / 10</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tests Run</p>
                  <p className="text-xl font-semibold text-foreground">{project.testsRun}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="text-sm font-medium text-foreground">{project.currentVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Tested</p>
                  <p className="text-sm font-medium text-foreground">{project.lastTested}</p>
                </div>
              </div>
              <Link href={`/projects/${project.id}`}>
                <Button variant="secondary" className="w-full">Open Project</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
