"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { COURSES } from "@/lib/data";

export default function GradesTab() {
  function exportGrades() {
    const lines = [
      "EduSync — Grade Report",
      "========================",
      `Current GPA: 3.7`,
      `Cumulative GPA: 3.8`,
      `Total Credits: 9`,
      "",
      "Course Grades",
      "-------------",
    ];
    COURSES.forEach((c) => {
      lines.push(`${c.title} (${c.code})`);
      lines.push(`  Instructor: ${c.instructor}`);
      lines.push(`  Credits: ${c.credits}`);
      lines.push(`  Grade: ${c.grade}`);
      lines.push(`  Progress: ${c.progress}%`);
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "EduSync_GradeReport.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-base)" }}>
          Grades &amp; Performance
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="px-3 py-2 rounded-lg text-sm font-medium border-none outline-none"
            style={{
              background: "var(--bg-muted)",
              color: "var(--text-base)",
            }}
            aria-label="Select semester"
          >
            <option>Current Semester</option>
            <option>Fall 2023</option>
            <option>Spring 2023</option>
          </select>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--bg-muted)",
              color: "var(--text-base)",
              border: "none",
              cursor: "pointer",
            }}
            onClick={exportGrades}
            aria-label="Export grade report"
          >
            <i className="fas fa-download" aria-hidden="true" />
            Export Report
          </button>
        </div>
      </div>

      {/* GPA Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { value: "3.7", label: "Current GPA", color: "var(--success)" },
          { value: "3.8", label: "Cumulative GPA", color: "var(--primary-light)" },
          { value: "9", label: "Total Credits", color: "var(--warning)" },
          { value: "3", label: "Courses", color: "var(--accent)" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="rounded-xl p-5 text-center"
            style={{ background: "var(--bg-muted)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grades Table */}
      <motion.div
        className="rounded-xl p-5 mb-6 overflow-x-auto"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-base)" }}>
          Course Grades
        </h2>
        <table className="w-full min-w-[600px]" aria-label="Course grades">
          <thead>
            <tr>
              {["Course", "Instructor", "Credits", "Current Grade", "Progress", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left pb-3 text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                    scope="col"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {COURSES.map((course, i) => (
              <GradeRow key={course.id} course={course} delay={i * 0.07} />
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Grade Trends placeholder */}
      <motion.div
        className="rounded-xl p-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <h2 className="flex items-center gap-2 text-base font-bold mb-4" style={{ color: "var(--text-base)" }}>
          <i className="fas fa-chart-line" style={{ color: "var(--primary)" }} aria-hidden="true" />
          Grade Trends
        </h2>
        <div
          className="h-[120px] rounded-lg flex items-center justify-center text-sm"
          style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
        >
          Grade chart would appear here
        </div>
      </motion.div>
    </div>
  );
}

function GradeRow({ course, delay }: { course: (typeof COURSES)[0]; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.width = `${course.progress}%`;
    }, 400);
    return () => clearTimeout(t);
  }, [course.progress]);

  return (
    <motion.tr
      className="border-t hover:bg-[var(--bg-muted)] transition-all duration-200 cursor-pointer"
      style={{ borderColor: "var(--border)" }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
      onClick={() => {/* open grade detail */}}
      role="row"
    >
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
            aria-hidden="true"
          >
            {course.id.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--text-base)" }}>
              {course.title}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {course.code}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm" style={{ color: "var(--text-base)" }}>
        {course.instructor}
      </td>
      <td className="py-3 pr-4 text-sm" style={{ color: "var(--text-base)" }}>
        {course.credits}
      </td>
      <td className="py-3 pr-4">
        <span className={course.gradeBadgeClass}>
          {course.grade}
        </span>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-[70px] rounded-full overflow-hidden"
            style={{ background: "var(--bg-muted)" }}
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
          <span className="text-sm" style={{ color: "var(--text-base)" }}>
            {course.progress}%
          </span>
        </div>
      </td>
      <td className="py-3">
        <button
          className="text-sm font-semibold transition-colors hover:underline"
          style={{ color: "var(--primary-light)", background: "none", border: "none", cursor: "pointer" }}
          aria-label={`View grade details for ${course.title}`}
        >
          View Details
        </button>
      </td>
    </motion.tr>
  );
}
