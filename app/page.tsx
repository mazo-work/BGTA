"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import SpendingOverview from "@/components/spending-overview"
import CategoryBreakdown from "@/components/category-breakdown"
import AISummary from "@/components/ai-summary"
import TransactionList from "@/components/transaction-list"

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("monthly")
  const [showAISummary, setShowAISummary] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950">
      <DashboardHeader />

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Financial Overview</h1>
              <p className="text-muted-foreground">Track your spending and income trends</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Time Period Toggle */}
              <div className="flex gap-2 bg-card rounded-full p-1 border border-border">
                {(["daily", "weekly", "monthly"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      timePeriod === period
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              {/* AI Summary Toggle */}
              <button
                onClick={() => setShowAISummary(!showAISummary)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  showAISummary
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {showAISummary ? "✓ AI Summary" : "AI Summary"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Spending Overview - Takes 2 columns */}
          <div className="lg:col-span-2">
            <SpendingOverview timePeriod={timePeriod} />
          </div>

          {/* Category Breakdown - Takes 1 column */}
          <CategoryBreakdown />
        </div>

        {/* AI Summary */}
        {showAISummary && (
          <div className="mb-6">
            <AISummary timePeriod={timePeriod} />
          </div>
        )}

        {/* Transactions */}
        <TransactionList />
      </main>
    </div>
  )
}
