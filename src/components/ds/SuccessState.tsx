import type { ReactNode } from "react";
import GlowButton from "./GlowButton";

interface SuccessStateProps {
  icon?: string | ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

/**
 * Reusable Success/Confirmation State component.
 */
export default function SuccessState({
  icon = "🏆",
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}: SuccessStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        p-12 rounded-[var(--ds-radius-2xl)]
        bg-[var(--ds-surface)] border border-[var(--ds-border)]
        backdrop-blur-md max-w-md mx-auto
        ds-animate-scale-in
        ${className}
      `}
    >
      <div className="text-[3.5rem] mb-5 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        {icon}
      </div>
      <h3 className="text-[length:var(--ds-text-xl)] font-bold text-[var(--ds-fg)] mb-3">
        {title}
      </h3>
      <p className="text-[length:var(--ds-text-md)] text-[var(--ds-fg-muted)] mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && (onAction || actionHref) && (
        <GlowButton
          onClick={onAction}
          href={actionHref}
          variant="primary"
          accentColor="var(--ds-success)"
          className="px-7 py-3 text-sm"
        >
          {actionLabel}
        </GlowButton>
      )}
    </div>
  );
}
