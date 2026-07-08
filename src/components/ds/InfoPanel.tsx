import type { ReactNode } from "react";
import SectionLabel from "./SectionLabel";

interface InfoPanelProps {
  label: string;
  text: string;
  fact?: string;
  factIcon?: string;
  accentColor?: string;
  className?: string;
  extraContent?: ReactNode;
}

/**
 * Reusable Info Panel block for structured content and facts.
 */
export default function InfoPanel({
  label,
  text,
  fact,
  factIcon = "💡",
  accentColor = "var(--ds-accent)",
  className = "",
  extraContent,
}: InfoPanelProps) {
  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {/* Description block */}
      <div className="w-full px-4 py-3.5 rounded-[var(--ds-radius-lg)] bg-[var(--ds-surface-subtle)] border border-[var(--ds-border)]">
        <SectionLabel>{label}</SectionLabel>
        <p className="text-[length:var(--ds-text-base)] text-[var(--ds-fg)] mt-1.5 leading-relaxed font-[inherit]">
          {text}
        </p>
      </div>

      {/* Fun fact block */}
      {fact && (
        <div
          className="
            w-full px-4 py-3.5 rounded-[var(--ds-radius-lg)]
            border flex gap-3 items-start
          "
          style={{
            background: `${accentColor}0A`,
            borderColor: `${accentColor}1A`,
          }}
        >
          <span className="text-[1.2rem] shrink-0 mt-0.5" aria-hidden="true">
            {factIcon}
          </span>
          <div>
            <SectionLabel color={accentColor}>Fun Fact</SectionLabel>
            <p className="text-[length:var(--ds-text-base)] text-[var(--ds-fg)] mt-1 leading-relaxed">
              {fact}
            </p>
          </div>
        </div>
      )}

      {extraContent}
    </div>
  );
}
