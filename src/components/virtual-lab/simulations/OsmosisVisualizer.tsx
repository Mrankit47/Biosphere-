"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "water" | "solute";
  side: "left" | "right";
}

export default function OsmosisVisualizer({
  inputs,
  outputs
}: {
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const externalSolute = inputs.externalSolute ?? 0.9;
  const channelDensity = inputs.channelDensity ?? 20;
  const temperature = inputs.temperature ?? 25;
  const reactionRun = inputs.reactionRun ?? false;

  const cellState = outputs.cellState ?? "Isotonic (Normal)";
  const netDirection = outputs.netDirection ?? "None";

  // State to track cell boundary size (100% normal scale)
  const [cellScale, setCellScale] = useState(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    // Set up particles
    const particles: Particle[] = [];
    const width = canvas.width;
    const height = canvas.height;
    const membraneX = width / 2;

    // Speeds scale with temperature
    const baseSpeed = 0.6 + (temperature / 45) * 1.5;

    // Intracellular solute (Left side) is constant (0.9%)
    const innerSoluteCount = 10;
    // Extracellular solute (Right side)
    const outerSoluteCount = Math.round(externalSolute * 12);

    // Intracellular water
    const innerWaterCount = 60;
    // Extracellular water
    const outerWaterCount = 60;

    // Initialize Left (Intracellular)
    for (let i = 0; i < innerSoluteCount; i++) {
      particles.push({
        x: Math.random() * (membraneX - 30) + 15,
        y: Math.random() * (height - 30) + 15,
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: (Math.random() - 0.5) * baseSpeed,
        type: "solute",
        side: "left"
      });
    }
    for (let i = 0; i < innerWaterCount; i++) {
      particles.push({
        x: Math.random() * (membraneX - 20) + 10,
        y: Math.random() * (height - 20) + 10,
        vx: (Math.random() - 0.5) * baseSpeed * 1.5,
        vy: (Math.random() - 0.5) * baseSpeed * 1.5,
        type: "water",
        side: "left"
      });
    }

    // Initialize Right (Extracellular)
    for (let i = 0; i < outerSoluteCount; i++) {
      particles.push({
        x: Math.random() * (width - (membraneX + 30)) + (membraneX + 15),
        y: Math.random() * (height - 30) + 15,
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: (Math.random() - 0.5) * baseSpeed,
        type: "solute",
        side: "right"
      });
    }
    for (let i = 0; i < outerWaterCount; i++) {
      particles.push({
        x: Math.random() * (width - (membraneX + 20)) + (membraneX + 10),
        y: Math.random() * (height - 20) + 10,
        vx: (Math.random() - 0.5) * baseSpeed * 1.5,
        vy: (Math.random() - 0.5) * baseSpeed * 1.5,
        type: "water",
        side: "right"
      });
    }

    // Define aquaporin gate regions on membrane (vertical segments)
    const numChannels = Math.max(1, Math.ceil(channelDensity / 15));
    const channelSegments: { yStart: number; yEnd: number }[] = [];
    const segmentHeight = 24;
    const spacing = height / (numChannels + 1);
    for (let i = 1; i <= numChannels; i++) {
      channelSegments.push({
        yStart: i * spacing - segmentHeight / 2,
        yEnd: i * spacing + segmentHeight / 2
      });
    }

    // Target cell scale transition
    let targetScale = 1.0;
    if (reactionRun) {
      if (externalSolute > 1.0) {
        targetScale = Math.max(0.65, 1.0 - (externalSolute - 0.9) * 0.08); // shrivel
      } else if (externalSolute < 0.8) {
        targetScale = Math.min(1.35, 1.0 + (0.9 - externalSolute) * 0.25); // swell
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // ── DRAW WORKSPACE DIVIDER WALLS ──
      ctx.fillStyle = "#0c180c";
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = "rgba(57, 255, 20, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Intracellular Cell Border outline (Left side cell representation)
      // Visualizing a cell structure scaling inside the left compartment
      ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
      ctx.fillStyle = "rgba(16, 185, 129, 0.03)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Draw a rounded cell bag shape centered in left side
      const cellCenterX = membraneX / 2;
      const cellCenterY = height / 2;
      const cellRadiusX = (membraneX / 2 - 20) * cellScale;
      const cellRadiusY = (height / 2 - 20) * cellScale;
      ctx.ellipse(cellCenterX, cellCenterY, cellRadiusX, cellRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // Label Chambers
      ctx.fillStyle = "rgba(200, 245, 200, 0.4)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("INTRACELLULAR (CYTOPLASM: 0.9%)", membraneX / 2, 20);
      ctx.fillText(`EXTRACELLULAR (SALINE: ${externalSolute}%)`, membraneX + (width - membraneX) / 2, 20);

      // ── DRAW LIPID MEMBRANE ──
      // Hydrophobic tail layer (middle background)
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(membraneX - 4, 0, 8, height);

      // Hydrophilic heads (left and right lipid boundary dots)
      ctx.fillStyle = "#e2e8f0";
      for (let y = 5; y < height; y += 12) {
        // Draw circles representing lipid heads
        ctx.beginPath();
        ctx.arc(membraneX - 6, y, 3, 0, Math.PI * 2);
        ctx.arc(membraneX + 6, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Protein Channels (Aquaporin Gates in neon green)
      ctx.fillStyle = "#10b981";
      ctx.strokeStyle = "#39ff14";
      ctx.lineWidth = 1;
      channelSegments.forEach((seg) => {
        ctx.fillRect(membraneX - 8, seg.yStart, 16, segmentHeight);
        ctx.strokeRect(membraneX - 8, seg.yStart, 16, segmentHeight);
        
        // Draw channel arrow symbol
        ctx.fillStyle = "#022c22";
        ctx.font = "8px sans-serif";
        ctx.fillText("⇆", membraneX, seg.yStart + 15);
        ctx.fillStyle = "#10b981";
      });

      // ── ANIMATE & RENDER PARTICLES ──
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions (top, bottom, outer boundaries)
        if (p.y <= 6 || p.y >= height - 6) {
          p.vy = -p.vy;
          p.y = p.y <= 6 ? 6 : height - 6;
        }
        if (p.x <= 6) {
          p.vx = -p.vx;
          p.x = 6;
        }
        if (p.x >= width - 6) {
          p.vx = -p.vx;
          p.x = width - 6;
        }

        // Membrane interactions (at membraneX)
        const hitMembrane = Math.abs(p.x - membraneX) <= 6;
        if (hitMembrane) {
          if (p.type === "solute") {
            // Solute cannot cross membrane - block and bounce!
            p.vx = -p.vx;
            p.x = p.x < membraneX ? membraneX - 7 : membraneX + 7;
          } else {
            // Water molecule interaction
            // Check if water overlaps with an open Aquaporin channel
            const hitsChannel = channelSegments.some(
              (seg) => p.y >= seg.yStart && p.y <= seg.yEnd
            );

            if (hitsChannel) {
              // Pass through channel
              // In assessment/run mode, force a slight osmosis net direction probability
              if (reactionRun) {
                const gradient = externalSolute - 0.9;
                const drift = 0.05 * (temperature / 25);
                
                if (gradient > 0.1) {
                  // Hypertonic: Water tends to exit (drift right)
                  p.vx = Math.abs(p.vx) + drift;
                } else if (gradient < -0.1) {
                  // Hypotonic: Water tends to enter (drift left)
                  p.vx = -Math.abs(p.vx) - drift;
                }
              }
              // Normal passage continues
              p.x += p.vx * 2; // skip boundary
            } else {
              // No channel: standard membrane lipid blocks water (low permeability)
              p.vx = -p.vx;
              p.x = p.x < membraneX ? membraneX - 7 : membraneX + 7;
            }
          }
        }

        // Update side logic
        p.side = p.x < membraneX ? "left" : "right";

        // Draw particle
        if (p.type === "solute") {
          // Solute is larger purple circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#a855f7";
          ctx.strokeStyle = "#c084fc";
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
        } else {
          // Water is smaller blue circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.fill();
        }
      });

      // Animate cell shape scale transition
      if (Math.abs(cellScale - targetScale) > 0.005) {
        setCellScale((prev) => prev + (targetScale - prev) * 0.02);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [externalSolute, channelDensity, temperature, reactionRun, cellScale]);

  return (
    <div className="relative w-full h-[320px] rounded-lg overflow-hidden border border-[var(--ds-glass-border)] bg-[#050a05] flex flex-col">
      {/* Canvas workspace */}
      <div className="flex-1 w-full bg-[#050a05]">
        <canvas
          ref={canvasRef}
          width={450}
          height={260}
          className="w-full h-full block"
        />
      </div>

      {/* Footer statistics readout panel */}
      <div className="bg-black/40 border-t border-[var(--ds-border-muted)] px-3 py-1.5 flex justify-between items-center text-[10px]">
        <div className="flex gap-4">
          <span className="text-[var(--ds-fg-muted)]">
            Cell State: <strong className="text-[#39ff14]">{cellState}</strong>
          </span>
          <span className="text-[var(--ds-fg-muted)]">
            Net Osmotic Flow: <strong className="text-[#38bdf8]">{netDirection}</strong>
          </span>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#a855f7]" /> Solute
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> Water
          </span>
        </div>
      </div>
    </div>
  );
}
