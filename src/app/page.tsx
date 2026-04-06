"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DashboardOverview } from "@/components/DashboardOverview";
import { TransactionsSection } from "@/components/TransactionsSection";
import { InsightsSection } from "@/components/InsightsSection";

type View = "dashboard" | "transactions" | "insights";

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background gradient-mesh flex">
      <Sidebar
        activeView={view}
        setView={(v) => { setView(v as View); setSidebarOpen(false); }}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-screen-2xl mx-auto w-full">
          {view === "dashboard" && <DashboardOverview />}
          {view === "transactions" && <TransactionsSection />}
          {view === "insights" && <InsightsSection />}
        </main>
      </div>
    </div>
  );
}
