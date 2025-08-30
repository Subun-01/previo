"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

const targetRoleOptions = [
  { label: "Frontend Developer", value: "frontend-developer" },
  { label: "Backend Developer", value: "backend-developer" },
  { label: "Full Stack Developer", value: "fullstack-developer" },
  { label: "DevOps Engineer", value: "devops-engineer" },
  { label: "Data Scientist", value: "data-scientist" },
  { label: "Machine Learning Engineer", value: "ml-engineer" },
  { label: "Product Manager", value: "product-manager" },
  { label: "UI/UX Designer", value: "ui-ux-designer" },
  { label: "Mobile Developer", value: "mobile-developer" },
  { label: "Cloud Architect", value: "cloud-architect" },
]

const weakTopicsOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "SQL", value: "sql" },
  { label: "NoSQL", value: "nosql" },
  { label: "System Design", value: "system-design" },
  { label: "Algorithms", value: "algorithms" },
  { label: "Data Structures", value: "data-structures" },
  { label: "Machine Learning", value: "machine-learning" },
  { label: "Cloud Computing", value: "cloud-computing" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "Git", value: "git" },
  { label: "Testing", value: "testing" },
  { label: "API Design", value: "api-design" },
  { label: "Database Design", value: "database-design" },
]

interface UserPreferences {
  targetRole: string;
  weakTopics: string[];
  durationWeeks: number | 6; // Default to 6 if not provided
}


export default function PreferencesPage() {

  const [allPreferences, setAllPreferences] = useState<UserPreferences[]>([])
  const [targetRole, setTargetRole] = useState("")
  const [weakTopics, setWeakTopics] = useState<string[]>([])
  const [durationWeeks, setDurationWeeks] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    if (!targetRole || weakTopics.length === 0 || !durationWeeks) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    const duration = Number.parseInt(durationWeeks)
    if (isNaN(duration) || duration < 1 || duration > 52) {
      setError("Duration must be between 1 and 52 weeks")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.savePreferences(targetRole, weakTopics, duration)

      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("Failed to save preferences. Please try again.")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await apiClient.getPreferences();
        const prefArr = response && response.data && Array.isArray(response.data.preferences)
          ? response.data.preferences.map(item => item.preference)
          : [];
      
          
    setAllPreferences(prefArr);
        // console.log(prefArr);
        
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
      }
    }
    fetchPreferences();
  },[success])


  return (
    <>
      <DashboardHeader
        title="Learning Preferences"
        description="Customize your learning experience by setting your goals and focus areas"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Learning Goals</CardTitle>
              <CardDescription>
                Tell us about your target role and areas you'd like to improve. This will help us create a personalized
                roadmap for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="target-role">Target Role</Label>
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target role" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetRoleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Choose the role you're aiming for in your career</p>
                </div>

                <div className="space-y-2">
                  <Label>Weak Topics</Label>
                  <MultiSelect
                    options={weakTopicsOptions}
                    selected={weakTopics}
                    onChange={setWeakTopics}
                    placeholder="Select topics you want to improve"
                  />
                  <p className="text-sm text-muted-foreground">
                    Select the areas where you feel you need the most improvement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Learning Duration (weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="52"
                    placeholder="e.g., 12"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    How many weeks do you want to dedicate to this learning plan? (1-52 weeks)
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Preferences saved successfully! You can now generate your personalized roadmap.
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>

          {allPreferences.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Saved Preferences</CardTitle>
                <CardDescription>Your previously saved learning preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {allPreferences.map((pref, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 rounded-md border">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {(() => {
                            const match = targetRoleOptions.find(r => r.value === pref.targetRole)
                            return match ? match.label : pref.targetRole
                          })()}
                        </p>
                        <p className="text-sm opacity-70">
                          {pref.weakTopics.length} topics · {pref.durationWeeks} week{Number(pref.durationWeeks) === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="text-sm opacity-80 md:text-right">
                        {pref.weakTopics.slice(0, 4).join(", ")}
                        {pref.weakTopics.length > 4 && " …"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Your preferences have been saved. Here's what you can do next:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Generate Your Roadmap</p>
                    <p className="text-sm text-muted-foreground">
                      Create a personalized learning path based on your preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Start Practicing</p>
                    <p className="text-sm text-muted-foreground">
                      Answer questions and get feedback on your weak topics
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild>
                    <a href="/dashboard/roadmap">Generate Roadmap</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
