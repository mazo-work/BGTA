"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/lib/transactions-context"

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#0ea5e9",
  Food: "#10b981",
  Transport: "#f59e0b",
  Entertainment: "#8b5cf6",
  Utilities: "#06b6d4",
  Other: "#64748b",
}

export default function CategoryBreakdown() {
  const { transactions } = useTransactions()

  const categoryData = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      ),
  )
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: CATEGORY_COLORS[name] || "#64748b",
    }))
    .sort((a, b) => b.value - a.value)

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="p-6 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-card to-card/50 h-full flex flex-col">
      <h3 className="text-lg font-bold text-foreground mb-4">Category Breakdown</h3>

      <div className="flex-1 flex items-center justify-center">
        <ChartContainer
          config={Object.fromEntries(categoryData.map((item) => [item.name, { label: item.name, color: item.color }]))}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-6 space-y-3 border-t border-border/30 pt-4">
        {categoryData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">${item.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
