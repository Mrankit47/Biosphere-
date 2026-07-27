"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { MolecularObject } from "../types";

interface AIMolecularSidebarProps {
  molecularObject: MolecularObject;
}

export const AIMolecularSidebar: React.FC<AIMolecularSidebarProps> = ({ molecularObject }) => {
  const [customQuestion, setCustomQuestion] = useState<string>("");

  const suggestedPrompts = [
    `Explain the primary biological function of ${molecularObject.name}.`,
    `How does ${molecularObject.symbol} interact with other organelles or cells?`,
    `What happens when a mutation occurs in ${molecularObject.name}?`,
    `Explain the structural components of ${molecularObject.symbol} step-by-step.`
  ];

  const buildTutorLink = (promptText: string) => {
    const contextualPrompt = `[Context: Molecular Object=${molecularObject.name} (${molecularObject.symbol}), Category=${molecularObject.category}] ${promptText}`;
    return `/tutor?q=${encodeURIComponent(contextualPrompt)}`;
  };

  return (
    <aside className="ai-molecular-sidebar-card glassmorphic">
      <div className="ai-header-strip">
        <div className="ai-title-group">
          <span className="ai-avatar">🧬</span>
          <div>
            <span className="ai-role-lbl">AI MOLECULAR MENTOR</span>
            <h4 className="ai-title">Genetics & Molecular AI</h4>
          </div>
        </div>
        <span className="live-status-pill">● CONTEXT ACTIVE</span>
      </div>

      {/* Active Context Card */}
      <div className="active-context-box">
        <span className="ctx-lbl">ACTIVE MOLECULAR CONTEXT</span>
        <div className="ctx-details">
          <div className="ctx-item">
            <span>Object:</span> <strong>{molecularObject.name} ({molecularObject.symbol})</strong>
          </div>
          <div className="ctx-item">
            <span>Category:</span> <strong>{molecularObject.category.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="prompts-section">
        <span className="prompts-title">💡 SUGGESTED MOLECULAR QUERIES</span>
        <div className="prompts-list">
          {suggestedPrompts.map((prompt, idx) => (
            <Link
              key={idx}
              href={buildTutorLink(prompt)}
              className="prompt-pill-btn"
            >
              <span>{prompt}</span>
              <BioIcon name="chevron-right" size={12} />
            </Link>
          ))}
        </div>
      </div>

      {/* Custom Query Input */}
      <div className="custom-query-box">
        <span className="prompts-title">💬 ASK THE MOLECULAR AI MENTOR</span>
        <input
          type="text"
          className="molecular-input"
          placeholder={`Ask about ${molecularObject.symbol} mechanisms...`}
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customQuestion.trim()) {
              window.location.href = buildTutorLink(customQuestion);
            }
          }}
        />
        {customQuestion.trim() && (
          <Link
            href={buildTutorLink(customQuestion)}
            className="ask-submit-btn"
          >
            Ask AI Mentor <BioIcon name="chevron-right" size={14} />
          </Link>
        )}
      </div>

      <style>{`
        .ai-molecular-sidebar-card {
          padding: 1.25rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.9);
          border: 1px solid var(--ds-border-muted);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ai-header-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-avatar { font-size: 1.5rem; }

        .ai-role-lbl {
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
          display: block;
        }

        .ai-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 900;
          color: #fff;
        }

        .live-status-pill {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          padding: 2px 8px;
          border-radius: 100px;
        }

        .active-context-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 10px;
        }

        .ctx-lbl {
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 6px;
        }

        .ctx-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.72rem;
        }

        .ctx-item span { color: var(--ds-fg-subtle); }
        .ctx-item strong { color: #fff; margin-left: 4px; }

        .prompts-title {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 8px;
        }

        .prompts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .prompt-pill-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--ds-border-muted);
          color: #cbd5e1;
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 0.75rem;
          text-decoration: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .prompt-pill-btn:hover {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .custom-query-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .molecular-input {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 10px;
          padding: 8px 12px;
          color: #fff;
          font-size: 0.78rem;
          outline: none;
        }
        .molecular-input:focus { border-color: var(--ds-accent); }

        .ask-submit-btn {
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
      `}</style>
    </aside>
  );
};
