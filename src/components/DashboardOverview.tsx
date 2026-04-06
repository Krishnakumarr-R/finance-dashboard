"use client";
import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { computeSummary, getTransactionsInRange, formatCurrency, getBalanceTrend, getMonthlyComparison, getCategoryBreakdown } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";
import { BalanceTrendChart } from "@/components/BalanceTrendChart";
import { SpendingPieChart } from "@/components/SpendingPieChart";
import { MonthlyBarChart } from "@/components/MonthlyBarChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { TimeRangePicker } from "@/components/TimeRangePicker";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

export function DashboardOverview() {
  const { transactions, timeRange } = useStore();

  const ranged = useMemo(() => getTransactionsInRange(transactions, timeRange), [transactions, timeRange]);
  const summary = useMemo(() => computeSummary(ranged), [ranged]);
  const trend = useMemo(() => getBalanceTrend(ranged, timeRange), [ranged, timeRange]);
  const monthly = useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(ranged), [ranged]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Financial Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Track your money, master your future.</p>
        </div>
        <TimeRangePicker />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary.balance)}
          change={summary.balance >= 0 ? "+12.5%" : "-8.2%"}
          positive={summary.balance >= 0}
          icon={DollarSign}
          gradient="balance-gradient"
          delay="0"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.income)}
          change="+5.2%"
          positive={true}
          icon={TrendingUp}
          gradient="income-gradient"
          delay="100"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.expenses)}
          change="-3.1%"
          positive={false}
          icon={TrendingDown}
          gradient="expense-gradient"
          delay="200"
        />
        <StatCard
          title="Savings Rate"
          value={`${summary.savingsRate.toFixed(1)}%`}
          change={summary.savingsRate > 20 ? "Great!" : "Improve"}
          positive={summary.savingsRate > 20}
          icon={PiggyBank}
          gradient="savings-gradient"
          delay="300"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceTrendChart data={trend} />
        </div>
        <div>
          <SpendingPieChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <MonthlyBarChart data={monthly} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions transactions={ranged.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
