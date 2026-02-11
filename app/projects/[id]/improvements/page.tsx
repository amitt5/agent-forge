"use client"

import { use } from "react"
import { Check, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { improvements } from "@/lib/data"
import { toast } from "sonner"

function getSeverityColor(s: string) {
  if (s === "High") return "border-red-500/20 bg-red-500/10 text-red-500"
  if (s === "Medium") return "border-amber-500/20 bg-amber-500/10 text-amber-500"
  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
}

function getAreaColor(a: string) {
  if (a === "Prompt") return "bg-primary/10 text-primary border-primary/20"
  if (a === "Conversation Flow") return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  return "bg-amber-500/10 text-amber-500 border-amber-500/20"
}

export default function ImprovementsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Improvement Suggestions</h1>
        <p className="text-sm text-muted-foreground">AI-identified patterns from the latest test run. Review and approve changes before they{"'"}re applied.</p>
      </div>

      <div className="mb-6 flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <span className="text-lg font-semibold text-foreground">5</span>
          <span className="text-xs text-muted-foreground">Open suggestions</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <span className="text-lg font-semibold text-emerald-500">3</span>
          <span className="text-xs text-muted-foreground">Approved this week</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <span className="text-lg font-semibold text-muted-foreground">2</span>
          <span className="text-xs text-muted-foreground">Dismissed</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {improvements.map((imp) => {
          const isApproved = imp.status === "Approved"
          return (
            <Card key={imp.id} className={`bg-card ${isApproved ? "opacity-60" : ""}`}>
              <CardContent className="pt-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">{imp.title}</h3>
                    <Badge variant="outline" className={getSeverityColor(imp.severity)}>{imp.severity}</Badge>
                    <Badge variant="outline" className={getAreaColor(imp.area)}>{imp.area}</Badge>
                    {isApproved && (
                      <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">
                        <Check className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Found in {imp.appearedIn} tests</span>
                </div>

                <p className="mb-3 text-sm text-muted-foreground">{imp.problem}</p>

                <div className="mb-4 overflow-hidden rounded-md border border-border">
                  <div className="border-b border-border bg-red-500/5 px-3 py-2">
                    <p className="font-mono text-xs text-red-400 line-through">{imp.oldText}</p>
                  </div>
                  <div className="bg-emerald-500/5 px-3 py-2">
                    <p className="font-mono text-xs text-emerald-400">{imp.newText}</p>
                  </div>
                </div>

                {!isApproved && (
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs bg-transparent" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
                      <X className="h-3 w-3" /> Dismiss
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
