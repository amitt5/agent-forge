"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Download, Save, Loader2 } from "lucide-react"
import { useProject, useProjectConfig, useUpdateProjectConfig } from "@/hooks/use-projects"
import { toast } from "sonner"

export default function ConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: project, isLoading: projectLoading } = useProject(id)
  const { data: config, isLoading: configLoading, error } = useProjectConfig(id)
  const updateConfig = useUpdateProjectConfig(id)

  const [editingPrompt, setEditingPrompt] = useState(false)
  const [formData, setFormData] = useState({
    agentName: "",
    agentType: "",
    primaryGoal: "",
    tonePersonality: "",
    mustNeverDo: "",
    systemPrompt: ""
  })

  useEffect(() => {
    if (config) {
      setFormData({
        agentName: config.agentName || "",
        agentType: config.agentType || "",
        primaryGoal: config.primaryGoal || "",
        tonePersonality: config.tonePersonality || "",
        mustNeverDo: config.mustNeverDo || "",
        systemPrompt: config.systemPrompt || ""
      })
    }
  }, [config])

  const handleSaveDetails = async () => {
    await updateConfig.mutateAsync({
      agentName: formData.agentName,
      agentType: formData.agentType,
      primaryGoal: formData.primaryGoal,
      tonePersonality: formData.tonePersonality,
      mustNeverDo: formData.mustNeverDo
    })
  }

  const handleSavePrompt = async () => {
    await updateConfig.mutateAsync({
      systemPrompt: formData.systemPrompt
    })
    setEditingPrompt(false)
  }

  if (projectLoading || configLoading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="mx-auto max-w-6xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load configuration. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              <Input
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Agent Type</Label>
              <Input
                value={formData.agentType}
                onChange={(e) => setFormData({ ...formData, agentType: e.target.value })}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Primary Goal</Label>
              <Textarea
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                className="min-h-20 bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{"Tone & Personality"}</Label>
              <Textarea
                value={formData.tonePersonality}
                onChange={(e) => setFormData({ ...formData, tonePersonality: e.target.value })}
                className="min-h-16 bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Must Never Do</Label>
              <Textarea
                value={formData.mustNeverDo}
                onChange={(e) => setFormData({ ...formData, mustNeverDo: e.target.value })}
                className="min-h-20 bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">VAPI Assistant ID</Label>
              <Input
                value={project?.vapiAssistantId || "Not connected"}
                className="bg-secondary font-mono text-xs"
                readOnly
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveDetails}
                disabled={updateConfig.isPending}
                className="gap-2"
              >
                {updateConfig.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("VAPI sync will be implemented in Phase 6")}
                className="gap-2"
              >
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
              <Badge variant="secondary" className="mt-1.5 text-xs">
                {config.version} — {new Date(config.createdAt).toLocaleDateString()}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (editingPrompt) {
                  handleSavePrompt()
                } else {
                  setEditingPrompt(true)
                }
              }}
              disabled={updateConfig.isPending}
            >
              {updateConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPrompt ? "Save Prompt" : "Edit Prompt"}
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              readOnly={!editingPrompt}
              className={`min-h-[480px] bg-secondary font-mono text-xs leading-relaxed ${!editingPrompt ? "cursor-default" : ""}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
