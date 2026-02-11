"use client"

import { use, useState } from "react"
import { Eye } from "lucide-react"
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
import { testScripts, seniorDevScript } from "@/lib/data"

export default function ScriptsPage({ params }: { params: Promise<{ id: string }> }) {
  use(params)
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Test Scripts</h1>
        <p className="text-sm text-muted-foreground">AI-generated conversation scripts based on your scenarios</p>
      </div>

      <Card className="bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Script Name</TableHead>
                <TableHead className="text-muted-foreground">Scenario</TableHead>
                <TableHead className="text-muted-foreground">Persona</TableHead>
                <TableHead className="text-muted-foreground">Turns</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {testScripts.map((ts) => (
                <TableRow key={ts.id} className={`border-border ${ts.status === "Pending" ? "opacity-60" : ""}`}>
                  <TableCell className="text-sm font-medium text-foreground">{ts.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ts.scenarioName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ts.personaName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ts.turns}</TableCell>
                  <TableCell>
                    {ts.status === "Approved" ? (
                      <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/15 text-emerald-500">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/20 bg-amber-500/15 text-amber-500">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs text-muted-foreground"
                      onClick={() => setViewOpen(true)}
                    >
                      <Eye className="h-3 w-3" /> View Script
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetContent className="w-full border-border bg-card sm:max-w-lg">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-foreground">Senior Dev Objections - Full</SheetTitle>
            <SheetDescription>
              Marcus Williams - Senior Dev With Objections - 14 turns
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <div className="flex flex-col gap-3 pb-8">
              {seniorDevScript.map((msg, i) => (
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
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
