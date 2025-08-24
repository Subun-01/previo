"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { User, Settings, Map, HelpCircle, LogOut } from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: User,
  },
  {
    title: "Preferences",
    href: "/dashboard/preferences",
    icon: Settings,
  },
  {
    title: "Roadmap",
    href: "/dashboard/roadmap",
    icon: Map,
  },
  {
    title: "Questions",
    href: "/dashboard/questions",
    icon: HelpCircle,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground">Learning Platform</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-secondary text-secondary-foreground")}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
