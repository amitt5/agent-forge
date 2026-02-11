"use client"

import { use, useState } from "react"
import { Check, Pencil, Sparkles, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { personas, pendingPersona } from "@/lib/data"
import { toast } from "sonner"

function getDifficultyColor(d: string) {
  if (d === "Easy") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
  if (d === "Medium") return "bg-amber-500/15 text-amber-500 border-amber-500/20"
  return "bg-red-500/15 text-red-500 border-red-500/20"
}

export default function PersonasPage({ params }: { params: Promise<{ id: string }> }) {
  use(params)
  const [showPending, setShowPending] = useState(true)
  const [loading, setLoading] = useState(false)
  const [suggested, setSuggested] = useState(false)

  const handleSuggest = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuggested(true)
      toast.success("New persona suggestion generated")
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Caller Personas</h1>
          <p className="text-sm text-muted-foreground">Define who your agent will be tested against</p>
        </div>
        <Button onClick={handleSuggest} disabled={loading} variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating..." : "AI Suggest Personas"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.id} className="border-border bg-card">
            <CardContent className="pt-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{persona.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{persona.description}</p>
                </div>
              </div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(persona.difficulty)}>
                  {persona.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">{persona.tag}</Badge>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">
                  <Check className="mr-1 h-3 w-3" />
                  Approved
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {loading && (
          <Card className="border-dashed border-border bg-card">
            <CardContent className="pt-5">
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="mb-3 h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardContent>
          </Card>
        )}

        {showPending && !loading && (
          <Card className="border-dashed border-border bg-card opacity-70">
            <CardContent className="pt-5">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-xs text-amber-500">Pending Approval</Badge>
              </div>
              <p className="mt-2 font-medium text-foreground">{pendingPersona.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{pendingPersona.description}</p>
              <div className="mb-3 mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(pendingPersona.difficulty)}>
                  {pendingPersona.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">{pendingPersona.tag}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => { setShowPending(false); toast.success("Persona approved") }}>
                  <Check className="h-3 w-3" /> Approve
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => { setShowPending(false); toast.info("Persona dismissed") }}>
                  <X className="h-3 w-3" /> Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {suggested && (
          <Card className="border-dashed border-primary/30 bg-card opacity-70">
            <CardContent className="pt-5">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-xs text-amber-500">Pending Approval</Badge>
                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-xs text-primary">AI Generated</Badge>
              </div>
              <p className="mt-2 font-medium text-foreground">Raj Mehta</p>
              <p className="mt-1 text-sm text-muted-foreground">Senior architect who over-explains everything and dominates the conversation, making it hard for the agent to guide the flow.</p>
              <div className="mb-3 mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor("Hard")}>Hard</Badge>
                <Badge variant="secondary" className="text-xs">Over-talker</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => { setSuggested(false); toast.success("Persona approved") }}>
                  <Check className="h-3 w-3" /> Approve
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => { setSuggested(false); toast.info("Persona dismissed") }}>
                  <X className="h-3 w-3" /> Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
