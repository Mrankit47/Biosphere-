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
    name: "Temperate Deciduous Forest",
    emoji: "🌲",
    color: "#10B981",
    climate: "Temperate, four distinct seasons, 75–150 cm precipitation/year",
    location: "Eastern North America, Western Europe, East Asia",
    facts: [
      "Deciduous trees shed leaves in autumn to conserve water, creating nutrient-rich humus soil.",
      "A single mature oak can support over 2,300 species of insects, fungi, birds, and mammals.",
      "Forest canopy, understory, and floor create distinct microclimates at different heights.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Make their own food via photosynthesis", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Oak Trees", role: "Photosynthesis, oxygen production, oak acorns" }, { name: "Ferns", role: "Undergrowth ground cover, soil anchoring" }, { name: "Mosses", role: "Moisture retention, microhabitat creation" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Herbivores that eat producers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "White-Tailed Deer", role: "Browser, herbivore, seed dispersal" }, { name: "Eastern Cottontail", role: "Grazer, prey base for carnivores" }, { name: "Grey Squirrel", role: "Seed caching, forest regeneration helper" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Carnivores that eat herbivores", energy: "1% transferred (100 kcal)", organisms: [{ name: "Red Fox", role: "Population control of rodents and rabbits" }, { name: "Broad-Winged Hawk", role: "Aerial predator, rodent population regulator" }, { name: "Garter Snake", role: "Control of insect and small rodent populations" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Gray Wolf", role: "Keystone pack predator, deer regulator" }, { name: "Black Bear", role: "Apex omnivore, seed dispersal, winter hibernator" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle nutrients back to soil", energy: "Energy cycle complete", organisms: [{ name: "Bracket Fungi", role: "Break down logs, lignocellulose recycler" }, { name: "Earthworms", role: "Soil mixing, aeration, organic shredding" }, { name: "Mycorrhizal Networks", role: "Symbiotic mineral-nutrient underground exchange" }] },
    ],
  },
  {
    id: "coral_reef",
    name: "Coral Reef Ecosystem",
    emoji: "🪸",
    color: "#F43F5E",
    climate: "Warm waters (20–28°C), shallow photic zone, stable high salinity",
    location: "Indo-Pacific, Caribbean Sea, Red Sea, Great Barrier Reef",
    facts: [
      "Though covering less than 0.1% of ocean floor, coral reefs support 25% of all marine life.",
      "Hard corals are symbiotic animals hosting microscopic zooxanthellae algae that provide food via photosynthesis.",
      "Reef structures buffer coastlines from 97% of wave energy, preventing erosion.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Convert solar rays into biological sugars", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Zooxanthellae", role: "Symbiotic microalgae feeding coral polyps" }, { name: "Turf Algae", role: "Fast-growing reef surface primary productivity" }, { name: "Phytoplankton", role: "Pelagic drifting primary producers" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Herbivores and filter feeders", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Parrotfish", role: "Algae scraping, sand creation via bioerosion" }, { name: "Green Sea Turtle", role: "Seagrass browser, maintains grass health" }, { name: "Zooplankton", role: "Microscopic filter feeders grazing phytoplankton" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Carnivores eating primary consumers", energy: "1% transferred (100 kcal)", organisms: [{ name: "Clownfish", role: "Anemone mutualist, plankton hunter" }, { name: "Damselfish", role: "Territorial algae farmers, micro-predators" }, { name: "Blue Linckia Star", role: "Reef-surface invertebrate predator" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Reef Shark", role: "Apex predator, keeps meso-predators in check" }, { name: "Giant Moray Eel", role: "Nocturnal crevice hunter, piscivore" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle organic debris in the water", energy: "Energy cycle complete", organisms: [{ name: "Sea Cucumber", role: "Detrital sand filtration and nitrogen release" }, { name: "Hermit Crab", role: "Scavenger of organic debris and dead tissues" }, { name: "Marine Bacteria", role: "Decompose suspended organic carbon" }] },
    ],
  },
  {
    id: "desert",
    name: "Chihuahuan Desert",
    emoji: "🏜️",
    color: "#F59E0B",
    climate: "Arid, low rain (10-25 cm/yr), extreme day-night temperature swings",
    location: "Southwestern United States, Northern Mexico",
    facts: [
      "Many desert plants use CAM photosynthesis, opening stomata only at night to prevent water loss.",
      "Seeds of ephemeral desert wildflowers can lie dormant in dry soil for decades waiting for rain.",
      "Desert animals like kangaroo rats never need to drink water, obtaining it entirely from metabolic seed digestion.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Drought-adapted photosynthesizers", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Saguaro Cactus", role: "Fleshy water storage, nocturnal flower source" }, { name: "Creosote Bush", role: "Root allelopathy, extreme drought resilience" }, { name: "Desert Wildflowers", role: "Opportunistic seed producers after rare rains" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Water-conserving herbivores", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Kangaroo Rat", role: "Granivore, synthesis of water via metabolism" }, { name: "Desert Tortoise", role: "Slow herbivore, critical soil burrow creator" }, { name: "Black-Tailed Jackrabbit", role: "Browser, large ears radiate excess body heat" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Predators of desert small animals", energy: "1% transferred (100 kcal)", organisms: [{ name: "Greater Roadrunner", role: "Fast reptile and insect cursorial hunter" }, { name: "Gila Monster", role: "Venomous nest predator, fat storage in tail" }, { name: "Desert Tarantula", role: "Nocturnal ambush invertebrate predator" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Coyote", role: "Opportunistic apex pack hunter, scavenger" }, { name: "Golden Eagle", role: "High-altitude aerial predator of jackrabbits" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle organic debris on dry sand", energy: "Energy cycle complete", organisms: [{ name: "Desert Darkling Beetles", role: "Detritus shredders, moisture collectors" }, { name: "Cryptobiotic Soil Crust", role: "Living soil layer of cyanobacteria and mosses" }, { name: "Saprophytic Fungi", role: "Break down woody desert plant materials" }] },
    ],
  },
  {
    id: "savanna",
    name: "Grassland Savanna",
    emoji: "🌾",
    color: "#84CC16",
    climate: "Warm year-round, distinct wet/dry seasons, fire-adapted vegetation",
    location: "East African Serengeti, Australian Outback, Brazilian Cerrado",
    facts: [
      "Savanna grasses grow from the base rather than the tip, allowing them to survive grazing and fires.",
      "Elephants are ecosystem engineers, knocking down trees to maintain open grasslands for grazers.",
      "Periodic wildfires burn dry grass, releasing nitrogen back into the soil and preventing forest takeover.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Fire and drought adapted vegetation", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Red Oat Grass", role: "Rapid C4 photosynthesis, fire-tolerant roots" }, { name: "Acacia Tree", role: "Deep taproots, symbiotic ant guard systems" }, { name: "Baobab Tree", role: "Massive water-storing woody trunk" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Migratory and browser herbivores", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Plains Zebra", role: "Bulk pioneer grazer, migratory herds" }, { name: "Blue Wildebeest", role: "Mass migration, lawn-style cropping grazers" }, { name: "Reticulated Giraffe", role: "High-canopy acacia browser" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Fast and pack-hunting predators", energy: "1% transferred (100 kcal)", organisms: [{ name: "Cheetah", role: "High-speed cursorial hunter of gazelles" }, { name: "Spotted Hyena", role: "Social pack hunters, bone-crushing jaws" }, { name: "Secretary Bird", role: "Terrestrial predator of snakes and lizards" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "African Lion", role: "Pride hunters, apex population regulators" }, { name: "African Leopard", role: "Solitary ambush predator, tree-caching specialist" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle waste on the dry savanna floor", energy: "Energy cycle complete", organisms: [{ name: "Dung Beetle", role: "Waste burial, soil aeration, seed planting" }, { name: "Macrotermes Termites", role: "Wood cellulose decomposers, nest builders" }, { name: "Ruppell's Vulture", role: "Scavenger, carcass clearing, disease buffer" }] },
    ],
  },
  {
    id: "vent",
    name: "Deep-Sea Hydrothermal Vent",
    emoji: "🌋",
    color: "#6366F1",
    climate: "Aphotic, 2°C seawater, superheated 380°C fluids, extreme pressure",
    location: "Mid-Atlantic Ridge, East Pacific Rise, Mariana Back-Arc",
    facts: [
      "This ecosystem operates in total darkness, relying on geothermal chemical energy instead of sunlight.",
      "The water under 2,500 meters of depth is under 250 atm of pressure, keeping superheated 380°C fluids liquid.",
      "Black smoker chimneys are formed when mineral-rich, hot fluids meet freezing seawater, precipitating metal sulfides.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Chemosynthetic sulfur-oxidizing bacteria", energy: "100% (10,000 kcal from earth)", organisms: [{ name: "Sulfur-Oxidizing Bacteria", role: "Chemosynthesis using toxic hydrogen sulfide" }, { name: "Endosymbiotic Bacteria", role: "Reside inside tube worms, providing nutrients" }, { name: "Free-living Bacteria Mats", role: "Cover rock walls, forming grazeable lawns" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Symbiotic hosts and bacterial grazers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Giant Tube Worms", role: "Lacks mouth/gut; completely fed by symbionts" }, { name: "Alvinella Pompeii Worms", role: "High-heat tolerance, lives in chimney walls" }, { name: "Vent Clams", role: "Filter-feed on chemosynthetic bacteria" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Active benthic crustacean predators", energy: "1% transferred (100 kcal)", organisms: [{ name: "Rimicaris Vent Shrimp", role: "Graze on bacterial mats coating chimney rims" }, { name: "Zoarcid Fish (Eelpouts)", role: "Slow-moving predators of worms and shrimp" }, { name: "Bythograeid Vent Crabs", role: "Active predators of tube worms and shrimp" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators of the hydrothermal vents", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Vulcanoctopus", role: "Rare benthic octopus preying on vent crabs" }, { name: "Deep-sea Rattail Fish", role: "Apex macrourid predator attracted to vent plumes" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Recycle organic remains on the seafloor", energy: "Energy cycle complete", organisms: [{ name: "Sulfate-Reducing Bacteria", role: "Anoxic organic decay, releases hydrogen sulfide" }, { name: "Galatheid Squat Lobsters", role: "Scavenge falling debris and dead shell matter" }, { name: "Lysianassid Amphipods", role: "Voracious deep-sea crustacean scavengers" }] },
    ],
  },
  {
    id: "tundra",
    name: "Arctic Tundra",
    emoji: "❄️",
    color: "#38BDF8",
    climate: "Extreme cold, short summer (60 days), low rain, permafrost subsoil",
    location: "Siberia, Northern Alaska, Arctic Archipelago",
    facts: [
      "Permafrost is a permanently frozen subsoil layer that acts as an impermeable barrier to water drainage, creating summer bogs.",
      "Plants are low-growing and hug the ground to stay warm, insulate from snow, and escape high winds.",
      "The tundra is a critical global carbon sink; its frozen peat stores double the amount of carbon currently in the atmosphere.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Cold-resistant prostrate vegetation", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Reindeer Lichen", role: "Symbiotic carbohydrate producer, caribou feed" }, { name: "Dwarf Arctic Willow", role: "Woody low-growing shrub, wind resistant" }, { name: "Sphagnum Moss", role: "Water retention, ground insulator" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Cold-insulated herbivores", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Caribou (Reindeer)", role: "Migratory grazer, excavations under snow" }, { name: "Tundra Lemming", role: "Sub-nivean burrower, base prey animal" }, { name: "Muskox", role: "Heavy hair insulates, feeds on sedges" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Small predators of birds and rodents", energy: "1% transferred (100 kcal)", organisms: [{ name: "Arctic Fox", role: "Predator of lemmings, caches eggs in summer" }, { name: "Stoat (Short-tailed Weasel)", role: "Voracious micro-predator of rodents" }, { name: "Snowy Owl", role: "Aerial predator, matches lemming cycles" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Arctic Wolf", role: "Pack hunter of caribou and muskoxen" }, { name: "Polar Bear", role: "Apex predator of seal and beached whales" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Slow nutrient cycling in frozen ground", energy: "Energy cycle complete", organisms: [{ name: "Psychrophilic Soil Fungi", role: "Cold-adapted decomposers of leaf detritus" }, { name: "Soil Nematodes", role: "Microscopic roundworms, aerate moss layer" }, { name: "Actinobacteria", role: "Mineralization of organic soil compounds" }] },
    ],
  },
  {
    id: "mangrove",
    name: "Mangrove Estuary",
    emoji: "🦀",
    color: "#0D9488",
    climate: "Tropical coast, brackish variable salinity, tidal fluctuations",
    location: "Sunderbans (India/Bangladesh), Florida Everglades, Indo-Malayan coast",
    facts: [
      "Mangroves filter up to 90% of sea salt using specialized root membranes, excreting the rest through leaves.",
      "Their complex stilt roots (pneumatophores) act as breathing tubes in oxygen-poor mud, while providing nurseries for 70% of local commercial fish.",
      "Mangrove soils are powerful 'blue carbon' sinks, storing up to 10 times more carbon per acre than terrestrial rain forests.",
    ],
    trophicLevels: [
      { level: 1, name: "Producers", color: "#10B981", desc: "Salt-tolerant intertidal halophytes", energy: "100% (10,000 kcal from sun)", organisms: [{ name: "Red Mangrove", role: "High-standing stilt roots, excludes sea salt" }, { name: "Black Mangrove", role: "Pneumatophores pump oxygen down to roots" }, { name: "Benthic Diatoms", role: "Estuarine silt microalgae, carbon fixing" }] },
      { level: 2, name: "Primary Consumers", color: "#3B82F6", desc: "Detritus shredders and filterers", energy: "10% transferred (1,000 kcal)", organisms: [{ name: "Fiddler Crab", role: "Detrital consumer, aerates sulfidic mud" }, { name: "Mangrove Periwinkle Snail", role: "Grazes algae off leaves, avoids tides" }, { name: "Striped Mullet Fish", role: "Sediment filter feeder, key forage fish" }] },
      { level: 3, name: "Secondary Consumers", color: "#F59E0B", desc: "Amphibious mud and nursery predators", energy: "1% transferred (100 kcal)", organisms: [{ name: "Mudskipper", role: "Amphibious fish, hunts insects and crabs" }, { name: "Snapping Shrimp", role: "Crevice-dweller, stuns small fish and crabs" }, { name: "Juvenile Mutton Snapper", role: "Reef nursery resident, hunts micro-crustaceans" }] },
      { level: 4, name: "Tertiary Consumers", color: "#EF4444", desc: "Top predators — apex of the food chain", energy: "0.1% transferred (10 kcal)", organisms: [{ name: "Osprey (Fish Hawk)", role: "Aerial fish-eating raptor, nests in canopy" }, { name: "Saltwater Crocodile", role: "Apex estuarine predator, controls fish/mammals" }] },
      { level: 5, name: "Decomposers", color: "#A855F7", desc: "Fungi and bacteria that shred leaves in mud", energy: "Energy cycle complete", organisms: [{ name: "Detrital Marine Fungi", role: "Shreds mangrove leaf cellulose in seawater" }, { name: "Anaerobic Estuarine Bacteria", role: "Digests mud organics in oxygen-poor silt" }, { name: "Polychaete Worms", role: "Shreds marine detritus, aerates sediment" }] },
    ],
  },
];

const BASE_COMPONENTS = {
  producers: {
    name: "Producers (Biotic)",
    type: "Biotic Component",
    emoji: "🌿",
    color: "#10B981",
    desc: "Autotrophic organisms (mostly photosynthetic plants, algae, or cyanobacteria) that synthesize chemical energy from inorganic inputs.",
    roles: [
      "Converts ambient energy into chemical bonds (sugars)",
      "Releases free oxygen gas or metabolic products",
      "Base biomass layer supporting all consumer levels"
    ]
  },
  consumers: {
    name: "Consumers (Biotic)",
    type: "Biotic Component",
    emoji: "🦌",
    color: "#EF4444",
    desc: "Heterotrophic organisms that feed on other living things to extract organic compounds. Spans herbivores, carnivores, and omnivores.",
    roles: [
      "Transfers energy across upper trophic tiers",
      "Maintains population control via predator-prey dynamics",
      "Excretes nitrogenous waste that fertilizes the habitat"
    ]
  },
  decomposers: {
    name: "Decomposers (Biotic)",
    type: "Biotic Component",
    emoji: "🍄",
    color: "#A855F7",
    desc: "Detritivorous fungi, bacteria, and invertebrates that break down dead organic matter back into chemical nutrients.",
    roles: [
      "Recycles essential chemical minerals and elements",
      "Prevents toxic accumulation of dead organic matter",
      "Returns soil/sediment nutrients to the geological loop"
    ]
  },
  sun: {
    name: "Solar Energy",
    type: "Abiotic Component",
    emoji: "☀️",
    color: "#F59E0B",
    desc: "The primary source of electromagnetic radiation driving photosynthesis in producers and warming the climate.",
    roles: [
      "Powers chloroplast reactions in producers",
      "Supplies thermal energy driving weather systems",
      "Maintains temperature bounds for enzyme activities"
    ]
  },
  water: {
    name: "Water & Moisture",
    type: "Abiotic Component",
    emoji: "💧",
    color: "#3B82F6",
    desc: "The universal chemical solvent required for metabolic activity and nutrient transport.",
    roles: [
      "Medium for biochemical metabolic transport",
      "Reactant in photosynthetic reduction",
      "Stabilizes biome temperatures via high specific heat"
    ]
  },
  soil: {
    name: "Soil & Nutrients",
    type: "Abiotic Component",
    emoji: "🪵",
    color: "#8D6E63",
    desc: "Structure of minerals, organic debris, and air serving as anchor and nutrient repository.",
    roles: [
      "Provides physical substrate anchorage for producers",
      "Stores and filters moisture in root zones",
      "Reservoir of nitrogen, phosphates, and essential minerals"
    ]
  },
  atmosphere: {
    name: "Atmosphere & Gases",
    type: "Abiotic Component",
    emoji: "☁️",
    color: "#90A4AE",
    desc: "The gas envelope shielding the earth, storing carbon dioxide (CO₂) and oxygen (O₂).",
    roles: [
      "Raw source of carbon atoms for organic life (CO₂)",
      "Provides oxygen to fuel consumer cell respiration (O₂)",
      "Shields biosphere from harmful cosmic radiation"
    ]
  }
};

const BIOME_ABIOTIC_OVERRIDES: Record<string, Record<string, typeof BASE_COMPONENTS.producers>> = {
  forest: {
    sun: {
      name: "Solar Radiation",
      type: "Abiotic Component",
      emoji: "☀️",
      color: "#F59E0B",
      desc: "Solar energy driving photosynthesis in the forest canopy and understory, governing seasonal phenology and temperature.",
      roles: [
        "Powers chlorophyll light reactions in deciduous trees",
        "Sets seasonal signals (photoperiod) for hibernation and leaf-fall",
        "Warms forest floor to speed up decomposition"
      ]
    },
    water: {
      name: "Precipitation & Moisture",
      type: "Abiotic Component",
      emoji: "💧",
      color: "#3B82F6",
      desc: "Water entering the forest via rain and snow. It is absorbed by deep root networks and transpired back to the atmosphere.",
      roles: [
        "Acts as a hydrogen donor in photosynthetic light reaction",
        "Prevents cell wilting via turgor pressure",
        "Dissolves soil nutrients for root absorption"
      ]
    },
    soil: {
      name: "Organic Humus & Soil",
      type: "Abiotic Component",
      emoji: "🪱",
      color: "#8D6E63",
      desc: "A rich mixture of weathered minerals, decaying leaf litter, mycorrhizal fungi, and aeration tunnels from earthworms.",
      roles: [
        "Provides physical anchorage for massive tree roots",
        "Acts as a chemical sponge holding nitrogen and phosphorus",
        "Retains sub-surface moisture between rainfall events"
      ]
    },
    atmosphere: {
      name: "Ambient Atmosphere",
      type: "Abiotic Component",
      emoji: "☁️",
      color: "#90A4AE",
      desc: "The ambient air containing CO2 for photosynthesis and O2 for respiration, heavily regulated by transpiration humidity.",
      roles: [
        "Provides carbon dioxide gas as the carbon building block",
        "Supports oxygen respiration in animals and decomposers",
        "Transports pollen and seeds over long distances"
      ]
    }
  },
  coral_reef: {
    sun: {
      name: "Shallow Solar Rays",
      type: "Abiotic Component",
      emoji: "☀️",
      color: "#F59E0B",
      desc: "Light filtering through clear, shallow waters to fuel photosynthesis in symbiotic zooxanthellae algae.",
      roles: [
        "Limits coral growth to the photic zone (top 50 meters)",
        "Drives primary productivity of reef turf algae",
        "Heats tropical waters to optimal 20-28°C ranges"
      ]
    },
    water: {
      name: "Salinity & Currents",
      type: "Abiotic Component",
      emoji: "🌊",
      color: "#3B82F6",
      desc: "Warm, high-salinity seawater kept in motion by tidal currents and waves, supplying nutrients and clearing sediments.",
      roles: [
        "Brings oxygen and calcium ions to calcifying corals",
        "Disperses coral planulae (larvae) to colonize new areas",
        "Clears blocking silt that would choke feeding polyps"
      ]
    },
    soil: {
      name: "Calcium Carbonate Reef",
      type: "Abiotic Component",
      emoji: "🪸",
      color: "#E2E8F0",
      desc: "The complex limestone skeletal structure built by calcifying corals, forming the physical framework of the reef.",
      roles: [
        "Creates millions of structural niches, caves, and shelters",
        "Provides attachment sites for sponges and algae",
        "Stores carbonate minerals in the geological carbon cycle"
      ]
    },
    atmosphere: {
      name: "Dissolved Marine Gases",
      type: "Abiotic Component",
      emoji: "🫧",
      color: "#90A4AE",
      desc: "Oxygen and carbon dioxide dissolved in seawater. Acidity (pH) determines if corals can build their calcium skeletons.",
      roles: [
        "Provides dissolved carbon dioxide for marine photosynthesis",
        "Provides dissolved oxygen for respiration in aquatic species",
        "Buffering pH prevents reef dissolution (acidification)"
      ]
    }
  },
  desert: {
    sun: {
      name: "Intense Solar Irradiance",
      type: "Abiotic Component",
      emoji: "☀️",
      color: "#F59E0B",
      desc: "Extreme, cloudless solar radiation that causes blistering daytime heat and drives high evaporation rates.",
      roles: [
        "Selects for CAM plants that close stomata during daylight",
        "Drives extreme temperatures that force animals to be nocturnal",
        "Destroys plant toxins through photo-oxidation on dry soil"
      ]
    },
    water: {
      name: "Ephemeral Rain & Dew",
      type: "Abiotic Component",
      emoji: "🌵",
      color: "#3B82F6",
      desc: "Highly scarce rainfall (<25 cm/year), occurring in sudden storms, supplemented by cold desert morning dew.",
      roles: [
        "Triggers explosive seasonal blooming and seed hatching",
        "Stored internally by succulent plants for months",
        "Replenishes ephemeral pools and deep aquifers"
      ]
    },
    soil: {
      name: "Aridisols & Mineral Sand",
      type: "Abiotic Component",
      emoji: "🏜️",
      color: "#DDB892",
      desc: "Alkaline, mineral-rich sand and gravel lacking organic humus, often covered by a fragile living cryptobiotic crust.",
      roles: [
        "Cyanobacterial crust binds soil to prevent wind erosion",
        "Permeable sand lets rare water drain quickly to deep roots",
        "High mineral content provides calcium and potassium"
      ]
    },
    atmosphere: {
      name: "Hyper-Arid Air",
      type: "Abiotic Component",
      emoji: "🌬️",
      color: "#B0BEC5",
      desc: "Air with near-zero humidity, leading to rapid heat loss at night and intense heat retention during the day.",
      roles: [
        "Causes extreme day-night thermal swings of up to 40°C",
        "Enables rapid thermal cooling via panting or ears",
        "Exerts severe osmotic pressure, requiring thick cuticles"
      ]
    }
  },
  savanna: {
    sun: {
      name: "Seasonal Solar Intensity",
      type: "Abiotic Component",
      emoji: "☀️",
      color: "#F59E0B",
      desc: "Consistent equatorial sunlight that heats the grassland and drives seasonal wind and monsoon weather shifts.",
      roles: [
        "Powers fast-growing C4 grasses during the wet season",
        "Dries out standing biomass to prepare for seasonal fires",
        "Drives thermals used by migrating birds and vultures"
      ]
    },
    water: {
      name: "Seasonal Monsoon & Drought",
      type: "Abiotic Component",
      emoji: "⛈️",
      color: "#3B82F6",
      desc: "Ecosystem shaped by extreme wet seasons of heavy rain followed by months of absolute drought.",
      roles: [
        "Wet season prompts massive herbivore migrations",
        "Consolidated activity at shrinking waterholes",
        "Forces trees like the Baobab to store water in trunks"
      ]
    },
    soil: {
      name: "Fire-Enriched Clay Soil",
      type: "Abiotic Component",
      emoji: "🪨",
      color: "#A1887F",
      desc: "Clay-heavy, poorly draining soils enriched periodically by ash deposits from seasonal grass fires.",
      roles: [
        "Nutrient-rich ash fertilizer triggers rapid grass shoots",
        "Termite mounds create concentrated nutrient hotspots",
        "Clay layer slows evaporation of deep soil moisture"
      ]
    },
    atmosphere: {
      name: "Convective Wind & Smoke",
      type: "Abiotic Component",
      emoji: "💨",
      color: "#90A4AE",
      desc: "Hot, dry air dominated by convective winds that spread grass fires and smoke plumes across the plains.",
      roles: [
        "Spreads grass fires essential for clearing woody saplings",
        "Transports smoke particles that act as rain nucleation sites",
        "Distributes dry acacia seed pods across long distances"
      ]
    }
  },
  vent: {
    sun: {
      name: "Geothermal Heat Plume",
      type: "Abiotic Driver",
      emoji: "🌋",
      color: "#EF4444",
      desc: "Replacing solar energy, geothermal heat from the earth's mantle superheats seawater (380°C) loaded with reduced chemical compounds.",
      roles: [
        "Provides thermal energy to drive hydrothermal venting",
        "Supplies reduced hydrogen sulfide (H₂S) as chemical fuel",
        "Creates a steep temperature gradient (2°C to 100°C) for organisms"
      ]
    },
    water: {
      name: "Mineral-Rich Fluids",
      type: "Abiotic Component",
      emoji: "🫧",
      color: "#475569",
      desc: "Anoxic, acidic seawater enriched with iron, sulfur, copper, and silica, spewed directly from cracks in the oceanic crust.",
      roles: [
        "Supplies the raw electron donors (H₂S, methane) for chemosynthesis",
        "Heavy metal ions precipitate to build chimney structures",
        "Dissolved oxygen in ambient cold water acts as electron acceptor"
      ]
    },
    soil: {
      name: "Basaltic Vent Chimney",
      type: "Abiotic Component",
      emoji: "🪨",
      color: "#334155",
      desc: "Porous towers of iron, copper, and zinc sulfides precipitated from the fluid, providing structural anchor and chemical gradients.",
      roles: [
        "Provides direct substrate anchorage for tube worms and clams",
        "Porous walls act as thermal insulators with localized zones",
        "Releases chemical minerals directly into biological zones"
      ]
    },
    atmosphere: {
      name: "Benthic Hydrostatic Pressure",
      type: "Abiotic Component",
      emoji: "🪐",
      color: "#1E293B",
      desc: "The crushing pressure (250+ atm) of the deep abyss. This extreme pressure keeps water liquid at temperatures well above boiling.",
      roles: [
        "Prevents 380°C superheated fluid from boiling, stabilizing the plume",
        "Shapes cellular structure, requiring piezophilic enzyme adaptations",
        "Suppresses gas bubble formation, forcing dissolved chemical transfer"
      ]
    }
  },
  tundra: {
    sun: {
      name: "Low-Angle Insolation",
      type: "Abiotic Component",
      emoji: "🌤️",
      color: "#A5F3FC",
      desc: "Weak solar radiation hitting at an oblique angle, causing extreme photoperiod changes (polar night to midnight sun).",
      roles: [
        "Provides a very short, intense 60-day summer growing window",
        "Fails to warm the subsoil, keeping it permanently frozen",
        "Triggers rapid flowering and growth in dwarf vegetation"
      ]
    },
    water: {
      name: "Snowpack & Meltwater",
      type: "Abiotic Component",
      emoji: "❄️",
      color: "#93C5FD",
      desc: "Water locked in snow and ice for 9 months, forming extensive surface bogs and lakes during the brief summer thaw.",
      roles: [
        "Winter snowpack insulates ground plants from freezing wind",
        "Summer meltwater saturates topsoil, forming critical wetlands",
        "Low evaporation rate keeps soil wet despite low rain"
      ]
    },
    soil: {
      name: "Permafrost & Peat",
      type: "Abiotic Component",
      emoji: "🧊",
      color: "#854D0E",
      desc: "Permanently frozen subsoil (permafrost) beneath an active soil layer, which prevents drainage and traps carbon in peat.",
      roles: [
        "Restricts root growth to the shallow active layer (top 15-30cm)",
        "Impedes water drainage, creating swampy summer insect nurseries",
        "Slows decomposition, archiving organic carbon for millennia"
      ]
    },
    atmosphere: {
      name: "Desiccating Subzero Winds",
      type: "Abiotic Component",
      emoji: "💨",
      color: "#E2E8F0",
      desc: "Extremely cold, dry, fast-moving polar air masses that dry out exposed vegetation and require specialized defenses.",
      roles: [
        "Causes severe wind-chill and tissue dehydration in winter",
        "Forces plants to adopt prostrate, ground-hugging shapes",
        "Low temperature slows biochemical reaction rates in ectotherms"
      ]
    }
  },
  mangrove: {
    sun: {
      name: "Estuarine Solar Insolation",
      type: "Abiotic Component",
      emoji: "☀️",
      color: "#F59E0B",
      desc: "Abundant equatorial sunlight driving rapid transpiration and photosynthesis in the mangrove canopy.",
      roles: [
        "Drives transpiration pull, forcing root desalinization",
        "Powers high leaf-biomass production (the base of the web)",
        "Warms tidal mud flats to stimulate benthic algal mats"
      ]
    },
    water: {
      name: "Brackish Tidal Flux",
      type: "Abiotic Component",
      emoji: "🌊",
      color: "#0288D1",
      desc: "A fluctuating mix of fresh river water and salty ocean tides, exposing the ecosystem to salinity swings twice daily.",
      roles: [
        "Twice-daily tides distribute organic detritus out to sea",
        "Creates a severe osmotic barrier, selecting for salt-tolerant trees",
        "Brings oxygenated seawater to counteract anaerobic soil mud"
      ]
    },
    soil: {
      name: "Anaerobic Sulfidic Mud",
      type: "Abiotic Component",
      emoji: "💩",
      color: "#4A3728",
      desc: "Waterlogged silt lacking oxygen (O₂), rich in toxic hydrogen sulfide (H₂S) and organic peat.",
      roles: [
        "Forces mangroves to grow arching stilt roots to breathe air",
        "Slows decay of buried peat, locking away blue carbon",
        "Provides a soft, cohesive burrowing substrate for crabs"
      ]
    },
    atmosphere: {
      name: "Tidal Canopy Humidity",
      type: "Abiotic Component",
      emoji: "☁️",
      color: "#90A4AE",
      desc: "High humidity and variable wind speeds, buffering salt stress and cooling the intertidal forest floor.",
      roles: [
        "Reduces transpiration water loss under hot sun",
        "Cushions temperature extremes on exposed mud flats",
        "Carries salt spray, coating leaf tops with salt crusts"
      ]
    }
  }
};

const getBiomeCycles = (biomeId: string) => {
  if (biomeId === "vent") {
    return {
      chemosynthesis: {
        name: "Sulfide Chemosynthesis",
        emoji: "🔄🌋",
        color: "#EF4444",
        desc: "The geochemical energy loop that replaces solar photosynthesis, converting toxic hydrogen sulfide into organic carbohydrates.",
        steps: [
          "Chemical Ejection: Vents spew superheated hydrogen sulfide (H₂S) gas.",
          "Oxidation: Free-living or symbiotic bacteria oxidize H₂S using oxygen.",
          "Energy Capture: The oxidation reaction releases energy, used to fix carbon dioxide (CO₂) into sugars.",
          "Direct Feeding: Hosts (like tube worms) directly digest bacterial sugars, bypassing light."
        ]
      },
      precipitation: {
        name: "Mineral Precipitation Loop",
        emoji: "🔄🪨",
        color: "#475569",
        desc: "The physical cycle of superheated minerals cooling to build the towering physical structures of the vents.",
        steps: [
          "Superheating: Seawater seeps into oceanic crust and is heated to 400°C by magma.",
          "Mineral Leaching: Hot fluid dissolves metals (iron, copper, zinc) from basaltic rock.",
          "Vent Exhalation: Plumes eject mineral fluids into cold 2°C seawater.",
          "Precipitation: Sudden cooling makes minerals crystallize, forming massive chimney walls."
        ]
      },
      abyssal_energy: {
        name: "Abyssal Energy Transfer",
        emoji: "🔄⚡",
        color: "#10B981",
        desc: "Chemosynthetic energy transfer through deep-sea trophic webs, where oxygen acts as the ultimate electron acceptor.",
        steps: [
          "Bacterial Mat Production: Sulfur-oxidizing bacteria cover chimney surfaces.",
          "Trophic Consumption: Rimicaris shrimp and vent crabs graze on the mats.",
          "Endosymbiont Transfer: Tube worms convert sulfide energy directly for tissues.",
          "Apex Predation: Rare vulcanoctopuses and rattails regulate benthic prey populations."
        ]
      }
    };
  } else if (biomeId === "mangrove") {
    return {
      blue_carbon: {
        name: "Blue Carbon Capture",
        emoji: "🔄🌱",
        color: "#10B981",
        desc: "The capture and long-term storage of atmospheric carbon dioxide by marine coastal wetlands, burying carbon 10x faster than dry forests.",
        steps: [
          "Rapid Photosynthesis: Mangroves absorb atmospheric CO₂ to construct wood and leaves.",
          "Detrital Shedding: Dead leaves and branches fall into the intertidal waterlogged mud.",
          "Anaerobic burial: Lack of oxygen prevents decomposers from decaying the organic matter.",
          "Millennial Sequestration: Carbon remains locked in peat for thousands of years, buffering warming."
        ]
      },
      tidal_detrital: {
        name: "Tidal Detrital Export",
        emoji: "🔄🌊",
        color: "#3B82F6",
        desc: "The hydrological flush that carries dissolved organic matter and leaf detritus out to sea, feeding surrounding reef webs.",
        steps: [
          "Leaf Fragmentation: Fallen mangrove leaves are shredded by fiddler crabs.",
          "Microbial Colonization: Bacteria coat leaf debris, boosting its protein content.",
          "Tidal Outflow: High tide drains the mud flats, carrying nutrient-rich debris out.",
          "Coastal Enrichment: Offshore filter-feeders, shrimp, and fish ingest this carbon source."
        ]
      },
      estuarine_osmotic: {
        name: "Osmotic Salt Filtration",
        emoji: "🔄💧",
        color: "#F59E0B",
        desc: "The physiological cycle of water uptake under high salinity, requiring dynamic root pumping and leaf salt excretion.",
        steps: [
          "Ultrafiltration: Red mangrove roots exclude 90% of sea salt using negative pressure.",
          "Transpiration Stream: Desalinated water rises through xylem to support leaf metabolism.",
          "Salt Excretion: Black mangroves pump excess salt out through specialized leaf glands.",
          "Leaf Shedding: Old leaves accumulate salt and are shed to purge excess salinity."
        ]
      }
    };
  } else if (biomeId === "tundra") {
    return {
      peat_carbon: {
        name: "Permafrost Carbon Trap",
        emoji: "🔄❄️",
        color: "#854D0E",
        desc: "The thermal feedback loop of soil carbon trapped in ice, representing one of Earth's largest climate tipping points.",
        steps: [
          "Summer Growth: Lichens, mosses, and dwarf willows capture carbon in brief thaws.",
          "Shedding & Burial: Dead vegetation falls onto the freezing soil floor.",
          "Freezing (Permafrost): Subzero temperatures freeze organic matter before it decays.",
          "Warming Release: If permafrost melts, microbes wake up and digest peat, releasing CO₂ and methane."
        ]
      },
      freeze_thaw: {
        name: "Freeze-Thaw Hydrology",
        emoji: "🔄💧",
        color: "#3B82F6",
        desc: "The seasonal cycle of water transitioning between solid ice and boggy meltwater, which dictates plant germination.",
        steps: [
          "Winter Glaciation: Snow covers the tundra and water freezes solid to depth.",
          "Insulation: The snowpack traps warm ground air, protecting plant buds from winds.",
          "Summer Melt: The top active soil layer melts, but water cannot drain through frozen permafrost.",
          "Bog Formation: Trapped surface meltwater forms bogs, supporting mosquitoes and mosses."
        ]
      },
      tundra_trophic: {
        name: "Tundra Trophic Boom-Bust",
        emoji: "🔄⚡",
        color: "#EF4444",
        desc: "Energy flow characterized by extreme population cycles, particularly the 4-year lemming boom-bust wave.",
        steps: [
          "Lemming Population Boom: Lemmings multiply rapidly, consuming vast amounts of moss.",
          "Predator Gathering: Snowy owls and arctic foxes gather, feeding exclusively on lemmings.",
          "Vegetation Collapse: Overgrazed mosses decline, leading to a massive lemming crash.",
          "Predator Dispersion: Snowy owls migrate south and arctic foxes switch to bird eggs."
        ]
      }
    };
  } else {
    return {
      water: {
        name: biomeId === "coral_reef" ? "Water Column & Tides" : "Water Cycle (Hydrological)",
        emoji: "🔄💧",
        color: "#3B82F6",
        desc: biomeId === "coral_reef" 
          ? "The movement of seawater driven by currents, evaporation, and tides, maintaining chemical uniformity."
          : "Continuous physical cycles of water circulation between land, oceans, biota, and atmosphere.",
        steps: biomeId === "coral_reef"
          ? [
              "Evaporation: Solar heat converts surface water into vapor, raising salinity.",
              "Precipitation: Rain falls back to sea, lowering surface salinity.",
              "Tidal Upwelling: Deep currents bring cool, nutrient-rich water to the reef surface.",
              "Photosynthetic Absorption: Algae absorb water molecules to carry out cellular reduction."
            ]
          : [
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
        desc: "Organic and chemical exchange loops of carbon atoms among soils/sediments, waters, air, and biotic pathways.",
        steps: biomeId === "coral_reef"
          ? [
              "Dissolution: Atmospheric CO₂ dissolves in seawater, forming bicarbonate.",
              "Calcification: Coral polyps combine calcium with bicarbonate to build skeletal structures.",
              "Respiration: Reef organisms oxidize sugars, releasing CO₂ back into the water.",
              "Sedimentary Burial: Broken shells and coral skeleton bury carbon in reef silt."
            ]
          : [
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
  }
};

const ENERGY_STEPS = [
  { label: "Sun/Earth", val: "" },
  { label: "Plants/Mats", val: "10,000 kcal" },
  { label: "Herbivore", val: "1,000 kcal" },
  { label: "Carnivore", val: "100 kcal" },
  { label: "Apex", val: "10 kcal" },
];

/* ═══════════════════════════════════════════════════════════════
   3D COMPONENT PARTS
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   3D COMPONENT PARTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Flora meshes ───────────────────────────────────────────── */

function Cactus({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const cactusMat = getGlowMaterial ? getGlowMaterial("producers", "#2E7D32") : <meshStandardMaterial color="#2E7D32" roughness={0.9} />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        {cactusMat}
      </mesh>
      {/* Left Arm */}
      <mesh castShadow position={[-0.18, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        {cactusMat}
      </mesh>
      <mesh castShadow position={[-0.3, 0.88, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        {cactusMat}
      </mesh>
      {/* Right Arm */}
      <mesh castShadow position={[0.18, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        {cactusMat}
      </mesh>
      <mesh castShadow position={[0.3, 0.73, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
        {cactusMat}
      </mesh>
    </group>
  );
}

function PineTree({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const trunkMat = getGlowMaterial ? getGlowMaterial("producers", "#5D4037", false) : <meshStandardMaterial color="#5D4037" roughness={0.9} />;
  const leavesMat1 = getGlowMaterial ? getGlowMaterial("producers", "#1B5E20") : <meshStandardMaterial color="#1B5E20" roughness={0.9} />;
  const leavesMat2 = getGlowMaterial ? getGlowMaterial("producers", "#2E7D32") : <meshStandardMaterial color="#2E7D32" roughness={0.9} />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.7, 8]} />
        {trunkMat}
      </mesh>
      <mesh castShadow position={[0, 0.8, 0]}>
        <coneGeometry args={[0.32, 0.7, 8]} />
        {leavesMat1}
      </mesh>
      <mesh castShadow position={[0, 1.2, 0]}>
        <coneGeometry args={[0.22, 0.5, 8]} />
        {leavesMat2}
      </mesh>
    </group>
  );
}

function DeciduousTree({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const trunkMat = getGlowMaterial ? getGlowMaterial("producers", "#4E342E", false) : <meshStandardMaterial color="#4E342E" roughness={0.9} />;
  const leavesMat1 = getGlowMaterial ? getGlowMaterial("producers", "#2E7D32") : <meshStandardMaterial color="#2E7D32" roughness={0.8} />;
  const leavesMat2 = getGlowMaterial ? getGlowMaterial("producers", "#388E3C") : <meshStandardMaterial color="#388E3C" roughness={0.8} />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
        {trunkMat}
      </mesh>
      <mesh castShadow position={[0, 0.9, 0]}>
        <dodecahedronGeometry args={[0.35, 1]} />
        {leavesMat1}
      </mesh>
      <mesh castShadow position={[0.12, 1.05, 0.08]}>
        <dodecahedronGeometry args={[0.25, 1]} />
        {leavesMat2}
      </mesh>
    </group>
  );
}

function AcaciaTree({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const trunkMat = getGlowMaterial ? getGlowMaterial("producers", "#4E342E", false) : <meshStandardMaterial color="#4E342E" roughness={0.9} />;
  const leavesMat = getGlowMaterial ? getGlowMaterial("producers", "#1B5E20") : <meshStandardMaterial color="#1B5E20" roughness={0.8} />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.45, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.05, 0.08, 0.9, 8]} />
        {trunkMat}
      </mesh>
      <mesh castShadow position={[0.15, 0.9, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.035, 0.045, 0.5, 8]} />
        {trunkMat}
      </mesh>
      <mesh castShadow position={[0.25, 1.1, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.15, 10]} />
        {leavesMat}
      </mesh>
    </group>
  );
}

function Kelp({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
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
  const stemMat = getGlowMaterial ? getGlowMaterial("producers", "#00796B") : <meshStandardMaterial color="#00796B" roughness={0.6} />;
  const leafMat = getGlowMaterial ? getGlowMaterial("producers", "#00897B") : <meshStandardMaterial color="#00897B" roughness={0.5} />;
  return (
    <group position={position}>
      <mesh geometry={geom} castShadow>
        {stemMat}
      </mesh>
      {Array.from({ length: 5 }).map((_, idx) => (
        <mesh
          key={idx}
          position={[Math.sin(idx * 0.9) * 0.08, idx * 0.2 + 0.08, Math.cos(idx * 0.9) * 0.04]}
          rotation={[0.3, 0.1, 0.7]}
        >
          <dodecahedronGeometry args={[0.05, 0]} />
          {leafMat}
        </mesh>
      ))}
    </group>
  );
}

function BrainCoral({ position, getGlowMaterial, color = "#F472B6" }: { position: [number, number, number]; getGlowMaterial?: any; color?: string }) {
  const coralMat = getGlowMaterial ? getGlowMaterial("producers", color) : <meshStandardMaterial color={color} roughness={0.9} flatShading />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.15, 0]}>
        <dodecahedronGeometry args={[0.2, 2]} />
        {coralMat}
      </mesh>
    </group>
  );
}

function StaghornCoral({ position, getGlowMaterial, color = "#FB923C" }: { position: [number, number, number]; getGlowMaterial?: any; color?: string }) {
  const coralMat = getGlowMaterial ? getGlowMaterial("producers", color) : <meshStandardMaterial color={color} roughness={0.9} />;
  return (
    <group position={position}>
      {/* Main stem */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
        {coralMat}
      </mesh>
      {/* Left Branch */}
      <mesh castShadow position={[-0.08, 0.32, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
        {coralMat}
      </mesh>
      {/* Right Branch */}
      <mesh castShadow position={[0.08, 0.26, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        {coralMat}
      </mesh>
    </group>
  );
}

function SeaAnemone({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const baseMat = getGlowMaterial ? getGlowMaterial("producers", "#A78BFA") : <meshStandardMaterial color="#A78BFA" roughness={0.6} />;
  const tentacleMat = getGlowMaterial ? getGlowMaterial("producers", "#F472B6") : <meshStandardMaterial color="#F472B6" roughness={0.5} />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.12, 10]} />
        {baseMat}
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const r = 0.06;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.15, Math.sin(angle) * r]}
            rotation={[0.2, angle, 0.3]}
          >
            <cylinderGeometry args={[0.01, 0.015, 0.1, 4]} />
            {tentacleMat}
          </mesh>
        );
      })}
    </group>
  );
}

function VentChimney({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const chimneyMat = getGlowMaterial ? getGlowMaterial("soil", "#374151", false) : <meshStandardMaterial color="#374151" roughness={0.95} metalness={0.1} />;
  const capMat = getGlowMaterial ? getGlowMaterial("soil", "#1F2937", false) : <meshStandardMaterial color="#1F2937" roughness={0.95} />;
  const sideMat = getGlowMaterial ? getGlowMaterial("soil", "#111827", false) : <meshStandardMaterial color="#111827" roughness={0.95} />;
  return (
    <group position={position}>
      {/* Basalt stack */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.35, 1.2, 10]} />
        {chimneyMat}
      </mesh>
      <mesh castShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.3, 8]} />
        {capMat}
      </mesh>
      <mesh castShadow position={[0.05, 0.9, -0.05]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
        {sideMat}
      </mesh>
      {/* Glowing Vent Opening */}
      <mesh position={[0, 1.455, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

function TubeWorm({ position, getGlowMaterial, height = 0.45, rotation = [0, 0, 0] }: { position: [number, number, number]; getGlowMaterial?: any; height?: number; rotation?: [number, number, number] }) {
  const tubeMat = getGlowMaterial ? getGlowMaterial("consumers", "#F8FAFC") : <meshStandardMaterial color="#F8FAFC" roughness={0.7} />;
  const plumeMat = getGlowMaterial ? getGlowMaterial("consumers", "#EF4444") : <meshStandardMaterial color="#EF4444" roughness={0.5} emissive="#EF4444" emissiveIntensity={0.2} />;
  return (
    <group position={position} rotation={rotation}>
      {/* White base tube */}
      <mesh castShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.025, height, 8]} />
        {tubeMat}
      </mesh>
      {/* Red plume */}
      <mesh position={[0, height + 0.04, 0]}>
        <coneGeometry args={[0.022, 0.09, 8]} />
        {plumeMat}
      </mesh>
    </group>
  );
}

function TundraDwarfShrub({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const leavesMat1 = getGlowMaterial ? getGlowMaterial("producers", "#4D7C0F") : <meshStandardMaterial color="#4D7C0F" roughness={0.8} />;
  const leavesMat2 = getGlowMaterial ? getGlowMaterial("producers", "#3F6212") : <meshStandardMaterial color="#3F6212" roughness={0.8} />;
  const leavesMat3 = getGlowMaterial ? getGlowMaterial("producers", "#1B4332") : <meshStandardMaterial color="#1B4332" roughness={0.9} />;
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <dodecahedronGeometry args={[0.18, 1]} />
        {leavesMat1}
      </mesh>
      <mesh castShadow position={[0.1, 0.06, 0.08]}>
        <dodecahedronGeometry args={[0.12, 1]} />
        {leavesMat2}
      </mesh>
      <mesh castShadow position={[-0.08, 0.04, -0.08]}>
        <dodecahedronGeometry args={[0.1, 1]} />
        {leavesMat3}
      </mesh>
    </group>
  );
}

function LichenPatch({ position, getGlowMaterial, scale = [1, 1, 1] }: { position: [number, number, number]; getGlowMaterial?: any; scale?: [number, number, number] }) {
  const patchMat = getGlowMaterial ? getGlowMaterial("producers", "#CA8A04") : <meshStandardMaterial color="#CA8A04" roughness={0.9} side={THREE.DoubleSide} />;
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <ringGeometry args={[0, 0.15, 6]} />
      {patchMat}
    </mesh>
  );
}

function MangroveTree({ position, getGlowMaterial }: { position: [number, number, number]; getGlowMaterial?: any }) {
  const trunkMat = getGlowMaterial ? getGlowMaterial("producers", "#5C4033", false) : <meshStandardMaterial color="#5C4033" roughness={0.9} />;
  const rootMat = getGlowMaterial ? getGlowMaterial("producers", "#4A3728", false) : <meshStandardMaterial color="#4A3728" roughness={0.9} />;
  const leafMat1 = getGlowMaterial ? getGlowMaterial("producers", "#166534") : <meshStandardMaterial color="#166534" roughness={0.8} />;
  const leafMat2 = getGlowMaterial ? getGlowMaterial("producers", "#15803D") : <meshStandardMaterial color="#15803D" roughness={0.8} />;
  return (
    <group position={position}>
      {/* Trunk starting higher up */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.8, 8]} />
        {trunkMat}
      </mesh>
      {/* Stilt Roots arching down */}
      {/* Root 1: North */}
      <mesh castShadow position={[0.18, 0.28, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        {rootMat}
      </mesh>
      {/* Root 2: South */}
      <mesh castShadow position={[-0.18, 0.28, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        {rootMat}
      </mesh>
      {/* Root 3: East */}
      <mesh castShadow position={[0, 0.28, 0.18]} rotation={[Math.PI / 5, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        {rootMat}
      </mesh>
      {/* Root 4: West */}
      <mesh castShadow position={[0, 0.28, -0.18]} rotation={[-Math.PI / 5, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        {rootMat}
      </mesh>

      {/* Canopy */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.38, 12, 12]} />
        {leafMat1}
      </mesh>
      <mesh castShadow position={[0.1, 1.45, 0.05]}>
        <sphereGeometry args={[0.26, 12, 12]} />
        {leafMat2}
      </mesh>
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
      case "coral_reef": return "#00E5FF"; // Bubbles
      case "desert": return "#FFE082"; // Sand dust
      case "savanna": return "#D4E157"; // Grass seed
      case "vent": return "#94A3B8"; // Sulfide debris
      case "tundra": return "#FFFFFF"; // Snow particles
      case "mangrove": return "#2DD4BF"; // Saline mist
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

function ProducersGroup({ biomeId, getGlowMaterial }: { biomeId: string; getGlowMaterial: any }) {
  switch (biomeId) {
    case "forest":
      return (
        <>
          <PineTree position={[-0.8, -0.74, -0.4]} getGlowMaterial={getGlowMaterial} />
          <DeciduousTree position={[-0.4, -0.74, 0.4]} getGlowMaterial={getGlowMaterial} />
          <PineTree position={[0.2, -0.74, -0.9]} getGlowMaterial={getGlowMaterial} />
        </>
      );
    case "savanna":
      return (
        <>
          <AcaciaTree position={[-0.5, -0.74, 0.3]} getGlowMaterial={getGlowMaterial} />
          <AcaciaTree position={[0.4, -0.74, -0.6]} getGlowMaterial={getGlowMaterial} />
        </>
      );
    case "desert":
      return (
        <>
          <Cactus position={[-0.7, -0.74, 0.1]} getGlowMaterial={getGlowMaterial} />
          <Cactus position={[0.1, -0.74, -0.7]} getGlowMaterial={getGlowMaterial} />
          <Cactus position={[-0.3, -0.74, -0.6]} getGlowMaterial={getGlowMaterial} />
        </>
      );
    case "coral_reef":
      return (
        <>
          <Kelp position={[-0.7, -0.74, 0.2]} getGlowMaterial={getGlowMaterial} />
          <Kelp position={[0.6, -0.74, -0.6]} getGlowMaterial={getGlowMaterial} />
          <BrainCoral position={[-0.25, -0.74, -0.5]} getGlowMaterial={getGlowMaterial} color="#F43F5E" />
          <StaghornCoral position={[0.2, -0.74, 0.35]} getGlowMaterial={getGlowMaterial} color="#FB923C" />
          <SeaAnemone position={[-0.3, -0.74, 0.6]} getGlowMaterial={getGlowMaterial} />
        </>
      );
    case "vent":
      return (
        <>
          {/* Chemosynthetic bacterial mats glowing green-white on chimney and seafloor */}
          <mesh position={[-0.6, -0.735, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, 0.25, 8]} />
            {getGlowMaterial("producers", "#A7F3D0", false)}
          </mesh>
          <mesh position={[0.4, -0.735, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, 0.3, 8]} />
            {getGlowMaterial("producers", "#A7F3D0", false)}
          </mesh>
          <mesh position={[0.07, 0.1, 0.04]} rotation={[0, Math.PI / 4, 0.1]}>
            <cylinderGeometry args={[0.155, 0.165, 0.3, 8, 1, true]} />
            {getGlowMaterial("producers", "#34D399", false)}
          </mesh>
          <mesh position={[-0.08, 0.5, -0.05]} rotation={[0, -Math.PI / 3, -0.15]}>
            <cylinderGeometry args={[0.135, 0.145, 0.25, 8, 1, true]} />
            {getGlowMaterial("producers", "#34D399", false)}
          </mesh>
        </>
      );
    case "tundra":
      return (
        <>
          <TundraDwarfShrub position={[-0.6, -0.74, 0.3]} getGlowMaterial={getGlowMaterial} />
          <TundraDwarfShrub position={[0.5, -0.74, -0.5]} getGlowMaterial={getGlowMaterial} />
          <LichenPatch position={[-0.2, -0.735, -0.4]} getGlowMaterial={getGlowMaterial} scale={[1.2, 1, 0.8]} />
          <LichenPatch position={[0.2, -0.735, 0.4]} getGlowMaterial={getGlowMaterial} scale={[0.8, 1, 1.1]} />
          <LichenPatch position={[-0.5, -0.735, 0.7]} getGlowMaterial={getGlowMaterial} scale={[1, 1, 1]} />
        </>
      );
    case "mangrove":
      return (
        <>
          <MangroveTree position={[-0.5, -0.74, -0.3]} getGlowMaterial={getGlowMaterial} />
          <MangroveTree position={[0.4, -0.74, 0.4]} getGlowMaterial={getGlowMaterial} />
        </>
      );
    default:
      return null;
  }
}

function ConsumersGroup({ biomeId, getGlowMaterial }: { biomeId: string; getGlowMaterial: any }) {
  switch (biomeId) {
    case "forest":
    case "savanna":
    case "desert":
      return (
        <>
          {/* Primary Consumer (Rabbit/Herbivore) */}
          <group position={[-0.8, -0.69, 0.7]} rotation={[0, 0.4, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.14, 0.1, 0.2]} />
              {getGlowMaterial("consumers", "#D7CCC8")}
            </mesh>
            <mesh position={[0, 0.1, 0.05]}>
              <boxGeometry args={[0.09, 0.1, 0.09]} />
              {getGlowMaterial("consumers", "#D7CCC8")}
            </mesh>
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
          </group>
          {/* Secondary/Tertiary Predator */}
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
        </>
      );
    case "coral_reef":
      return (
        <>
          {/* Clownfish (orange-and-white) */}
          <group position={[-0.3, -0.4, 0.6]} rotation={[0, 0.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.07, 0.04]} />
              {getGlowMaterial("consumers", "#F97316")}
            </mesh>
            <mesh position={[0, 0, 0.005]}>
              <boxGeometry args={[0.03, 0.072, 0.041]} />
              {getGlowMaterial("consumers", "#FFFFFF")}
            </mesh>
          </group>
          {/* Blue tang (blue-and-yellow) */}
          <group position={[0.4, -0.3, -0.2]} rotation={[0, -1.1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.14, 0.09, 0.03]} />
              {getGlowMaterial("consumers", "#2563EB")}
            </mesh>
            <mesh position={[-0.04, 0, 0.005]}>
              <boxGeometry args={[0.04, 0.04, 0.031]} />
              {getGlowMaterial("consumers", "#FACC15")}
            </mesh>
          </group>
        </>
      );
    case "vent":
      return (
        <>
          {/* Giant tube worms clustered at chimney base */}
          <TubeWorm position={[0.3, -0.74, 0.25]} height={0.5} rotation={[0.1, 0.2, -0.05]} getGlowMaterial={getGlowMaterial} />
          <TubeWorm position={[-0.28, -0.74, 0.3]} height={0.4} rotation={[-0.15, -0.1, 0.08]} getGlowMaterial={getGlowMaterial} />
          <TubeWorm position={[0.2, -0.74, -0.32]} height={0.55} rotation={[-0.05, 0.4, 0.12]} getGlowMaterial={getGlowMaterial} />
          <TubeWorm position={[-0.35, -0.74, -0.2]} height={0.48} rotation={[0.08, -0.3, -0.08]} getGlowMaterial={getGlowMaterial} />

          {/* Vent shrimp (Rimicaris) crawling on the chimney wall */}
          <group position={[0.15, 0.15, -0.08]} rotation={[0.5, 0.6, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.03, 0.03]} />
              {getGlowMaterial("consumers", "#E2E8F0")}
            </mesh>
          </group>
          <group position={[-0.14, 0.52, 0.04]} rotation={[-0.4, -0.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.05, 0.025, 0.025]} />
              {getGlowMaterial("consumers", "#E2E8F0")}
            </mesh>
          </group>
        </>
      );
    case "tundra":
      return (
        <>
          {/* Arctic Hare (white block) */}
          <group position={[-0.7, -0.70, 0.5]} rotation={[0, 0.6, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.1, 0.08, 0.15]} />
              {getGlowMaterial("consumers", "#F8FAFC")}
            </mesh>
            <mesh position={[0, 0.06, 0.03]}>
              <boxGeometry args={[0.06, 0.06, 0.06]} />
              {getGlowMaterial("consumers", "#F8FAFC")}
            </mesh>
          </group>
          {/* Arctic Fox */}
          <group position={[0.6, -0.67, -0.4]} rotation={[0, -0.9, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.11, 0.25]} />
              {getGlowMaterial("consumers", "#E2E8F0")}
            </mesh>
            <mesh position={[0, 0.09, 0.08]}>
              <boxGeometry args={[0.09, 0.08, 0.1]} />
              {getGlowMaterial("consumers", "#E2E8F0")}
            </mesh>
            {/* Tail */}
            <mesh position={[0, -0.01, -0.16]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.12]} />
              {getGlowMaterial("consumers", "#E2E8F0")}
            </mesh>
          </group>
        </>
      );
    case "mangrove":
      return (
        <>
          {/* Fiddler Crab with large orange-red claw */}
          <group position={[-0.2, -0.72, 0.5]} rotation={[0, 0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.1, 0.05, 0.07]} />
              {getGlowMaterial("consumers", "#92400E")}
            </mesh>
            <mesh position={[0.06, 0.01, 0.03]} rotation={[0.1, 0.2, 0.1]}>
              <boxGeometry args={[0.05, 0.04, 0.08]} />
              {getGlowMaterial("consumers", "#EF4444")}
            </mesh>
          </group>
          {/* Mudskipper amphibious fish */}
          <group position={[0.15, -0.72, 0.15]} rotation={[0, -1.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.05, 0.16]} />
              {getGlowMaterial("consumers", "#78716C")}
            </mesh>
            <mesh position={[0, 0.03, 0.03]}>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              {getGlowMaterial("consumers", "#A8A29E")}
            </mesh>
          </group>
        </>
      );
    default:
      return null;
  }
}

function DecomposersGroup({ biomeId, getGlowMaterial }: { biomeId: string; getGlowMaterial: any }) {
  switch (biomeId) {
    case "forest":
    case "desert":
    case "savanna":
    case "tundra":
      const stemColor = "#ECEFF1";
      const capColor = biomeId === "tundra" ? "#D97706" : biomeId === "desert" ? "#78350F" : "#EF5350";
      return (
        <group position={[-0.3, -0.74, -0.8]}>
          {/* Mushroom 1 */}
          <group position={[0, 0, 0]}>
            <mesh castShadow position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
              {getGlowMaterial("decomposers", stemColor)}
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              {getGlowMaterial("decomposers", capColor)}
            </mesh>
          </group>
          {/* Mushroom 2 */}
          <group position={[0.14, 0, 0.1]}>
            <mesh castShadow position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
              {getGlowMaterial("decomposers", stemColor)}
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              {getGlowMaterial("decomposers", capColor)}
            </mesh>
          </group>
        </group>
      );
    case "coral_reef":
      // Sea cucumber crawling on seafloor
      return (
        <group position={[-0.4, -0.73, -0.5]} rotation={[0, 0.7, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
            {getGlowMaterial("decomposers", "#7C2D12")}
          </mesh>
        </group>
      );
    case "vent":
      // Squat lobsters crawling near chimney base
      return (
        <>
          <group position={[-0.5, -0.73, -0.4]} rotation={[0, 0.3, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.07, 0.02, 0.07]} />
              {getGlowMaterial("decomposers", "#E2E8F0")}
            </mesh>
          </group>
          <group position={[0.4, -0.73, -0.5]} rotation={[0, -0.6, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.018, 0.06]} />
              {getGlowMaterial("decomposers", "#E2E8F0")}
            </mesh>
          </group>
        </>
      );
    case "mangrove":
      // Marine polychaete mud worm representation
      return (
        <group position={[0.5, -0.73, -0.2]} rotation={[0, -0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.03, 0.06]} />
            {getGlowMaterial("decomposers", "#451A03")}
          </mesh>
        </group>
      );
    default:
      return null;
  }
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
      case "coral_reef": return "#06B6D4";
      case "desert": return "#F59E0B";
      case "savanna": return "#84CC16";
      case "vent": return "#6366F1";
      case "tundra": return "#93C5FD";
      case "mangrove": return "#0F766E";
      default: return "#10B981";
    }
  }, [biomeId]);

  const groundColor = useMemo(() => {
    switch (biomeId) {
      case "forest": return "#3E2723";
      case "coral_reef": return "#022340";
      case "desert": return "#E0A96D";
      case "savanna": return "#8D6E63";
      case "vent": return "#1E293B";
      case "tundra": return "#E2E8F0";
      case "mangrove": return "#3E2A1E";
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

    // Vent Chemosynthetic Ejection: chimney mouth [0, 0.7, 0] straight up to upper plume [0, 1.8, 0]
    const pVentEject = [
      new THREE.Vector3(0, 0.71, 0),
      new THREE.Vector3(0.05, 1.25, 0),
      new THREE.Vector3(0.1, 1.8, 0)
    ];
    // Vent Chemosynthetic Assimilation: Plume upper [0.1, 1.8, 0] to chimney walls/ground [0.4, -0.73, 0.4]
    const pVentAssim = [
      new THREE.Vector3(0.1, 1.8, 0),
      new THREE.Vector3(0.3, 0.9, 0.2),
      new THREE.Vector3(0.4, -0.73, 0.4)
    ];
    // Vent Trophic Transfer: Bacteria [0.4, -0.73, 0.4] to tube worms/consumers [-0.28, -0.74, 0.3]
    const pVentTrophic = [
      new THREE.Vector3(0.4, -0.73, 0.4),
      new THREE.Vector3(0.15, -0.73, 0.1),
      new THREE.Vector3(-0.28, -0.74, 0.3)
    ];

    // Mangrove Carbon Capture: Air [0.5, 1.6, 0.5] to canopy [-0.5, 0.56, -0.3]
    const pMangroveCapture = [
      new THREE.Vector3(0.5, 1.6, 0.5),
      new THREE.Vector3(-0.1, 1.1, -0.1),
      new THREE.Vector3(-0.5, 0.56, -0.3)
    ];
    // Mangrove Leaf Fall: Canopy [-0.5, 0.56, -0.3] to mud floor [-0.5, -0.74, -0.3]
    const pMangroveLeaf = [
      new THREE.Vector3(-0.5, 0.56, -0.3),
      new THREE.Vector3(-0.5, -0.1, -0.3),
      new THREE.Vector3(-0.5, -0.74, -0.3)
    ];
    // Mangrove Tidal Flush: Mud floor [-0.5, -0.74, -0.3] to estuary outer boundary [1.8, -0.68, 1.8]
    const pMangroveFlush = [
      new THREE.Vector3(-0.5, -0.74, -0.3),
      new THREE.Vector3(0, -0.7, 0.5),
      new THREE.Vector3(1.8, -0.68, 1.8)
    ];

    // Tundra Summer Melt: Cloud [-1.1, 1.6, -0.4] to tundra bog [-0.2, -0.735, -0.4]
    const pTundraMelt = [
      new THREE.Vector3(-1.1, 1.6, -0.4),
      new THREE.Vector3(-0.65, 0.4, -0.4),
      new THREE.Vector3(-0.2, -0.735, -0.4)
    ];
    // Tundra Carbon Trap: Shrub [0.5, -0.64, -0.5] down into permafrost soil [0.5, -0.85, -0.5]
    const pTundraTrap = [
      new THREE.Vector3(0.5, -0.64, -0.5),
      new THREE.Vector3(0.5, -0.75, -0.5),
      new THREE.Vector3(0.5, -0.85, -0.5)
    ];

    return {
      waterEvap: new THREE.CatmullRomCurve3(pEvap),
      waterRain: new THREE.CatmullRomCurve3(pRain),
      carbonPhoto: new THREE.CatmullRomCurve3(pPhoto),
      carbonCons: new THREE.CatmullRomCurve3(pCons),
      carbonResp: new THREE.CatmullRomCurve3(pResp),
      
      ventEject: new THREE.CatmullRomCurve3(pVentEject),
      ventAssim: new THREE.CatmullRomCurve3(pVentAssim),
      ventTrophic: new THREE.CatmullRomCurve3(pVentTrophic),
      
      mangroveCapture: new THREE.CatmullRomCurve3(pMangroveCapture),
      mangroveLeaf: new THREE.CatmullRomCurve3(pMangroveLeaf),
      mangroveFlush: new THREE.CatmullRomCurve3(pMangroveFlush),
      
      tundraMelt: new THREE.CatmullRomCurve3(pTundraMelt),
      tundraTrap: new THREE.CatmullRomCurve3(pTundraTrap),
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

  const isVent = biomeId === "vent";

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
        <group>
          <mesh position={[0, -0.8, 0]} receiveShadow>
            <cylinderGeometry args={[3.12, 3.12, 0.12, 32]} />
            {getGlowMaterial("soil", groundColor, false)}
          </mesh>
          {isVent && (
            <VentChimney position={[0, -0.74, 0]} getGlowMaterial={getGlowMaterial} />
          )}
        </group>
      </InteractiveMesh>

      {/* ── Sun / Geothermal Plume (Abiotic Component) ── */}
      {isVent ? (
        <InteractiveMesh
          active={activeComponentId === "sun"}
          onHover={(h) => setHoveredId(h ? "sun" : null)}
          onClick={() => onSelectComponent("sun")}
        >
          {/* Glowing vent plume head */}
          <group position={[0, 0.71, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial
                color="#EF4444"
                transparent
                opacity={activeViewMode === "cycles" ? 0.3 : activeComponentId === "sun" ? 1.0 : 0.8}
              />
            </mesh>
            <pointLight color="#FCA5A5" intensity={2.0} distance={5} decay={1.5} />
          </group>
        </InteractiveMesh>
      ) : (
        <InteractiveMesh
          active={activeComponentId === "sun"}
          onHover={(h) => setHoveredId(h ? "sun" : null)}
          onClick={() => onSelectComponent("sun")}
        >
          <mesh
            position={biomeId === "tundra" ? [-2.2, 0.8, -1.5] : [0, 2.1, 0]}
            castShadow
          >
            <sphereGeometry args={[biomeId === "tundra" ? 0.22 : 0.3, 16, 16]} />
            <meshBasicMaterial
              color={biomeId === "tundra" ? "#E0F7FA" : "#FFD54F"}
              transparent
              opacity={activeViewMode === "cycles" ? 0.3 : activeComponentId === "sun" ? 1.0 : 0.85}
            />
          </mesh>
          <pointLight
            position={biomeId === "tundra" ? [-2.2, 0.8, -1.5] : [0, 2.1, 0]}
            color={biomeId === "tundra" ? "#E0F7FA" : "#FFF9C4"}
            intensity={biomeId === "tundra" ? 0.8 : 1.5}
            distance={8}
            decay={1.5}
          />
        </InteractiveMesh>
      )}

      {/* ── Atmosphere / Clouds (Abiotic Component) ── */}
      {!isVent && biomeId !== "coral_reef" && (
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

      {/* ── Water Surface / Pool (Abiotic Component) ── */}
      {biomeId === "mangrove" || biomeId === "coral_reef" ? (
        <InteractiveMesh
          active={activeComponentId === "water"}
          onHover={(h) => setHoveredId(h ? "water" : null)}
          onClick={() => onSelectComponent("water")}
        >
          <mesh position={[0, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[3.08, 3.08, 0.02, 32]} />
            <meshStandardMaterial
              color="#0288D1"
              transparent
              opacity={activeComponentId === "water" ? 0.6 : 0.35}
              roughness={0.1}
            />
          </mesh>
        </InteractiveMesh>
      ) : (
        !isVent && (
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
        )
      )}

      {/* ── Producers (Biotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "producers"}
        onHover={(h) => setHoveredId(h ? "producers" : null)}
        onClick={() => onSelectComponent("producers")}
      >
        <group>
          <ProducersGroup biomeId={biomeId} getGlowMaterial={getGlowMaterial} />
        </group>
      </InteractiveMesh>

      {/* ── Consumers (Biotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "consumers"}
        onHover={(h) => setHoveredId(h ? "consumers" : null)}
        onClick={() => onSelectComponent("consumers")}
      >
        <group>
          <ConsumersGroup biomeId={biomeId} getGlowMaterial={getGlowMaterial} />
        </group>
      </InteractiveMesh>

      {/* ── Decomposers (Biotic Component) ── */}
      <InteractiveMesh
        active={activeComponentId === "decomposers"}
        onHover={(h) => setHoveredId(h ? "decomposers" : null)}
        onClick={() => onSelectComponent("decomposers")}
      >
        <group>
          <DecomposersGroup biomeId={biomeId} getGlowMaterial={getGlowMaterial} />
        </group>
      </InteractiveMesh>

      {/* ── Flowing Cycles Visuals (Cycles view mode) ── */}
      {activeViewMode === "cycles" && (
        <group>
          {biomeId === "vent" ? (
            <>
              {/* Sulfide Ejection: Chimney top [0, 0.71, 0] to upper plume [0.1, 1.8, 0] */}
              <FlowingParticles curve={cycleCurves.ventEject} color="#EF4444" count={6} speed={0.4} />
              {/* Chemosynthetic Assimilation: Plume to bacterial mats [0.4, -0.73, 0.4] */}
              <FlowingParticles curve={cycleCurves.ventAssim} color="#A7F3D0" count={5} speed={0.3} />
              {/* Trophic transfer: Bacteria to tube worms [-0.28, -0.74, 0.3] */}
              <FlowingParticles curve={cycleCurves.ventTrophic} color="#F59E0B" count={5} speed={0.25} />
            </>
          ) : biomeId === "mangrove" ? (
            <>
              {/* Carbon Capture: Sun/Air to Mangrove canopy [-0.5, 0.56, -0.3] */}
              <FlowingParticles curve={cycleCurves.mangroveCapture} color="#10B981" count={5} speed={0.35} />
              {/* Leaf fall: Canopy to mud floor [-0.5, -0.74, -0.3] */}
              <FlowingParticles curve={cycleCurves.mangroveLeaf} color="#854D0E" count={4} speed={0.2} />
              {/* Tidal Flush: Mud floor to estuary outer boundary [1.8, -0.68, 1.8] */}
              <FlowingParticles curve={cycleCurves.mangroveFlush} color="#0288D1" count={6} speed={0.45} />
            </>
          ) : biomeId === "tundra" ? (
            <>
              {/* Summer Melt: Cloud to tundra bog [-0.2, -0.735, -0.4] */}
              <FlowingParticles curve={cycleCurves.tundraMelt} color="#93C5FD" count={5} speed={0.4} />
              {/* Carbon trap: Plants to deep permafrost [0.5, -0.85, -0.5] */}
              <FlowingParticles curve={cycleCurves.tundraTrap} color="#A855F7" count={5} speed={0.2} />
            </>
          ) : (
            <>
              {/* Standard Cycles */}
              <FlowingParticles curve={cycleCurves.waterEvap} color="#81D4FA" count={6} speed={0.4} />
              <FlowingParticles curve={cycleCurves.waterRain} color="#0288D1" count={6} speed={0.4} />
              <FlowingParticles curve={cycleCurves.carbonPhoto} color="#66BB6A" count={5} speed={0.3} />
              <FlowingParticles curve={cycleCurves.carbonCons} color="#C8E6C9" count={4} speed={0.3} />
              <FlowingParticles curve={cycleCurves.carbonResp} color="#EF5350" count={5} speed={0.3} />
            </>
          )}
        </group>
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
      <ambientLight intensity={biomeId === "vent" ? 0.04 : 0.4} color={biomeId === "vent" ? "#0F172A" : "#ECEFF1"} />

      {/* Primary Warm Sun Key Light */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={biomeId === "vent" ? 0.0 : 1.6}
        color="#FFFDE7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cool fill light */}
      <directionalLight
        position={[-8, -4, 4]}
        intensity={biomeId === "vent" ? 0.05 : 0.7}
        color={biomeId === "vent" ? "#1E1B4B" : "#E3F2FD"}
      />

      {/* Dynamic spot light focused on dome center */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.7}
        intensity={biomeId === "vent" ? 4.5 : 1.2}
        color={biomeId === "vent" ? "#FFFFFF" : biomeColor}
        castShadow
      />

      <Environment preset={biomeId === "vent" ? "night" : biomeId === "coral_reef" || biomeId === "mangrove" ? "sunset" : "forest"} />

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

  const componentData = useMemo(() => {
    if (!selectedComponentId) return null;
    const override = BIOME_ABIOTIC_OVERRIDES[selectedBiomeId]?.[selectedComponentId];
    if (override) return override;
    const base = BASE_COMPONENTS[selectedComponentId as keyof typeof BASE_COMPONENTS];
    if (base) return base;
    return null;
  }, [selectedComponentId, selectedBiomeId]);

  const trophicData = selectedTrophicLevel !== null
    ? biome.trophicLevels.find((t) => t.level === selectedTrophicLevel)
    : null;

  const cycleData = activeViewMode === "cycles"
    ? getBiomeCycles(selectedBiomeId)
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
            {Object.entries(getBiomeCycles(selectedBiomeId)).map(([key, item]) => (
              <div key={key} className="eco-cycle-card" style={{ borderColor: `${item.color}30` }}>
                <h4 style={{ color: item.color, margin: "0 0 8px 0" }}>{item.emoji} {item.name}</h4>
                <p style={{ fontSize: "0.78rem", color: "rgba(200,245,200,0.6)", margin: "0 0 10px 0", lineHeight: 1.4 }}>{item.desc}</p>
                <div className="eco-cycle-steps">
                  {item.steps.map((st: string, si: number) => (
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
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
