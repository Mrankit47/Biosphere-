export interface CheckpointQuestion {
  q: string;
  options: string[];
  ans: number; // 0-indexed answer
  explanation: string;
}

export interface SimMilestone {
  title: string;
  range: [number, number]; // timeline range (0 to 100)
  summary: string;
  description: string;
  enzymeFocus: string;
}

export interface SimControl {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  options?: { value: string; label: string }[];
  unit?: string;
}

export interface SimAnnotation {
  x: number;
  y: number;
  text: string;
  range: [number, number];
}

export interface BiologySimulation {
  id: string;
  name: string;
  category: string;
  emoji: string;
  duration: string;
  objectives: string[];
  outcomes: string[];
  steps: SimMilestone[];
  controls: SimControl[];
  annotations: SimAnnotation[];
  quiz: CheckpointQuestion[];
}

export const SIMULATIONS: BiologySimulation[] = [
  {
    id: 'dna_replication',
    name: 'DNA Replication Fork',
    category: 'Molecular Genetics',
    emoji: 'dna-genetics',
    duration: '15 mins',
    objectives: [
      'Understand how DNA Helicase unwinds the double helix.',
      'Explain the role of RNA primers in providing 3\'-OH synthesis anchors.',
      'Contrast continuous leading strand and discontinuous lagging strand synthesis.',
      'Identify how DNA Ligase permanently seals backbone Okazaki nicks.'
    ],
    outcomes: [
      'Describe replication fork dynamics in molecular genetics.',
      'Differentiate between DNA Polymerase I, III, and Helicase enzymes.',
      'Identify directionality of nucleotide assembly (5\' to 3\').'
    ],
    steps: [
      {
        title: 'Helicase Unwinding',
        range: [0, 25],
        summary: 'DNA Helicase unwinds the double helix, separating parent template strands.',
        description: 'The enzyme DNA Helicase breaks the weak hydrogen bonds between complementary nitrogenous bases (A-T and G-C). This unzips the double-stranded DNA molecule, creating a Y-shaped structure known as the Replication Fork. Single-Stranded Binding Proteins (SSBs) stabilize the exposed template strands to prevent re-annealing.',
        enzymeFocus: 'DNA Helicase (Unzipping enzyme)'
      },
      {
        title: 'RNA Primase Priming',
        range: [25, 50],
        summary: 'RNA Primase synthesizes short RNA primers to provide a starting 3\'-OH cap.',
        description: 'DNA Polymerase cannot start synthesis from scratch; it requires an existing nucleotide anchor. The enzyme RNA Primase binds to the template strands and synthesizes a short sequence of complementary RNA nucleotides called an RNA Primer, exposing a free 3\'-OH hydroxyl group.',
        enzymeFocus: 'RNA Primase (Anchor setter)'
      },
      {
        title: 'Polymerase Elongation',
        range: [50, 75],
        summary: 'DNA Polymerase III adds complementary nucleotides continuously and discontinuously.',
        description: 'DNA Polymerase III reads templates in the 3\' to 5\' direction and builds new strands in the 5\' to 3\' direction. The Leading Strand is built continuously towards the fork. The Lagging Strand runs in the opposite direction and must be synthesized discontinuously away from the fork in short segments called Okazaki Fragments.',
        enzymeFocus: 'DNA Polymerase III (Elongator / Builder)'
      },
      {
        title: 'Ligase Ligation',
        range: [75, 100],
        summary: 'RNA primers are replaced, and DNA Ligase seals the backbone.',
        description: 'DNA Polymerase I removes the RNA primers and fills the gaps with DNA nucleotides. Finally, the enzyme DNA Ligase joins the sugar-phosphate backbone together by forming covalent phosphodiester bonds. This permanently links the Okazaki fragments into a unified, continuous double-helix strand.',
        enzymeFocus: 'DNA Ligase (Sealing glue)'
      }
    ],
    controls: [
      {
        id: 'ssbState',
        name: 'Single-Strand Binding Proteins',
        type: 'toggle',
        defaultValue: true
      },
      {
        id: 'mismatchRate',
        name: 'Polymerase Error Proofreading',
        type: 'select',
        defaultValue: 'high',
        options: [
          { value: 'high', label: '100% Proofreading Active' },
          { value: 'low', label: 'Error-prone (No proofreading)' }
        ]
      }
    ],
    annotations: [
      { x: 30, y: 75, text: 'SSBs stabilize single strands', range: [10, 60] },
      { x: 120, y: 40, text: 'Continuous leading strand synthesis (5\' to 3\')', range: [52, 98] },
      { x: 95, y: 135, text: 'Discontinuous Okazaki fragments on lagging template', range: [62, 98] }
    ],
    quiz: [
      {
        q: 'Why must the lagging strand be synthesized discontinuously in Okazaki fragments?',
        options: [
          'Helicase only unwinds one strand at a time.',
          'DNA Polymerase can only build in the 5\' to 3\' direction, which runs away from the unwinding fork on the lagging strand.',
          'RNA primers are too weak to hold continuous DNA chains.',
          'The cell runs out of matching nucleotides periodically.'
        ],
        ans: 1,
        explanation: 'DNA polymerase III can only add nucleotides to a free 3\'-OH group, making synthesis strictly 5\' to 3\'. Because the lagging template runs 5\' to 3\' towards the fork, its assembly must run away from the fork, forming segments as new template is exposed.'
      },
      {
        q: 'Which enzyme is responsible for sealing nicks in the sugar-phosphate backbone?',
        options: [
          'DNA Helicase',
          'RNA Primase',
          'DNA Polymerase III',
          'DNA Ligase'
        ],
        ans: 3,
        explanation: 'DNA Ligase catalyzes the formation of covalent phosphodiester bonds that link Okazaki fragments into a continuous strand.'
      }
    ]
  },
  {
    id: 'mitosis',
    name: 'Mitosis Phases (Cell Division)',
    category: 'Cellular Biology',
    emoji: 'cell-explorer',
    duration: '20 mins',
    objectives: [
      'Trace chromatin packaging into structured sister chromatids.',
      'Explain how spindle fibers align centromeres along the equatorial plate.',
      'Understand chromatid separation pulled by shrinking spindle microtubules.',
      'Observe cleavage furrow cytokinesis splitting cytoplasmic compartments.'
    ],
    outcomes: [
      'Identify Prophase, Metaphase, Anaphase, and Telophase landmarks.',
      'Differentiate karyokinesis from cytoplasm cytokinesis.',
      'Predict how spindle cell blocks (e.g. Colchicine drugs) halt mitosis.'
    ],
    steps: [
      {
        title: 'Prophase: Chromosome Condensation',
        range: [0, 25],
        summary: 'Chromatin condenses into visible chromosomes, and the nuclear membrane dissolves.',
        description: 'Inside the nucleus, the loose chromatin fibers tightly coil and condense into distinct, visible X-shaped Chromosomes (sister chromatids). The Nuclear Envelope breaks down, and centrioles migrate to opposite poles, beginning to extend protein microtubule spindle fibers.',
        enzymeFocus: 'Condensin (packaging complexes)'
      },
      {
        title: 'Metaphase: Equator Alignment',
        range: [25, 50],
        summary: 'Chromosomes align along the metaphase plate in the center of the cell.',
        description: 'Spindle fibers attach to the protein kinetochores on the centromeres of each chromosome. The fibers pull and align all chromosomes along the Metaphase Plate (the cell\'s central equator). This alignment ensures that each new daughter cell will receive exactly one copy of each chromosome.',
        enzymeFocus: 'Kinetochore Microtubules (aligning fibers)'
      },
      {
        title: 'Anaphase: Sister Chromatid Separation',
        range: [50, 75],
        summary: 'Sister chromatids are pulled apart by spindle fibers to opposite poles.',
        description: 'The cohesin proteins holding the sister chromatids together are cleaved. The spindle fibers contract and shorten, pulling the individual chromatids (now considered independent chromosomes) towards opposite centriole poles of the dividing cell.',
        enzymeFocus: 'Separase (cohesin-cleaving enzyme)'
      },
      {
        title: 'Telophase & Cytokinesis: Division',
        range: [75, 100],
        summary: 'New nuclear membranes reform, and the cleavage furrow pinches the cell into two.',
        description: 'Chromosomes reach the poles and decondense back into diffuse chromatin. New Nuclear Envelopes reform around each chromosome set. Meanwhile, Cytokinesis occurs: a contractile ring of actin and myosin filaments pinches the cell membrane inwards (forming a cleavage furrow) until it splits into two identical daughter cells.',
        enzymeFocus: 'Actomyosin Contractile Ring'
      }
    ],
    controls: [
      {
        id: 'spindleState',
        name: 'Spindle Microtuble inhibitor (Colchicine)',
        type: 'toggle',
        defaultValue: false
      },
      {
        id: 'cellType',
        name: 'Cell Specimen Type',
        type: 'select',
        defaultValue: 'animal',
        options: [
          { value: 'animal', label: 'Animal Cell cleavage' },
          { value: 'plant', label: 'Plant Cell (Cell Plate formation)' }
        ]
      }
    ],
    annotations: [
      { x: 30, y: 35, text: 'Nuclear envelope breaks down', range: [5, 20] },
      { x: 100, y: 48, text: 'Equator Metaphase Plate alignment', range: [30, 48] },
      { x: 75, y: 65, text: 'Cohesin proteins cleaved by separase', range: [52, 60] }
    ],
    quiz: [
      {
        q: 'Which mitotic phase involves the alignment of chromosomes along the central cell equator?',
        options: [
          'Prophase',
          'Metaphase',
          'Anaphase',
          'Telophase'
        ],
        ans: 1,
        explanation: 'During Metaphase, chromosomes are pulled by kinetochore spindle fibers and align perfectly along the Metaphase Plate.'
      },
      {
        q: 'What is the role of the Actomyosin contractile ring during cytokinesis in animal cells?',
        options: [
          'To copy DNA molecules.',
          'To replicate centrioles.',
          'To contract and pinch the cell membrane inward, creating the cleavage furrow.',
          'To synthesis nuclear envelopes.'
        ],
        ans: 2,
        explanation: 'Actin and Myosin filaments assemble under the membrane at the equator, contracting like a drawstring to split the single cytoplasm into two distinct cells.'
      }
    ]
  },
  {
    id: 'protein_synthesis',
    name: 'Protein Synthesis (Transcription & Translation)',
    category: 'Molecular Biology',
    emoji: 'ribosome',
    duration: '20 mins',
    objectives: [
      'Observe RNA Polymerase reading DNA template to transcribe mRNA codons.',
      'Track mRNA exiting nuclear pores to bind with Cytosolic Ribosomes.',
      'Explain how tRNA anticodons deliver correct amino acids.',
      'Simulate the elongation of peptide chains at the ribosome active sites.'
    ],
    outcomes: [
      'Explain the Central Dogma of Molecular Biology: DNA → RNA → Protein.',
      'Demonstrate how codons translate to matching amino acids via codon wheels.',
      'Identify E, P, and A tRNA ribosomal binding pockets.'
    ],
    steps: [
      {
        title: 'DNA Transcription',
        range: [0, 35],
        summary: 'RNA Polymerase binds to DNA promoter and transcribes a complementary mRNA strand.',
        description: 'In the nucleus, RNA Polymerase unwinds DNA templates and copies matching RNA bases (Uracil replaces Thymine). This creates a single-stranded messenger RNA transcript (mRNA). The DNA double helix closes behind the enzyme.',
        enzymeFocus: 'RNA Polymerase (Transcriber)'
      },
      {
        title: 'Ribosome Binding',
        range: [35, 60],
        summary: 'mRNA exits nucleus pores and attaches to the small ribosomal subunit.',
        description: 'The mRNA molecule translocates into the cytoplasm. A ribosome clamp (composed of small and large ribosomal subunits) attaches around the start codon sequence (AUG), initializing translation.',
        enzymeFocus: 'Ribosome complex'
      },
      {
        title: 'tRNA Codon Translation',
        range: [60, 85],
        summary: 'tRNA molecules carrying specific amino acids match mRNA codons.',
        description: 'Transfer RNA (tRNA) molecules with matching complementary anticodons enter the ribosome A-pocket. If they match the active mRNA codon triplet, they bind, positioning their attached amino acid next to the peptide chain.',
        enzymeFocus: 'tRNA Transfer elements'
      },
      {
        title: 'Peptide Chain Elongation',
        range: [85, 100],
        summary: 'Ribosomic active sites catalyze peptide bonds, growing the protein chain.',
        description: 'The ribosome catalyzes a covalent peptide bond linking the new amino acid in the A-pocket to the growing polypeptide in the P-pocket. The empty tRNA exits via the E-pocket, and the ribosome translocates to the next codon triplet.',
        enzymeFocus: 'Peptidyl Transferase enzyme'
      }
    ],
    controls: [
      {
        id: 'transcriptionRate',
        name: 'Polymerase Binding Speed',
        type: 'slider',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 2,
        unit: 'x'
      },
      {
        id: 'inhibitorActive',
        name: 'Ribosome Inhibitor (Ricin toxin)',
        type: 'toggle',
        defaultValue: false
      }
    ],
    annotations: [
      { x: 95, y: 70, text: 'RNA Polymerase assembling mRNA transcript', range: [5, 30] },
      { x: 100, y: 110, text: 'Start codon (AUG) triggers translation', range: [38, 55] },
      { x: 115, y: 120, text: 'Peptide bond joins amino acids', range: [80, 98] }
    ],
    quiz: [
      {
        q: 'What base is used in mRNA transcription instead of Thymine (T)?',
        options: [
          'Adenine (A)',
          'Cytosine (C)',
          'Uracil (U)',
          'Guanine (G)'
        ],
        ans: 2,
        explanation: 'RNA molecules contain Uracil (U) instead of Thymine (T). Uracil forms complementary hydrogen bonds with Adenine (A).'
      },
      {
        q: 'What is the role of tRNA in translation?',
        options: [
          'To unwind the nuclear DNA helix.',
          'To carry specific amino acids to the ribosome, matching codons via anticodons.',
          'To splice exons and remove introns.',
          'To digest unfolded protein channels.'
        ],
        ans: 1,
        explanation: 'Transfer RNA (tRNA) acts as the molecular adaptor, matching its specific anticodon loop to the mRNA codon, delivering the corresponding amino acid.'
      }
    ]
  },
  {
    id: 'neuron_transmission',
    name: 'Neuron Signal Transmission',
    category: 'Neurophysiology',
    emoji: 'mitochondria',
    duration: '20 mins',
    objectives: [
      'Examine the resting membrane potential (-70mV) maintained by Na+/K+ ATPase pumps.',
      'Observe depolarization as voltage-gated Sodium (Na+) channels snap open.',
      'Track repolarization as Potassium (K+) gates open to reset charge balance.',
      'Simulate neurotransmitter release across the synaptic cleft to post-synaptic receptors.'
    ],
    outcomes: [
      'Define action potential threshold limits (-55mV).',
      'Explain saltatory conduction across myelinated nodes of Ranvier.',
      'Contrast active pumps with passive gated ion channels.'
    ],
    steps: [
      {
        title: 'Resting Potential State',
        range: [0, 25],
        summary: 'Sodium-Potassium pumps establish a resting gradient of -70mV across the axon.',
        description: 'The Na+/K+ ATPase active pump moves 3 Na+ ions out of the axon for every 2 K+ ions pumped inside, consuming ATP. This creates an electrochemical gradient: high external Na+, high internal K+, leaving the inside of the cell negatively charged relative to the outside.',
        enzymeFocus: 'Na+/K+ ATPase Pump (Active)'
      },
      {
        title: 'Depolarization (Sodium Influx)',
        range: [25, 50],
        summary: 'Stimulus triggers opening of Na+ channels, depolarizing the membrane to +40mV.',
        description: 'When the local membrane potential reaches a threshold of -55mV, voltage-gated Sodium channels open rapidly. Driven by concentration and electrical gradients, Na+ ions rush inside the axon, causing a rapid positive charge shift (depolarization).',
        enzymeFocus: 'Voltage-gated Na+ Channels'
      },
      {
        title: 'Repolarization (Potassium Efflux)',
        range: [50, 75],
        summary: 'Na+ gates close, and K+ channels open to return charge back negative.',
        description: 'At peak depolarization (+40mV), Sodium channels close and inactivate. Voltage-gated Potassium channels open, and K+ ions rush out of the cell, removing positive charges and returning the internal voltage back negative (repolarization).',
        enzymeFocus: 'Voltage-gated K+ Channels'
      },
      {
        title: 'Synaptic Release',
        range: [75, 100],
        summary: 'Signal reaches axon terminals, releasing neurotransmitters into the synapse.',
        description: 'The propagating voltage pulse reaches the axon terminus. Voltage-gated Calcium channels open, triggering synaptic vesicles to fuse with the membrane. Neurotransmitters diffuse across the synaptic cleft, binding to ligand-gated receptors on the target cell.',
        enzymeFocus: 'Synaptic Vesicle Exocytosis'
      }
    ],
    controls: [
      {
        id: 'myelinSheath',
        name: 'Myelinated Axon (Ranvier nodes)',
        type: 'toggle',
        defaultValue: true
      },
      {
        id: 'externalNa',
        name: 'Extracellular Sodium conc.',
        type: 'slider',
        min: 50,
        max: 200,
        step: 10,
        defaultValue: 140,
        unit: 'mM'
      }
    ],
    annotations: [
      { x: 30, y: 70, text: 'ATPase maintains negative interior (-70mV)', range: [0, 20] },
      { x: 100, y: 80, text: 'Na+ rushes inside during Depolarization', range: [30, 48] },
      { x: 140, y: 120, text: 'Neurotransmitters diffuse across synaptic cleft', range: [80, 98] }
    ],
    quiz: [
      {
        q: 'What threshold voltage must a neuron membrane reach to fire an action potential?',
        options: [
          '0 mV',
          '-55 mV',
          '-70 mV',
          '+40 mV'
        ],
        ans: 1,
        explanation: 'An action potential is an all-or-none event triggered only when stimulus depolarizes the resting membrane (-70mV) up to the threshold of -55mV.'
      },
      {
        q: 'Which ion efflux is primarily responsible for the repolarization phase?',
        options: [
          'Sodium (Na+)',
          'Chlorine (Cl-)',
          'Calcium (Ca2+)',
          'Potassium (K+)'
        ],
        ans: 3,
        explanation: 'During repolarization, Na+ channels close, and K+ channels open, allowing K+ ions to exit the axon, restoring the negative interior charge.'
      }
    ]
  }
];
