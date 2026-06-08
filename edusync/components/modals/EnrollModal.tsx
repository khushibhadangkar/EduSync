"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  onEnroll: (name: string, instructor: string) => void;
}

export default function EnrollModal({ open, onClose, onEnroll }: EnrollModalProps) {
  const [courseName, setCourseName] = useState("");
  const [instructor, setInstructor] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = courseName.trim();
    const inst = instructor.trim();
    if (!name || !inst) {
      alert("Please enter both course name and instructor.");
      return;
    }
    onEnroll(name, inst);
    setCourseName("");
    setInstructor("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Enroll in a New Course" maxWidth="420px">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border-none outline-none"
          style={{ background: "var(--bg-muted)", color: "var(--text-base)" }}
          aria-label="Course name"
        />
        <input
          type="text"
          placeholder="Instructor"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border-none outline-none"
          style={{ background: "var(--bg-muted)", color: "var(--text-base)" }}
          aria-label="Instructor name"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          Enroll
        </button>
      </form>
    </Modal>
  );
}
