import type { ReactNode } from "react";

interface HeroSectionProps {
  children: ReactNode;
  /** Optional 3D canvas slot rendered behind the content */
  canvasSlot?: ReactNode;
  /** Minimum height (default: 100vh - 64px) */
  minHeight?: string;
  className?: string;
}

/**
 * Full-screen hero section with optional canvas background.
 * Replaces 4+ duplicate hero section patterns.
 */
export default function HeroSection({
  children,
  canvasSlot,
  minHeight = "calc(100vh - 64px)",
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight }}
      aria-label="Hero"
    >
      {canvasSlot && (
        <div className="absolute inset-0 z-[var(--ds-z-base)]">
          {canvasSlot}
        </div>
      )}
      <div
        className="
          relative z-[var(--ds-z-raised)]
          flex flex-col items-center justify-center
          text-center h-full w-full
          px-6 py-16
        "
        style={{ minHeight }}
      >
        {children}
      </div>
    </section>
  );
}
