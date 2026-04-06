"use client";
import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { computeSummary, getTransactionsInRange, getCategoryBreakdown, getMonthlyComparison, formatCurrency, getBalanceTrend } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { TimeRangePicker } from "@/components/TimeRangePicker";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Star, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function InsightsSection() {
  const { transactions, timeRange } = useStore();

  const ranged = useMemo(() => getTransactionsInRange(transactions, timeRange), [transactions, timeRange]);
  const summary = useMemo(() => computeSummary(ranged), [ranged]);
  const breakdown = useMemo(() => getCategoryBreakdown(ranged), [ranged]);
  const monthly = useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const trend = useMemo(() => getBalanceTrend(ranged, timeRange), [ranged, timeRange]);

  const topCategory = breakdown[0];
  const topIncomeCategory = useMemo(() => {
    const incomes = ranged.filter((t) => t.type === "income");
    const map: Record<string, number> = {};
    incomes.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { category: sorted[0][0], amount: sorted[0][1] } : null;
  }, [ranged]);

  const avgDailyExpense = useMemo(() => {
    const days = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 }[timeRange];
    return summary.expenses / days;
  }, [summary.expenses, timeRange]);

  const monthlyChange = useMemo(() => {
    if (monthly.length < 2) return null;
    const last = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2];
    const expenseChange = prev.expenses > 0 ? ((last.expenses - prev.expenses) / prev.expenses) * 100 : 0;
    const incomeChange = prev.income > 0 ? ((last.income - prev.income) / prev.income) * 100 : 0;
    return { expenseChange, incomeChange, lastMonth: last.month, prevMonth: prev.month };
  }, [monthly]);

  const radarData = breakdown.slice(0, 6).map((d) => ({
    category: d.category.split(" ")[0],
    amount: d.amount,
    fullCategory: d.category,
  }));

  const insights = useMemo(() => {
    const items = [];

    if (topCategory) {
      items.push({
        icon: AlertTriangle,
        color: "amber",
        title: "Highest Spending",
        text: `${topCategory.category} is your biggest expense at ${formatCurrency(topCategory.amount)} (${topCategory.percentage.toFixed(0)}% of total spending).`,
      });
    }

    if (summary.savingsRate > 30) {
      items.push({
        icon: Star,
        color: "emerald",
        title: "Excellent Savings",
        text: `You're saving ${summary.savingsRate.toFixed(1)}% of your income — well above the recommended 20%.`,
      });
    } else if (summary.savingsRate < 10 && summary.income > 0) {
      items.push({
        icon: Target,
        color: "rose",
        title: "Low Savings Rate",
        text: `Your savings rate is ${summary.savingsRate.toFixed(1)}%. Try to cut non-essential spending to reach the 20% target.`,
      });
    }

    if (monthlyChange) {
      if (monthlyChange.expenseChange > 15) {
        items.push({
          icon: TrendingUp,
          color: "rose",
          title: "Spending Spike",
          text: `Your expenses increased by ${monthlyChange.expenseChange.toFixed(1)}% from ${monthlyChange.prevMonth} to ${monthlyChange.lastMonth}.`,
        });
      } else if (monthlyChange.expenseChange < -10) {
        items.push({
          icon: TrendingDown,
          color: "emerald",
          title: "Great Cost Control",
          text: `You reduced spending by ${Math.abs(monthlyChange.expenseChange).toFixed(1)}% compared to last month. Keep it up!`,
        });
      }
    }

    items.push({
      icon: Zap,
      color: "violet",
      title: "Daily Average",
      text: `You're spending an average of ${formatCurrency(avgDailyExpense)} per day in this period.`,
    });

    return items;
  }, [topCategory, summary, monthlyChange, avgDailyExpense]);

  const colorMap: Record<string, string> = {
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400",
  };
  const iconBgMap: Record<string, string> = {
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>Insights</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Smart observations about your finances</p>
        </div>
        <TimeRangePicker />
      </div>

      {/* AI-style insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div
              key={i}
              className={cn("glass-card rounded-2xl p-5 border opacity-0 animate-fade-in", colorMap[insight.color])}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", iconBgMap[insight.color])}>
                <Icon size={18} />
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{insight.title}</h4>
              <p className="text-xs leading-relaxed opacity-90">{insight.text}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category breakdown bar */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Category Ranking</h3>
          <p className="text-xs text-muted-foreground mb-5">Top expense categories by amount</p>
          {breakdown.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No expense data</div>
          ) : (
            <div className="space-y-3">
              {breakdown.slice(0, 7).map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span>{CATEGORY_ICONS[item.category]}</span>
                      {item.category}
                    </span>
                    <span className="font-bold">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        background: CATEGORY_COLORS[item.category] ?? "#94a3b8",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.percentage.toFixed(1)}% of total expenses</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly net chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Monthly Net Balance</h3>
          <p className="text-xs text-muted-foreground mb-5">Income minus expenses per month</p>
          {monthly.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No monthly data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    const v = payload[0].value;
                    return (
                      <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
                        <p className="text-muted-foreground mb-1">{label}</p>
                        <p className={cn("font-bold", v >= 0 ? "text-emerald-500" : "text-rose-500")}>
                          {v >= 0 ? "+" : ""}{formatCurrency(v)}
                        </p>
                      </div>
                    );
                  }}
                  cursor={{ fill: "hsl(var(--muted))", radius: 6 }}
                />
                <Bar dataKey="net" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {monthly.map((entry, index) => (
                    <Cell key={index} fill={entry.net >= 0 ? "#10b981" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Spending radar + summary stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Radar chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Spending Pattern</h3>
          <p className="text-xs text-muted-foreground mb-3">Visual distribution by category</p>
          {radarData.length < 3 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Need more data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Spending" dataKey="amount" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-card border border-border rounded-xl p-2.5 shadow-xl text-xs">
                        <p className="font-semibold">{payload[0].payload.fullCategory}</p>
                        <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
                      </div>
                    );
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Key metrics */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Key Financial Metrics</h3>
          <p className="text-xs text-muted-foreground mb-5">Detailed breakdown for the selected period</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Transactions", value: ranged.length.toString(), sub: `${ranged.filter((t) => t.type === "income").length} income, ${ranged.filter((t) => t.type === "expense").length} expense` },
              { label: "Avg. Transaction", value: formatCurrency(ranged.length > 0 ? ranged.reduce((s, t) => s + t.amount, 0) / ranged.length : 0), sub: "per transaction" },
              { label: "Largest Expense", value: formatCurrency(Math.max(...ranged.filter((t) => t.type === "expense").map((t) => t.amount), 0)), sub: ranged.filter((t) => t.type === "expense").sort((a, b) => b.amount - a.amount)[0]?.category ?? "—" },
              { label: "Largest Income", value: formatCurrency(Math.max(...ranged.filter((t) => t.type === "income").map((t) => t.amount), 0)), sub: topIncomeCategory?.category ?? "—" },
              { label: "Daily Avg Spend", value: formatCurrency(avgDailyExpense), sub: "per day" },
              { label: "Savings Rate", value: `${summary.savingsRate.toFixed(1)}%`, sub: summary.savingsRate >= 20 ? "✅ On track" : "⚠️ Below target" },
            ].map((m) => (
              <div key={m.label} className="bg-muted/40 rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">{m.label}</p>
                <p className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{m.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
