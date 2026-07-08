interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  className?: string;
}

/**
 * Centered page title with optional subtitle.
 * Replaces duplicate page-title patterns across 8+ pages.
 */
export default function PageHeader({
  title,
  subtitle,
  accentColor,
  className = "",
}: PageHeaderProps) {
  const color = accentColor || "var(--ds-accent)";

  return (
    <div
      className={`
        absolute top-5 left-1/2 -translate-x-1/2 z-[var(--ds-z-overlay)]
        text-center pointer-events-none
        ${className}
      `}
    >
      <h1
        className="text-[length:1.3rem] font-bold tracking-[0.08em] m-0"
        style={{
          color,
          textShadow: `0 0 20px ${color}4D`,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-[length:var(--ds-text-sm)] text-[var(--ds-fg-subtle)] mt-0.5 tracking-[0.15em] uppercase m-0">
          {subtitle}
        </p>
      )}
    </div>
  );
}
