"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: ReactNode;
  /** Whether the modal is visible */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Optional title */
  title?: string;
  /** Max width of the modal content */
  maxWidth?: string;
  className?: string;
}

/**
 * Overlay modal with glass styling and animations.
 * Provides backdrop click to close and escape key support.
 */
export default function Modal({
  children,
  open,
  onClose,
  title,
  maxWidth = "520px",
  className = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Trap focus in modal
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--ds-z-modal)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal dialog"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm ds-animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
        style={{ animation: "ds-fade-in 0.2s ease" }}
      />

      {/* Content */}
      <div
        ref={dialogRef}
        className={`
          relative z-10 w-full
          rounded-[var(--ds-radius-2xl)]
          ds-glass-heavy
          p-8
          ds-animate-scale-in
          ${className}
        `}
        style={{ maxWidth }}
      >
        {/* Close button */}
        <button
          className="
            absolute top-4 right-4
            bg-transparent border-none
            text-[var(--ds-fg-subtle)] text-[1.1rem]
            cursor-none p-1.5 rounded-[var(--ds-radius-sm)]
            ds-transition hover:text-[var(--ds-fg)]
            font-[inherit]
          "
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {title && (
          <h2 className="text-[length:var(--ds-text-xl)] font-bold text-[var(--ds-fg)] mb-4 pr-8">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}
