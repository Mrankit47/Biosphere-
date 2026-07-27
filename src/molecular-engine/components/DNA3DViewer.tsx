"use client";

import React, { useRef, useEffect, useState } from "react";

interface DNA3DViewerProps {
  strandColor1?: string;
  strandColor2?: string;
  height?: number;
}

export const DNA3DViewer: React.FC<DNA3DViewerProps> = ({
  strandColor1 = "#3B82F6",
  strandColor2 = "#10B981",
  height = 360
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.02);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    let animationFrameId: number;

    const numBasePairs = 24;
    const helixRadius = 70;
    const verticalSpacing = 14;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const startY = 30;

      if (isRotating) {
        angle += rotationSpeed;
      }

      for (let i = 0; i < numBasePairs; i++) {
        const y = startY + i * verticalSpacing;
        const currentAngle = angle + i * 0.35;

        const x1 = centerX + Math.sin(currentAngle) * helixRadius;
        const z1 = Math.cos(currentAngle);
        const size1 = 6 + z1 * 2;

        const x2 = centerX - Math.sin(currentAngle) * helixRadius;
        const z2 = -z1;
        const size2 = 6 + z2 * 2;

        // Draw Base Pair Hydrogen Connection Line
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + (z1 + 1) * 0.25})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Strand 1 Node (5' -> 3')
        ctx.beginPath();
        ctx.arc(x1, y, Math.max(3, size1), 0, Math.PI * 2);
        ctx.fillStyle = z1 > 0 ? strandColor1 : "#1e293b";
        ctx.shadowColor = strandColor1;
        ctx.shadowBlur = z1 > 0 ? 8 : 0;
        ctx.fill();

        // Draw Strand 2 Node (3' -> 5')
        ctx.beginPath();
        ctx.arc(x2, y, Math.max(3, size2), 0, Math.PI * 2);
        ctx.fillStyle = z2 > 0 ? strandColor2 : "#1e293b";
        ctx.shadowColor = strandColor2;
        ctx.shadowBlur = z2 > 0 ? 8 : 0;
        ctx.fill();

        // Base pair letter markers on front nodes
        if (z1 > 0.4) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText(i % 2 === 0 ? "A" : "G", x1 - 3, y + 3);
        }
        if (z2 > 0.4) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText(i % 2 === 0 ? "T" : "C", x2 - 3, y + 3);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRotating, rotationSpeed, strandColor1, strandColor2]);

  return (
    <div className="dna-3d-viewer-card glassmorphic">
      <div className="viewer-header">
        <div>
          <span className="viewer-eyebrow">3D HELICAL GEOMETRY VISUALIZER</span>
          <h3 className="viewer-title">Interactive B-DNA Double Helix</h3>
        </div>
        <div className="viewer-controls">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="control-btn"
          >
            {isRotating ? "⏸️ Pause Rotation" : "▶️ Resume Rotation"}
          </button>
          <button
            onClick={() => setRotationSpeed((prev) => (prev === 0.02 ? 0.05 : 0.02))}
            className="control-btn"
          >
            ⚡ {rotationSpeed === 0.02 ? "Speed Up" : "Normal Speed"}
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={500}
          height={height}
          className="dna-canvas"
        />
        <div className="groove-indicator left">5' Strand (Blue)</div>
        <div className="groove-indicator right">3' Strand (Green)</div>
      </div>

      <div className="base-pair-legend">
        <div className="legend-item"><span className="dot adenine" /> Adenine (A)</div>
        <div className="legend-item"><span className="dot thymine" /> Thymine (T)</div>
        <div className="legend-item"><span className="dot guanine" /> Guanine (G)</div>
        <div className="legend-item"><span className="dot cytosine" /> Cytosine (C)</div>
      </div>

      <style>{`
        .dna-3d-viewer-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .viewer-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .viewer-title {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .viewer-controls {
          display: flex;
          gap: 8px;
        }

        .control-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .control-btn:hover {
          border-color: var(--ds-border-accent);
          color: #fff;
        }

        .canvas-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1rem;
          overflow: hidden;
        }

        .dna-canvas {
          max-width: 100%;
        }

        .groove-indicator {
          position: absolute;
          top: 16px;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
        }
        .groove-indicator.left { left: 16px; }
        .groove-indicator.right { right: 16px; }

        .base-pair-legend {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #cbd5e1;
          font-weight: 600;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot.adenine { background: #3b82f6; }
        .dot.thymine { background: #ef4444; }
        .dot.guanine { background: #10b981; }
        .dot.cytosine { background: #f59e0b; }
      `}</style>
    </div>
  );
};
