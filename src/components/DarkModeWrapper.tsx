"use client";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

export function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return <>{children}</>;
}
