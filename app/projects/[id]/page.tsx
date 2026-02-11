"use client"

import Link from "next/link"
import { use } from "react"
import {
  Lightbulb,
  ListChecks,
  Play,
  ScrollText,
  Upload,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  IterationCw,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProject } from "@/hooks/use-projects"
import { toast } from "sonner"

const quickNavCards = [
  { label: "Agent Config", icon: BarChart3, href: "/config", desc: "Configure your agent's behavior and prompt" },
  { label: "Personas", icon: Users, href: "/personas", desc: "Define caller profiles to test against" },
  { label: "Scenarios", icon: ListChecks, href: "/scenarios", desc: "Create test scenarios for each persona" },
  { label: "Test Scripts", icon: ScrollText, href: "/scripts", desc: "Generate conversation scripts from scenarios" },
  { label: "Test Runs", icon: Play, href: "/runs", desc: "Run tests and view scored results" },
  { label: "Improvements", icon: Lightbulb, href: "/improvements", desc: "Review AI-suggested prompt changes" },
]

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-500"
  if (score >= 6) return "text-amber-500"
  return "text-red-500"
}

export default function ProjectOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: project, isLoading, error } = useProject(id)

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-6xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load project. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
            <Badge variant="secondary">{project.tag}</Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{project.currentVersion}</Badge>
          </div>
          {project.vapiAssistantId && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">{project.vapiAssistantId}</p>
          )}
        </div>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={() => toast.info("VAPI sync will be implemented in Phase 6")}
        >
          <Upload className="h-4 w-4" />
          Push to VAPI
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Avg Score</span>
            </div>
            {project.latestAvgScore ? (
              <p className={`mt-1 text-2xl font-semibold ${getScoreColor(project.latestAvgScore)}`}>
                {project.latestAvgScore}<span className="text-sm font-normal text-muted-foreground"> / 10</span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">No tests yet</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Tests Run</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{project.testsRun}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Open Issues</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-amber-500">{project.openIssues}</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IterationCw className="h-4 w-4" />
              <span className="text-xs">Iterations</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">{project.iterationsCompleted}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Get started by configuring your agent, creating personas, and generating test scenarios.
            Charts and test results will appear here after you run your first tests.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {quickNavCards.map((item) => (
          <Link key={item.label} href={`/projects/${project.id}${item.href}`}>
            <Card className="h-full cursor-pointer border-border bg-card transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col items-start gap-2 pt-5">
                <item.icon className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
