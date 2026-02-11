"use client"

import { use, useState } from "react"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { projects } from "@/lib/data"
import { toast } from "sonner"

export default function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projects.find((p) => p.id === id)
  const [showKey, setShowKey] = useState(false)

  if (!project) return <div className="text-foreground">Project not found</div>

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your project configuration</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">VAPI Integration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">VAPI API Key</Label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  defaultValue="vapi_sk_1234567890abcdefghijklmnopqrstuv"
                  className="flex-1 bg-secondary font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button className="w-fit" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
              Save API Key
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Email on test run complete</p>
                <p className="text-xs text-muted-foreground">Receive an email when a test run finishes</p>
              </div>
              <Switch defaultChecked onCheckedChange={() => toast.info("This is a demo — sign up to use the real thing")} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-500">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Delete this project</p>
                <p className="text-xs text-muted-foreground">Permanently delete {project.name} and all its data</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-border bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Delete project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {project.name} and all associated data including test runs, scripts, and improvements. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary text-foreground">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground"
                      onClick={() => toast.info("This is a demo — sign up to use the real thing")}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
