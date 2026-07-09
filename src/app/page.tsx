"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { PillBadge, GlowButton, GlassCard, GalleryGrid } from "@/components/ds";

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
    emoji: "🦁",
    title: "Rare Species",
    desc: "100 endangered creatures — from vaquita to axolotl — with interactive 3D models.",
    href: "/rare-species",
  },
  {
    emoji: "🌿",
    title: "Ecosystems",
    desc: "Dive into biomes — forests, oceans, deserts — with interactive food webs.",
    href: "/ecosystems",
  },
];

const MARQUEE_TEXT =
  "CELLS · DNA · MICROORGANISMS · VIRUSES · RARE SPECIES · ECOSYSTEMS · EVOLUTION · GENETICS · ORGANISMS · PHOTOSYNTHESIS · MITOSIS · RIBOSOMES · ";

/* ═══════════════════════════════════════════════════════════════
   ▸ 3-D  SCENE  COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Mouse-parallax camera rig ──────────────────────────────── */

function CameraRig() {
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

  useFrame(({ camera }) => {
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
    <div className="relative z-2 w-full overflow-hidden bg-[var(--ds-accent)] py-3.5" aria-hidden="true">
      <div className="flex w-max whitespace-nowrap animate-marquee">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="text-[length:var(--ds-text-sm)] font-bold text-[var(--ds-bg-primary)] tracking-[0.25em] pr-8">
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
    <GlassCard
      href={href}
      animate
      animationDelay={delay}
      className="p-[32px_28px] gap-2.5 hover:bg-[var(--ds-gradient-card-hover)] ds-card-group"
      ariaLabel={`Explore ${title}`}
    >
      <span className="text-[2.2rem] leading-none select-none">{emoji}</span>
      <h3 className="text-[length:var(--ds-text-lg)] font-bold text-[var(--ds-fg)] m-0">{title}</h3>
      <p className="text-[length:var(--ds-text-base)] text-[var(--ds-fg-muted)] leading-[1.55] m-0 flex-1">{desc}</p>
      <span className="inline-flex items-center gap-1.5 text-[length:var(--ds-text-sm)] font-semibold text-[var(--ds-accent)] mt-2 tracking-[0.04em] transition-[gap] duration-300 ds-card-group-hover:gap-3">
        Explore <span className="transition-transform duration-300 ds-card-group-hover:translate-x-1">→</span>
      </span>
    </GlassCard>
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
    <div className="relative w-full bg-[var(--ds-bg-primary)] overflow-x-hidden">
      {/* ────────────── 3D CANVAS (covers entire hero) ──────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
          className="pointer-events-auto"
        >
          <CameraRig />
          <Particles />
          <VolvoxSpheres />
        </Canvas>
      </div>

      {/* ────────────── HERO ────────────────────────────────── */}
      <section className="relative z-1 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center p-[0_24px_60px] gap-[22px]" aria-label="Hero">
        {/* Pill badge */}
        <div className={`transition-all duration-800 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3.5"}`}>
          <PillBadge pulseDot>
            INTERACTIVE 3D BIOLOGY
          </PillBadge>
        </div>

        {/* Title */}
        <h1 className={`m-0 text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-[0.06em] font-sans transition-all duration-1000 delay-150 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"}`}>
          <span className="text-white drop-shadow-[0_0_50px_rgba(57,255,20,0.12)]">BIO</span>
          <span className="text-transparent [-webkit-text-stroke:2px_var(--ds-accent)] filter drop-shadow-[0_0_24px_rgba(57,255,20,0.35)]">SPHERE</span>
        </h1>

        {/* Subtitle */}
        <p className={`max-w-[600px] m-0 text-[clamp(0.95rem,2.2vw,1.35rem)] font-normal text-[var(--ds-fg-muted)] tracking-[0.05em] leading-relaxed transition-all duration-900 delay-350 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          Explore life at every scale — from atoms to ecosystems, in stunning 3D
        </p>

        {/* CTA */}
        <div className={`flex gap-4 justify-center items-center transition-all duration-900 delay-500 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"}`}>
          <GlowButton href="/cell-explorer" ariaLabel="Enter the Cell Explorer">
            Enter the Cell →
          </GlowButton>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-[var(--ds-border-accent)] bg-[var(--ds-accent-faint)] text-[var(--ds-accent)] font-bold rounded-lg hover:bg-[var(--ds-accent-subtle)] transition-all flex items-center justify-center text-sm shadow-[var(--ds-glow-sm)] cursor-pointer decoration-none"
            style={{ textDecoration: "none" }}
          >
            Learning Dashboard 📊
          </Link>
        </div>

        {/* Scroll hint */}
        <button
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 bg-transparent border-none cursor-none min-h-11 transition-all duration-1000 delay-1000 ${mounted ? "opacity-50 translate-y-0 hover:opacity-90" : "opacity-0 translate-y-2.5"}`}
          onClick={scrollToFeatures}
          aria-label="Scroll to features"
        >
          <span className="text-[0.65rem] tracking-[0.2em] text-[var(--ds-fg-subtle)] uppercase">Scroll</span>
          <span className="text-[1.4rem] text-[var(--ds-accent)] ds-animate-bounce">⌄</span>
        </button>
      </section>

      {/* ────────────── FEATURES ────────────────────────────── */}
      <section className="relative z-2 bg-[var(--ds-bg-secondary)] p-[100px_clamp(16px,5vw,80px)_120px]" id="features" aria-label="Features">
        <h2 className="text-center text-[clamp(1.6rem,4vw,2.6rem)] font-bold text-[var(--ds-fg)] m-[0_0_56px] tracking-[0.04em]">
          Every chapter, alive in 3D
        </h2>

        <GalleryGrid minItemWidth="280px" gap="24px" className="max-w-[1100px] w-full">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.href} {...f} delay={100 + i * 80} />
          ))}
        </GalleryGrid>
      </section>

      {/* ────────────── MARQUEE ─────────────────────────────── */}
      <Marquee />

      {/* ────────────── SCOPED ANIMATIONS / BEHAVIOR ────────── */}
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeScroll 40s linear infinite;
        }
        .ds-card-group:hover .ds-card-group-hover\\:gap-3 {
          gap: 0.75rem;
        }
        .ds-card-group:hover .ds-card-group-hover\\:translate-x-1 {
          transform: translateX(0.25rem);
        }
      `}</style>
    </div>
  );
}
