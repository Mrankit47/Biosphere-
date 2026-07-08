"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Link from "next/link";
import { BackLink } from "@/components/ds";
import { getOrganismById } from "../_data/organisms";
import FloatingLabel from "../_components/FloatingLabel";
import dynamic from "next/dynamic";

/* Dynamically import models */
const AmoebaMdl = dynamic(() => import("../_models/AmoebaMdl"), { ssr: false });
const EcoliMdl = dynamic(() => import("../_models/EcoliMdl"), { ssr: false });
const ChlorellaMdl = dynamic(() => import("../_models/ChlorellaMdl"), { ssr: false });
const VolvoxMdl = dynamic(() => import("../_models/VolvoxMdl"), { ssr: false });
const ParameciumMdl = dynamic(() => import("../_models/ParameciumMdl"), { ssr: false });
const EuglenaMdl = dynamic(() => import("../_models/EuglenaMdl"), { ssr: false });
const DNAHelixMdl = dynamic(() => import("../_models/DNAHelixMdl"), { ssr: false });
const AnimalCellMdl = dynamic(() => import("../_models/AnimalCellMdl"), { ssr: false });
const PlantCellMdl = dynamic(() => import("../_models/PlantCellMdl"), { ssr: false });
const BacteriaMdl = dynamic(() => import("../_models/BacteriaMdl"), { ssr: false });
const TardigradeMdl = dynamic(() => import("../_models/TardigradeMdl"), { ssr: false });
const DiatomMdl = dynamic(() => import("../_models/DiatomMdl"), { ssr: false });
const SpirogyraMdl = dynamic(() => import("../_models/SpirogyraMdl"), { ssr: false });
const StentorMdl = dynamic(() => import("../_models/StentorMdl"), { ssr: false });
const HalobacteriumMdl = dynamic(() => import("../_models/HalobacteriumMdl"), { ssr: false });
const CyanobacteriaMdl = dynamic(() => import("../_models/CyanobacteriaMdl"), { ssr: false });
const YeastMdl = dynamic(() => import("../_models/YeastMdl"), { ssr: false });
const PenicilliumMdl = dynamic(() => import("../_models/PenicilliumMdl"), { ssr: false });
const RadiolariaMdl = dynamic(() => import("../_models/RadiolariaMdl"), { ssr: false });
const DinoflagellateMdl = dynamic(() => import("../_models/DinoflagellateMdl"), { ssr: false });
const SpirocheteMdl = dynamic(() => import("../_models/SpirocheteMdl"), { ssr: false });
const SlimeMoldMdl = dynamic(() => import("../_models/SlimeMoldMdl"), { ssr: false });
const VorticellaMdl = dynamic(() => import("../_models/VorticellaMdl"), { ssr: false });
const RotiferMdl = dynamic(() => import("../_models/RotiferMdl"), { ssr: false });
const NematodeMdl = dynamic(() => import("../_models/NematodeMdl"), { ssr: false });
const HydraMdl = dynamic(() => import("../_models/HydraMdl"), { ssr: false });
const DaphniaMdl = dynamic(() => import("../_models/DaphniaMdl"), { ssr: false });
const PlanariaMdl = dynamic(() => import("../_models/PlanariaMdl"), { ssr: false });
const OstracodMdl = dynamic(() => import("../_models/OstracodMdl"), { ssr: false });
const ThermophileMdl = dynamic(() => import("../_models/ThermophileMdl"), { ssr: false });
const TrypanosomaMdl = dynamic(() => import("../_models/TrypanosomaMdl"), { ssr: false });
const GiardiaMdl = dynamic(() => import("../_models/GiardiaMdl"), { ssr: false });
const StreptococcusMdl = dynamic(() => import("../_models/StreptococcusMdl"), { ssr: false });
const BacillusMdl = dynamic(() => import("../_models/BacillusMdl"), { ssr: false });
const MethanogenMdl = dynamic(() => import("../_models/MethanogenMdl"), { ssr: false });

/* Model map — will grow as we add more */
const MODEL_MAP: Record<string, React.ComponentType<{ detail?: boolean }>> = {
  amoeba: AmoebaMdl,
  ecoli: EcoliMdl,
  chlorella: ChlorellaMdl,
  volvox: VolvoxMdl,
  paramecium: ParameciumMdl,
  euglena: EuglenaMdl,
  "dna-helix": DNAHelixMdl,
  "animal-cell": AnimalCellMdl,
  "plant-cell": PlantCellMdl,
  bacteria: BacteriaMdl,
  tardigrade: TardigradeMdl,
  diatom: DiatomMdl,
  spirogyra: SpirogyraMdl,
  stentor: StentorMdl,
  halobacterium: HalobacteriumMdl,
  cyanobacteria: CyanobacteriaMdl,
  yeast: YeastMdl,
  penicillium: PenicilliumMdl,
  radiolaria: RadiolariaMdl,
  dinoflagellate: DinoflagellateMdl,
  spirochete: SpirocheteMdl,
  "slime-mold": SlimeMoldMdl,
  vorticella: VorticellaMdl,
  rotifer: RotiferMdl,
  nematode: NematodeMdl,
  hydra: HydraMdl,
  daphnia: DaphniaMdl,
  planaria: PlanariaMdl,
  ostracod: OstracodMdl,
  thermophile: ThermophileMdl,
  trypanosoma: TrypanosomaMdl,
  giardia: GiardiaMdl,
  streptococcus: StreptococcusMdl,
  bacillus: BacillusMdl,
  methanogen: MethanogenMdl,
};

/* Label positions per organism */
const LABEL_MAP: Record<string, { position: [number, number, number]; dotOffset: [number, number, number] }[]> = {
  amoeba: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.0, -0.2, -0.2] },
    { position: [1.8, -0.8, 0.5], dotOffset: [-1.0, 0.6, -0.3] },
    { position: [-2.0, -0.8, -0.5], dotOffset: [1.2, 0.5, 0.3] },
    { position: [2.0, -1.5, 0], dotOffset: [-1.5, 1.0, 0] },
    { position: [-2.2, 1.2, 0], dotOffset: [1.3, -0.8, 0] },
    { position: [0, 2.0, 0], dotOffset: [0, -1.2, 0] },
  ],
  ecoli: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.2, -0.3, 0] },
    { position: [-2.2, -1.0, 0.5], dotOffset: [1.0, 0.8, -0.3] },
    { position: [2.0, -0.5, -0.5], dotOffset: [-1.3, 0.3, 0.3] },
    { position: [-2.0, 0.5, -0.5], dotOffset: [1.2, -0.2, 0.3] },
    { position: [2.2, 0, 0.5], dotOffset: [-1.5, 0, -0.3] },
    { position: [-2.2, -0.3, 0], dotOffset: [1.3, 0.2, 0] },
    { position: [0, 1.8, 0], dotOffset: [0, -1.0, 0] },
  ],
  chlorella: [
    { position: [2.2, 0.6, 0], dotOffset: [-1.3, -0.2, 0] },
    { position: [-2.2, 0.4, 0.3], dotOffset: [1.2, -0.1, -0.2] },
    { position: [2.0, -0.5, 0.5], dotOffset: [-1.3, 0.3, -0.3] },
    { position: [-2.0, -0.8, -0.3], dotOffset: [1.2, 0.6, 0.2] },
    { position: [2.2, -1.2, 0], dotOffset: [-1.5, 0.8, 0] },
    { position: [-2.2, 1.0, 0], dotOffset: [1.3, -0.7, 0] },
    { position: [0, 1.8, 0], dotOffset: [0, -1.0, 0] },
  ],
  volvox: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.1, -0.3, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.3, -0.2, -0.2] },
    { position: [1.8, -0.8, 0.5], dotOffset: [-0.6, 0.6, -0.3] },
    { position: [-2.0, -0.8, -0.5], dotOffset: [1.2, 0.5, 0.3] },
    { position: [2.0, -1.5, 0], dotOffset: [-1.2, 1.0, 0] },
    { position: [-2.2, 1.2, 0], dotOffset: [1.3, -0.8, 0] },
  ],
  paramecium: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.4, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.8, -0.2, -0.2] },
    { position: [1.8, -0.8, 0.5], dotOffset: [-1.5, 0.6, -0.3] },
    { position: [-2.0, -0.8, -0.5], dotOffset: [1.8, 0.5, 0.3] },
    { position: [2.0, -1.5, 0], dotOffset: [-1.8, 1.0, 0] },
    { position: [-2.2, 1.2, 0], dotOffset: [1.8, -0.8, 0] },
    { position: [0, 2.0, 0], dotOffset: [0, -1.2, 0] },
  ],
  euglena: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.8, -0.2, -0.2] },
    { position: [1.8, -0.8, 0.5], dotOffset: [-1.4, 0.6, -0.3] },
    { position: [-2.0, -0.8, -0.5], dotOffset: [1.5, 0.5, 0.3] },
    { position: [2.0, -1.5, 0], dotOffset: [-1.8, 1.0, 0] },
    { position: [-2.2, 1.2, 0], dotOffset: [1.8, -0.8, 0] },
    { position: [0, 2.0, 0], dotOffset: [0, -1.0, 0] },
  ],
  "dna-helix": [
    { position: [2.2, 1.2, 0], dotOffset: [-1.5, -0.4, 0] },
    { position: [-2.2, 0.8, 0.5], dotOffset: [1.8, -0.2, -0.2] },
    { position: [2.2, 0.4, 0.5], dotOffset: [-1.5, -0.1, -0.3] },
    { position: [-2.2, -0.4, -0.5], dotOffset: [1.8, 0.2, 0.3] },
    { position: [2.2, -0.8, 0], dotOffset: [-1.5, 0.2, 0] },
    { position: [-2.2, -1.2, 0], dotOffset: [1.8, 0.4, 0] },
    { position: [0, 2.0, 0], dotOffset: [0, -1.0, 0] },
  ],
  "animal-cell": [
    { position: [2.2, 1.2, 0], dotOffset: [-1.2, -0.3, 0] },
    { position: [-2.2, 0.8, 0.5], dotOffset: [1.8, -0.2, -0.2] },
    { position: [2.2, 0.4, 0.5], dotOffset: [-1.8, -0.1, -0.3] },
    { position: [-2.2, -0.4, -0.5], dotOffset: [1.8, 0.2, 0.3] },
    { position: [2.2, -0.8, 0], dotOffset: [-2.0, 0.2, 0] },
    { position: [-2.2, -1.2, 0], dotOffset: [1.6, 0.4, 0] },
    { position: [0, 2.2, 0], dotOffset: [0, -1.8, 0] },
    { position: [0, -2.2, 0], dotOffset: [0, 1.8, 0] },
  ],
  "plant-cell": [
    { position: [2.4, 1.2, 0], dotOffset: [-1.3, -0.2, 0] },
    { position: [-2.4, 0.8, 0.5], dotOffset: [1.3, -0.1, -0.2] },
    { position: [2.4, 0.4, 0.5], dotOffset: [-1.8, -0.1, -0.3] },
    { position: [-2.4, -0.4, -0.5], dotOffset: [2.0, 0.3, 0.3] },
    { position: [2.4, -0.8, 0], dotOffset: [-2.4, 0.8, 0] },
    { position: [-2.4, -1.2, 0], dotOffset: [2.2, 0.6, 0] },
    { position: [0, 2.4, 0], dotOffset: [0, -1.6, 0] },
    { position: [0, -2.4, 0], dotOffset: [0, 1.4, 0] },
  ],
  "bacteria": [
    { position: [2.0, 1.2, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.0, 0.8, 0.5], dotOffset: [1.3, -0.2, -0.2] },
    { position: [2.2, 0.4, 0.5], dotOffset: [-1.4, -0.1, -0.3] },
    { position: [-2.2, -0.4, -0.5], dotOffset: [1.5, 0.2, 0.3] },
    { position: [2.0, -0.8, 0], dotOffset: [-1.3, 0.2, 0] },
    { position: [-2.0, -1.2, 0], dotOffset: [1.4, 0.4, 0] },
    { position: [0, 2.0, 0], dotOffset: [0, -1.2, 0] },
  ],
  tardigrade: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.5, -0.2, -0.2] },
    { position: [1.8, -0.8, 0.5], dotOffset: [-1.0, 0.6, -0.3] },
    { position: [-2.0, -0.8, -0.5], dotOffset: [1.2, 0.5, 0.3] },
    { position: [2.0, -1.5, 0], dotOffset: [-1.5, 1.0, 0] },
  ],
  diatom: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.2, -0.3, 0] },
    { position: [-2.2, 0.4, 0.5], dotOffset: [1.3, -0.1, -0.2] },
    { position: [1.8, -0.6, 0.5], dotOffset: [-1.2, 0.4, -0.3] },
    { position: [-2.0, -0.8, -0.5], dotOffset: [1.2, 0.5, 0.3] },
  ],
  spirogyra: [
    { position: [2.2, 1.5, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, 0.8, 0.5], dotOffset: [1.8, -0.2, -0.2] },
    { position: [1.8, -0.5, 0.5], dotOffset: [-1.4, 0.3, -0.3] },
    { position: [-2.0, -1.5, -0.5], dotOffset: [1.5, 0.8, 0.3] },
  ],
  stentor: [
    { position: [2.2, 1.2, 0], dotOffset: [-1.2, -0.3, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.5, -0.1, -0.2] },
    { position: [1.8, -0.8, 0.5], dotOffset: [-1.2, 0.4, -0.3] },
    { position: [-2.0, -1.5, -0.5], dotOffset: [1.2, 1.2, 0.3] },
  ],
  halobacterium: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
    { position: [1.8, -0.6, 0.5], dotOffset: [-1.2, 0.3, -0.3] },
  ],
  cyanobacteria: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, -0.5, 0.5], dotOffset: [1.8, 0.3, -0.2] },
    { position: [0, 1.5, 0], dotOffset: [0, -0.8, 0] },
  ],
  yeast: [
    { position: [2.0, 1.2, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.0, 0.5, 0.5], dotOffset: [1.3, -0.1, -0.2] },
    { position: [1.5, -1.2, 0], dotOffset: [-1.0, 0.8, 0] },
  ],
  penicillium: [
    { position: [2.2, 2.0, 0], dotOffset: [-1.8, -0.8, 0] },
    { position: [-2.2, 1.5, 0.5], dotOffset: [1.8, -0.4, -0.2] },
    { position: [1.5, -1.0, 0], dotOffset: [-1.2, 0.2, 0] },
  ],
  radiolaria: [
    { position: [2.2, 1.2, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.2, -0.8, 0.5], dotOffset: [1.5, 0.3, -0.2] },
    { position: [0, 2.2, 0], dotOffset: [0, -1.2, 0] },
  ],
  dinoflagellate: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.2, -0.2, 0.5], dotOffset: [1.3, 0.1, -0.2] },
    { position: [0, -1.8, 0], dotOffset: [0, 0.6, 0] },
  ],
  spirochete: [
    { position: [2.2, 1.2, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.8, -0.2, -0.2] },
  ],
  "slime-mold": [
    { position: [2.2, 0.8, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, -0.5, 0.5], dotOffset: [1.8, 0.3, -0.2] },
  ],
  vorticella: [
    { position: [2.2, 1.2, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
  ],
  rotifer: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
  ],
  nematode: [
    { position: [2.2, 1.5, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, 0.8, 0.5], dotOffset: [1.8, -0.2, -0.2] },
  ],
  hydra: [
    { position: [2.2, 1.2, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
  ],
  daphnia: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
  ],
  planaria: [
    { position: [2.2, 1.2, 0], dotOffset: [-1.8, -0.4, 0] },
    { position: [-2.2, 0.5, 0.5], dotOffset: [1.8, -0.2, -0.2] },
  ],
  ostracod: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
  ],
  thermophile: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, 0.2, 0.5], dotOffset: [1.8, -0.1, -0.2] },
  ],
  trypanosoma: [
    { position: [2.2, 0.8, 0], dotOffset: [-1.5, -0.3, 0] },
    { position: [-2.2, -0.5, 0.5], dotOffset: [1.8, 0.3, -0.2] },
  ],
  giardia: [
    { position: [2.0, 1.0, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-2.0, 0.2, 0.5], dotOffset: [1.5, -0.1, -0.2] },
  ],
  streptococcus: [
    { position: [1.5, 1.5, 0], dotOffset: [-1.2, -0.4, 0] },
    { position: [-1.5, -1.5, 0], dotOffset: [1.2, 1.2, 0] },
  ],
  bacillus: [
    { position: [2.0, 0.5, 0], dotOffset: [-1.2, -0.1, 0] },
    { position: [-2.0, -0.5, 0], dotOffset: [1.2, 0.1, 0] },
  ],
  methanogen: [
    { position: [2.0, 0.8, 0], dotOffset: [-1.2, -0.3, 0] },
    { position: [-2.0, -0.8, 0], dotOffset: [1.2, 0.5, 0] },
  ],
};

/* ── Detail Scene ─────────────────────────────────────────────── */
function DetailScene({ orgId }: { orgId: string }) {
  const org = getOrganismById(orgId);
  const ModelComponent = MODEL_MAP[orgId];
  const labels = LABEL_MAP[orgId] || [];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color={org?.color || "#39FF14"} />
      <pointLight position={[0, 0, 0]} intensity={0.3} color={org?.accentColor || "#1D9E75"} />
      <fog attach="fog" args={["#050A05", 15, 30]} />

      {ModelComponent && (
        <Suspense fallback={null}>
          <ModelComponent detail />
        </Suspense>
      )}

      {/* Floating labels for each part */}
      {org?.parts.map((part, i) => {
        const lbl = labels[i];
        if (!lbl) return null;
        return (
          <FloatingLabel
            key={part.name}
            position={lbl.position}
            title={part.name}
            description={part.description}
            color={part.color}
            dotOffset={lbl.dotOffset}
          />
        );
      })}

      <OrbitControls enablePan={false} minDistance={2} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ClientPage({ slug }: { slug: string }) {
  const org = getOrganismById(slug);

  if (!org) {
    return (
      <div style={{ height: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#050A05", flexDirection: "column", gap: "16px" }}>
        <h1 style={{ color: "#39FF14", fontSize: "1.5rem" }}>Organism not found</h1>
        <BackLink href="/microorganisms" label="Gallery" />
      </div>
    );
  }

  const hasModel = !!MODEL_MAP[slug];

  return (
    <div style={S.root}>
      {/* 3D Canvas */}
      <div style={S.canvasWrap}>
        {hasModel ? (
          <Canvas camera={{ position: [0, 1, 4], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: "#050A05" }}>
            <DetailScene orgId={slug} />
          </Canvas>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "4rem" }}>{org.emoji}</span>
            <p style={{ color: "rgba(57,255,20,0.4)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>3D model coming soon...</p>
          </div>
        )}
      </div>

      {/* Back */}
      <div style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}>
        <BackLink href="/microorganisms" label="Gallery" />
      </div>

      {/* Header */}
      <div style={S.header}>
        <span style={{ fontSize: "1.5rem" }}>{org.emoji}</span>
        <h1 style={{ ...S.headerTitle, color: org.color }}>{org.name}</h1>
        <p style={S.headerSub}>{org.scientificName}</p>
      </div>

      {/* Info bar */}
      <div style={S.infoBar}>
        {org.parts.slice(0, 6).map((part, i, arr) => (
          <span key={part.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "rgba(200,245,200,0.75)", fontWeight: 500 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: part.color, display: "inline-block", flexShrink: 0 }} />
              {part.name.length > 12 ? part.name.slice(0, 12) + "…" : part.name}
            </span>
            {i < arr.length - 1 && <span style={{ width: 1, height: 14, background: "rgba(57,255,20,0.15)", marginLeft: 4 }} />}
          </span>
        ))}
      </div>

      {/* Scientific info panel (right side) */}
      <div 
        style={S.panel}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Description</span>
          <p style={S.panelText}>{org.description}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Type", value: org.type },
            { label: "Size", value: org.size },
            { label: "Habitat", value: org.habitat },
            { label: "Reproduction", value: org.reproduction },
          ].map(s => (
            <div key={s.label} style={S.stat}>
              <span style={S.panelLabel}>{s.label}</span>
              <span style={{ fontSize: "0.78rem", color: "rgba(200,245,200,0.85)", fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>
        <div style={{ ...S.funFact, borderColor: `${org.color}25` }}>
          <span>💡</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(200,245,200,0.8)", lineHeight: 1.5 }}>{org.funFact}</p>
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
  infoBar: { position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRadius: "14px", background: "var(--ds-surface-overlay)", border: "1px solid var(--ds-border-muted)", backdropFilter: "blur(12px)", whiteSpace: "nowrap", maxWidth: "90vw", overflowX: "auto" },
  hint: { position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "var(--ds-fg-subtle)", fontSize: "0.72rem", letterSpacing: "0.1em", pointerEvents: "none" },
  panel: { position: "absolute", top: 80, right: 20, zIndex: 10, width: "min(300px, 80vw)", display: "flex", flexDirection: "column", gap: "10px", padding: "18px", borderRadius: "16px", background: "var(--ds-surface-overlay)", backdropFilter: "blur(20px)", border: "1px solid var(--ds-border-muted)", maxHeight: "calc(100vh - 200px)", overflowY: "auto" },
  panelSection: { padding: "10px 12px", borderRadius: "10px", background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)" },
  panelLabel: { fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--ds-fg-subtle)" },
  panelText: { fontSize: "0.78rem", lineHeight: 1.55, color: "var(--ds-fg-muted)", margin: "4px 0 0" },
  stat: { padding: "8px 10px", borderRadius: "8px", background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)", display: "flex", flexDirection: "column", gap: "2px" },
  funFact: { display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "10px", background: "var(--ds-accent-faint)", border: "1px solid var(--ds-border-accent)" },
};
