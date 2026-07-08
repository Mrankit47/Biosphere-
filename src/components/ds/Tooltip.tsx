"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * Reusable hover tooltip component.
 */
export default function Tooltip({
  children,
  content,
  position = "top",
  className = "",
}: TooltipProps) {
  const [active, setActive] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      {active && (
        <div
          className={`
            absolute z-[var(--ds-z-tooltip)]
            px-3 py-1.5 rounded-[var(--ds-radius-sm)]
            bg-[var(--ds-surface-overlay)] border border-[var(--ds-border-muted)]
            text-[var(--ds-fg)] text-[length:var(--ds-text-sm)]
            whitespace-nowrap backdrop-blur-md shadow-[var(--ds-shadow-sm)]
            ds-animate-scale-in pointer-events-none
            ${positionStyles[position]}
          `}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}
