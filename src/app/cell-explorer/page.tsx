"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import gsap from "gsap";

/* ══════════════════════════════════════════════════════════════
   ORGANELLE DATA
   ══════════════════════════════════════════════════════════════ */

interface OrganelleInfo {
  name: string;
  description: string;
  funFact: string;
  color: string;
  emoji: string;
}

const ORGANELLE_DATA: Record<string, OrganelleInfo> = {
  nucleus: {
    name: "Nucleus",
    description:
      "Control center of the cell. Contains DNA and controls all cell activities.",
    funFact:
      "The nucleus contains about 6 feet (2 meters) of DNA packed into a space just 6 micrometers across!",
    color: "#378ADD",
    emoji: "🧠",
  },
  mitochondria: {
    name: "Mitochondria",
    description:
      "Powerhouse of the cell. Produces ATP energy through cellular respiration.",
    funFact:
      "Mitochondria have their own DNA and are believed to have once been independent bacteria!",
    color: "#1D9E75",
    emoji: "⚡",
  },
  ribosome: {
    name: "Ribosome",
    description:
      "Protein factory. Reads mRNA and builds proteins the cell needs.",
    funFact:
      "A single cell can contain up to 10 million ribosomes, all working simultaneously!",
    color: "#ffffff",
    emoji: "🔩",
  },
  golgi: {
    name: "Golgi Body",
    description:
      "Post office of the cell. Packages and ships proteins to their destinations.",
    funFact:
      "The Golgi body was one of the first organelles discovered, found by Camillo Golgi in 1898!",
    color: "#D4A017",
    emoji: "📦",
  },
  er: {
    name: "Endoplasmic Reticulum",
    description:
      "Transport highway. Moves proteins and lipids throughout the cell.",
    funFact:
      "If you stretched out the ER from a single liver cell, it would cover a ping-pong table!",
    color: "#9B59B6",
    emoji: "🛤️",
  },
  membrane: {
    name: "Cell Membrane",
    description:
      "Gatekeeper. Controls what enters and exits the cell.",
    funFact:
      "The cell membrane is only about 7-8 nanometers thick — 10,000 times thinner than a human hair!",
    color: "#39FF14",
    emoji: "🛡️",
  },
};

/* ══════════════════════════════════════════════════════════════
   CAMERA ZOOM CONTROLLER
   ══════════════════════════════════════════════════════════════ */

function CameraZoom({
  target,
  onComplete,
}: {
  target: THREE.Vector3 | null;
  onComplete: () => void;
}) {
  const { camera } = useThree();

  const prevTarget = useRef<THREE.Vector3 | null>(null);

  useFrame(() => {
    if (target && target !== prevTarget.current) {
      prevTarget.current = target;

      // Calculate a camera position that's offset from the target
      const dir = target.clone().normalize();
      const dist = target.length() < 0.5 ? 5 : 4.5;
      const camTarget = dir.multiplyScalar(dist);
      // If near center, use a default offset
      if (camTarget.length() < 1) {
        camTarget.set(2, 1.5, 4);
      }

      gsap.to(camera.position, {
        x: camTarget.x,
        y: camTarget.y,
        z: camTarget.z,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete,
      });
    }
  });

  return null;
}

/* ══════════════════════════════════════════════════════════════
   ORGANELLE COMPONENTS
   ══════════════════════════════════════════════════════════════ */

/* ── Cell Membrane ─────────────────────────────────────────── */
function CellMembrane({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.1;
  });

  return (
    <mesh ref={ref} onClick={onClick}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial
        color={active ? "#5FFF4F" : "#39FF14"}
        wireframe
        transparent
        opacity={active ? 0.35 : 0.12}
      />
    </mesh>
  );
}

/* ── Nucleus ───────────────────────────────────────────────── */
function Nucleus({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} onClick={onClick}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color={active ? "#5AAFFF" : "#378ADD"}
        emissive={active ? "#378ADD" : "#0D2B5E"}
        emissiveIntensity={active ? 1.5 : 0.3}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ── Mitochondria (×4) ─────────────────────────────────────── */
const MITO_POSITIONS: [number, number, number][] = [
  [1.5, 0.6, 0.8],
  [-1.2, -0.5, 1.3],
  [0.5, -1.1, -1.5],
  [-1.4, 0.9, -0.7],
];

function Mitochondria({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y =
        MITO_POSITIONS[i][1] + Math.sin(t * 0.5 + i * 1.5) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {MITO_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0.3 * i, 0.5 * i, 0.2 * i]} onClick={onClick}>
          <capsuleGeometry args={[0.18, 0.5, 8, 16]} />
          <meshStandardMaterial
            color={active ? "#2FFFB0" : "#1D9E75"}
            emissive={active ? "#1D9E75" : "#0A3D2E"}
            emissiveIntensity={active ? 1.5 : 0.3}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Ribosomes (×20) ───────────────────────────────────────── */
function Ribosomes({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.0 + Math.random() * 1.5;
      pts.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = positions[i][1] + Math.sin(t * 0.8 + i) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} onClick={onClick}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color={active ? "#ffffff" : "#cccccc"}
            emissive={active ? "#ffffff" : "#333333"}
            emissiveIntensity={active ? 2 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Golgi Body (stacked discs) ────────────────────────────── */
function GolgiBody({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={[1.8, -0.2, 0.3]}>
      {[0, 0.15, 0.3, 0.45].map((yOff, i) => (
        <mesh
          key={i}
          position={[0, yOff, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={onClick}
        >
          <cylinderGeometry args={[0.45 - i * 0.06, 0.45 - i * 0.06, 0.04, 16]} />
          <meshStandardMaterial
            color={active ? "#FFD700" : "#D4A017"}
            emissive={active ? "#D4A017" : "#4A3506"}
            emissiveIntensity={active ? 1.5 : 0.3}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Endoplasmic Reticulum (tube rings) ────────────────────── */
function EndoplasmicReticulum({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  // Create wavy tube path
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * Math.PI * 4;
      const r = 1.2 + Math.sin(t * 2) * 0.2;
      points.push(
        new THREE.Vector3(
          r * Math.cos(t),
          Math.sin(t * 3) * 0.35,
          r * Math.sin(t)
        )
      );
    }
    return new THREE.CatmullRomCurve3(points, false);
  }, []);

  return (
    <group ref={groupRef}>
      <mesh onClick={onClick}>
        <tubeGeometry args={[curve, 100, 0.06, 8, false]} />
        <meshStandardMaterial
          color={active ? "#C97FE8" : "#9B59B6"}
          emissive={active ? "#9B59B6" : "#2D1A3D"}
          emissiveIntensity={active ? 1.5 : 0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   3D SCENE
   ══════════════════════════════════════════════════════════════ */

function CellScene({
  activeOrganelle,
  onSelect,
}: {
  activeOrganelle: string | null;
  onSelect: (id: string, position: THREE.Vector3) => void;
}) {
  const handleClick = useCallback(
    (id: string, position: THREE.Vector3) => {
      onSelect(id, position);
    },
    [onSelect]
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, -3, 3]} intensity={0.6} color="#39FF14" />
      <pointLight position={[0, 0, 0]} intensity={0.4} color="#378ADD" />

      {/* Organelles */}
      <CellMembrane
        active={activeOrganelle === "membrane"}
        onClick={() => handleClick("membrane", new THREE.Vector3(0, 2.5, 2.5))}
      />
      <Nucleus
        active={activeOrganelle === "nucleus"}
        onClick={() => handleClick("nucleus", new THREE.Vector3(0, 0, 0))}
      />
      <Mitochondria
        active={activeOrganelle === "mitochondria"}
        onClick={() =>
          handleClick("mitochondria", new THREE.Vector3(1.5, 0.6, 0.8))
        }
      />
      <Ribosomes
        active={activeOrganelle === "ribosome"}
        onClick={() =>
          handleClick("ribosome", new THREE.Vector3(0.5, 1.0, 1.0))
        }
      />
      <GolgiBody
        active={activeOrganelle === "golgi"}
        onClick={() => handleClick("golgi", new THREE.Vector3(1.8, -0.2, 0.3))}
      />
      <EndoplasmicReticulum
        active={activeOrganelle === "er"}
        onClick={() => handleClick("er", new THREE.Vector3(-1.0, 0, 1.2))}
      />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function CellExplorerPage() {
  const [activeOrganelle, setActiveOrganelle] = useState<string | null>(null);
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const handleSelect = useCallback(
    (id: string, position: THREE.Vector3) => {
      // Toggle off if clicking same organelle
      if (activeOrganelle === id) {
        setActiveOrganelle(null);
        setPanelVisible(false);
        setZoomTarget(new THREE.Vector3(0, 0, 0));
        return;
      }
      setActiveOrganelle(id);
      setZoomTarget(position);
      setPanelVisible(true);
    },
    [activeOrganelle]
  );

  const info = activeOrganelle ? ORGANELLE_DATA[activeOrganelle] : null;

  return (
    <div style={styles.root}>
      {/* ── 3D Canvas ──────────────────────────────────── */}
      <div style={styles.canvasWrap}>
        <Canvas
          camera={{ position: [0, 2, 7], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          style={{ background: "#050A05" }}
        >
          <CellScene
            activeOrganelle={activeOrganelle}
            onSelect={handleSelect}
          />
          <CameraZoom target={zoomTarget} onComplete={() => {}} />
        </Canvas>
      </div>

      {/* ── Back Link ──────────────────────────────────── */}
      <Link href="/" style={styles.backLink}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Home</span>
      </Link>

      {/* ── Page Title ─────────────────────────────────── */}
      <div style={styles.pageTitle}>
        <h1 style={styles.titleText}>Cell Explorer</h1>
        <p style={styles.titleSub}>Interactive Animal Cell</p>
      </div>

      {/* ── Hint ───────────────────────────────────────── */}
      {!panelVisible && (
        <div style={styles.hint} className="cell-hint">
          <div style={styles.hintPulse} />
          Click any organelle to explore
        </div>
      )}

      {/* ── Organelle Legend (bottom-left) ─────────────── */}
      <div style={styles.legend}>
        {Object.entries(ORGANELLE_DATA).map(([id, data]) => (
          <button
            key={id}
            style={{
              ...styles.legendItem,
              borderColor:
                activeOrganelle === id
                  ? data.color
                  : "rgba(255,255,255,0.08)",
              background:
                activeOrganelle === id
                  ? `${data.color}15`
                  : "rgba(5,10,5,0.6)",
            }}
            onClick={() =>
              handleSelect(
                id,
                id === "nucleus"
                  ? new THREE.Vector3(0, 0, 0)
                  : id === "membrane"
                  ? new THREE.Vector3(0, 2.5, 2.5)
                  : id === "mitochondria"
                  ? new THREE.Vector3(1.5, 0.6, 0.8)
                  : id === "ribosome"
                  ? new THREE.Vector3(0.5, 1.0, 1.0)
                  : id === "golgi"
                  ? new THREE.Vector3(1.8, -0.2, 0.3)
                  : new THREE.Vector3(-1.0, 0, 1.2)
              )
            }
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: data.color,
                display: "inline-block",
                boxShadow: `0 0 6px ${data.color}80`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>
              {data.name}
            </span>
          </button>
        ))}
      </div>

      {/* ── Info Panel (right side) ────────────────────── */}
      <div
        style={{
          ...styles.panel,
          transform: panelVisible ? "translateX(0)" : "translateX(110%)",
          opacity: panelVisible ? 1 : 0,
        }}
      >
        {info && (
          <>
            {/* Close button */}
            <button
              style={styles.panelClose}
              onClick={() => {
                setPanelVisible(false);
                setActiveOrganelle(null);
                setZoomTarget(new THREE.Vector3(0, 0, 0));
              }}
            >
              ✕
            </button>

            {/* Emoji badge */}
            <div
              style={{
                ...styles.panelEmoji,
                background: `${info.color}18`,
                borderColor: `${info.color}40`,
              }}
            >
              {info.emoji}
            </div>

            {/* Name */}
            <h2 style={{ ...styles.panelName, color: info.color }}>
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
            <div style={styles.panelSection}>
              <span style={styles.panelLabel}>Function</span>
              <p style={styles.panelText}>{info.description}</p>
            </div>

            {/* Fun fact */}
            <div style={styles.panelFact}>
              <span style={styles.panelFactIcon}>💡</span>
              <div>
                <span style={styles.panelLabel}>Fun Fact</span>
                <p style={{ ...styles.panelText, marginTop: "4px" }}>
                  {info.funFact}
                </p>
              </div>
            </div>

            {/* Zoom Inside — only for mitochondria */}
            {activeOrganelle === "mitochondria" && (
              <Link href="/cell-explorer/mitochondria" style={styles.zoomBtn}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                  <path d="M11 8v6" />
                  <path d="M8 11h6" />
                </svg>
                Zoom Inside
              </Link>
            )}
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
        .cell-hint {
          animation: hintFadeIn 0.8s ease-out both 1s;
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════ */

const styles: Record<string, React.CSSProperties> = {
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

  /* Back link */
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

  /* Page title */
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

  /* Hint */
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

  /* Legend */
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

  /* Right panel */
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
    transition: "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease",
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

  zoomBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "14px 24px",
    borderRadius: "12px",
    border: "1.5px solid #1D9E75",
    background: "rgba(29, 158, 117, 0.1)",
    color: "#2FFFB0",
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    cursor: "none",
    textDecoration: "none",
    boxShadow: "0 0 20px rgba(29,158,117,0.15), inset 0 0 20px rgba(29,158,117,0.05)",
    transition: "all 0.3s ease",
    marginTop: "4px",
  },
};
