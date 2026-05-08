"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";

/* ─── 3D Particle Field ─────────────────────────────────────── */

const PARTICLE_COUNT = 3000;

function Particles() {
  const meshRef = useRef<THREE.Points>(null!);

  // Pre-compute per-particle random offsets for organic sine-wave motion
  const { geometry, offsets } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const off = new Float32Array(PARTICLE_COUNT * 4); // speedX, speedY, ampX, ampY

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      // Spread particles across a large area
      pos[i3] = (Math.random() - 0.5) * 30;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;

      // Unique sine-wave parameters per particle
      off[i4] = 0.15 + Math.random() * 0.6;     // speedX
      off[i4 + 1] = 0.1 + Math.random() * 0.5;  // speedY
      off[i4 + 2] = 0.3 + Math.random() * 1.2;  // ampX
      off[i4 + 3] = 0.2 + Math.random() * 0.9;  // ampY
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geometry: geo, offsets: off };
  }, []);

  // Store original positions so we can oscillate around them
  const basePositions = useMemo(() => new Float32Array(geometry.attributes.position.array as Float32Array), [geometry]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const geo = meshRef.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      const sX = offsets[i4];
      const sY = offsets[i4 + 1];
      const aX = offsets[i4 + 2];
      const aY = offsets[i4 + 3];

      posArr[i3] = basePositions[i3] + Math.sin(t * sX + i) * aX;
      posArr[i3 + 1] = basePositions[i3 + 1] + Math.cos(t * sY + i * 0.5) * aY;
      posArr[i3 + 2] = basePositions[i3 + 2] + Math.sin(t * 0.2 + i * 0.3) * 0.4;
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color="#39FF14"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Marquee Strip ──────────────────────────────────────────── */

const MARQUEE_TEXT =
  "CELLS · DNA · MICROORGANISMS · ECOSYSTEMS · EVOLUTION · GENETICS · ORGANISMS · ";

function Marquee() {
  return (
    <div style={styles.marqueeWrapper}>
      <div style={styles.marqueeTrack}>
        {/* Duplicate text for seamless loop */}
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={styles.marqueeSegment}>
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Page Component ─────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div style={styles.root}>
      {/* Three.js Canvas — behind everything */}
      <div style={styles.canvasContainer}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Particles />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div style={styles.hero}>
        <h1 style={styles.title} className="hero-fade-in">
          BIOSPHERE
        </h1>
        <p style={styles.subtitle} className="hero-fade-in hero-delay-1">
          Explore life at every scale
        </p>
        <Link href="/cell-explorer" className="hero-fade-in hero-delay-2">
          <span style={styles.ctaButton}>
            Begin Exploring →
          </span>
        </Link>
      </div>

      {/* Bottom Marquee */}
      <Marquee />

      {/* Inline CSS for fade-in animation & marquee scroll */}
      <style>{`
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-fade-in {
          opacity: 0;
          animation: heroFadeIn 1s ease-out forwards;
          animation-delay: 0.5s;
        }

        .hero-delay-1 {
          animation-delay: 1s;
        }

        .hero-delay-2 {
          animation-delay: 1.5s;
        }

        @keyframes marqueeScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
    minHeight: "calc(100vh - 64px)",
    background: "#050A05",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  canvasContainer: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },

  hero: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 24px",
    gap: "20px",
  },

  title: {
    fontSize: "clamp(3rem, 10vw, 8rem)",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "0.25em",
    lineHeight: 1.1,
    textShadow:
      "0 0 60px rgba(57,255,20,0.15), 0 0 120px rgba(57,255,20,0.08)",
    margin: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  subtitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
    color: "#5DCAA5",
    fontWeight: 400,
    margin: 0,
    letterSpacing: "0.12em",
  },

  ctaButton: {
    display: "inline-block",
    padding: "14px 40px",
    borderRadius: "999px",
    border: "1.5px solid #39FF14",
    color: "#39FF14",
    fontSize: "1rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    background: "rgba(57, 255, 20, 0.06)",
    boxShadow:
      "0 0 20px rgba(57,255,20,0.15), 0 0 60px rgba(57,255,20,0.08), inset 0 0 20px rgba(57,255,20,0.05)",
    cursor: "none",
    transition: "all 0.35s ease",
    // Hover handled via CSS below — but inline gives the base
  },

  marqueeWrapper: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    overflow: "hidden",
    borderTop: "1px solid rgba(57, 255, 20, 0.08)",
    padding: "12px 0",
  },

  marqueeTrack: {
    display: "flex",
    width: "max-content",
    animation: "marqueeScroll 30s linear infinite",
    whiteSpace: "nowrap" as const,
  },

  marqueeSegment: {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "rgba(57, 255, 20, 0.4)",
    letterSpacing: "0.3em",
    paddingRight: "2rem",
  },
};
