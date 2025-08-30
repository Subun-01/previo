"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { BookOpen, Target, TrendingUp, Clock, Settings } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <DashboardHeader title="Dashboard" description="Track your learning progress and continue your journey" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+12 from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Studied</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24h</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div> */}

          {/* Quick Actions */}
          {/* <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Get started with your personalized learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profile Setup</span>
                    <span className="text-muted-foreground">Complete</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Learning Preferences</span>
                    <span className="text-muted-foreground">Pending</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>First Roadmap</span>
                    <span className="text-muted-foreground">Not Started</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <Link href="/dashboard/preferences">
                  <Button className="w-full">Set Up Preferences</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning activities and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Account created</p>
                      <p className="text-xs text-muted-foreground">Welcome to the platform!</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Just now</div>
                  </div>

                  <div className="flex items-center space-x-4 opacity-50">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Preferences set</p>
                      <p className="text-xs text-muted-foreground">Ready to generate roadmap</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>

                  <div className="flex items-center space-x-4 opacity-50">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">First roadmap generated</p>
                      <p className="text-xs text-muted-foreground">Your learning path is ready</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Navigation Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard/preferences">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Set your target role, weak topics, and learning duration</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard/roadmap">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Roadmap
                  </CardTitle>
                  <CardDescription>Generate and view your personalized learning roadmap</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard/questions">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Questions
                  </CardTitle>
                  <CardDescription>Practice with AI-generated questions and get feedback</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
