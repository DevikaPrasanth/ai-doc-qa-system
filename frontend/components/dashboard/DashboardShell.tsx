"use client";

import type { ReactNode } from "react";
import {
  DashboardThemeProvider,
  useDashboardTheme,
} from "@/components/dashboard/DashboardThemeProvider";
import Sidebar from "@/components/dashboard/Sidebar";

function DashboardFrame({ children }: { children: ReactNode }) {
  const { theme } = useDashboardTheme();
  const isLight = theme === "light";

  return (
    <main
      data-theme={theme}
      className={`dashboard-shell min-h-screen flex transition-colors ${
        isLight ? "bg-slate-50 text-slate-950" : "bg-black text-white"
      }`}
    >
      <Sidebar />

      <section className="relative flex-1 p-10 overflow-y-auto">
        {children}
      </section>
    </main>
  );
}

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardThemeProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </DashboardThemeProvider>
  );
}
