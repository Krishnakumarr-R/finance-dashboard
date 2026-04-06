"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props { data: { month: string; income: number; expenses: number; net: number }[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm min-w-[160px]">
      <p className="font-semibold text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            {p.name}
          </span>
          <span className="font-semibold">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function MonthlyBarChart({ data }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>Monthly Comparison</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 6 months at a glance</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-violet-500 inline-block" />Income</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-rose-400 inline-block" />Expenses</span>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 6 }} />
            <Bar dataKey="income" name="Income" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" name="Expenses" fill="#fb7185" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
