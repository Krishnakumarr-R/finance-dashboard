"use client";
import { Transaction } from "@/types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props { transactions: Transaction[] }

export function RecentTransactions({ transactions }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>Recent Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Latest transactions</p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No transactions yet</div>
      ) : (
        <div className="flex-1 space-y-1 overflow-hidden">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors duration-150 group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: `${CATEGORY_COLORS[tx.category]}18` }}
              >
                {CATEGORY_ICONS[tx.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{tx.description}</p>
                <p className="text-[10px] text-muted-foreground">{formatShortDate(tx.date)}</p>
              </div>
              <div className={cn("flex items-center gap-0.5 text-xs font-bold flex-shrink-0", tx.type === "income" ? "text-emerald-500" : "text-rose-500")}>
                {tx.type === "income" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
