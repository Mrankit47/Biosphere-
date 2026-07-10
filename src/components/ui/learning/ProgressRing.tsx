"use client";

import React from "react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  size = 80,
  strokeWidth = 6,
  color,
  bgColor,
  showLabel = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="progress-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor || "rgba(255,255,255,0.06)"}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || "var(--ds-accent)"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-fill"
        />
      </svg>
      {showLabel && (
        <div className="progress-ring-label-container">
          <span className="progress-ring-value">{Math.round(percent)}%</span>
          {label && <span className="progress-ring-text">{label}</span>}
        </div>
      )}

      <style>{`
        .progress-ring-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .progress-ring-svg {
          transform: rotate(-90deg);
        }
        .progress-ring-fill {
          transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .progress-ring-label-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
        }
        .progress-ring-value {
          font-size: ${Math.max(size * 0.18, 10)}px;
          font-weight: 800;
          color: var(--ds-accent);
          line-height: 1;
        }
        .progress-ring-text {
          font-size: ${Math.max(size * 0.1, 7)}px;
          font-weight: 700;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
      `}</style>
    </div>
  );
};
