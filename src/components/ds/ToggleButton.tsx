interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  accentColor?: string;
  className?: string;
}

/**
 * Reusable Toggle Switch/Button.
 * Replaces ad-hoc show labels and toggles.
 */
export default function ToggleButton({
  checked,
  onChange,
  label,
  accentColor,
  className = "",
}: ToggleButtonProps) {
  const color = accentColor || "var(--ds-accent)";

  return (
    <button
      className={`
        inline-flex items-center gap-3
        px-4 py-2 rounded-[var(--ds-radius-lg)]
        backdrop-blur-md font-semibold text-[length:var(--ds-text-sm)]
        font-[inherit] cursor-none
        border ds-transition
        ${className}
      `}
      style={{
        background: checked ? `${color}26` : "rgba(5,10,5,0.5)",
        borderColor: checked ? `${color}66` : "rgba(57,255,20,0.1)",
        color: checked ? color : "var(--ds-fg-muted)",
      }}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      {label && <span>{label}</span>}
      <div
        className="relative w-8 h-4 rounded-full bg-black/40 border border-white/10 transition-all duration-200"
        style={{
          backgroundColor: checked ? `${color}40` : undefined,
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full transition-transform duration-200"
          style={{
            backgroundColor: checked ? color : "var(--ds-fg-muted)",
            transform: checked ? "translateX(16px)" : "translateX(0)",
            boxShadow: checked ? `0 0 6px ${color}` : "none",
          }}
        />
      </div>
    </button>
  );
}
