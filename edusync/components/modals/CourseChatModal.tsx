"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { getChatMessages, saveChatMessages } from "@/lib/storage";
import { INSTRUCTOR_AVATARS } from "@/lib/data";
import { formatMessageTime, getInitials } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import Image from "next/image";

const RESPONSES = [
  "Thank you for your question! I'll get back to you soon.",
  "That's a great question. Let me think about the best way to explain this.",
  "I appreciate you reaching out. Here's what I can tell you about that.",
  "Thanks for asking! This is an important concept to understand.",
  "I'm glad you're engaging with the material. Let me clarify that for you.",
  "Excellent question! This relates to what we discussed in the last lecture.",
  "I understand your concern. Let me provide some additional resources.",
  "That's a common question. Here's how I usually approach this topic.",
];

interface CourseChatModalProps {
  courseName: string;
  instructorName: string;
  onClose: () => void;
}

export default function CourseChatModal({
  courseName,
  instructorName,
  onClose,
}: CourseChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let msgs = getChatMessages(courseName);
    if (msgs.length === 0) {
      // Seed demo messages
      msgs = [
        {
          id: 1,
          author: instructorName,
          text: `Welcome to ${courseName}! I'm here to help you with any questions you might have.`,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isInstructor: true,
        },
        {
          id: 2,
          author: "You",
          text: "Thank you! I have a question about the latest assignment.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isInstructor: false,
        },
        {
          id: 3,
          author: instructorName,
          text: "Of course! What would you like to know?",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          isInstructor: true,
        },
      ];
      saveChatMessages(courseName, msgs);
    }
    setMessages(msgs);
  }, [courseName, instructorName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      author: "You",
      text,
      timestamp: new Date().toISOString(),
      isInstructor: false,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveChatMessages(courseName, updated);
    setInput("");

    // Simulate instructor response
    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      const response: ChatMessage = {
        id: Date.now() + 1,
        author: instructorName,
        text: RESPONSES[Math.floor(Math.random() * RESPONSES.length)],
        timestamp: new Date().toISOString(),
        isInstructor: true,
      };
      setMessages((prev) => {
        const next = [...prev, response];
        saveChatMessages(courseName, next);
        return next;
      });
    }, delay);
  }

  const instructorAvatar = INSTRUCTOR_AVATARS[instructorName];

  return (
    <Modal
      open={true}
      onClose={onClose}
      maxWidth="600px"
      className="flex flex-col"
    >
      {/* Chat header */}
      <div
        className="flex items-center justify-between pb-4 mb-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--text-base)" }}>
          <i className="fas fa-comments" style={{ color: "var(--primary)" }} aria-hidden="true" />
          {courseName}
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {instructorAvatar && (
            <Image
              src={instructorAvatar}
              alt={instructorName}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span>{instructorName}</span>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1"
        style={{ maxHeight: "360px", minHeight: "200px" }}
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg) => {
          const isSent = !msg.isInstructor;
          return (
            <motion.div
              key={msg.id}
              className={`flex gap-2 items-end ${isSent ? "flex-row-reverse" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                }}
                aria-hidden="true"
              >
                {getInitials(msg.author)}
              </div>

              {/* Bubble */}
              <div
                className="max-w-[72%] rounded-2xl px-4 py-2.5"
                style={{
                  background: isSent ? "var(--primary)" : "var(--bg-muted)",
                  color: isSent ? "white" : "var(--text-base)",
                  borderRadius: isSent ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                }}
              >
                <div className="flex justify-between items-center gap-3 mb-1">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isSent ? "rgba(255,255,255,0.9)" : "var(--primary)" }}
                  >
                    {msg.author}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: isSent ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
                  >
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex gap-2 pt-4 mt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          maxLength={500}
          className="flex-1 px-4 py-2.5 rounded-full text-sm border outline-none"
          style={{
            background: "var(--bg-muted)",
            color: "var(--text-base)",
            borderColor: "var(--border)",
          }}
          aria-label="Type a message"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{ background: "var(--primary)" }}
          aria-label="Send message"
        >
          <i className="fas fa-paper-plane text-sm" aria-hidden="true" />
        </button>
      </div>
    </Modal>
  );
}
