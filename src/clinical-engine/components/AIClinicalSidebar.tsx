"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { DiseaseObject } from "../types";

interface AIClinicalSidebarProps {
  disease: DiseaseObject;
  activeStageTitle?: string;
  selectedOrgan?: string;
}

export const AIClinicalSidebar: React.FC<AIClinicalSidebarProps> = ({
  disease,
  activeStageTitle = "Current Stage",
  selectedOrgan
}) => {
  const [customQuestion, setCustomQuestion] = useState<string>("");

  const suggestedPrompts = [
    `Explain the physiological mechanism of ${disease.symptoms[0]?.name || "symptoms"} in ${disease.name}.`,
    `Why is ${disease.treatment.medications[0]?.name || "medication"} prescribed for ${disease.name}?`,
    `What diagnostic test distinguishes ${disease.name} from similar conditions?`,
    `How does ${disease.name} progress from early to advanced stage?`
  ];

  const buildTutorLink = (promptText: string) => {
    const contextualPrompt = `[Context: Disease=${disease.name}, Stage=${activeStageTitle}, Organ=${selectedOrgan || disease.affectedOrgans[0]}] ${promptText}`;
    return `/tutor?q=${encodeURIComponent(contextualPrompt)}`;
  };

  return (
    <aside className="ai-clinical-sidebar-card glassmorphic">
      <div className="ai-header-strip">
        <div className="ai-title-group">
          <span className="ai-avatar">🤖</span>
          <div>
            <span className="ai-role-lbl">AI CLINICAL MENTOR</span>
            <h4 className="ai-title">Clinical Reasoning Engine</h4>
          </div>
        </div>
        <span className="live-status-pill">● ACTIVE CONTEXT</span>
      </div>

      {/* Context Summary Pill */}
      <div className="active-context-box">
        <span className="ctx-lbl">CURRENT CLINICAL CONTEXT</span>
        <div className="ctx-details">
          <div className="ctx-item">
            <span>Disease:</span> <strong>{disease.name}</strong>
          </div>
          <div className="ctx-item">
            <span>ICD-10:</span> <strong>{disease.icdCode}</strong>
          </div>
          <div className="ctx-item">
            <span>Stage:</span> <strong>{activeStageTitle}</strong>
          </div>
          {selectedOrgan && (
            <div className="ctx-item">
              <span>Organ:</span> <strong>{selectedOrgan}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Clinical Reasoning Prompts */}
      <div className="prompts-section">
        <span className="prompts-title">💡 SUGGESTED CLINICAL REASONING QUERIES</span>
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
        <span className="prompts-title">💬 ASK THE CLINICAL MENTOR</span>
        <input
          type="text"
          className="clinical-input"
          placeholder={`Ask about ${disease.name} clinical logic...`}
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
            Ask Clinical Mentor <BioIcon name="chevron-right" size={14} />
          </Link>
        )}
      </div>

      <style>{`
        .ai-clinical-sidebar-card {
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

        .ai-avatar {
          font-size: 1.5rem;
        }

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
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 0.72rem;
        }

        .ctx-item span {
          color: var(--ds-fg-subtle);
        }
        .ctx-item strong {
          color: #fff;
          margin-left: 4px;
        }

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

        .clinical-input {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 10px;
          padding: 8px 12px;
          color: #fff;
          font-size: 0.78rem;
          outline: none;
        }
        .clinical-input:focus {
          border-color: var(--ds-accent);
        }

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
