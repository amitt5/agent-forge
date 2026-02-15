"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface BasicPersona {
  name: string
  age: number | null
  gender: string | null
  tag: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface PersonaEditorModalProps {
  isOpen: boolean
  onClose: () => void
  initialPersonas: BasicPersona[]
  onSubmit: (personas: BasicPersona[]) => Promise<void>
  isSubmitting: boolean
}

export function PersonaEditorModal({
  isOpen,
  onClose,
  initialPersonas,
  onSubmit,
  isSubmitting
}: PersonaEditorModalProps) {
  const [personas, setPersonas] = useState<BasicPersona[]>(initialPersonas)

  // Update personas when initialPersonas changes
  useEffect(() => {
    if (initialPersonas.length > 0) {
      setPersonas(initialPersonas)
    }
  }, [initialPersonas])

  const handleAddRow = () => {
    setPersonas([
      ...personas,
      {
        name: '',
        age: null,
        gender: '',
        tag: '',
        difficulty: 'Medium'
      }
    ])
  }

  const handleDeleteRow = (index: number) => {
    if (personas.length > 1) {
      setPersonas(personas.filter((_, i) => i !== index))
    }
  }

  const handleFieldChange = (index: number, field: keyof BasicPersona, value: any) => {
    const updated = [...personas]
    updated[index] = { ...updated[index], [field]: value }
    setPersonas(updated)
  }

  const handleSubmit = async () => {
    // Filter out empty rows
    const validPersonas = personas.filter(p => p.name.trim() !== '')
    if (validPersonas.length === 0) {
      return
    }
    await onSubmit(validPersonas)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Review & Edit Personas</DialogTitle>
          <DialogDescription>
            Edit the persona details below. Click OK to generate full descriptions for each persona.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-3">
            {personas.map((persona, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg bg-muted/30"
              >
                {/* Name */}
                <div className="col-span-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <Input
                    value={persona.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Age */}
                <div className="col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                  <Input
                    type="number"
                    value={persona.age || ''}
                    onChange={(e) => handleFieldChange(index, 'age', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="35"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Gender */}
                <div className="col-span-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                  <Input
                    value={persona.gender || ''}
                    onChange={(e) => handleFieldChange(index, 'gender', e.target.value)}
                    placeholder="F/M"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Tag */}
                <div className="col-span-4">
                  <label className="text-xs text-muted-foreground mb-1 block">Tag</label>
                  <Input
                    value={persona.tag || ''}
                    onChange={(e) => handleFieldChange(index, 'tag', e.target.value)}
                    placeholder="e.g., Cost-Conscious Professional"
                    className="h-8 text-sm"
                  />
                </div>

                {/* Difficulty */}
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Difficulty</label>
                  <Select
                    value={persona.difficulty}
                    onValueChange={(value) => handleFieldChange(index, 'difficulty', value as 'Easy' | 'Medium' | 'Hard')}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete Button */}
                <div className="col-span-1 flex items-end justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRow(index)}
                    disabled={personas.length === 1}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Row Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="mt-3 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Persona
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Descriptions...
              </>
            ) : (
              'Generate Full Personas'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
