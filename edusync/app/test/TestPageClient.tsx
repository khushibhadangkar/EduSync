"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ACCENT_THEMES } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import TestsTab from "@/components/assignments/TestsTab";

export default function TestPageClient() {
  const { settings } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    const theme = ACCENT_THEMES[settings.accent];
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-light", theme.primaryLight);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
    if (settings.theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [settings.theme, settings.accent]);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text-base)" }}
    >
      {/* Mini sidebar matching test.html */}
      <aside
        className="w-[220px] flex flex-col border-r hidden sm:flex"
        style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center gap-3 px-6 py-7 border-b mb-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            aria-hidden="true"
          >
            <i className="fas fa-graduation-cap" />
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--text-base)" }}>
            EduSync
          </span>
        </div>
        <nav>
          <ul className="list-none m-0 p-0">
            <li>
              <Link
                href="/"
                className="flex items-center gap-3 px-7 py-3 text-sm transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--primary)]"
                style={{ color: "var(--text-muted)", textDecoration: "none" }}
                aria-label="Back to Dashboard"
              >
                <i className="fas fa-arrow-left w-5 text-center" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/test"
                className="flex items-center gap-3 px-7 py-3 text-sm rounded-lg mx-2 font-medium"
                style={{
                  background: "var(--bg-muted)",
                  color: "var(--primary)",
                  textDecoration: "none",
                }}
                aria-current="page"
              >
                <i className="fas fa-file-alt w-5 text-center" aria-hidden="true" />
                <span>Tests</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <header
          className="h-[70px] flex items-center justify-between px-9 border-b"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <span
            className="text-lg font-bold tracking-wide"
            style={{ color: "var(--primary)" }}
          >
            MCQ Test
          </span>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
            aria-hidden="true"
          >
            ST
          </div>
        </header>

        <main className="flex-1 overflow-auto" style={{ background: "var(--bg)" }}>
          <TestsTab />
        </main>
      </div>
    </div>
  );
}
