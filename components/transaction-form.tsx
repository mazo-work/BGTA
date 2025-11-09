"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTransactions } from "@/lib/transactions-context"

const EXPENSE_CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Housing", "Other"]

export default function TransactionForm() {
  const { addTransaction } = useTransactions()
  const [transactionType, setTransactionType] = useState<"expense" | "income" | "debt">("expense")
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "Food",
    notes: "",
  })
  const [debtData, setDebtData] = useState({
    debtType: "Credit Card" as const,
    minimumPayment: "",
    interestRate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.date) return

    if (transactionType === "income") {
      addTransaction({
        date: formData.date,
        amount: Number.parseFloat(formData.amount),
        category: "Income",
        notes: formData.notes,
        type: "income",
      })
    } else if (transactionType === "debt") {
      if (!debtData.minimumPayment || !debtData.interestRate) return

      addTransaction({
        date: formData.date,
        amount: Number.parseFloat(debtData.minimumPayment),
        category: "Debt",
        notes: formData.notes,
        type: "expense",
        debtDetails: {
          debtType: debtData.debtType,
          minimumPayment: Number.parseFloat(debtData.minimumPayment),
          interestRate: Number.parseFloat(debtData.interestRate),
        },
      })
    } else {
      addTransaction({
        date: formData.date,
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes,
        type: "expense",
      })
    }

    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "Food",
      notes: "",
    })
    setDebtData({
      debtType: "Credit Card",
      minimumPayment: "",
      interestRate: "",
    })
    setTransactionType("expense")
  }

  return (
    <Card className="rounded-3xl border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Manually add a new expense, income, or debt</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
              <SelectTrigger id="type" className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="debt">Debt Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">{transactionType === "debt" ? "Minimum Payment ($)" : "Amount ($)"}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transactionType === "debt" ? debtData.minimumPayment : formData.amount}
                onChange={(e) =>
                  transactionType === "debt"
                    ? setDebtData({ ...debtData, minimumPayment: e.target.value })
                    : setFormData({ ...formData, amount: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
          </div>

          {transactionType === "expense" && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {transactionType === "debt" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Debt Type */}
                <div className="space-y-2">
                  <Label htmlFor="debtType">Type of Debt</Label>
                  <Select
                    value={debtData.debtType}
                    onValueChange={(value: any) => setDebtData({ ...debtData, debtType: value })}
                  >
                    <SelectTrigger id="debtType" className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Personal Loans">Personal Loans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={debtData.interestRate}
                    onChange={(e) => setDebtData({ ...debtData, interestRate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this transaction..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="rounded-xl min-h-24 resize-none"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl h-10 font-medium">
            Add {transactionType === "income" ? "Income" : transactionType === "debt" ? "Debt" : "Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
