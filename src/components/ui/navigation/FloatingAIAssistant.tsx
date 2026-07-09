"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const FloatingAIAssistant: React.FC = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  // Do not show the Floating AI button if we are already on the AI Tutor page
  if (pathname === "/tutor") return null;

  return (
    <div
      className="floating-ai-tutor-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip speech bubble */}
      <div className={`ai-tutor-bubble-tooltip ${hovered ? "visible" : "hidden"}`}>
        <span className="tooltip-indicator-arrow" />
        <span className="tooltip-txt">Need help? Ask AI Tutor! 🤖</span>
      </div>

      {/* Floating Action Button */}
      <Link href="/tutor" className="floating-ai-tutor-btn" aria-label="Go to AI Tutor">
        <span className="ai-btn-pulse-glow" />
        <span className="ai-btn-emoji">🤖</span>
      </Link>

      <style>{`
        .floating-ai-tutor-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 990;
          display: flex;
          align-items: center;
        }

        .floating-ai-tutor-btn {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(1, 4, 1, 0.9);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), var(--ds-glow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          text-decoration: none;
        }

        .floating-ai-tutor-btn:hover {
          transform: translateY(-4px) scale(1.06);
          border-color: var(--ds-accent);
          box-shadow: 0 8px 24px rgba(57, 255, 20, 0.25), var(--ds-glow-md);
        }

        .ai-btn-emoji {
          font-size: 1.65rem;
          z-index: 2;
        }

        /* Pulsing glow ring */
        .ai-btn-pulse-glow {
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          border: 1.5px solid var(--ds-accent);
          opacity: 0.8;
          z-index: 1;
          animation: ai-pulse 2.2s infinite ease-in-out;
        }

        @keyframes ai-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        /* Tooltip speech bubble */
        .ai-tutor-bubble-tooltip {
          position: absolute;
          right: 68px;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--ds-glass-border);
          padding: 8px 14px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          transition: all 0.25s ease;
          pointer-events: none;
          z-index: 10;
        }

        .ai-tutor-bubble-tooltip.hidden {
          opacity: 0;
          transform: translateX(10px);
        }

        .ai-tutor-bubble-tooltip.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .tooltip-txt {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ds-fg);
        }

        .tooltip-indicator-arrow {
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: var(--ds-surface-overlay);
          border-right: 1px solid var(--ds-glass-border);
          border-top: 1px solid var(--ds-glass-border);
        }
      `}</style>
    </div>
  );
};
