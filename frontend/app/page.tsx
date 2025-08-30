"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Target, Brain, TrendingUp } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!isLoading && user) {
  //     router.push("/dashboard")
  //   }
  // }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-max py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">Master Your Learning Journey</h1>
          <p className="text-xl opacity-70 mb-8 max-w-2xl mx-auto">
            Get personalized roadmaps, practice with targeted questions, and track your progress towards your career
            goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/auth/register")}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <Card>
            <CardHeader>
        <Target className="h-8 w-8 text-gradient mb-2" />
              <CardTitle>Personalized Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get custom learning paths tailored to your target role and timeline.</CardDescription>
            </CardContent>
          </Card>

      <Card>
            <CardHeader>
        <Brain className="h-8 w-8 text-gradient mb-2" />
              <CardTitle>Smart Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Practice with AI-generated questions that adapt to your learning progress.
              </CardDescription>
            </CardContent>
          </Card>

      <Card>
            <CardHeader>
        <TrendingUp className="h-8 w-8 text-gradient mb-2" />
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your improvement with detailed feedback and performance analytics.
              </CardDescription>
            </CardContent>
          </Card>

      <Card>
            <CardHeader>
        <BookOpen className="h-8 w-8 text-gradient mb-2" />
              <CardTitle>Focused Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Target your weak areas with customized practice sessions and resources.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
