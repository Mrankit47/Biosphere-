"use client";

import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

type Organism = { name: string; role: string };
type TrophicLevel = {
  level: number;
  name: string;
  color: string;
  desc: string;
  energy: string;
  organisms: Organism[];
};
type Biome = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  climate: string;
  location: string;
  facts: string[];
  trophicLevels: TrophicLevel[];
};

const BIOMES: Biome[] = [
  {
    id: "forest",
    name: "Temperate Forest",
    emoji: "🌲",
    color: "#10B981",
    climate: "Moderate temperatures, 75–150 cm rainfall/year, four distinct seasons",
    location: "Eastern North America, Western Europe, East Asia",
    facts: [
      "Temperate forests lose their leaves in autumn, recycling nutrients back to the soil.",
      "A single oak tree can support over 2,300 species of insects, birds, and mammals.",
      "These forests act as massive carbon sinks, absorbing billions of tons of CO₂ annually.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Make their own food via photosynthesis", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Oak Trees", role: "Photosynthesis, oxygen production, habitat" }, { name: "Ferns", role: "Ground cover, soil stabilization" }, { name: "Moss", role: "Moisture retention, microhabitat" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Herbivores that eat producers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Deer", role: "Browsers, seed dispersal" }, { name: "Rabbits", role: "Grazers, prey base" }, { name: "Squirrels", role: "Seed caching, forest regeneration" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Carnivores that eat herbivores", energy: "1% transferred (100 kcal)", organisms: [{ name: "Foxes", role: "Population control of small mammals" }, { name: "Hawks", role: "Aerial predator, rodent control" }, { name: "Snakes", role: "Control rodent and insect populations" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Bears", role: "Omnivorous apex, seed dispersal" }, { name: "Wolves", role: "Pack hunters, ecosystem regulators" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle nutrients back to soil", energy: "Energy cycle complete", organisms: [{ name: "Fungi", role: "Break down dead organic matter" }, { name: "Bacteria", role: "Nutrient mineralization" }, { name: "Earthworms", role: "Soil aeration and mixing" }] },
    ],
  },
  {
    id: "ocean",
    name: "Ocean Ecosystem",
    emoji: "🌊",
    color: "#3B82F6",
    climate: "Varies widely; surface 0–30°C, pressure increases with depth",
    location: "Covers 71% of Earth's surface — Pacific, Atlantic, Indian, Arctic, Southern Oceans",
    facts: [
      "Phytoplankton produce over 50% of Earth's oxygen — more than all forests combined.",
      "The ocean absorbs about 30% of CO₂ produced by humans, buffering climate change.",
      "Over 80% of the ocean remains unexplored and unmapped.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Make their own food via photosynthesis", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Phytoplankton", role: "Microscopic photosynthesizers, O₂ production" }, { name: "Kelp", role: "Underwater forests, habitat" }, { name: "Seagrass", role: "Coastal nursery grounds" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Herbivores that eat producers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Zooplankton", role: "Feed on phytoplankton, base of food web" }, { name: "Krill", role: "Critical link, whale food source" }, { name: "Small Fish", role: "Schooling prey fish" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Carnivores that eat herbivores", energy: "1% transferred (100 kcal)", organisms: [{ name: "Tuna", role: "Fast pelagic predator" }, { name: "Squid", role: "Versatile mid-level predator" }, { name: "Jellyfish", role: "Plankton and small fish consumer" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Sharks", role: "Apex predator, population regulation" }, { name: "Orcas", role: "Intelligent pack hunters" }, { name: "Great Whales", role: "Filter feeders, nutrient cycling" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle nutrients back to water column", energy: "Energy cycle complete", organisms: [{ name: "Marine Bacteria", role: "Break down organic detritus" }, { name: "Crabs", role: "Scavengers of the seafloor" }, { name: "Sea Cucumbers", role: "Sediment recyclers" }] },
    ],
  },
  {
    id: "desert",
    name: "Desert",
    emoji: "🏜️",
    color: "#F59E0B",
    climate: "Extreme heat (up to 58°C), <25 cm rainfall/year, huge day-night swings",
    location: "Sahara, Mojave, Gobi, Atacama, Arabian Peninsula",
    facts: [
      "The Sahara Desert was green just 6,000 years ago, with lakes and lush vegetation.",
      "Desert plants like cacti can store hundreds of liters of water in their stems.",
      "Many desert animals are nocturnal, avoiding the extreme daytime heat.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Make their own food via photosynthesis", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Cacti", role: "Water storage, photosynthesis" }, { name: "Sagebrush", role: "Drought-resistant shrub" }, { name: "Desert Wildflowers", role: "Seasonal bloom after rains" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Herbivores that eat producers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Jackrabbits", role: "Fast browsers, heat-dissipating ears" }, { name: "Desert Tortoise", role: "Slow herbivore, burrow creator" }, { name: "Kangaroo Rats", role: "Seed eaters, no water needed" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Carnivores that eat herbivores", energy: "1% transferred (100 kcal)", organisms: [{ name: "Rattlesnakes", role: "Ambush predator, rodent control" }, { name: "Roadrunners", role: "Fast ground predator" }, { name: "Coyotes", role: "Adaptable omnivore-predator" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Golden Eagles", role: "Powerful aerial apex predator" }, { name: "Mountain Lions", role: "Stealthy large cat predator" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle nutrients back to soil", energy: "Energy cycle complete", organisms: [{ name: "Desert Beetles", role: "Break down dead plant matter" }, { name: "Fungi", role: "Decompose organic material" }, { name: "Bacteria", role: "Nutrient mineralization" }] },
    ],
  },
  {
    id: "savanna",
    name: "Grassland Savanna",
    emoji: "🌾",
    color: "#84CC16",
    climate: "Warm year-round, 50–130 cm seasonal rainfall, wet and dry seasons",
    location: "Sub-Saharan Africa, Brazilian Cerrado, Australian Outback, Indian Savanna",
    facts: [
      "The Serengeti migration involves 1.5 million wildebeest traveling 800 km annually.",
      "Savanna fires are essential — they prevent forests from encroaching and recycle nutrients.",
      "African savannas support the greatest diversity of large mammals on Earth.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Make their own food via photosynthesis", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Grasses", role: "Fast-growing ground cover" }, { name: "Wildflowers", role: "Pollinator attractors" }, { name: "Acacia Trees", role: "Nitrogen fixation, shade" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Herbivores that eat producers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Zebras", role: "Grazer, migratory herds" }, { name: "Wildebeest", role: "Mass migration, grazing" }, { name: "Prairie Dogs", role: "Burrowing, soil aeration" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Carnivores that eat herbivores", energy: "1% transferred (100 kcal)", organisms: [{ name: "Cheetahs", role: "Fastest land predator" }, { name: "Hyenas", role: "Pack scavenger-predators" }, { name: "Hawks", role: "Aerial rodent hunters" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Lions", role: "Pride hunters, apex predator" }, { name: "Leopards", role: "Solitary ambush predator" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle nutrients back to soil", energy: "Energy cycle complete", organisms: [{ name: "Dung Beetles", role: "Recycle animal waste" }, { name: "Termites", role: "Break down cellulose" }, { name: "Vultures", role: "Scavenge carcasses, sanitation" }] },
    ],
  },
];

const ENERGY_STEPS = [
  { label: "Sun", val: "" },
  { label: "Plants", val: "10,000 kcal" },
  { label: "Herbivore", val: "1,000 kcal" },
  { label: "Carnivore", val: "100 kcal" },
  { label: "Apex", val: "10 kcal" },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function BiomeCard({ biome, active, onClick }: { biome: Biome; active: boolean; onClick: () => void }) {
  return (
    <button className={`eco-biome-card ${active ? "active" : ""}`} style={{ "--bc": biome.color } as React.CSSProperties} onClick={onClick} aria-label={`Select ${biome.name}`}>
      <span className="eco-biome-emoji">{biome.emoji}</span>
      <span className="eco-biome-name">{biome.name}</span>
      <span className="eco-biome-climate">{biome.climate.split(",")[0]}</span>
    </button>
  );
}

function TrophicLevelCard({ tl, biomeColor }: { tl: TrophicLevel; biomeColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`eco-tl ${open ? "open" : ""}`} style={{ "--tlc": tl.color } as React.CSSProperties}>
      <button className="eco-tl-header" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={`Level ${tl.level}: ${tl.name}`}>
        <div className="eco-tl-left">
          <span className="eco-tl-badge">L{tl.level}</span>
          <div>
            <strong className="eco-tl-name">{tl.name}</strong>
            <span className="eco-tl-desc">{tl.desc}</span>
          </div>
        </div>
        <div className="eco-tl-right">
          <span className="eco-tl-energy">{tl.energy}</span>
          <span className={`eco-tl-chevron ${open ? "open" : ""}`}>▾</span>
        </div>
      </button>
      <div className="eco-tl-body" style={{ maxHeight: open ? `${tl.organisms.length * 80 + 32}px` : "0" }}>
        <div className="eco-org-grid">
          {tl.organisms.map((o) => (
            <div key={o.name} className="eco-org-card" style={{ backgroundColor: `${tl.color}18`, borderColor: `${tl.color}35` }}>
              <span className="eco-org-name" style={{ color: tl.color }}>{o.name}</span>
              <span className="eco-org-role">{o.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function EcosystemsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const biome = BIOMES.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="eco-root">
      {/* HERO */}
      <section className="eco-hero">
        <h1 className="eco-title">Explore Ecosystems</h1>
        <p className="eco-subtitle">Discover how energy flows through nature&apos;s food webs</p>
      </section>

      {/* BIOME SELECTOR */}
      <section className="eco-section">
        <div className="eco-biome-grid">
          {BIOMES.map((b) => (
            <BiomeCard key={b.id} biome={b} active={selectedId === b.id} onClick={() => setSelectedId(selectedId === b.id ? null : b.id)} />
          ))}
        </div>
      </section>

      {/* BIOME DETAILS */}
      {biome && (
        <section className="eco-section eco-details" style={{ backgroundColor: `${biome.color}0D`, borderColor: `${biome.color}30` }}>
          <h2 className="eco-detail-title" style={{ color: biome.color }}>
            {biome.emoji} {biome.name}
          </h2>
          <p className="eco-detail-text"><strong>Climate:</strong> {biome.climate}</p>
          <p className="eco-detail-text"><strong>Location:</strong> {biome.location}</p>

          {/* Energy Flow */}
          <div className="eco-energy-flow">
            {ENERGY_STEPS.map((s, i) => (
              <span key={i} className="eco-energy-step">
                <span className="eco-energy-label">{s.label}</span>
                {s.val && <span className="eco-energy-val">{s.val}</span>}
                {i < ENERGY_STEPS.length - 1 && <span className="eco-energy-arrow">→</span>}
              </span>
            ))}
          </div>

          {/* Key Facts */}
          <div className="eco-facts">
            {biome.facts.map((f, i) => (
              <p key={i} className="eco-fact">• {f}</p>
            ))}
          </div>
        </section>
      )}

      {/* FOOD WEB */}
      {biome && (
        <section className="eco-section">
          <h2 className="eco-fw-title">Food Web — Click to Explore</h2>
          <div className="eco-tl-list">
            {biome.trophicLevels.map((tl) => (
              <TrophicLevelCard key={tl.level} tl={tl} biomeColor={biome.color} />
            ))}
          </div>
        </section>
      )}

      {/* EDUCATIONAL PANEL */}
      <section className="eco-section eco-edu">
        <h2 className="eco-edu-title">🔬 The 10% Rule of Energy Transfer</h2>
        <p className="eco-edu-text">
          When energy moves from one trophic level to the next, only about <strong style={{ color: "#39FF14" }}>10%</strong> is transferred. The rest is lost as heat through metabolic processes (cellular respiration).
        </p>
        <div className="eco-edu-calc">
          <code>Sun → 10,000 kcal → Plants absorb</code>
          <code>Plants → 1,000 kcal → Herbivores eat (90% lost as heat)</code>
          <code>Herbivores → 100 kcal → Carnivores eat (90% lost as heat)</code>
          <code>Carnivores → 10 kcal → Apex predators eat (90% lost as heat)</code>
        </div>
        <p className="eco-edu-text">
          This is why food chains rarely exceed <strong style={{ color: "#39FF14" }}>5 levels</strong> — there simply isn&apos;t enough energy left to support another tier of predators. It also explains why apex predators like lions and eagles are always rare compared to the herbivores they feed on.
        </p>
      </section>

      {/* STYLES */}
      <style>{`
        .eco-root {
          width: 100%;
          min-height: calc(100vh - 64px);
          background: #050A05;
          color: #C8F5C8;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .eco-hero {
          text-align: center;
          padding: 72px 24px 40px;
          background: linear-gradient(180deg, rgba(57,255,20,0.04) 0%, transparent 100%);
        }

        .eco-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          color: #39FF14;
          margin: 0 0 12px;
          text-shadow: 0 0 30px rgba(57,255,20,0.25);
        }

        .eco-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.2rem);
          color: rgba(200,245,200,0.6);
          margin: 0;
          letter-spacing: 0.04em;
        }

        .eco-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px clamp(16px, 4vw, 40px);
        }

        /* BIOME SELECTOR */
        .eco-biome-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .eco-biome-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 28px 16px;
          border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(10,20,10,0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          color: inherit;
        }

        .eco-biome-card:hover {
          transform: scale(1.04);
          border-color: var(--bc);
          background: rgba(10,20,10,0.9);
        }

        .eco-biome-card.active {
          border-color: var(--bc);
          background: color-mix(in srgb, var(--bc) 10%, #050A05);
          box-shadow: 0 0 24px color-mix(in srgb, var(--bc) 25%, transparent);
        }

        .eco-biome-emoji { font-size: 2.5rem; }
        .eco-biome-name { font-weight: 700; font-size: 1rem; }
        .eco-biome-climate { font-size: 0.75rem; color: rgba(200,245,200,0.45); text-align: center; line-height: 1.4; }

        /* BIOME DETAILS */
        .eco-details {
          border-radius: 16px;
          border: 1px solid;
          margin-top: 8px;
        }

        .eco-detail-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 16px;
        }

        .eco-detail-text {
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(200,245,200,0.75);
          margin: 0 0 8px;
        }

        .eco-energy-flow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin: 20px 0;
          padding: 16px;
          border-radius: 10px;
          background: rgba(0,0,0,0.3);
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
        }

        .eco-energy-step {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .eco-energy-label {
          color: #C8F5C8;
          font-weight: 700;
        }

        .eco-energy-val {
          color: #39FF14;
          font-size: 0.75rem;
        }

        .eco-energy-arrow {
          color: rgba(57,255,20,0.5);
          animation: arrowPulse 1.5s ease-in-out infinite;
        }

        @keyframes arrowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; color: #39FF14; }
        }

        .eco-facts {
          margin-top: 12px;
        }

        .eco-fact {
          font-size: 0.88rem;
          color: rgba(200,245,200,0.65);
          line-height: 1.6;
          margin: 0 0 6px;
        }

        /* FOOD WEB */
        .eco-fw-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #C8F5C8;
          margin: 0 0 20px;
        }

        .eco-tl-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .eco-tl {
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(10,20,10,0.5);
          overflow: hidden;
          border-left: 4px solid var(--tlc);
          transition: border-color 0.3s;
        }

        .eco-tl.open {
          border-color: var(--tlc);
        }

        .eco-tl-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          font-family: inherit;
          gap: 12px;
        }

        .eco-tl-left {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }

        .eco-tl-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--tlc);
          color: #000;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .eco-tl-name {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #C8F5C8;
        }

        .eco-tl-desc {
          display: block;
          font-size: 0.78rem;
          color: rgba(200,245,200,0.5);
          margin-top: 2px;
        }

        .eco-tl-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .eco-tl-energy {
          font-size: 0.75rem;
          color: var(--tlc);
          font-weight: 600;
          font-family: monospace;
        }

        .eco-tl-chevron {
          font-size: 1.2rem;
          color: rgba(200,245,200,0.4);
          transition: transform 0.3s ease;
        }

        .eco-tl-chevron.open {
          transform: rotate(180deg);
        }

        .eco-tl-body {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .eco-org-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          padding: 0 20px 20px;
        }

        .eco-org-card {
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid;
        }

        .eco-org-name {
          display: block;
          font-weight: 700;
          font-size: 0.92rem;
          margin-bottom: 4px;
        }

        .eco-org-role {
          font-size: 0.8rem;
          color: rgba(200,245,200,0.55);
          line-height: 1.4;
        }

        /* EDUCATIONAL PANEL */
        .eco-edu {
          margin-top: 16px;
          margin-bottom: 40px;
          background: rgba(57,255,20,0.05);
          border: 1px solid rgba(57,255,20,0.12);
          border-radius: 16px;
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }

        .eco-edu-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #39FF14;
          margin: 0 0 16px;
        }

        .eco-edu-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(200,245,200,0.75);
          margin: 0 0 16px;
        }

        .eco-edu-calc {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px;
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          margin-bottom: 16px;
        }

        .eco-edu-calc code {
          font-size: 0.82rem;
          color: rgba(200,245,200,0.7);
          font-family: 'Courier New', monospace;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .eco-biome-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .eco-tl-energy {
            display: none;
          }
          .eco-org-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .eco-biome-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
