"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

type TimePeriod = "daily" | "weekly" | "monthly"

export default function AISummary({ timePeriod }: { timePeriod: TimePeriod }) {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateSummary()
  }, [timePeriod])

  const generateSummary = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timePeriod }),
      })
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Error generating summary:", error)
      setSummary("Unable to generate summary at this time.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-lg">✨</span>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-foreground mb-2 capitalize">{timePeriod} AI Insights</h3>

          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-primary/20 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-primary/20 rounded-full w-5/6 animate-pulse"></div>
              <div className="h-4 bg-primary/20 rounded-full w-4/5 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed text-sm">{summary}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
