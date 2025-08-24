"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  question: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  type: string
}

interface Feedback {
  feedback: string
  score: number
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onSubmitAnswer: (answer: string) => Promise<Feedback | null>
  onNext: () => void
  className?: string
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  onNext,
  className,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!answer.trim()) return

    setIsLoading(true)
    const result = await onSubmitAnswer(answer)
    setFeedback(result)
    setIsSubmitted(true)
    setIsLoading(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-5 w-5 text-green-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <Card className={cn("w-full max-w-3xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary">{question.topic}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
        <Progress value={(questionNumber / totalQuestions) * 100} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <CardTitle className="text-lg mb-3">Question</CardTitle>
          <p className="text-foreground leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="answer" className="text-sm font-medium text-foreground mb-2 block">
              Your Answer
            </label>
            <Textarea
              id="answer"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isSubmitted}
              className="min-h-32"
            />
          </div>

          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!answer.trim() || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Answer...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Answer
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              {feedback && (
                <Alert className="border-l-4 border-l-primary">
                  <div className="flex items-start gap-3">
                    {getScoreIcon(feedback.score)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Feedback</h4>
                        <span className={cn("font-bold text-lg", getScoreColor(feedback.score))}>
                          {feedback.score}%
                        </span>
                      </div>
                      <AlertDescription className="text-sm leading-relaxed">{feedback.feedback}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              <Button onClick={onNext} className="w-full">
                {questionNumber === totalQuestions ? "Finish Session" : "Next Question"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
