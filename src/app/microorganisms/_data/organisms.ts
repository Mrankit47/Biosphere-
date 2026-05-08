export interface OrganismPart {
  name: string;
  description: string;
  color: string;
}

export interface OrganismData {
  id: string;
  name: string;
  scientificName: string;
  emoji: string;
  color: string;
  accentColor: string;
  type: string;
  size: string;
  habitat: string;
  reproduction: string;
  description: string;
  funFact: string;
  taxonomy: {
    domain: string;
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  parts: OrganismPart[];
}

export const ORGANISMS: OrganismData[] = [
  {
    id: "amoeba",
    name: "Amoeba",
    scientificName: "Amoeba proteus",
    emoji: "🫧",
    color: "#39FF14",
    accentColor: "#2ECC71",
    type: "Protozoa",
    size: "0.1 – 0.5 mm",
    habitat: "Freshwater ponds, soil, decaying matter",
    reproduction: "Binary fission (asexual)",
    description: "A shapeless unicellular organism that moves by extending temporary projections called pseudopods. It engulfs food through phagocytosis.",
    funFact: "Amoeba can change shape constantly — it has no fixed form and moves like flowing jelly!",
    taxonomy: { domain: "Eukaryota", kingdom: "Protozoa", phylum: "Amoebozoa", class: "Tubulinea", order: "Tubulinida", family: "Amoebidae", genus: "Amoeba", species: "A. proteus" },
    parts: [
      { name: "Plasma Membrane", description: "Thin flexible boundary controlling substance movement", color: "#39FF14" },
      { name: "Pseudopods", description: "Temporary cytoplasmic projections for movement & feeding", color: "#2ECC71" },
      { name: "Nucleus", description: "Control center containing genetic material (DNA)", color: "#6C3483" },
      { name: "Contractile Vacuole", description: "Pumps out excess water to maintain osmotic balance", color: "#3498DB" },
      { name: "Food Vacuoles", description: "Digest engulfed food particles with enzymes", color: "#E67E22" },
      { name: "Endoplasm", description: "Inner granular cytoplasm suspending organelles", color: "#27AE60" },
      { name: "Ectoplasm", description: "Clear outer gel-like layer aiding movement", color: "#A9DFBF" },
    ],
  },
  {
    id: "ecoli",
    name: "E. coli",
    scientificName: "Escherichia coli",
    emoji: "🦠",
    color: "#EF9F27",
    accentColor: "#F5B041",
    type: "Bacteria",
    size: "~2 μm length",
    habitat: "Intestines of warm-blooded organisms, soil, water",
    reproduction: "Binary fission (every 20 min)",
    description: "A gram-negative, rod-shaped bacterium commonly found in the lower intestine. Most strains are harmless and vital for digestion.",
    funFact: "E. coli can divide every 20 minutes — one cell can become billions in just 24 hours!",
    taxonomy: { domain: "Bacteria", kingdom: "Eubacteria", phylum: "Proteobacteria", class: "Gammaproteobacteria", order: "Enterobacterales", family: "Enterobacteriaceae", genus: "Escherichia", species: "E. coli" },
    parts: [
      { name: "Cell Envelope", description: "Multi-layered barrier protecting the cell", color: "#EF9F27" },
      { name: "Flagella", description: "Long whip-like structures for motility", color: "#F0E68C" },
      { name: "Pili (Fimbriae)", description: "Short hair-like structures for attachment", color: "#E8DAEF" },
      { name: "Nucleoid (DNA)", description: "Region containing the circular bacterial chromosome", color: "#8E44AD" },
      { name: "Ribosomes", description: "Sites of protein synthesis (70S)", color: "#D5D8DC" },
      { name: "Plasmid", description: "Small circular DNA molecules replicating independently", color: "#FF6B6B" },
      { name: "Cytoplasm", description: "Gel-like substance containing enzymes and ribosomes", color: "#FAD7A0" },
    ],
  },
  {
    id: "chlorella",
    name: "Chlorella",
    scientificName: "Chlorella vulgaris",
    emoji: "🌿",
    color: "#2ECC71",
    accentColor: "#1ABC9C",
    type: "Green Algae",
    size: "2 – 10 μm",
    habitat: "Freshwater, saltwater, damp soil",
    reproduction: "Autospores (asexual)",
    description: "A single-celled spherical green alga with high photosynthetic efficiency. Widely studied as a superfood due to its exceptional nutritional profile.",
    funFact: "Chlorella contains 50-60% protein by dry weight and produces oxygen through photosynthesis!",
    taxonomy: { domain: "Eukaryota", kingdom: "Plantae", phylum: "Chlorophyta", class: "Trebouxiophyceae", order: "Chlorellales", family: "Chlorellaceae", genus: "Chlorella", species: "C. vulgaris" },
    parts: [
      { name: "Cell Wall", description: "Rigid glycoprotein layer providing shape and protection", color: "#1D8348" },
      { name: "Cell Membrane", description: "Semi-permeable lipid bilayer regulating transport", color: "#27AE60" },
      { name: "Chloroplast", description: "Cup-shaped organelle for photosynthesis (chlorophyll a & b)", color: "#2ECC71" },
      { name: "Pyrenoid", description: "Dense proteinaceous body for CO₂ fixation and starch synthesis", color: "#8E44AD" },
      { name: "Starch Grains", description: "Stored food as insoluble starch within chloroplast", color: "#F7DC6F" },
      { name: "Nucleus", description: "Contains DNA and controls cellular activities", color: "#2980B9" },
      { name: "Cytoplasm", description: "Jelly-like matrix for metabolic reactions", color: "#ABEBC6" },
    ],
  },
  {
    id: "volvox",
    name: "Volvox",
    scientificName: "Volvox globator",
    emoji: "🟢",
    color: "#1D9E75",
    accentColor: "#16A085",
    type: "Colonial Green Algae",
    size: "100 – 500 μm",
    habitat: "Freshwater ponds and ditches",
    reproduction: "Both asexual (daughter colonies) and sexual",
    description: "A colonial organism forming a hollow sphere of up to 50,000 biflagellate cells connected by cytoplasmic bridges.",
    funFact: "Volvox spins through water using coordinated flagella — it looks like a tiny green disco ball!",
    taxonomy: { domain: "Eukaryota", kingdom: "Plantae", phylum: "Chlorophyta", class: "Chlorophyceae", order: "Volvocales", family: "Volvocaceae", genus: "Volvox", species: "V. globator" },
    parts: [
      { name: "Somatic Cells", description: "Surface cells with flagella for movement", color: "#1D9E75" },
      { name: "Daughter Colonies", description: "New colonies forming inside the parent sphere", color: "#27AE60" },
      { name: "Extracellular Matrix", description: "Gelatinous layer holding the colony together", color: "#A9DFBF" },
      { name: "Flagella", description: "Two unequal flagella per cell for coordinated swimming", color: "#F7DC6F" },
      { name: "Chloroplast", description: "Cup-shaped photosynthetic organelle in each cell", color: "#2ECC71" },
      { name: "Eyespot (Stigma)", description: "Red eyespot detecting light intensity for phototaxis", color: "#E74C3C" },
    ],
  },
  {
    id: "paramecium",
    name: "Paramecium",
    scientificName: "Paramecium caudatum",
    emoji: "🥿",
    color: "#3498DB",
    accentColor: "#2980B9",
    type: "Ciliate Protozoa",
    size: "150 – 300 μm",
    habitat: "Freshwater with decaying organic matter",
    reproduction: "Binary fission and conjugation",
    description: "A slipper-shaped unicellular organism covered in cilia. One of the most studied protists, known for its complex behavior despite being a single cell.",
    funFact: "Paramecium has two nuclei — a macronucleus for daily functions and a micronucleus for reproduction!",
    taxonomy: { domain: "Eukaryota", kingdom: "Protista", phylum: "Ciliophora", class: "Oligohymenophorea", order: "Peniculida", family: "Parameciidae", genus: "Paramecium", species: "P. caudatum" },
    parts: [
      { name: "Cilia", description: "Hair-like structures covering the body for locomotion", color: "#85C1E9" },
      { name: "Oral Groove", description: "Funnel-shaped depression leading to the cell mouth", color: "#F39C12" },
      { name: "Macronucleus", description: "Large nucleus controlling cell metabolism", color: "#8E44AD" },
      { name: "Micronucleus", description: "Small nucleus for genetic exchange during conjugation", color: "#6C3483" },
      { name: "Contractile Vacuoles", description: "Two star-shaped vacuoles expelling excess water", color: "#3498DB" },
      { name: "Trichocysts", description: "Defensive dart-like organelles beneath the pellicle", color: "#E74C3C" },
      { name: "Food Vacuoles", description: "Circulate through cytoplasm digesting bacteria", color: "#E67E22" },
    ],
  },
  {
    id: "euglena",
    name: "Euglena",
    scientificName: "Euglena gracilis",
    emoji: "🔬",
    color: "#27AE60",
    accentColor: "#1ABC9C",
    type: "Euglenoid Flagellate",
    size: "35 – 55 μm",
    habitat: "Freshwater, especially nutrient-rich ponds",
    reproduction: "Longitudinal binary fission",
    description: "A unique single-celled organism that can photosynthesize like a plant AND consume food like an animal — a true mixotroph.",
    funFact: "Euglena is both plant and animal! It photosynthesizes in sunlight but eats food particles in the dark.",
    taxonomy: { domain: "Eukaryota", kingdom: "Excavata", phylum: "Euglenozoa", class: "Euglenoidea", order: "Euglenales", family: "Euglenaceae", genus: "Euglena", species: "E. gracilis" },
    parts: [
      { name: "Flagellum", description: "Long whip-like structure emerging from anterior for locomotion", color: "#F7DC6F" },
      { name: "Eyespot (Stigma)", description: "Orange-red photoreceptor detecting light direction", color: "#E74C3C" },
      { name: "Chloroplasts", description: "Multiple disc-shaped organelles for photosynthesis", color: "#2ECC71" },
      { name: "Pellicle", description: "Flexible protein strips allowing shape changes", color: "#1ABC9C" },
      { name: "Paramylon Granules", description: "Unique carbohydrate energy storage bodies", color: "#F0E68C" },
      { name: "Nucleus", description: "Large central nucleus with visible nucleolus", color: "#8E44AD" },
      { name: "Contractile Vacuole", description: "Osmoregulatory organelle near the reservoir", color: "#3498DB" },
    ],
  },
  {
    id: "dna-helix",
    name: "DNA Double Helix",
    scientificName: "Deoxyribonucleic Acid",
    emoji: "🧬",
    color: "#E74C3C",
    accentColor: "#C0392B",
    type: "Nucleic Acid",
    size: "~2 nm diameter",
    habitat: "Nucleus of every living cell",
    reproduction: "Semi-conservative replication",
    description: "The molecule of life — a double helix of two antiparallel strands encoding all genetic information needed to build and maintain living organisms.",
    funFact: "If you stretched out all the DNA in one human cell, it would be about 2 meters long — yet it fits in a nucleus just 6 μm wide!",
    taxonomy: { domain: "Universal", kingdom: "—", phylum: "—", class: "—", order: "—", family: "—", genus: "—", species: "—" },
    parts: [
      { name: "Sugar-Phosphate Backbone", description: "Alternating deoxyribose sugar and phosphate groups forming the helix rails", color: "#5DADE2" },
      { name: "Adenine (A)", description: "Purine base pairing with Thymine via 2 hydrogen bonds", color: "#E74C3C" },
      { name: "Thymine (T)", description: "Pyrimidine base pairing with Adenine via 2 hydrogen bonds", color: "#3498DB" },
      { name: "Guanine (G)", description: "Purine base pairing with Cytosine via 3 hydrogen bonds", color: "#2ECC71" },
      { name: "Cytosine (C)", description: "Pyrimidine base pairing with Guanine via 3 hydrogen bonds", color: "#F1C40F" },
      { name: "Hydrogen Bonds", description: "Weak bonds holding base pairs together (2 for A-T, 3 for G-C)", color: "#FF69B4" },
      { name: "Major & Minor Grooves", description: "Spiral grooves where proteins bind to read DNA", color: "#9B59B6" },
    ],
  },
  {
    id: "animal-cell",
    name: "Animal Cell",
    scientificName: "Eukaryotic Animal Cell",
    emoji: "🔴",
    color: "#E74C3C",
    accentColor: "#C0392B",
    type: "Eukaryotic Cell",
    size: "10 – 30 μm",
    habitat: "All animal tissues",
    reproduction: "Mitosis and meiosis",
    description: "The fundamental unit of animal life. Lacks a cell wall and chloroplasts but contains specialized organelles for complex functions.",
    funFact: "The human body contains approximately 37.2 trillion animal cells working together!",
    taxonomy: { domain: "Eukaryota", kingdom: "Animalia", phylum: "—", class: "—", order: "—", family: "—", genus: "—", species: "—" },
    parts: [
      { name: "Cell Membrane", description: "Phospholipid bilayer controlling entry and exit", color: "#E74C3C" },
      { name: "Nucleus", description: "Contains DNA — the control center", color: "#2980B9" },
      { name: "Mitochondria", description: "Powerhouse — produces ATP via cellular respiration", color: "#1D9E75" },
      { name: "Endoplasmic Reticulum", description: "Rough (protein) and Smooth (lipid) synthesis network", color: "#9B59B6" },
      { name: "Golgi Apparatus", description: "Packages and ships proteins to destinations", color: "#F39C12" },
      { name: "Lysosomes", description: "Digestive enzymes breaking down waste", color: "#E67E22" },
      { name: "Centrioles", description: "Organize spindle fibers during cell division", color: "#1ABC9C" },
      { name: "Ribosomes", description: "Protein factories reading mRNA", color: "#BDC3C7" },
    ],
  },
  {
    id: "plant-cell",
    name: "Plant Cell",
    scientificName: "Eukaryotic Plant Cell",
    emoji: "🌱",
    color: "#27AE60",
    accentColor: "#229954",
    type: "Eukaryotic Cell",
    size: "10 – 100 μm",
    habitat: "All plant tissues",
    reproduction: "Mitosis and meiosis",
    description: "The building block of all plants. Distinguished by a rigid cell wall, large central vacuole, and chloroplasts for photosynthesis.",
    funFact: "The central vacuole can occupy up to 90% of the plant cell's volume, storing water and maintaining turgor pressure!",
    taxonomy: { domain: "Eukaryota", kingdom: "Plantae", phylum: "—", class: "—", order: "—", family: "—", genus: "—", species: "—" },
    parts: [
      { name: "Cell Wall", description: "Rigid cellulose wall providing structure and protection", color: "#1D8348" },
      { name: "Cell Membrane", description: "Semi-permeable lipid bilayer inside the wall", color: "#27AE60" },
      { name: "Chloroplasts", description: "Green organelles converting sunlight to glucose", color: "#2ECC71" },
      { name: "Central Vacuole", description: "Large fluid-filled sac maintaining turgor pressure", color: "#85C1E9" },
      { name: "Nucleus", description: "DNA-containing control center", color: "#2980B9" },
      { name: "Mitochondria", description: "Energy production via cellular respiration", color: "#1D9E75" },
      { name: "Endoplasmic Reticulum", description: "Protein and lipid synthesis network", color: "#9B59B6" },
      { name: "Plasmodesmata", description: "Channels between cells for communication", color: "#F39C12" },
    ],
  },
  {
    id: "bacteria",
    name: "Bacteria Cell",
    scientificName: "Prokaryotic Bacterium",
    emoji: "🧫",
    color: "#F39C12",
    accentColor: "#E67E22",
    type: "Prokaryotic Cell",
    size: "0.2 – 5 μm",
    habitat: "Everywhere — soil, water, air, inside organisms",
    reproduction: "Binary fission",
    description: "The simplest and most ancient form of life. Prokaryotic cells lacking a true nucleus, yet incredibly diverse and essential for all ecosystems.",
    funFact: "There are more bacteria in your body than human cells — about 38 trillion!",
    taxonomy: { domain: "Bacteria", kingdom: "Eubacteria", phylum: "Various", class: "—", order: "—", family: "—", genus: "—", species: "—" },
    parts: [
      { name: "Capsule", description: "Outer protective polysaccharide layer (some species)", color: "#F5CBA7" },
      { name: "Cell Wall", description: "Rigid peptidoglycan layer providing shape", color: "#F39C12" },
      { name: "Cell Membrane", description: "Phospholipid bilayer controlling transport", color: "#E67E22" },
      { name: "Nucleoid", description: "Region of circular DNA (no membrane-bound nucleus)", color: "#8E44AD" },
      { name: "Ribosomes (70S)", description: "Smaller ribosomes for protein synthesis", color: "#BDC3C7" },
      { name: "Flagellum", description: "Tail-like structure for swimming motility", color: "#F7DC6F" },
      { name: "Plasmid", description: "Extra-chromosomal circular DNA with beneficial genes", color: "#E74C3C" },
    ],
  },
];

export function getOrganismById(id: string): OrganismData | undefined {
  return ORGANISMS.find(o => o.id === id);
}
