"use client";
import { Menu, Moon, Sun, Shield, Eye, Bell } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { role, setRole, darkMode, toggleDarkMode } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 md:px-6 lg:px-8 py-3.5 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate hidden sm:block" style={{ fontFamily: "Syne, sans-serif" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher */}
        <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
          <button
            onClick={() => setRole("viewer")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              role === "viewer"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Viewer</span>
          </button>
          <button
            onClick={() => setRole("admin")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              role === "admin"
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Shield size={13} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-muted transition-all duration-200 text-muted-foreground hover:text-foreground"
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
