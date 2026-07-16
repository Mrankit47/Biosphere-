"use client";

import React, { useState } from "react";

/* ─────────────── Food Chain Data ─────────────── */
interface Organism {
  name: string;
  emoji: string;
  role: string;
  detail: string;
  topPct: number;   // % from top
  leftPct: number;  // % from left
  color: string;    // border / glow color
}

interface FoodChainData {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
  overlayColor: string;
  organisms: Organism[];
  equation: string;
  funFact: string;
}

const CHAINS: FoodChainData[] = [
  {
    id: "grassland",
    title: "GRASSLAND FOOD CHAIN",
    subtitle: "Energy flows from sun-powered grasses through herbivores to apex predators",
    bg: "/assets/food-chain-grassland.png",
    accent: "#4ADE80",
    overlayColor: "rgba(10, 30, 10, 0.55)",
    equation: "Sun → Grass → Grasshopper → Frog → Snake → Hawk",
    funFact: "Only ~10% of energy is transferred between each trophic level — 90% is lost as heat.",
    organisms: [
      { name: "Sun", emoji: "☀️", role: "Energy Source", detail: "Powers all life on Earth via photosynthesis. Plants capture only ~1% of solar energy.", topPct: 8, leftPct: 10, color: "#FBBF24" },
      { name: "Grass", emoji: "🌿", role: "Producer", detail: "Autotroph: converts CO₂ + H₂O + sunlight into glucose (C₆H₁₂O₆) and oxygen.", topPct: 30, leftPct: 8, color: "#22C55E" },
      { name: "Grasshopper", emoji: "🦗", role: "Primary Consumer", detail: "Herbivore. Feeds on grass and plant matter. Receives ~10% of the producer's energy.", topPct: 50, leftPct: 22, color: "#84CC16" },
      { name: "Frog", emoji: "🐸", role: "Secondary Consumer", detail: "Insectivore carnivore. Preys on grasshoppers and small insects. ~1% of original energy.", topPct: 45, leftPct: 45, color: "#10B981" },
      { name: "Snake", emoji: "🐍", role: "Tertiary Consumer", detail: "Carnivore. Ambush predator that hunts frogs, lizards and rodents. ~0.1% energy.", topPct: 65, leftPct: 55, color: "#92400E" },
      { name: "Hawk", emoji: "🦅", role: "Apex Predator", detail: "Top predator with no natural enemies. Controls snake and rodent populations. ~0.01% energy.", topPct: 15, leftPct: 65, color: "#78350F" },
    ],
  },
  {
    id: "pond",
    title: "POND FOOD CHAIN",
    subtitle: "Freshwater ecosystems powered by microscopic algae",
    bg: "/assets/food-chain-pond.png",
    accent: "#60A5FA",
    overlayColor: "rgba(5, 20, 50, 0.55)",
    equation: "Phytoplankton → Zooplankton → Small Fish → Large Fish → Heron",
    funFact: "A single pond can contain millions of phytoplankton per litre of water.",
    organisms: [
      { name: "Phytoplankton", emoji: "🦠", role: "Producer", detail: "Microscopic algae that photosynthesize. Foundation of aquatic food webs.", topPct: 12, leftPct: 12, color: "#22D3EE" },
      { name: "Zooplankton", emoji: "🔬", role: "Primary Consumer", detail: "Tiny animals that graze on phytoplankton. Include copepods and rotifers.", topPct: 25, leftPct: 40, color: "#67E8F9" },
      { name: "Small Fish", emoji: "🐟", role: "Secondary Consumer", detail: "Minnows and juvenile fish that feed on zooplankton and insect larvae.", topPct: 50, leftPct: 18, color: "#38BDF8" },
      { name: "Large Fish", emoji: "🐠", role: "Tertiary Consumer", detail: "Predatory fish like bass or pike that hunt smaller fish.", topPct: 55, leftPct: 55, color: "#2563EB" },
      { name: "Heron", emoji: "🦢", role: "Apex Predator", detail: "Wading bird that spears fish with its sharp beak. Top of pond food chain.", topPct: 20, leftPct: 70, color: "#E0E7FF" },
    ],
  },
  {
    id: "forest",
    title: "FOREST FOOD CHAIN",
    subtitle: "Complex food webs in temperate and tropical forests",
    bg: "/assets/food-chain-forest.png",
    accent: "#34D399",
    overlayColor: "rgba(5, 25, 15, 0.55)",
    equation: "Leaves → Caterpillar → Small Bird → Snake → Owl",
    funFact: "Forest canopies can block up to 95% of sunlight from reaching the forest floor.",
    organisms: [
      { name: "Leaves", emoji: "🍃", role: "Producer", detail: "Trees produce glucose via photosynthesis. A mature oak produces ~100kg of acorns yearly.", topPct: 10, leftPct: 15, color: "#16A34A" },
      { name: "Caterpillar", emoji: "🐛", role: "Primary Consumer", detail: "Herbivore larva. Eats 27,000× its body weight in leaves before metamorphosis.", topPct: 35, leftPct: 8, color: "#65A30D" },
      { name: "Small Bird", emoji: "🐦", role: "Secondary Consumer", detail: "Insectivores like Blue Tits eat ~100 caterpillars per day during breeding.", topPct: 30, leftPct: 50, color: "#0EA5E9" },
      { name: "Snake", emoji: "🐍", role: "Tertiary Consumer", detail: "Arboreal snakes that ambush nesting birds and steal eggs.", topPct: 60, leftPct: 35, color: "#78350F" },
      { name: "Owl", emoji: "🦉", role: "Apex Predator", detail: "Nocturnal hunter with silent flight. Can rotate head 270°. No natural predators.", topPct: 15, leftPct: 72, color: "#D97706" },
    ],
  },
  {
    id: "ocean",
    title: "OCEAN FOOD CHAIN",
    subtitle: "Marine ecosystems — the planet's largest biome",
    bg: "/assets/food-chain-ocean.png",
    accent: "#38BDF8",
    overlayColor: "rgba(2, 10, 40, 0.55)",
    equation: "Phytoplankton → Krill → Tuna → Shark",
    funFact: "Ocean phytoplankton produce over 50% of the world's oxygen — more than all forests combined.",
    organisms: [
      { name: "Phytoplankton", emoji: "🦠", role: "Producer", detail: "Marine microalgae producing 50% of Earth's O₂. Foundation of ocean food web.", topPct: 10, leftPct: 10, color: "#34D399" },
      { name: "Krill", emoji: "🦐", role: "Primary Consumer", detail: "Tiny crustaceans (1-6cm). Swarms can weigh up to 2 million tonnes.", topPct: 35, leftPct: 30, color: "#FB923C" },
      { name: "Tuna", emoji: "🐟", role: "Secondary Consumer", detail: "Fast predatory fish reaching 70 km/h. Warm-blooded for extra speed.", topPct: 55, leftPct: 15, color: "#3B82F6" },
      { name: "Shark", emoji: "🦈", role: "Apex Predator", detail: "Apex predators for 400 million years. Electroreception detects prey's heartbeat.", topPct: 60, leftPct: 60, color: "#64748B" },
    ],
  },
  {
    id: "desert",
    title: "DESERT FOOD CHAIN",
    subtitle: "Survival in extreme heat and water scarcity",
    bg: "/assets/food-chain-desert.png",
    accent: "#FBBF24",
    overlayColor: "rgba(40, 25, 5, 0.55)",
    equation: "Cactus → Grasshopper → Lizard → Snake → Vulture",
    funFact: "Desert organisms have evolved to survive on as little as 25mm of rainfall per year.",
    organisms: [
      { name: "Cactus", emoji: "🌵", role: "Producer", detail: "Stores water in fleshy stems. Spines are modified leaves that reduce water loss.", topPct: 15, leftPct: 10, color: "#22C55E" },
      { name: "Grasshopper", emoji: "🦗", role: "Primary Consumer", detail: "Desert-adapted herbivore. Gets water from plant matter instead of drinking.", topPct: 35, leftPct: 35, color: "#84CC16" },
      { name: "Lizard", emoji: "🦎", role: "Secondary Consumer", detail: "Cold-blooded insectivore. Basks in sun to regulate body temperature.", topPct: 55, leftPct: 12, color: "#A3A328" },
      { name: "Snake", emoji: "🐍", role: "Tertiary Consumer", detail: "Sidewinder or rattlesnake. Heat-sensing pits detect prey in darkness.", topPct: 60, leftPct: 55, color: "#92400E" },
      { name: "Vulture", emoji: "🦅", role: "Apex Predator / Scavenger", detail: "Soars on thermals. Stomach acid pH ~1 destroys bacteria in carrion.", topPct: 12, leftPct: 68, color: "#78350F" },
    ],
  },
];

/* ─────────────── Arrow SVG Component ─────────────── */
function FlowArrow({ from, to, color }: { from: Organism; to: Organism; color: string }) {
  const x1 = from.leftPct + 3;
  const y1 = from.topPct + 3;
  const x2 = to.leftPct + 3;
  const y2 = to.topPct + 3;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 3;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <marker id={`arrowhead-${from.name}-${to.name}`} markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={color} opacity="0.8" />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="0.3"
        strokeDasharray="1,0.6"
        opacity="0.6"
        markerEnd={`url(#arrowhead-${from.name}-${to.name})`}
      >
        <animate attributeName="stroke-dashoffset" from="4" to="0" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* ─────────────── Organism Node ─────────────── */
function OrganismNode({ org, isActive, onHover, onLeave }: {
  org: Organism;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="absolute z-10 pointer-events-auto cursor-pointer group"
      style={{ top: `${org.topPct}%`, left: `${org.leftPct}%` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Glowing circle */}
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 border-2"
        style={{
          borderColor: org.color,
          backgroundColor: `${org.color}20`,
          boxShadow: isActive
            ? `0 0 25px ${org.color}60, 0 0 50px ${org.color}30`
            : `0 0 15px ${org.color}30`,
          transform: isActive ? "scale(1.15)" : "scale(1)",
        }}
      >
        <span className="text-2xl md:text-3xl">{org.emoji}</span>
      </div>

      {/* Label */}
      <div className="mt-1.5 text-center">
        <span
          className="text-xs md:text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            color: org.color,
            textShadow: "0 2px 8px rgba(0,0,0,1)",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          {org.name}
        </span>
      </div>

      {/* Tooltip */}
      {isActive && (
        <div
          className="absolute z-30 w-56 p-3 rounded-xl border backdrop-blur-xl shadow-2xl"
          style={{
            top: "-10px",
            left: "80px",
            backgroundColor: "rgba(0,0,0,0.88)",
            borderColor: `${org.color}40`,
          }}
        >
          <h4 className="text-white font-bold text-sm">{org.name}</h4>
          <p
            className="text-[10px] uppercase tracking-[2px] font-semibold mt-0.5"
            style={{ color: org.color }}
          >
            {org.role}
          </p>
          <p className="text-white/70 text-xs mt-1.5 leading-relaxed">{org.detail}</p>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function FoodChainPage() {
  const [activeChainIdx, setActiveChainIdx] = useState(0);
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);

  const chain = CHAINS[activeChainIdx];

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden rounded-xl bg-black font-sans shadow-2xl mt-4">

      {/* ── Background Image (changes per chain) ── */}
      <div
        key={chain.id}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 scale-105"
        style={{ backgroundImage: `url('${chain.bg}')` }}
      />

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: chain.overlayColor }}
      />

      {/* ── Main container ── */}
      <div className="relative w-full h-full max-w-[1600px] mx-auto">

        {/* ── Title ── */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <h1
            className="text-2xl md:text-4xl font-extrabold tracking-tight transition-colors duration-500"
            style={{
              color: chain.accent,
              textShadow: `0 2px 20px ${chain.accent}50, 0 4px 10px rgba(0,0,0,0.8)`,
            }}
          >
            {chain.title}
          </h1>
          <p className="text-white/80 text-xs md:text-sm mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-md mx-auto">
            {chain.subtitle}
          </p>
        </div>

        {/* ── Chain Selector Tabs ── */}
        <div className="absolute top-20 md:top-[76px] left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2 flex-wrap justify-center px-2">
          {CHAINS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setActiveChainIdx(i); setHoveredOrg(null); }}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border backdrop-blur-md ${
                activeChainIdx === i
                  ? "bg-white/15 text-white shadow-lg scale-105"
                  : "bg-black/30 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
              }`}
              style={{
                borderColor: activeChainIdx === i ? c.accent : undefined,
                boxShadow: activeChainIdx === i ? `0 0 18px ${c.accent}40` : undefined,
              }}
            >
              {c.id.charAt(0).toUpperCase() + c.id.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Organism Nodes ── */}
        {chain.organisms.map((org) => (
          <OrganismNode
            key={org.name}
            org={org}
            isActive={hoveredOrg === org.name}
            onHover={() => setHoveredOrg(org.name)}
            onLeave={() => setHoveredOrg(null)}
          />
        ))}

        {/* ── Flow Arrows ── */}
        {chain.organisms.slice(0, -1).map((org, i) => (
          <FlowArrow
            key={`${org.name}-${chain.organisms[i + 1].name}`}
            from={org}
            to={chain.organisms[i + 1]}
            color={chain.accent}
          />
        ))}

        {/* ── Bottom-left: Equation Panel ── */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
          <div
            className="backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)] border w-72 md:w-80"
            style={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: `${chain.accent}30` }}
          >
            <div
              className="px-4 py-2 border-b"
              style={{ backgroundColor: `${chain.accent}15`, borderColor: `${chain.accent}30` }}
            >
              <h3
                className="font-bold text-center text-xs tracking-[3px] uppercase"
                style={{ color: chain.accent }}
              >
                Energy Flow
              </h3>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-white/90 text-xs md:text-sm font-mono text-center leading-relaxed tracking-wide">
                {chain.equation}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-white/50 text-[10px] leading-relaxed">
                  <span className="text-yellow-400 font-bold">💡 Fun Fact:</span> {chain.funFact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom-right: Key Concepts Panel ── */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <div
            className="backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)] border w-64 md:w-72"
            style={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: `${chain.accent}30` }}
          >
            <div
              className="px-4 py-2 border-b"
              style={{ backgroundColor: `${chain.accent}15`, borderColor: `${chain.accent}30` }}
            >
              <h3
                className="font-bold text-center text-xs tracking-[3px] uppercase"
                style={{ color: chain.accent }}
              >
                Key Concepts
              </h3>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {[
                { label: "Producers", desc: "Autotrophs — make their own food", color: "#4ADE80" },
                { label: "Consumers", desc: "Heterotrophs — eat other organisms", color: "#FBBF24" },
                { label: "Decomposers", desc: "Break down dead organic matter", color: "#A3714F" },
                { label: "10% Rule", desc: "90% of energy lost as heat at each level", color: "#F87171" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  <div
                    className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-white/90 text-[11px] font-semibold">{item.label}: </span>
                    <span className="text-white/50 text-[10px]">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Top-right: Trophic Level badges ── */}
        <div className="absolute top-28 md:top-[110px] right-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          {chain.organisms.map((org, i) => (
            <div
              key={org.name}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg backdrop-blur-md border transition-all"
              style={{
                backgroundColor: hoveredOrg === org.name ? `${org.color}25` : "rgba(0,0,0,0.5)",
                borderColor: hoveredOrg === org.name ? `${org.color}50` : "rgba(255,255,255,0.08)",
                transform: hoveredOrg === org.name ? "translateX(-4px)" : "none",
              }}
            >
              <span className="text-sm">{org.emoji}</span>
              <div>
                <p className="text-white/90 text-[10px] font-bold leading-tight">{org.name}</p>
                <p className="text-white/40 text-[8px] uppercase tracking-wider">{org.role}</p>
              </div>
              {i < chain.organisms.length - 1 && (
                <span className="text-white/20 text-[10px] ml-1">↓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
