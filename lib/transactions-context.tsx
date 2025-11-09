"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  notes: string
  type: "income" | "expense"
  timestamp: number
}

export interface CategoryGoal {
  category: string
  budget: number
  color: string
}

interface TransactionsContextType {
  transactions: Transaction[]
  categoryGoals: CategoryGoal[]
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
  deleteTransaction: (id: string) => void
  setCategoryGoal: (category: string, budget: number) => void
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined)

const defaultCategoryGoals: CategoryGoal[] = [
  { category: "Housing", budget: 1200, color: "#0ea5e9" },
  { category: "Food", budget: 500, color: "#10b981" },
  { category: "Transport", budget: 300, color: "#f59e0b" },
  { category: "Entertainment", budget: 200, color: "#8b5cf6" },
  { category: "Utilities", budget: 200, color: "#06b6d4" },
  { category: "Other", budget: 300, color: "#64748b" },
]

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-01-08",
    amount: 45.99,
    category: "Food",
    notes: "Grocery Store",
    type: "expense",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "2",
    date: "2025-01-08",
    amount: 3200,
    category: "Income",
    notes: "Monthly Salary",
    type: "income",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "3",
    date: "2025-01-07",
    amount: 52.0,
    category: "Transport",
    notes: "Gas Station",
    type: "expense",
    timestamp: Date.now() - 172800000,
  },
  {
    id: "4",
    date: "2025-01-07",
    amount: 15.99,
    category: "Entertainment",
    notes: "Netflix Subscription",
    type: "expense",
    timestamp: Date.now() - 172800000,
  },
  {
    id: "5",
    date: "2025-01-06",
    amount: 120.0,
    category: "Utilities",
    notes: "Electricity Bill",
    type: "expense",
    timestamp: Date.now() - 259200000,
  },
  {
    id: "6",
    date: "2025-01-06",
    amount: 38.5,
    category: "Food",
    notes: "Restaurant",
    type: "expense",
    timestamp: Date.now() - 259200000,
  },
]

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [categoryGoals, setCategoryGoals] = useState<CategoryGoal[]>(defaultCategoryGoals)

  const addTransaction = useCallback((transaction: Omit<Transaction, "id" | "timestamp">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      timestamp: Date.now(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const setGoal = useCallback((category: string, budget: number) => {
    setCategoryGoals((prev) => {
      const existing = prev.find((g) => g.category === category)
      if (existing) {
        return prev.map((g) => (g.category === category ? { ...g, budget } : g))
      }
      return [...prev, { category, budget, color: "#64748b" }]
    })
  }, [])

  return (
    <TransactionsContext.Provider
      value={{ transactions, categoryGoals, addTransaction, deleteTransaction, setCategoryGoal: setGoal }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error("useTransactions must be used within TransactionsProvider")
  }
  return context
}
