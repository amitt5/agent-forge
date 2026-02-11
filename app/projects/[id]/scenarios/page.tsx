"use client"

import { use } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { scenarios } from "@/lib/data"
import { toast } from "sonner"

function getDifficultyColor(d: string) {
  if (d === "Easy") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
  if (d === "Medium") return "bg-amber-500/15 text-amber-500 border-amber-500/20"
  return "bg-red-500/15 text-red-500 border-red-500/20"
}

export default function ScenariosPage({ params }: { params: Promise<{ id: string }> }) {
  use(params)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Test Scenarios</h1>
          <p className="text-sm text-muted-foreground">Define test scenarios pairing personas with specific goals</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
          <Sparkles className="h-4 w-4" />
          AI Suggest Scenarios
        </Button>
      </div>

      <Card className="bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Scenario</TableHead>
                <TableHead className="text-muted-foreground">Persona</TableHead>
                <TableHead className="text-muted-foreground">Difficulty</TableHead>
                <TableHead className="hidden text-muted-foreground lg:table-cell">Goal</TableHead>
                <TableHead className="hidden text-muted-foreground xl:table-cell">Expected Outcome</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((s) => (
                <TableRow key={s.id} className={`border-border ${s.status === "Pending" ? "opacity-60" : ""}`}>
                  <TableCell className="text-sm font-medium text-foreground">{s.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.personaName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDifficultyColor(s.difficulty)}>{s.difficulty}</Badge>
                  </TableCell>
                  <TableCell className="hidden max-w-48 text-sm text-muted-foreground lg:table-cell">{s.goal}</TableCell>
                  <TableCell className="hidden max-w-48 text-sm text-muted-foreground xl:table-cell">{s.expectedOutcome}</TableCell>
                  <TableCell>
                    {s.status === "Approved" ? (
                      <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Pending</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
