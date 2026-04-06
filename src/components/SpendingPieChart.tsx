"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { category: string; amount: number; percentage: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold mb-1">{CATEGORY_ICONS[d.category]} {d.category}</p>
      <p className="text-muted-foreground">{formatCurrency(d.amount)} <span className="text-xs">({d.percentage.toFixed(1)}%)</span></p>
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="grid grid-cols-1 gap-1 mt-3 max-h-32 overflow-y-auto scrollbar-thin">
    {payload?.slice(0, 6).map((entry: any) => (
      <div key={entry.value} className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
          <span className="truncate text-muted-foreground">{entry.value}</span>
        </span>
        <span className="font-semibold ml-2">{entry.payload.percentage.toFixed(0)}%</span>
      </div>
    ))}
  </div>
);

export function SpendingPieChart({ data }: Props) {
  const top = data.slice(0, 7);

  return (
    <div className="glass-card rounded-2xl p-5 h-full">
      <div className="mb-4">
        <h3 className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>Spending Breakdown</h3>
        <p className="text-xs text-muted-foreground mt-0.5">By category</p>
      </div>
      {top.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No expense data</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={top}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="amount"
                nameKey="category"
                strokeWidth={0}
              >
                {top.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <CustomLegend payload={top.map((d) => ({ value: d.category, color: CATEGORY_COLORS[d.category] ?? "#94a3b8", payload: d }))} />
        </>
      )}
    </div>
  );
}
