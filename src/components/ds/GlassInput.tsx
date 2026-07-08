import type { InputHTMLAttributes } from "react";

interface GlassInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  /** Optional icon to render inside the input */
  icon?: React.ReactNode;
  /** Accent color for focus ring */
  accentColor?: string;
  className?: string;
}

/**
 * Styled search/text input with glass effect.
 * Replaces 3+ duplicate input implementations.
 */
export default function GlassInput({
  icon,
  accentColor,
  className = "",
  ...props
}: GlassInputProps) {
  const color = accentColor || "var(--ds-accent)";

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span className="absolute left-3.5 text-[var(--ds-fg-subtle)] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`
          w-full
          ${icon ? "pl-11" : "pl-4"} pr-4 py-3
          rounded-[var(--ds-radius-lg)]
          bg-[var(--ds-surface-subtle)]
          border border-[var(--ds-border-muted)]
          text-[var(--ds-fg)] text-[length:var(--ds-text-base)]
          placeholder:text-[var(--ds-fg-faint)]
          font-[inherit]
          outline-none cursor-none
          ds-transition
        `}
        style={{
          // Focus styles via inline since we need dynamic color
          // The focus-visible from globals.css provides the green outline
        }}
        {...props}
      />
      <style>{`
        .ds-glass-input:focus {
          border-color: ${color}40;
          background: ${color}08;
          box-shadow: 0 0 20px ${color}15;
        }
      `}</style>
    </div>
  );
}
