"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAppStore } from "@/lib/store";
import DashboardTab from "@/components/dashboard/DashboardTab";
import CoursesTab from "@/components/courses/CoursesTab";
import AssignmentsTab from "@/components/assignments/AssignmentsTab";
import GradesTab from "@/components/grades/GradesTab";
import VideoLecturesTab from "@/components/videos/VideoLecturesTab";
import DiscussionTab from "@/components/discussions/DiscussionTab";
import ProfileTab from "@/components/profile/ProfileTab";
import SettingsTab from "@/components/settings/SettingsTab";
import TestsTab from "@/components/assignments/TestsTab";
import AIChatbot from "@/components/modals/AIChatbot";

export default function PortalLayout() {
  const { activeTab, sidebarOpen, setSidebarOpen } =
    useAppStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const tabVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  const TAB_COMPONENTS: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab />,
    courses: <CoursesTab />,
    assignments: <AssignmentsTab />,
    tests: <TestsTab />,
    grades: <GradesTab />,
    videos: <VideoLecturesTab />,
    discussion: <DiscussionTab />,
    profile: <ProfileTab />,
    settings: <SettingsTab />,
  };

  return (
    <div
      className="flex min-h-screen relative overflow-x-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{
          marginLeft: 0,
        }}
      >
        <TopBar />

        <main
          className="flex-1 overflow-auto"
          style={{
            background: "var(--bg)",
            backgroundImage:
              activeTab === "dashboard"
                ? `radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 25%),
                   radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--secondary) 15%, transparent) 0%, transparent 25%)`
                : undefined,
          }}
          id="main-content"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {TAB_COMPONENTS[activeTab] || <DashboardTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
