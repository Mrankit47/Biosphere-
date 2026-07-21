"use client";

import React from "react";

interface EquipmentPanelProps {
  equipmentList: string[];
  materialsList: string[];
  equippedItems: string[];
  onEquipItem: (item: string) => void;
  isSimulating: boolean;
}

export default function EquipmentPanel({
  equipmentList,
  materialsList,
  equippedItems,
  onEquipItem,
  isSimulating
}: EquipmentPanelProps) {
  return (
    <div className="panel-card glassmorphic flex flex-col h-full">
      <h3 className="panel-section-title">🧪 EQUIPMENT & MATERIALS</h3>
      <p className="text-[10px] text-[var(--ds-fg-muted)] mb-3">
        Click items in the cabinet to place/prepare them on the workspace desk before starting.
      </p>

      {/* Equipment Subsection */}
      <div className="mb-4">
        <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2 tracking-wider">
          Required Apparatus
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {equipmentList.map((eq, idx) => {
            const isEquipped = equippedItems.includes(eq);
            return (
              <button
                key={idx}
                onClick={() => !isSimulating && onEquipItem(eq)}
                disabled={isSimulating}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded border text-[11px] transition-all ${
                  isEquipped
                    ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-fg-bright)]"
                    : "bg-white/5 border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:border-[var(--ds-accent-muted)] hover:text-[var(--ds-fg-bright)]"
                }`}
              >
                <span>{eq}</span>
                <span className="font-bold">
                  {isEquipped ? "✓ ON WORKBENCH" : "+ MOUNT"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials Subsection */}
      <div>
        <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2 tracking-wider">
          Reagents & Consumables
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {materialsList.map((mat, idx) => {
            const isLoaded = equippedItems.includes(mat);
            return (
              <button
                key={idx}
                onClick={() => !isSimulating && onEquipItem(mat)}
                disabled={isSimulating}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded border text-[11px] transition-all ${
                  isLoaded
                    ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-fg-bright)]"
                    : "bg-white/5 border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:border-[var(--ds-accent-muted)] hover:text-[var(--ds-fg-bright)]"
                }`}
              >
                <span>{mat}</span>
                <span className="font-bold">
                  {isLoaded ? "✓ REAGENT LOADED" : "+ DISPENSE"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
