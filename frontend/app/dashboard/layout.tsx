import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border">
          <DashboardNav />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </ProtectedRoute>
  )
}
