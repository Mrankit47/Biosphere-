interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

/**
 * Reusable Loading Spinner component.
 */
export default function LoadingSpinner({
  size = "md",
  color = "var(--ds-accent)",
  className = "",
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`
        rounded-full border-t-transparent
        ds-animate-spin
        ${sizeMap[size]}
        ${className}
      `}
      style={{
        borderColor: `${color}20`,
        borderTopColor: color,
      }}
      role="status"
      aria-label="loading"
    />
  );
}
