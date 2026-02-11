"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Download, Save } from "lucide-react"
import { projects, systemPrompt } from "@/lib/data"
import { toast } from "sonner"

export default function ConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projects.find((p) => p.id === id)
  const [editingPrompt, setEditingPrompt] = useState(false)

  if (!project) return <div className="text-foreground">Project not found</div>

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Agent Configuration</h1>
        <p className="text-sm text-muted-foreground">Configure your voice agent details and system prompt</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Agent Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Agent Name</Label>
              <Input defaultValue="TechRecruit AI" className="bg-secondary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Agent Type</Label>
              <Input defaultValue="Technical Recruiter" className="bg-secondary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Primary Goal</Label>
              <Textarea
                defaultValue="Qualify candidates for software engineering roles, gather experience details, and schedule a follow-up interview"
                className="min-h-20 bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{"Tone & Personality"}</Label>
              <Textarea
                defaultValue="Professional, warm, and encouraging. Sounds like a senior HR professional."
                className="min-h-16 bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Must Never Do</Label>
              <Textarea
                defaultValue="Never make promises about salary. Never confirm a candidate is selected. Never discuss competitor companies."
                className="min-h-20 bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">VAPI Assistant ID</Label>
              <Input defaultValue={project.vapiAssistantId} className="bg-secondary font-mono text-xs" readOnly />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => toast.info("This is a demo — sign up to use the real thing")} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => toast.info("This is a demo — sign up to use the real thing")} className="gap-2">
                <Download className="h-4 w-4" />
                Pull latest from VAPI
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-foreground">Current System Prompt</CardTitle>
              <Badge variant="secondary" className="mt-1.5 text-xs">v4 — last updated 3 days ago</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingPrompt(!editingPrompt)
                if (editingPrompt) toast.info("This is a demo — sign up to use the real thing")
              }}
            >
              {editingPrompt ? "Save Prompt" : "Edit Prompt"}
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              defaultValue={systemPrompt}
              readOnly={!editingPrompt}
              className={`min-h-[480px] bg-secondary font-mono text-xs leading-relaxed ${!editingPrompt ? "cursor-default" : ""}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
