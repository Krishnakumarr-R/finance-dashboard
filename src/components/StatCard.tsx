"use client";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  gradient: string;
  delay?: string;
}

export function StatCard({ title, value, change, positive, icon: Icon, gradient, delay = "0" }: StatCardProps) {
  return (
    <div
      className={cn("stat-card glass-card opacity-0 animate-fade-in")}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Gradient glow */}
      <div
        className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl", gradient)}
        style={{ opacity: 0.04 }}
      />

      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", gradient)}>
            <Icon size={16} className="text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            {value}
          </div>
          <div className={cn("trend-badge", positive ? "trend-up" : "trend-down")}>
            {positive ? "▲" : "▼"} {change}
          </div>
        </div>
      </div>
    </div>
  );
}
