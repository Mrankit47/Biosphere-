import type { ReactNode } from "react";

interface PillBadgeProps {
  children: ReactNode;
  /** Accent color (default: var(--ds-accent)) */
  color?: string;
  /** Show a pulsing dot indicator */
  pulseDot?: boolean;
  className?: string;
}

/**
 * Small colored pill/badge component.
 * Replaces 10+ duplicate pill/badge patterns.
 */
export default function PillBadge({
  children,
  color,
  pulseDot = false,
  className = "",
}: PillBadgeProps) {
  const accentColor = color || "var(--ds-accent)";

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-[18px] py-1.5 rounded-[var(--ds-radius-full)]
        text-[length:var(--ds-text-sm)] font-semibold tracking-[0.14em]
        ${className}
      `}
      style={{
        border: `1px solid ${accentColor}40`,
        background: `${accentColor}0F`,
        color: accentColor,
      }}
    >
      {pulseDot && (
        <span
          className="w-2 h-2 rounded-full ds-animate-pulse-glow shrink-0"
          style={{
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
