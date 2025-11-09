"use client"
import { useTransactions } from "@/lib/transactions-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#0ea5e9",
  Food: "#10b981",
  Transport: "#f59e0b",
  Entertainment: "#8b5cf6",
  Utilities: "#06b6d4",
  Other: "#64748b",
}

interface CategoryCardProps {
  budget: {
    category: string
    budget: number
    color: string
    isEssential: boolean
  }
  onEditBudget: (category: string) => void
}

export default function CategoryCard({ budget, onEditBudget }: CategoryCardProps) {
  const { transactions } = useTransactions()

  // Filter transactions for this category
  const categoryTransactions = transactions.filter((t) => t.category === budget.category && t.type === "expense")
  const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)

  // Determine status color
  const isUnderBudget = totalSpent <= budget.budget
  const statusColor = isUnderBudget ? "text-teal-600 dark:text-teal-400" : "text-orange-600 dark:text-orange-400"
  const bgColor = isUnderBudget
    ? "from-teal-50 to-teal-50/50 dark:from-teal-950/30 dark:to-teal-950/10 border-teal-200/30 dark:border-teal-800/30"
    : "from-orange-50 to-orange-50/50 dark:from-orange-950/30 dark:to-orange-950/10 border-orange-200/30 dark:border-orange-800/30"

  const percentageUsed = budget.budget > 0 ? (totalSpent / budget.budget) * 100 : 0

  return (
    <Card
      className={`p-6 border-0 shadow-lg rounded-3xl bg-gradient-to-br transition-all hover:shadow-xl hover:scale-105 ${bgColor}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {budget.category} {budget.isEssential && <span className="text-xs font-semibold">(Essential)</span>}
          </p>
          <h3 className="text-xl font-bold text-foreground">{budget.category}</h3>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: budget.color,
            opacity: 0.2,
          }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }}></div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Spent vs Budget</span>
            <span className={`font-bold ${statusColor}`}>{percentageUsed.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-card/50 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isUnderBudget ? "bg-teal-500" : "bg-orange-500"}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Spent</p>
            <p className="font-bold text-foreground">${totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Budget</p>
            <p className="font-bold text-foreground">${budget.budget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Remaining</p>
            <p className={`font-bold ${statusColor}`}>${Math.max(0, budget.budget - totalSpent).toFixed(2)}</p>
          </div>
        </div>

        <Button
          onClick={() => onEditBudget(budget.category)}
          variant="outline"
          size="sm"
          className="w-full rounded-lg mt-2"
        >
          Edit Budget
        </Button>
      </div>
    </Card>
  )
}
