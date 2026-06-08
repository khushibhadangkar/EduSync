"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, getInitials } from "@/lib/store";
import { SEARCH_DATA } from "@/lib/data";
import { highlightMatch } from "@/lib/utils";
import type { TabId } from "@/types";
import ProfileSettingsModal from "@/components/modals/ProfileSettingsModal";

export default function TopBar() {
  const { profile, setSidebarOpen, setActiveTab } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? {
        courses: SEARCH_DATA.courses.filter((c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        assignments: SEARCH_DATA.assignments.filter((a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        grades: SEARCH_DATA.grades.filter((g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : null;

  const hasResults =
    searchResults &&
    (searchResults.courses.length > 0 ||
      searchResults.assignments.length > 0 ||
      searchResults.grades.length > 0);

  const handleSearchResultClick = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      setSearchQuery("");
      setShowDropdown(false);
    },
    [setActiveTab]
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Broadcast AI open state via custom event
  useEffect(() => {
    const event = new CustomEvent("ai-chatbot-toggle", { detail: { open: aiOpen } });
    window.dispatchEvent(event);
  }, [aiOpen]);

  const initials = getInitials(profile.fullName);

  return (
    <>
      <header
        className="h-[70px] flex items-center justify-between px-4 md:px-6 border-b sticky top-0 z-20 flex-shrink-0"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
        role="banner"
      >
        {/* Left: Hamburger (mobile) + Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <i className="fas fa-bars text-xl" aria-hidden="true" />
          </button>

          {/* Search */}
          <div className="relative flex-1" ref={searchRef}>
            <div
              className="flex items-center rounded-lg px-3 py-2 gap-2"
              style={{ background: "var(--bg-muted)" }}
            >
              <i
                className="fas fa-search text-sm flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search courses, assignments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(!!e.target.value.trim());
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowDropdown(true);
                }}
                className="bg-transparent border-none outline-none flex-1 text-sm min-w-0"
                style={{ color: "var(--text-base)" }}
                aria-label="Search courses and assignments"
                autoComplete="off"
              />
            </div>

            {/* Search dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-50 overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  aria-label="Search results"
                >
                  {!hasResults ? (
                    <div className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      No results found
                    </div>
                  ) : (
                    <>
                      {searchResults!.courses.length > 0 && (
                        <SearchSection
                          label="Courses"
                          items={searchResults!.courses}
                          query={searchQuery}
                          tab="courses"
                          onClick={handleSearchResultClick}
                        />
                      )}
                      {searchResults!.assignments.length > 0 && (
                        <SearchSection
                          label="Assignments"
                          items={searchResults!.assignments}
                          query={searchQuery}
                          tab="assignments"
                          onClick={handleSearchResultClick}
                        />
                      )}
                      {searchResults!.grades.length > 0 && (
                        <SearchSection
                          label="Grades"
                          items={searchResults!.grades}
                          query={searchQuery}
                          tab="grades"
                          onClick={handleSearchResultClick}
                        />
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Chat button */}
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium flex-shrink-0 transition-all hover:opacity-90"
            style={{ background: "var(--primary)" }}
            onClick={() => setAiOpen(true)}
            aria-label="Open EduSync AI assistant"
          >
            <i className="fas fa-robot" aria-hidden="true" />
            <span>Chat</span>
          </button>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <button
            className="relative text-xl transition-colors"
            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
            aria-label="View notifications (3 new)"
          >
            <i className="fas fa-bell" aria-hidden="true" />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-semibold"
              style={{ background: "var(--danger)" }}
              aria-hidden="true"
            >
              3
            </span>
          </button>

          {/* User profile */}
          <button
            className="flex items-center gap-2 cursor-pointer"
            style={{ background: "none", border: "none" }}
            onClick={() => setShowProfileModal(true)}
            aria-label="Edit your profile"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white overflow-hidden"
              style={{
                background: profile.avatarImg
                  ? undefined
                  : "linear-gradient(135deg, var(--primary), var(--secondary))",
              }}
              aria-hidden="true"
            >
              {profile.avatarImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarImg}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <span
              className="hidden sm:block text-sm font-medium"
              style={{ color: "var(--text-base)" }}
            >
              {profile.fullName}
            </span>
          </button>
        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* AI Chatbot toggle bridge */}
      {aiOpen && (
        <AIChatbotBridge onClose={() => setAiOpen(false)} />
      )}
    </>
  );
}

// Thin bridge to pass the open state to AIChatbot
function AIChatbotBridge({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("ai-chatbot-open"));
    return () => {
      // cleanup — modal handles its own close
    };
  }, [onClose]);
  return null;
}

interface SearchSectionProps {
  label: string;
  items: { title: string; tab: string }[];
  query: string;
  tab: TabId;
  onClick: (tab: TabId) => void;
}

function SearchSection({ label, items, query, tab, onClick }: SearchSectionProps) {
  return (
    <>
      <div
        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--primary)" }}
      >
        {label}
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--primary)] block"
          style={{ color: "var(--text-base)", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => onClick(tab as TabId)}
          dangerouslySetInnerHTML={{ __html: highlightMatch(item.title, query) }}
          aria-label={`Go to ${item.title} in ${label}`}
        />
      ))}
    </>
  );
}
