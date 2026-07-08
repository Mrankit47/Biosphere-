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
      className="fixed inset-0 z-[var(--ds-z-cursor)] bg-[var(--ds-bg-primary)] flex flex-col items-center justify-center gap-5"
      role="status"
      aria-label="Loading 3D model"
    >
      {/* DNA Helix */}
      <div className="perspective-[400px] mb-2">
        <div className="dna-helix flex flex-col items-center gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="dna-rung flex items-center gap-0"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="dna-dot dna-dot--left w-2.5 h-2.5 rounded-full shrink-0 bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.7)]" />
              <span className="dna-bar w-9 h-[2px] bg-gradient-to-r from-[rgba(57,255,20,0.6)] to-[rgba(0,212,170,0.6)] rounded-[1px]" />
              <span className="dna-dot dna-dot--right w-2.5 h-2.5 rounded-full shrink-0 bg-[#00D4AA] shadow-[0_0_10px_rgba(0,212,170,0.7)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Status text */}
      <p className="text-[length:var(--ds-text-base)] text-[var(--ds-fg-muted)] tracking-[0.08em] font-medium m-0">
        Loading 3D model…
      </p>

      {/* Progress bar */}
      <div className="w-[min(260px,60vw)] h-1 rounded-[var(--ds-radius-sm)] bg-[rgba(57,255,20,0.1)] overflow-hidden">
        <div
          className="h-full rounded-[var(--ds-radius-sm)] bg-gradient-to-r from-[#39FF14] to-[#00D4AA] shadow-[0_0_12px_rgba(57,255,20,0.5)] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[length:var(--ds-text-sm)] text-[var(--ds-accent-muted)] font-mono">
        {Math.round(progress)}%
      </span>

      {/* Pulsing dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="pulse-dot w-2 h-2 rounded-full bg-[#39FF14]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      {/* Inline Styles (CSS animations) */}
      <style>{`
        .dna-rung {
          animation: dnaWave 1.8s ease-in-out infinite alternate;
        }

        @keyframes dnaWave {
          0%   { transform: rotateY(0deg)   scaleX(1);   }
          50%  { transform: rotateY(90deg)  scaleX(0.3); }
          100% { transform: rotateY(180deg) scaleX(1);   }
        }

        .pulse-dot {
          animation: pulseDot 1.2s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.3); }
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
