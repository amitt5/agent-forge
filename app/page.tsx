"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProjects, useCreateProject } from "@/hooks/use-projects"

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectTag, setNewProjectTag] = useState("")

  const { data: projects, isLoading, error } = useProjects()
  const createProject = useCreateProject()

  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectTag) return

    await createProject.mutateAsync({
      name: newProjectName,
      tag: newProjectTag
    })

    setIsCreateDialogOpen(false)
    setNewProjectName("")
    setNewProjectTag("")
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">Failed to load projects. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and test your voice agents</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects && projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-muted-foreground">No projects yet. Create your first project to get started.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects?.map((project) => (
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
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                    {project.latestAvgScore ? (
                      <p className={`text-xl font-semibold ${getScoreColor(project.latestAvgScore)}`}>
                        {project.latestAvgScore}
                        <span className="text-sm font-normal text-muted-foreground"> / 10</span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tests yet</p>
                    )}
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
                    <p className="text-sm font-medium text-foreground">
                      {project.lastTested ? new Date(project.lastTested).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
                <Link href={`/projects/${project.id}`}>
                  <Button variant="secondary" className="w-full">Open Project</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new voice agent testing project
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="TechRecruit AI"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                placeholder="Recruiting"
                value={newProjectTag}
                onChange={(e) => setNewProjectTag(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName || !newProjectTag || createProject.isPending}
            >
              {createProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
