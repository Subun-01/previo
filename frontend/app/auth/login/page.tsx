"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleAuth = async (email: string, password: string) => {
    if (mode === "login") {
      const result = await login(email, password)
      if (result.success) {
        router.push("/dashboard")
      }
      return result
    } else {
      // Handle registration - will be implemented when register is added
      return { success: false, error: "Registration not implemented yet" }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <AuthForm
          mode={mode}
          onSubmit={handleAuth}
          onModeChange={() => setMode(mode === "login" ? "register" : "login")}
        />
      </div>
    </div>
  )
}
