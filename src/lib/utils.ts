import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction, FilterState, TimeRange } from "@/types";
import { format, subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM dd, yyyy");
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM dd");
}

export function getTimeRangeDays(range: TimeRange): number {
  return { "7d": 7, "30d": 30, "90d": 90, "1y": 365 }[range];
}

export function filterTransactions(transactions: Transaction[], filters: FilterState): Transaction[] {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.merchant?.toLowerCase().includes(q) ?? false)
    );
  }

  if (filters.category !== "All") result = result.filter((t) => t.category === filters.category);
  if (filters.type !== "All") result = result.filter((t) => t.type === filters.type);

  if (filters.dateFrom) {
    const from = startOfDay(parseISO(filters.dateFrom));
    result = result.filter((t) => parseISO(t.date) >= from);
  }
  if (filters.dateTo) {
    const to = endOfDay(parseISO(filters.dateTo));
    result = result.filter((t) => parseISO(t.date) <= to);
  }

  if (filters.minAmount) result = result.filter((t) => t.amount >= parseFloat(filters.minAmount));
  if (filters.maxAmount) result = result.filter((t) => t.amount <= parseFloat(filters.maxAmount));

  result.sort((a, b) => {
    let cmp = 0;
    if (filters.sortField === "date") cmp = a.date.localeCompare(b.date);
    else if (filters.sortField === "amount") cmp = a.amount - b.amount;
    else if (filters.sortField === "category") cmp = a.category.localeCompare(b.category);
    else if (filters.sortField === "type") cmp = a.type.localeCompare(b.type);
    return filters.sortDir === "asc" ? cmp : -cmp;
  });

  return result;
}

export function getTransactionsInRange(transactions: Transaction[], range: TimeRange): Transaction[] {
  const days = getTimeRangeDays(range);
  const cutoff = subDays(new Date(), days);
  return transactions.filter((t) => parseISO(t.date) >= cutoff);
}

export function computeSummary(transactions: Transaction[]) {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses, savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0 };
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const map: Record<string, number> = {};
  expenses.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount, percentage: total > 0 ? (amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export function getBalanceTrend(transactions: Transaction[], range: TimeRange) {
  const days = getTimeRangeDays(range);
  const step = days <= 30 ? 1 : days <= 90 ? 3 : 7;
  const points: { date: string; balance: number; income: number; expenses: number }[] = [];

  for (let i = days; i >= 0; i -= step) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayTxs = transactions.filter((t) => {
      const txDate = parseISO(t.date);
      return isWithinInterval(txDate, { start: subDays(date, step - 1), end: date });
    });
    const income = dayTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = dayTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    points.push({ date: format(date, days <= 30 ? "MMM dd" : "MMM dd"), balance: income - expenses, income, expenses });
  }
  return points;
}

export function getMonthlyComparison(transactions: Transaction[]) {
  const months: Record<string, { income: number; expenses: number }> = {};
  transactions.forEach((t) => {
    const month = format(parseISO(t.date), "MMM yyyy");
    if (!months[month]) months[month] = { income: 0, expenses: 0 };
    if (t.type === "income") months[month].income += t.amount;
    else months[month].expenses += t.amount;
  });
  return Object.entries(months)
    .map(([month, data]) => ({ month, ...data, net: data.income - data.expenses }))
    .slice(-6);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
