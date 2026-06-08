"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useAppStore, getInitials } from "@/lib/store";

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileSettingsModal({ open, onClose }: ProfileSettingsModalProps) {
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState(profile.fullName);
  const [preview, setPreview] = useState<string | undefined>(profile.avatarImg);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync when modal opens
  useEffect(() => {
    if (open) {
      setName(profile.fullName);
      setPreview(profile.avatarImg);
    }
  }, [open, profile.fullName, profile.avatarImg]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target!.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setPreview(undefined);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      updateProfile({ fullName: name.trim(), avatarImg: preview });
    }
    onClose();
  }

  const initials = getInitials(name || profile.fullName);

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile" maxWidth="420px">
      <form onSubmit={handleSave} className="flex flex-col items-center gap-4">
        {/* Avatar preview */}
        <label className="cursor-pointer flex flex-col items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            aria-label="Upload avatar image"
          />
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
            style={{
              background: preview
                ? undefined
                : "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
            aria-hidden="true"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Change Avatar
          </span>
        </label>

        <button
          type="button"
          onClick={removeAvatar}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{
            background: "var(--bg-muted)",
            color: "var(--danger)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Remove avatar"
        >
          Remove Avatar
        </button>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[220px] px-3 py-2.5 rounded-lg text-sm font-medium border-none outline-none"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text-base)",
          }}
          aria-label="Your name"
        />

        <button
          type="submit"
          className="w-full max-w-[220px] py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
}
