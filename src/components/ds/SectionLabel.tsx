import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  /** Color override (default uses --ds-fg-subtle) */
  color?: string;
  className?: string;
}

/**
 * Tiny uppercase section label.
 * Replaces 10+ duplicate label patterns across pages.
 */
export default function SectionLabel({
  children,
  color,
  className = "",
}: SectionLabelProps) {
  return (
    <span
      className={`ds-label ${className}`}
      style={color ? { color } : undefined}
    >
      {children}
    </span>
  );
}
