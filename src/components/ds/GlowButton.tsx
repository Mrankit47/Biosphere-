import type { ReactNode } from "react";
import Link from "next/link";

interface GlowButtonProps {
  children: ReactNode;
  /** If provided, renders as a Link */
  href?: string;
  onClick?: () => void;
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost";
  /** Accent color override */
  accentColor?: string;
  /** Full width */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

/**
 * CTA button with glow effect.
 * Replaces 5+ duplicate CTA button patterns across pages.
 */
export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  accentColor,
  fullWidth = false,
  disabled = false,
  className = "",
  ariaLabel,
  type = "button",
}: GlowButtonProps) {
  const color = accentColor || "var(--ds-accent)";

  const variantStyles = {
    primary: {
      border: `1.5px solid ${color}`,
      background: `${color}12`,
      color,
      boxShadow: `0 0 24px ${color}2E, 0 0 60px ${color}14, inset 0 0 24px ${color}0F`,
    },
    secondary: {
      border: `1.5px solid ${color}40`,
      background: "transparent",
      color: "var(--ds-fg-muted)",
      boxShadow: "none",
    },
    ghost: {
      border: "1px solid var(--ds-border-muted)",
      background: "var(--ds-surface-subtle)",
      color: "var(--ds-fg-muted)",
      boxShadow: "none",
    },
  };

  const classes = `
    inline-flex items-center justify-center gap-2
    px-8 py-3.5 rounded-[var(--ds-radius-full)]
    text-[length:var(--ds-text-md)] font-semibold tracking-[0.06em]
    cursor-none no-underline
    ds-transition
    hover:brightness-110
    disabled:opacity-50 disabled:pointer-events-none
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  const style = variantStyles[variant];

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
