interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Skeleton component with shimmer animation.
 */
export default function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const borderRadius =
    variant === "circular"
      ? "var(--ds-radius-full)"
      : variant === "text"
      ? "var(--ds-radius-sm)"
      : "var(--ds-radius-lg)";

  return (
    <div
      className={`
        relative overflow-hidden
        bg-[var(--ds-surface-subtle)]
        border border-[var(--ds-border-muted)]
        ds-animate-shimmer
        ${className}
      `}
      style={{
        width: width ?? "100%",
        height: height ?? (variant === "text" ? "1em" : "100px"),
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}
