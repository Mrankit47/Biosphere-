import type { ReactNode } from "react";
import GlowButton from "./GlowButton";

interface EmptyStateProps {
  icon: string | ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

/**
 * Reusable Empty State component.
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        p-8 rounded-[var(--ds-radius-2xl)]
        bg-[var(--ds-surface)] border border-[var(--ds-border)]
        backdrop-blur-md max-w-md mx-auto
        ds-animate-fade-up
        ${className}
      `}
    >
      <div className="text-[3rem] mb-4 filter drop-shadow-[0_0_12px_rgba(57,255,20,0.3)]">
        {icon}
      </div>
      <h3 className="text-[length:var(--ds-text-lg)] font-bold text-[var(--ds-fg)] mb-2">
        {title}
      </h3>
      <p className="text-[length:var(--ds-text-base)] text-[var(--ds-fg-muted)] mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (onAction || actionHref) && (
        <GlowButton
          onClick={onAction}
          href={actionHref}
          variant="primary"
          className="px-6 py-2 text-sm"
        >
          {actionLabel}
        </GlowButton>
      )}
    </div>
  );
}
