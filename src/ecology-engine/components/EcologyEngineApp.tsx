"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Ecosystem,
  BiodiversityMetrics,
  EvolutionTimeline,
  WeatherType,
  DisturbanceType,
  EcosystemChallenge,
} from "../types";
import { EcosystemEngine } from "../simulation/ecosystemEngine";
import { EvolutionEngine } from "../simulation/evolutionEngine";
import { EcologyRegistry } from "../registry/EcologyRegistry";
import { EcosystemCanvas } from "./EcosystemCanvas";
import { SpeciesLibrary } from "./SpeciesLibrary";
import { ClimateControls } from "./ClimateControls";
import { FoodWebViewer } from "./FoodWebViewer";
import { PopulationGraph } from "./PopulationGraph";
import { EvolutionTimelineViewer } from "./EvolutionTimeline";
import { ObservationNotebook } from "./ObservationNotebook";
import { AssessmentPanel } from "./AssessmentPanel";

interface EcologyEngineAppProps {
  initialBiomeId?: string;
}

export const EcologyEngineApp: React.FC<EcologyEngineAppProps> = ({
  initialBiomeId = "forest",
}) => {
  const [ecosystem, setEcosystem] = useState<Ecosystem>(() =>
    EcosystemEngine.createInitialEcosystem(initialBiomeId)
  );

  const [timeline, setTimeline] = useState<EvolutionTimeline>(() =>
    EvolutionEngine.createInitialTimeline()
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [userXP, setUserXP] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<"simulation" | "foodweb" | "evolution" | "assessment">(
    "simulation"
  );

  // History tracking for real-time trajectory graph
  const [popHistory, setPopHistory] = useState<
    Array<{ generation: number; counts: Record<string, number> }>
  >([]);

  // Reset simulation handler
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    const newEco = EcosystemEngine.createInitialEcosystem(ecosystem.biomeId);
    const newTimeline = EvolutionEngine.createInitialTimeline();
    setEcosystem(newEco);
    setTimeline(newTimeline);

    const initialCounts: Record<string, number> = {};
    Object.keys(newEco.populations).forEach((id) => {
      initialCounts[id] = newEco.populations[id].count;
    });
    setPopHistory([{ generation: 1, counts: initialCounts }]);
  }, [ecosystem.biomeId]);

  // Handle Biome Switching
  const handleSelectBiome = (biomeId: string) => {
    setIsPlaying(false);
    const newEco = EcosystemEngine.createInitialEcosystem(biomeId);
    const newTimeline = EvolutionEngine.createInitialTimeline();
    setEcosystem(newEco);
    setTimeline(newTimeline);

    const initialCounts: Record<string, number> = {};
    Object.keys(newEco.populations).forEach((id) => {
      initialCounts[id] = newEco.populations[id].count;
    });
    setPopHistory([{ generation: 1, counts: initialCounts }]);
  };

  // Main simulation tick loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = Math.max(50, 400 / timeSpeed);
      timer = setInterval(() => {
        setEcosystem((prevEco) => {
          const nextEco = EcosystemEngine.tick(prevEco);

          // Update trajectory history
          setPopHistory((prevHistory) => {
            const counts: Record<string, number> = {};
            Object.keys(nextEco.populations).forEach((id) => {
              counts[id] = nextEco.populations[id].count;
            });
            const updated = [...prevHistory, { generation: nextEco.generation, counts }];
            return updated.slice(-60); // Keep last 60 ticks
          });

          // Process macroevolution allele shifts & speciation check
          setTimeline((prevTimeline) => {
            const { updatedTimeline } = EvolutionEngine.processEvolutionStep(
              nextEco,
              prevTimeline,
              "directional"
            );
            return updatedTimeline;
          });

          return nextEco;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeSpeed]);

  // Climate Control Mutators
  const handleChangeTemperature = (temp: number) => {
    setEcosystem((prev) => ({
      ...prev,
      climate: { ...prev.climate, temperature: temp },
    }));
  };

  const handleChangeRainfall = (rain: number) => {
    setEcosystem((prev) => ({
      ...prev,
      climate: { ...prev.climate, rainfall: rain },
    }));
  };

  const handleChangeWeather = (weather: WeatherType) => {
    setEcosystem((prev) => ({
      ...prev,
      climate: { ...prev.climate, weather },
    }));
  };

  const handleTriggerDisturbance = (type: DisturbanceType) => {
    const dist = EcologyRegistry.getInstance().createDisturbance(type, 70, 150);
    setEcosystem((prev) => ({
      ...prev,
      activeDisturbances: [...prev.activeDisturbances, dist],
    }));
  };

  const handleInjectSpecies = (speciesId: string) => {
    setEcosystem((prev) => {
      const spec = EcologyRegistry.getInstance().getSpecies(speciesId);
      if (!spec) return prev;
      const currentPop = prev.populations[speciesId];
      const addedCount = currentPop ? currentPop.count + 40 : 40;

      const positions = Array.from({ length: 40 }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * (spec.movementSpeed * 0.4),
        vy: (Math.random() - 0.5) * (spec.movementSpeed * 0.4),
      }));

      return {
        ...prev,
        populations: {
          ...prev.populations,
          [speciesId]: {
            speciesId,
            count: addedCount,
            health: 100,
            averageFitness: 1.0,
            alleleFrequencies: { P1: 0.8, P2: 0.2 },
            ageDistribution: { juvenile: 0.4, adult: 0.5, senior: 0.1 },
            positions,
          },
        },
      };
    });
  };

  const handleLoadChallenge = (chal: EcosystemChallenge) => {
    setIsPlaying(false);
    const newEco = EcosystemEngine.createInitialEcosystem(chal.targetBiomeId);
    newEco.climate = { ...newEco.climate, ...chal.initialClimate };
    setEcosystem(newEco);
  };

  const metrics: BiodiversityMetrics = EcosystemEngine.calculateBiodiversityMetrics(ecosystem);

  return (
    <div className="ecology-engine-app flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">
      {/* Top Header System Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌿</span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Biosphere <span className="text-emerald-400 font-mono">Ecology & Evolution Engine</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Modular multi-species Lotka-Volterra simulator, trophic energy flow pyramids, macroevolution cladograms, and climate disturbance sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Earned XP
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              +{userXP} XP
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("simulation")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "simulation"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          🌐 Interactive Simulation Canvas
        </button>
        <button
          onClick={() => setActiveTab("foodweb")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "foodweb"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          🕸️ Food Web & Energy Flow
        </button>
        <button
          onClick={() => setActiveTab("evolution")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "evolution"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          🧬 Evolution Cladogram
        </button>
        <button
          onClick={() => setActiveTab("assessment")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "assessment"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800"
          }`}
        >
          🏆 Assessment & Challenges
        </button>
      </div>

      {/* TAB 1: Main Simulation Canvas Workspace */}
      {activeTab === "simulation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Canvas & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <EcosystemCanvas ecosystem={ecosystem} />
            <ClimateControls
              climate={ecosystem.climate}
              isPlaying={isPlaying}
              timeSpeed={timeSpeed}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onChangeSpeed={(s) => setTimeSpeed(s)}
              onReset={handleReset}
              onChangeTemperature={handleChangeTemperature}
              onChangeRainfall={handleChangeRainfall}
              onChangeWeather={handleChangeWeather}
              onTriggerDisturbance={handleTriggerDisturbance}
            />
            <PopulationGraph ecosystem={ecosystem} history={popHistory} />
          </div>

          {/* Right Column: Species Library & Field Notebook */}
          <div className="space-y-6">
            <SpeciesLibrary
              onInjectSpecies={handleInjectSpecies}
              onSelectBiome={handleSelectBiome}
              activeBiomeId={ecosystem.biomeId}
            />
            <ObservationNotebook ecosystem={ecosystem} metrics={metrics} />
          </div>
        </div>
      )}

      {/* TAB 2: Food Web & Energy Flow Pyramids */}
      {activeTab === "foodweb" && (
        <div className="space-y-6">
          <FoodWebViewer ecosystem={ecosystem} />
          <ObservationNotebook ecosystem={ecosystem} metrics={metrics} />
        </div>
      )}

      {/* TAB 3: Evolution Timeline & Cladograms */}
      {activeTab === "evolution" && (
        <div className="space-y-6">
          <EvolutionTimelineViewer timeline={timeline} />
          <ObservationNotebook ecosystem={ecosystem} metrics={metrics} />
        </div>
      )}

      {/* TAB 4: Assessment & Challenges */}
      {activeTab === "assessment" && (
        <div className="space-y-6">
          <AssessmentPanel
            ecosystem={ecosystem}
            metrics={metrics}
            onAwardXP={(xp) => setUserXP((prev) => prev + xp)}
            onLoadChallenge={handleLoadChallenge}
          />
        </div>
      )}
    </div>
  );
};
