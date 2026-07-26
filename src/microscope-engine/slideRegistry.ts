import { MicroscopeSlide, AssessmentTask } from './types';

export const SLIDE_LIBRARY: MicroscopeSlide[] = [
  // ── 1. PLANT TISSUES ──
  {
    id: 'onion_epidermis',
    title: 'Allium Cepa (Onion Epidermis)',
    scientificName: 'Allium cepa L.',
    category: 'plant_tissue',
    subcategory: 'Epidermal Plant Cells',
    description: 'Single-layer epidermal tissue showing distinct rectangular cell walls, prominent eukaryotic nuclei, and large central vacuoles stained with Iodine.',
    specimenType: 'healthy',
    stainType: 'Lugol Iodine Stain',
    defaultObjective: '10x',
    baseFOVMicrons: 4000,
    histologyDetails: {
      tissueOrigin: 'Inner bulb epidermal membrane of Allium cepa',
      keyIdentificationFeatures: [
        'Rigid cellulose cell wall boundary',
        'Distinct dark iodine-stained nucleus offset to cell perimeter',
        'Large transparent central vacuole driving turgor pressure',
        'Absence of chloroplasts (non-photosynthetic storage tissue)'
      ],
      prepMethod: 'Peeled membrane wet mount with 1% Iodine solution',
      clinicalRelevance: 'Classic model for studying plant cellular boundaries, turgor pressure, and nuclear localization.'
    },
    proceduralConfig: {
      primaryColor: '#854d0e',
      secondaryColor: '#fef08a',
      patternType: 'plant_stomata',
      density: 28,
      roughness: 0.25,
      bgGlowColor: 'rgba(234, 179, 8, 0.15)'
    },
    cellularStructures: [
      {
        id: 'wall_1',
        name: 'Cellulose Cell Wall',
        scientificTerm: 'Cellula Murus',
        description: 'Rigid outer layer composed of cellulose microfibrils that provides structural support and protection.',
        x: 0.35,
        y: 0.3,
        radius: 0.18,
        minMagnificationRequired: 4,
        optimalDepthLayer: 0.5,
        color: '#ca8a04',
        category: 'cell_wall',
        function: 'Structural stability & osmotic pressure maintenance'
      },
      {
        id: 'nuc_1',
        name: 'Eukaryotic Nucleus',
        scientificTerm: 'Nucleus',
        description: 'Spherical organelle containing chromatin DNA and nucleoli, pressed against the cell wall by the vacuole.',
        x: 0.42,
        y: 0.38,
        radius: 0.05,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.6,
        color: '#713f12',
        category: 'nucleus',
        function: 'Genetic control center & RNA transcription'
      },
      {
        id: 'vac_1',
        name: 'Central Vacuole',
        scientificTerm: 'Vacuolum Centralis',
        description: 'Fluid-filled organelle occupying up to 80% of cell volume, maintaining turgor pressure.',
        x: 0.52,
        y: 0.45,
        radius: 0.12,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.4,
        color: '#fef9c3',
        category: 'organelle',
        function: 'Water storage, cell turgor, & waste sequestration'
      }
    ]
  },

  {
    id: 'leaf_stomata',
    title: 'Ligustrum Leaf Cross-Section (Stomata & Chloroplasts)',
    scientificName: 'Ligustrum vulgare L.',
    category: 'plant_tissue',
    subcategory: 'Photosynthetic Foliar Tissue',
    description: 'Cross-section of a dicot leaf featuring upper palisade mesophyll rich in chloroplasts, spongy mesophyll, and lower epidermal stomata guarded by specialized guard cells.',
    specimenType: 'healthy',
    stainType: 'Fast Green & Safranin O',
    defaultObjective: '40x',
    baseFOVMicrons: 1200,
    histologyDetails: {
      tissueOrigin: 'Privet leaf blade transverse section',
      keyIdentificationFeatures: [
        'Kidney-shaped guard cells bounding stomatal pore',
        'Dense discoid chloroplast organelles in palisade parenchyma',
        'Air spaces in spongy mesophyll for gas exchange',
        'Waxy hydrophobic cuticle layer on upper adaxial surface'
      ],
      prepMethod: 'Paraffin sectioning at 8µm stained with Fast Green',
      clinicalRelevance: 'Demonstrates plant transpiration, carbon fixation, and specialized guard cell turgor mechanics.'
    },
    proceduralConfig: {
      primaryColor: '#15803d',
      secondaryColor: '#4ade80',
      patternType: 'plant_stomata',
      density: 35,
      roughness: 0.3,
      bgGlowColor: 'rgba(34, 197, 94, 0.2)'
    },
    cellularStructures: [
      {
        id: 'stoma_pore',
        name: 'Stomatal Pore',
        scientificTerm: 'Stoma',
        description: 'Microscopic aperture in epidermal layer allowing gas exchange of CO2, O2, and water vapor.',
        x: 0.5,
        y: 0.55,
        radius: 0.04,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#166534',
        category: 'organelle',
        function: 'Transpiration & photosynthetic gas exchange regulation'
      },
      {
        id: 'guard_cell',
        name: 'Guard Cells',
        scientificTerm: 'Cellulae Custodes',
        description: 'Paired kidney-shaped epidermal cells with asymmetric inner wall thickening that open and close the stoma.',
        x: 0.46,
        y: 0.54,
        radius: 0.07,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#22c55e',
        category: 'tissue_layer',
        function: 'Turgor-driven opening/closing of stomatal pore'
      },
      {
        id: 'chloroplast_cluster',
        name: 'Palisade Chloroplasts',
        scientificTerm: 'Chloroplastus',
        description: 'Double-membrane organelles packed with green chlorophyll pigment and thylakoid stacks.',
        x: 0.35,
        y: 0.28,
        radius: 0.03,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.6,
        color: '#15803d',
        category: 'organelle',
        function: 'Photosynthesis & ATP generation via light reactions'
      }
    ]
  },

  {
    id: 'root_tip_mitosis',
    title: 'Allium Root Tip (Mitotic Cell Division)',
    scientificName: 'Allium cepa Meristem',
    category: 'plant_tissue',
    subcategory: 'Meristematic Plant Tissue',
    description: 'Active apical meristem region showing plant cells undergoing all mitotic cell division phases: Prophase, Metaphase, Anaphase, and Telophase.',
    specimenType: 'healthy',
    stainType: 'Aceto-Orcein Chromosome Stain',
    defaultObjective: '40x',
    baseFOVMicrons: 1000,
    histologyDetails: {
      tissueOrigin: 'Root apical meristem tip',
      keyIdentificationFeatures: [
        'Condensed dark purple chromosome threads',
        'Metaphase alignment along equatorial plate',
        'Anaphase sister chromatid separation to opposite poles',
        'Telophase cell plate formation (phragmoplast)'
      ],
      prepMethod: 'HCl hydrolysis followed by Aceto-Orcein squash preparation',
      clinicalRelevance: 'Essential diagnostic model for studying eukaryotic cell cycle regulation and chromosome segregation.'
    },
    proceduralConfig: {
      primaryColor: '#6b21a8',
      secondaryColor: '#e9d5ff',
      patternType: 'cellular_network',
      density: 45,
      roughness: 0.2,
      bgGlowColor: 'rgba(168, 85, 247, 0.2)'
    },
    cellularStructures: [
      {
        id: 'metaphase_plate',
        name: 'Metaphase Chromosome Alignment',
        scientificTerm: 'Metaphasis',
        description: 'Condensed sister chromatids lined up along the equatorial midplane attached to spindle fibers.',
        x: 0.48,
        y: 0.42,
        radius: 0.06,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#581c87',
        category: 'nucleus',
        function: 'Equatorial chromosome alignment before segregation'
      },
      {
        id: 'anaphase_poles',
        name: 'Anaphase Chromatid Separation',
        scientificTerm: 'Anaphasis',
        description: 'V-shaped sister chromatids pulled apart toward opposite spindle poles by kinetochore microtubules.',
        x: 0.65,
        y: 0.6,
        radius: 0.07,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#7e22ce',
        category: 'nucleus',
        function: 'Equal genome partitioning to daughter cells'
      }
    ]
  },

  // ── 2. BLOOD & HEMATOLOGY ──
  {
    id: 'normal_blood_smear',
    title: 'Normal Human Blood Smear',
    scientificName: 'Homo sapiens Peripheral Blood',
    category: 'blood_smear',
    subcategory: 'Hematology',
    description: 'Peripheral blood film showing non-nucleated biconcave Erythrocytes (RBCs), multilobed Neutrophils, Lymphocytes, Monocytes, and tiny blood Platelets.',
    specimenType: 'healthy',
    stainType: 'Wright-Giemsa Stain',
    defaultObjective: '40x',
    baseFOVMicrons: 800,
    diseasedPairId: 'sickle_cell_blood',
    diseaseExplorerPath: '/disease-explorer?condition=sickle_cell',
    histologyDetails: {
      tissueOrigin: 'Human venipuncture peripheral blood',
      keyIdentificationFeatures: [
        'Biconcave pink erythrocytes ~7.5µm diameter with central pallor',
        'Multilobed (3-5 lobes) purple nuclei in polymorphonuclear Neutrophils',
        'Compact dark round nucleus in small agranular Lymphocytes',
        'Anucleate purple platelet cell fragments (thrombocytes)'
      ],
      prepMethod: 'Wedge blood smear fixed with methanol and Wright-Giemsa stain',
      clinicalRelevance: 'Gold standard clinical diagnostic for anemias, leukemias, and systemic infections.'
    },
    proceduralConfig: {
      primaryColor: '#991b1b',
      secondaryColor: '#fca5a5',
      patternType: 'blood_cells',
      density: 50,
      roughness: 0.15,
      bgGlowColor: 'rgba(239, 68, 68, 0.2)'
    },
    cellularStructures: [
      {
        id: 'rbc_1',
        name: 'Normal Erythrocyte (RBC)',
        scientificTerm: 'Erythrocytus',
        description: 'Flexible biconcave disc packed with hemoglobin, lacking nucleus and mitochondria for maximum O2 capacity.',
        x: 0.35,
        y: 0.45,
        radius: 0.045,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.5,
        color: '#dc2626',
        category: 'organelle',
        function: 'Systemic oxygen delivery & CO2 transport'
      },
      {
        id: 'neutrophil_1',
        name: 'Neutrophil Granulocyte',
        scientificTerm: 'Granulocytus Neutrophilus',
        description: 'Most abundant white blood cell featuring a 3-5 lobed nucleus and neutral granules for phagocytosis.',
        x: 0.55,
        y: 0.38,
        radius: 0.08,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.55,
        color: '#7c3aed',
        category: 'nucleus',
        function: 'First line innate immune defense against bacterial invaders',
        clinicalSignificance: 'Elevated neutrophil count (neutrophilia) indicates acute bacterial infection.'
      },
      {
        id: 'platelet_1',
        name: 'Blood Platelet (Thrombocyte)',
        scientificTerm: 'Thrombocytus',
        description: 'Small disk-shaped cell fragment derived from megakaryocytes involved in blood clotting.',
        x: 0.42,
        y: 0.62,
        radius: 0.018,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#c084fc',
        category: 'inclusion',
        function: 'Hemostasis & blood clot formation'
      }
    ]
  },

  {
    id: 'sickle_cell_blood',
    title: 'Sickle Cell Anemia Peripheral Blood',
    scientificName: 'HbSS Erythrocytes',
    category: 'blood_smear',
    subcategory: 'Pathological Hematology',
    description: 'Pathological blood smear from a patient with homozygous Sickle Cell Anemia (HbSS), showing crescent-shaped sickled RBCs, target cells, and Howell-Jolly bodies.',
    specimenType: 'diseased',
    stainType: 'Wright-Giemsa Stain',
    defaultObjective: '40x',
    baseFOVMicrons: 800,
    diseasedPairId: 'normal_blood_smear',
    diseaseExplorerPath: '/disease-explorer?condition=sickle_cell',
    diseaseNotes: 'Point mutation in HBB gene (Glu6Val) causes hemoglobin polymerization under low oxygen tension, deforming RBCs into rigid sickle shapes.',
    histologyDetails: {
      tissueOrigin: 'Peripheral blood of HbSS homozygote',
      keyIdentificationFeatures: [
        'Crescent-shaped elongated sickled erythrocytes with pointed ends',
        'Target cells (codocytes) with central bullseye hemoglobin distribution',
        'Howell-Jolly nuclear remnant inclusions in RBCs',
        'Marked anisocytosis and poikilocytosis'
      ],
      prepMethod: 'Wedge blood smear fixed and Wright-Giemsa stained',
      clinicalRelevance: 'Pathognomonic hallmark of vaso-occlusive crisis and hemolytic anemia in Sickle Cell Disease.'
    },
    proceduralConfig: {
      primaryColor: '#7f1d1d',
      secondaryColor: '#f87171',
      patternType: 'blood_cells',
      density: 45,
      roughness: 0.4,
      bgGlowColor: 'rgba(185, 28, 28, 0.25)'
    },
    cellularStructures: [
      {
        id: 'sickled_rbc',
        name: 'Sickled Erythrocyte',
        scientificTerm: 'Drepanocytus',
        description: 'Rigid, elongated crescent-shaped RBC containing polymerized HbS chains that cause microvascular occlusion.',
        x: 0.48,
        y: 0.42,
        radius: 0.06,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.5,
        color: '#b91c1c',
        category: 'organelle',
        function: 'Impaired oxygen delivery & microvascular occlusion',
        clinicalSignificance: 'Causes painful vaso-occlusive crises, tissue ischemia, and splenic sequestration.'
      },
      {
        id: 'target_cell',
        name: 'Target Cell (Codocyte)',
        scientificTerm: 'Codocytus',
        description: 'Erythrocyte with excess cell membrane relative to hemoglobin content, forming a bullseye appearance.',
        x: 0.32,
        y: 0.6,
        radius: 0.045,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#ef4444',
        category: 'organelle',
        function: 'Altered membrane surface-to-volume ratio'
      }
    ]
  },

  {
    id: 'malaria_smear',
    title: 'Plasmodium Falciparum (Malaria Blood Smear)',
    scientificName: 'Plasmodium falciparum Ring Stages',
    category: 'blood_smear',
    subcategory: 'Parasitology Smear',
    description: 'Thin blood film demonstrating intracellular Plasmodium falciparum ring-form trophozoites ("headphone" sign) inside infected erythrocytes.',
    specimenType: 'diseased',
    stainType: 'Giemsa Stain',
    defaultObjective: '100x',
    baseFOVMicrons: 350,
    diseaseExplorerPath: '/disease-explorer?condition=malaria',
    diseaseNotes: 'Plasmodium falciparum invades RBCs, metabolizing hemoglobin into hemozoin pigment and causing cerebral malaria and severe anemia.',
    histologyDetails: {
      tissueOrigin: 'Peripheral blood from febrile patient',
      keyIdentificationFeatures: [
        'Delicate blue cytoplasmic rings with 1-2 red chromatin dots',
        'Infected RBCs are normal-sized without Maurer clefts at early stage',
        'Presence of crescent-shaped gametocytes in mature infections',
        'Multiple ring parasites within single erythrocytes'
      ],
      prepMethod: 'Thin Giemsa-stained blood film examined under 100x oil immersion',
      clinicalRelevance: 'Definitive diagnostic for falciparum malaria, the most lethal form of human malaria.'
    },
    proceduralConfig: {
      primaryColor: '#431407',
      secondaryColor: '#fb923c',
      patternType: 'blood_cells',
      density: 40,
      roughness: 0.35,
      bgGlowColor: 'rgba(234, 88, 12, 0.25)'
    },
    cellularStructures: [
      {
        id: 'ring_stage',
        name: 'Ring-Stage Trophozoite',
        scientificTerm: 'Trophozoitus Ring Form',
        description: 'Intracellular parasite stage with a delicate blue cytoplasmic ring and tiny red chromatin dot resembling headphones.',
        x: 0.51,
        y: 0.48,
        radius: 0.025,
        minMagnificationRequired: 100,
        optimalDepthLayer: 0.6,
        color: '#0284c7',
        category: 'pathogen_feature',
        function: 'Intraerythrocytic parasite growth & hemoglobin digestion',
        clinicalSignificance: 'Diagnostic for acute Plasmodium falciparum malaria infection.'
      }
    ]
  },

  // ── 3. ANIMAL & ORGAN HISTOLOGY ──
  {
    id: 'compact_bone',
    title: 'Compact Bone Ground Section (Osteon Architecture)',
    scientificName: 'Osseus Compactum',
    category: 'histology_organs',
    subcategory: 'Skeletal Tissue',
    description: 'Ground section of hard compact bone showing concentric osteons (Haversian systems), central Haversian canals, osteocyte lacunae, and radiating canaliculi.',
    specimenType: 'healthy',
    stainType: 'Unstained Ground Bone Section',
    defaultObjective: '10x',
    baseFOVMicrons: 2500,
    diseasedPairId: 'osteoporosis_bone',
    diseaseExplorerPath: '/disease-explorer?condition=osteoporosis',
    histologyDetails: {
      tissueOrigin: 'Femoral diaphysis cortical bone',
      keyIdentificationFeatures: [
        'Concentric circular Osteon units (Haversian systems)',
        'Central Haversian Canal housing neurovascular bundle',
        'Dark spider-like Osteocyte Lacunae cavities',
        'Fine radiating Canaliculi micro-channels connecting osteocytes'
      ],
      prepMethod: 'Mechanical ground section polished to ~20µm thickness',
      clinicalRelevance: 'Fundamental anatomical model for bone remodeling, calcium storage, and biomechanical load bearing.'
    },
    proceduralConfig: {
      primaryColor: '#78350f',
      secondaryColor: '#fef3c7',
      patternType: 'osteon_rings',
      density: 30,
      roughness: 0.4,
      bgGlowColor: 'rgba(217, 119, 6, 0.2)'
    },
    cellularStructures: [
      {
        id: 'haversian_canal',
        name: 'Haversian Canal',
        scientificTerm: 'Canalis Centralis',
        description: 'Central longitudinal channel of an osteon transmitting blood vessels, nerve fibers, and lymphatics.',
        x: 0.5,
        y: 0.5,
        radius: 0.08,
        minMagnificationRequired: 4,
        optimalDepthLayer: 0.5,
        color: '#451a03',
        category: 'tissue_layer',
        function: 'Vascular supply & nutrient transport to osteocytes'
      },
      {
        id: 'osteocyte_lacuna',
        name: 'Osteocyte in Lacuna',
        scientificTerm: 'Osteocytus',
        description: 'Mature bone cell entombed within a lacuna cavity, communicating via canaliculi dendrites.',
        x: 0.62,
        y: 0.42,
        radius: 0.025,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.65,
        color: '#78350f',
        category: 'organelle',
        function: 'Mechanosensing & bone matrix homeostasis regulation'
      }
    ]
  },

  {
    id: 'osteoporosis_bone',
    title: 'Osteoporotic Bone Section (Trabecular Thinning)',
    scientificName: 'Osteoporosis Cortical & Trabecular Bone',
    category: 'pathology_comparison',
    subcategory: 'Bone Pathology',
    description: 'Bone section showing severe trabecular thinning, widened osteon canals, micro-fractures, and loss of mineralized bone matrix typical of advanced Osteoporosis.',
    specimenType: 'diseased',
    stainType: 'Goldner Trichrome Stain',
    defaultObjective: '10x',
    baseFOVMicrons: 2500,
    diseasedPairId: 'compact_bone',
    diseaseExplorerPath: '/disease-explorer?condition=osteoporosis',
    diseaseNotes: 'Imbalance between osteoclast bone resorption and osteoblast bone formation leads to porous, fragile bones prone to pathological fractures.',
    histologyDetails: {
      tissueOrigin: 'Proximal femur trabecular bone in postmenopausal osteoporosis',
      keyIdentificationFeatures: [
        'Disrupted, thinned bone trabeculae with large marrow spaces',
        'Increased osteoclast resorption pits (Howship lacunae)',
        'Widened irregularly eroded Haversian canals',
        'Reduced trabecular connectivity & micro-architectural deterioration'
      ],
      prepMethod: 'Decalcified paraffin section stained with Goldner Trichrome',
      clinicalRelevance: 'Demonstrates structural basis for fragility fractures in osteoporosis patients.'
    },
    proceduralConfig: {
      primaryColor: '#451a03',
      secondaryColor: '#fde68a',
      patternType: 'osteon_rings',
      density: 15,
      roughness: 0.6,
      bgGlowColor: 'rgba(180, 83, 9, 0.25)'
    },
    cellularStructures: [
      {
        id: 'resorption_pit',
        name: 'Osteoclast Resorption Pit',
        scientificTerm: 'Lacuna Howship',
        description: 'Eroded cavity on bone surface where multinucleated osteoclasts degrade bone matrix via acid and cathepsin K.',
        x: 0.45,
        y: 0.52,
        radius: 0.07,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.5,
        color: '#92400e',
        category: 'tissue_layer',
        function: 'Excessive bone resorption exceeding bone formation',
        clinicalSignificance: 'Primary cellular mechanism driving low bone mineral density in osteoporosis.'
      }
    ]
  },

  {
    id: 'skeletal_muscle',
    title: 'Skeletal Muscle Longitudinal Section (Striations)',
    scientificName: 'Textus Muscularis Striatus',
    category: 'animal_tissue',
    subcategory: 'Muscular Tissue',
    description: 'Longitudinal section of voluntary skeletal muscle fibers featuring dark A-bands, light I-bands, multinucleated peripheral nuclei, and sarcolemma boundaries.',
    specimenType: 'healthy',
    stainType: 'Hematoxylin & Eosin (H&E)',
    defaultObjective: '40x',
    baseFOVMicrons: 1000,
    histologyDetails: {
      tissueOrigin: 'Biceps brachii muscle belly',
      keyIdentificationFeatures: [
        'Alternating transverse dark (A-band) and light (I-band) striations',
        'Multiple elongated nuclei located peripherally beneath the sarcolemma',
        'Unbranched cylindrical parallel muscle fibers',
        'Endomysium connective tissue sheaths between fibers'
      ],
      prepMethod: 'Formalin-fixed longitudinal section stained with H&E',
      clinicalRelevance: 'Illustrates sarcomere sliding filament mechanism of voluntary muscle contraction.'
    },
    proceduralConfig: {
      primaryColor: '#be123c',
      secondaryColor: '#fecdd3',
      patternType: 'striated_fibers',
      density: 40,
      roughness: 0.2,
      bgGlowColor: 'rgba(225, 29, 72, 0.2)'
    },
    cellularStructures: [
      {
        id: 'sarcomere_striation',
        name: 'Sarcomere Transverse Striation',
        scientificTerm: 'Sarcomerum',
        description: 'Contractile repeating unit bounded by Z-discs containing overlapping actin thin and myosin thick filaments.',
        x: 0.48,
        y: 0.38,
        radius: 0.06,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#9f1239',
        category: 'organelle',
        function: 'ATP-dependent sliding filament contraction'
      },
      {
        id: 'peripheral_nuc',
        name: 'Peripheral Muscle Nucleus',
        scientificTerm: 'Nucleus Peripheralis',
        description: 'Elongated syncytial nucleus pushed to the outer margin of the fiber beneath the sarcolemma.',
        x: 0.32,
        y: 0.52,
        radius: 0.035,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.6,
        color: '#4c0519',
        category: 'nucleus',
        function: 'Gene expression & protein synthesis for syncytial muscle fiber'
      }
    ]
  },

  {
    id: 'nerve_neuron',
    title: 'Spinal Cord Motor Neuron & Glia',
    scientificName: 'Neuron Motorium Spinalis',
    category: 'animal_tissue',
    subcategory: 'Nervous Tissue',
    description: 'Smear of spinal cord anterior horn showing large multipolar motor neuron cell bodies (perikaryon), Nissl bodies, axon hillock, dendrites, and surrounding glial cells.',
    specimenType: 'healthy',
    stainType: 'Cresyl Violet (Nissl Stain)',
    defaultObjective: '40x',
    baseFOVMicrons: 900,
    histologyDetails: {
      tissueOrigin: 'Spinal cord ventral horn gray matter',
      keyIdentificationFeatures: [
        'Large star-shaped multipolar soma (cell body) ~50-100µm',
        'Prominent euchromatic nucleus with distinct dark central nucleolus',
        'Granular basophilic Nissl bodies (rough ER) in soma and dendrites',
        'Pale axon hillock region lacking Nissl granules'
      ],
      prepMethod: 'Cryosection stained with Cresyl Violet for Nissl substance',
      clinicalRelevance: 'Model for motor signal transmission, neurodegeneration, and ALS pathology.'
    },
    proceduralConfig: {
      primaryColor: '#4338ca',
      secondaryColor: '#c7d2fe',
      patternType: 'cellular_network',
      density: 25,
      roughness: 0.3,
      bgGlowColor: 'rgba(99, 102, 241, 0.25)'
    },
    cellularStructures: [
      {
        id: 'soma_body',
        name: 'Neuron Soma (Perikaryon)',
        scientificTerm: 'Perikaryon',
        description: 'Large cell body containing metabolic organelles, nucleus, and dense Nissl substance.',
        x: 0.5,
        y: 0.48,
        radius: 0.12,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.5,
        color: '#3730a3',
        category: 'tissue_layer',
        function: 'Integration of synaptic inputs & neuronal metabolism'
      },
      {
        id: 'nissl_body',
        name: 'Nissl Bodies (Rough ER)',
        scientificTerm: 'Substantia Chromatophilica',
        description: 'Dense aggregates of rough endoplasmic reticulum and free ribosomes active in neurotransmitter synthesis.',
        x: 0.46,
        y: 0.44,
        radius: 0.03,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.55,
        color: '#1e1b4b',
        category: 'organelle',
        function: 'High-rate protein & neuropeptide synthesis'
      },
      {
        id: 'axon_hillock',
        name: 'Axon Hillock',
        scientificTerm: 'Colliculus Axonalis',
        description: 'Cone-shaped region of soma origin devoid of Nissl granules where action potentials initiate.',
        x: 0.58,
        y: 0.54,
        radius: 0.035,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.5,
        color: '#6366f1',
        category: 'organelle',
        function: 'Trigger zone for action potential generation'
      }
    ]
  },

  {
    id: 'healthy_lung_alveoli',
    title: 'Healthy Lung Tissue (Alveoli & Capillaries)',
    scientificName: 'Pulmo Normalis',
    category: 'histology_organs',
    subcategory: 'Respiratory Tissue',
    description: 'Section of healthy lung tissue displaying delicate thin-walled alveoli sac architecture, type I and II pneumocytes, and thin capillary interalveolar septa.',
    specimenType: 'healthy',
    stainType: 'Hematoxylin & Eosin (H&E)',
    defaultObjective: '10x',
    baseFOVMicrons: 2000,
    diseasedPairId: 'emphysema_lung',
    diseaseExplorerPath: '/disease-explorer?condition=copd_emphysema',
    histologyDetails: {
      tissueOrigin: 'Human parenchymal lung biopsy',
      keyIdentificationFeatures: [
        'Honeycomb network of thin air-filled alveolar sacs',
        'Thin interalveolar septa containing capillaries and elastic fibers',
        'Squamous Type I pneumocytes for gas exchange',
        'Cuboidal Type II pneumocytes producing pulmonary surfactant'
      ],
      prepMethod: 'Formalin inflation-fixed section stained with H&E',
      clinicalRelevance: 'Baseline structure for evaluating COPD, pneumonia, and pulmonary fibrosis.'
    },
    proceduralConfig: {
      primaryColor: '#0369a1',
      secondaryColor: '#bae6fd',
      patternType: 'alveoli_mesh',
      density: 35,
      roughness: 0.25,
      bgGlowColor: 'rgba(14, 165, 233, 0.2)'
    },
    cellularStructures: [
      {
        id: 'alveolar_sac',
        name: 'Alveolar Sac Airway',
        scientificTerm: 'Sacculus Alveolaris',
        description: 'Microscopic terminal gas exchange pocket providing massive surface area for blood oxygenation.',
        x: 0.45,
        y: 0.45,
        radius: 0.12,
        minMagnificationRequired: 4,
        optimalDepthLayer: 0.5,
        color: '#0284c7',
        category: 'tissue_layer',
        function: 'Rapid passive diffusion of O2 and CO2'
      },
      {
        id: 'septum_wall',
        name: 'Interalveolar Septum',
        scientificTerm: 'Septum Interalveolare',
        description: 'Ultra-thin membrane (~0.5µm) containing capillaries separating adjacent alveolar air spaces.',
        x: 0.58,
        y: 0.42,
        radius: 0.04,
        minMagnificationRequired: 40,
        optimalDepthLayer: 0.55,
        color: '#0369a1',
        category: 'tissue_layer',
        function: 'Minimal barrier distance for blood-air gas diffusion'
      }
    ]
  },

  {
    id: 'emphysema_lung',
    title: 'Emphysema Lung Tissue (Alveolar Destruction)',
    scientificName: 'Pulmo Emphysematous',
    category: 'pathology_comparison',
    subcategory: 'Pulmonary Pathology',
    description: 'Pathological lung section demonstrating severe centriacinar emphysema with destruction of alveolar septa, bullous air space enlargement, and reduced gas exchange surface area.',
    specimenType: 'diseased',
    stainType: 'Hematoxylin & Eosin (H&E)',
    defaultObjective: '10x',
    baseFOVMicrons: 2000,
    diseasedPairId: 'healthy_lung_alveoli',
    diseaseExplorerPath: '/disease-explorer?condition=copd_emphysema',
    diseaseNotes: 'Cigarette smoke or alpha-1 antitrypsin deficiency activates elastases, breaking down elastic alveolar septa and causing permanent air space enlargement.',
    histologyDetails: {
      tissueOrigin: 'Resected lung lobe from patient with severe emphysema',
      keyIdentificationFeatures: [
        'Massive enlarged confluent air spaces replacing normal small alveoli',
        'Broken, floating fragments of destroyed interalveolar septa',
        'Marked loss of capillary bed surface area',
        'Pigmented anthracotic macrophage accumulation'
      ],
      prepMethod: 'Formalin-fixed tissue section stained with H&E',
      clinicalRelevance: 'Pathological foundation of expiratory airflow limitation and hypoxia in COPD.'
    },
    proceduralConfig: {
      primaryColor: '#1e293b',
      secondaryColor: '#cbd5e1',
      patternType: 'alveoli_mesh',
      density: 12,
      roughness: 0.7,
      bgGlowColor: 'rgba(71, 85, 105, 0.25)'
    },
    cellularStructures: [
      {
        id: 'enlarged_bullous_space',
        name: 'Enlarged Confluent Bulla',
        scientificTerm: 'Emphysematous Bulla',
        description: 'Giant hyper-inflated air pocket created by the breakdown of multiple adjacent alveolar walls.',
        x: 0.5,
        y: 0.48,
        radius: 0.22,
        minMagnificationRequired: 4,
        optimalDepthLayer: 0.5,
        color: '#475569',
        category: 'tissue_layer',
        function: 'Trapped air pocket with severely compromised gas exchange',
        clinicalSignificance: 'Leads to hyperinflation, loss of elastic recoil, and severe dyspnea.'
      }
    ]
  },

  // ── 4. MICROORGANISMS & PATHOGENS ──
  {
    id: 'ecoli_bacteria',
    title: 'Escherichia Coli (Gram-Negative Rods)',
    scientificName: 'Escherichia coli (Migula 1895)',
    category: 'bacteria',
    subcategory: 'Bacteriology',
    description: 'High-magnification view of Gram-negative rod-shaped bacilli (*E. coli*) under oil immersion, showing pink rod morphology and peritrichous flagella.',
    specimenType: 'healthy',
    stainType: 'Gram Stain (Crystal Violet / Safranin)',
    defaultObjective: '100x',
    baseFOVMicrons: 150,
    histologyDetails: {
      tissueOrigin: 'Pure bacterial culture smear',
      keyIdentificationFeatures: [
        'Gram-negative pink/red bacillus rods ~1.0–3.0 µm length',
        'Peritrichous flagella visible under special flagellar stain',
        'Single or short chain arrangements',
        'Outer lipopolysaccharide (LPS) membrane architecture'
      ],
      prepMethod: 'Heat-fixed bacterial smear Gram stained and viewed at 100x oil immersion',
      clinicalRelevance: 'Key gut commensal microorganism and model organism for molecular genetics and UTI/gastroenteritis infections.'
    },
    proceduralConfig: {
      primaryColor: '#be185d',
      secondaryColor: '#f472b6',
      patternType: 'bacterial_colony',
      density: 60,
      roughness: 0.2,
      bgGlowColor: 'rgba(219, 39, 119, 0.3)'
    },
    cellularStructures: [
      {
        id: 'ecoli_rod',
        name: 'Gram-Negative Bacillus',
        scientificTerm: 'Bacillus E. coli',
        description: 'Rod-shaped bacterial cell bounded by a thin peptidoglycan layer and LPS outer membrane.',
        x: 0.48,
        y: 0.45,
        radius: 0.025,
        minMagnificationRequired: 100,
        optimalDepthLayer: 0.5,
        color: '#db2777',
        category: 'pathogen_feature',
        function: 'Bacterial metabolism & binary fission replication'
      }
    ]
  },

  {
    id: 'amoeba_proteus',
    title: 'Amoeba Proteus (Freshwater Protozoan)',
    scientificName: 'Amoeba proteus (Leidy)',
    category: 'protozoa',
    subcategory: 'Protistology',
    description: 'Live unicellular amoeboid protozoan displaying flowing pseudopodia extension, contractile vacuole water regulation, and phagocytic food vacuoles.',
    specimenType: 'healthy',
    stainType: 'Live Unstained Phase Contrast',
    defaultObjective: '10x',
    baseFOVMicrons: 1800,
    histologyDetails: {
      tissueOrigin: 'Freshwater pond culture mount',
      keyIdentificationFeatures: [
        'Dynamic lobopodia pseudopodia extensions for amoeboid movement',
        'Granular endoplasm surrounding clear peripheral ectoplasm',
        'Pulsating contractile vacuole for osmoregulation',
        'Granular discoid nucleus with peripheral chromatin'
      ],
      prepMethod: 'Depression slide wet mount of live culture',
      clinicalRelevance: 'Classic model for actin-driven cell motility, phagocytosis, and osmoregulation.'
    },
    proceduralConfig: {
      primaryColor: '#0f766e',
      secondaryColor: '#5eead4',
      patternType: 'cellular_network',
      density: 20,
      roughness: 0.3,
      bgGlowColor: 'rgba(20, 184, 166, 0.25)'
    },
    cellularStructures: [
      {
        id: 'pseudopodium',
        name: 'Lobopodia Pseudopodium',
        scientificTerm: 'Pseudopodium',
        description: 'Temporary cytoplasmic extension powered by actin-myosin filament assembly used for locomotion and phagocytosis.',
        x: 0.38,
        y: 0.38,
        radius: 0.14,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.5,
        color: '#0d9488',
        category: 'organelle',
        function: 'Amoeboid movement & engulfment of prey cells'
      },
      {
        id: 'contractile_vac',
        name: 'Contractile Vacuole',
        scientificTerm: 'Vacuolum Pulsatilis',
        description: 'Spherical organelle that rhythmically accumulates and expels excess water to prevent cell lysis.',
        x: 0.56,
        y: 0.52,
        radius: 0.05,
        minMagnificationRequired: 10,
        optimalDepthLayer: 0.55,
        color: '#2dd4bf',
        category: 'organelle',
        function: 'Osmoregulation & water balance maintenance'
      }
    ]
  }
];

export const ASSESSMENT_TASKS: AssessmentTask[] = [
  {
    id: 'task_onion_nucleus',
    title: 'Identify Plant Cell Nucleus',
    instruction: 'Select the Allium Cepa slide, switch to 10x objective, locate the iodine-stained nucleus, and answer the question.',
    targetSlideId: 'onion_epidermis',
    requiredObjective: '10x',
    targetStructureId: 'nuc_1',
    question: 'Why is the nucleus of the onion epidermal cell located near the perimeter of the cell wall rather than in the center?',
    options: [
      'It is pushed against the wall by the large central vacuole',
      'Plant cells lack cytoskeleton microtubule anchor lines',
      'It moves to the wall to receive direct sunlight for photosynthesis',
      'The iodine stain causes nuclear displacement'
    ],
    correctOptionIndex: 0,
    explanation: 'The large fluid-filled central vacuole occupies up to 80-90% of mature plant cell volume, compressing the cytoplasm and nucleus against the peripheral cellulose cell wall.',
    xpReward: 150
  },

  {
    id: 'task_blood_neutrophil',
    title: 'Spot the Immune Defender',
    instruction: 'Load the Normal Human Blood Smear, switch to 40x objective, locate a Neutrophil granulocyte, and identify its nuclear feature.',
    targetSlideId: 'normal_blood_smear',
    requiredObjective: '40x',
    targetStructureId: 'neutrophil_1',
    question: 'What is the characteristic nuclear morphology of a mature Neutrophil seen under 40x magnification?',
    options: [
      'Single large dark spherical nucleus occupying entire cell',
      'Multilobed nucleus containing 3 to 5 nuclear segments connected by thin strands',
      'Biconcave ring nucleus lacking chromatin',
      'Absence of any nucleus (anucleate)'
    ],
    correctOptionIndex: 1,
    explanation: 'Neutrophils are polymorphonuclear leukocytes (PMNs) characterized by a distinctive segmented nucleus with 3 to 5 lobes.',
    xpReward: 200
  },

  {
    id: 'task_bone_haversian',
    title: 'Measure Haversian Canal Architecture',
    instruction: 'Select the Compact Bone Ground Section, zoom into an Osteon, and identify the central Haversian canal function.',
    targetSlideId: 'compact_bone',
    requiredObjective: '10x',
    targetStructureId: 'haversian_canal',
    question: 'Which anatomical structures traverse through the central Haversian Canal of a bone osteon?',
    options: [
      'Blood vessels, lymphatic vessels, and nerve fibers',
      'Pure calcium hydroxyapatite crystals only',
      'Bone marrow stem cells exclusively',
      'Air passages for bone respiration'
    ],
    correctOptionIndex: 0,
    explanation: 'The Haversian canal runs longitudinally through the osteon center, carrying arterial and venous blood vessels, lymphatics, and nerves to nourish osteocytes.',
    xpReward: 250
  }
];
