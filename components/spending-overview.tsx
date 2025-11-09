"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/lib/transactions-context"

const SpendingOverview = ({ timePeriod }: { timePeriod: "daily" | "weekly" | "monthly" }) => {
  const { transactions } = useTransactions()

  const generateChartData = (period: "daily" | "weekly" | "monthly") => {
    if (period === "daily") {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toISOString().split("T")[0]
      })

      return last7Days.map((date) => {
        const dayTransactions = transactions.filter((t) => t.date === date)
        const spent = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
        const income = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
        return {
          name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          spent: Math.round(spent * 100) / 100,
          income: Math.round(income * 100) / 100,
        }
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

        const weekTransactions = transactions.filter((t) => {
          const tDate = new Date(t.date)
          return tDate >= weekStart && tDate <= weekEnd
        })
        const spent = weekTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
        const income = weekTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        return {
          name: `Week ${i + 1}`,
          spent: Math.round(spent * 100) / 100,
          income: Math.round(income * 100) / 100,
        }
      })
    }

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return date
    })

    return last6Months.map((date) => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= monthStart && tDate <= monthEnd
      })
      const spent = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: date.toLocaleDateString("en-US", { month: "short" }),
        spent: Math.round(spent * 100) / 100,
        income: Math.round(income * 100) / 100,
      }
    })
  }

  const data = generateChartData(timePeriod)
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0)
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const balance = totalIncome - totalSpent

  return (
    <Card className="p-0 overflow-hidden border-0 shadow-lg rounded-3xl bg-gradient-to-br from-card to-card/50">
      <div className="p-6 border-b border-border/30">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-950/30 dark:to-emerald-950/10 rounded-2xl p-4 border border-emerald-200/30 dark:border-emerald-800/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Income</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalIncome.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-50/50 dark:from-rose-950/30 dark:to-rose-950/10 rounded-2xl p-4 border border-rose-200/30 dark:border-rose-800/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Spent</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">${totalSpent.toLocaleString()}</p>
          </div>

          <div
            className={`bg-gradient-to-br rounded-2xl p-4 border transition-all ${
              balance >= 0
                ? "from-teal-50 to-teal-50/50 dark:from-teal-950/30 dark:to-teal-950/10 border-teal-200/30 dark:border-teal-800/30"
                : "from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10 border-amber-200/30 dark:border-amber-800/30"
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground mb-1">Balance</p>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400"
              }`}
            >
              ${balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 h-80">
        <ChartContainer
          config={{
            spent: { label: "Spent", color: "hsl(var(--color-chart-1))" },
            income: { label: "Income", color: "hsl(var(--color-chart-2))" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="income" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spent" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}

export default SpendingOverview
