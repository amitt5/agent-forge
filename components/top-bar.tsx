"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export function TopBar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b border-border bg-card px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-xs font-medium text-primary">JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-foreground">Jane Developer</p>
            <p className="text-xs text-muted-foreground">jane@example.com</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("This is a demo — sign up to use the real thing")}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
