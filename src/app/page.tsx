"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   ▸ CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 2500;
const SPHERE_COUNT = 12;
const BOUNDS = { x: 18, y: 12, z: 10 };

const FEATURES = [
  {
    emoji: "🔬",
    title: "Cell Explorer",
    desc: "Zoom into living cells and explore organelles in full 3D detail.",
    href: "/cell-explorer",
  },
  {
    emoji: "🦠",
    title: "Microbe Zoo",
    desc: "Volvox · E.coli · Amoeba — the microscopic world comes alive.",
    href: "/microorganisms",
  },
  {
    emoji: "🧬",
    title: "DNA & Genetics",
    desc: "Watch the double helix twist, unzip, and replicate before your eyes.",
    href: "/dna-genetics",
  },
  {
    emoji: "🌳",
    title: "Tree of Life",
    desc: "All species, one map — navigate 3.8 billion years of evolution.",
    href: "/tree-of-life",
  },
  {
    emoji: "🫀",
    title: "Human Body",
    desc: "Every system in 3D — skeletal, muscular, circulatory and more.",
    href: "/human-body",
  },
  {
    emoji: "⚡",
    title: "Quiz",
    desc: "Test your knowledge with dynamic, randomized biology challenges.",
    href: "/quiz",
  },
  {
    emoji: "☣️",
    title: "Viruses",
    desc: "Explore SARS-CoV-2, HIV, Ebola and more — 3D structure to pandemic history.",
    href: "/viruses",
  },
  {
    emoji: "🌿",
    title: "Ecosystems",
    desc: "Dive into biomes — forests, oceans, deserts — with interactive food webs.",
    href: "/ecosystems",
  },
];

const MARQUEE_TEXT =
  "CELLS · DNA · MICROORGANISMS · VIRUSES · ECOSYSTEMS · EVOLUTION · GENETICS · ORGANISMS · PHOTOSYNTHESIS · MITOSIS · RIBOSOMES · ";

/* ═══════════════════════════════════════════════════════════════
   ▸ 3-D  SCENE  COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Mouse-parallax camera rig ──────────────────────────────── */

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x * 1.2 - target.current.x) * 0.04;
    target.current.y += (-mouse.current.y * 0.8 - target.current.y) * 0.04;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Swimming particles ─────────────────────────────────────── */

function Particles() {
  const ref = useRef<THREE.Points>(null!);

  const { geometry, params } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const prm = new Float32Array(PARTICLE_COUNT * 6); // spdX spdY ampX ampY phase driftZ

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const i6 = i * 6;
      pos[i3] = (Math.random() - 0.5) * BOUNDS.x * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 2;
      pos[i3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 2;

      prm[i6] = 0.12 + Math.random() * 0.55;       // speedX
      prm[i6 + 1] = 0.08 + Math.random() * 0.45;   // speedY
      prm[i6 + 2] = 0.2 + Math.random() * 1.4;     // ampX
      prm[i6 + 3] = 0.15 + Math.random() * 1.0;    // ampY
      prm[i6 + 4] = Math.random() * Math.PI * 2;    // phase
      prm[i6 + 5] = (Math.random() - 0.5) * 0.02;  // driftZ
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geometry: geo, params: prm };
  }, []);

  const base = useMemo(
    () => new Float32Array(geometry.attributes.position.array as Float32Array),
    [geometry]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const i6 = i * 6;

      const sX = params[i6];
      const sY = params[i6 + 1];
      const aX = params[i6 + 2];
      const aY = params[i6 + 3];
      const ph = params[i6 + 4];
      const dZ = params[i6 + 5];

      let x = base[i3] + Math.sin(t * sX + ph + i * 0.7) * aX;
      let y = base[i3 + 1] + Math.cos(t * sY + ph + i * 0.3) * aY;
      let z = base[i3 + 2] + t * dZ;

      // Wrap around bounds
      if (x > BOUNDS.x) x -= BOUNDS.x * 2;
      if (x < -BOUNDS.x) x += BOUNDS.x * 2;
      if (y > BOUNDS.y) y -= BOUNDS.y * 2;
      if (y < -BOUNDS.y) y += BOUNDS.y * 2;
      if (z > BOUNDS.z) z -= BOUNDS.z * 2;
      if (z < -BOUNDS.z) z += BOUNDS.z * 2;

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#39FF14"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Floating wireframe Volvox spheres ──────────────────────── */

interface SphereData {
  pos: [number, number, number];
  radius: number;
  speed: number;
  phase: number;
}

function VolvoxSpheres() {
  const groupRef = useRef<THREE.Group>(null!);

  const spheres: SphereData[] = useMemo(
    () =>
      Array.from({ length: SPHERE_COUNT }, () => ({
        pos: [
          (Math.random() - 0.5) * 28,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 14,
        ] as [number, number, number],
        radius: 0.6 + Math.random() * 1.8,
        speed: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, idx) => {
      const s = spheres[idx];
      child.position.x = s.pos[0] + Math.sin(t * s.speed + s.phase) * 1.5;
      child.position.y =
        s.pos[1] + Math.cos(t * s.speed * 0.8 + s.phase) * 1.2;
      child.rotation.x = t * s.speed * 0.3;
      child.rotation.y = t * s.speed * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <icosahedronGeometry args={[s.radius, 1]} />
          <meshBasicMaterial
            color="#39FF14"
            wireframe
            transparent
            opacity={0.06 + Math.random() * 0.04}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ▸ MARQUEE
   ═══════════════════════════════════════════════════════════════ */

function Marquee() {
  return (
    <div className="hp-marquee-strip" aria-hidden="true">
      <div className="hp-marquee-track">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="hp-marquee-seg">
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ▸ FEATURE CARD
   ═══════════════════════════════════════════════════════════════ */

function FeatureCard({
  emoji,
  title,
  desc,
  href,
  delay,
}: {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      className="hp-card"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`Explore ${title}`}
    >
      <span className="hp-card-emoji">{emoji}</span>
      <h3 className="hp-card-title">{title}</h3>
      <p className="hp-card-desc">{desc}</p>
      <span className="hp-card-link">
        Explore <span className="hp-card-arrow">→</span>
      </span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ▸ PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so CSS transitions have the "from" state applied first
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Smooth scroll to features section */
  const scrollToFeatures = useCallback(() => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="hp-root">
      {/* ────────────── 3D CANVAS (covers entire hero) ──────── */}
      <div className="hp-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
        >
          <CameraRig />
          <Particles />
          <VolvoxSpheres />
        </Canvas>
      </div>

      {/* ────────────── HERO ────────────────────────────────── */}
      <section className="hp-hero" aria-label="Hero">
        {/* Pill badge */}
        <span className={`hp-pill ${mounted ? "show" : ""}`}>
          <span className="hp-pill-dot" />
          INTERACTIVE 3D BIOLOGY
        </span>

        {/* Title */}
        <h1 className={`hp-title ${mounted ? "show" : ""}`}>
          <span className="hp-title-bio">BIO</span>
          <span className="hp-title-sphere">SPHERE</span>
        </h1>

        {/* Subtitle */}
        <p className={`hp-subtitle ${mounted ? "show" : ""}`}>
          Explore life at every scale — from atoms to ecosystems, in stunning 3D
        </p>

        {/* CTA */}
        <Link
          href="/cell-explorer"
          className={`hp-cta ${mounted ? "show" : ""}`}
          aria-label="Enter the Cell Explorer"
        >
          Enter the Cell →
        </Link>

        {/* Scroll hint */}
        <button
          className={`hp-scroll-hint ${mounted ? "show" : ""}`}
          onClick={scrollToFeatures}
          aria-label="Scroll to features"
        >
          <span className="hp-scroll-label">Scroll</span>
          <span className="hp-scroll-arrow">⌄</span>
        </button>
      </section>

      {/* ────────────── FEATURES ────────────────────────────── */}
      <section className="hp-features" id="features" aria-label="Features">
        <h2 className="hp-features-heading">Every chapter, alive in 3D</h2>

        <div className="hp-grid feature-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.href} {...f} delay={100 + i * 80} />
          ))}
        </div>
      </section>

      {/* ────────────── MARQUEE ─────────────────────────────── */}
      <Marquee />

      {/* ────────────── SCOPED STYLES ──────────────────────── */}
      <style>{`
        /* ============================
           ROOT
           ============================ */
        .hp-root {
          position: relative;
          width: 100%;
          background: #050A05;
          overflow-x: hidden;
        }

        /* ============================
           3-D CANVAS
           ============================ */
        .hp-canvas-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .hp-canvas-wrap canvas {
          pointer-events: auto;
        }

        /* ============================
           HERO
           ============================ */
        .hp-hero {
          position: relative;
          z-index: 1;
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px 60px;
          gap: 22px;
        }

        /* -- Pill badge -- */
        .hp-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          border: 1px solid rgba(57,255,20,0.25);
          background: rgba(57,255,20,0.06);
          color: #39FF14;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .hp-pill.show {
          opacity: 1;
          transform: translateY(0);
        }
        .hp-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #39FF14;
          box-shadow: 0 0 8px #39FF14;
          animation: pillPulse 2s ease-in-out infinite;
        }
        @keyframes pillPulse {
          0%, 100% { opacity: 1;   box-shadow: 0 0 8px #39FF14; }
          50%      { opacity: 0.4; box-shadow: 0 0 2px #39FF14; }
        }

        /* -- Title -- */
        .hp-title {
          margin: 0;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.06em;
          font-family: system-ui, -apple-system, sans-serif;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease 0.15s, transform 1s ease 0.15s;
        }
        .hp-title.show {
          opacity: 1;
          transform: translateY(0);
        }
        .hp-title-bio {
          color: #ffffff;
          text-shadow: 0 0 50px rgba(57,255,20,0.12);
        }
        .hp-title-sphere {
          color: transparent;
          -webkit-text-stroke: 2px #39FF14;
          filter: drop-shadow(0 0 24px rgba(57,255,20,0.35));
        }

        /* -- Subtitle -- */
        .hp-subtitle {
          max-width: 600px;
          margin: 0;
          font-size: clamp(0.95rem, 2.2vw, 1.35rem);
          font-weight: 400;
          color: rgba(200,245,200,0.6);
          letter-spacing: 0.05em;
          line-height: 1.6;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s;
        }
        .hp-subtitle.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* -- CTA Button -- */
        .hp-cta {
          display: inline-block;
          padding: 16px 48px;
          border-radius: 999px;
          border: 1.5px solid #39FF14;
          color: #39FF14;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-decoration: none;
          cursor: none;
          background: rgba(57,255,20,0.07);
          box-shadow:
            0 0 24px rgba(57,255,20,0.18),
            0 0 60px rgba(57,255,20,0.08),
            inset 0 0 24px rgba(57,255,20,0.06);
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 0.9s ease 0.55s,
            transform 0.9s ease 0.55s,
            background 0.35s ease,
            box-shadow 0.35s ease;
        }
        .hp-cta.show {
          opacity: 1;
          transform: translateY(0);
        }
        .hp-cta:hover {
          background: rgba(57,255,20,0.18);
          box-shadow:
            0 0 36px rgba(57,255,20,0.3),
            0 0 80px rgba(57,255,20,0.14),
            inset 0 0 30px rgba(57,255,20,0.1);
        }

        /* -- Scroll hint -- */
        .hp-scroll-hint {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: none;
          opacity: 0;
          transition: opacity 1s ease 1s, transform 1s ease 1s;
          min-height: 44px;
        }
        .hp-scroll-hint.show {
          opacity: 0.5;
          transform: translateX(-50%) translateY(0);
        }
        .hp-scroll-hint:hover {
          opacity: 0.9;
        }
        .hp-scroll-label {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: rgba(200,245,200,0.5);
          text-transform: uppercase;
        }
        .hp-scroll-arrow {
          font-size: 1.4rem;
          color: #39FF14;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }

        /* ============================
           FEATURES SECTION
           ============================ */
        .hp-features {
          position: relative;
          z-index: 2;
          background: #0A1410;
          padding: 100px clamp(16px, 5vw, 80px) 120px;
        }

        .hp-features-heading {
          text-align: center;
          font-size: clamp(1.6rem, 4vw, 2.6rem);
          font-weight: 700;
          color: #C8F5C8;
          margin: 0 0 56px;
          letter-spacing: 0.04em;
        }

        .hp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* -- Card -- */
        .hp-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 32px 28px;
          border-radius: 18px;
          border: 1px solid rgba(57,255,20,0.12);
          background: rgba(10,20,10,0.65);
          backdrop-filter: blur(8px);
          text-decoration: none;
          cursor: none;
          transition:
            transform 0.35s cubic-bezier(.25,.8,.25,1),
            border-color 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease;
          animation: cardReveal 0.7s ease both;
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hp-card:hover {
          transform: scale(1.05);
          border-color: rgba(57,255,20,0.45);
          background: linear-gradient(
            160deg,
            rgba(57,255,20,0.08) 0%,
            rgba(10,30,15,0.9) 100%
          );
          box-shadow: 0 0 40px rgba(57,255,20,0.08);
        }

        .hp-card-emoji {
          font-size: 2.2rem;
          line-height: 1;
        }

        .hp-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #C8F5C8;
          margin: 4px 0 0;
        }

        .hp-card-desc {
          font-size: 0.88rem;
          color: rgba(200,245,200,0.5);
          line-height: 1.55;
          margin: 0;
          flex: 1;
        }

        .hp-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #39FF14;
          margin-top: 8px;
          letter-spacing: 0.04em;
          transition: gap 0.3s ease;
        }
        .hp-card:hover .hp-card-link {
          gap: 12px;
        }
        .hp-card-arrow {
          transition: transform 0.3s ease;
        }
        .hp-card:hover .hp-card-arrow {
          transform: translateX(4px);
        }

        /* ============================
           MARQUEE
           ============================ */
        .hp-marquee-strip {
          position: relative;
          z-index: 2;
          width: 100%;
          overflow: hidden;
          background: #39FF14;
          padding: 14px 0;
        }

        .hp-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 40s linear infinite;
          white-space: nowrap;
        }

        .hp-marquee-seg {
          font-size: 0.8rem;
          font-weight: 700;
          color: #050A05;
          letter-spacing: 0.25em;
          padding-right: 2rem;
        }

        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ============================
           RESPONSIVE
           ============================ */
        @media (max-width: 900px) {
          .hp-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .hp-hero {
            padding-bottom: 80px;
          }
          .hp-title-sphere {
            -webkit-text-stroke-width: 1.5px;
          }
          .hp-cta {
            padding: 14px 36px;
            font-size: 0.95rem;
          }
          .hp-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px;
          }
          .hp-card {
            padding: 24px 20px;
          }
        }

        @media (max-width: 480px) {
          .hp-grid {
            grid-template-columns: 1fr !important;
          }
          .hp-features {
            padding: 64px 16px 80px;
          }
        }
      `}</style>
    </div>
  );
}
