"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "./api"

interface User {
  id: string
  email: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password)

    if (response.error) {
      return { success: false, error: response.error }
    }

    if (response.data) {
      const { user, session } = response.data
      localStorage.setItem("auth_token", session.token || session.access_token)
      localStorage.setItem("user_data", JSON.stringify(user))
      setUser(user)
      return { success: true }
    }

    return { success: false, error: "Login failed" }
  }

  const register = async (email: string, password: string) => {
    const response = await apiClient.register(email, password)

    if (response.error) {
      return { success: false, error: response.error }
    }

    if (response.data) {
      const { user } = response.data
      // Auto-login after registration
      const loginResult = await login(email, password)
      return loginResult
    }

    return { success: false, error: "Registration failed" }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
