"use client"

import { use } from "react"
import { AlertTriangle, AlertCircle, ArrowRight, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { seniorDevScript, scoreAnalysis } from "@/lib/data"
import { toast } from "sonner"

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? "bg-emerald-500" : value >= 6 ? "bg-amber-500" : "bg-red-500"
  const textColor = value >= 8 ? "text-emerald-500" : value >= 6 ? "text-amber-500" : "text-red-500"
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-semibold ${textColor}`}>{value}/10</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  )
}

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string; runId: string; convId: string }>
}) {
  use(params)

  return (
    <div className="mx-auto flex max-w-7xl gap-4">
      {/* Left — Metadata */}
      <div className="w-64 shrink-0">
        <Card className="bg-card">
          <CardContent className="flex flex-col gap-4 pt-5">
            <div>
              <p className="text-xs text-muted-foreground">Script</p>
              <p className="text-sm font-medium text-foreground">Senior Dev With Objections</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Persona</p>
              <p className="text-sm font-medium text-foreground">Marcus Williams</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Senior engineer, skeptical, busy, lots of objections about the process.
              </p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Run</p>
                <p className="text-sm font-medium text-foreground">#12</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">Feb 9, 2026</p>
              </div>
            </div>
            <Separator className="bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Overall Score</p>
              <p className="mt-1 text-3xl font-bold text-amber-500">
                6.1<span className="text-sm font-normal text-muted-foreground"> / 10</span>
              </p>
            </div>
            <Separator className="bg-border" />
            <div className="flex flex-col gap-3">
              <ScoreBar label="Goal Achievement" value={scoreAnalysis.goalAchievement} />
              <ScoreBar label="Objection Handling" value={scoreAnalysis.objectionHandling} />
              <ScoreBar label="Stayed On Script" value={scoreAnalysis.stayedOnScript} />
              <ScoreBar label="Natural Conversation" value={scoreAnalysis.naturalConversation} />
              <ScoreBar label="Brand Compliance" value={scoreAnalysis.brandCompliance} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center — Transcript */}
      <div className="min-w-0 flex-1">
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MessageSquare className="h-4 w-4 text-primary" />
              Conversation Transcript
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="flex flex-col gap-3 px-5 pb-6">
                {seniorDevScript.map((msg, i) => {
                  const isFlagged = "flagged" in msg
                  const borderColor =
                    isFlagged && msg.flagged === "error"
                      ? "border-l-4 border-l-red-500"
                      : isFlagged && msg.flagged === "warning"
                        ? "border-l-4 border-l-amber-500"
                        : ""
                  return (
                    <div
                      key={i}
                      className={`flex ${msg.role === "agent" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative max-w-[80%] rounded-lg px-4 py-3 text-sm ${borderColor} ${
                          msg.role === "agent"
                            ? isFlagged
                              ? msg.flagged === "error"
                                ? "bg-red-500/10 text-foreground"
                                : "bg-amber-500/10 text-foreground"
                              : "bg-primary/10 text-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {msg.role === "agent" ? "Agent" : "Caller"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">Turn {i + 1}</span>
                          {isFlagged && (
                            <span className="flex items-center gap-1">
                              {msg.flagged === "error" ? (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                              )}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right — AI Analysis */}
      <div className="w-72 shrink-0">
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="flex flex-col gap-5 pr-3">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What went wrong</h3>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="mb-1.5 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-amber-500">Turn 7</span>
                        <Badge variant="outline" className="h-4 border-amber-500/20 bg-amber-500/10 px-1.5 text-[10px] text-amber-500">Medium</Badge>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground">
                        Agent became defensive when candidate questioned the interview process length. Should have acknowledged the concern and pivoted.
                      </p>
                    </div>
                    <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
                      <div className="mb-1.5 flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-xs font-medium text-red-500">Turn 11</span>
                        <Badge variant="outline" className="h-4 border-red-500/20 bg-red-500/10 px-1.5 text-[10px] text-red-500">High</Badge>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground">
                        {"Agent failed to re-engage after candidate said \"I'm not interested.\" No recovery attempt was made."}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Fixes</h3>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-md border border-border bg-secondary/50 p-3">
                      <p className="mb-2 text-xs leading-relaxed text-foreground">
                        Add handling for process objections: acknowledge timeline concern, explain value of each step.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 gap-1 text-[10px] bg-transparent"
                        onClick={() => toast.info("This is a demo — sign up to use the real thing")}
                      >
                        Send to Improvements <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/50 p-3">
                      <p className="mb-2 text-xs leading-relaxed text-foreground">
                        {"Add recovery script for disengagement signals: \"I understand, can I ask what your main concern is?\""}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 gap-1 text-[10px] bg-transparent"
                        onClick={() => toast.info("This is a demo — sign up to use the real thing")}
                      >
                        Send to Improvements <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Manual Note</h3>
                  <Textarea
                    placeholder="Add your observations..."
                    className="min-h-20 bg-secondary text-xs"
                  />
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => toast.info("This is a demo — sign up to use the real thing")}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
