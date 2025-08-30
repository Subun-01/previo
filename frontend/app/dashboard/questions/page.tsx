"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QuestionSetup } from "@/components/question-setup"
import { QuestionCard } from "@/components/question-card"
import { AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api"

interface Question {
  id: string
  question: string
  options?: string[]
  type: "mcq" | "short-answer" | "long-answer" | "code"
  answer?: string
  feedback?: {
    feedback: string
    score: number
  }
}

interface SessionConfig {
  topic: string
  day: number
  numberOfQuestions: number
  questionType: string
}

export default function QuestionsPage() {
  const [preferences, setPreferences] = useState<any[]>([])
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasExistingSession, setHasExistingSession] = useState(false)

  useEffect(() => {
    fetchPreferences()
    loadSavedSession()
  }, [])

  const loadSavedSession = () => {
    try {
      const savedConfig = localStorage.getItem("questionSession_config")
      const savedQuestions = localStorage.getItem("questionSession_questions")
      
      if (savedConfig && savedQuestions) {
        const config = JSON.parse(savedConfig)
        const questions = JSON.parse(savedQuestions)
        setHasExistingSession(true)
        // Auto-resume if there are already answered questions
        const hasAnsweredQuestions = questions.some((q: Question) => q.answer)
        if (hasAnsweredQuestions) {
          setSessionConfig(config)
          setQuestions(questions)
        }
      }
    } catch (err) {
      console.error("Failed to load saved session:", err)
    }
  }

  const resumeSession = () => {
    try {
      const savedConfig = localStorage.getItem("questionSession_config")
      const savedQuestions = localStorage.getItem("questionSession_questions")
      
      if (savedConfig && savedQuestions) {
        setSessionConfig(JSON.parse(savedConfig))
        setQuestions(JSON.parse(savedQuestions))
        setHasExistingSession(false)
      }
    } catch (err) {
      console.error("Failed to resume session:", err)
    }
  }

  const saveSession = (config: SessionConfig, questions: Question[]) => {
    try {
      localStorage.setItem("questionSession_config", JSON.stringify(config))
      localStorage.setItem("questionSession_questions", JSON.stringify(questions))
    } catch (err) {
      console.error("Failed to save session:", err)
    }
  }

  const clearSavedSession = () => {
    localStorage.removeItem("questionSession_config")
    localStorage.removeItem("questionSession_questions")
    // Clear all draft answers
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("draft_answer_")) {
        localStorage.removeItem(key)
      }
    })
    setHasExistingSession(false)
  }

  const fetchPreferences = async () => {
    try {
      const response = await apiClient.getPreferences()
      const prefArr = response && response.data && Array.isArray(response.data.preferences)
        ? response.data.preferences.map(item => item.preference)
        : []
      
      setPreferences(prefArr)
      setAvailableTopics(prefArr.map(item => item.weakTopics).flat())
    } catch (err) {
      console.error("Failed to fetch preferences:", err)
    }
  }

  const startSession = async (config: SessionConfig) => {
    if (!preferences.length) {
      setError("Please set your preferences first")
      return
    }

    setIsLoading(true)
    setError("")
    setSessionConfig(config)

    try {
      const response = await apiClient.generateQuestions(
        preferences[0].targetRole || "Developer",
        config.topic,
        // config.day,
        config.numberOfQuestions,
        config.questionType,
      )
      // console.log(response)

      if (response.error) {
        setError(response.error)
        setSessionConfig(null)
      } else if (response.data) {
        const transformedQuestions: Question[] = response.data.questions.map((q: any, index: number) => {
          // console.log('Question data:', q) // Debug log to see the structure
          return {
            id: `q-${index}`,
            question: q.question || q.text || q,
            options: q.choices || q.options || undefined, // Backend uses 'choices' for MCQ options
            type: mapQuestionType(config.questionType),
          }
        })
        setQuestions(transformedQuestions)
        // Save the session to localStorage
        saveSession(config, transformedQuestions)
      }
    } catch (err) {
      setError("Failed to generate questions. Please try again.")
      setSessionConfig(null)
    }

    setIsLoading(false)
  }

  const mapQuestionType = (type: string): "mcq" | "short-answer" | "long-answer" | "code" => {
    switch (type) {
      case "multiple-choice": return "mcq"
      case "short-answer": return "short-answer"
      case "Long answer": return "long-answer"
      case "code-review": 
      case "problem-solving": return "code"
      default: return "short-answer"
    }
  }

  const submitAnswer = async (questionId: string, answer: string) => {
    const questionIndex = questions.findIndex(q => q.id === questionId)
    if (questionIndex === -1 || !sessionConfig || !preferences.length) return

    try {
      const response = await apiClient.submitAnswer(
        questions[questionIndex].question,
        answer,
        sessionConfig.topic,
        // sessionConfig.day,
        sessionConfig.questionType,
        // "roadmap-placeholder",
        preferences[0].targetRole || "Developer",
      )

      if (response.data) {
        const updatedQuestions = [...questions]
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          answer,
          feedback: response.data.feedback
        }
        setQuestions(updatedQuestions)
        // Update localStorage with new answer and feedback
        if (sessionConfig) {
          saveSession(sessionConfig, updatedQuestions)
        }
      }
    } catch (err) {
    console.error("Error submitting answer:", err)
  }
}

  const endSession = () => {
    setSessionConfig(null)
    setQuestions([])
    clearSavedSession()
  }

  return (
    <>
      <DashboardHeader
        title="Practice Questions"
        description="Test your knowledge with AI-generated questions tailored to your learning path"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {!preferences.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Setup Required
                </CardTitle>
                <CardDescription>
                  You need to set your preferences before practicing questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild>
                  <a href="/dashboard/preferences">Set Preferences</a>
                </Button>
              </CardContent>
            </Card>
          ) : sessionConfig && questions.length > 0 ? (
            // Active Session - Show all questions
            <div className="space-y-6">
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Practice Session</CardTitle>
                    <CardDescription>
                      Topic: {sessionConfig.topic} • Day {sessionConfig.day} • Type: {sessionConfig.questionType}
                    </CardDescription>
                  </div>
                  <Button variant="neon" onClick={endSession}>
                    End Session
                  </Button>
                </div>
              </CardHeader>
            </Card>              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={questions.length}
                  onSubmitAnswer={(answer) => submitAnswer(question.id, answer)}
                />
              ))}
            </div>
          ) : (
            // Setup Form
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <QuestionSetup 
                topics={availableTopics} 
                onStartSession={startSession} 
                isLoading={isLoading}
                hasExistingSession={hasExistingSession && !sessionConfig}
                onResumeSession={resumeSession}
              />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
