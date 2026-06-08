"use client";

import { useEffect } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { useAppStore } from "@/lib/store";
import { ACCENT_THEMES } from "@/lib/data";

export default function HomePage() {
  const { settings, profile } = useAppStore();

  // Apply theme & accent CSS variables to :root on changes
  useEffect(() => {
    const root = document.documentElement;
    const themeEl = document.documentElement;

    // Apply theme class
    if (settings.theme === "dark") {
      themeEl.classList.add("dark");
      themeEl.classList.remove("light");
    } else {
      themeEl.classList.add("light");
      themeEl.classList.remove("dark");
    }

    // Apply accent colors
    const accentTheme = ACCENT_THEMES[settings.accent];
    root.style.setProperty("--primary", accentTheme.primary);
    root.style.setProperty("--primary-light", accentTheme.primaryLight);
    root.style.setProperty("--secondary", accentTheme.secondary);
    root.style.setProperty("--accent", accentTheme.accent);
    root.style.setProperty("--accent-light-bg", accentTheme.accentLightBg);
  }, [settings.theme, settings.accent]);

  // Suppress unused var warning — profile is consumed by child components via store
  void profile;

  return <PortalLayout />;
}
