"use client"

import { useState } from "react"
import { useTransactions } from "@/lib/transactions-context"
import CategoryCard from "@/components/category-card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#0ea5e9",
  Food: "#10b981",
  Transport: "#f59e0b",
  Entertainment: "#8b5cf6",
  Utilities: "#06b6d4",
  Other: "#64748b",
}

export default function CategoriesPage() {
  const { transactions, budgetState, setMonthlyBudget, setCategoryBudget } = useTransactions()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("monthly")
  const [showBudgetEdit, setShowBudgetEdit] = useState(false)
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(budgetState.monthlyBudget.toString())
  const [budgetToggle, setBudgetToggle] = useState<"weekly" | "monthly">("monthly")
  const [categoryBudgetEdit, setCategoryBudgetEdit] = useState<string>("")

  const generateTrendData = (category: string, period: "daily" | "weekly" | "monthly") => {
    const categoryTransactions = transactions.filter((t) => t.category === category && t.type === "expense")

    if (period === "daily") {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toISOString().split("T")[0]
      })

      return last7Days.map((date) => {
        const dayTotal = categoryTransactions.filter((t) => t.date === date).reduce((sum, t) => sum + t.amount, 0)
        return { name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }), spent: dayTotal }
      })
    }

    if (period === "weekly") {
      const last4Weeks = Array.from({ length: 4 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (28 - i * 7))
        return date
      })

      return last4Weeks.map((date, i) => {
        const weekStart = new Date(date)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)

        const weekTotal = categoryTransactions
          .filter((t) => {
            const tDate = new Date(t.date)
            return tDate >= weekStart && tDate <= weekEnd
          })
          .reduce((sum, t) => sum + t.amount, 0)

        return { name: `Week ${i + 1}`, spent: weekTotal }
      })
    }

    // Monthly
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return date
    })

    return last6Months.map((date) => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthTotal = categoryTransactions
        .filter((t) => {
          const tDate = new Date(t.date)
          return tDate >= monthStart && tDate <= monthEnd
        })
        .reduce((sum, t) => sum + t.amount, 0)

      return { name: date.toLocaleDateString("en-US", { month: "short" }), spent: monthTotal }
    })
  }

  const selectedCategoryData = selectedCategory ? generateTrendData(selectedCategory, timePeriod) : []
  const selectedCategoryBudget = budgetState.categoryBudgets.find((b) => b.category === selectedCategory)

  const displayBudget = budgetToggle === "weekly" ? budgetState.monthlyBudget / 4.33 : budgetState.monthlyBudget

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Categories</h1>
            <p className="text-muted-foreground">Track spending by category with goals and budgets</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2 bg-card rounded-full p-1 border border-border">
              {(["weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setBudgetToggle(period)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    budgetToggle === period
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">${displayBudget.toFixed(2)}</p>
            </div>
            <Button onClick={() => setShowBudgetEdit(true)} size="sm" className="rounded-lg">
              Edit Budget
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetState.categoryBudgets.map((budget) => (
            <CategoryCard key={budget.category} budget={budget} onEditBudget={setCategoryBudgetEdit} />
          ))}
        </div>
      </div>

      {/* Budget Edit Dialog */}
      <Dialog open={showBudgetEdit} onOpenChange={setShowBudgetEdit}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Monthly Budget</DialogTitle>
            <DialogDescription>Set your total monthly budget</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget Amount ($)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                value={monthlyBudgetInput}
                onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={() => {
                setMonthlyBudget(Number.parseFloat(monthlyBudgetInput))
                setShowBudgetEdit(false)
              }}
              className="w-full rounded-xl"
            >
              Save Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Trends Dialog */}
      <Dialog
        open={!!selectedCategory && !categoryBudgetEdit}
        onOpenChange={(open) => !open && setSelectedCategory(null)}
      >
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCategory} Trends</DialogTitle>
            <DialogDescription>View spending trends for this category</DialogDescription>
          </DialogHeader>

          {selectedCategory && selectedCategoryBudget && (
            <div className="space-y-6">
              {/* Time Period Toggle */}
              <div className="flex gap-2 bg-card rounded-full p-1 border border-border w-fit">
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

              {/* Chart */}
              <div className="h-64">
                <ChartContainer
                  config={{
                    spent: { label: "Spent", color: CATEGORY_COLORS[selectedCategory] || "#64748b" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCategoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                      <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="spent"
                        stroke={CATEGORY_COLORS[selectedCategory] || "#64748b"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-card/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-foreground">
                    ${selectedCategoryData.reduce((sum, item) => sum + item.spent, 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-card/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Budget</p>
                  <p className="text-xl font-bold text-foreground">${selectedCategoryBudget.budget.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-card/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Avg per Period</p>
                  <p className="text-xl font-bold text-foreground">
                    $
                    {(
                      selectedCategoryData.reduce((sum, item) => sum + item.spent, 0) / selectedCategoryData.length
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Category Budget Edit Dialog */}
      {categoryBudgetEdit && (
        <CategoryBudgetDialog
          category={categoryBudgetEdit}
          onClose={() => setCategoryBudgetEdit("")}
          onSave={(newBudget) => {
            setCategoryBudget(categoryBudgetEdit, newBudget)
            setCategoryBudgetEdit("")
          }}
          maxBudget={budgetState.monthlyBudget}
        />
      )}
    </div>
  )
}

function CategoryBudgetDialog({
  category,
  onClose,
  onSave,
  maxBudget,
}: {
  category: string
  onClose: () => void
  onSave: (newBudget: number) => void
  maxBudget: number
}) {
  const { budgetState } = useTransactions()
  const currentBudget = budgetState.categoryBudgets.find((b) => b.category === category)?.budget || 0
  const [input, setInput] = useState(currentBudget.toString())

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit {category} Budget</DialogTitle>
          <DialogDescription>Maximum budget for this category is ${maxBudget.toFixed(2)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryBudget">{category} Budget ($)</Label>
            <Input
              id="categoryBudget"
              type="number"
              step="0.01"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              max={maxBudget}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">Current: ${currentBudget.toFixed(2)}</p>
          </div>
          <Button
            onClick={() => {
              const newBudget = Number.parseFloat(input)
              if (newBudget <= maxBudget && newBudget >= 0) {
                onSave(newBudget)
              }
            }}
            className="w-full rounded-xl"
          >
            Save Budget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
