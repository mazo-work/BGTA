"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"

const dailyData = [
  { name: "Mon", spent: 120, income: 200 },
  { name: "Tue", spent: 150, income: 200 },
  { name: "Wed", spent: 80, income: 0 },
  { name: "Thu", spent: 200, income: 0 },
  { name: "Fri", spent: 95, income: 200 },
  { name: "Sat", spent: 110, income: 0 },
  { name: "Sun", spent: 70, income: 0 },
]

const weeklyData = [
  { name: "Week 1", spent: 725, income: 800 },
  { name: "Week 2", spent: 890, income: 800 },
  { name: "Week 3", spent: 650, income: 800 },
  { name: "Week 4", spent: 920, income: 800 },
]

const monthlyData = [
  { name: "Jan", spent: 2800, income: 3200 },
  { name: "Feb", spent: 2950, income: 3200 },
  { name: "Mar", spent: 3100, income: 3200 },
  { name: "Apr", spent: 2750, income: 3200 },
  { name: "May", spent: 3050, income: 3200 },
  { name: "Jun", spent: 2900, income: 3200 },
]

const dataMap = {
  daily: dailyData,
  weekly: weeklyData,
  monthly: monthlyData,
}

export default function SpendingOverview({ timePeriod }: { timePeriod: "daily" | "weekly" | "monthly" }) {
  const data = dataMap[timePeriod]
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
