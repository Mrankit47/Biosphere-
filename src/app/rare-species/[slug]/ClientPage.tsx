"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import Link from "next/link";
import { BackLink } from "@/components/ds";
import { getSpeciesById, STATUS_LABELS } from "../_data/species";
import dynamic from "next/dynamic";

const ProceduralCreature = dynamic(() => import("../_models/ProceduralCreature"), { ssr: false });

/* ── Detail Scene ─────────────────────────────────────────────── */
function DetailScene({ speciesId }: { speciesId: string }) {
  const species = getSpeciesById(speciesId);
  if (!species) return null;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} />
      <fog attach="fog" args={["#050A05", 15, 30]} />

      <Suspense fallback={null}>
        <ProceduralCreature bodyType={species.bodyType} bodyParams={species.bodyParams} detail speciesId={species.id} emoji={species.emoji} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ClientPage({ slug }: { slug: string }) {
  const species = getSpeciesById(slug);

  if (!species) {
    return (
      <div style={{ height: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#050A05", flexDirection: "column", gap: "16px" }}>
        <h1 style={{ color: "#39FF14", fontSize: "1.5rem" }}>Species not found</h1>
        <BackLink href="/rare-species" label="Collection" />
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[species.conservationStatus];

  return (
    <div style={S.root}>
      {/* 3D Canvas */}
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 0.2, 4], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }} style={{ background: "#050A05" }}>
          <DetailScene speciesId={slug} />
        </Canvas>
      </div>

      {/* Back */}
      <div style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}>
        <BackLink href="/rare-species" label="Collection" />
      </div>

      {/* Header */}
      <div style={S.header}>
        <span style={{ fontSize: "1.5rem" }}>{species.emoji}</span>
        <h1 style={{ ...S.headerTitle, color: species.color }}>{species.name}</h1>
        <p style={S.headerSub}>{species.scientificName}</p>
        {/* Conservation status badge in header */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 12px",
          borderRadius: "999px",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          background: `${statusInfo.color}20`,
          border: `1px solid ${statusInfo.color}50`,
          color: statusInfo.color,
          marginTop: "6px",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusInfo.color, display: "inline-block" }} />
          {species.conservationStatus} — {statusInfo.label}
        </span>
      </div>

      {/* Scientific info panel (right side) */}
      <div
        style={S.panel}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Description */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Description</span>
          <p style={S.panelText}>{species.description}</p>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Category", value: species.category },
            { label: "Size", value: species.size },
            { label: "Population", value: species.population },
            { label: "Habitat", value: species.habitat },
          ].map(s => (
            <div key={s.label} style={S.stat}>
              <span style={S.panelLabel}>{s.label}</span>
              <span style={{ fontSize: "0.78rem", color: "rgba(200,245,200,0.85)", fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Range */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Range</span>
          <p style={S.panelText}>{species.range}</p>
        </div>

        {/* Threats */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Threats</span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {species.threats.map(t => (
              <span key={t} style={{
                padding: "2px 8px",
                borderRadius: "6px",
                background: "rgba(229,57,53,0.08)",
                border: "1px solid rgba(229,57,53,0.15)",
                fontSize: "0.68rem",
                color: "rgba(229,57,53,0.8)",
                fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div style={{ ...S.funFact, borderColor: `${species.color}25` }}>
          <span>💡</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(200,245,200,0.8)", lineHeight: 1.5 }}>{species.funFact}</p>
        </div>
      </div>

      {/* Hint */}
      <div style={S.hint}>Drag to rotate · Scroll to zoom</div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { position: "relative", width: "100%", height: "calc(100vh - 64px)", background: "var(--ds-bg-primary)", overflow: "hidden" },
  canvasWrap: { position: "absolute", inset: 0, zIndex: 0 },
  backLink: { position: "absolute", top: 20, left: 24, zIndex: 10, display: "flex", alignItems: "center", gap: "8px", color: "var(--ds-accent)", fontSize: "0.85rem", textDecoration: "none", cursor: "none", padding: "8px 14px", borderRadius: "10px", background: "var(--ds-accent-faint)", border: "1px solid var(--ds-border-accent)", backdropFilter: "blur(8px)", transition: "all 0.25s ease" },
  header: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  headerTitle: { fontSize: "1.4rem", fontWeight: 700, letterSpacing: "0.08em", margin: 0 },
  headerSub: { fontSize: "0.7rem", color: "var(--ds-fg-subtle)", margin: 0, letterSpacing: "0.12em", fontStyle: "italic" },
  hint: { position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "var(--ds-fg-subtle)", fontSize: "0.72rem", letterSpacing: "0.1em", pointerEvents: "none" },
  panel: { position: "absolute", top: 80, right: 20, zIndex: 10, width: "min(320px, 80vw)", display: "flex", flexDirection: "column", gap: "10px", padding: "18px", borderRadius: "16px", background: "var(--ds-surface-overlay)", backdropFilter: "blur(20px)", border: "1px solid var(--ds-border-muted)", maxHeight: "calc(100vh - 200px)", overflowY: "auto" },
  panelSection: { padding: "10px 12px", borderRadius: "10px", background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)" },
  panelLabel: { fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--ds-fg-subtle)" },
  panelText: { fontSize: "0.78rem", lineHeight: 1.55, color: "var(--ds-fg-muted)", margin: "4px 0 0" },
  stat: { padding: "8px 10px", borderRadius: "8px", background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)", display: "flex", flexDirection: "column", gap: "2px" },
  funFact: { display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "10px", background: "var(--ds-accent-faint)", border: "1px solid var(--ds-border-accent)" },
};
