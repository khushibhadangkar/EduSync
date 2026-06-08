"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
  maxWidth = "500px",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    // Focus the dialog
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4 modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            ref={dialogRef}
            className={cn("rounded-2xl p-8 relative w-full outline-none", className)}
            style={{
              background: "var(--bg-card)",
              maxWidth,
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              border: "1px solid var(--border)",
            }}
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22 }}
            tabIndex={-1}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors text-lg"
              style={{
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>

            {title && (
              <h2
                className="text-xl font-bold mb-5 pr-8"
                style={{ color: "var(--text-base)" }}
              >
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
