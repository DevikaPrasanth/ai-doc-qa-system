"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type DashboardTheme = "light" | "dark";

const STORAGE_KEY = "dashboard-theme";

const DashboardThemeContext = createContext<{
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
} | null>(null);

function getStoredTheme(): DashboardTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "dark";
}

export function DashboardThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<DashboardTheme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);

  if (!context) {
    throw new Error(
      "useDashboardTheme must be used inside DashboardThemeProvider"
    );
  }

  return context;
}
