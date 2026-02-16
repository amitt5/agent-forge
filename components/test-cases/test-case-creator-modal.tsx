"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTestCaseSuggestions, useGenerateTestScript } from "@/hooks/use-scripts"

interface TestCaseCreatorModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function TestCaseCreatorModal({
  isOpen,
  onClose,
  projectId
}: TestCaseCreatorModalProps) {
  const [scenario, setScenario] = useState('')
  const [goal, setGoal] = useState('')
  const [expectedOutcome, setExpectedOutcome] = useState('')
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const getSuggestions = useTestCaseSuggestions(projectId)
  const generateScript = useGenerateTestScript(projectId)

  // Load AI suggestions when modal opens
  useEffect(() => {
    if (isOpen && !scenario && !goal && !expectedOutcome) {
      loadSuggestions()
    }
  }, [isOpen])

  const loadSuggestions = async () => {
    setIsLoadingSuggestions(true)
    try {
      const result = await getSuggestions.mutateAsync()
      setScenario(result.scenario)
      setGoal(result.goal)
      setExpectedOutcome(result.expectedOutcome)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSubmit = async () => {
    if (!scenario.trim() || !goal.trim() || !expectedOutcome.trim()) {
      return
    }

    try {
      await generateScript.mutateAsync({
        scenario: scenario.trim(),
        goal: goal.trim(),
        expectedOutcome: expectedOutcome.trim()
      })

      // Reset and close
      setScenario('')
      setGoal('')
      setExpectedOutcome('')
      onClose()
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const handleClose = () => {
    if (!generateScript.isPending) {
      setScenario('')
      setGoal('')
      setExpectedOutcome('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Test Case</DialogTitle>
          <DialogDescription>
            Edit the AI-generated suggestions below or write your own. Click OK to generate the test case.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Scenario */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Scenario
            </label>
            <Textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Brief scenario description (1-2 sentences)"
              className="min-h-[80px]"
              disabled={isLoadingSuggestions}
            />
          </div>

          {/* Goal */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Goal
            </label>
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What the caller is trying to achieve"
              className="min-h-[80px]"
              disabled={isLoadingSuggestions}
            />
          </div>

          {/* Expected Outcome */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Expected Outcome
            </label>
            <Textarea
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="What should happen if the agent handles it correctly"
              className="min-h-[80px]"
              disabled={isLoadingSuggestions}
            />
          </div>

          {isLoadingSuggestions && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading AI suggestions...
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={generateScript.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              generateScript.isPending ||
              isLoadingSuggestions ||
              !scenario.trim() ||
              !goal.trim() ||
              !expectedOutcome.trim()
            }
          >
            {generateScript.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Test Case...
              </>
            ) : (
              'Create Test Case'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
