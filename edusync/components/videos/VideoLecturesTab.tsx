"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { VIDEO_LECTURES } from "@/lib/data";
import type { VideoLecture } from "@/types";

const FILTER_OPTIONS = ["all", "React", "Python", "Databases", "AI"];

export default function VideoLecturesTab() {
  const [featured, setFeatured] = useState<VideoLecture>(VIDEO_LECTURES[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return VIDEO_LECTURES.filter(
      (v) =>
        (filter === "all" || v.tags.includes(filter)) &&
        (v.title.toLowerCase().includes(q) ||
          v.instructor.toLowerCase().includes(q) ||
          v.tags.join(" ").toLowerCase().includes(q))
    );
  }, [search, filter]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "var(--text-base)" }}>
        Video Lectures
      </h1>

      {/* Featured Video */}
      <motion.div
        className="rounded-xl p-5 mb-6 flex flex-col lg:flex-row gap-6 items-start"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <iframe
          className="w-full lg:w-[420px] h-[236px] rounded-xl flex-shrink-0"
          src={featured.url}
          title={featured.title}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          aria-label={`Video: ${featured.title}`}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-base)" }}>
            {featured.title}
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            {featured.instructor} • {featured.duration}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {featured.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-0.5 rounded-lg text-xs font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {featured.desc}
          </p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg"
          style={{ background: "var(--bg-muted)" }}
        >
          <i className="fas fa-search text-sm" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search lectures..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm"
            style={{ color: "var(--text-base)" }}
            aria-label="Search video lectures"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium border-none outline-none"
          style={{ background: "var(--bg-muted)", color: "var(--text-base)" }}
          aria-label="Filter by topic"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All Topics" : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((v, i) => (
          <motion.button
            key={v.id}
            className="flex gap-4 items-center rounded-xl p-4 text-left w-full transition-all duration-200 hover:-translate-y-1"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              cursor: "pointer",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            onClick={() => setFeatured(v)}
            aria-label={`Play ${v.title} by ${v.instructor}`}
          >
            <div className="relative w-[90px] h-[60px] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={v.thumb}
                alt={v.title}
                fill
                className="object-cover"
                sizes="90px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <i className="fas fa-play text-white text-xs" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-bold text-sm mb-1 truncate"
                style={{ color: "var(--text-base)" }}
              >
                {v.title}
              </div>
              <div className="text-xs mb-1 truncate" style={{ color: "var(--text-muted)" }}>
                {v.instructor}
              </div>
              <div className="flex flex-wrap gap-1 mb-1">
                {v.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-xs text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {v.duration}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-12 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          No lectures match your search.
        </div>
      )}
    </div>
  );
}
