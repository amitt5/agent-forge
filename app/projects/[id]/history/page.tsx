"use client"

import { use, useState } from "react"
import { Eye, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { versionHistory, systemPrompt } from "@/lib/data"
import { toast } from "sonner"

const scoreTrendData = [
  { version: "v1", score: 4.2 },
  { version: "v2", score: 5.9 },
  { version: "v3", score: 6.7 },
  { version: "v4", score: 7.8 },
]

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-500"
  if (score >= 6) return "text-amber-500"
  return "text-red-500"
}

export default function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  use(params)
  const [promptOpen, setPromptOpen] = useState(false)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Version History</h1>
        <p className="text-sm text-muted-foreground">Track how your agent has improved over time</p>
      </div>

      <Card className="mb-8 bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">Score Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
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
                  formatter={(value: number) => [`${value} / 10`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(239, 84%, 67%)"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(239, 84%, 67%)", strokeWidth: 0, r: 6 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute bottom-0 left-6 top-0 w-px bg-border" />
        <div className="flex flex-col gap-8">
          {versionHistory.map((v, i) => (
            <div key={v.version} className="relative flex gap-6 pl-6">
              <div className={`absolute left-[17px] top-1 h-4 w-4 rounded-full border-2 ${i === 0 ? "border-primary bg-primary" : "border-border bg-card"}`} />
              <Card className="flex-1 bg-card">
                <CardContent className="pt-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={i === 0 ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-foreground"}>
                      {v.version}
                    </Badge>
                    {v.label && (
                      <Badge variant="secondary" className="text-xs">{v.label}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{v.date}</span>
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className={`text-lg font-semibold ${getScoreColor(v.avgScore)}`}>{v.avgScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tests Run</p>
                      <p className="text-lg font-semibold text-foreground">{v.testsRun}</p>
                    </div>
                    {v.improvementsApplied > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Improvements Applied</p>
                        <p className="text-lg font-semibold text-foreground">{v.improvementsApplied}</p>
                      </div>
                    )}
                  </div>

                  {v.changes.length > 0 && v.version !== "v1" && (
                    <div className="mb-3">
                      <p className="mb-1.5 text-xs text-muted-foreground">Changes from Run {v.fromRun}:</p>
                      <ul className="flex flex-col gap-1">
                        {v.changes.map((c) => (
                          <li key={c} className="text-xs text-foreground">{"- "}{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs bg-transparent" onClick={() => setPromptOpen(true)}>
                      <Eye className="h-3 w-3" /> View Prompt
                    </Button>
                    {i !== 0 && (
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
                        <GitCompare className="h-3 w-3" /> Compare with current
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">System Prompt — v4</DialogTitle>
            <DialogDescription>Current version system prompt</DialogDescription>
          </DialogHeader>
          <pre className="whitespace-pre-wrap rounded-md bg-secondary p-4 font-mono text-xs leading-relaxed text-foreground">
            {systemPrompt}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}
