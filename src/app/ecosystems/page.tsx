"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════════
   BIOME DATA
   ══════════════════════════════════════════════════════════════ */

interface BiomeInfo {
  name: string;
  emoji: string;
  color: string;
  description: string;
  keySpecies: string[];
  funFact: string;
  stats: { label: string; value: string }[];
}

const BIOME_DATA: Record<string, BiomeInfo> = {
  rainforest: {
    name: "Tropical Rainforest",
    emoji: "🌴",
    color: "#39FF14",
    description:
      "Dense, warm forests near the equator receiving over 200cm of rainfall annually. Home to 50% of all known species despite covering only 6% of Earth's surface.",
    keySpecies: ["Jaguar", "Toucan", "Poison Dart Frog", "Orchids"],
    funFact:
      "A single hectare of rainforest can contain over 750 species of trees and 1,500 species of plants!",
    stats: [
      { label: "Biodiversity", value: "50% of species" },
      { label: "Rainfall", value: ">200cm/year" },
      { label: "Temperature", value: "25-28°C" },
    ],
  },
  coral: {
    name: "Coral Reef",
    emoji: "🪸",
    color: "#378ADD",
    description:
      'Called the "Rainforests of the Sea," coral reefs support 25% of all marine species. Built by tiny coral polyps over thousands of years.',
    keySpecies: ["Clownfish", "Sea Turtle", "Manta Ray", "Coral Polyps"],
    funFact:
      "The Great Barrier Reef is so large it can be seen from space — stretching over 2,300 km!",
    stats: [
      { label: "Marine Life", value: "25% of species" },
      { label: "Coverage", value: "<1% of ocean" },
      { label: "Age", value: "Up to 10,000 yrs" },
    ],
  },
  savanna: {
    name: "Savanna",
    emoji: "🦁",
    color: "#EF9F27",
    description:
      "Tropical grasslands with scattered trees, shaped by seasonal fires and wet-dry cycles. Supports the largest land migrations on Earth.",
    keySpecies: ["Lion", "Elephant", "Zebra", "Acacia Trees"],
    funFact:
      "The Serengeti migration involves 1.5 million wildebeest traveling 800 km annually — the largest terrestrial migration!",
    stats: [
      { label: "Coverage", value: "20% of land" },
      { label: "Rainfall", value: "50-130cm/year" },
      { label: "Fire Cycle", value: "Every 1-5 yrs" },
    ],
  },
  tundra: {
    name: "Tundra",
    emoji: "🏔️",
    color: "#5AAFFF",
    description:
      "Earth's coldest biome with permafrost, extreme winds, and minimal vegetation. Found in Arctic regions and high mountain tops.",
    keySpecies: ["Arctic Fox", "Polar Bear", "Caribou", "Lichen"],
    funFact:
      "Tundra permafrost stores twice as much carbon as the entire atmosphere — a climate time bomb if it melts!",
    stats: [
      { label: "Temperature", value: "-34 to 12°C" },
      { label: "Growing Season", value: "50-60 days" },
      { label: "Precipitation", value: "15-25cm/year" },
    ],
  },
  desert: {
    name: "Desert",
    emoji: "🏜️",
    color: "#E24B4A",
    description:
      "Arid regions receiving less than 25cm of rainfall per year. Life here has evolved incredible adaptations to survive extreme heat and water scarcity.",
    keySpecies: ["Camel", "Fennec Fox", "Saguaro Cactus", "Sidewinder"],
    funFact:
      "The Sahara Desert was once green! Just 6,000 years ago it had lakes, rivers, and lush vegetation.",
    stats: [
      { label: "Coverage", value: "33% of land" },
      { label: "Rainfall", value: "<25cm/year" },
      { label: "Temp Range", value: "-10 to 58°C" },
    ],
  },
  ocean: {
    name: "Deep Ocean",
    emoji: "🌊",
    color: "#9B59B6",
    description:
      "The largest habitat on Earth — the deep ocean below 200m is a world of darkness, extreme pressure, and bioluminescent life near hydrothermal vents.",
    keySpecies: ["Anglerfish", "Giant Squid", "Tube Worms", "Bioluminescent Jellyfish"],
    funFact:
      "Over 80% of the ocean floor remains unmapped — we know more about the surface of Mars than our own deep oceans!",
    stats: [
      { label: "Coverage", value: "71% of Earth" },
      { label: "Avg Depth", value: "3,688m" },
      { label: "Explored", value: "<20%" },
    ],
  },
};

const BIOME_KEYS = Object.keys(BIOME_DATA);

/* ══════════════════════════════════════════════════════════════
   3D GLOBE (wireframe sphere)
   ══════════════════════════════════════════════════════════════ */

function Globe({ activeBiome }: { activeBiome: string | null }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.1;
  });

  return (
    <group ref={ref}>
      {/* Solid inner glow */}
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshStandardMaterial
          color="#0a1f0a"
          emissive="#39FF14"
          emissiveIntensity={0.05}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={activeBiome ? BIOME_DATA[activeBiome].color : "#39FF14"}
          wireframe
          transparent
          opacity={activeBiome ? 0.3 : 0.15}
        />
      </mesh>
      {/* Outer atmosphere */}
      <mesh>
        <sphereGeometry args={[2.15, 24, 24]} />
        <meshBasicMaterial
          color="#39FF14"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   BIOME NODES (orbiting hotspots)
   ══════════════════════════════════════════════════════════════ */

const NODE_POSITIONS: [number, number, number][] = [
  [2.8, 1.0, 0.5],
  [-2.5, 0.3, 1.8],
  [1.0, -2.2, 1.6],
  [-1.5, 2.3, -1.0],
  [2.2, -0.8, -1.8],
  [-0.5, -1.5, -2.5],
];

function BiomeNodes({
  activeBiome,
  onSelect,
}: {
  activeBiome: string | null;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y =
        NODE_POSITIONS[i][1] + Math.sin(t * 0.4 + i * 1.2) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {BIOME_KEYS.map((id, i) => {
        const biome = BIOME_DATA[id];
        const isActive = activeBiome === id;
        return (
          <mesh
            key={id}
            position={NODE_POSITIONS[i]}
            onClick={() => onSelect(id)}
          >
            <sphereGeometry args={[isActive ? 0.22 : 0.16, 16, 16]} />
            <meshStandardMaterial
              color={biome.color}
              emissive={biome.color}
              emissiveIntensity={isActive ? 2 : 0.6}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   AMBIENT PARTICLES
   ══════════════════════════════════════════════════════════════ */

const P_COUNT = 1500;

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const { geo, offs, base } = useMemo(() => {
    const pos = new Float32Array(P_COUNT * 3);
    const off = new Float32Array(P_COUNT * 4);
    for (let i = 0; i < P_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      off[i * 4] = 0.1 + Math.random() * 0.3;
      off[i * 4 + 1] = 0.08 + Math.random() * 0.25;
      off[i * 4 + 2] = 0.15 + Math.random() * 0.6;
      off[i * 4 + 3] = 0.1 + Math.random() * 0.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo: g, offs: off, base: new Float32Array(pos) };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < P_COUNT; i++) {
      const i3 = i * 3,
        i4 = i * 4;
      arr[i3] = base[i3] + Math.sin(t * offs[i4] + i) * offs[i4 + 2];
      arr[i3 + 1] =
        base[i3 + 1] +
        Math.cos(t * offs[i4 + 1] + i * 0.5) * offs[i4 + 3];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#39FF14"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   3D SCENE
   ══════════════════════════════════════════════════════════════ */

function EcoScene({
  activeBiome,
  onSelect,
}: {
  activeBiome: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-4, -3, 3]} intensity={0.5} color="#39FF14" />
      <Particles />
      <Globe activeBiome={activeBiome} />
      <BiomeNodes activeBiome={activeBiome} onSelect={onSelect} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={14}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */

export default function EcosystemsPage() {
  const [activeBiome, setActiveBiome] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const handleSelect = useCallback(
    (id: string) => {
      if (activeBiome === id) {
        setActiveBiome(null);
        setPanelVisible(false);
        return;
      }
      setActiveBiome(id);
      setPanelVisible(true);
    },
    [activeBiome]
  );

  const info = activeBiome ? BIOME_DATA[activeBiome] : null;

  return (
    <div style={S.root}>
      {/* ── 3D Canvas ──────────────────────────────────── */}
      <div style={S.canvasWrap}>
        <Canvas
          camera={{ position: [0, 1, 7], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          style={{ background: "#050A05" }}
        >
          <EcoScene activeBiome={activeBiome} onSelect={handleSelect} />
        </Canvas>
      </div>

      {/* ── Back Link ──────────────────────────────────── */}
      <Link href="/" style={S.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Home</span>
      </Link>

      {/* ── Page Title ─────────────────────────────────── */}
      <div style={S.pageTitle}>
        <h1 style={S.titleText}>Ecosystems</h1>
        <p style={S.titleSub}>Discover Interconnected Life</p>
      </div>

      {/* ── Hint ───────────────────────────────────────── */}
      {!panelVisible && (
        <div style={S.hint} className="eco-hint">
          <div style={S.hintPulse} />
          Click any biome node to explore
        </div>
      )}

      {/* ── Legend (bottom-left) ────────────────────────── */}
      <div style={S.legend}>
        {BIOME_KEYS.map((id) => {
          const b = BIOME_DATA[id];
          return (
            <button
              key={id}
              style={{
                ...S.legendItem,
                borderColor:
                  activeBiome === id
                    ? b.color
                    : "rgba(255,255,255,0.08)",
                background:
                  activeBiome === id
                    ? `${b.color}15`
                    : "rgba(5,10,5,0.6)",
              }}
              onClick={() => handleSelect(id)}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: b.color,
                  display: "inline-block",
                  boxShadow: `0 0 6px ${b.color}80`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>
                {b.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Info Panel (right side) ────────────────────── */}
      <div
        style={{
          ...S.panel,
          transform: panelVisible ? "translateX(0)" : "translateX(110%)",
          opacity: panelVisible ? 1 : 0,
        }}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {info && (
          <>
            {/* Close */}
            <button
              style={S.panelClose}
              onClick={() => {
                setPanelVisible(false);
                setActiveBiome(null);
              }}
            >
              ✕
            </button>

            {/* Emoji badge */}
            <div
              style={{
                ...S.panelEmoji,
                background: `${info.color}18`,
                borderColor: `${info.color}40`,
              }}
            >
              {info.emoji}
            </div>

            {/* Name */}
            <h2 style={{ ...S.panelName, color: info.color }}>
              {info.name}
            </h2>

            {/* Divider */}
            <div
              style={{
                width: "40px",
                height: "2px",
                background: info.color,
                borderRadius: "1px",
                margin: "0 auto 16px",
                boxShadow: `0 0 10px ${info.color}60`,
              }}
            />

            {/* Description */}
            <div style={S.panelSection}>
              <span style={S.panelLabel}>Overview</span>
              <p style={S.panelText}>{info.description}</p>
            </div>

            {/* Stats */}
            <div style={S.panelStatsGrid}>
              {info.stats.map((s, i) => (
                <div key={i} style={S.panelStat}>
                  <span style={S.panelLabel}>{s.label}</span>
                  <span style={{ color: info.color, fontWeight: 700, fontSize: "0.95rem" }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Species */}
            <div style={S.panelSection}>
              <span style={S.panelLabel}>Key Species</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {info.keySpecies.map((sp, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: `${info.color}12`,
                      border: `1px solid ${info.color}30`,
                      fontSize: "0.78rem",
                      color: "rgba(200,245,200,0.8)",
                    }}
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div style={S.panelFact}>
              <span style={S.panelFactIcon}>💡</span>
              <div>
                <span style={S.panelLabel}>Fun Fact</span>
                <p style={{ ...S.panelText, marginTop: "4px" }}>
                  {info.funFact}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Animations ─────────────────────────────────── */}
      <style>{`
        @keyframes hintPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes hintFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .eco-hint {
          animation: hintFadeIn 0.8s ease-out both 1s;
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════ */

const S: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
    height: "calc(100vh - 64px)",
    background: "#050A05",
    overflow: "hidden",
  },

  canvasWrap: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },

  backLink: {
    position: "absolute",
    top: "20px",
    left: "24px",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(200,245,200,0.7)",
    fontSize: "0.85rem",
    textDecoration: "none",
    cursor: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    background: "rgba(5,10,5,0.5)",
    border: "1px solid rgba(57,255,20,0.1)",
    backdropFilter: "blur(8px)",
    transition: "all 0.25s ease",
  },

  pageTitle: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    textAlign: "center",
    pointerEvents: "none",
  },

  titleText: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#39FF14",
    letterSpacing: "0.08em",
    margin: 0,
    textShadow: "0 0 20px rgba(57,255,20,0.3)",
  },

  titleSub: {
    fontSize: "0.75rem",
    color: "rgba(200,245,200,0.5)",
    margin: "2px 0 0",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
  },

  hint: {
    position: "absolute",
    bottom: "32px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    color: "rgba(57,255,20,0.6)",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },

  hintPulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#39FF14",
    boxShadow: "0 0 8px #39FF14",
    animation: "hintPulse 2s ease-in-out infinite",
  },

  legend: {
    position: "absolute",
    bottom: "28px",
    left: "24px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#C8F5C8",
    cursor: "none",
    transition: "all 0.25s ease",
    backdropFilter: "blur(6px)",
    fontFamily: "inherit",
  },

  panel: {
    position: "absolute",
    top: "0",
    right: "0",
    width: "min(360px, 85vw)",
    height: "100%",
    zIndex: 20,
    background: "rgba(5, 10, 5, 0.88)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderLeft: "1px solid rgba(57,255,20,0.1)",
    padding: "48px 28px 28px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    transition:
      "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease",
    overflowY: "auto",
  },

  panelClose: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    color: "rgba(200,245,200,0.5)",
    fontSize: "1.1rem",
    cursor: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "color 0.2s ease",
    fontFamily: "inherit",
  },

  panelEmoji: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    marginBottom: "4px",
  },

  panelName: {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    margin: 0,
    textAlign: "center",
  },

  panelSection: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  panelLabel: {
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "rgba(200,245,200,0.45)",
  },

  panelText: {
    fontSize: "0.88rem",
    lineHeight: 1.6,
    color: "rgba(200,245,200,0.85)",
    margin: "6px 0 0",
  },

  panelStatsGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "6px",
  },

  panelStat: {
    padding: "10px 8px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    textAlign: "center",
  },

  panelFact: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(57,255,20,0.04)",
    border: "1px solid rgba(57,255,20,0.08)",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },

  panelFactIcon: {
    fontSize: "1.2rem",
    flexShrink: 0,
    marginTop: "2px",
  },
};
