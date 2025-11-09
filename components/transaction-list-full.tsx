"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTransactions } from "@/lib/transactions-context"

export default function TransactionListFull() {
  const { transactions, deleteTransaction } = useTransactions()

  if (transactions.length === 0) {
    return (
      <Card className="p-8 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-card to-card/50 text-center">
        <p className="text-muted-foreground">No transactions yet. Add one to get started.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-0 shadow-lg rounded-3xl bg-gradient-to-br from-card to-card/50">
      <h3 className="text-lg font-bold text-foreground mb-6">All Transactions</h3>

      <div className="space-y-3">
        {transactions.map((transaction) => (
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
                <span>{transaction.type === "income" ? "📈" : "📉"}</span>
              </div>

              <div>
                <p className="font-medium text-foreground">{transaction.notes}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`text-lg font-bold ${
                  transaction.type === "income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTransaction(transaction.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
