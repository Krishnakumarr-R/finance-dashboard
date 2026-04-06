"use client";
import { LayoutDashboard, CreditCard, Lightbulb, X, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: CreditCard },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

interface SidebarProps {
  activeView: string;
  setView: (v: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeView, setView, mobileOpen, onClose }: SidebarProps) {
  const { role } = useStore();

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 flex flex-col",
          "bg-card border-r border-border/50",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 balance-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Wallet className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <div>
              <div className="font-display text-base font-700 leading-tight" style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
                Finance
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Dashboard</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 mb-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold",
            role === "admin"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
          )}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: role === "admin" ? "#f59e0b" : "#0ea5e9" }} />
            {role === "admin" ? "Admin Access" : "Viewer Mode"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2 font-semibold">Menu</div>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={cn(
                "nav-link w-full text-left",
                activeView === id ? "active" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 balance-gradient rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
              {role === "admin" ? "A" : "V"}
            </div>
            <div>
              <div className="text-sm font-semibold capitalize">{role === "admin" ? "Admin User" : "Viewer"}</div>
              <div className="text-xs text-muted-foreground">finance@example.com</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
