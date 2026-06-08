"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ASSIGNMENTS } from "@/lib/data";
import {
  getSubmission,
  saveSubmission,
  deleteSubmission,
} from "@/lib/storage";
import type { AssignmentSubmission, AssignmentStatus } from "@/types";

const STATUS_CONFIG: Record<
  AssignmentStatus | "submitted_stored",
  { label: string; icon: string; color: string; bg: string }
> = {
  submitted: {
    label: "SUBMITTED",
    icon: "fa-check-circle",
    color: "var(--success)",
    bg: "rgba(74,214,109,0.15)",
  },
  submitted_stored: {
    label: "SUBMITTED",
    icon: "fa-check-circle",
    color: "var(--success)",
    bg: "rgba(74,214,109,0.15)",
  },
  overdue: {
    label: "OVERDUE",
    icon: "fa-exclamation-circle",
    color: "var(--danger)",
    bg: "rgba(247,37,133,0.15)",
  },
  pending: {
    label: "DUE SOON",
    icon: "fa-clock",
    color: "var(--warning)",
    bg: "rgba(247,184,1,0.15)",
  },
};

export default function AssignmentsTab() {
  const [submissions, setSubmissions] = useState<
    Record<string, AssignmentSubmission | null>
  >({});

  useEffect(() => {
    const stored: Record<string, AssignmentSubmission | null> = {};
    ASSIGNMENTS.forEach((a) => {
      stored[a.id] = getSubmission(a.id);
    });
    setSubmissions(stored);
  }, []);

  function handleSubmit(
    assignmentId: string,
    file: File,
    onDone: () => void
  ) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const submission: AssignmentSubmission = {
        name: file.name,
        data: e.target!.result as string,
        type: file.type,
      };
      saveSubmission(assignmentId, submission);
      setSubmissions((prev) => ({ ...prev, [assignmentId]: submission }));
      onDone();
    };
    reader.readAsDataURL(file);
  }

  function handleDelete(assignmentId: string) {
    if (!confirm("Delete your submission for this assignment?")) return;
    deleteSubmission(assignmentId);
    setSubmissions((prev) => ({ ...prev, [assignmentId]: null }));
  }

  function handleViewSubmission(assignmentId: string) {
    const sub = submissions[assignmentId];
    if (!sub) return;
    const a = document.createElement("a");
    a.href = sub.data;
    a.download = sub.name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-base)" }}>
          Assignments
        </h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--primary)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            All Courses
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--bg-muted)",
              color: "var(--text-base)",
              border: "none",
              cursor: "pointer",
            }}
          >
            All Status
          </button>
        </div>
      </div>

      {/* Assignment list */}
      <div className="flex flex-col gap-4 mb-8">
        {ASSIGNMENTS.map((assignment, i) => {
          const submission = submissions[assignment.id];
          const effectiveStatus = submission
            ? "submitted_stored"
            : assignment.status;
          const config = STATUS_CONFIG[effectiveStatus as keyof typeof STATUS_CONFIG];

          return (
            <motion.div
              key={assignment.id}
              className="relative rounded-xl p-5 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              {/* Status badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-lg mb-2"
                    style={{ background: config.bg, color: config.color }}
                  >
                    <i className={`fas ${config.icon}`} aria-hidden="true" />
                    {config.label}
                  </span>
                  <span
                    className="ml-2 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {assignment.course}
                  </span>
                </div>

                {/* Action button */}
                <AssignmentAction
                  assignmentId={assignment.id}
                  submission={submission}
                  status={assignment.status}
                  onSubmit={handleSubmit}
                  onView={() => handleViewSubmission(assignment.id)}
                  onDelete={() => handleDelete(assignment.id)}
                />
              </div>

              <h3
                className="text-base font-bold mb-1"
                style={{ color: "var(--text-base)" }}
              >
                {assignment.title}
              </h3>
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                {assignment.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <span
                  className="flex items-center gap-1"
                  style={{ color: config.color }}
                >
                  <i className={`fas ${config.icon}`} aria-hidden="true" />
                  {submission
                    ? `Submitted — ${submission.name}`
                    : assignment.due
                    ? `Due: ${assignment.due}`
                    : "Submitted"}
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  <i className="fas fa-star" aria-hidden="true" />
                  {assignment.points} points
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "1", label: "Overdue", color: "var(--danger)" },
          { value: "1", label: "Due This Week", color: "var(--warning)" },
          { value: "1", label: "Completed", color: "var(--success)" },
          { value: "89%", label: "Average Grade", color: "var(--primary)" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-5 text-center"
            style={{ background: "var(--bg-muted)" }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AssignmentActionProps {
  assignmentId: string;
  submission: AssignmentSubmission | null;
  status: AssignmentStatus;
  onSubmit: (id: string, file: File, done: () => void) => void;
  onView: () => void;
  onDelete: () => void;
}

function AssignmentAction({
  assignmentId,
  submission,
  status,
  onSubmit,
  onView,
  onDelete,
}: AssignmentActionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  if (submission) {
    return (
      <div className="flex gap-2 items-center flex-shrink-0">
        <button
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text-base)",
            border: "none",
            cursor: "pointer",
          }}
          onClick={onView}
        >
          View Submission
        </button>
        <button
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "rgba(247,37,133,0.12)",
            color: "var(--danger)",
            border: "none",
            cursor: "pointer",
          }}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    );
  }

  if (status === "submitted") return null;

  return (
    <div className="flex gap-2 items-center flex-shrink-0">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        aria-label="Select file to submit"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onSubmit(assignmentId, file, () => {
            if (fileRef.current) fileRef.current.value = "";
          });
        }}
      />
      <button
        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
        style={{
          background:
            status === "overdue" ? "var(--danger)" : "var(--primary)",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => fileRef.current?.click()}
      >
        {status === "overdue" ? "Submit Now" : "Continue"}
      </button>
    </div>
  );
}
