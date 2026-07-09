"use client";

import { useState, useCallback, useMemo } from "react";
import { BackLink } from "@/components/ds";

/* ── Tree Data ─────────────────────────────────────────────── */
interface TreeNode {
  id: string;
  label: string;
  color: string;
  children?: TreeNode[];
  info?: string;
  cellType?: string;
  facts?: string[];
  examples?: string;
}

const NODE_ABBR: Record<string, string> = {
  root: "L", bacteria: "B", archaea: "A", eukarya: "E",
  protista: "Pr", fungi: "Fu", plantae: "Pl", animalia: "An",
  ecoli: "Ec", salmonella: "Sa", cyano: "Cy", lactobacillus: "Lb", streptomyces: "St",
  methanogens: "Me", halophiles: "Ha", thermophiles: "Th",
  amoeba2: "Am", paramecium: "Pa", algae: "Al", euglena: "Eu",
  mushroom: "Mu", yeast: "Ye", mold: "Mo", truffle: "Tf",
  moss: "Ms", fern: "Fe", flower: "Fl", tree: "Tr", conifer: "Co",
  sponge: "Sp", jellyfish: "Jf", insect: "In", fish: "Fi", amphibian: "Ap", reptile: "Re", bird: "Bi", mammal: "Ma",
};
const NODE_EMOJI: Record<string, string> = {
  root: "\u{1F30D}", bacteria: "\u{1F9A0}", archaea: "\u{1F30B}", eukarya: "\u{1F9EC}",
  protista: "\u{1FAE7}", fungi: "\u{1F344}", plantae: "\u{1F33F}", animalia: "\u{1F43E}",
  ecoli: "\u{1F9A0}", salmonella: "\u{1F9A0}", cyano: "\u{1F9A0}", lactobacillus: "\u{1F9A0}", streptomyces: "\u{1F9A0}",
  methanogens: "\u{1F30B}", halophiles: "\u{1F30B}", thermophiles: "\u{1F525}",
  amoeba2: "\u{1FAE7}", paramecium: "\u{1FAE7}", algae: "\u{1F33F}", euglena: "\u{1F52C}",
  mushroom: "\u{1F344}", yeast: "\u{1F344}", mold: "\u{1F344}", truffle: "\u{1F344}",
  moss: "\u{1F331}", fern: "\u{1F33F}", flower: "\u{1F338}", tree: "\u{1F333}", conifer: "\u{1F332}",
  sponge: "\u{1F9FD}", jellyfish: "\u{1FAB8}", insect: "\u{1F41B}",
  fish: "\u{1F41F}", amphibian: "\u{1F438}", reptile: "\u{1F98E}", bird: "\u{1F426}", mammal: "\u{1F43E}",
};

const TREE: TreeNode = {
  id: "root", label: "Life on Earth", color: "#39FF14",
  info: "All known life shares a common ancestor (LUCA) ~3.8 billion years ago. Today there are an estimated 8.7 million species.",
  facts: ["Oldest fossils: 3.5 billion years", "Estimated 8.7 million species alive today"],
  children: [
    {
      id: "bacteria", label: "Bacteria", color: "#378ADD", cellType: "Prokaryotic",
      info: "Oldest and most abundant life form. Single-celled organisms without a nucleus. Peptidoglycan cell walls.",
      facts: ["3.5 billion years old", "Survive in extreme conditions", "More bacteria in you than human cells"],
      examples: "E. coli, Cyanobacteria, Streptomyces, Lactobacillus",
      children: [
        { id: "ecoli", label: "E. coli", color: "#5AAFFF", info: "Rod-shaped bacterium in human intestines. Most strains harmless. Divides every 20 minutes. Key model organism in genetics." },
        { id: "salmonella", label: "Salmonella", color: "#5AAFFF", info: "Causes food poisoning. Over 2,500 serotypes. Named after veterinarian Dr. Daniel Salmon." },
        { id: "cyano", label: "Cyanobacteria", color: "#5AAFFF", info: "Photosynthetic bacteria that caused the Great Oxidation Event 2.4 Bya. Produce 20-30% of Earth's oxygen." },
        { id: "lactobacillus", label: "Lactobacillus", color: "#5AAFFF", info: "Probiotic bacteria used to make yogurt, cheese, and sauerkraut. Essential for gut health." },
        { id: "streptomyces", label: "Streptomyces", color: "#5AAFFF", info: "Soil bacteria that produce over 60% of all known antibiotics. Give soil its earthy smell." },
      ],
    },
    {
      id: "archaea", label: "Archaea", color: "#EF9F27", cellType: "Prokaryotic",
      info: "Discovered as separate domain in 1977 by Carl Woese. Unique ether-linked lipid membranes. Many are extremophiles.",
      facts: ["Discovered in 1977", "Often mistaken for bacteria", "Ether lipids in membrane"],
      examples: "Methanogens, Halobacterium, Pyrococcus",
      children: [
        { id: "methanogens", label: "Methanogens", color: "#FFB84D", info: "Produce methane gas. Found in swamps, cow stomachs, and sewage. Responsible for significant global methane emissions." },
        { id: "halophiles", label: "Halophiles", color: "#FFB84D", info: "Thrive in extreme salt (Dead Sea, Great Salt Lake). Bacteriorhodopsin pigment turns lakes pink. Can survive in 30% salt." },
        { id: "thermophiles", label: "Thermophiles", color: "#FFB84D", info: "Live at 60-120°C near hydrothermal vents. Taq polymerase from these organisms powers PCR testing worldwide." },
      ],
    },
    {
      id: "eukarya", label: "Eukarya", color: "#1D9E75", cellType: "Eukaryotic",
      info: "Organisms with membrane-bound nucleus. Evolved ~2 billion years ago via endosymbiosis. Includes all complex life.",
      facts: ["First eukaryote ~2 Bya", "Mitochondria were once free-living bacteria"],
      children: [
        {
          id: "protista", label: "Protista", color: "#9B59B6", cellType: "Eukaryotic",
          info: "Diverse eukaryotes: protozoa, algae, and slime molds. Some photosynthesize, some hunt prey. Paraphyletic group.",
          facts: ["Not a true clade", "Includes both autotrophs and heterotrophs"],
          examples: "Amoeba, Paramecium, Euglena, Kelp",
          children: [
            { id: "amoeba2", label: "Amoeba", color: "#C97FE8", info: "Moves via pseudopods. Engulfs food by phagocytosis. Can change shape constantly. 0.1-0.5 mm." },
            { id: "paramecium", label: "Paramecium", color: "#C97FE8", info: "Slipper-shaped ciliate with 2 nuclei (macro + micro). Covered in thousands of cilia for swimming. 150-300 μm." },
            { id: "euglena", label: "Euglena", color: "#C97FE8", info: "Mixotroph with flagellum and chloroplasts. Has a red eyespot for phototaxis. Both plant-like and animal-like." },
            { id: "algae", label: "Algae", color: "#C97FE8", info: "Produce over 50% of Earth's oxygen. Range from single-celled diatoms to 60m giant kelp forests." },
          ],
        },
        {
          id: "fungi", label: "Fungi", color: "#E24B4A", cellType: "Eukaryotic",
          info: "Decomposers with chitin cell walls and mycelium networks. Neither plant nor animal. Absorb nutrients externally.",
          facts: ["Largest organism: honey fungus (2.4 miles)", "Source of penicillin", "More related to animals than plants"],
          examples: "Portobello, Penicillium, Yeast, Truffle",
          children: [
            { id: "mushroom", label: "Mushroom", color: "#F07070", info: "Fruiting body of Basidiomycota. The honey fungus in Oregon spans 2.4 miles — largest organism on Earth." },
            { id: "yeast", label: "Yeast", color: "#F07070", info: "Single-celled Ascomycota. First eukaryote genome sequenced (1996). Powers baking and brewing worldwide." },
            { id: "mold", label: "Mold", color: "#F07070", info: "Multicellular fungi. Fleming discovered penicillin from Penicillium mold in 1928 — revolutionized medicine." },
            { id: "truffle", label: "Truffle", color: "#F07070", info: "Underground fruiting body. Among the most expensive foods ($2,000-$4,000/lb). Found by trained dogs and pigs." },
          ],
        },
        {
          id: "plantae", label: "Plantae", color: "#39FF14", cellType: "Eukaryotic",
          info: "Photosynthetic multicellular organisms. Cellulose cell walls. Produce ~70% of Earth's oxygen. 400,000+ species.",
          facts: ["400,000+ species", "Produce 70% of oxygen", "Colonized land ~470 Mya"],
          examples: "Oak, Rose, Pine, Fern, Moss",
          children: [
            { id: "moss", label: "Bryophytes", color: "#5FFF4F", info: "Mosses, liverworts, hornworts. No true roots. Among first land plants (~470 Mya). Absorb water directly." },
            { id: "fern", label: "Ferns", color: "#5FFF4F", info: "Reproduce via spores. 360+ million years old. Over 10,500 species. Dominated before seed plants evolved." },
            { id: "conifer", label: "Conifers", color: "#5FFF4F", info: "Gymnosperms with cones. Include pines, spruces, redwoods. Oldest tree: bristlecone pine (5,000+ years)." },
            { id: "flower", label: "Angiosperms", color: "#5FFF4F", info: "Flowering plants. Most diverse group (300,000+ species). Evolved ~140 Mya. Include grasses, orchids, oaks." },
          ],
        },
        {
          id: "animalia", label: "Animalia", color: "#378ADD", cellType: "Eukaryotic",
          info: "Multicellular heterotrophs without cell walls. 8+ million species estimated. Oldest: sponges (~600 Mya).",
          facts: ["8 million species estimated", "Oldest: sponges (600 Mya)", "Cambrian explosion ~540 Mya"],
          examples: "Sponge, Jellyfish, Insects, Fish, Birds, Mammals",
          children: [
            { id: "sponge", label: "Sponge", color: "#5AAFFF", info: "Phylum Porifera. Simplest animals. No organs or tissues. Filter feeders. Oldest animal lineage (~600 Mya)." },
            { id: "jellyfish", label: "Jellyfish", color: "#5AAFFF", info: "Phylum Cnidaria. Radial symmetry. Stinging cells (cnidocytes). 95% water. Some are immortal (Turritopsis)." },
            { id: "insect", label: "Insects", color: "#5AAFFF", info: "Class Insecta (Arthropoda). Most diverse animal group: 1 million+ species. 3 body parts, 6 legs, exoskeleton." },
            { id: "fish", label: "Fish", color: "#5AAFFF", info: "First vertebrates (~500 Mya). Breathe via gills. 35,000+ species. Include sharks (cartilaginous) and bony fish." },
            { id: "amphibian", label: "Amphibians", color: "#5AAFFF", info: "First land vertebrates (~370 Mya). Breathe through skin. Metamorphosis from tadpole. 8,000+ species." },
            { id: "reptile", label: "Reptiles", color: "#5AAFFF", info: "Cold-blooded with scales. Lay amniotic eggs. Include snakes, lizards, turtles, crocodiles. 11,000+ species." },
            { id: "bird", label: "Birds", color: "#5AAFFF", info: "Evolved from theropod dinosaurs. Warm-blooded, feathered, lay eggs. 10,000+ species. Only living dinosaurs." },
            { id: "mammal", label: "Mammals", color: "#5AAFFF", info: "Warm-blooded, hair/fur, mammary glands. 6,400+ species. Include humans. Largest: blue whale (30m)." },
          ],
        },
      ],
    },
  ],
};

/* helper: find path from root to a node */
function findPath(node: TreeNode, targetId: string, path: string[] = []): string[] | null {
  const p = [...path, node.id];
  if (node.id === targetId) return p;
  if (node.children) {
    for (const c of node.children) {
      const r = findPath(c, targetId, p);
      if (r) return r;
    }
  }
  return null;
}
/* helper: collect all node ids */
function collectIds(node: TreeNode): string[] {
  const ids = [node.id];
  if (node.children) node.children.forEach(c => ids.push(...collectIds(c)));
  return ids;
}

/* ── Layout engine: compute node positions ─────────────────── */
interface LayoutNode {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  info?: string;
  parentX?: number;
  parentY?: number;
  depth: number;
  animDelay: number;
}

function collectLeafIds(node: TreeNode): string[] {
  if (!node.children || node.children.length === 0) return [node.id];
  const ids: string[] = [];
  node.children.forEach(c => ids.push(...collectLeafIds(c)));
  return ids;
}

function assignLeafSlots(node: TreeNode, startSlot: number = 0): { slots: Record<string, number>; nextSlot: number } {
  const slots: Record<string, number> = {};
  
  if (!node.children || node.children.length === 0) {
    slots[node.id] = startSlot;
    return { slots, nextSlot: startSlot + 1 };
  }
  
  let currentSlot = startSlot;
  node.children.forEach((child, i) => {
    if (i > 0) {
      if (node.id === "root") {
        currentSlot += 1.8; // Large gap between domains (Bacteria, Archaea, Eukarya)
      } else if (node.id === "eukarya") {
        currentSlot += 1.0; // Medium gap between eukaryotic kingdoms (Protista, Fungi, etc.)
      } else {
        currentSlot += 0.3; // Default sibling gap
      }
    }
    
    const res = assignLeafSlots(child, currentSlot);
    Object.assign(slots, res.slots);
    currentSlot = res.nextSlot;
  });
  
  return { slots, nextSlot: currentSlot };
}

const { slots: LEAF_SLOTS, nextSlot: TOTAL_SLOT_WIDTH } = assignLeafSlots(TREE, 0);
const MAX_SLOT_VAL = TOTAL_SLOT_WIDTH > 1 ? TOTAL_SLOT_WIDTH - 1 : 1;

function getSubtreeMidSlot(node: TreeNode): number {
  const leaves = collectLeafIds(node);
  const slotsSum = leaves.reduce((sum, id) => sum + (LEAF_SLOTS[id] ?? 0), 0);
  return slotsSum / leaves.length;
}

const PADDING = 60;        // left/right margin inside SVG
const SVG_W = 1800;
const SVG_H = 780;
const USABLE_W = SVG_W - PADDING * 2;
const Y_TOP = 50;
const Y_STEP = 140;       // vertical gap between levels

function layoutTree(
  node: TreeNode,
  depth: number,
  delay: number,
  parentX?: number,
  parentY?: number,
): LayoutNode[] {
  const result: LayoutNode[] = [];

  const midSlot = getSubtreeMidSlot(node);
  const x = PADDING + (midSlot / MAX_SLOT_VAL) * USABLE_W;
  const y = Y_TOP + depth * Y_STEP;

  result.push({
    id: node.id, label: node.label, color: node.color,
    x, y, info: node.info, parentX, parentY,
    depth, animDelay: delay,
  });

  if (node.children) {
    node.children.forEach((child, i) => {
      result.push(
        ...layoutTree(child, depth + 1, delay + 0.12 + i * 0.06, x, y)
      );
    });
  }

  return result;
}

const nodes = layoutTree(TREE, 0, 0);

/* ── Page ───────────────────────────────────────────────────── */
export default function TreeOfLifePage() {
  const [selected, setSelected] = useState<LayoutNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [highlightPath, setHighlightPath] = useState<string[]>([]);

  // Precompute leaf order to alternate vertical label positions
  const leafIndexMap = useMemo(() => {
    const leaves = nodes.filter(n => n.depth === 3).sort((a, b) => a.x - b.x);
    return new Map(leaves.map((n, idx) => [n.id, idx]));
  }, []);

  const handleClick = useCallback((n: LayoutNode) => {
    setSelected(prev => (prev?.id === n.id ? null : n));
    const path = findPath(TREE, n.id);
    setHighlightPath(path || []);
  }, []);

  const matchedIds = search.length > 1 ? nodes.filter(n => n.label.toLowerCase().includes(search.toLowerCase())).map(n => n.id) : [];

  return (
    <div style={S.root} suppressHydrationWarning>
      <BackLink href="/" label="Home" />
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Tree of Life</h1>
        <p style={S.subtitle}>Click any node to trace its evolutionary path</p>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organism..." style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--ds-border-muted)", background: "var(--ds-surface-subtle)", color: "var(--ds-fg)", fontSize: "0.8rem", width: "min(280px, 70vw)", outline: "none", fontFamily: "inherit", backdropFilter: "blur(8px)" }} />
        </div>
        {matchedIds.length > 0 && <p style={{ fontSize: "0.7rem", color: "var(--ds-accent)", marginTop: 6 }}>{matchedIds.length} match{matchedIds.length > 1 ? "es" : ""} found</p>}
      </div>

      {/* SVG Tree */}
      <div style={S.treeWrap}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={S.svg} preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Lines — straight vertical drop then curve */}
          {nodes.filter(n => n.parentX !== undefined).map((n, i) => {
            const px = n.parentX!;
            const py = n.parentY!;
            const cp1y = py + (n.y - py) * 0.4;
            const cp2y = py + (n.y - py) * 0.6;
            const isPath = highlightPath.includes(n.id);
            const isMatch = matchedIds.includes(n.id);
            const isActive = selected?.id === n.id || hovered === n.id || isPath || isMatch;
            return (
              <path
                key={`line-${i}`}
                d={`M${px},${py} C${px},${cp1y} ${n.x},${cp2y} ${n.x},${n.y}`}
                fill="none"
                stroke={isActive ? n.color : "rgba(57,255,20,0.12)"}
                strokeWidth={isPath ? 3 : isActive ? 2.5 : 1.2}
                className="tree-line"
                style={{ animationDelay: `${n.animDelay}s` }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const isPath = highlightPath.includes(n.id);
            const isMatch = matchedIds.includes(n.id);
            const isActive = selected?.id === n.id || hovered === n.id || isPath || isMatch;
            const r = n.depth === 0 ? 22 : n.depth <= 2 ? 16 : 13;
            return (
              <g
                key={n.id}
                className="tree-node"
                style={{ animationDelay: `${n.animDelay + 0.1}s`, cursor: "pointer", pointerEvents: "all" }}
                onClick={() => handleClick(n)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle cx={n.x} cy={n.y} r={r + 14} fill="transparent" />
                {isActive && (
                  <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.3} filter="url(#glow)" />
                )}
                <circle
                  cx={n.x} cy={n.y} r={isActive ? r + 3 : r}
                  fill={isActive ? n.color : `${n.color}25`}
                  stroke={n.color}
                  strokeWidth={isActive ? 2 : 1.2}
                  style={{ transition: "all 0.3s ease" }}
                />
                {/* Alternate leaf labels down to prevent horizontal overlapping */}
                <text
                  x={n.x} y={n.y + r + (n.depth === 3 && ((leafIndexMap.get(n.id) ?? 0) % 2 === 1) ? 30 : 16)}
                  textAnchor="middle"
                  fill={isActive ? n.color : "rgba(200,245,200,0.65)"}
                  fontSize={n.depth === 0 ? 12 : n.depth <= 2 ? 11 : 9}
                  fontWeight={n.depth <= 1 ? 600 : 400}
                  fontFamily="system-ui"
                  fontStyle={n.depth >= 3 ? "italic" : "normal"}
                  style={{ transition: "fill 0.3s ease" }}
                >
                  {n.label}
                </text>
                <text x={n.x} y={n.y + 1} textAnchor="middle" fontSize={n.depth === 0 ? 12 : n.depth <= 2 ? 9 : 7} fontWeight={700} fontFamily="system-ui" dominantBaseline="middle" fill={isActive ? "#050A05" : n.color}>
                  {NODE_ABBR[n.id] || n.label.charAt(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div style={{ ...S.panel, transform: selected?.info ? "translateX(0)" : "translateX(110%)", opacity: selected?.info ? 1 : 0 }}>
        {selected?.info && (() => {
          const treeNode = (function findNode(n: TreeNode, id: string): TreeNode | null { if (n.id === id) return n; if (n.children) for (const c of n.children) { const r = findNode(c, id); if (r) return r; } return null; })(TREE, selected.id);
          return (
            <>
              <button style={S.panelClose} onClick={() => { setSelected(null); setHighlightPath([]); }}>X</button>
              <div style={{ ...S.panelBadge, background: `${selected.color}18`, borderColor: `${selected.color}40` }}>
                {NODE_EMOJI[selected.id] || "?"}
              </div>
              <h3 style={{ ...S.panelName, color: selected.color }}>{selected.label}</h3>
              <div style={{ width: 30, height: 2, background: selected.color, borderRadius: 1, margin: "0 auto 14px", boxShadow: `0 0 8px ${selected.color}60` }} />

              {treeNode?.cellType && (
                <div style={{ padding: "4px 12px", borderRadius: 8, background: `${selected.color}12`, border: `1px solid ${selected.color}25`, fontSize: "0.7rem", color: selected.color, fontWeight: 600 }}>{treeNode.cellType}</div>
              )}

              <div style={S.panelCard}>
                <span style={S.panelLabel}>Description</span>
                <p style={S.panelText}>{selected.info}</p>
              </div>

              {treeNode?.examples && (
                <div style={S.panelCard}>
                  <span style={S.panelLabel}>Examples</span>
                  <p style={{ ...S.panelText, fontStyle: "italic" }}>{treeNode.examples}</p>
                </div>
              )}

              {treeNode?.facts && treeNode.facts.length > 0 && (
                <div style={S.panelCard}>
                  <span style={S.panelLabel}>Key Facts</span>
                  {treeNode.facts.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 6 }}>
                      <span style={{ color: selected.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--ds-fg-muted)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {highlightPath.length > 1 && (
                <div style={S.panelCard}>
                  <span style={S.panelLabel}>Evolutionary Path</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8, alignItems: "center" }}>
                    {highlightPath.map((id, i) => {
                      const ln = nodes.find(x => x.id === id);
                      return (
                        <span key={id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ padding: "3px 8px", borderRadius: 6, background: `${ln?.color || selected.color}15`, border: `1px solid ${ln?.color || selected.color}30`, fontSize: "0.7rem", color: ln?.color || selected.color, fontWeight: 600 }}>{ln?.label || id}</span>
                          {i < highlightPath.length - 1 && <span style={{ color: "var(--ds-fg-subtle)", fontSize: "0.7rem" }}>→</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Legend */}
      <div style={S.legend}>
        {[
          { label: "Bacteria", color: "#378ADD" },
          { label: "Archaea", color: "#EF9F27" },
          { label: "Protista", color: "#9B59B6" },
          { label: "Fungi", color: "#E24B4A" },
          { label: "Plantae", color: "#39FF14" },
          { label: "Animalia", color: "#378ADD" },
        ].map(l => (
          <div key={l.label} style={S.legendItem}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, boxShadow: `0 0 5px ${l.color}80`, flexShrink: 0 }} />
            <span style={{ fontSize: "0.65rem", color: "rgba(200,245,200,0.6)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes lineGrow {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodeIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .tree-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: lineGrow 1s ease-out forwards;
        }
        .tree-node {
          opacity: 0;
          animation: nodeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  root: { position: "relative", width: "100%", minHeight: "calc(100vh - 64px)", background: "var(--ds-bg-primary)", overflow: "hidden", display: "flex", flexDirection: "column" },

  header: { textAlign: "center", padding: "24px 20px 0", zIndex: 10 },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "var(--ds-accent)", letterSpacing: "0.06em", margin: 0, textShadow: "var(--ds-glow-sm)" },
  subtitle: { fontSize: "0.75rem", color: "var(--ds-fg-muted)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  treeWrap: { flex: 1, padding: "10px 20px 40px", overflowX: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start" },
  svg: { width: "100%", maxWidth: 1600, height: "auto", minHeight: 500 },

  panel: {
    position: "fixed", top: 64, right: 0, width: "min(320px, 80vw)", height: "calc(100vh - 64px)", zIndex: 30,
    background: "var(--ds-surface-overlay)", backdropFilter: "blur(20px)", borderLeft: "1px solid var(--ds-border-muted)",
    padding: "48px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
    transition: "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease", overflowY: "auto",
  },
  panelClose: { position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--ds-fg-subtle)", fontSize: "1rem", cursor: "none", fontFamily: "inherit" },
  panelBadge: { width: 56, height: 56, borderRadius: 16, border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" },
  panelName: { fontSize: "1.3rem", fontWeight: 700, margin: 0, textAlign: "center" },
  panelCard: { width: "100%", padding: "14px 16px", borderRadius: 12, background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)" },
  panelLabel: { fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--ds-fg-subtle)" },
  panelText: { fontSize: "0.88rem", color: "var(--ds-fg-muted)", lineHeight: 1.6, margin: "6px 0 0" },

  legend: { position: "fixed", bottom: 20, left: 20, zIndex: 10, display: "flex", flexDirection: "column", gap: 3, padding: "10px 14px", borderRadius: 10, background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)", backdropFilter: "blur(8px)" },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
};
