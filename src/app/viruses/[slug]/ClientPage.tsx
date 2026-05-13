"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Link from "next/link";
import { getVirusById } from "../_data/viruses";
import dynamic from "next/dynamic";

/* Dynamically import models */
const CoronavirusMdl = dynamic(() => import("../_models/CoronavirusMdl"), { ssr: false });
const HIVMdl = dynamic(() => import("../_models/HIVMdl"), { ssr: false });
const InfluenzaMdl = dynamic(() => import("../_models/InfluenzaMdl"), { ssr: false });
const EbolaMdl = dynamic(() => import("../_models/EbolaMdl"), { ssr: false });
const RabiesMdl = dynamic(() => import("../_models/RabiesMdl"), { ssr: false });
const BacteriophageMdl = dynamic(() => import("../_models/BacteriophageMdl"), { ssr: false });
const DengueMdl = dynamic(() => import("../_models/DengueMdl"), { ssr: false });
const HepatitisBMdl = dynamic(() => import("../_models/HepatitisBMdl"), { ssr: false });
const MeaslesMdl = dynamic(() => import("../_models/MeaslesMdl"), { ssr: false });
const TMVMdl = dynamic(() => import("../_models/TMVMdl"), { ssr: false });
const AdenovirusMdl = dynamic(() => import("../_models/AdenovirusMdl"), { ssr: false });
const ZikaMdl = dynamic(() => import("../_models/ZikaMdl"), { ssr: false });
const SmallpoxMdl = dynamic(() => import("../_models/SmallpoxMdl"), { ssr: false });
const HerpesMdl = dynamic(() => import("../_models/HerpesMdl"), { ssr: false });
const RotavirusMdl = dynamic(() => import("../_models/RotavirusMdl"), { ssr: false });
const MarburgMdl = dynamic(() => import("../_models/MarburgMdl"), { ssr: false });
const NorovirusMdl = dynamic(() => import("../_models/NorovirusMdl"), { ssr: false });
const HPVMdl = dynamic(() => import("../_models/HPVMdl"), { ssr: false });
const PoliovirusMdl = dynamic(() => import("../_models/PoliovirusMdl"), { ssr: false });
const MimivirusMdl = dynamic(() => import("../_models/MimivirusMdl"), { ssr: false });
const LambdaPhageMdl = dynamic(() => import("../_models/LambdaPhageMdl"), { ssr: false });
const RubellaMdl = dynamic(() => import("../_models/RubellaMdl"), { ssr: false });
const MumpsMdl = dynamic(() => import("../_models/MumpsMdl"), { ssr: false });
const HCVMdl = dynamic(() => import("../_models/HCVMdl"), { ssr: false });
const LassaMdl = dynamic(() => import("../_models/LassaMdl"), { ssr: false });
const HantavirusMdl = dynamic(() => import("../_models/HantavirusMdl"), { ssr: false });
const NipahMdl = dynamic(() => import("../_models/NipahMdl"), { ssr: false });
const RiftValleyMdl = dynamic(() => import("../_models/RiftValleyMdl"), { ssr: false });
const ChikungunyaMdl = dynamic(() => import("../_models/ChikungunyaMdl"), { ssr: false });
const JapaneseEncephalitisMdl = dynamic(() => import("../_models/JapaneseEncephalitisMdl"), { ssr: false });
const VaricellaMdl = dynamic(() => import("../_models/VaricellaMdl"), { ssr: false });
const RhinovirusMdl = dynamic(() => import("../_models/RhinovirusMdl"), { ssr: false });
const WestNileMdl = dynamic(() => import("../_models/WestNileMdl"), { ssr: false });
const MERSMdl = dynamic(() => import("../_models/MERSMdl"), { ssr: false });

const MODEL_MAP: Record<string, React.ComponentType<{ detail?: boolean }>> = {
  "sars-cov-2": CoronavirusMdl,
  hiv: HIVMdl,
  influenza: InfluenzaMdl,
  ebola: EbolaMdl,
  rabies: RabiesMdl,
  bacteriophage: BacteriophageMdl,
  dengue: DengueMdl,
  "hepatitis-b": HepatitisBMdl,
  measles: MeaslesMdl,
  tmv: TMVMdl,
  adenovirus: AdenovirusMdl,
  zika: ZikaMdl,
  smallpox: SmallpoxMdl,
  herpes: HerpesMdl,
  rotavirus: RotavirusMdl,
  marburg: MarburgMdl,
  norovirus: NorovirusMdl,
  hpv: HPVMdl,
  poliovirus: PoliovirusMdl,
  mimivirus: MimivirusMdl,
  "lambda-phage": LambdaPhageMdl,
  rubella: RubellaMdl,
  mumps: MumpsMdl,
  "hepatitis-c": HCVMdl,
  lassa: LassaMdl,
  hanta: HantavirusMdl,
  nipah: NipahMdl,
  "rift-valley": RiftValleyMdl,
  chikungunya: ChikungunyaMdl,
  "japanese-encephalitis": JapaneseEncephalitisMdl,
  varicella: VaricellaMdl,
  rhinovirus: RhinovirusMdl,
  "west-nile": WestNileMdl,
  mers: MERSMdl,
};

/* ── Detail Scene ─────────────────────────────────────────── */
function DetailScene({ virusId }: { virusId: string }) {
  const v = getVirusById(virusId);
  const ModelComponent = MODEL_MAP[virusId];
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color={v?.color || "#E24B4A"} />
      <pointLight position={[0, 0, 0]} intensity={0.3} color={v?.accentColor || "#C0392B"} />
      <fog attach="fog" args={["#050A05", 15, 30]} />
      {ModelComponent && (
        <Suspense fallback={null}>
          <ModelComponent detail />
        </Suspense>
      )}
      <OrbitControls enablePan={false} minDistance={2} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.4} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ClientPage({ slug }: { slug: string }) {
  const v = getVirusById(slug);

  if (!v) {
    return (
      <div style={{ height: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#050A05", flexDirection: "column", gap: "16px" }}>
        <h1 style={{ color: "#E24B4A", fontSize: "1.5rem" }}>Virus not found</h1>
        <Link href="/viruses" style={{ color: "rgba(200,245,200,0.7)", fontSize: "0.85rem", textDecoration: "none", padding: "8px 20px", borderRadius: "10px", border: "1px solid rgba(226,75,74,0.2)", background: "rgba(5,10,5,0.5)" }}>← Back to Gallery</Link>
      </div>
    );
  }

  const hasModel = !!MODEL_MAP[slug];

  return (
    <div style={S.root}>
      {/* 3D Canvas */}
      <div style={S.canvasWrap}>
        {hasModel ? (
          <Canvas camera={{ position: [0, 0.5, 3.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: "#050A05" }}>
            <DetailScene virusId={slug} />
          </Canvas>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "4rem" }}>{v.emoji}</span>
            <p style={{ color: "rgba(226,75,74,0.4)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>3D model loading...</p>
          </div>
        )}
      </div>

      {/* Back */}
      <Link href="/viruses" style={S.backLink}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        <span>Gallery</span>
      </Link>

      {/* Header */}
      <div style={S.header}>
        <span style={{ fontSize: "1.5rem" }}>{v.emoji}</span>
        <h1 style={{ ...S.headerTitle, color: v.color }}>{v.name}</h1>
        <p style={S.headerSub}>{v.scientificName}</p>
      </div>

      {/* Parts bar */}
      <div style={S.infoBar}>
        {v.parts.slice(0, 6).map((part, i, arr) => (
          <span key={part.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "rgba(200,245,200,0.75)", fontWeight: 500 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: part.color, display: "inline-block", flexShrink: 0 }} />
              {part.name.length > 15 ? part.name.slice(0, 15) + "…" : part.name}
            </span>
            {i < arr.length - 1 && <span style={{ width: 1, height: 14, background: "rgba(226,75,74,0.15)", marginLeft: 4 }} />}
          </span>
        ))}
      </div>

      {/* Right info panel */}
      <div 
        style={S.panel}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Description */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Description</span>
          <p style={S.panelText}>{v.description}</p>
        </div>

        {/* Quick stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Type", value: v.type },
            { label: "Shape", value: v.shape },
            { label: "Size", value: v.size },
            { label: "Genome", value: v.genome },
            { label: "Discovered", value: `${v.discoveredYear}` },
            { label: "Mortality", value: v.mortality },
          ].map(s => (
            <div key={s.label} style={S.stat}>
              <span style={S.panelLabel}>{s.label}</span>
              <span style={{ fontSize: "0.72rem", color: "rgba(200,245,200,0.85)", fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Discovery */}
        <div style={{ ...S.panelSection, borderColor: `${v.color}20` }}>
          <span style={S.panelLabel}>Discovery</span>
          <p style={S.panelText}>Discovered in <strong style={{ color: v.color }}>{v.discoveredYear}</strong> by {v.discoveredBy}</p>
        </div>

        {/* Transmission */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Transmission</span>
          <p style={S.panelText}>{v.transmission}</p>
        </div>

        {/* Symptoms */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Symptoms</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "6px" }}>
            {v.symptoms.map((sym, i) => (
              <span key={i} style={{ padding: "3px 8px", borderRadius: "20px", background: `${v.color}10`, border: `1px solid ${v.color}25`, fontSize: "0.7rem", color: "rgba(200,245,200,0.8)" }}>{sym}</span>
            ))}
          </div>
        </div>

        {/* Treatment */}
        <div style={{ ...S.panelSection, borderColor: "rgba(46,204,113,0.15)" }}>
          <span style={{ ...S.panelLabel, color: "rgba(46,204,113,0.5)" }}>💊 Treatment / Medicine</span>
          <p style={S.panelText}>{v.treatment}</p>
        </div>

        {/* Prevention */}
        <div style={{ ...S.panelSection, borderColor: "rgba(52,152,219,0.15)" }}>
          <span style={{ ...S.panelLabel, color: "rgba(52,152,219,0.5)" }}>🛡️ Prevention</span>
          <p style={S.panelText}>{v.prevention}</p>
        </div>

        {/* Fun fact */}
        <div style={{ ...S.funFact, borderColor: `${v.color}25` }}>
          <span>💡</span>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(200,245,200,0.8)", lineHeight: 1.5 }}>{v.funFact}</p>
        </div>

        {/* Structural parts */}
        <div style={S.panelSection}>
          <span style={S.panelLabel}>Structural Components</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            {v.parts.map((part, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: part.color, boxShadow: `0 0 4px ${part.color}60`, flexShrink: 0, marginTop: "5px" }} />
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: part.color }}>{part.name}</span>
                  <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "rgba(200,245,200,0.6)", lineHeight: 1.4 }}>{part.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hint */}
      <div style={S.hint}>Drag to rotate · Scroll to zoom</div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { position: "relative", width: "100%", height: "calc(100vh - 64px)", background: "#050A05", overflow: "hidden" },
  canvasWrap: { position: "absolute", inset: 0, zIndex: 0 },
  backLink: { position: "absolute", top: 20, left: 24, zIndex: 10, display: "flex", alignItems: "center", gap: "8px", color: "rgba(200,245,200,0.7)", fontSize: "0.85rem", textDecoration: "none", cursor: "none", padding: "8px 14px", borderRadius: "10px", background: "rgba(5,10,5,0.5)", border: "1px solid rgba(226,75,74,0.1)", backdropFilter: "blur(8px)", transition: "all 0.25s ease" },
  header: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  headerTitle: { fontSize: "1.4rem", fontWeight: 700, letterSpacing: "0.08em", margin: 0 },
  headerSub: { fontSize: "0.7rem", color: "rgba(200,245,200,0.5)", margin: 0, letterSpacing: "0.12em", fontStyle: "italic" },
  infoBar: { position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRadius: "14px", background: "rgba(5,10,5,0.7)", border: "1px solid rgba(226,75,74,0.1)", backdropFilter: "blur(12px)", whiteSpace: "nowrap", maxWidth: "90vw", overflowX: "auto" },
  hint: { position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "rgba(226,75,74,0.35)", fontSize: "0.72rem", letterSpacing: "0.1em", pointerEvents: "none" },
  panel: { position: "absolute", top: 80, right: 20, zIndex: 10, width: "min(320px, 80vw)", display: "flex", flexDirection: "column", gap: "10px", padding: "18px", borderRadius: "16px", background: "rgba(5,10,5,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(226,75,74,0.08)", maxHeight: "calc(100vh - 200px)", overflowY: "auto" },
  panelSection: { padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" },
  panelLabel: { fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(200,245,200,0.4)" },
  panelText: { fontSize: "0.78rem", lineHeight: 1.55, color: "rgba(200,245,200,0.8)", margin: "4px 0 0" },
  stat: { padding: "8px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: "2px" },
  funFact: { display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 12px", borderRadius: "10px", background: "rgba(226,75,74,0.03)", border: "1px solid rgba(226,75,74,0.06)" },
};
