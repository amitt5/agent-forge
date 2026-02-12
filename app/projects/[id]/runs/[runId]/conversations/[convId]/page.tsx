"use client"

import { use } from "react"
import { AlertTriangle, AlertCircle, MessageSquare, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useTestResult } from "@/hooks/use-test-runs"
import { usePersonas } from "@/hooks/use-personas"

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
  const { id: projectId, runId, convId: resultId } = use(params)
  const { data: result, isLoading } = useTestResult(projectId, runId, resultId)
  const { data: personas } = usePersonas(projectId)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Test result not found</p>
      </div>
    )
  }

  const persona = personas?.find(p => p.id === result.personaId)
  const evaluation = result.evaluationData as any
  const conversation = result.conversationData as { role: string; text: string }[]

  // Get flagged turn indices
  const flaggedTurnIndices = new Set(
    evaluation?.flaggedTurns?.map((ft: any) => ft.turnIndex) || []
  )

  // Get flag details by turn index
  const getFlagForTurn = (index: number) => {
    return evaluation?.flaggedTurns?.find((ft: any) => ft.turnIndex === index)
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-4">
      {/* Left — Metadata */}
      <div className="w-64 shrink-0">
        <Card className="bg-card">
          <CardContent className="flex flex-col gap-4 pt-5">
            <div>
              <p className="text-xs text-muted-foreground">Persona</p>
              <p className="text-sm font-medium text-foreground">
                {persona?.name || 'Unknown'}
              </p>
              {persona?.description && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-3">
                  {persona.description}
                </p>
              )}
            </div>
            <Separator className="bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Overall Score</p>
              <p className={`mt-1 text-3xl font-bold ${
                result.score >= 8 ? 'text-emerald-500' :
                result.score >= 6 ? 'text-amber-500' :
                'text-red-500'
              }`}>
                {result.score.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground"> / 10</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={`mt-1 ${
                  result.status === 'Passed'
                    ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-500'
                    : result.status === 'Failed'
                    ? 'border-red-500/20 bg-red-500/15 text-red-500'
                    : 'border-amber-500/20 bg-amber-500/15 text-amber-500'
                }`}
              >
                {result.status}
              </Badge>
            </div>
            <Separator className="bg-border" />
            {evaluation?.scores && (
              <div className="flex flex-col gap-3">
                <ScoreBar label="Goal Achievement" value={evaluation.scores.goalAchievement || 0} />
                <ScoreBar label="Objection Handling" value={evaluation.scores.objectionHandling || 0} />
                <ScoreBar label="Stayed On Script" value={evaluation.scores.stayedOnScript || 0} />
                <ScoreBar label="Natural Conversation" value={evaluation.scores.naturalConversation || 0} />
                <ScoreBar label="Brand Compliance" value={evaluation.scores.brandCompliance || 0} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Center — Transcript */}
      <div className="min-w-0 flex-1">
        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MessageSquare className="h-4 w-4 text-primary" />
              Conversation Transcript ({conversation?.length || 0} turns)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="flex flex-col gap-3 px-5 pb-6">
                {conversation && conversation.length > 0 ? (
                  conversation.map((msg, i) => {
                    const flag = getFlagForTurn(i)
                    const borderColor = flag
                      ? flag.severity === 'error'
                        ? 'border-l-4 border-l-red-500'
                        : 'border-l-4 border-l-amber-500'
                      : ''

                    return (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`relative max-w-[80%] rounded-lg px-4 py-3 text-sm ${borderColor} ${
                            msg.role === 'agent'
                              ? flag
                                ? flag.severity === 'error'
                                  ? 'bg-red-500/10 text-foreground'
                                  : 'bg-amber-500/10 text-foreground'
                                : 'bg-primary/10 text-foreground'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {msg.role === 'agent' ? 'Agent' : 'Caller'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Turn {i + 1}</span>
                            {flag && (
                              <span className="flex items-center gap-1">
                                {flag.severity === 'error' ? (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                                )}
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                          {flag && (
                            <p className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                              {flag.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    No conversation data available
                  </p>
                )}
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
                {result.summary && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</h3>
                    <p className="text-xs leading-relaxed text-foreground">{result.summary}</p>
                  </div>
                )}

                {evaluation?.flaggedTurns && evaluation.flaggedTurns.length > 0 && (
                  <>
                    <Separator className="bg-border" />
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Flagged Issues ({evaluation.flaggedTurns.length})
                      </h3>
                      <div className="flex flex-col gap-3">
                        {evaluation.flaggedTurns.map((flag: any, idx: number) => (
                          <div
                            key={idx}
                            className={`rounded-md border p-3 ${
                              flag.severity === 'error'
                                ? 'border-red-500/20 bg-red-500/5'
                                : 'border-amber-500/20 bg-amber-500/5'
                            }`}
                          >
                            <div className="mb-1.5 flex items-center gap-2">
                              {flag.severity === 'error' ? (
                                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              )}
                              <span className={`text-xs font-medium ${
                                flag.severity === 'error' ? 'text-red-500' : 'text-amber-500'
                              }`}>
                                Turn {flag.turnIndex + 1}
                              </span>
                              <Badge
                                variant="outline"
                                className={`h-4 px-1.5 text-[10px] ${
                                  flag.severity === 'error'
                                    ? 'border-red-500/20 bg-red-500/10 text-red-500'
                                    : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                                }`}
                              >
                                {flag.severity}
                              </Badge>
                            </div>
                            <p className="text-xs leading-relaxed text-foreground">{flag.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
