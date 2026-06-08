"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDiscussions, saveDiscussions } from "@/lib/storage";
import type { Discussion } from "@/types";

export default function DiscussionTab() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    setDiscussions(getDiscussions());
  }, []);

  function persist(updated: Discussion[]) {
    setDiscussions(updated);
    saveDiscussions(updated);
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    const title = titleInput.trim();
    if (!title) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const newThread: Discussion = {
      id: String(Date.now()),
      title,
      author: "You",
      tags,
      replies: [],
      lastActivity: new Date().toLocaleString(),
    };
    persist([newThread, ...discussions]);
    setTitleInput("");
    setTagsInput("");
  }

  function addReply(idx: number, content: string) {
    const updated = [...discussions];
    updated[idx] = {
      ...updated[idx],
      replies: [...updated[idx].replies, { author: "You", content }],
      lastActivity: new Date().toLocaleString(),
    };
    persist(updated);
  }

  function editThread(idx: number) {
    const newTitle = window.prompt("Edit thread title:", discussions[idx].title);
    if (!newTitle || !newTitle.trim() || newTitle.trim() === discussions[idx].title) return;
    const updated = [...discussions];
    updated[idx] = {
      ...updated[idx],
      title: newTitle.trim(),
      lastActivity: new Date().toLocaleString(),
    };
    persist(updated);
  }

  function deleteThread(idx: number) {
    if (!window.confirm(`Delete thread "${discussions[idx].title}"?`)) return;
    const updated = [...discussions];
    updated.splice(idx, 1);
    persist(updated);
  }

  function editReply(threadIdx: number, replyIdx: number) {
    const reply = discussions[threadIdx].replies[replyIdx];
    const newContent = window.prompt("Edit your reply:", reply.content);
    if (!newContent || !newContent.trim() || newContent.trim() === reply.content) return;
    const updated = [...discussions];
    const replies = [...updated[threadIdx].replies];
    replies[replyIdx] = { ...replies[replyIdx], content: newContent.trim() };
    updated[threadIdx] = {
      ...updated[threadIdx],
      replies,
      lastActivity: new Date().toLocaleString(),
    };
    persist(updated);
  }

  function deleteReply(threadIdx: number, replyIdx: number) {
    const reply = discussions[threadIdx].replies[replyIdx];
    if (!window.confirm(`Delete reply: "${reply.content.substring(0, 50)}${reply.content.length > 50 ? "..." : ""}"?`)) return;
    const updated = [...discussions];
    const replies = [...updated[threadIdx].replies];
    replies.splice(replyIdx, 1);
    updated[threadIdx] = {
      ...updated[threadIdx],
      replies,
      lastActivity: new Date().toLocaleString(),
    };
    persist(updated);
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "var(--text-base)" }}>
        Community Discussions
      </h1>

      {/* New Thread Form */}
      <motion.div
        className="rounded-xl p-5 mb-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handlePost} className="flex flex-wrap gap-3 items-end">
          <div className="flex-[2] min-w-[180px]">
            <label
              className="block text-sm font-semibold mb-1"
              style={{ color: "var(--text-muted)" }}
              htmlFor="discussion-title"
            >
              Title
            </label>
            <input
              id="discussion-title"
              type="text"
              placeholder="Start a new topic..."
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border-none outline-none text-sm font-medium"
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-base)",
              }}
              aria-required="true"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label
              className="block text-sm font-semibold mb-1"
              style={{ color: "var(--text-muted)" }}
              htmlFor="discussion-tags"
            >
              Tags
            </label>
            <input
              id="discussion-tags"
              type="text"
              placeholder="e.g. Project, Help"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border-none outline-none text-sm font-medium"
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-base)",
              }}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Post
          </button>
        </form>
      </motion.div>

      {/* Thread List */}
      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {discussions.map((d, idx) => (
            <ThreadCard
              key={d.id}
              thread={d}
              isAuthor={d.author === "You"}
              onEdit={() => editThread(idx)}
              onDelete={() => deleteThread(idx)}
              onAddReply={(content) => addReply(idx, content)}
              onEditReply={(rIdx) => editReply(idx, rIdx)}
              onDeleteReply={(rIdx) => deleteReply(idx, rIdx)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ThreadCardProps {
  thread: Discussion;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddReply: (content: string) => void;
  onEditReply: (replyIdx: number) => void;
  onDeleteReply: (replyIdx: number) => void;
}

function ThreadCard({
  thread,
  isAuthor,
  onEdit,
  onDelete,
  onAddReply,
  onEditReply,
  onDeleteReply,
}: ThreadCardProps) {
  const [replyInput, setReplyInput] = useState("");

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    const content = replyInput.trim();
    if (!content) return;
    onAddReply(content);
    setReplyInput("");
  }

  return (
    <motion.div
      className="rounded-xl p-5 transition-all"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
    >
      {/* Thread header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-bold text-base" style={{ color: "var(--text-base)" }}>
          {thread.title}
        </h3>
        {isAuthor && (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded text-xs transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--primary)]"
              style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
              aria-label="Edit thread"
            >
              <i className="fas fa-edit" aria-hidden="true" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded text-xs transition-colors hover:bg-[var(--bg-muted)]"
              style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
              aria-label="Delete thread"
            >
              <i className="fas fa-trash" style={{ color: "var(--danger)" }} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
        <span>By {thread.author}</span>
        <span className="mx-2">·</span>
        <span className="font-semibold" style={{ color: "var(--primary)" }}>
          {thread.replies.length} replies
        </span>
        <span className="mx-2">·</span>
        <span>Last: {thread.lastActivity}</span>
      </div>

      {/* Tags */}
      {thread.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {thread.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-lg text-xs font-medium text-white"
              style={{ background: "var(--accent)" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Replies */}
      {thread.replies.length > 0 && (
        <div
          className="pl-4 border-l-2 mb-3 flex flex-col gap-2"
          style={{ borderColor: "var(--bg-muted)" }}
          aria-label="Replies"
        >
          {thread.replies.map((r, rIdx) => (
            <div key={rIdx} className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-sm" style={{ color: "var(--primary)" }}>
                  {r.author}:
                </span>{" "}
                <span className="text-sm" style={{ color: "var(--text-base)" }}>
                  {r.content}
                </span>
              </div>
              {r.author === "You" && (
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEditReply(rIdx)}
                    className="p-1 rounded text-xs transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--primary)]"
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                    aria-label="Edit reply"
                  >
                    <i className="fas fa-edit" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => onDeleteReply(rIdx)}
                    className="p-1 rounded text-xs transition-colors hover:bg-[var(--bg-muted)]"
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                    aria-label="Delete reply"
                  >
                    <i className="fas fa-trash" style={{ color: "var(--danger)" }} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <form onSubmit={handleReply} className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Write a reply..."
          value={replyInput}
          onChange={(e) => setReplyInput(e.target.value)}
          required
          className="flex-1 px-3 py-2 rounded-lg text-sm border-none outline-none"
          style={{ background: "var(--bg-muted)", color: "var(--text-base)" }}
          aria-label="Write a reply"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          Reply
        </button>
      </form>
    </motion.div>
  );
}
