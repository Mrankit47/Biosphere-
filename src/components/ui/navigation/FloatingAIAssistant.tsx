"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMentor } from "./MentorContext";
import { MentorChat } from "./MentorChat";
import { motion, AnimatePresence } from "framer-motion";
import { BioIcon } from "./BioIcon";

export const FloatingAIAssistant: React.FC = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useMentor();

  // If we are already on the AI Tutor page, do not show the floating action button
  if (pathname === "/tutor") return null;

  return (
    <>
      <div
        className="floating-ai-tutor-container"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Tooltip speech bubble */}
        <div className={`ai-tutor-bubble-tooltip ${hovered && !sidebarOpen ? "visible" : "hidden"}`}>
          <span className="tooltip-indicator-arrow" />
          <span className="tooltip-txt" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            Ask BioMentor! <BioIcon name="tutor" size={14} />
          </span>
        </div>

        {/* Floating Action Button (Toggles sidebar drawer) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="floating-ai-tutor-btn"
          aria-label="Toggle Biology Mentor"
        >
          <span className="ai-btn-pulse-glow" />
          <span className="ai-btn-emoji">
            <BioIcon name="tutor" size={24} />
          </span>
        </button>
      </div>

      {/* Mentor Sidebar slide-out Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="mentor-sidebar-backdrop"
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mentor-sidebar-drawer glassmorphic"
            >
              {/* Drawer Header */}
              <div className="drawer-header-row">
                <span className="drawer-title-txt">Biology Mentor Sidebar</span>
                <div className="drawer-actions-right">
                  <Link
                    href="/tutor"
                    onClick={() => setSidebarOpen(false)}
                    className="fullscreen-chat-btn"
                    title="Fullscreen Chat"
                  >
                    Fullscreen ↗
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="close-drawer-btn"
                    aria-label="Close mentor"
                  >
                    <BioIcon name="close" size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Mentor Chat */}
              <div className="drawer-chat-wrapper">
                <MentorChat compact={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
          background: rgba(1, 4, 1, 0.95);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.7), var(--ds-glow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
        }

        .floating-ai-tutor-btn:hover {
          transform: translateY(-4px) scale(1.06);
          border-color: var(--ds-accent);
          box-shadow: 0 8px 24px rgba(57, 255, 20, 0.35), var(--ds-glow-md);
        }

        .ai-btn-emoji {
          font-size: 1.55rem;
          z-index: 2;
        }

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
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }

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

        /* Sidebar Drawer Styles */
        .mentor-sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 9990;
        }

        .mentor-sidebar-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 420px;
          max-width: 100vw;
          z-index: 9999;
          background: rgba(1, 4, 1, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid var(--ds-glass-border);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
        }

        .drawer-header-row {
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--ds-glass-border);
        }

        .drawer-title-txt {
          font-size: 0.8rem;
          font-weight: 800;
          color: #fff;
        }

        .drawer-actions-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fullscreen-chat-btn {
          font-size: 0.65rem;
          color: var(--ds-accent);
          text-decoration: none;
          font-weight: 700;
        }
        .fullscreen-chat-btn:hover {
          text-decoration: underline;
        }

        .close-drawer-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 1rem;
          cursor: pointer;
        }
        .close-drawer-btn:hover {
          color: #fff;
        }

        .drawer-chat-wrapper {
          flex: 1;
          overflow: hidden;
          padding: 16px;
        }
      `}</style>
    </>
  );
};
