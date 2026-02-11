"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function WaitlistBanner() {
  const [email, setEmail] = useState("")
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="flex items-center justify-center gap-4 border-b border-border bg-primary/10 px-4 py-2 text-sm text-foreground">
      <span className="hidden font-medium sm:inline">
        AgentForge is coming soon — join the waitlist to get early access
      </span>
      <span className="font-medium sm:hidden">Join the waitlist</span>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          toast.success("You're on the list! We'll be in touch soon.")
          setEmail("")
        }}
      >
        <Input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-7 w-48 text-xs"
          required
        />
        <Button type="submit" size="sm" className="h-7 text-xs">
          Join
        </Button>
      </form>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
