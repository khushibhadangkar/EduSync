"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, getInitials } from "@/lib/store";
import Modal from "@/components/ui/Modal";

export default function ProfileTab() {
  const { profile, updateProfile } = useAppStore();
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ ...profile });

  function openEdit() {
    setForm({ ...profile });
    setShowEdit(true);
  }

  function saveEdit() {
    updateProfile(form);
    setShowEdit(false);
  }

  const initials = getInitials(profile.fullName);

  const fields = [
    { label: "Full Name", id: "fullName", value: profile.fullName },
    { label: "Student ID", id: "studentId", value: profile.studentId },
    { label: "Email", id: "email", value: profile.email },
    { label: "Phone", id: "phone", value: profile.phone },
    { label: "Major", id: "major", value: profile.major },
    { label: "Class Year", id: "classYear", value: profile.classYear },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "var(--text-base)" }}>
        Student Profile
      </h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Profile Card */}
        <motion.div
          className="flex flex-col items-center rounded-2xl p-8 text-center"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            minWidth: "260px",
            maxWidth: "340px",
          }}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 overflow-hidden"
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

          <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-base)" }}>
            {profile.fullName}
          </h2>
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            {profile.major}
          </p>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
            Class of {profile.classYear}
          </p>

          <button
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "var(--primary)" }}
            onClick={openEdit}
            aria-label="Edit your profile"
          >
            Edit Profile
          </button>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          className="flex-1 rounded-2xl p-8"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-bold mb-5" style={{ color: "var(--text-base)" }}>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label
                  className="block text-sm mb-1"
                  style={{ color: "var(--text-muted)" }}
                  htmlFor={`profile-display-${f.id}`}
                >
                  {f.label}
                </label>
                <input
                  id={`profile-display-${f.id}`}
                  type="text"
                  value={f.value}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border-none outline-none cursor-not-allowed"
                  style={{
                    background: "var(--bg-muted)",
                    color: "var(--text-base)",
                  }}
                  aria-readonly="true"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Profile"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { label: "Full Name", key: "fullName", type: "text" },
              { label: "Student ID", key: "studentId", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "text" },
              { label: "Major", key: "major", type: "text" },
              { label: "Class Year", key: "classYear", type: "text" },
            ] as const
          ).map((f) => (
            <div key={f.key}>
              <label
                className="block text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
                htmlFor={`edit-${f.key}`}
              >
                {f.label}
              </label>
              <input
                id={`edit-${f.key}`}
                type={f.type}
                value={form[f.key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border-none outline-none"
                style={{
                  background: "var(--bg-muted)",
                  color: "var(--text-base)",
                }}
              />
            </div>
          ))}
          <div className="sm:col-span-2 mt-2">
            <button
              className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "var(--primary)" }}
              onClick={saveEdit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
