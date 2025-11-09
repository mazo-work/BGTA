"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tags } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage and customize your spending categories</p>
        </div>

        <Card className="rounded-3xl border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="w-5 h-5" />
              Spending Categories
            </CardTitle>
            <CardDescription>Organize and track spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon - Category management tools will be available here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
