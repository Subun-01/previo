"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Circle} from "lucide-react"
import { cn } from "@/lib/utils"


interface RoadmapTopic {
  name: string;
  subtopics?: string[];
}

interface RoadmapWeek {
  week: number;
  topics: RoadmapTopic[];
}

interface RoadmapTimelineProps {
  roadmap: RoadmapWeek[];
}

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <div className={cn("space-y-6")}>
    {roadmap?.map((weekItem: RoadmapWeek, weekIdx: number) => (
        <div key={weekItem.week} className="relative">
          {/* Timeline line */}
          {weekIdx < roadmap.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-20 bg-border" />}

          <div className="flex items-start space-x-4">
            {/* Timeline dot */}
            <div className="flex-shrink-0 mt-4">
              <Circle className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Content */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Week {weekItem.week}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Topics */}
      {weekItem.topics.map((topic: RoadmapTopic, topicIdx: number) => (
                  <div key={topic.name + topicIdx} className="mb-2">
                    <Badge variant="outline" className="text-xs mb-1">
                      {topic.name}
                    </Badge>
                    {topic.subtopics && topic.subtopics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1 ml-2">
        {topic.subtopics.map((sub: string, subIdx: number) => (
                          <Badge key={sub + subIdx} variant="secondary" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  )
}
