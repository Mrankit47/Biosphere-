"use client";

import React from "react";

interface ControlDeckProps {
  timeline: number;
  setTimeline: (t: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  speed: number;
  setSpeed: (s: number) => void;
  activeStepIdx: number;
  onJumpToStep: (idx: number) => void;
  stepsCount: number;
}

export default function ControlDeck({
  timeline,
  setTimeline,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  activeStepIdx,
  onJumpToStep,
  stepsCount
}: ControlDeckProps) {
  return (
    <div className="panel-card glassmorphic timeline-control-deck p-4 mt-4 flex flex-col gap-3 border-[var(--ds-border-muted)] bg-black/40">
      {/* Timeline scrubbing row */}
      <div className="flex items-center gap-3 w-full">
        <span className="font-mono text-[9px] text-[var(--ds-fg-subtle)] w-8 text-center">0%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(timeline)}
          onChange={(e) => {
            setTimeline(parseInt(e.target.value));
            setIsPlaying(false); // pause on scrub
          }}
          className="timeline-scrubber flex-1"
        />
        <span className="font-mono text-[9px] text-[var(--ds-accent)] w-8 text-center">
          {Math.round(timeline)}%
        </span>
      </div>

      {/* Button deck row */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Skip back */}
          <button
            onClick={() => onJumpToStep(Math.max(0, activeStepIdx - 1))}
            className="deck-btn w-8 h-8 rounded-lg bg-white/5 border border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:text-white flex items-center justify-center transition-all"
            title="Previous Milestone"
          >
            ⏮
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => {
              if (timeline >= 100) {
                setTimeline(0);
                setIsPlaying(true);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
            className={`deck-btn w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
              isPlaying
                ? "bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                : "bg-white/5 border border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:text-white"
            }`}
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => onJumpToStep(Math.min(stepsCount - 1, activeStepIdx + 1))}
            className="deck-btn w-8 h-8 rounded-lg bg-white/5 border border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:text-white flex items-center justify-center transition-all"
            title="Next Milestone"
          >
            ⏭
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setTimeline(0);
            }}
            className="text-[9px] bg-white/5 border border-[var(--ds-border-muted)] px-2 py-1 rounded text-[var(--ds-fg-subtle)] hover:text-white ml-2 uppercase font-bold"
          >
            Restart
          </button>
        </div>

        {/* Speed multiplier selection pills */}
        <div className="flex gap-1.5 items-center">
          <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase mr-1">Speed</span>
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                speed === s
                  ? "bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                  : "bg-white/5 border border-[var(--ds-border-muted)] text-[var(--ds-fg-subtle)] hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
