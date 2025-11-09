"use client"

import { Card } from "@/components/ui/card"

interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  date: string
  type: "income" | "expense"
}

const mockTransactions: Transaction[] = [
  { id: "1", description: "Grocery Store", category: "Food", amount: 45.99, date: "Today", type: "expense" },
  { id: "2", description: "Monthly Salary", category: "Income", amount: 3200, date: "Today", type: "income" },
  { id: "3", description: "Gas Station", category: "Transport", amount: 52.0, date: "Yesterday", type: "expense" },
  {
    id: "4",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    date: "Yesterday",
    type: "expense",
  },
  {
    id: "5",
    description: "Electricity Bill",
    category: "Utilities",
    amount: 120.0,
    date: "2 days ago",
    type: "expense",
  },
  { id: "6", description: "Restaurant", category: "Food", amount: 38.5, date: "2 days ago", type: "expense" },
]

export default function TransactionList() {
  return (
    <Card className="p-6 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-card to-card/50">
      <h3 className="text-lg font-bold text-foreground mb-6">Recent Transactions</h3>

      <div className="space-y-3">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "income"
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-rose-100 dark:bg-rose-900/30"
                }`}
              >
                <span className={transaction.type === "income" ? "📈" : "📉"}></span>
              </div>

              <div>
                <p className="font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
            </div>

            <div
              className={`text-lg font-bold ${
                transaction.type === "income"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
