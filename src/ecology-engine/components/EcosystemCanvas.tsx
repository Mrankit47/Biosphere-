"use client";

import React, { useRef, useEffect, useState } from "react";
import { Ecosystem, Species } from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

interface EcosystemCanvasProps {
  ecosystem: Ecosystem;
  onSelectSpecies?: (species: Species) => void;
}

export const EcosystemCanvas: React.FC<EcosystemCanvasProps> = ({ ecosystem, onSelectSpecies }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<Species | null>(null);

  const registry = EcologyRegistry.getInstance();
  const biome = registry.getBiome(ecosystem.biomeId);
  const weather = ecosystem.climate.weather;

  // Particle systems for rain, wildfire embers, and heat haze
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const weatherParticles: Array<{ x: number; y: number; speed: number; size: number; alpha: number }> = [];
    const particleCount = weather === "rainy" || weather === "stormy" ? 120 : weather === "heatwave" ? 30 : 0;

    for (let i = 0; i < particleCount; i++) {
      weatherParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: weather === "stormy" ? 6 + Math.random() * 6 : 2 + Math.random() * 3,
        size: weather === "rainy" ? 2 : 3,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Biome Background Terrain Gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (ecosystem.biomeId === "forest") {
        bgGradient.addColorStop(0, "#064e3b");
        bgGradient.addColorStop(1, "#022c22");
      } else if (ecosystem.biomeId === "reef") {
        bgGradient.addColorStop(0, "#0c4a6e");
        bgGradient.addColorStop(1, "#082f49");
      } else if (ecosystem.biomeId === "desert") {
        bgGradient.addColorStop(0, "#78350f");
        bgGradient.addColorStop(1, "#451a03");
      } else {
        bgGradient.addColorStop(0, "#18181b");
        bgGradient.addColorStop(1, "#09090b");
      }

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Decorative Terrain Elements (Canopy / Reef / Dunes)
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.arc(150, 400, 180, 0, Math.PI * 2);
      ctx.arc(650, 380, 220, 0, Math.PI * 2);
      ctx.fill();

      // 3. Render Organism Agent Sprites
      Object.keys(ecosystem.populations).forEach((specId) => {
        const pop = ecosystem.populations[specId];
        const spec = registry.getSpecies(specId);
        if (!spec || pop.count <= 0) return;

        const positions = pop.positions || [];
        ctx.fillStyle = spec.color;
        ctx.font = `${14 + spec.bodySize * 2}px sans-serif`;

        positions.forEach((pos) => {
          // Draw Emoji Sprite
          ctx.fillText(spec.spriteEmoji, pos.x, pos.y);

          // Draw tiny fitness aura ring
          ctx.strokeStyle = spec.accentColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pos.x + 8, pos.y - 6, spec.bodySize * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        });
      });

      // 4. Render Weather Effects (Rain / Heatwave / Wildfire Embers)
      if (weather === "rainy" || weather === "stormy") {
        ctx.strokeStyle = "rgba(147, 197, 253, 0.6)";
        ctx.lineWidth = 1.5;
        weatherParticles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.speed * 3);
          ctx.stroke();

          p.y += p.speed;
          if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (weather === "drought" || weather === "heatwave") {
        ctx.fillStyle = "rgba(251, 191, 36, 0.06)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Render Wildfire disturbance overlay if active
      const isFireActive = ecosystem.activeDisturbances.some((d) => d.type === "wildfire");
      if (isFireActive) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [ecosystem, weather]);

  // Click handler to select species agents from canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let foundSpec: Species | null = null;

    Object.keys(ecosystem.populations).forEach((specId) => {
      const pop = ecosystem.populations[specId];
      const spec = registry.getSpecies(specId);
      if (!spec || !pop.positions) return;

      pop.positions.forEach((pos) => {
        const dist = Math.hypot(clickX - pos.x, clickY - pos.y);
        if (dist < 25) {
          foundSpec = spec;
        }
      });
    });

    if (foundSpec) {
      setSelectedSpec(foundSpec);
      if (onSelectSpecies) onSelectSpecies(foundSpec);
    }
  };

  return (
    <div className="ecosystem-canvas-container relative w-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950/80 shadow-2xl backdrop-blur-md">
      {/* Top Overlay Badge Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/75 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{biome?.emoji || "🌿"}</span>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-emerald-400">{biome?.name}</h3>
            <p className="text-xs text-slate-400">
              Generation: <span className="font-semibold text-white">{ecosystem.generation}</span> | Days:{" "}
              <span className="font-semibold text-white">{ecosystem.timeElapsedDays}</span>
            </p>
          </div>
        </div>

        {/* Active Weather Preset Indicator */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 capitalize">
            {weather} weather
          </span>
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
            {ecosystem.climate.temperature}°C
          </span>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            {ecosystem.climate.rainfall} mm
          </span>
        </div>
      </div>

      {/* Main Canvas View */}
      <canvas
        ref={canvasRef}
        width={800}
        height={480}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-pointer block"
      />

      {/* Selected Species Overlay Card */}
      {selectedSpec && (
        <div className="absolute bottom-4 left-4 z-10 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-500/30 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md animate-in fade-in">
          <span className="text-3xl">{selectedSpec.spriteEmoji}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-emerald-400 truncate">{selectedSpec.name}</h4>
            <p className="text-[11px] text-slate-300 italic truncate">{selectedSpec.scientificName}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Population:{" "}
              <span className="font-bold text-white">
                {ecosystem.populations[selectedSpec.id]?.count || 0}
              </span>{" "}
              | Role: <span className="capitalize text-emerald-300">{selectedSpec.trophicRole.replace("_", " ")}</span>
            </p>
          </div>
          <button
            onClick={() => setSelectedSpec(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
