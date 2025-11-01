"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Expense, ExpenseCategory, ExpenseFilters } from "@types/expense";
import { monthKey } from "@lib/format";

function uuid(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const defaultFilters: ExpenseFilters = {
  query: "",
  category: "All",
  month: "All"
};

export interface ExpenseState {
  expenses: Expense[];
  filters: ExpenseFilters;
  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Omit<Expense, "id">>) => void;
  deleteExpense: (id: string) => void;
  clearAll: () => void;
  setFilters: (f: Partial<ExpenseFilters>) => void;
  filteredExpenses: () => Expense[];
  categories: () => ExpenseCategory[];
  months: () => string[]; // yyyy-MM
  totals: () => { total: number; byCategory: Record<string, number>; byMonth: Record<string, number> };
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      filters: defaultFilters,

      addExpense: (e) =>
        set((state) => ({ expenses: [{ id: uuid(), ...e }, ...state.expenses].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)) })),

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses
            .map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
            .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
        })),

      deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      clearAll: () => set({ expenses: [] }),

      setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f } })),

      filteredExpenses: () => {
        const { expenses, filters } = get();
        return expenses.filter((e) => {
          const matchesQuery = filters.query
            ? (e.description + " " + (e.notes ?? "")).toLowerCase().includes(filters.query.toLowerCase())
            : true;
          const matchesCategory = filters.category === "All" ? true : e.category === filters.category;
          const matchesMonth = filters.month === "All" ? true : monthKey(e.dateISO) === filters.month;
          return matchesQuery && matchesCategory && matchesMonth;
        });
      },

      categories: () => [
        "Housing",
        "Transportation",
        "Food",
        "Utilities",
        "Insurance",
        "Healthcare",
        "Savings",
        "Entertainment",
        "Personal",
        "Education",
        "Gifts",
        "Other"
      ],

      months: () => {
        const setMonths = new Set<string>();
        for (const e of get().expenses) setMonths.add(monthKey(e.dateISO));
        return Array.from(setMonths).sort().reverse();
      },

      totals: () => {
        const res = { total: 0, byCategory: {} as Record<string, number>, byMonth: {} as Record<string, number> };
        for (const e of get().filteredExpenses()) {
          res.total += e.amount;
          res.byCategory[e.category] = (res.byCategory[e.category] ?? 0) + e.amount;
          const m = monthKey(e.dateISO);
          res.byMonth[m] = (res.byMonth[m] ?? 0) + e.amount;
        }
        return res;
      }
    }),
    { name: "expenses-store" }
  )
);
