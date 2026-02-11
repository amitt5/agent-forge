"use client"

import Link from "next/link"
import { use } from "react"
import {
  Bot,
  FlaskConical,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { projects, recentTests, versionHistory } from "@/lib/data"
import { toast } from "sonner"

const scoreTrendData = [
  { version: "v1", score: 4.2 },
  { version: "v2", score: 5.9 },
  { version: "v3", score: 6.7 },
  { version: "v4", score: 7.8 },
]

const quickNavCards = [
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

function getStatusBadge(status: string) {
  if (status === "Passed") return <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Passed</Badge>
  return <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Review</Badge>
}

export default function ProjectOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projects.find((p) => p.id === id)
  if (!project) return <div className="text-foreground">Project not found</div>

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
            <Badge variant="secondary">{project.tag}</Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{project.currentVersion}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{project.vapiAssistantId}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={() => toast.info("This is a demo — sign up to use the real thing")}
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
            <p className={`mt-1 text-2xl font-semibold ${getScoreColor(project.latestAvgScore)}`}>
              {project.latestAvgScore}<span className="text-sm font-normal text-muted-foreground"> / 10</span>
            </p>
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
          <CardTitle className="text-sm font-medium text-foreground">Average Score per Iteration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 4%, 20%)" />
                <XAxis dataKey="version" stroke="hsl(240, 4%, 55%)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="hsl(240, 4%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240, 5%, 8%)",
                    border: "1px solid hsl(240, 4%, 16%)",
                    borderRadius: "6px",
                    color: "hsl(0, 0%, 95%)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(239, 84%, 67%)"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(239, 84%, 67%)", strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Test Name</TableHead>
                <TableHead className="text-muted-foreground">Score</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTests.map((test) => (
                <TableRow key={test.name} className="border-border">
                  <TableCell className="text-sm text-foreground">{test.name}</TableCell>
                  <TableCell className={`text-sm font-medium ${getScoreColor(test.score)}`}>{test.score}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {quickNavCards.map((item) => (
          <Link key={item.label} href={`/projects/${id}${item.href}`}>
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
