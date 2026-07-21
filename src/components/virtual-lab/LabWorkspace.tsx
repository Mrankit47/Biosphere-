"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { BackLink } from "@/components/ds";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import { LabExperiment, EXPERIMENTS } from "@/data/experiments";

import SimulationCanvas from "./simulations/SimulationCanvas";
import EquipmentPanel from "./EquipmentPanel";
import InstructionPanel from "./InstructionPanel";
import ObservationPanel from "./ObservationPanel";
import Notebook from "./Notebook";
import AIMentorSidebar from "./AIMentorSidebar";
import ResultPanel from "./ResultPanel";
import CompletionDialog from "./CompletionDialog";
import LabReportGenerator from "./LabReportGenerator";

interface LabWorkspaceProps {
  onExit: () => void;
  activeLab: LabExperiment;
}

type LabMode = "step-by-step" | "exploration" | "ai-guided" | "assessment";

export default function LabWorkspace({ onExit, activeLab }: LabWorkspaceProps) {
  // ── 1. CORE LABORATORY STATE ──
  const [mode, setMode] = useState<LabMode>("step-by-step");
  const [equippedItems, setEquippedItems] = useState<string[]>([]);
  
  // Dynamic Inputs state loaded from experiment configuration
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    activeLab.controls.forEach((ctrl) => {
      initial[ctrl.id] = ctrl.defaultValue;
    });
    initial.reactionRun = false;
    return initial;
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [runHistory, setRunHistory] = useState<any[]>([]);
  const [userObservations, setUserObservations] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  // ── 2. STOPWATCH TIMER STATE ──
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSpeed, setTimerSpeed] = useState(1); // multiplier (1x, 2x, 5x)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── 3. ASSESSMENT / DIALOG STATE ──
  const [assessmentStep, setAssessmentStep] = useState<"not-started" | "quiz" | "viva" | "observations" | "done">("not-started");
  
  // MCQ Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState(0);

  // Oral Viva state
  const [vivaScore, setVivaScore] = useState(0);
  const [vivaTranscript, setVivaTranscript] = useState("");

  // Overlays
  const [showReport, setShowReport] = useState(false);
  const [showCert, setShowCert] = useState(false);

  // ── 4. STOPWATCH TIMER EFFECT ──
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000 / timerSpeed);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerSpeed]);

  // Reset states when changing active lab
  useEffect(() => {
    setEquippedItems([]);
    const initial: Record<string, any> = {};
    activeLab.controls.forEach((ctrl) => {
      initial[ctrl.id] = ctrl.defaultValue;
    });
    initial.reactionRun = false;
    setInputs(initial);
    setRunHistory([]);
    setUserObservations({});
    setNotes("");
    setTimeSeconds(0);
    setTimerActive(false);
    setAssessmentStep("not-started");
    setCurrentQIndex(0);
    setQuizAnswers({});
    setQuizScore(0);
    setVivaScore(0);
    setVivaTranscript("");
    setShowReport(false);
    setShowCert(false);
  }, [activeLab]);

  // ── 5. SIMULATION COMPUTE BINDINGS ──
  const outputs = useMemo(() => {
    // If running in step-by-step, verify materials are placed/equipped before reaction works!
    const requiresMaterials = activeLab.materials.length > 0 || activeLab.equipment.length > 0;
    const allMaterialsEquipped = activeLab.materials.every(m => equippedItems.includes(m)) && 
                                 activeLab.equipment.every(e => equippedItems.includes(e));

    if (requiresMaterials && !allMaterialsEquipped && inputs.reactionRun) {
      return {
        rate: 0,
        status: "BLOCKED: Prepare required equipment and reagents from the cabinet first."
      };
    }

    return activeLab.compute(inputs);
  }, [inputs, activeLab, equippedItems]);

  // ── 6. STEP-BY-STEP CHECKLIST STATUS ──
  const checklistStatus = useMemo(() => {
    return activeLab.steps.map((step) => step.check(inputs, outputs));
  }, [activeLab, inputs, outputs]);

  const currentStepIdx = useMemo(() => {
    const idx = checklistStatus.findIndex((status) => !status);
    return idx === -1 ? activeLab.steps.length - 1 : idx;
  }, [checklistStatus, activeLab]);

  const allStepsCompleted = useMemo(() => {
    return checklistStatus.every((status) => status === true);
  }, [checklistStatus]);

  // ── 7. INTERACTIVE ACTION TRIGGERS ──
  const handleEquipItem = (item: string) => {
    setEquippedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item); // un-equip
      }
      return [...prev, item];
    });
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setInputs((prev) => ({ ...prev, reactionRun: false }));

    // Start timer automatically when reaction starts
    setTimerActive(true);

    setTimeout(() => {
      setIsSimulating(false);
      setInputs((prev) => ({ ...prev, reactionRun: true }));

      // Add to logs history
      const timeStr = new Date().toLocaleTimeString();
      setRunHistory((prev) => [
        {
          timestamp: timeStr,
          inputs: { ...inputs, reactionRun: true },
          outputs: activeLab.compute({ ...inputs, reactionRun: true })
        },
        ...prev
      ]);
    }, 2000);
  };

  // ── 8. ASSESSMENT MCQ HANDLERS ──
  const handleAnswerSelect = (optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [currentQIndex]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    activeLab.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.ans) score++;
    });
    setQuizScore(score);
    // Proceed to oral viva voce
    setAssessmentStep("viva");
  };

  const handleVivaComplete = (score: number, transcript: string) => {
    setVivaScore(score);
    setVivaTranscript(transcript);
    // Proceed to observations text analysis
    setAssessmentStep("observations");
  };

  const handleSubmitObservations = () => {
    setAssessmentStep("done");
    setShowCert(true); // show congratulatory popup
  };

  // Award XP based on scores
  const earnedXp = useMemo(() => {
    return Math.round((quizScore / 3) * 100 + (vivaScore / 100) * 100);
  }, [quizScore, vivaScore]);

  // Save completion to profile
  const handleClaimCertification = () => {
    setShowCert(false);
    // Save to local storage for persistent tracking
    const completedList = localStorage.getItem("biosphere_completed_labs");
    const list = completedList ? JSON.parse(completedList) : [];
    if (!list.includes(activeLab.id)) {
      list.push(activeLab.id);
      localStorage.setItem("biosphere_completed_labs", JSON.stringify(list));
    }
  };

  // ── 9. TIMELINE CONTROL BAR (Start, Pause, Resume, Restart) ──
  const handleStartTimer = () => setTimerActive(true);
  const handlePauseTimer = () => setTimerActive(false);
  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeSeconds(0);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col flex-1 relative w-full h-full min-h-[calc(100vh-64px)] text-[var(--ds-fg)] bg-[#050A05] z-1">
      {/* Dynamic glow decoration */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-radial from-[var(--ds-accent-faint)] to-transparent pointer-events-none z-0" />

      {/* ── HEADER NAVIGATION BAR ── */}
      <header className="border-b border-[var(--ds-border-muted)] px-6 py-4 flex items-center justify-between no-print z-10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="back-btn font-bold">
            ← Lab Cabinet
          </button>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">
              {activeLab.name}
            </h1>
            <p className="text-[9px] text-[var(--ds-accent)] font-bold tracking-widest uppercase">
              {activeLab.subject} · {activeLab.difficulty} · Est: {activeLab.duration}
            </p>
          </div>
        </div>

        {/* Stopwatch & Time Controls */}
        <div className="flex items-center gap-3 bg-white/5 border border-[var(--ds-border-muted)] px-3 py-1.5 rounded-lg text-xs">
          <span className="font-mono font-bold text-white text-[13px]">
            ⏳ {formatTime(timeSeconds)}
          </span>
          <div className="flex gap-1.5 border-l border-[var(--ds-border-muted)] pl-3">
            {timerActive ? (
              <button
                onClick={handlePauseTimer}
                className="hover:text-yellow-400 font-bold text-[10px] uppercase"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={handleStartTimer}
                className="hover:text-[var(--ds-accent)] font-bold text-[10px] uppercase"
              >
                Resume
              </button>
            )}
            <button
              onClick={handleResetTimer}
              className="hover:text-red-400 font-bold text-[10px] uppercase pl-1.5"
            >
              Reset
            </button>
          </div>
          {/* Speed selector */}
          <select
            value={timerSpeed}
            onChange={(e) => setTimerSpeed(parseInt(e.target.value))}
            className="bg-black/80 border border-[var(--ds-border-muted)] rounded text-[9px] text-white p-0.5 outline-none"
          >
            <option value={1}>1x Speed</option>
            <option value={2}>2x Fast</option>
            <option value={5}>5x Warp</option>
          </select>
        </div>
      </header>

      {/* ── WORKSPACE GRID LAYOUT ── */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 p-4 md:p-6 gap-6 z-10 relative items-start">
        {/* LEFT SECTION (Col Span 3): Instruction literature & inventory shelf */}
        <section className="xl:col-span-3 space-y-6 self-stretch flex flex-col no-print">
          <div className="flex-1 min-h-[300px]">
            <EquipmentPanel
              equipmentList={activeLab.equipment}
              materialsList={activeLab.materials}
              equippedItems={equippedItems}
              onEquipItem={handleEquipItem}
              isSimulating={isSimulating}
            />
          </div>
          <div className="flex-1">
            <InstructionPanel
              objectives={activeLab.objectives}
              outcomes={activeLab.outcomes}
              theory={activeLab.theory}
              background={activeLab.background}
              safety={activeLab.safety}
              cleanup={activeLab.cleanup}
              references={activeLab.references}
            />
          </div>
        </section>

        {/* CENTER SECTION (Col Span 5): Live 3D/SVG Simulation & Controls */}
        <section className="xl:col-span-5 space-y-6 self-stretch flex flex-col">
          {/* Live Animation viewport */}
          <div className="flex-1 bg-black/30 border border-[var(--ds-border-muted)] rounded-2xl p-4 flex flex-col justify-between min-h-[360px]">
            <h3 className="panel-section-title">🖥️ LIVE SIMULATION VISUALS</h3>
            <div className="flex-1 flex items-center justify-center">
              <SimulationCanvas
                simulationType={activeLab.simulationType}
                inputs={inputs}
                outputs={outputs}
              />
            </div>

            {/* Diagnostic logger text */}
            <div className="mt-4 bg-black/50 border border-[var(--ds-border-muted)] p-2.5 rounded font-mono text-[9.5px] leading-relaxed">
              <span className="text-[var(--ds-accent)] font-bold block mb-1">
                SYSTEM SCAN STATUS LOG:
              </span>
              {isSimulating ? (
                <p className="animate-pulse text-[#38bdf8]">
                  Simulating molecular kinetic interactions... gathering yield metrics...
                </p>
              ) : (
                <p className="text-[var(--ds-fg-muted)]">{outputs.status || "Idle. Set variables."}</p>
              )}
            </div>
          </div>

          {/* Variables adjustment slider board */}
          {assessmentStep === "not-started" && (
            <div className="panel-card glassmorphic space-y-4 no-print">
              <h3 className="panel-section-title">🎛️ SIMULATION ADJUSTMENTS</h3>
              <div className="space-y-4">
                {activeLab.controls.map((ctrl) => {
                  // Disable control if it does not belong to the active step in step-by-step mode
                  const isBlocked =
                    mode === "step-by-step" &&
                    activeLab.steps[currentStepIdx]?.instruction &&
                    !activeLab.steps[currentStepIdx].instruction.toLowerCase().includes(ctrl.name.toLowerCase().split(" ")[0]);

                  return (
                    <div
                      key={ctrl.id}
                      className={`flex flex-col gap-1.5 transition-all ${
                        isBlocked ? "opacity-35 pointer-events-none" : ""
                      }`}
                    >
                      <div className="flex justify-between text-[10.5px]">
                        <span className="font-bold text-[var(--ds-fg-muted)]">{ctrl.name}</span>
                        <span className="font-bold text-white">
                          {inputs[ctrl.id]} {ctrl.unit || ""}
                        </span>
                      </div>

                      {ctrl.type === "slider" ? (
                        <input
                          type="range"
                          min={ctrl.min}
                          max={ctrl.max}
                          step={ctrl.step}
                          value={inputs[ctrl.id]}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              [ctrl.id]: parseFloat(e.target.value)
                            }))
                          }
                          className="lab-slider w-full"
                        />
                      ) : ctrl.type === "counter" ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              setInputs((prev) => ({
                                ...prev,
                                [ctrl.id]: Math.max(ctrl.min ?? 0, prev[ctrl.id] - 1)
                              }))
                            }
                            className="bg-white/5 border border-[var(--ds-border-muted)] px-3 py-1 rounded hover:bg-white/10 text-white font-bold font-mono text-xs"
                          >
                            -
                          </button>
                          <button
                            onClick={() =>
                              setInputs((prev) => ({
                                ...prev,
                                [ctrl.id]: Math.min(ctrl.max ?? 5, prev[ctrl.id] + 1)
                              }))
                            }
                            className="bg-white/5 border border-[var(--ds-border-muted)] px-3 py-1 rounded hover:bg-white/10 text-white font-bold font-mono text-xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <select
                          value={inputs[ctrl.id]}
                          onChange={(e) =>
                            setInputs((prev) => ({ ...prev, [ctrl.id]: e.target.value }))
                          }
                          className="bg-black/60 border border-[var(--ds-border-muted)] rounded p-1.5 text-[10px] text-white outline-none focus:border-[var(--ds-accent-muted)]"
                        >
                          {ctrl.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action execute button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full bg-[var(--ds-accent-faint)] border border-[var(--ds-border-accent)] hover:bg-[var(--ds-accent-subtle)] text-[var(--ds-accent)] font-bold text-xs py-2.5 rounded-lg transition-all"
              >
                {isSimulating
                  ? "SIMULATING PHYSICAL COLLISION..."
                  : activeLab.simulationType === "photosynthesis"
                  ? "Measure Photo-Rate ⏳"
                  : activeLab.simulationType === "catalase"
                  ? "Run Catalysis 🧪"
                  : activeLab.simulationType === "osmosis"
                  ? "Observe Osmotic Gradient ⇆"
                  : "Observe Specimen 🔦"}
              </button>
            </div>
          )}
        </section>

        {/* RIGHT SECTION (Col Span 4): Step logs / Assessment flow & AI Mentor */}
        <section className="xl:col-span-4 space-y-6 self-stretch flex flex-col no-print">
          {/* Mode Selector and Checklist */}
          <div className="panel-card glassmorphic">
            <div className="flex border-b border-[var(--ds-border-muted)] pb-2 mb-3 justify-between items-center text-[10.5px]">
              <span className="font-bold text-[var(--ds-fg-muted)]">WORK METHOD:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMode("step-by-step");
                    setAssessmentStep("not-started");
                  }}
                  className={`px-2 py-0.5 rounded border transition-all ${
                    mode === "step-by-step"
                      ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                      : "bg-transparent border-transparent text-[var(--ds-fg-subtle)] hover:text-white"
                  }`}
                >
                  Steps
                </button>
                <button
                  onClick={() => {
                    setMode("exploration");
                    setAssessmentStep("not-started");
                  }}
                  className={`px-2 py-0.5 rounded border transition-all ${
                    mode === "exploration"
                      ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                      : "bg-transparent border-transparent text-[var(--ds-fg-subtle)] hover:text-white"
                  }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => {
                    setMode("assessment");
                    setAssessmentStep("quiz");
                  }}
                  className={`px-2 py-0.5 rounded border transition-all ${
                    mode === "assessment"
                      ? "bg-purple-950/80 border-purple-500/50 text-purple-300 font-bold"
                      : "bg-transparent border-transparent text-[var(--ds-fg-subtle)] hover:text-white"
                  }`}
                >
                  Assess
                </button>
              </div>
            </div>

            {/* Step-by-Step checklist render */}
            {mode === "step-by-step" && (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {activeLab.steps.map((step, idx) => {
                  const isDone = checklistStatus[idx];
                  const isCurrent = idx === 0 || checklistStatus[idx - 1];
                  return (
                    <div
                      key={idx}
                      className={`flex gap-2 p-2 rounded border text-[10.5px] leading-relaxed transition-all ${
                        isDone
                          ? "bg-[var(--ds-success-subtle)]/15 border-green-500/20 text-[var(--ds-fg-muted)]"
                          : isCurrent
                          ? "bg-white/5 border-[var(--ds-border-muted)] text-white font-bold"
                          : "opacity-40 border-transparent text-[var(--ds-fg-subtle)]"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] shrink-0">
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <div>
                        <span>{step.title}</span>
                        <p className="text-[9.5px] text-[var(--ds-fg-subtle)] font-normal">
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {allStepsCompleted && (
                  <button
                    onClick={() => {
                      setMode("assessment");
                      setAssessmentStep("quiz");
                    }}
                    className="w-full bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 text-[11px] font-bold py-2 rounded-lg mt-3 text-center transition-all animate-pulse"
                  >
                    All steps complete! Launch Assessment →
                  </button>
                )}
              </div>
            )}

            {/* Free Exploration mode details */}
            {mode === "exploration" && (
              <div className="text-[10px] text-[var(--ds-fg-muted)] leading-relaxed space-y-2">
                <p>🔓 All sliders, dials, and options are unlocked. You are free to run trial mixes and log raw data.</p>
                <div className="bg-white/2 p-2.5 rounded border border-[var(--ds-border-muted)]/50">
                  <span className="font-bold text-white block uppercase mb-1">Expected Observations:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[9.5px]">
                    {activeLab.expectedObservations.map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Assessment State panels */}
            {mode === "assessment" && (
              <div className="space-y-3">
                {/* 1. QUIZ PANEL */}
                {assessmentStep === "quiz" && (
                  <div className="space-y-3">
                    <span className="text-[9px] text-[var(--ds-fg-subtle)] uppercase">Question {currentQIndex + 1} of 3</span>
                    <h4 className="text-[11px] font-bold text-white leading-relaxed">
                      {activeLab.quiz[currentQIndex].q}
                    </h4>
                    <div className="space-y-2">
                      {activeLab.quiz[currentQIndex].options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[currentQIndex] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerSelect(oIdx)}
                            className={`w-full text-left px-3 py-2 rounded text-[10px] border transition-all ${
                              isSelected
                                ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                                : "bg-white/2 border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:border-[var(--ds-accent-muted)]"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                        disabled={currentQIndex === 0}
                        className="text-[9px] bg-white/5 border px-2 py-1 rounded text-white disabled:opacity-50"
                      >
                        Prev
                      </button>
                      {currentQIndex < 2 ? (
                        <button
                          onClick={() => setCurrentQIndex((i) => i + 1)}
                          disabled={quizAnswers[currentQIndex] === undefined}
                          className="text-[9px] bg-white/5 border px-2 py-1 rounded text-white disabled:opacity-50"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={quizAnswers[currentQIndex] === undefined}
                          className="text-[9px] bg-purple-950 border border-purple-500/50 px-3 py-1 rounded text-purple-300 font-bold"
                        >
                          Submit Answers
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. VIVA VOCE PANEL */}
                {assessmentStep === "viva" && (
                  <div className="text-[10px] text-[var(--ds-fg-muted)] text-center py-4 space-y-2">
                    <span>💬 Viva Voce exam is in progress inside the AI Sidebar.</span>
                    <p className="text-[9px] text-[var(--ds-fg-subtle)]">
                      Answer the conceptual questions typed by Professor BioTutor.
                    </p>
                  </div>
                )}

                {/* 3. OBSERVATION ANSWERS SUBMIT */}
                {assessmentStep === "observations" && (
                  <div className="space-y-3">
                    <span className="text-[9px] text-[var(--ds-fg-subtle)] uppercase">Final Check</span>
                    <h4 className="text-[11px] font-bold text-white uppercase">
                      Confirm Observation Questions
                    </h4>
                    <p className="text-[9.5px] text-[var(--ds-fg-muted)] leading-relaxed">
                      Fill out the questionnaire in the bottom observation panel. Once finished, submit below to lock your results.
                    </p>
                    <button
                      onClick={handleSubmitObservations}
                      className="w-full bg-[var(--ds-success-subtle)] border border-green-500/50 text-[var(--ds-success)] text-[11.5px] font-bold py-2 rounded-lg hover:bg-green-500/20 transition-all text-center"
                    >
                      Submit Lab Report Data
                    </button>
                  </div>
                )}

                {/* 4. COMPLETED GRADES */}
                {assessmentStep === "done" && (
                  <ResultPanel
                    quizScore={quizScore}
                    vivaScore={vivaScore}
                    totalXp={earnedXp}
                    achievements={[
                      {
                        title: `${activeLab.name} Scholar`,
                        desc: `Successfully completed molecular trials and viva testing.`,
                        icon: "🎓"
                      }
                    ]}
                    isCompleted={true}
                    onReset={() => {
                      setMode("step-by-step");
                      setAssessmentStep("not-started");
                    }}
                    onGenerateReport={() => setShowReport(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* AI Mentor chatbot panel */}
          <div className="flex-1">
            <AIMentorSidebar
              experimentId={activeLab.id}
              experimentName={activeLab.name}
              currentStepIndex={currentStepIdx}
              currentStepTitle={activeLab.steps[currentStepIdx]?.title || "Explore"}
              inputs={inputs}
              outputs={outputs}
              equippedItems={equippedItems}
              mode={mode}
              vivaActive={assessmentStep === "viva"}
              onVivaComplete={handleVivaComplete}
            />
          </div>
        </section>
      </main>

      {/* FOOTER SECTION: Observations analysis and Notebook */}
      <footer className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6 border-t border-[var(--ds-border-muted)] bg-black/10 no-print z-10 relative">
        <div>
          <ObservationPanel
            questions={activeLab.observationQuestions}
            userObservations={userObservations}
            onChangeObservation={(qId, answer) =>
              setUserObservations((prev) => ({ ...prev, [qId]: answer }))
            }
            runHistory={runHistory}
            currentOutputs={outputs}
            controlsConfig={activeLab.controls}
          />
        </div>
        <div>
          <Notebook notes={notes} onChangeNotes={setNotes} />
        </div>
      </footer>

      {/* ── Cert Overlay Dialog ── */}
      <CompletionDialog
        isOpen={showCert}
        onClose={handleClaimCertification}
        experimentName={activeLab.name}
        grade={Math.round((quizScore / 3) * 50 + (vivaScore / 100) * 50)}
        xp={earnedXp}
        badgeName={`${activeLab.name} Certification`}
        badgeIcon="🧬"
      />

      {/* ── Report Card Overlay ── */}
      {showReport && (
        <LabReportGenerator
          experimentName={activeLab.name}
          subject={activeLab.subject}
          difficulty={activeLab.difficulty}
          objectives={activeLab.objectives}
          materials={[...activeLab.materials, ...activeLab.equipment]}
          runHistory={runHistory}
          userObservations={userObservations}
          observationQuestions={activeLab.observationQuestions}
          quizScore={quizScore}
          vivaScore={vivaScore}
          notes={notes}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
