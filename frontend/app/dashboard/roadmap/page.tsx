"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RoadmapTimeline } from "@/components/roadmap-timeline"
import { Loader2, Map, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api"
import { log } from "console"


interface UserPreferences {
  targetRole: string;
  weakTopics: string[];
  durationWeeks: number | 6; // Default to 6 if not provided
}

interface RoadmapPreferenceRow {
  id: string;
  preference: UserPreferences;
  data: any; // Assuming 'data' contains the roadmap details
}

export default function RoadmapPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [allPreferences, setAllPreferences] = useState<RoadmapPreferenceRow[]>([])
  const [selectedPrefId, setSelectedPrefId] = useState<string>("")
  const [roadmap, setRoadmap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch all preferences from backend
    async function fetchPreferences() {
      try {
        const response = await apiClient.getPreferences();
        // console.log(response);
        
        // The backend returns { preferences: [...] }, but apiClient returns { preference: [...] }
        const prefArr = response && response.data && Array.isArray(response.data.preferences)
          ? response.data.preferences
          : [];
        
          
  setAllPreferences(prefArr);
  setSelectedPrefId("");
  setPreferences(null); 
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
      }
    }
    fetchPreferences();

    // Load existing roadmap if available
    const savedRoadmap = localStorage.getItem("user_roadmap");
    if (savedRoadmap) {
      try {
        const pRoadmap = JSON.parse(savedRoadmap);
        setRoadmap(pRoadmap);
      } catch (err) {
        console.error("Failed to parse roadmap:", err);
      }
    }
  }, []);

  const generateRoadmap = async () => {
    if (!preferences) {
      setError("Please set your preferences first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.generateRoadmap(preferences.targetRole, preferences.durationWeeks)

      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setRoadmap(response.data.roadmap.data)
        // Save roadmap to localStorage
        localStorage.setItem("user_roadmap", JSON.stringify(response.data.roadmap))
      }
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.")
    }

    setIsLoading(false)
  }

  // Handle preference selection change
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prefId = e.target.value;
    setSelectedPrefId(prefId);
    const found = allPreferences.find((p) => p.id === prefId);
    if (found) {
      setPreferences(found.preference);
      const founData = found.data;
      found.data?localStorage.setItem("user_roadmap", JSON.stringify(found.data)):localStorage.removeItem("user_roadmap");
      setRoadmap(founData);
      

    }
    else {
      setPreferences(null);
      setRoadmap(null);
      localStorage.removeItem("user_roadmap");
    }
  }



  return (
    <>
      <DashboardHeader
        title="Learning Roadmap"
        description="Your personalized learning path based on your goals and preferences"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {allPreferences.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Preferences Required
                </CardTitle>
                <CardDescription>
                  You need to set your learning preferences before generating a roadmap.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/dashboard/preferences">Set Preferences</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Preference Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Select a Preference</CardTitle>
                  <CardDescription>Choose which set of preferences to use for your roadmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <select
                    className="w-full border rounded p-2"
                    value={selectedPrefId}
                    onChange={handlePreferenceChange}
                  >
                    <option value="">Select one</option>
                    {allPreferences.map((pref) => (
                      <option key={pref.id} value={pref.id}>
                        {pref.preference.targetRole}, {pref.preference.weakTopics.length} topics
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>
              {/* Preferences Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Goals</CardTitle>
                  <CardDescription>Based on your preferences, here's your personalized roadmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Target Role</p>
                      <p className="text-lg font-semibold">{preferences ? preferences.targetRole : ""}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Duration(in weeks)</p>
                      <p className="text-lg font-semibold">{preferences ? preferences.durationWeeks:""}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Focus Areas</p>
                      <p className="text-lg font-semibold">
                        {preferences && preferences.weakTopics && preferences.weakTopics.length > 0
                          ? preferences.weakTopics.join(", ")
                          : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate/Regenerate Roadmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    {roadmap ? "Regenerate Roadmap" : "Generate Roadmap"}
                  </CardTitle>
                  <CardDescription>
                    {roadmap
                      ? "Create a new roadmap with updated content"
                      : "Create your personalized learning roadmap based on your preferences"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={generateRoadmap} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {roadmap ? <RefreshCw className="mr-2 h-4 w-4" /> : <Map className="mr-2 h-4 w-4" />}
                    {roadmap ? "Regenerate Roadmap" : "Generate Roadmap"}
                  </Button>
                </CardContent>
              </Card>

              {/* Roadmap Display */}
              {(roadmap) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Your Learning Roadmap
                    </CardTitle>
                    <CardDescription>
                      Follow this step-by-step plan to achieve your learning goals
                      {!roadmap && " (generate your roadmap above)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RoadmapTimeline  roadmap={roadmap?.weeks || []} />
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              {(roadmap) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Start Learning?</CardTitle>
                    <CardDescription>Begin practicing with questions tailored to your roadmap</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <a href="/dashboard/questions">Start Practicing</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
