"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { ACCENT_COLORS, ACCENT_THEMES } from "@/lib/data";
import type { AccentColor, ThemeMode } from "@/types";

export default function SettingsTab() {
  const { settings, setTheme, setAccent, setNotification } = useAppStore();

  // Sync CSS vars whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    const theme = ACCENT_THEMES[settings.accent];
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-light", theme.primaryLight);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-light-bg", theme.accentLightBg);

    if (settings.theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [settings.theme, settings.accent]);

  const notifItems = [
    { key: "assignments", label: "Assignment Reminders", desc: "Get notified about upcoming assignment deadlines" },
    { key: "grades", label: "Grade Notifications", desc: "Receive notifications when grades are posted" },
    { key: "messages", label: "Message Alerts", desc: "Get notified about new messages from instructors" },
    { key: "courses", label: "Course Updates", desc: "Notifications for course announcements and changes" },
    { key: "discussions", label: "Discussion Replies", desc: "Get notified when someone replies to your posts" },
  ] as const;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "var(--text-base)" }}>
        Settings
      </h1>

      {/* Appearance */}
      <motion.div
        className="rounded-xl p-6 mb-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="flex items-center gap-2 text-lg font-bold mb-5" style={{ color: "var(--text-base)" }}>
          <i className="fas fa-palette" style={{ color: "var(--primary)" }} aria-hidden="true" />
          Appearance
        </h2>

        {/* Dark Mode Toggle */}
        <SettingsRow
          label="Dark Mode"
          desc="Toggle between light and dark theme"
        >
          <label className="switch" aria-label="Toggle dark mode">
            <input
              type="checkbox"
              checked={settings.theme === "dark"}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
            <span className="slider" />
          </label>
        </SettingsRow>

        {/* Theme select */}
        <SettingsRow label="Theme" desc="Choose your preferred theme">
          <select
            className="px-4 py-2 rounded-lg text-sm font-medium border-none outline-none"
            style={{ background: "var(--bg-muted)", color: "var(--text-base)" }}
            value={settings.theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
            aria-label="Select theme"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </SettingsRow>

        {/* Accent Color */}
        <SettingsRow label="Accent Color" desc="Personalize your accent color">
          <div className="flex gap-2" role="radiogroup" aria-label="Accent color">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                role="radio"
                aria-checked={settings.accent === color}
                aria-label={`Accent color ${color}`}
                className="w-7 h-7 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: color,
                  border:
                    settings.accent === color
                      ? "2px solid var(--primary)"
                      : "2px solid var(--bg-muted)",
                  outline: settings.accent === color ? "2px solid var(--primary)" : "none",
                  outlineOffset: "2px",
                  cursor: "pointer",
                }}
                onClick={() => setAccent(color as AccentColor)}
              />
            ))}
          </div>
        </SettingsRow>
      </motion.div>

      {/* Notifications */}
      <motion.div
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <h2 className="flex items-center gap-2 text-lg font-bold mb-5" style={{ color: "var(--text-base)" }}>
          <i className="fas fa-bell" style={{ color: "var(--primary)" }} aria-hidden="true" />
          Notifications
        </h2>

        {notifItems.map(({ key, label, desc }) => (
          <SettingsRow key={key} label={label} desc={desc}>
            <label
              className="switch"
              aria-label={`Toggle ${label}`}
            >
              <input
                type="checkbox"
                checked={settings.notifications[key]}
                onChange={(e) => setNotification(key, e.target.checked)}
              />
              <span className="slider" />
            </label>
          </SettingsRow>
        ))}
      </motion.div>
    </div>
  );
}

function SettingsRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5 last:mb-0 gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm" style={{ color: "var(--text-base)" }}>
          {label}
        </h4>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {desc}
        </p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}
