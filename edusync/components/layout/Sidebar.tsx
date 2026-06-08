"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { NAV_ITEMS } from "@/lib/data";
import type { TabId } from "@/types";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarOpen } =
    useAppStore();

  function handleNavClick(tabId: TabId) {
    setActiveTab(tabId);
    // Close sidebar on mobile
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }

  const sidebarWidth = sidebarCollapsed ? "70px" : "250px";

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col flex-shrink-0 sidebar-transition z-30",
          "border-r"
        )}
        style={{
          width: sidebarWidth,
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          minHeight: "100vh",
          overflow: "hidden",
        }}
        aria-label="Main navigation"
      >
        <SidebarContent
          collapsed={sidebarCollapsed}
          activeTab={activeTab}
          onNavClick={handleNavClick}
          onToggle={toggleSidebar}
        />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className="md:hidden fixed top-0 left-0 h-full z-50 flex flex-col w-[250px] border-r"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            aria-label="Main navigation"
          >
            <SidebarContent
              collapsed={false}
              activeTab={activeTab}
              onNavClick={handleNavClick}
              onToggle={() => setSidebarOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  activeTab: TabId;
  onNavClick: (tab: TabId) => void;
  onToggle: () => void;
}

function SidebarContent({ collapsed, activeTab, onNavClick, onToggle }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 pb-5 pt-4 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={onToggle}
          className="text-2xl cursor-pointer flex-shrink-0 transition-colors"
          style={{ color: "var(--text-base)", background: "none", border: "none" }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className="fas fa-bars" aria-hidden="true" />
        </button>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="flex items-center gap-2 overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                }}
                aria-hidden="true"
              >
                <i className="fas fa-graduation-cap text-sm" />
              </div>
              <span className="font-bold text-lg whitespace-nowrap" style={{ color: "var(--text-base)" }}>
                EduSync
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul
          className={cn("list-none", collapsed ? "px-1" : "px-3")}
          role="menubar"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="mb-1" role="none">
                <button
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center rounded-lg transition-all duration-200 text-left",
                    collapsed
                      ? "justify-center p-3"
                      : "gap-3 px-4 py-3",
                    isActive ? "nav-active" : "hover:bg-[var(--bg-muted)]"
                  )}
                  style={{
                    color: isActive ? "var(--text-base)" : "var(--text-muted)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className={`fas fa-${item.icon} text-sm w-5 text-center flex-shrink-0`}
                    aria-hidden="true"
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
