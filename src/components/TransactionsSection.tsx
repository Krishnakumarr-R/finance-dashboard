"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { filterTransactions, formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { Transaction, TransactionCategory } from "@/types";
import { cn } from "@/lib/utils";
import {
  Search, SlidersHorizontal, Plus, Pencil, Trash2, ArrowUpDown,
  ArrowUp, ArrowDown, ChevronDown, X, Download,
} from "lucide-react";
import { TransactionModal } from "@/components/TransactionModal";

const CATEGORIES: (TransactionCategory | "All")[] = [
  "All", "Food & Dining", "Shopping", "Transport", "Entertainment",
  "Healthcare", "Utilities", "Rent", "Salary", "Freelance",
  "Investment", "Education", "Travel", "Gifts", "Other",
];

export function TransactionsSection() {
  const { transactions, filters, setFilters, resetFilters, role, deleteTransaction } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => filterTransactions(transactions, filters), [transactions, filters]);

  const handleSort = (field: typeof filters.sortField) => {
    if (filters.sortField === field) {
      setFilters({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sortField: field, sortDir: "desc" });
    }
  };

  const SortIcon = ({ field }: { field: typeof filters.sortField }) => {
    if (filters.sortField !== field) return <ArrowUpDown size={12} className="text-muted-foreground" />;
    return filters.sortDir === "asc" ? <ArrowUp size={12} className="text-primary" /> : <ArrowDown size={12} className="text-primary" />;
  };

  const exportCSV = () => {
    const header = ["Date", "Description", "Category", "Type", "Amount", "Merchant"].join(",");
    const rows = filtered.map((t) =>
      [t.date, `"${t.description}"`, t.category, t.type, t.amount, t.merchant ?? ""].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = filters.search || filters.category !== "All" || filters.type !== "All" || filters.dateFrom || filters.dateTo || filters.minAmount || filters.maxAmount;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>Transactions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} of {transactions.length} records</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted transition-colors">
            <Download size={13} /> Export CSV
          </button>
          {role === "admin" && (
            <button
              onClick={() => { setEditTx(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold balance-gradient text-white shadow-md shadow-primary/25 hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions…"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all",
              showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
            )}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
          </button>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-200 dark:border-rose-900">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-border/50">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="All">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ dateFrom: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ dateTo: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Min Amount</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) => setFilters({ minAmount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max Amount</label>
              <input
                type="number"
                placeholder="99999"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ maxAmount: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                {[
                  { label: "Date", field: "date" as const },
                  { label: "Description", field: null },
                  { label: "Category", field: "category" as const },
                  { label: "Type", field: "type" as const },
                  { label: "Amount", field: "amount" as const },
                ].map(({ label, field }) => (
                  <th key={label} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {field ? (
                      <button onClick={() => handleSort(field)} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        {label} <SortIcon field={field} />
                      </button>
                    ) : label}
                  </th>
                ))}
                {role === "admin" && <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <span className="text-4xl">📭</span>
                      <p className="font-medium">No transactions found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/30 transition-colors group"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: `${CATEGORY_COLORS[tx.category]}18` }}
                        >
                          {CATEGORY_ICONS[tx.category]}
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[180px]">{tx.description}</p>
                          {tx.merchant && <p className="text-xs text-muted-foreground">{tx.merchant}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                        style={{ background: `${CATEGORY_COLORS[tx.category]}18`, color: CATEGORY_COLORS[tx.category] }}
                      >
                        {CATEGORY_ICONS[tx.category]} {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "inline-flex items-center text-xs font-semibold px-2 py-1 rounded-lg capitalize",
                        tx.type === "income" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={cn("px-4 py-3.5 text-sm font-bold whitespace-nowrap", tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditTx(tx); setModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => { if (confirm("Delete this transaction?")) deleteTransaction(tx.id); }}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
            <span className="font-semibold text-foreground">
              Net: {" "}
              <span className={filtered.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0) >= 0 ? "text-emerald-500" : "text-rose-500"}>
                {formatCurrency(Math.abs(filtered.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0)))}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          transaction={editTx}
          onClose={() => { setModalOpen(false); setEditTx(null); }}
        />
      )}
    </div>
  );
}
