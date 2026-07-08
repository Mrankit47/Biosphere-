import type { ReactNode } from "react";

interface SlidePanelProps {
  children: ReactNode;
  /** Whether the panel is visible */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Which side the panel slides from */
  side?: "right" | "left";
  /** Panel width */
  width?: string;
  className?: string;
}

/**
 * Slide-in glass panel/sidebar.
 * Replaces 4+ duplicate panel patterns across pages.
 */
export default function SlidePanel({
  children,
  open,
  onClose,
  side = "right",
  width = "min(360px, 85vw)",
  className = "",
}: SlidePanelProps) {
  const isRight = side === "right";
  const translateHidden = isRight ? "translateX(110%)" : "translateX(-110%)";

  return (
    <div
      className={`
        absolute top-0 h-full z-[var(--ds-z-panel)]
        flex flex-col items-center gap-2
        overflow-y-auto box-border
        ds-glass-heavy
        ${isRight ? "right-0 border-l" : "left-0 border-r"}
        border-[var(--ds-border-accent)]
        ${className}
      `}
      style={{
        width,
        padding: "48px 28px 28px",
        transform: open ? "translateX(0)" : translateHidden,
        opacity: open ? 1 : 0,
        transition:
          "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease",
      }}
      role="dialog"
      aria-hidden={!open}
    >
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
        aria-label="Close panel"
      >
        ✕
      </button>
      {children}
    </div>
  );
}
