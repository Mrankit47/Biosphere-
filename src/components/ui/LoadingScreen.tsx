"use client";

import { useEffect, useState } from "react";
import Skeleton from "@/components/ds/Skeleton";
import GalleryGrid from "@/components/ds/GalleryGrid";

type LoadingType = "3d" | "skeleton";

interface LoadingScreenProps {
  type?: LoadingType;
  /** If provided, overrides the internal simulated progress */
  progress?: number;
}

export default function LoadingScreen({
  type = "3d",
  progress: externalProgress,
}: LoadingScreenProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const progress = externalProgress ?? internalProgress;

  // Simulated progress (auto-advance that slows as it nears 100)
  useEffect(() => {
    if (externalProgress !== undefined) return;
    const id = setInterval(() => {
      setInternalProgress((p) => {
        if (p >= 95) return p;
        const increment = Math.max(0.5, (100 - p) * 0.06);
        return Math.min(95, p + increment);
      });
    }, 120);
    return () => clearInterval(id);
  }, [externalProgress]);

  if (type === "skeleton") return <SkeletonScreen />;

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[999999] bg-[#020402] flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Loading 3D model"
    >
      {/* 3D Spinning DNA Helix Container */}
      <div className="dna-container">
        <div className="dna-helix">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="dna-rung"
              style={{
                top: `${i * 12}px`,
                transform: `rotateY(${i * 30}deg)`,
                animationDelay: `${i * -0.15}s`
              }}
            >
              <div className="dna-dot dot--left" />
              <div className="dna-bar" />
              <div className="dna-dot dot--right" />
            </div>
          ))}
        </div>
      </div>

      {/* Status text */}
      <p className="loading-text">
        LOADING 3D BIO-SYSTEMS...
      </p>

      {/* Progress bar */}
      <div className="w-[240px] h-1.5 rounded-full bg-[rgba(57,255,20,0.06)] border border-[rgba(57,255,20,0.15)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#39FF14] to-[#00D4AA] shadow-[0_0_12px_rgba(57,255,20,0.6)] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-accent)] font-mono font-bold">
        {Math.round(progress)}%
      </span>

      {/* Pulsing dots */}
      <div className="flex gap-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="pulse-dot w-2 h-2 rounded-full bg-[#39FF14]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      <style>{`
        .dna-container {
          width: 100px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 600px;
        }

        .dna-helix {
          position: relative;
          width: 80px;
          height: 144px;
          transform-style: preserve-3d;
          animation: spinHelix 6s linear infinite;
        }

        .dna-rung {
          position: absolute;
          left: 0;
          width: 100%;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform-style: preserve-3d;
        }

        .dna-bar {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, rgba(57,255,20,0.4) 0%, rgba(0,212,170,0.4) 100%);
        }

        .dna-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dna-dot.dot--left {
          background-color: #39FF14;
          box-shadow: 0 0 10px rgba(57,255,20,0.8);
        }

        .dna-dot.dot--right {
          background-color: #00D4AA;
          box-shadow: 0 0 10px rgba(0,212,170,0.8);
        }

        .loading-text {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--ds-accent, #39FF14);
          letter-spacing: 0.18em;
          text-shadow: 0 0 8px rgba(57,255,20,0.3);
          animation: textBlink 1.5s infinite alternate;
          margin: 0;
        }

        .pulse-dot {
          animation: pulseDot 1.2s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(57,255,20,0.4);
        }

        @keyframes spinHelix {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }

        @keyframes textBlink {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}

/* ─── Skeleton Screen ────────────────────────────────────── */

function SkeletonScreen() {
  return (
    <div className="w-full p-[40px_clamp(16px,5vw,48px)] box-border" role="status" aria-label="Loading content">
      {/* Fake heading */}
      <Skeleton variant="text" width="60%" height={32} className="mb-4" />
      {/* Fake paragraph lines */}
      <Skeleton variant="text" width="90%" height={14} className="mb-2.5" />
      <Skeleton variant="text" width="75%" height={14} className="mb-2.5" />
      <Skeleton variant="text" width="82%" height={14} className="mb-7" />
      {/* Fake card grid */}
      <GalleryGrid minItemWidth="200px" gap="16px">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={160} className="rounded-[var(--ds-radius-lg)]" />
        ))}
      </GalleryGrid>
    </div>
  );
}
