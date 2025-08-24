"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Play } from "lucide-react"

interface QuestionSetupProps {
  topics: string[]
  onStartSession: (config: {
    topic: string
    day: number
    numberOfQuestions: number
    questionType: string
  }) => void
  isLoading?: boolean
}

const questionTypes = [
  { label: "Multiple Choice", value: "multiple-choice" },
  { label: "Short Answer", value: "short-answer" },
  { label: "Essay", value: "essay" },
  { label: "Code Review", value: "code-review" },
  { label: "Problem Solving", value: "problem-solving" },
]

export function QuestionSetup({ topics, onStartSession, isLoading = false }: QuestionSetupProps) {
  const [topic, setTopic] = useState("")
  const [day, setDay] = useState("")
  const [numberOfQuestions, setNumberOfQuestions] = useState("")
  const [questionType, setQuestionType] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!topic || !day || !numberOfQuestions || !questionType) {
      setError("Please fill in all fields")
      return
    }

    const dayNum = Number.parseInt(day)
    const questionsNum = Number.parseInt(numberOfQuestions)

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 365) {
      setError("Day must be between 1 and 365")
      return
    }

    if (isNaN(questionsNum) || questionsNum < 1 || questionsNum > 20) {
      setError("Number of questions must be between 1 and 20")
      return
    }

    onStartSession({
      topic,
      day: dayNum,
      numberOfQuestions: questionsNum,
      questionType,
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Start Practice Session</CardTitle>
        <CardDescription>Configure your practice session to get personalized questions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic to practice" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topicOption) => (
                  <SelectItem key={topicOption} value={topicOption}>
                    {topicOption.charAt(0).toUpperCase() + topicOption.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day in Roadmap</Label>
              <Input
                id="day"
                type="number"
                min="1"
                max="365"
                placeholder="e.g., 5"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                id="questions"
                type="number"
                min="1"
                max="20"
                placeholder="e.g., 5"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Question Type</Label>
            <Select value={questionType} onValueChange={setQuestionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Play className="mr-2 h-4 w-4" />
            Start Practice Session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
