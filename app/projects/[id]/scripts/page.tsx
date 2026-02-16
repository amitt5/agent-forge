"use client"

import { use, useState } from "react"
import { Eye, Plus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTestScripts, useDeleteTestScript } from "@/hooks/use-scripts"
import { TestCaseCreatorModal } from "@/components/test-cases/test-case-creator-modal"
import type { TestScript } from "@/types"

export default function ScriptsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const { data: scripts, isLoading: scriptsLoading } = useTestScripts(projectId)
  const deleteScript = useDeleteTestScript(projectId)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedScript, setSelectedScript] = useState<TestScript | null>(null)

  const handleDelete = async (scriptId: string) => {
    if (confirm("Are you sure you want to delete this test case?")) {
      await deleteScript.mutateAsync(scriptId)
    }
  }

  const handleViewScript = (script: TestScript) => {
    setSelectedScript(script)
    setViewOpen(true)
  }

  if (scriptsLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Test Cases</h1>
          <p className="text-sm text-muted-foreground">AI-generated test cases for testing your agent</p>
        </div>
        <Card className="bg-card">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Cases</h1>
          <p className="text-sm text-muted-foreground">AI-generated test cases for testing your agent</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Test Case
        </Button>
      </div>

      {scripts && scripts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-sm text-muted-foreground">
              No test cases yet. Click "Create Test Case" to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Scenario</TableHead>
                  <TableHead className="text-muted-foreground">Goal</TableHead>
                  <TableHead className="text-muted-foreground">Expected Outcome</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scripts?.map((script) => (
                  <TableRow key={script.id} className="border-border">
                    <TableCell className="text-sm font-medium text-foreground max-w-xs">
                      {script.name}
                      {script.aiGenerated && (
                        <Badge variant="outline" className="ml-2 border-primary/20 bg-primary/10 text-xs text-primary">
                          AI
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{script.goal}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{script.expectedOutcome}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs text-muted-foreground"
                          onClick={() => handleViewScript(script)}
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(script.id)}
                          disabled={deleteScript.isPending}
                        >
                          <X className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent className="w-full border-border bg-card sm:max-w-lg">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-foreground">{selectedScript?.name || "Test Case"}</SheetTitle>
            <SheetDescription className="space-y-2">
              <div>
                <span className="font-medium">Goal:</span> {selectedScript?.goal}
              </div>
              <div>
                <span className="font-medium">Expected Outcome:</span> {selectedScript?.expectedOutcome}
              </div>
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <div className="flex flex-col gap-6 pb-8">
              {selectedScript?.scriptData && typeof selectedScript.scriptData === 'object' && !Array.isArray(selectedScript.scriptData) ? (
                <>
                  {/* Discussion Guide Format */}
                  {selectedScript.scriptData.objective && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">Objective</h3>
                      <p className="text-sm text-muted-foreground">{selectedScript.scriptData.objective}</p>
                    </div>
                  )}

                  {selectedScript.scriptData.steps && selectedScript.scriptData.steps.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">Steps to Cover</h3>
                      <ol className="list-decimal space-y-2 pl-5">
                        {selectedScript.scriptData.steps.map((step: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {selectedScript.scriptData.behaviors && selectedScript.scriptData.behaviors.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">Behavioral Guidelines</h3>
                      <ul className="list-disc space-y-2 pl-5">
                        {selectedScript.scriptData.behaviors.map((behavior: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">{behavior}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedScript.scriptData.successCriteria && selectedScript.scriptData.successCriteria.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-foreground">Success Criteria</h3>
                      <ul className="list-disc space-y-2 pl-5">
                        {selectedScript.scriptData.successCriteria.map((criteria: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Legacy Script Format (array of turns) */}
                  {Array.isArray(selectedScript?.scriptData) && selectedScript.scriptData.map((msg: any, i: number) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "agent" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
                          msg.role === "agent"
                            ? "bg-primary/15 text-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {msg.role === "agent" ? "Agent" : "Caller"}
                        </p>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <TestCaseCreatorModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projectId={projectId}
      />
    </div>
  )
}
