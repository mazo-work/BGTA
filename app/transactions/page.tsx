"use client"

import TransactionForm from "@/components/transaction-form"
import TransactionListFull from "@/components/transaction-list-full"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>

        <div className="space-y-6">
          <TransactionForm />
          <TransactionListFull />
        </div>
      </div>
    </div>
  )
}
