const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "An error occurred" }
      }

      return { data }
    } catch (error) {
      return { error: "Network error occurred" }
    }
  }

  // Auth endpoints
  async register(email: string, password: string) {
    return this.request<{ user: any }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async login(email: string, password: string) {
    return this.request<{ user: any; session: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // User endpoints
  async savePreferences(targetRole: string, weakTopics: string[], durationWeeks: number) {
    return this.request<{ preference: any }>("/api/user/preferences", {
      method: "POST",
      body: JSON.stringify({ targetRole, weakTopics, durationWeeks }),
    })
  }

  async generateRoadmap(targetRole: string, durationWeeks: number) {
    return this.request<{ roadmap: any }>("/api/user/generate-roadmap", {
      method: "POST",
      body: JSON.stringify({ targetRole, durationWeeks }),
    })
  }

  async generateQuestions(
    targetRole: string,
    topic: string,
    roadmap: any,
    day: number,
    numberOfQuestions: number,
    questionType: string,
  ) {
    return this.request<{ questions: any[] }>("/api/user/generate-questions", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        topic,
        roadmap,
        day,
        numberOfQuestions,
        questionType,
      }),
    })
  }

  async submitAnswer(
    question: string,
    answer: string,
    topic: string,
    day: number,
    questionType: string,
    roadmap: any,
    targetRole: string,
  ) {
    return this.request<{ feedback: { feedback: string; score: number } }>("/api/user/submit-answer", {
      method: "POST",
      body: JSON.stringify({
        question,
        answer,
        topic,
        day,
        questionType,
        roadmap,
        targetRole,
      }),
    })
  }

  async getPreferences() {
    return this.request<{ preferences: any }>("/api/user/get-preferences", {
      method: "GET",
    })
  }
}

export const apiClient = new ApiClient()
