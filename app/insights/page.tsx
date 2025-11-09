"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Insights</h1>
          <p className="text-muted-foreground">AI-powered financial insights and recommendations</p>
        </div>

        <Card className="rounded-3xl border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Financial Insights
            </CardTitle>
            <CardDescription>Personalized recommendations based on your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Coming soon - Advanced AI insights and recommendations will be available here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
