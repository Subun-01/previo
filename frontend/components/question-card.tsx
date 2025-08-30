"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Send } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onSubmitAnswer: (answer: string) => Promise<void>
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const isAnswered = !!question.answer

  // Load saved draft answer on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_answer_${question.id}`)
    if (savedDraft && !isAnswered) {
      setAnswer(savedDraft)
      setHasDraft(true)
    } else if (question.answer) {
      setAnswer(question.answer)
      setHasDraft(false)
    }
  }, [question.id, question.answer, isAnswered])

  // Save draft answer as user types
  const handleAnswerChange = (value: string) => {
    setAnswer(value)
    if (!isAnswered) {
      localStorage.setItem(`draft_answer_${question.id}`, value)
      setHasDraft(!!value.trim())
    }
  }

  const clearDraftAnswer = () => {
    localStorage.removeItem(`draft_answer_${question.id}`)
    setHasDraft(false)
  }

  const handleSubmit = async () => {
    if (!answer.trim() || isAnswered) return

    setIsLoading(true)
    await onSubmitAnswer(answer)
    clearDraftAnswer() // Clear draft after successful submission
    setIsLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 7) return <CheckCircle className="h-5 w-5 text-green-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const renderInputField = () => {
    switch (question.type) {
      case "mcq":
        // Debug log for MCQ options
        // console.log('MCQ Question:', question.question, 'Options:', question.options, 'Full question object:', question)
        
        if (!question.options || question.options.length === 0) {
          return (
            <div className="space-y-2">
              <Alert variant="destructive">
                <AlertDescription>
                  No options available for this multiple choice question. The question may not have been generated properly.
                </AlertDescription>
              </Alert>
              <Textarea
                placeholder="Please type your answer instead..."
                value={answer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                disabled={isAnswered}
                className="min-h-20"
              />
            </div>
          )
        }
        
        return (
          <RadioGroup value={answer} onValueChange={handleAnswerChange} disabled={isAnswered}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "code":
        return (
          <Textarea
            placeholder="Write your code here..."
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={isAnswered}
            className="min-h-40 font-mono"
          />
        )
      case "long-answer":
        return (
          <Textarea
            placeholder="Write your detailed answer here..."
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={isAnswered}
            className="min-h-32"
          />
        )
      default: // short-answer
        return (
          <Textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={isAnswered}
            className="min-h-20"
          />
        )
    }
  }

  return (
    <Card variant="glass" className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline">{question.type}</Badge>
            {hasDraft && !isAnswered && (
              <Badge variant="secondary" className="text-xs">
                Draft Saved
              </Badge>
            )}
            {isAnswered && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Submitted
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <CardTitle className="text-lg mb-3">Question</CardTitle>
          <p className="text-foreground leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Answer
            </label>
            {renderInputField()}
          </div>

          {!isAnswered ? (
            <Button onClick={handleSubmit} disabled={!answer.trim() || isLoading} className="w-full" variant="gradient">
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
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
              <Alert className="border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">Submitted Answer</h4>
                    <p className="text-sm text-blue-700 mt-1">{question.answer}</p>
                  </div>
                </div>
              </Alert>

              {question.feedback && (
                <Alert className="border-l-4 border-l-primary">
                  <div className="flex items-start gap-3">
                    {getScoreIcon(question.feedback.score)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Feedback</h4>
                        <span className={cn("font-bold text-lg", getScoreColor(question.feedback.score))}>
                          {question.feedback.score} 
                        </span>
                          <span>
                            out of 10
                          </span>
                      </div>
                      <AlertDescription className="text-sm leading-relaxed">
                        {question.feedback.feedback}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
