"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QuestionSetup } from "@/components/question-setup"
import { QuestionCard } from "@/components/question-card"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, AlertCircle, BookOpen } from "lucide-react"
import { apiClient } from "@/lib/api"

interface Question {
  id: string
  question: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  type: string
}

interface SessionConfig {
  topic: string
  day: number
  numberOfQuestions: number
  questionType: string
}

interface SessionResults {
  totalQuestions: number
  averageScore: number
  scores: number[]
  topic: string
}

export default function QuestionsPage() {
  const [preferences, setPreferences] = useState<any>(null)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sessionResults, setSessionResults] = useState<SessionResults | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Load preferences and roadmap from localStorage
    const savedPreferences = localStorage.getItem("user_preferences")
    const savedRoadmap = localStorage.getItem("user_roadmap")

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (err) {
        console.error("Failed to parse preferences:", err)
      }
    }

    if (savedRoadmap) {
      try {
        setRoadmap(JSON.parse(savedRoadmap))
      } catch (err) {
        console.error("Failed to parse roadmap:", err)
      }
    }
  }, [])

  const startSession = async (config: SessionConfig) => {
    if (!preferences || !roadmap) {
      setError("Please set your preferences and generate a roadmap first")
      return
    }

    setIsLoading(true)
    setError("")
    setSessionConfig(config)

    try {
      const response = await apiClient.generateQuestions(
        preferences.targetRole,
        config.topic,
        roadmap,
        config.day,
        config.numberOfQuestions,
        config.questionType,
      )

      if (response.error) {
        setError(response.error)
        setSessionConfig(null)
      } else if (response.data) {
        // Transform API response to match our Question interface
        const transformedQuestions: Question[] = response.data.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question || q.text || q,
          topic: config.topic,
          difficulty: q.difficulty || "medium",
          type: config.questionType,
        }))
        setQuestions(transformedQuestions)
        setCurrentQuestionIndex(0)
        setScores([])
      }
    } catch (err) {
      setError("Failed to generate questions. Please try again.")
      setSessionConfig(null)
    }

    setIsLoading(false)
  }

  const submitAnswer = async (answer: string): Promise<{ feedback: string; score: number } | null> => {
    if (!sessionConfig || !preferences || !roadmap) return null

    const currentQuestion = questions[currentQuestionIndex]

    try {
      const response = await apiClient.submitAnswer(
        currentQuestion.question,
        answer,
        sessionConfig.topic,
        sessionConfig.day,
        sessionConfig.questionType,
        roadmap,
        preferences.targetRole,
      )

      if (response.error) {
        console.error("Failed to submit answer:", response.error)
        return { feedback: "Failed to get feedback. Please try again.", score: 0 }
      }

      if (response.data) {
        const feedback = response.data.feedback
        setScores((prev) => [...prev, feedback.score])
        return feedback
      }
    } catch (err) {
      console.error("Error submitting answer:", err)
    }

    return { feedback: "Failed to get feedback. Please try again.", score: 0 }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Session complete
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      setSessionResults({
        totalQuestions: questions.length,
        averageScore,
        scores,
        topic: sessionConfig?.topic || "",
      })
    }
  }

  const resetSession = () => {
    setSessionConfig(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSessionResults(null)
    setScores([])
    setError("")
  }

  // Mock topics from preferences or default list
  const availableTopics = preferences?.weakTopics || [
    "javascript",
    "react",
    "nodejs",
    "python",
    "algorithms",
    "system-design",
  ]

  return (
    <>
      <DashboardHeader
        title="Practice Questions"
        description="Test your knowledge with AI-generated questions tailored to your learning path"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {!preferences ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Setup Required
                </CardTitle>
                <CardDescription>
                  You need to set your preferences and generate a roadmap before practicing questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <a href="/dashboard/preferences">Set Preferences</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/dashboard/roadmap">Generate Roadmap</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : sessionResults ? (
            // Session Results
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Session Complete!
                </CardTitle>
                <CardDescription>Great job! Here's how you performed in this practice session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{sessionResults.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">Questions Answered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{Math.round(sessionResults.averageScore)}%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {sessionResults.topic.replace("-", " ")}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Topic Practiced</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Individual Scores</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {sessionResults.scores.map((score, index) => (
                      <div key={index} className="text-center p-2 bg-muted rounded">
                        <p className="font-medium">Q{index + 1}</p>
                        <p className="text-sm text-muted-foreground">{score}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={resetSession} className="flex-1">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start New Session
                  </Button>
                  <Button variant="outline" onClick={resetSession} className="flex-1 bg-transparent">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Practice Same Topic
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : sessionConfig && questions.length > 0 ? (
            // Active Session
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Session</CardTitle>
                  <CardDescription>
                    Topic: {sessionConfig.topic.replace("-", " ")} • Day {sessionConfig.day} • Type:{" "}
                    {sessionConfig.questionType.replace("-", " ")}
                  </CardDescription>
                </CardHeader>
              </Card>

              <QuestionCard
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onSubmitAnswer={submitAnswer}
                onNext={nextQuestion}
              />
            </div>
          ) : (
            // Setup Form
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <QuestionSetup topics={availableTopics} onStartSession={startSession} isLoading={isLoading} />

              {/* Recent Sessions (placeholder) */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Practice Sessions</CardTitle>
                  <CardDescription>Your latest practice activities and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No practice sessions yet. Start your first session above!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
