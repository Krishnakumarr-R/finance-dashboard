"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, FilterState, Transaction, Role, TimeRange } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/data";
import { generateId } from "@/lib/utils";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "All",
  type: "All",
  dateFrom: "",
  dateTo: "",
  sortField: "date",
  sortDir: "desc",
  minAmount: "",
  maxAmount: "",
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: "viewer",
      darkMode: false,
      transactions: MOCK_TRANSACTIONS,
      filters: DEFAULT_FILTERS,
      timeRange: "30d",

      setRole: (role: Role) => set({ role }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      addTransaction: (tx: Omit<Transaction, "id">) =>
        set((s) => ({
          transactions: [{ ...tx, id: generateId() }, ...s.transactions],
        })),

      updateTransaction: (id: string, tx: Partial<Transaction>) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...tx } : t)),
        })),

      deleteTransaction: (id: string) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      setFilters: (filters: Partial<FilterState>) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      setTimeRange: (timeRange: TimeRange) => set({ timeRange }),
    }),
    {
      name: "finance-dashboard-store",
      partialize: (s) => ({
        role: s.role,
        darkMode: s.darkMode,
        transactions: s.transactions,
        timeRange: s.timeRange,
      }),
    }
  )
);
