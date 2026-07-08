import type { ReactNode } from "react";
import Link from "next/link";

interface GlassCardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  /** Enable hover lift + glow effect */
  hover?: boolean;
  /** Enable scale-on-hover instead of lift */
  scaleHover?: boolean;
  /** Custom animation delay for staggered reveals */
  animationDelay?: number;
  /** Enable card-reveal entry animation */
  animate?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Glass-morphic card with optional hover effects and entry animation.
 * Replaces 6+ duplicate card patterns across pages.
 */
export default function GlassCard({
  children,
  href,
  className = "",
  hover = true,
  scaleHover = false,
  animationDelay,
  animate = false,
  onClick,
  ariaLabel,
}: GlassCardProps) {
  const baseClasses = `
    relative flex flex-col
    rounded-[var(--ds-radius-xl)]
    ds-glass cursor-none
    ${hover && !scaleHover ? "ds-card-hover" : ""}
    ${scaleHover ? "ds-scale-hover" : ""}
    ${animate ? "ds-animate-card-reveal" : ""}
    ${className}
  `;

  const style = animationDelay != null ? { animationDelay: `${animationDelay}ms` } : undefined;

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} no-underline`}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={baseClasses}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {children}
    </div>
  );
}
