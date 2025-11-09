"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Financial Goals</h1>
          <p className="text-muted-foreground">Set and track your financial goals</p>
        </div>

        <Card className="rounded-3xl border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Goals
            </CardTitle>
            <CardDescription>Set savings and spending targets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Coming soon - Goal tracking and progress visualization will be available here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
