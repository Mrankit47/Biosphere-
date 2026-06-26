"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   DATA STRUCTURES
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

const ECOSYSTEM_COMPONENTS = {
  sun: {
    name: "Sun",
    type: "Abiotic Component",
    emoji: "☀️",
    color: "#F59E0B",
    desc: "The primary source of electromagnetic radiation driving photosynthesis in producers, warming the climate, and facilitating hydrological evaporation cycles.",
    roles: [
      "Powers chloroplast reactions in plants",
      "Supplies raw thermal energy to evaporate water",
      "Maintains overall temperature bounds for life"
    ]
  },
  water: {
    name: "Water (Hydrosphere)",
    type: "Abiotic Component",
    emoji: "💧",
    color: "#3B82F6",
    desc: "The universal chemical solvent required for metabolic activity. Cycles dynamically through condensation, runoff, absorption, transpiration, and evaporation.",
    roles: [
      "Medium for nutrient transport in organisms",
      "Acts as a reactant in photosynthetic reduction",
      "Dampens temperature swings (high specific heat)"
    ]
  },
  soil: {
    name: "Soil & Nutrients (Geosphere)",
    type: "Abiotic Component",
    emoji: "🪵",
    color: "#8D6E63",
    desc: "A rich structure of mineral fragments, organic debris, air, and water. Serves as anchor for terrestrial roots and an inorganic nutrient storehouse.",
    roles: [
      "Provides substrate anchorage for producers",
      "Filters and stores moisture in root zones",
      "Reservoir of nitrogen, phosphates, and minerals"
    ]
  },
  atmosphere: {
    name: "Atmosphere & Gases",
    type: "Abiotic Component",
    emoji: "☁️",
    color: "#90A4AE",
    desc: "The gas envelope shielding the earth. Stores massive carbon dioxide (CO₂) stocks for producers and oxygen (O₂) required for mitochondrial respiration.",
    roles: [
      "Raw source of carbon atoms for organic life",
      "Provides oxygen to fuel consumer metabolic respiration",
      "Shields biome from harmful solar UV wavelengths"
    ]
  },
  producers: {
    name: "Producers (Biotic)",
    type: "Biotic Component",
    emoji: "🌿",
    color: "#10B981",
    desc: "Autotrophic organisms (mostly photosynthetic plants, kelp, or cyanobacteria) that synthesis starch and chemical energy from inorganic inputs.",
    roles: [
      "Converts solar energy into chemical bonds (sugars)",
      "Releases free oxygen gas into the atmosphere",
      "Base biomass layer supporting all consumer levels"
    ]
  },
  consumers: {
    name: "Consumers (Biotic)",
    type: "Biotic Component",
    emoji: "🦌",
    color: "#EF4444",
    desc: "Heterotrophic organisms that feed on plants or other animals to extract organic compounds. Spans herbivores, carnivores, and omnivores.",
    roles: [
      "Transfers energy across upper trophic tiers",
      "Maintains population control via predator-prey dynamics",
      "Excretes nitrogenous waste that fertilizes soil"
    ]
  },
  decomposers: {
    name: "Decomposers (Biotic)",
    type: "Biotic Component",
    emoji: "🍄",
    color: "#A855F7",
    desc: "Detritivorous fungi, soil bacteria, and microinvertebrates. They dissolve dead carcasses and leaf litters back into standard ionic nutrients.",
    roles: [
      "Recycles nitrogen, phosphates, and minerals",
      "Clears organic debris from ecological zones",
      "Returns soil nutrients to the geospheric loop"
    ]
  }
};

const CYCLES = {
  water: {
    name: "Water Cycle (Hydrological)",
    emoji: "🔄💧",
    color: "#3B82F6",
    desc: "Continuous physical cycles of water circulation between land, oceans, biota, and atmosphere.",
    steps: [
      "Evaporation: Solar heat converts surface water into vapor.",
      "Transpiration: Plants pull ground moisture and release vapor from leaves.",
      "Condensation: Atmospheric moisture cools into clouds.",
      "Precipitation: Gravity drops water back as rain or snow."
    ]
  },
  carbon: {
    name: "Carbon Cycle",
    emoji: "🔄🍃",
    color: "#10B981",
    desc: "Organic and chemical exchange loops of carbon atoms among soils, oceans, air, and biotic pathways.",
    steps: [
      "Photosynthesis: Producers absorb CO₂ to manufacture carbohydrates.",
      "Consumption: Carbon compounds are ingested by herbivores and carnivores.",
      "Respiration: Mitochondria oxidise carbohydrates, releasing CO₂ vapor.",
      "Decomposition: Decomposers release soil carbon back to atmosphere and geosphere."
    ]
  },
  energy: {
    name: "Energy Flow (10% Rule)",
    emoji: "🔄⚡",
    color: "#F59E0B",
    desc: "One-directional thermodynamic flow of energy entering via solar rays and releasing as heat.",
    steps: [
      "Solar Input: Producers capture ~1% of incoming light.",
      "Trophic Loss: Only 10% of energy converts to biomass at the next level.",
      "Heat Dissipation: 90% is expended as metabolic work or lost as ambient heat.",
      "Unidirectional Flow: Energy must be continuously replenished by solar inputs."
    ]
  }
};

const ENERGY_STEPS = [
  { label: "Sun", val: "" },
  { label: "Plants", val: "10,000 kcal" },
  { label: "Herbivore", val: "1,000 kcal" },
  { label: "Carnivore", val: "100 kcal" },
  { label: "Apex", val: "10 kcal" },
];

/* ═══════════════════════════════════════════════════════════════
   3D COMPONENT PARTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Flora meshes ───────────────────────────────────────────── */

function Cactus({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} />
      </mesh>
      {/* Left Arm */}
      <mesh castShadow position={[-0.18, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-0.3, 0.88, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} />
      </mesh>
      {/* Right Arm */}
      <mesh castShadow position={[0.18, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.3, 0.73, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} />
      </mesh>
    </group>
  );
}

function PineTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.7, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.8, 0]}>
        <coneGeometry args={[0.32, 0.7, 8]} />
        <meshStandardMaterial color="#1B5E20" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.2, 0]}>
        <coneGeometry args={[0.22, 0.5, 8]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.9} />
      </mesh>
    </group>
  );
}

function DeciduousTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.9, 0]}>
        <dodecahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.12, 1.05, 0.08]}>
        <dodecahedronGeometry args={[0.25, 1]} />
        <meshStandardMaterial color="#388E3C" roughness={0.8} />
      </mesh>
    </group>
  );
}

function AcaciaTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.45, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.05, 0.08, 0.9, 8]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.15, 0.9, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.035, 0.045, 0.5, 8]} />
        <meshStandardMaterial color="#4E342E" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.25, 1.1, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.15, 10]} />
        <meshStandardMaterial color="#1B5E20" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Kelp({ position }: { position: [number, number, number] }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 7; i++) {
      pts.push(
        new THREE.Vector3(
          Math.sin(i * 0.9) * 0.1,
          i * 0.2,
          Math.cos(i * 0.9) * 0.04
        )
      );
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const geom = useMemo(() => new THREE.TubeGeometry(points, 20, 0.045, 8, false), [points]);

  return (
    <group position={position}>
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial color="#00796B" roughness={0.6} />
      </mesh>
      {Array.from({ length: 5 }).map((_, idx) => (
        <mesh
          key={idx}
          position={[Math.sin(idx * 0.9) * 0.08, idx * 0.2 + 0.08, Math.cos(idx * 0.9) * 0.04]}
          rotation={[0.3, 0.1, 0.7]}
        >
          <dodecahedronGeometry args={[0.05, 0]} />
          <meshStandardMaterial color="#00897B" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function FluffyCloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0.22, -0.05, 0.1]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[-0.22, -0.05, -0.1]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ECEFF1" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

/* ── Interactive 3D component wrapper ────────────────────────── */

interface InteractiveMeshProps {
  children: React.ReactNode;
  active: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

function InteractiveMesh({ children, active, onHover, onClick }: InteractiveMeshProps) {
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
      }}
    >
      {children}
    </group>
  );
}

/* ── Flowing Particles along curves ─────────────────────────── */

function FlowingParticles({
  curve,
  color,
  count = 5,
  speed = 0.35,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  count?: number;
  speed?: number;
}) {
  const pointsRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pointsRef.current.forEach((mesh, index) => {
      if (mesh) {
        const progress = (t * speed + index / count) % 1;
        const pos = curve.getPointAt(progress);
        mesh.position.copy(pos);
        const scale = 0.055 + Math.sin(t * 3.5 + index) * 0.015;
        mesh.scale.setScalar(scale);
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) pointsRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Ambient Environment Particles ────────────────────────── */

function AmbientParticles({ biomeId }: { biomeId: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const count = 100;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const pColor = useMemo(() => {
    switch (biomeId) {
      case "forest": return "#39FF14"; // Pollen
      case "ocean": return "#00E5FF";  // Bubbles
      case "desert": return "#FFB300"; // Dust
      case "savanna": return "#C0CA33"; // Grass seed
      default: return "#39FF14";
    }
  }, [biomeId]);

  const { positions, speeds } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const spd: number[] = [];
    for (let i = 0; i < count; i++) {
      // Spawn particles inside a sphere of radius 3
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.random() * 2.8;
      pos.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) + 0.2,
        r * Math.cos(phi),
      ]);
      spd.push(0.015 + Math.random() * 0.025);
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      // Slowly drift
      dummy.position.set(
        x + Math.sin(t * speeds[i] * 6 + i) * 0.15,
        y + Math.cos(t * speeds[i] * 5 + i * 0.6) * 0.1,
        z + Math.sin(t * speeds[i] * 4 + i * 0.3) * 0.12
      );
      const scale = 0.012 + Math.sin(t * 1.5 + i) * 0.006;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={pColor} transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ── 3D Biosphere Dome Scene ───────────────────────────────── */

interface EcosystemDomeProps {
  biomeId: string;
  activeComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  activeViewMode: string;
}

function EcosystemDome({
  biomeId,
  activeComponentId,
  onSelectComponent,
  activeViewMode,
}: EcosystemDomeProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const domeColor = useMemo(() => {
    switch (biomeId) {
      case "forest": return "#10B981";
      case "ocean": return "#3B82F6";
      case "desert": return "#F59E0B";
      case "savanna": return "#84CC16";
      default: return "#10B981";
    }
  }, [biomeId]);

  const groundColor = useMemo(() => {
    switch (biomeId) {
      case "forest": return "#3E2723";
      case "ocean": return "#0D47A1";
      case "desert": return "#E0A96D";
      case "savanna": return "#8D6E63";
      default: return "#3E2723";
    }
  }, [biomeId]);

  // Curves for Cycles Mode
  const cycleCurves = useMemo(() => {
    // Evaporation: from pool [0.8, -0.65, 0.6] to right cloud [1.1, 1.4, 0.5]
    const pEvap = [
      new THREE.Vector3(0.8, -0.65, 0.6),
      new THREE.Vector3(1.0, 0.3, 0.6),
      new THREE.Vector3(1.1, 1.4, 0.5),
    ];
    // Precipitation: left cloud [-1.1, 1.6, -0.4] to soil [-0.5, -0.7, -0.5]
    const pRain = [
      new THREE.Vector3(-1.1, 1.6, -0.4),
      new THREE.Vector3(-0.8, 0.4, -0.45),
      new THREE.Vector3(-0.5, -0.7, -0.5),
    ];
    // Carbon assimilation: Air [0.2, 1.2, 0.2] to tree/plant [-0.4, -0.3, 0.4]
    const pPhoto = [
      new THREE.Vector3(0.2, 1.2, 0.2),
      new THREE.Vector3(-0.1, 0.5, 0.3),
      new THREE.Vector3(-0.4, -0.3, 0.4),
    ];
    // Consumer consumption: Plant [-0.4, -0.6, 0.4] to Consumer [0.8, -0.65, -0.6]
    const pCons = [
      new THREE.Vector3(-0.4, -0.6, 0.4),
      new THREE.Vector3(0.2, -0.6, -0.1),
      new THREE.Vector3(0.8, -0.65, -0.6),
    ];
    // Respiration: Consumer [0.8, -0.65, -0.6] to air [0.0, 1.0, -0.3]
    const pResp = [
      new THREE.Vector3(0.8, -0.65, -0.6),
      new THREE.Vector3(0.5, 0.2, -0.45),
      new THREE.Vector3(0.0, 1.0, -0.3),
    ];

    return {
      waterEvap: new THREE.CatmullRomCurve3(pEvap),
      waterRain: new THREE.CatmullRomCurve3(pRain),
      carbonPhoto: new THREE.CatmullRomCurve3(pPhoto),
      carbonCons: new THREE.CatmullRomCurve3(pCons),
      carbonResp: new THREE.CatmullRomCurve3(pResp),
    };
  }, []);

  const getGlowMaterial = (id: string, defaultColor: string, isEmissive = true) => {
    const isSel = activeComponentId === id;
    const isHov = hoveredId === id;
    if (activeViewMode !== "components") {
      return (
        <meshStandardMaterial
          color={defaultColor}
          roughness={0.8}
          transparent
          opacity={0.3}
        />
      );
    }
    return (
      <meshStandardMaterial
        color={isSel ? "#FFFFFF" : defaultColor}
        emissive={isSel ? "#FFFFFF" : isEmissive ? defaultColor : undefined}
        emissiveIntensity={isSel ? 0.8 : isHov ? 0.4 : 0.05}
        roughness={isSel ? 0.1 : 0.75}
      />
    );
  };

  return (
    <group>
      {/* ── Glass Enclosure Biosphere Dome ── */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[3.2, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.15}
          chromaticAberration={0.03}
          anisotropy={0.1}
          distortion={0.05}
          distortionScale={0.1}
          temporalDistortion={0.0}
          clearcoat={0.9}
          attenuationDistance={0.5}
          attenuationColor={domeColor}
          color="#FFFFFF"
          transparent
          opacity={activeViewMode === "cycles" ? 0.06 : 0.14}
        />
      </mesh>

      {/* Dome Base ring */}
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.22, 0.08, 8, 48]} />
        <meshStandardMaterial color="#212121" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Ground / Soil (Abiotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "soil"}
        onHover={(h) => setHoveredId(h ? "soil" : null)}
        onClick={() => onSelectComponent("soil")}
      >
        <mesh position={[0, -0.8, 0]} receiveShadow>
          <cylinderGeometry args={[3.12, 3.12, 0.12, 32]} />
          {getGlowMaterial("soil", groundColor, false)}
        </mesh>
      </InteractiveMesh>

      {/* ── Sun (Abiotic Component) ── */}
      {biomeId !== "ocean" && (
        <InteractiveMesh
          active={activeComponentId === "sun"}
          onHover={(h) => setHoveredId(h ? "sun" : null)}
          onClick={() => onSelectComponent("sun")}
        >
          <mesh position={[0, 2.1, 0]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial
              color="#FFD54F"
              transparent
              opacity={activeViewMode === "cycles" ? 0.3 : activeComponentId === "sun" ? 1.0 : 0.85}
            />
          </mesh>
          <pointLight position={[0, 2.1, 0]} color="#FFF9C4" intensity={1.5} distance={8} decay={1.5} />
        </InteractiveMesh>
      )}

      {/* ── Atmosphere / Clouds (Abiotic Component) ── */}
      {biomeId !== "ocean" && (
        <InteractiveMesh
          active={activeComponentId === "atmosphere"}
          onHover={(h) => setHoveredId(h ? "atmosphere" : null)}
          onClick={() => onSelectComponent("atmosphere")}
        >
          <group>
            <FluffyCloud position={[-1.1, 1.6, -0.4]} />
            <FluffyCloud position={[1.1, 1.4, 0.5]} />
          </group>
        </InteractiveMesh>
      )}

      {/* ── Water Pool (Abiotic Component) ── */}
      {biomeId !== "ocean" && (
        <InteractiveMesh
          active={activeComponentId === "water"}
          onHover={(h) => setHoveredId(h ? "water" : null)}
          onClick={() => onSelectComponent("water")}
        >
          <mesh position={[0.8, -0.73, 0.6]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.52, 0.03, 16]} />
            {getGlowMaterial("water", "#0288D1")}
          </mesh>
        </InteractiveMesh>
      )}

      {/* ── Producers (Biotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "producers"}
        onHover={(h) => setHoveredId(h ? "producers" : null)}
        onClick={() => onSelectComponent("producers")}
      >
        <group>
          {biomeId === "forest" && (
            <>
              <PineTree position={[-0.8, -0.74, -0.4]} />
              <DeciduousTree position={[-0.4, -0.74, 0.4]} />
              <PineTree position={[0.2, -0.74, -0.9]} />
            </>
          )}
          {biomeId === "savanna" && (
            <>
              <AcaciaTree position={[-0.5, -0.74, 0.3]} />
              <AcaciaTree position={[0.4, -0.74, -0.6]} />
            </>
          )}
          {biomeId === "desert" && (
            <>
              <Cactus position={[-0.7, -0.74, 0.1]} />
              <Cactus position={[0.1, -0.74, -0.7]} />
              <Cactus position={[-0.3, -0.74, -0.6]} />
            </>
          )}
          {biomeId === "ocean" && (
            <>
              <Kelp position={[-0.7, -0.74, 0.2]} />
              <Kelp position={[0.2, -0.74, -0.5]} />
              <Kelp position={[-0.2, -0.74, -0.8]} />
              <Kelp position={[0.7, -0.74, 0.3]} />
            </>
          )}
        </group>
      </InteractiveMesh>

      {/* ── Consumers (Biotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "consumers"}
        onHover={(h) => setHoveredId(h ? "consumers" : null)}
        onClick={() => onSelectComponent("consumers")}
      >
        <group>
          {/* Primary Consumer (Herbivore representation) */}
          <group position={[-0.8, -0.69, 0.7]} rotation={[0, 0.4, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.14, 0.1, 0.2]} />
              {getGlowMaterial("consumers", "#D7CCC8")}
            </mesh>
            <mesh position={[0, 0.1, 0.05]}>
              <boxGeometry args={[0.09, 0.1, 0.09]} />
              {getGlowMaterial("consumers", "#D7CCC8")}
            </mesh>
            {/* Long Ears (Rabbit-like) */}
            {biomeId !== "ocean" && (
              <group position={[0, 0.18, 0.04]}>
                <mesh position={[-0.03, 0.05, 0]}>
                  <boxGeometry args={[0.02, 0.12, 0.02]} />
                  {getGlowMaterial("consumers", "#D7CCC8")}
                </mesh>
                <mesh position={[0.03, 0.05, 0]}>
                  <boxGeometry args={[0.02, 0.12, 0.02]} />
                  {getGlowMaterial("consumers", "#D7CCC8")}
                </mesh>
              </group>
            )}
          </group>

          {/* Secondary/Tertiary Consumer (Predator representation) */}
          <group position={[0.8, -0.66, -0.5]} rotation={[0, -0.8, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.14, 0.28]} />
              {getGlowMaterial("consumers", "#FF8A65")}
            </mesh>
            <mesh position={[0, 0.12, 0.1]}>
              <boxGeometry args={[0.11, 0.11, 0.13]} />
              {getGlowMaterial("consumers", "#FF8A65")}
            </mesh>
          </group>
        </group>
      </InteractiveMesh>

      {/* ── Decomposers (Biotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "decomposers"}
        onHover={(h) => setHoveredId(h ? "decomposers" : null)}
        onClick={() => onSelectComponent("decomposers")}
      >
        <group position={[-0.3, -0.74, -0.8]}>
          {/* Mushroom 1 */}
          <group position={[0, 0, 0]}>
            <mesh castShadow position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
              {getGlowMaterial("decomposers", "#ECEFF1")}
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              {getGlowMaterial("decomposers", "#EF5350")}
            </mesh>
          </group>
          {/* Mushroom 2 */}
          <group position={[0.14, 0, 0.1]}>
            <mesh castShadow position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
              {getGlowMaterial("decomposers", "#ECEFF1")}
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              {getGlowMaterial("decomposers", "#EF5350")}
            </mesh>
          </group>
        </group>
      </InteractiveMesh>

      {/* ── Flowing Cycles Visuals (Cycles view mode) ── */}
      {activeViewMode === "cycles" && (
        <>
          {/* Water Cycle */}
          {biomeId !== "ocean" && (
            <>
              <FlowingParticles curve={cycleCurves.waterEvap} color="#81D4FA" count={6} speed={0.4} />
              <FlowingParticles curve={cycleCurves.waterRain} color="#0288D1" count={6} speed={0.4} />
            </>
          )}
          {/* Carbon Cycle */}
          <FlowingParticles curve={cycleCurves.carbonPhoto} color="#66BB6A" count={5} speed={0.3} />
          <FlowingParticles curve={cycleCurves.carbonCons} color="#C8E6C9" count={4} speed={0.3} />
          <FlowingParticles curve={cycleCurves.carbonResp} color="#EF5350" count={5} speed={0.3} />
        </>
      )}

      {/* Ambient Particles floating in space */}
      <AmbientParticles biomeId={biomeId} />
    </group>
  );
}

/* ── 3D Interactive Trophic level pyramid ───────────────────── */

interface TrophicPyramid3DProps {
  activeLevel: number | null;
  onSelectLevel: (lvl: number | null) => void;
  biomeColor: string;
}

function TrophicPyramid3D({
  activeLevel,
  onSelectLevel,
  biomeColor,
}: TrophicPyramid3DProps) {
  const [hoveredLvl, setHoveredLvl] = useState<number | null>(null);

  const levels = [
    { lvl: 5, name: "Decomposers", color: "#A855F7", y: 1.15, rTop: 0.1, rBot: 0.45, h: 0.4 },
    { lvl: 4, name: "Tertiary Consumers", color: "#EF4444", y: 0.6, rTop: 0.5, rBot: 0.95, h: 0.4 },
    { lvl: 3, name: "Secondary Consumers", color: "#F59E0B", y: 0.05, rTop: 1.0, rBot: 1.45, h: 0.4 },
    { lvl: 2, name: "Primary Consumers", color: "#3B82F6", y: -0.5, rTop: 1.5, rBot: 1.95, h: 0.4 },
    { lvl: 1, name: "Producers", color: "#10B981", y: -1.05, rTop: 2.0, rBot: 2.45, h: 0.4 },
  ];

  // Upward particle flow to simulate energy transfer
  const energySpline = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const y = -1.1 + i * 0.25;
      // Helix tapering inwards
      const r = 2.0 - i * 0.2;
      const angle = i * 1.5;
      pts.push(new THREE.Vector3(Math.cos(angle) * r * 0.7, y, Math.sin(angle) * r * 0.7));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  return (
    <group>
      {levels.map((l) => {
        const isSelected = activeLevel === l.lvl;
        const isHovered = hoveredLvl === l.lvl;
        return (
          <mesh
            key={l.lvl}
            position={[0, l.y, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredLvl(l.lvl);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredLvl(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLevel(isSelected ? null : l.lvl);
            }}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[l.rTop, l.rBot, l.h, 6, 1]} />
            <meshPhysicalMaterial
              color={isSelected ? "#FFFFFF" : l.color}
              emissive={l.color}
              emissiveIntensity={isSelected ? 1.0 : isHovered ? 0.5 : 0.08}
              roughness={isSelected ? 0.1 : 0.3}
              metalness={0.1}
              transparent
              opacity={0.9}
              clearcoat={0.4}
            />
          </mesh>
        );
      })}

      {/* Upward energy stream particles */}
      <FlowingParticles curve={energySpline} color={biomeColor} count={6} speed={0.25} />
    </group>
  );
}

/* ── Combined 3D Canvas Scene ───────────────────────────────── */

interface SceneProps {
  biomeId: string;
  activeViewMode: string;
  activeComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  activeTrophicLevel: number | null;
  onSelectLevel: (lvl: number | null) => void;
  biomeColor: string;
}

function Scene({
  biomeId,
  activeViewMode,
  activeComponentId,
  onSelectComponent,
  activeTrophicLevel,
  onSelectLevel,
  biomeColor,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} color="#ECEFF1" />

      {/* Primary Warm Sun Key Light */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.6}
        color="#FFFDE7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cool fill light */}
      <directionalLight
        position={[-8, -4, 4]}
        intensity={0.7}
        color="#E3F2FD"
      />

      {/* Dynamic spot light focused on dome center */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.2}
        color={biomeColor}
        castShadow
      />

      <Environment preset="forest" />

      <Float speed={0.4} rotationIntensity={0.06} floatIntensity={0.25}>
        {activeViewMode === "pyramid" ? (
          <TrophicPyramid3D
            activeLevel={activeTrophicLevel}
            onSelectLevel={onSelectLevel}
            biomeColor={biomeColor}
          />
        ) : (
          <EcosystemDome
            biomeId={biomeId}
            activeComponentId={activeComponentId}
            onSelectComponent={onSelectComponent}
            activeViewMode={activeViewMode}
          />
        )}
      </Float>

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        enableDamping
        dampingFactor={0.05}
        autoRotate={activeViewMode === "cycles" || activeComponentId === null}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE IMPLEMENTATION
   ═══════════════════════════════════════════════════════════════ */

export default function EcosystemsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedBiomeId, setSelectedBiomeId] = useState<string>("forest");
  const [activeViewMode, setActiveViewMode] = useState<"components" | "pyramid" | "cycles">("components");
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedTrophicLevel, setSelectedTrophicLevel] = useState<number | null>(null);

  const biome = useMemo(() => {
    return BIOMES.find((b) => b.id === selectedBiomeId) ?? BIOMES[0];
  }, [selectedBiomeId]);

  const selectBiome = (id: string) => {
    setSelectedBiomeId(id);
    setSelectedComponentId(null);
    setSelectedTrophicLevel(null);
  };

  const selectViewMode = (mode: "components" | "pyramid" | "cycles") => {
    setActiveViewMode(mode);
    setSelectedComponentId(null);
    setSelectedTrophicLevel(null);
  };

  const componentData = selectedComponentId
    ? ECOSYSTEM_COMPONENTS[selectedComponentId as keyof typeof ECOSYSTEM_COMPONENTS]
    : null;

  const trophicData = selectedTrophicLevel !== null
    ? biome.trophicLevels.find((t) => t.level === selectedTrophicLevel)
    : null;

  const cycleData = activeViewMode === "cycles"
    ? CYCLES.water // Show water cycle by default
    : null;

  return (
    <div className="eco-root">
      {/* 3D Sticky Viewport */}
      <div className="eco-viewport-container">
        <div className="eco-canvas-wrapper">
          {mounted && (
            <Canvas
              camera={{ position: [0, 1, 8.5], fov: 45 }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.05,
              }}
              shadows
              style={{
                background: "linear-gradient(180deg, #020802 0%, #030a03 50%, #010501 100%)",
              }}
            >
              <Scene
                biomeId={selectedBiomeId}
                activeViewMode={activeViewMode}
                activeComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                activeTrophicLevel={selectedTrophicLevel}
                onSelectLevel={setSelectedTrophicLevel}
                biomeColor={biome.color}
              />
            </Canvas>
          )}
          {/* Dark overlay */}
          <div className="eco-vignette" />
        </div>

        {/* View Mode controls floating overlay */}
        <div className="eco-overlay-controls">
          <div className="eco-selector-title">🌿 Biosphere Simulator</div>
          <div className="eco-tab-bar">
            {[
              { id: "components", label: "Dome & Components", icon: "🌐" },
              { id: "pyramid", label: "Trophic Pyramid", icon: "📐" },
              { id: "cycles", label: "Ecology Cycles", icon: "🔄" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => selectViewMode(tab.id as any)}
                className={`eco-tab-btn ${activeViewMode === tab.id ? "active" : ""}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
          <div className="eco-instruction-pill">
            {activeViewMode === "components" && "👈 Drag to orbit · Click items inside dome to analyze"}
            {activeViewMode === "pyramid" && "👈 Click pyramid layers to trace energy flow"}
            {activeViewMode === "cycles" && "🔄 Water & carbon cycle animations active"}
          </div>
        </div>

        {/* Floating Side Sidebar for Interactive elements */}
        <div
          className={`eco-side-panel ${
            selectedComponentId || selectedTrophicLevel !== null ? "visible" : ""
          }`}
        >
          {componentData && (
            <>
              <button className="eco-panel-close" onClick={() => setSelectedComponentId(null)}>
                ✕
              </button>
              <div
                className="eco-panel-dot"
                style={{
                  backgroundColor: componentData.color,
                  boxShadow: `0 0 20px ${componentData.color}40`,
                }}
              />
              <span className="eco-panel-tag">{componentData.type}</span>
              <h3 className="eco-panel-title">
                {componentData.emoji} {componentData.name}
              </h3>
              <p className="eco-panel-desc">{componentData.desc}</p>
              <div className="eco-panel-roles">
                <div className="eco-roles-heading">Key Ecological Roles:</div>
                {componentData.roles.map((r, i) => (
                  <div key={i} className="eco-role-item">
                    <span className="eco-role-bullet">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {trophicData && (
            <>
              <button className="eco-panel-close" onClick={() => setSelectedTrophicLevel(null)}>
                ✕
              </button>
              <div
                className="eco-panel-dot"
                style={{
                  backgroundColor: trophicData.color,
                  boxShadow: `0 0 20px ${trophicData.color}40`,
                }}
              />
              <span className="eco-panel-tag">Trophic Level {trophicData.level}</span>
              <h3 className="eco-panel-title" style={{ color: trophicData.color }}>
                {trophicData.name}
              </h3>
              <div className="eco-panel-badge">{trophicData.energy}</div>
              <p className="eco-panel-desc">{trophicData.desc}</p>
              <div className="eco-panel-roles">
                <div className="eco-roles-heading">Biome Representatives:</div>
                {trophicData.organisms.map((o, i) => (
                  <div
                    key={i}
                    className="eco-role-item"
                    style={{ background: "rgba(255,255,255,0.03)", padding: 8, borderRadius: 8, marginBottom: 6 }}
                  >
                    <strong style={{ color: trophicData.color, fontSize: "0.85rem", display: "block" }}>{o.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "rgba(200,245,200,0.6)" }}>{o.role}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Scroll down indicator */}
        <div className="eco-scroll-down">
          <span>Scroll down for Biome Details</span>
          <div className="eco-bounce-arrow">↓</div>
        </div>
      </div>

      {/* BIOME SELECTOR SECTION */}
      <section className="eco-section eco-biome-picker">
        <h2 className="eco-section-title">Select Active Biome</h2>
        <div className="eco-biome-grid">
          {BIOMES.map((b) => (
            <button
              key={b.id}
              onClick={() => selectBiome(b.id)}
              className={`eco-biome-card ${selectedBiomeId === b.id ? "active" : ""}`}
              style={{ "--bc": b.color } as React.CSSProperties}
            >
              <span className="eco-biome-emoji">{b.emoji}</span>
              <span className="eco-biome-name">{b.name}</span>
              <span className="eco-biome-climate">{b.climate.split(",")[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* BIOME DETAILS SECTION */}
      <section className="eco-section">
        <div
          className="eco-details-panel"
          style={{
            backgroundColor: `${biome.color}0a`,
            borderColor: `${biome.color}25`,
            boxShadow: `0 8px 32px ${biome.color}05`,
          }}
        >
          <div className="eco-details-header">
            <h2 className="eco-detail-title" style={{ color: biome.color }}>
              {biome.emoji} {biome.name} Data Sheet
            </h2>
            <div className="eco-details-meta">
              <div><strong>Climate:</strong> {biome.climate}</div>
              <div style={{ marginTop: 4 }}><strong>Global Distribution:</strong> {biome.location}</div>
            </div>
          </div>

          <div className="eco-detail-split">
            {/* Key Facts */}
            <div className="eco-details-col">
              <h3 className="eco-detail-subtitle">💡 Ecological Facts</h3>
              <div className="eco-facts-list">
                {biome.facts.map((f, i) => (
                  <p key={i} className="eco-fact">
                    <span style={{ color: biome.color, marginRight: 8 }}>✔</span>
                    {f}
                  </p>
                ))}
              </div>
            </div>

            {/* Energy Pyramid Math */}
            <div className="eco-details-col">
              <h3 className="eco-detail-subtitle">⚡ Energy Loss Progression</h3>
              <div className="eco-energy-flow">
                {ENERGY_STEPS.map((s, i) => (
                  <span key={i} className="eco-energy-step">
                    <span className="eco-energy-label">{s.label}</span>
                    {s.val && <span className="eco-energy-val" style={{ color: biome.color }}>{s.val}</span>}
                    {i < ENERGY_STEPS.length - 1 && <span className="eco-energy-arrow">→</span>}
                  </span>
                ))}
              </div>
              <p className="eco-energy-math-desc">
                Only <strong>10%</strong> of the energy is conserved from one trophic stage to the next. The other
                90% is burned during cellular processes or radiated off as metabolic heat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOD WEB ACCORDION SECTION */}
      <section className="eco-section">
        <h2 className="eco-section-title">Organisms by Trophic Level ({biome.name})</h2>
        <div className="eco-accordion-list">
          {biome.trophicLevels.map((tl) => {
            const isSelected = selectedTrophicLevel === tl.level;
            return (
              <div
                key={tl.level}
                className={`eco-acc-item ${isSelected ? "open" : ""}`}
                style={{ "--tlc": tl.color } as React.CSSProperties}
              >
                <button
                  className="eco-acc-header"
                  onClick={() => setSelectedTrophicLevel(isSelected ? null : tl.level)}
                >
                  <div className="eco-acc-left">
                    <span className="eco-acc-badge">L{tl.level}</span>
                    <div>
                      <strong className="eco-acc-name">{tl.name}</strong>
                      <span className="eco-acc-desc">{tl.desc}</span>
                    </div>
                  </div>
                  <div className="eco-acc-right">
                    <span className="eco-acc-energy">{tl.energy}</span>
                    <span className="eco-acc-chevron">▾</span>
                  </div>
                </button>
                <div
                  className="eco-acc-body"
                  style={{
                    maxHeight: isSelected ? `${tl.organisms.length * 80 + 32}px` : "0",
                  }}
                >
                  <div className="eco-org-grid">
                    {tl.organisms.map((o) => (
                      <div
                        key={o.name}
                        className="eco-org-card"
                        style={{
                          backgroundColor: `${tl.color}10`,
                          borderColor: `${tl.color}30`,
                        }}
                      >
                        <span className="eco-org-name" style={{ color: tl.color }}>
                          {o.name}
                        </span>
                        <span className="eco-org-role">{o.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EDUCATIONAL SIDEWAYS CARD SECTION */}
      <section className="eco-section">
        <div className="eco-edu-card">
          <h2 className="eco-edu-card-title">🔬 Cycles & Biological Interconnection</h2>
          <p className="eco-edu-card-text">
            Ecosystems maintain stability through balance. Abiotic elements like solar radiation, moisture, and soil
            composition govern what vegetation can grow. Biotic producers fix these inputs into biomass. 
            When consumers metabolize plants, carbon cycles back to the skies, and energy moves forward. 
            Finally, microscopic decomposers release chemical nutrients back into the dirt, allowing the geosphere to
            feed next generation trees.
          </p>
          <div className="eco-cycles-quick-grid">
            {Object.entries(CYCLES).map(([key, item]) => (
              <div key={key} className="eco-cycle-card" style={{ borderColor: `${item.color}30` }}>
                <h4 style={{ color: item.color, margin: "0 0 8px 0" }}>{item.emoji} {item.name}</h4>
                <p style={{ fontSize: "0.78rem", color: "rgba(200,245,200,0.6)", margin: "0 0 10px 0", lineHeight: 1.4 }}>{item.desc}</p>
                <div className="eco-cycle-steps">
                  {item.steps.map((st, si) => (
                    <div key={si} className="eco-cycle-step-item">
                      <span style={{ color: item.color, marginRight: 6 }}>{si + 1}.</span> {st}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STYLE OVERLAYS */}
      <style>{`
        .eco-root {
          width: 100%;
          min-height: calc(100vh - 64px);
          background: #020502;
          color: #C8F5C8;
          font-family: system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* Viewport Sticky Hero */
        .eco-viewport-container {
          position: sticky;
          top: 0;
          width: 100%;
          height: calc(100vh - 64px);
          min-height: 520px;
          overflow: hidden;
          z-index: 2;
        }

        .eco-canvas-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .eco-vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(2,5,2,0.85) 100%);
        }

        /* Overlay Controls */
        .eco-overlay-controls {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          text-align: center;
          width: 90%;
          max-width: 600px;
        }

        .eco-selector-title {
          font-size: 1.5rem;
          font-weight: 850;
          color: #39FF14;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px;
          text-shadow: 0 0 20px rgba(57,255,20,0.3);
        }

        .eco-tab-bar {
          display: flex;
          justify-content: center;
          gap: 10px;
          background: rgba(5,15,5,0.7);
          border: 1px solid rgba(57,255,20,0.15);
          padding: 5px;
          border-radius: 12px;
          backdrop-filter: blur(12px);
        }

        .eco-tab-btn {
          flex: 1;
          padding: 8px 12px;
          font-size: 0.76rem;
          font-weight: 600;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(200,245,200,0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .eco-tab-btn:hover {
          color: #39FF14;
          background: rgba(57,255,20,0.05);
        }

        .eco-tab-btn.active {
          color: #020502;
          background: #39FF14;
          font-weight: 750;
          box-shadow: 0 0 15px rgba(57,255,20,0.35);
        }

        .eco-instruction-pill {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 14px;
          font-size: 0.68rem;
          border-radius: 20px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(200,245,200,0.5);
          backdrop-filter: blur(8px);
        }

        /* Floating Sidebar */
        .eco-side-panel {
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%) translateX(120%);
          width: min(320px, 85vw);
          max-height: 80vh;
          background: rgba(2,6,2,0.9);
          border: 1px solid rgba(57,255,20,0.15);
          border-radius: 16px;
          padding: 24px;
          box-sizing: border-box;
          z-index: 15;
          backdrop-filter: blur(20px);
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease;
          opacity: 0;
          overflow-y: auto;
        }

        .eco-side-panel.visible {
          transform: translateY(-50%) translateX(0);
          opacity: 1;
        }

        .eco-panel-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: transparent;
          border: none;
          color: rgba(200,245,200,0.5);
          font-size: 0.95rem;
          cursor: pointer;
        }

        .eco-panel-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-bottom: 8px;
        }

        .eco-panel-tag {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(200,245,200,0.4);
          font-weight: 700;
        }

        .eco-panel-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ECEFF1;
          margin: 4px 0 10px 0;
        }

        .eco-panel-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-family: monospace;
          background: rgba(57,255,20,0.1);
          color: #39FF14;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
          border: 1px solid rgba(57,255,20,0.2);
        }

        .eco-panel-desc {
          font-size: 0.82rem;
          line-height: 1.5;
          color: rgba(200,245,200,0.7);
          margin: 0 0 16px 0;
        }

        .eco-panel-roles {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 12px;
        }

        .eco-roles-heading {
          font-size: 0.76rem;
          font-weight: 700;
          color: #39FF14;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .eco-role-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 0.8rem;
          color: rgba(200,245,200,0.7);
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .eco-role-bullet {
          color: #39FF14;
          font-weight: 800;
        }

        /* Scroll down arrow */
        .eco-scroll-down {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: rgba(200,245,200,0.4);
          letter-spacing: 0.05em;
          pointer-events: none;
        }

        .eco-bounce-arrow {
          font-size: 0.9rem;
          animation: bounceDown 1.5s infinite ease-in-out;
        }

        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        /* Static Section Layout */
        .eco-section {
          position: relative;
          z-index: 3;
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px clamp(16px, 4vw, 40px);
          background: #020502;
        }

        .eco-section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #39FF14;
          margin: 0 0 16px 0;
          letter-spacing: 0.02em;
        }

        /* Biome picker grid */
        .eco-biome-picker {
          border-top: 1px solid rgba(57,255,20,0.08);
          padding-top: 48px;
        }

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
          padding: 24px 12px;
          border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.06);
          background: rgba(2,6,2,0.85);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          color: inherit;
        }

        .eco-biome-card:hover {
          transform: translateY(-4px);
          border-color: var(--bc);
          background: rgba(5,15,5,0.85);
        }

        .eco-biome-card.active {
          border-color: var(--bc);
          background: color-mix(in srgb, var(--bc) 8%, #020502);
          box-shadow: 0 0 25px color-mix(in srgb, var(--bc) 20%, transparent);
        }

        .eco-biome-emoji { font-size: 2.2rem; }
        .eco-biome-name { font-weight: 750; font-size: 0.95rem; }
        .eco-biome-climate { font-size: 0.72rem; color: rgba(200,245,200,0.45); text-align: center; line-height: 1.35; }

        /* Biome Details Panel */
        .eco-details-panel {
          border: 1px solid;
          border-radius: 18px;
          padding: 28px;
        }

        .eco-details-header {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .eco-detail-title {
          font-size: 1.45rem;
          font-weight: 850;
          margin: 0 0 6px 0;
        }

        .eco-details-meta {
          font-size: 0.85rem;
          color: rgba(200,245,200,0.6);
        }

        .eco-detail-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .eco-detail-subtitle {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ECEFF1;
          margin: 0 0 14px 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .eco-facts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .eco-fact {
          font-size: 0.82rem;
          line-height: 1.5;
          color: rgba(200,245,200,0.7);
          margin: 0;
        }

        .eco-energy-flow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.03);
          font-family: monospace;
          font-size: 0.8rem;
        }

        .eco-energy-step {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .eco-energy-label {
          color: #ECEFF1;
          font-weight: 700;
        }

        .eco-energy-val {
          font-size: 0.72rem;
          font-weight: 700;
        }

        .eco-energy-arrow {
          color: rgba(57,255,20,0.4);
        }

        .eco-energy-math-desc {
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(200,245,200,0.55);
          margin: 0;
        }

        /* Food Web Accordion */
        .eco-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .eco-acc-item {
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 4px solid var(--tlc);
          background: rgba(2,6,2,0.65);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .eco-acc-item.open {
          border-color: var(--tlc);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .eco-acc-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          font-family: inherit;
          gap: 12px;
        }

        .eco-acc-left {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .eco-acc-badge {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: var(--tlc);
          color: #020502;
          font-weight: 850;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .eco-acc-name {
          display: block;
          font-size: 0.95rem;
          font-weight: 750;
        }

        .eco-acc-desc {
          display: block;
          font-size: 0.72rem;
          color: rgba(200,245,200,0.45);
          margin-top: 1px;
        }

        .eco-acc-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .eco-acc-energy {
          font-size: 0.72rem;
          color: var(--tlc);
          font-weight: 700;
          font-family: monospace;
        }

        .eco-acc-chevron {
          font-size: 1rem;
          color: rgba(200,245,200,0.3);
          transition: transform 0.3s ease;
        }

        .eco-acc-item.open .eco-acc-chevron {
          transform: rotate(180deg);
        }

        .eco-acc-body {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .eco-org-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
          padding: 0 18px 18px;
        }

        .eco-org-card {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1.2px solid;
        }

        .eco-org-name {
          display: block;
          font-weight: 700;
          font-size: 0.86rem;
          margin-bottom: 3px;
        }

        .eco-org-role {
          font-size: 0.74rem;
          color: rgba(200,245,200,0.5);
          line-height: 1.35;
        }

        /* Educational sideways card */
        .eco-edu-card {
          border: 1px solid rgba(57,255,20,0.12);
          background: rgba(5,15,5,0.35);
          border-radius: 18px;
          padding: 32px;
          margin-bottom: 48px;
        }

        .eco-edu-card-title {
          font-size: 1.25rem;
          font-weight: 850;
          color: #39FF14;
          margin: 0 0 12px 0;
        }

        .eco-edu-card-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: rgba(200,245,200,0.7);
          margin: 0 0 28px 0;
        }

        .eco-cycles-quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .eco-cycle-card {
          border: 1.2px solid;
          border-radius: 12px;
          background: rgba(0,0,0,0.3);
          padding: 18px;
        }

        .eco-cycle-steps {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .eco-cycle-step-item {
          font-size: 0.72rem;
          line-height: 1.35;
          color: rgba(200,245,200,0.65);
        }

        /* Mobile Layout */
        @media (max-width: 900px) {
          .eco-side-panel {
            top: auto;
            bottom: 20px;
            right: 50%;
            transform: translateX(50%) translateY(120%);
            width: 90%;
            max-height: 40vh;
          }
          .eco-side-panel.visible {
            transform: translateX(50%) translateY(0);
          }
          .eco-detail-split {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .eco-cycles-quick-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .eco-biome-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .eco-biome-grid {
            grid-template-columns: 1fr;
          }
          .eco-tab-bar {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}
