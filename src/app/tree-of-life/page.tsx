"use client";

import { useState, useCallback } from "react";

/* ── Tree Data ─────────────────────────────────────────────── */
interface TreeNode {
  id: string;
  label: string;
  color: string;
  children?: TreeNode[];
  info?: string;
}

/* Abbreviations used inside SVG circles (avoids emoji hydration mismatch) */
const NODE_ABBR: Record<string, string> = {
  root: "L", bacteria: "B", archaea: "A", eukarya: "E",
  protista: "Pr", fungi: "Fu", plantae: "Pl", animalia: "An",
};
const NODE_EMOJI: Record<string, string> = {
  root: "\u{1F30D}", bacteria: "\u{1F9A0}", archaea: "\u{1F30B}", eukarya: "\u{1F9EC}",
  protista: "\u{1FAE7}", fungi: "\u{1F344}", plantae: "\u{1F33F}", animalia: "\u{1F43E}",
};

const TREE: TreeNode = {
  id: "root", label: "Life on Earth", color: "#39FF14",
  info: "All known life shares a common ancestor that lived approximately 3.8 billion years ago.",
  children: [
    {
      id: "bacteria", label: "Bacteria", color: "#378ADD",
      info: "Prokaryotes. No nucleus. Oldest life form on Earth. 3.5 billion years old.",
      children: [
        { id: "ecoli", label: "E. coli", color: "#5AAFFF" },
        { id: "salmonella", label: "Salmonella", color: "#5AAFFF" },
        { id: "cyano", label: "Cyanobacteria", color: "#5AAFFF" },
      ],
    },
    {
      id: "archaea", label: "Archaea", color: "#EF9F27",
      info: "Extremophiles. Live in volcanic vents, salt lakes, and deep ocean.",
      children: [
        { id: "methanogens", label: "Methanogens", color: "#FFB84D" },
        { id: "halophiles", label: "Halophiles", color: "#FFB84D" },
        { id: "thermophiles", label: "Thermophiles", color: "#FFB84D" },
      ],
    },
    {
      id: "eukarya", label: "Eukarya", color: "#1D9E75",
      info: "Organisms with membrane-bound nuclei. Includes all complex life on Earth.",
      children: [
        {
          id: "protista", label: "Protista", color: "#9B59B6",
          info: "Mostly single-celled eukaryotes. Neither plant, animal, nor fungi.",
          children: [
            { id: "amoeba2", label: "Amoeba", color: "#C97FE8" },
            { id: "paramecium", label: "Paramecium", color: "#C97FE8" },
            { id: "algae", label: "Algae", color: "#C97FE8" },
          ],
        },
        {
          id: "fungi", label: "Fungi", color: "#E24B4A",
          info: "Decomposers of nature. Cell walls made of chitin.",
          children: [
            { id: "mushroom", label: "Mushroom", color: "#F07070" },
            { id: "yeast", label: "Yeast", color: "#F07070" },
            { id: "mold", label: "Mold", color: "#F07070" },
          ],
        },
        {
          id: "plantae", label: "Plantae", color: "#39FF14",
          info: "Make food via photosynthesis. Produce 70% of Earth's oxygen.",
          children: [
            { id: "moss", label: "Moss", color: "#5FFF4F" },
            { id: "fern", label: "Fern", color: "#5FFF4F" },
            { id: "flower", label: "Flower", color: "#5FFF4F" },
            { id: "tree", label: "Tree", color: "#5FFF4F" },
          ],
        },
        {
          id: "animalia", label: "Animalia", color: "#378ADD",
          info: "Multicellular, no cell walls. Over 8 million known species.",
          children: [
            { id: "fish", label: "Fish", color: "#5AAFFF" },
            { id: "amphibian", label: "Amphibian", color: "#5AAFFF" },
            { id: "reptile", label: "Reptile", color: "#5AAFFF" },
            { id: "bird", label: "Bird", color: "#5AAFFF" },
            { id: "mammal", label: "Mammal", color: "#5AAFFF" },
          ],
        },
      ],
    },
  ],
};

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

function layoutTree(node: TreeNode, x: number, y: number, hSpan: number, depth: number, delay: number, parentX?: number, parentY?: number): LayoutNode[] {
  const result: LayoutNode[] = [];
  result.push({ id: node.id, label: node.label, color: node.color, x, y, info: node.info, parentX, parentY, depth, animDelay: delay });

  if (node.children) {
    const count = node.children.length;
    const childSpan = hSpan / Math.max(count, 1);
    const startX = x - hSpan / 2 + childSpan / 2;
    const childY = y + 100;

    node.children.forEach((child, i) => {
      const cx = startX + i * childSpan;
      result.push(...layoutTree(child, cx, childY, childSpan * 0.9, depth + 1, delay + 0.15 + i * 0.08, x, y));
    });
  }
  return result;
}

const SVG_W = 1400;
const SVG_H = 550;
const nodes = layoutTree(TREE, SVG_W / 2, 40, SVG_W * 0.92, 0, 0);

/* ── Page ───────────────────────────────────────────────────── */
export default function TreeOfLifePage() {
  const [selected, setSelected] = useState<LayoutNode | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = useCallback((n: LayoutNode) => {
    setSelected(prev => (prev?.id === n.id ? null : n));
  }, []);

  return (
    <div style={S.root} suppressHydrationWarning>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>Tree of Life</h1>
        <p style={S.subtitle}>Click any node to learn about it</p>
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

          {/* Lines */}
          {nodes.filter(n => n.parentX !== undefined).map((n, i) => {
            const midY = (n.y + (n.parentY || 0)) / 2;
            return (
              <path
                key={`line-${i}`}
                d={`M${n.parentX},${n.parentY} C${n.parentX},${midY} ${n.x},${midY} ${n.x},${n.y}`}
                fill="none"
                stroke={selected?.id === n.id || hovered === n.id ? n.color : "rgba(57,255,20,0.15)"}
                strokeWidth={selected?.id === n.id || hovered === n.id ? 2.5 : 1.2}
                className="tree-line"
                style={{ animationDelay: `${n.animDelay}s` }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const isActive = selected?.id === n.id || hovered === n.id;
            const r = n.depth === 0 ? 22 : n.depth <= 2 ? 16 : 11;
            return (
              <g
                key={n.id}
                className="tree-node"
                style={{ animationDelay: `${n.animDelay + 0.1}s`, cursor: "none" }}
                onClick={() => handleClick(n)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Invisible hit area */}
                <circle cx={n.x} cy={n.y} r={r + 12} fill="transparent" />
                {/* Glow ring */}
                {isActive && (
                  <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.3} filter="url(#glow)" />
                )}
                {/* Circle */}
                <circle
                  cx={n.x} cy={n.y} r={isActive ? r + 3 : r}
                  fill={isActive ? n.color : `${n.color}25`}
                  stroke={n.color}
                  strokeWidth={isActive ? 2 : 1.2}
                  style={{ transition: "all 0.3s ease" }}
                />
                {/* Label */}
                <text
                  x={n.x}
                  y={n.y + r + 14}
                  textAnchor="middle"
                  fill={isActive ? n.color : "rgba(200,245,200,0.65)"}
                  fontSize={n.depth <= 1 ? 11 : 9}
                  fontWeight={n.depth <= 1 ? 600 : 400}
                  fontFamily="system-ui"
                  style={{ transition: "fill 0.3s ease" }}
                >
                  {n.label}
                </text>
                {/* Abbreviation in circle for major nodes */}
                {NODE_ABBR[n.id] && n.depth <= 2 && (
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.depth === 0 ? 12 : 9} fontWeight={700} fontFamily="system-ui" dominantBaseline="middle" fill={n.color}>
                    {NODE_ABBR[n.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info Panel */}
      <div style={{ ...S.panel, transform: selected?.info ? "translateX(0)" : "translateX(110%)", opacity: selected?.info ? 1 : 0 }}>
        {selected?.info && (
          <>
            <button style={S.panelClose} onClick={() => setSelected(null)}>X</button>
            <div style={{ ...S.panelBadge, background: `${selected.color}18`, borderColor: `${selected.color}40` }}>
              {NODE_EMOJI[selected.id] || "?"}
            </div>
            <h3 style={{ ...S.panelName, color: selected.color }}>{selected.label}</h3>
            <div style={{ width: 30, height: 2, background: selected.color, borderRadius: 1, margin: "0 auto 14px", boxShadow: `0 0 8px ${selected.color}60` }} />
            <div style={S.panelCard}>
              <span style={S.panelLabel}>Description</span>
              <p style={S.panelText}>{selected.info}</p>
            </div>
          </>
        )}
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
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodeIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .tree-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: lineGrow 0.8s ease-out forwards;
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
  root: { position: "relative", width: "100%", minHeight: "calc(100vh - 64px)", background: "#050A05", overflow: "hidden", display: "flex", flexDirection: "column" },

  header: { textAlign: "center", padding: "24px 20px 0", zIndex: 10 },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "#39FF14", letterSpacing: "0.06em", margin: 0, textShadow: "0 0 20px rgba(57,255,20,0.3)" },
  subtitle: { fontSize: "0.75rem", color: "rgba(200,245,200,0.45)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  treeWrap: { flex: 1, padding: "10px 20px 20px", overflowX: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start" },
  svg: { width: "100%", maxWidth: 1400, height: "auto", minHeight: 450 },

  panel: {
    position: "fixed", top: 64, right: 0, width: "min(320px, 80vw)", height: "calc(100vh - 64px)", zIndex: 30,
    background: "rgba(5,10,5,0.92)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(57,255,20,0.1)",
    padding: "48px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
    transition: "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease", overflowY: "auto",
  },
  panelClose: { position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(200,245,200,0.4)", fontSize: "1rem", cursor: "none", fontFamily: "inherit" },
  panelBadge: { width: 56, height: 56, borderRadius: 16, border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" },
  panelName: { fontSize: "1.3rem", fontWeight: 700, margin: 0, textAlign: "center" },
  panelCard: { width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" },
  panelLabel: { fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(200,245,200,0.4)" },
  panelText: { fontSize: "0.88rem", color: "rgba(200,245,200,0.8)", lineHeight: 1.6, margin: "6px 0 0" },

  legend: { position: "fixed", bottom: 20, left: 20, zIndex: 10, display: "flex", flexDirection: "column", gap: 3, padding: "10px 14px", borderRadius: 10, background: "rgba(5,10,5,0.7)", border: "1px solid rgba(57,255,20,0.08)", backdropFilter: "blur(8px)" },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
};
