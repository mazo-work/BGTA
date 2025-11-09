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
  debtDetails?: {
    debtType: "Credit Card" | "Vehicle" | "Home" | "Personal Loans"
    minimumPayment: number
    interestRate: number
  }
}

export interface CategoryBudget {
  category: string
  budget: number
  color: string
  isEssential: boolean
}

export interface BudgetState {
  monthlyBudget: number
  categoryBudgets: CategoryBudget[]
}

interface TransactionsContextType {
  transactions: Transaction[]
  budgetState: BudgetState
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
  deleteTransaction: (id: string) => void
  setMonthlyBudget: (amount: number) => void
  setCategoryBudget: (category: string, budget: number) => void
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined)

const defaultBudgetState: BudgetState = {
  monthlyBudget: 3700,
  categoryBudgets: [
    { category: "Housing", budget: 1200, color: "#0ea5e9", isEssential: true },
    { category: "Food", budget: 500, color: "#10b981", isEssential: true },
    { category: "Transport", budget: 300, color: "#f59e0b", isEssential: false },
    { category: "Entertainment", budget: 200, color: "#8b5cf6", isEssential: false },
    { category: "Utilities", budget: 200, color: "#06b6d4", isEssential: true },
    { category: "Other", budget: 300, color: "#64748b", isEssential: false },
  ],
}

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
]

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [budgetState, setBudgetState] = useState<BudgetState>(defaultBudgetState)

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

  const setMonthlyBudget = useCallback((amount: number) => {
    setBudgetState((prev) => ({
      ...prev,
      monthlyBudget: amount,
    }))
  }, [])

  const setCategoryBudget = useCallback((category: string, newBudget: number) => {
    setBudgetState((prev) => {
      const categoryIndex = prev.categoryBudgets.findIndex((c) => c.category === category)
      if (categoryIndex === -1) return prev

      const updatedBudgets = [...prev.categoryBudgets]
      const oldBudget = updatedBudgets[categoryIndex].budget
      const budgetDifference = oldBudget - newBudget

      // If budget is being reduced (positive difference), distribute to non-essential categories
      if (budgetDifference > 0) {
        updatedBudgets[categoryIndex].budget = newBudget

        // Non-essential reduction order: Entertainment, Transport, Other
        const nonEssentialOrder = ["Entertainment", "Transport", "Other"]
        let remainingToAdd = budgetDifference

        for (const nonEssCategory of nonEssentialOrder) {
          if (remainingToAdd <= 0) break

          const nonEssIndex = updatedBudgets.findIndex((c) => c.category === nonEssCategory && !c.isEssential)
          if (nonEssIndex !== -1 && nonEssCategory !== category) {
            updatedBudgets[nonEssIndex].budget += remainingToAdd
            remainingToAdd = 0
          }
        }
      } else {
        // If budget is being increased, reduce from other non-essential categories
        updatedBudgets[categoryIndex].budget = newBudget
        const budgetIncrease = Math.abs(budgetDifference)
        let remainingToRemove = budgetIncrease

        const nonEssentialOrder = ["Entertainment", "Transport", "Other"]
        for (const nonEssCategory of nonEssentialOrder) {
          if (remainingToRemove <= 0) break

          const nonEssIndex = updatedBudgets.findIndex((c) => c.category === nonEssCategory && !c.isEssential)
          if (nonEssIndex !== -1 && nonEssCategory !== category) {
            const canReduce = Math.min(remainingToRemove, updatedBudgets[nonEssIndex].budget)
            updatedBudgets[nonEssIndex].budget -= canReduce
            remainingToRemove -= canReduce
          }
        }
      }

      return {
        ...prev,
        categoryBudgets: updatedBudgets,
      }
    })
  }, [])

  return (
    <TransactionsContext.Provider
      value={{ transactions, budgetState, addTransaction, deleteTransaction, setMonthlyBudget, setCategoryBudget }}
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
