"use client";
import { useState } from "react";
import { Transaction, TransactionCategory, TransactionType } from "@/types";
import { useStore } from "@/store/useStore";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: TransactionCategory[] = [
  "Food & Dining", "Shopping", "Transport", "Entertainment",
  "Healthcare", "Utilities", "Rent", "Salary", "Freelance",
  "Investment", "Education", "Travel", "Gifts", "Other",
];

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionModal({ transaction, onClose }: Props) {
  const { addTransaction, updateTransaction } = useStore();
  const isEdit = !!transaction;

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: transaction?.date ?? today,
    description: transaction?.description ?? "",
    merchant: transaction?.merchant ?? "",
    category: transaction?.category ?? "Food & Dining" as TransactionCategory,
    type: transaction?.type ?? "expense" as TransactionType,
    amount: transaction?.amount?.toString() ?? "",
  });
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.date || !form.description || !form.amount) { setError("Please fill in all required fields."); return; }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) { setError("Please enter a valid positive amount."); return; }

    const payload = { ...form, amount, merchant: form.merchant || undefined };
    if (isEdit) updateTransaction(transaction.id, payload);
    else addTransaction(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            {isEdit ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="text-xs text-rose-600 bg-rose-500/10 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* Type toggle */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Type *</label>
            <div className="flex gap-2">
              {(["expense", "income"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize",
                    form.type === t
                      ? t === "income"
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
                        : "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description *</label>
            <input
              type="text"
              placeholder="e.g. Monthly grocery run"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Merchant</label>
              <input
                type="text"
                placeholder="Optional"
                value={form.merchant}
                onChange={(e) => set("merchant", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl balance-gradient text-white text-sm font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition-opacity"
          >
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
