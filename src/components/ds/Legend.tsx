interface LegendItemConfig<T extends string> {
  id: T;
  name: string;
  color: string;
  emoji?: string;
}

interface LegendProps<T extends string> {
  items: LegendItemConfig<T>[];
  activeId: T | null;
  onSelect: (id: T) => void;
  className?: string;
}

/**
 * Reusable color-coded Legend component.
 */
export default function Legend<T extends string>({
  items,
  activeId,
  onSelect,
  className = "",
}: LegendProps<T>) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} role="group" aria-label="legend">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-[var(--ds-radius-md)] border
              text-[var(--ds-fg)] cursor-none ds-transition backdrop-blur-md font-[inherit]
              text-left w-full
            `}
            style={{
              borderColor: isActive ? item.color : "rgba(255,255,255,0.08)",
              background: isActive ? `${item.color}26` : "rgba(5,10,5,0.6)",
              boxShadow: isActive ? `0 0 10px ${item.color}22` : "none",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                background: item.color,
                boxShadow: `0 0 6px ${item.color}80`,
              }}
            />
            <span className="text-[length:0.72rem] opacity-85 select-none">
              {item.emoji ? `${item.emoji} ` : ""}{item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
