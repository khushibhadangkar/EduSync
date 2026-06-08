"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { COURSES } from "@/lib/data";
import { getBookmarks, toggleBookmark } from "@/lib/storage";
import CourseChatModal from "@/components/modals/CourseChatModal";
import EnrollModal from "@/components/modals/EnrollModal";

export default function CoursesTab() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [chatCourse, setChatCourse] = useState<{ name: string; instructor: string } | null>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [courses, setCourses] = useState(COURSES);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleBookmark(courseId: string) {
    toggleBookmark(courseId);
    setBookmarks(getBookmarks());
  }

  function handleEnroll(name: string, instructor: string) {
    setCourses((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: name,
        instructor,
        instructorAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        progress: 0,
        modulesCompleted: 0,
        totalModules: 1,
        nextTopic: "Module 1",
        icon: "book",
        code: "NEW",
        credits: 3,
        grade: "N/A",
        gradeBadgeClass: "grade-a",
      },
    ]);
    setShowEnroll(false);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-base)" }}>
          My Courses
        </h1>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: "var(--accent)" }}
          onClick={() => setShowEnroll(true)}
          aria-label="Enroll in a new course"
        >
          <i className="fas fa-plus" aria-hidden="true" />
          Enroll in Course
        </button>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            className="relative rounded-2xl p-6 flex flex-col min-h-[200px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 12px rgba(60,60,60,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            {/* Course icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white"
              style={{ background: "var(--bg-muted)" }}
              aria-hidden="true"
            >
              <i className={`fas fa-${course.icon} text-lg`} style={{ color: "var(--primary)" }} />
            </div>

            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-base)" }}>
              {course.title}
            </h3>

            {/* Instructor */}
            <div
              className="flex items-center gap-2 text-sm mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              <Image
                src={course.instructorAvatar}
                alt={course.instructor}
                width={22}
                height={22}
                className="rounded-full"
              />
              <span>{course.instructor}</span>
            </div>

            {/* Progress */}
            <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
              Progress
            </div>
            <ProgressBar progress={course.progress} />
            <div
              className="flex justify-between text-xs mt-1 mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              <span>
                {course.modulesCompleted}/{course.totalModules} modules completed
              </span>
              <span>Next: {course.nextTopic}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "var(--accent)" }}
                aria-label={`Continue learning ${course.title}`}
              >
                Continue Learning
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "var(--primary)" }}
                onClick={() =>
                  setChatCourse({ name: course.title, instructor: course.instructor })
                }
                aria-label={`Open chat for ${course.title}`}
              >
                <i className="fas fa-comments text-xs" aria-hidden="true" />
                Chat
              </button>
            </div>

            {/* Bookmark */}
            <button
              className="absolute bottom-4 right-4 text-xl transition-colors"
              style={{
                color: bookmarks.includes(course.id)
                  ? "var(--primary)"
                  : "var(--accent)",
                opacity: bookmarks.includes(course.id) ? 1 : 0.6,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark(course.id);
              }}
              aria-label={
                bookmarks.includes(course.id)
                  ? `Remove ${course.title} from bookmarks`
                  : `Bookmark ${course.title}`
              }
              aria-pressed={bookmarks.includes(course.id)}
            >
              <i
                className={`fas fa-bookmark ${bookmarks.includes(course.id) ? "" : "far"}`}
                aria-hidden="true"
              />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { value: courses.length, label: "Active Courses", color: "var(--primary)" },
          { value: 360, label: "Hours Studied", color: "var(--warning)" },
          { value: courses.reduce((s, c) => s + c.modulesCompleted, 0), label: "Modules Completed", color: "var(--accent)" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl p-6 text-center font-semibold"
            style={{ background: "var(--bg-muted)", color: "var(--text-base)" }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Course Chat Modal */}
      {chatCourse && (
        <CourseChatModal
          courseName={chatCourse.name}
          instructorName={chatCourse.instructor}
          onClose={() => setChatCourse(null)}
        />
      )}

      {/* Enroll Modal */}
      <EnrollModal
        open={showEnroll}
        onClose={() => setShowEnroll(false)}
        onEnroll={handleEnroll}
      />
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.width = `${progress}%`;
    }, 200);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div
      className="h-2 rounded-full overflow-hidden mb-1"
      style={{ background: "var(--bg-subtle)" }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
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
  );
}
