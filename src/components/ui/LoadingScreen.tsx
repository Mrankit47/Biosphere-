"use client";

import { useEffect, useState } from "react";

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
    <div style={styles.overlay} role="status" aria-label="Loading 3D model">
      {/* DNA Helix */}
      <div style={styles.helixContainer}>
        <div className="dna-helix">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="dna-rung" style={{ animationDelay: `${i * 0.12}s` }}>
              <span className="dna-dot dna-dot--left" />
              <span className="dna-bar" />
              <span className="dna-dot dna-dot--right" />
            </div>
          ))}
        </div>
      </div>

      {/* Status text */}
      <p style={styles.label}>Loading 3D model…</p>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div
          style={{ ...styles.progressFill, width: `${progress}%` }}
        />
      </div>
      <span style={styles.progressText}>{Math.round(progress)}%</span>

      {/* Pulsing dots */}
      <div style={styles.dotsRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="pulse-dot"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      {/* Inline Styles (CSS animations) */}
      <style>{`
        /* ── DNA Helix ───────────────────────────────── */
        .dna-helix {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .dna-rung {
          display: flex;
          align-items: center;
          gap: 0;
          animation: dnaWave 1.8s ease-in-out infinite alternate;
        }

        .dna-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dna-dot--left {
          background: #39FF14;
          box-shadow: 0 0 10px rgba(57,255,20,0.7);
        }

        .dna-dot--right {
          background: #00D4AA;
          box-shadow: 0 0 10px rgba(0,212,170,0.7);
        }

        .dna-bar {
          width: 36px;
          height: 2px;
          background: linear-gradient(90deg, rgba(57,255,20,0.6), rgba(0,212,170,0.6));
          border-radius: 1px;
        }

        @keyframes dnaWave {
          0%   { transform: rotateY(0deg)   scaleX(1);   }
          50%  { transform: rotateY(90deg)  scaleX(0.3); }
          100% { transform: rotateY(180deg) scaleX(1);   }
        }

        /* ── Pulse Dots ──────────────────────────────── */
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #39FF14;
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
    <div style={styles.skeletonContainer} role="status" aria-label="Loading content">
      {/* Fake heading */}
      <div className="skeleton-box" style={{ width: "60%", height: 32, marginBottom: 16 }} />
      {/* Fake paragraph lines */}
      <div className="skeleton-box" style={{ width: "90%", height: 14, marginBottom: 10 }} />
      <div className="skeleton-box" style={{ width: "75%", height: 14, marginBottom: 10 }} />
      <div className="skeleton-box" style={{ width: "82%", height: 14, marginBottom: 28 }} />
      {/* Fake card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton-box" style={{ height: 160, borderRadius: 12 }} />
        ))}
      </div>

      <style>{`
        .skeleton-box {
          background: linear-gradient(
            90deg,
            rgba(57,255,20,0.04) 25%,
            rgba(57,255,20,0.09) 50%,
            rgba(57,255,20,0.04) 75%
          );
          background-size: 200% 100%;
          border-radius: 8px;
          animation: skeletonShimmer 1.6s ease-in-out infinite;
        }

        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#050A05",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  helixContainer: {
    perspective: 400,
    marginBottom: 8,
  },

  label: {
    fontSize: "1rem",
    color: "rgba(200,245,200,0.7)",
    letterSpacing: "0.08em",
    fontWeight: 500,
    margin: 0,
  },

  progressTrack: {
    width: "min(260px, 60vw)",
    height: 4,
    borderRadius: 2,
    background: "rgba(57,255,20,0.1)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
    background: "linear-gradient(90deg, #39FF14, #00D4AA)",
    boxShadow: "0 0 12px rgba(57,255,20,0.5)",
    transition: "width 0.3s ease",
  },

  progressText: {
    fontSize: "0.8rem",
    color: "rgba(57,255,20,0.6)",
    fontVariantNumeric: "tabular-nums",
  },

  dotsRow: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },

  skeletonContainer: {
    width: "100%",
    padding: "40px clamp(16px, 5vw, 48px)",
    boxSizing: "border-box",
  },
};
