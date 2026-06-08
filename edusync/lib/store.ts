"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// NOTE: We use React state in components instead of zustand to avoid
// adding another dependency. This file provides a lightweight shared context.

import type {
  StudentProfile,
  AppSettings,
  AccentColor,
  ThemeMode,
  TabId,
} from "@/types";
import { getInitials } from "./utils";

interface AppState {
  // Navigation
  activeTab: TabId;
  sidebarCollapsed: boolean;
  sidebarOpen: boolean; // mobile

  // Profile
  profile: StudentProfile;

  // Settings
  settings: AppSettings;

  // Actions
  setActiveTab: (tab: TabId) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setNotification: (key: string, value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: "dashboard",
      sidebarCollapsed: false,
      sidebarOpen: false,

      profile: {
        fullName: "John Smith",
        studentId: "CS2025001",
        email: "john.smith@university.edu",
        phone: "+1 (555) 123-4567",
        major: "Computer Science",
        classYear: "2025",
      },

      settings: {
        theme: "light",
        darkMode: false,
        accent: "#4cc9f0",
        notifications: {
          assignments: true,
          grades: true,
          messages: true,
          courses: true,
          discussions: true,
        },
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      setTheme: (theme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme,
            darkMode: theme === "dark",
          },
        })),

      setAccent: (accent) =>
        set((state) => ({
          settings: { ...state.settings, accent },
        })),

      setNotification: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              [key]: value,
            },
          },
        })),
    }),
    {
      name: "edusync-store",
      partialize: (state) => ({
        profile: state.profile,
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export { getInitials };
