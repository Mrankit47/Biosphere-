"use client";

import Link from "next/link";

interface BackLinkProps {
  href?: string;
  label?: string;
  className?: string;
  relative?: boolean;
}

/**
 * Reusable back-navigation link with glass styling.
 * Replaces duplicate back-link patterns across 8+ pages.
 */
export default function BackLink({
  href = "/",
  label = "Home",
  className = "",
  relative = false,
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`
        ${relative ? "relative" : "absolute top-5 left-6"}
        z-[var(--ds-z-overlay)]
        inline-flex items-center gap-2
        px-3.5 py-2 rounded-[var(--ds-radius-md)]
        bg-[var(--ds-surface-overlay)] border border-[var(--ds-border-accent)]
        text-[var(--ds-fg-muted)] text-[length:var(--ds-text-base)]
        backdrop-blur-lg cursor-none no-underline
        ds-transition hover:text-[var(--ds-accent)] hover:border-[var(--ds-border-accent-hover)]
        ${className}
      `}
      aria-label={`Go back to ${label}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
