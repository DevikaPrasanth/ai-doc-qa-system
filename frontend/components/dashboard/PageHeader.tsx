"use client";

import {
  type DashboardTheme,
  useDashboardTheme,
} from "@/components/dashboard/DashboardThemeProvider";

interface Props {
  title: string;
  subtitle: string;
}

const themeOptions: Array<{ value: DashboardTheme; label: string }> = [
  { value: "light", label: "\u{1F31E} Light" },
  { value: "dark", label: "\u{1F319} Dark" },
];

function ThemeToggle() {
  const { theme, setTheme } = useDashboardTheme();

  return (
    <div
      className="theme-toggle grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/20 p-1"
      aria-label="Dashboard theme"
      role="group"
    >
      {themeOptions.map((option) => {
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-white text-black"
                : "text-white/65 hover:bg-white/5 hover:text-white"
            }`}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-4xl font-bold">{title}</h2>

        <p className="text-white/50 mt-3">{subtitle}</p>
      </div>

      <ThemeToggle />
    </div>
  );
}
