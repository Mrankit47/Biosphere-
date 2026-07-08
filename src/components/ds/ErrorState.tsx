import type { ReactNode } from "react";
import GlowButton from "./GlowButton";

interface ErrorStateProps {
  icon?: string | ReactNode;
  title?: string;
  description: string;
  errorMessage?: string;
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

/**
 * Reusable Error State component with retry and details.
 */
export default function ErrorState({
  icon = "🧬",
  title = "Oops! Something went wrong",
  description,
  errorMessage,
  onRetry,
  onAction,
  actionLabel,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        max-w-[520px] w-full mx-auto
        p-12 rounded-[var(--ds-radius-2xl)]
        bg-[var(--ds-surface-raised)] border border-[var(--ds-danger-border)]
        backdrop-blur-xl text-center shadow-[var(--ds-shadow-lg)]
        ds-animate-scale-in
        ${className}
      `}
    >
      <div className="text-[3rem] mb-4 filter drop-shadow-[0_0_12px_rgba(226,75,74,0.5)]">
        {icon}
      </div>
      <h2 className="text-[length:var(--ds-text-xl)] font-bold text-[var(--ds-fg)] mb-3 leading-snug">
        {title}
      </h2>
      <p className="text-[length:var(--ds-text-md)] text-[var(--ds-fg-muted)] mb-5 leading-relaxed">
        {description}
      </p>

      {errorMessage && (
        <code className="
          display-block
          px-4 py-2.5 rounded-[var(--ds-radius-md)]
          bg-[var(--ds-danger-subtle)] border border-[var(--ds-danger-border)]
          color-[var(--ds-danger)] text-xs text-left
          mb-6 overflow-x-auto word-break-all font-mono block
        ">
          {errorMessage}
        </code>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        {onRetry && (
          <GlowButton
            onClick={onRetry}
            variant="primary"
            accentColor="var(--ds-danger)"
            className="px-7 py-2.5 text-sm"
          >
            ↻ Try Again
          </GlowButton>
        )}
        {onAction && actionLabel && (
          <GlowButton
            onClick={onAction}
            variant="secondary"
            accentColor="var(--ds-danger)"
            className="px-7 py-2.5 text-sm"
          >
            {actionLabel}
          </GlowButton>
        )}
      </div>
    </div>
  );
}
