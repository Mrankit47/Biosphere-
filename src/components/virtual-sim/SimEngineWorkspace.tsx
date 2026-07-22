"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BiologySimulation } from "@/data/simulations";

import SimulationCanvas from "./simulations/SimulationCanvas";
import ControlDeck from "./ControlDeck";
import AnnotationLayer from "./AnnotationLayer";
import InfoSidebar from "./InfoSidebar";
import AIAssistantPanel from "./AIAssistantPanel";
import CheckpointPanel from "./CheckpointPanel";

interface SimEngineWorkspaceProps {
  activeSim: BiologySimulation;
  onExit: () => void;
}

export default function SimEngineWorkspace({
  activeSim,
  onExit
}: SimEngineWorkspaceProps) {
  // Playback States
  const [timeline, setTimeline] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  // Dynamic variable inputs/controls loaded from simulation registry
  const [controls, setControls] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    activeSim.controls.forEach((ctrl) => {
      initial[ctrl.id] = ctrl.defaultValue;
    });
    return initial;
  });

  // Checkpoints scoring
  const [checkpointScore, setCheckpointScore] = useState<number | null>(null);

  // Synchronized simulation frame updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeline((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          // Tick frequency moves timeline forward scaled by speed multiplier
          return Math.min(100, prev + 0.45 * speed);
        });
      }, 25);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Reset variables on simulation changes
  useEffect(() => {
    setTimeline(0);
    setIsPlaying(false);
    setCheckpointScore(null);
    const initial: Record<string, any> = {};
    activeSim.controls.forEach((ctrl) => {
      initial[ctrl.id] = ctrl.defaultValue;
    });
    setControls(initial);
  }, [activeSim]);

  // Derive the active milestone step based on timeline percentage boundaries
  const activeStepIdx = useMemo(() => {
    const idx = activeSim.steps.findIndex(
      (step) => timeline >= step.range[0] && timeline <= step.range[1]
    );
    return idx === -1 ? activeSim.steps.length - 1 : idx;
  }, [timeline, activeSim]);

  const activeStep = activeSim.steps[activeStepIdx] || null;

  const handleJumpToStep = (idx: number) => {
    const step = activeSim.steps[idx];
    if (step) {
      setTimeline(step.range[0]);
    }
  };

  const handleCompleteCheckpoint = (score: number) => {
    setCheckpointScore(score);
    // Sync completion status with profile logic
    const completedSims = localStorage.getItem("biosphere_completed_sims");
    const list = completedSims ? JSON.parse(completedSims) : [];
    if (!list.includes(activeSim.id)) {
      list.push(activeSim.id);
      localStorage.setItem("biosphere_completed_sims", JSON.stringify(list));
    }
  };

  const earnedXp = useMemo(() => {
    if (checkpointScore === null) return 0;
    return Math.round((checkpointScore / activeSim.quiz.length) * 100);
  }, [checkpointScore, activeSim]);

  return (
    <div className="flex flex-col flex-1 relative w-full h-full min-h-[calc(100vh-64px)] text-[var(--ds-fg)] bg-[#050A05] z-1">
      {/* ── HEADER ── */}
      <header className="border-b border-[var(--ds-border-muted)] px-6 py-4 flex items-center justify-between no-print z-10 bg-black/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="back-btn font-bold">
            ← Simulation Cabinet
          </button>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">
              {activeSim.name}
            </h1>
            <p className="text-[9px] text-[var(--ds-accent)] font-bold tracking-widest uppercase mt-0.5">
              Interactive process simulator · Est: {activeSim.duration}
            </p>
          </div>
        </div>
      </header>

      {/* ── WORKSPACE GRID ── */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 p-4 md:p-6 gap-6 z-10 relative items-start min-h-0 overflow-y-auto xl:overflow-hidden">
        {/* Left Side (Col span 3): Milestone and Objective Information */}
        <section className="xl:col-span-3 self-stretch flex flex-col no-print">
          <InfoSidebar
            objectives={activeSim.objectives}
            outcomes={activeSim.outcomes}
            steps={activeSim.steps}
            activeStepIdx={activeStepIdx}
            onJumpToStep={handleJumpToStep}
            timeline={timeline}
          />
        </section>

        {/* Center Main Visualizer (Col span 5): Live Vector Canvas & Playback controls */}
        <section className="xl:col-span-5 space-y-6 self-stretch flex flex-col min-h-0">
          {/* Main Visualizer viewport screen */}
          <div className="flex-1 bg-black/30 border border-[var(--ds-border-muted)] rounded-2xl p-4 flex flex-col justify-between min-h-[300px] relative">
            <h3 className="panel-section-title">🖥️ LIVE ANIMATION ENGINE</h3>
            
            {/* Visualizer screen frame */}
            <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden">
              <SimulationCanvas
                simulationId={activeSim.id}
                timeline={timeline}
                controls={controls}
              />
              
              {/* Dynamic annotation layer overlays */}
              <AnnotationLayer annotations={activeSim.annotations} timeline={timeline} />
            </div>

            {/* Live diagnostic summary readout */}
            <div className="mt-4 bg-black/50 border border-[var(--ds-border-muted)] p-2.5 rounded font-mono text-[9px] leading-relaxed">
              <span className="text-[var(--ds-accent)] font-bold block mb-0.5">
                MOLECULAR STATE SCANNER:
              </span>
              <p className="text-[var(--ds-fg-muted)]">
                {activeStep ? activeStep.summary : "Calibrating timeline factors..."}
              </p>
            </div>
          </div>

          {/* Timeline playback deck */}
          <ControlDeck
            timeline={timeline}
            setTimeline={setTimeline}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            speed={speed}
            setSpeed={setSpeed}
            activeStepIdx={activeStepIdx}
            onJumpToStep={handleJumpToStep}
            stepsCount={activeSim.steps.length}
          />
        </section>

        {/* Right Side (Col span 4): Checkpoint assessments & AI Mentors */}
        <section className="xl:col-span-4 space-y-6 self-stretch flex flex-col no-print">
          {/* Variable adjust control board */}
          {activeSim.controls.length > 0 && (
            <div className="panel-card glassmorphic p-4">
              <h3 className="panel-section-title">🎛️ PROCESS VARIABLE MODIFIERS</h3>
              <div className="space-y-3 mt-2">
                {activeSim.controls.map((ctrl) => (
                  <div key={ctrl.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10.5px]">
                      <span className="font-bold text-[var(--ds-fg-muted)]">{ctrl.name}</span>
                      <span className="font-bold text-white">
                        {typeof controls[ctrl.id] === "boolean"
                          ? controls[ctrl.id] ? "ON" : "OFF"
                          : `${controls[ctrl.id]} ${ctrl.unit || ""}`}
                      </span>
                    </div>

                    {ctrl.type === "slider" ? (
                      <input
                        type="range"
                        min={ctrl.min}
                        max={ctrl.max}
                        step={ctrl.step}
                        value={controls[ctrl.id]}
                        onChange={(e) =>
                          setControls((prev) => ({
                            ...prev,
                            [ctrl.id]: parseFloat(e.target.value)
                          }))
                        }
                        className="lab-slider w-full"
                      />
                    ) : ctrl.type === "toggle" ? (
                      <button
                        onClick={() =>
                          setControls((prev) => ({
                            ...prev,
                            [ctrl.id]: !prev[ctrl.id]
                          }))
                        }
                        className={`text-[9px] font-bold py-1 px-3 border rounded self-end transition-all ${
                          controls[ctrl.id]
                            ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                            : "bg-white/5 border-[var(--ds-border-muted)] text-[var(--ds-fg-subtle)]"
                        }`}
                      >
                        {controls[ctrl.id] ? "Deactivate" : "Activate"}
                      </button>
                    ) : (
                      <select
                        value={controls[ctrl.id]}
                        onChange={(e) =>
                          setControls((prev) => ({ ...prev, [ctrl.id]: e.target.value }))
                        }
                        className="bg-black/60 border border-[var(--ds-border-muted)] rounded p-1 text-[10px] text-white outline-none"
                      >
                        {ctrl.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline stage Checkpoints Quiz */}
          <div>
            <CheckpointPanel
              quiz={activeSim.quiz}
              onComplete={handleCompleteCheckpoint}
              earnedXp={earnedXp}
            />
          </div>

          {/* Sidebar Chatbot AI Helper */}
          <div className="flex-1">
            <AIAssistantPanel
              simulationId={activeSim.id}
              simulationName={activeSim.name}
              activeStepTitle={activeStep?.title || "Simulation"}
              activeStepIdx={activeStepIdx}
              timeline={timeline}
              controls={controls}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
