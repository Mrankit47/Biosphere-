"use client";

import React, { useEffect, useRef } from "react";
import { useNavigation } from "./NavigationContext";
import { BioIcon } from "./BioIcon";

export const ShortcutsModal: React.FC = () => {
  const { shortcutsOpen, setShortcutsOpen } = useNavigation();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close shortcuts on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShortcutsOpen(false);
      }
    };
    if (shortcutsOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [shortcutsOpen, setShortcutsOpen]);

  if (!shortcutsOpen) return null;

  const shortcutItems = [
    { keys: ["Ctrl", "K"], desc: "Toggle Global Search engine", icon: "search" },
    { keys: ["/"], desc: "Toggle Global Search engine", icon: "search" },
    { keys: ["Shift", "H"], desc: "Navigate to Home dashboard", icon: "home" },
    { keys: ["Shift", "T"], desc: "Navigate to AI Biology Tutor", icon: "tutor" },
    { keys: ["Shift", "L"], desc: "Navigate to Learning Paths dashboard", icon: "learning-paths" },
    { keys: ["Shift", "P"], desc: "Navigate to Profile Hub & certification achievements", icon: "gamification" },
    { keys: ["?"], desc: "Display this keyboard shortcuts sheet", icon: "keyboard" },
    { keys: ["Esc"], desc: "Close any active search, modal, or overlay", icon: "close" },
  ];

  return (
    <div className="shortcuts-modal-overlay">
      <div className="shortcuts-modal-card glassmorphic" ref={modalRef}>
        <div className="shortcuts-header-row">
          <h3 className="shortcuts-modal-title">SYSTEM KEYBOARD SHORTCUTS</h3>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="shortcuts-close-btn"
            aria-label="Close shortcuts modal"
          >
            <BioIcon name="close" size={18} />
          </button>
        </div>

        <div className="shortcuts-modal-body">
          <p className="shortcuts-intro-text">
            Use these global keyboard bindings to navigate Biosphere instantly.
          </p>

          <div className="shortcuts-list-grid">
            {shortcutItems.map((item, idx) => (
              <div key={idx} className="shortcut-row-item">
                <span className="shortcut-item-icon">
                  <BioIcon name={item.icon} size={18} />
                </span>
                <span className="shortcut-item-desc">{item.desc}</span>
                <div className="shortcut-keys-row">
                  {item.keys.map((k, kIdx) => (
                    <React.Fragment key={kIdx}>
                      {kIdx > 0 && <span className="kbd-plus-separator">+</span>}
                      <kbd className="shortcut-kbd-box">{k}</kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .shortcuts-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .shortcuts-modal-card {
          width: 100%;
          max-width: 520px;
          border-radius: 20px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), var(--ds-glow-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .shortcuts-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--ds-glass-border);
        }

        .shortcuts-modal-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--ds-fg);
          letter-spacing: 0.08em;
          margin: 0;
        }

        .shortcuts-close-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 1rem;
          cursor: pointer;
        }

        .shortcuts-close-btn:hover {
          color: var(--ds-accent);
        }

        .shortcuts-modal-body {
          padding: 20px;
        }

        .shortcuts-intro-text {
          font-size: 0.78rem;
          color: var(--ds-fg-subtle);
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .shortcuts-list-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .shortcut-row-item {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--ds-glass-border);
        }

        .shortcut-item-icon {
          font-size: 1rem;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .shortcut-item-desc {
          font-size: 0.76rem;
          color: var(--ds-fg-muted);
          flex: 1;
          margin-right: 12px;
          line-height: 1.4;
        }

        .shortcut-keys-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .kbd-plus-separator {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          font-weight: bold;
        }

        .shortcut-kbd-box {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.65rem;
          font-family: monospace;
          color: var(--ds-fg);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};
