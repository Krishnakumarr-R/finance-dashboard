"use client";
import { useStore } from "@/store/useStore";
import { TimeRange } from "@/types";
import { cn } from "@/lib/utils";

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

export function TimeRangePicker() {
  const { timeRange, setTimeRange } = useStore();

  return (
    <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
      {RANGES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTimeRange(value)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
            timeRange === value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
