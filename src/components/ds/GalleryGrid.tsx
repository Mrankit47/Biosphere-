import type { ReactNode } from "react";

interface GalleryGridProps {
  children: ReactNode;
  /** Minimum item width for auto-fill (default: 280px) */
  minItemWidth?: string;
  /** Gap between items (default: 20px) */
  gap?: string;
  /** Max width of the grid container */
  maxWidth?: string;
  className?: string;
}

/**
 * Responsive auto-fill grid layout.
 * Replaces 6+ duplicate grid patterns across pages.
 */
export default function GalleryGrid({
  children,
  minItemWidth = "280px",
  gap = "20px",
  maxWidth = "1200px",
  className = "",
}: GalleryGridProps) {
  return (
    <div
      className={`grid mx-auto ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`,
        gap,
        maxWidth,
      }}
    >
      {children}
    </div>
  );
}
