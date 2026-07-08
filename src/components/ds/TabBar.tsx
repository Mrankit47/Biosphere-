interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface TabBarProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  accentColor?: string;
  className?: string;
}

/**
 * Reusable Tab Navigation component.
 */
export default function TabBar<T extends string>({
  options,
  activeTab,
  onChange,
  accentColor,
  className = "",
}: TabBarProps<T>) {
  const color = accentColor || "var(--ds-accent)";

  return (
    <div className={`flex gap-1.5 w-full ${className}`} role="tablist">
      {options.map((option) => {
        const isActive = activeTab === option.id;
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={`
              flex-1 py-2 rounded-[var(--ds-radius-md)] border text-[length:var(--ds-text-sm)]
              font-semibold uppercase tracking-[0.1em] cursor-none font-[inherit] ds-transition
            `}
            style={{
              borderColor: isActive ? `${color}99` : "rgba(255,255,255,0.08)",
              background: isActive ? `${color}26` : "rgba(5,10,5,0.5)",
              color: isActive ? color : "var(--ds-fg-muted)",
              boxShadow: isActive ? `0 0 10px ${color}33` : "none",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
