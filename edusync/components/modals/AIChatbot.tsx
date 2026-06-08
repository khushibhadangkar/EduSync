"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAIMockResponse } from "@/lib/data";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const WELCOME =
  "Hi! I'm EduSync AI. Ask me anything about your dashboard, assignments, or courses.";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for open events from TopBar
  useEffect(() => {
    function handleOpen() {
      setOpen(true);
      setMessages([{ sender: "bot", text: WELCOME }]);
    }
    window.addEventListener("ai-chatbot-open", handleOpen);
    return () => window.removeEventListener("ai-chatbot-open", handleOpen);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: getAIMockResponse(text) },
      ]);
    }, 700);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed z-[4000] bottom-6 right-6 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: "min(360px, 95vw)",
            border: "1px solid var(--border)",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-label="EduSync AI Chatbot"
          aria-modal="true"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: "var(--primary)" }}
          >
            <span className="font-bold text-white flex items-center gap-2">
              <i className="fas fa-robot" aria-hidden="true" />
              EduSync AI
            </span>
            <button
              className="text-white/80 hover:text-white transition-colors text-lg"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setOpen(false)}
              aria-label="Close AI chatbot"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex flex-col gap-3 p-4 overflow-y-auto"
            style={{
              background: "var(--bg-subtle)",
              minHeight: "220px",
              maxHeight: "320px",
            }}
            aria-live="polite"
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className="flex"
                style={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="px-3.5 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed"
                  style={
                    msg.sender === "user"
                      ? {
                          background: "var(--primary)",
                          color: "white",
                          borderRadius: "12px 12px 2px 12px",
                        }
                      : {
                          background: "var(--bg-muted)",
                          color: "var(--primary)",
                          borderRadius: "12px 12px 12px 2px",
                        }
                  }
                >
                  {msg.sender === "bot" && (
                    <i
                      className="fas fa-robot mr-1.5 text-xs"
                      aria-hidden="true"
                    />
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 px-4 py-3 border-t"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything about EduSync..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none"
              style={{
                background: "var(--bg-muted)",
                color: "var(--text-base)",
                borderColor: "var(--border)",
              }}
              aria-label="Ask EduSync AI a question"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90"
              style={{ background: "var(--primary)" }}
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane text-sm" aria-hidden="true" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
