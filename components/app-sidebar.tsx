"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  FolderOpen,
  FlaskConical,
  History,
  Lightbulb,
  ListChecks,
  Play,
  Settings,
  ScrollText,
  Users,
  Zap,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProjects } from "@/hooks/use-projects"

const projectNavItems = [
  { label: "Overview", icon: Zap, href: "" },
  { label: "Agent Config", icon: Bot, href: "/config" },
  { label: "Personas", icon: Users, href: "/personas" },
  { label: "Scenarios", icon: ListChecks, href: "/scenarios" },
  { label: "Test Scripts", icon: ScrollText, href: "/scripts" },
  { label: "Test Runs", icon: Play, href: "/runs" },
  { label: "Improvements", icon: Lightbulb, href: "/improvements" },
  { label: "Version History", icon: History, href: "/history" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: projects, isLoading } = useProjects()
  const projectMatch = pathname.match(/^\/projects\/([^/]+)/)
  const activeProjectId = projectMatch ? projectMatch[1] : null
  const activeProject = projects?.find((p) => p.id === activeProjectId)

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <FlaskConical className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold text-foreground">AgentForge</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {activeProject ? (
          <>
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Projects
            </Link>
            <div className="mb-4 rounded-md border border-border bg-secondary/50 px-3 py-2">
              <p className="text-sm font-medium text-foreground">{activeProject.name}</p>
              <p className="text-xs text-muted-foreground">{activeProject.tag}</p>
            </div>
            <div className="flex flex-col gap-0.5">
              {projectNavItems.map((item) => {
                const href = `/projects/${activeProjectId}${item.href}`
                const isActive =
                  item.href === ""
                    ? pathname === `/projects/${activeProjectId}`
                    : pathname.startsWith(href)
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Projects
            </p>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <span className="flex items-center gap-2.5">
                      <FolderOpen className="h-4 w-4" />
                      {project.name}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-2 py-4 text-center">
                <p className="text-xs text-muted-foreground">No projects yet</p>
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  )
}
