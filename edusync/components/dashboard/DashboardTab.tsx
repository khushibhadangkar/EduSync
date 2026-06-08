"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { COURSES } from "@/lib/data";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35 },
  }),
};

export default function DashboardTab() {
  const { profile } = useAppStore();

  return (
    <div className="p-4 md:p-6">
      {/* Responsive dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Welcome Card - spans 2 cols on md+ */}
        <motion.div
          className="md:col-span-2 glass-card rounded-xl p-5"
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 20%, transparent), color-mix(in srgb, var(--primary) 5%, transparent))",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "var(--text-base)" }}>
                Welcome back, {profile.fullName.split(" ")[0]}!
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                You have 2 new announcements, 3 pending assignments, and 1 upcoming test this week.
              </p>
              <div className="flex flex-wrap gap-5 mt-4">
                {[
                  { icon: "book-open", value: "5", label: "Courses" },
                  { icon: "star", value: "3.8", label: "GPA" },
                  { icon: "tasks", value: "87%", label: "Completion" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(72, 149, 239, 0.2)",
                        color: "var(--primary-light)",
                      }}
                    >
                      <i className={`fas fa-${stat.icon} text-sm`} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-bold text-lg" style={{ color: "var(--text-base)" }}>
                        {stat.value}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          className="glass-card rounded-xl p-5"
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-semibold text-base mb-4" style={{ color: "var(--text-base)" }}>
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {[
              { icon: "flask", title: "Chemistry Lab Report", sub: "Chapter 5 Experiment Analysis", time: "Today" },
              { icon: "calculator", title: "Math Assignment", sub: "Linear Algebra Problems", time: "Tomorrow" },
              { icon: "laptop-code", title: "Programming Project", sub: "Data Structures Implementation", time: "Fri" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 border-b last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                  style={{
                    background: "rgba(76, 201, 240, 0.2)",
                    color: "var(--accent)",
                  }}
                >
                  <i className={`fas fa-${item.icon}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: "var(--text-base)" }}>
                    {item.title}
                  </div>
                  <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    {item.sub}
                  </div>
                </div>
                <div className="text-xs flex-shrink-0" style={{ color: "var(--accent)" }}>
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Your Courses */}
        <motion.div
          className="md:col-span-2 glass-card rounded-xl p-5"
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-semibold text-base mb-4" style={{ color: "var(--text-base)" }}>
            Your Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {COURSES.slice(0, 3).map((course) => (
              <CourseItem key={course.id} course={course} />
            ))}
          </div>
        </motion.div>

        {/* Academic Progress */}
        <motion.div
          className="glass-card rounded-xl p-5"
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-semibold text-base mb-4" style={{ color: "var(--text-base)" }}>
            Academic Progress
          </h3>
          <div className="flex justify-between mb-4">
            {[
              { value: "3.8", label: "GPA", color: "var(--success)" },
              { value: "87%", label: "Completion", color: "var(--warning)" },
              { value: "92%", label: "Attendance", color: "var(--text-base)" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold" style={{ color: m.color }}>
                  {m.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
          <div
            className="h-[120px] rounded-lg flex items-center justify-center text-sm"
            style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
          >
            Performance Chart
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="glass-card rounded-xl p-5"
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-semibold text-base mb-4" style={{ color: "var(--text-base)" }}>
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "12", label: "Assignments" },
              { value: "3", label: "Upcoming Tests" },
              { value: "24", label: "Video Lectures" },
              { value: "8", label: "Discussion Posts" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg p-3 text-center"
                style={{ background: "var(--bg-muted)" }}
              >
                <div className="text-xl font-bold" style={{ color: "var(--text-base)" }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Assignments */}
        <motion.div
          className="glass-card rounded-xl p-5"
          custom={5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="font-semibold text-base mb-4" style={{ color: "var(--text-base)" }}>
            Recent Assignments
          </h3>
          <div className="space-y-1">
            {[
              { status: "completed", title: "Quantum Physics Problem Set", sub: "Chapter 5 Exercises", due: "Submitted" },
              { status: "pending", title: "Machine Learning Project", sub: "Decision Tree Implementation", due: "Due tomorrow" },
              { status: "overdue", title: "Chemistry Lab Report", sub: "Experiment Analysis", due: "Overdue" },
            ].map((a, i) => {
              const colors = {
                completed: "var(--success)",
                pending: "var(--warning)",
                overdue: "var(--danger)",
              };
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b last:border-0 cursor-pointer hover:bg-[var(--bg-muted)] rounded px-1 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: colors[a.status as keyof typeof colors] }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "var(--text-base)" }}>
                      {a.title}
                    </div>
                    <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {a.sub}
                    </div>
                  </div>
                  <div className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                    {a.due}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div
          className="glass-card rounded-xl p-5"
          custom={6}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <MiniCalendar />
        </motion.div>
      </div>
    </div>
  );
}

function CourseItem({ course }: { course: (typeof COURSES)[0] }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    setTimeout(() => {
      bar.style.width = `${course.progress}%`;
    }, 300);
  }, [course.progress]);

  return (
    <div
      className="rounded-lg p-3 cursor-pointer transition-transform hover:-translate-y-1"
      style={{ background: "var(--bg-muted)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-white"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
        aria-hidden="true"
      >
        <i className={`fas fa-${course.icon} text-sm`} />
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: "var(--text-base)" }}>
        {course.title}
      </div>
      <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        {course.instructor}
      </div>
      <div
        className="h-1 rounded-full mb-1 overflow-hidden"
        style={{ background: "var(--bg-subtle)" }}
        role="progressbar"
        aria-valuenow={course.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${course.title} progress`}
      >
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: "0%",
            background: "linear-gradient(90deg, var(--primary), var(--accent))",
          }}
        />
      </div>
      <div className="text-xs text-right" style={{ color: "var(--text-muted)" }}>
        {course.progress}% complete
      </div>
    </div>
  );
}

function MiniCalendar() {
  const today = 16; // Nov 16, 2023 as in original
  const eventDays = [13, 14, 22];
  const otherMonthStart = [29, 30, 31];
  const otherMonthEnd = [1, 2];
  const days = [...Array(30)].map((_, i) => i + 1);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base" style={{ color: "var(--text-base)" }}>
          Academic Calendar
        </h3>
        <div className="flex gap-2">
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: "var(--bg-muted)", color: "var(--text-muted)", border: "none", cursor: "pointer" }}
            aria-label="Previous month"
          >
            <i className="fas fa-chevron-left" aria-hidden="true" />
          </button>
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: "var(--bg-muted)", color: "var(--text-muted)", border: "none", cursor: "pointer" }}
            aria-label="Next month"
          >
            <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="text-sm font-medium mb-2" style={{ color: "var(--text-base)" }}>
        November 2023
      </div>
      <div className="grid grid-cols-7 text-center text-xs mb-1" style={{ color: "var(--text-muted)" }}>
        {weekdays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {otherMonthStart.map((d) => (
          <div
            key={`prev-${d}`}
            className="aspect-square flex items-center justify-center text-xs rounded-full opacity-40"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}
        {days.map((d) => {
          const isToday = d === today;
          const hasEvent = eventDays.includes(d);
          return (
            <div
              key={d}
              className={`aspect-square flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors relative
                ${hasEvent ? "cal-event" : ""}
                ${!isToday ? "hover:bg-[var(--bg-muted)]" : ""}`}
              style={{
                background: isToday ? "var(--primary)" : undefined,
                color: isToday ? "white" : "var(--text-base)",
                fontWeight: isToday ? 600 : undefined,
              }}
              aria-label={`${d} November${hasEvent ? " (event)" : ""}${isToday ? " (today)" : ""}`}
            >
              {d}
            </div>
          );
        })}
        {otherMonthEnd.map((d) => (
          <div
            key={`next-${d}`}
            className="aspect-square flex items-center justify-center text-xs rounded-full opacity-40"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}
      </div>
    </>
  );
}
