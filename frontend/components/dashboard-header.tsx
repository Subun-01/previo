"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "./dashboard-nav"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardNav />
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gradient">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-muted-foreground">{user?.email}</div>
          <Button variant="glass" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>
  )
}
