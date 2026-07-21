export interface QuizQuestion {
  q: string;
  options: string[];
  ans: number; // 0-indexed correct option
  explanation: string;
}

export interface LabControl {
  id: string;
  name: string;
  type: 'slider' | 'counter' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
  options?: { value: string; label: string }[];
  unit?: string;
}

export interface LabStep {
  title: string;
  instruction: string;
  check: (inputs: Record<string, any>, outputs: Record<string, any>) => boolean;
  successMsg: string;
  hint: string;
}

export interface LabExperiment {
  id: string;
  name: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Medical';
  duration: string;
  objectives: string[];
  outcomes: string[];
  theory: string;
  background: string;
  safety: string[];
  equipment: string[];
  materials: string[];
  controls: LabControl[];
  simulationType: 'photosynthesis' | 'catalase' | 'osmosis' | 'microscope';
  compute: (inputs: Record<string, any>) => Record<string, any>;
  steps: LabStep[];
  hints: string[];
  expectedObservations: string[];
  commonMistakes: string[];
  scientificExplanation: string;
  realWorldApplications: string[];
  cleanup: string[];
  conclusion: string;
  references: string[];
  quiz: QuizQuestion[];
  observationQuestions: {
    id: string;
    question: string;
    placeholder: string;
    sampleAnswer: string;
  }[];
  vivaQuestions: string[];
}

export const EXPERIMENTS: LabExperiment[] = [
  {
    id: 'photosynthesis',
    name: 'Photosynthesis Limiting Factors',
    subject: 'Plant Physiology & Bioenergetics',
    difficulty: 'Intermediate',
    duration: '45 mins',
    objectives: [
      'Measure the rate of photosynthesis by counting oxygen bubble release in Elodea.',
      'Investigate the effect of light distance (intensity) on the rate of photosynthesis.',
      'Determine how light wavelength (color filter) alters chlorophyll absorption.',
      'Examine the influence of carbon dioxide availability using Sodium Bicarbonate drops.'
    ],
    outcomes: [
      'Explain the concept of limiting factors in cellular photosynthesis.',
      'Graph the relationship between light intensity (1/d²) and oxygen bubble production.',
      'Describe why green light filter yields the lowest rate of photosynthetic energy conversion.'
    ],
    theory: `Photosynthesis is the process by which autotropic organisms convert light energy into chemical energy. The balanced equation is:
    
    6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
    
    The light-dependent reactions take place within the thylakoid membranes of chloroplasts, where pigments (predominantly Chlorophyll a and b) absorb photons. Photolysis splits water molecules to release electrons, protons (H⁺), and oxygen gas (O₂) as a byproduct. Three main factors limit the rate: light intensity, temperature, and carbon dioxide concentration. Light absorption varies by wavelength; chlorophyll absorbs red and blue light efficiently, but reflects green light.`,
    background: 'Elodea (waterweed) is an ideal aquatic angiosperm for study because oxygen gas released during photolysis forms visible bubbles from its cut stem, allowing direct, quantitative measurement of photosynthetic rates in a classroom setting.',
    safety: [
      'Be careful when handling the high-intensity lamp; it can become hot over time.',
      'Keep electrical cords away from the water beaker to prevent shock hazards.',
      'Wear safety goggles when handling sodium bicarbonate solution.'
    ],
    equipment: [
      'High-intensity light source',
      'Wavelength color filters (Red, Blue, Green)',
      'Graduated beaker (500 mL)',
      'Glass funnel & test tube',
      'Meter ruler'
    ],
    materials: [
      'Fresh Elodea weed sprigs',
      'Sodium Bicarbonate (NaHCO₃) solution',
      'Distilled water'
    ],
    controls: [
      {
        id: 'drops',
        name: 'Sodium Bicarbonate CO₂ Source',
        type: 'counter',
        defaultValue: 0,
        min: 0,
        max: 5,
        unit: 'drops'
      },
      {
        id: 'distance',
        name: 'Light Source Distance',
        type: 'slider',
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 35,
        unit: 'cm'
      },
      {
        id: 'wavelength',
        name: 'Wavelength Filter',
        type: 'select',
        defaultValue: 'white',
        options: [
          { value: 'white', label: 'Full Spectrum (White Light)' },
          { value: 'blue', label: 'Blue Filter (450nm)' },
          { value: 'red', label: 'Red Filter (660nm)' },
          { value: 'green', label: 'Green Filter (530nm)' }
        ]
      }
    ],
    simulationType: 'photosynthesis',
    compute: (inputs) => {
      const distance = inputs.distance ?? 35;
      const drops = inputs.drops ?? 0;
      const wavelength = inputs.wavelength ?? 'white';
      const reactionRun = inputs.reactionRun ?? false;

      if (!reactionRun) {
        return { rate: 0, bubbleSpeed: 0, status: 'Idle - Ready to start' };
      }

      // Intensity is inversely proportional to square of distance
      const intensity = Math.max(0, (50 - distance) / 45); // value between 0 and 1
      
      // Carbon source availability
      let co2Factor = 0.1;
      if (drops === 1) co2Factor = 0.4;
      else if (drops === 2) co2Factor = 0.7;
      else if (drops === 3) co2Factor = 0.9;
      else if (drops >= 4) co2Factor = 1.0;

      // Chlorophyll absorption filter factor
      let filterFactor = 0.95; // white
      if (wavelength === 'blue') filterFactor = 1.0;
      else if (wavelength === 'red') filterFactor = 0.85;
      else if (wavelength === 'green') filterFactor = 0.05; // Green reflected

      const baseRate = 120; // max bubbles per min
      const rate = Math.round(intensity * co2Factor * filterFactor * baseRate);
      const bubbleSpeed = rate === 0 ? 0 : Math.max(0.3, 5 - (rate / 25));

      let status = 'Photosynthesis Active';
      if (drops === 0) {
        status = 'Carbon Limitation (CO₂ starved)';
      } else if (distance >= 45) {
        status = 'Light Limitation (Insufficient photon intensity)';
      } else if (wavelength === 'green') {
        status = 'Pigment Reflection (Green light reflected)';
      }

      return { rate, bubbleSpeed, status };
    },
    steps: [
      {
        title: 'Add Carbon Substrate',
        instruction: 'Add exactly 3 drops of Sodium Bicarbonate (NaHCO₃) to the beaker to supply dissolved CO₂.',
        check: (inputs) => inputs.drops === 3,
        successMsg: 'Carbon dioxide successfully added! Chloroplast stroma has substrate for sugar synthesis.',
        hint: 'Click the "+" button next to Sodium Bicarbonate until the display shows "3 drops".'
      },
      {
        title: 'Adjust Light Position',
        instruction: 'Move the light source close to the plant to maximize light intensity. Set Light Distance to 10 cm or closer.',
        check: (inputs) => inputs.distance <= 10,
        successMsg: 'Light intensity maximized! High photon flux will power photolysis of water.',
        hint: 'Use the slider to drag Light Source Distance down to 10 cm or less.'
      },
      {
        title: 'Apply Peak Wavelength Filter',
        instruction: 'Select the Blue Filter (450nm) to match the primary absorption peak of Chlorophyll a.',
        check: (inputs) => inputs.wavelength === 'blue',
        successMsg: 'Blue filter active! Light absorption matches chlorophyll peak excitation.',
        hint: 'Change the dropdown value in Wavelength Filter from White to Blue.'
      },
      {
        title: 'Measure Oxygen Release',
        instruction: 'Click the "Measure Photo-Rate" button to run the biological trial and record oxygen bubble yield.',
        check: (inputs, outputs) => inputs.reactionRun === true && outputs.rate > 0,
        successMsg: 'Trial complete! Oxygen gas generation rate has been logged in your diagnostic monitor.',
        hint: 'With drops=3, distance <= 10, and wavelength=blue, click the "Measure Photo-Rate" button.'
      }
    ],
    hints: [
      'Chlorophyll absorbs light primarily in the blue and red regions of the spectrum.',
      'Carbon dioxide is a reactant in the light-independent reactions (Calvin cycle). No carbon means no bubbles!',
      'Moving the lamp closer increases photon density, which speeds up photolysis in the thylakoid membranes.'
    ],
    expectedObservations: [
      'At 5cm distance with blue light, rapid stream of small bubbles bubbles float up from the cut stem.',
      'Applying a green filter causes bubble production to slow down or halt completely.',
      'With zero drops of sodium bicarbonate, bubble count drops to nearly zero regardless of light intensity.'
    ],
    commonMistakes: [
      'Thinking plants do not need CO2 for the light reactions: though CO2 is fixed in the dark reactions, a lack of carbon leads to feedback inhibition, locking the light reactions.',
      'Assuming green light is absorbed: leaves look green because they reflect green light, meaning green filters are highly inefficient.'
    ],
    scientificExplanation: 'Oxygen is generated during the light-dependent reactions of photosynthesis. When light excites chlorophyll in Photosystem II, water molecules are split (photolysis) to replace lost electrons, releasing O₂ gas. The rate of bubble production represents the rate of this photolytic reaction, governed by photon absorption and CO₂ concentration.',
    realWorldApplications: [
      'Greenhouse light optimization using red and blue LED arrays.',
      'Predicting how oceanic algal blooms react to changing light penetration and acidity.',
      'Aquarium management: selecting artificial lights for optimal aquatic weed growth.'
    ],
    cleanup: [
      'Turn off and unplug the high-intensity lamp; let it cool before storing.',
      'Empty the beaker, rinse the Elodea plant in fresh water, and store it back in the holding tank.',
      'Wipe down any water spills on the workstation.'
    ],
    conclusion: 'Photosynthetic rate is determined by the environmental factor that is in shortest supply (limiting factor). Under optimal light distance and absorption wavelength, carbon dioxide becomes the major governor of chemical conversion speeds.',
    references: [
      'Campbell Biology (12th Edition) - Chapter 10: Photosynthesis.',
      'Blackman, F. F. (1905). Optima and Limiting Factors. Annals of Botany, 19(2), 281-295.'
    ],
    quiz: [
      {
        q: 'Why does applying a green light filter result in almost zero oxygen bubble production?',
        options: [
          'Green light is too high in energy and damages chloroplast membrane proteins.',
          'Chlorophyll pigments reflect green light rather than absorbing its energy.',
          'Green light freezes stomata, blocking gas exit.',
          'Water absorbing green light blocks it from reaching chloroplasts.'
        ],
        ans: 1,
        explanation: 'Chlorophyll reflects green light, which is why leaves appear green. Because it is reflected rather than absorbed, it cannot excite thylakoid reaction centers.'
      },
      {
        q: 'What is the role of adding Sodium Bicarbonate (NaHCO₃) in this experiment?',
        options: [
          'It increases water density to float bubbles.',
          'It changes temperature of the water.',
          'It dissolves to provide carbon dioxide as substrate for the Calvin Cycle.',
          'It acts as an enzymatic cofactor to split water.'
        ],
        ans: 2,
        explanation: 'Sodium Bicarbonate dissolves to release CO2. CO2 is the carbon source required for Rubisco to fix carbon and synthesize G3P sugar.'
      },
      {
        q: 'Which molecular reaction directly produces the oxygen gas bubbles observed floating from the Elodea?',
        options: [
          'Photolysis: the splitting of water molecules in Photosystem II.',
          'Decarboxylation: the breakdown of glucose in respiration.',
          'Carbon Fixation: the binding of CO2 to RuBP.',
          'Chemiosmosis: the flow of protons through ATP Synthase.'
        ],
        ans: 0,
        explanation: 'During the light reactions, absorbed light energy is used by oxygen-evolving complexes in Photosystem II to split H2O into H+, electrons, and O2 gas.'
      }
    ],
    observationQuestions: [
      {
        id: 'obs_light_intensity',
        question: 'Describe the effect of decreasing light distance from 50cm to 10cm on bubble count. What is the mathematical relationship?',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'Reducing light distance increases bubble counts. Light intensity follows the inverse-square law, so halving distance quadruples photon intensity, accelerating photolysis.'
      },
      {
        id: 'obs_green_filter',
        question: 'Contrast the results of the Blue and Green filter trials. Why did green light suppress bubble release?',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'The blue filter maintained high bubble rates while green light reduced rates to almost zero. Chlorophyll reflects green wavelengths, yielding insufficient photon absorption.'
      }
    ],
    vivaQuestions: [
      'How does the rate of water photolysis couple with the activity of the electron transport chain in thylakoid membranes?',
      'If you added a chemical inhibitor that blocks Rubisco, would oxygen bubble production continue indefinitely in the light? Why or why not?',
      'How would increasing the temperature of the water to 60°C affect bubble release, even if light and CO2 are optimal?'
    ]
  },
  {
    id: 'catalase',
    name: 'Enzyme Catalysis (Catalase Activity)',
    subject: 'Biochemistry & Molecular Biology',
    difficulty: 'Intermediate',
    duration: '45 mins',
    objectives: [
      'Measure the rate of enzyme catalysis by logging froth height in a graduated test tube.',
      'Investigate the effect of pH on Catalase active-site structural stability.',
      'Examine the influence of temperature on molecular collisions and thermal denaturation.',
      'Determine how substrate saturation changes reaction velocity.'
    ],
    outcomes: [
      'Define enzyme denaturation and identify factors that warp tertiary structure.',
      'Graph catalase activity curves over varying pH levels and temperatures.',
      'Explain how hydrogen bonding governs enzyme active-site shape and binding affinity.'
    ],
    theory: `Enzymes are protein catalysts that accelerate chemical reactions by lowering the activation energy barrier. Catalase is an extremely rapid enzyme that breaks down toxic hydrogen peroxide (a byproduct of cellular respiration) into harmless water and oxygen gas:
    
    2H₂O₂ + Catalase → 2H₂O + O₂ (gas)
    
    Like all proteins, Catalase has a specific three-dimensional tertiary structure. The active site binds H₂O₂. If pH levels are too acidic or basic, ionic charges on amino acid sidechains are altered, disrupting hydrogen/ionic bonds and denaturing the enzyme. Similarly, high temperatures provide excess kinetic energy that ruptures these weak bonds, unfolding the active site. Low temperatures reduce kinetic motion, resulting in fewer successful collisions between substrate and enzyme molecules.`,
    background: 'Catalase is found in high quantities in yeast cells, animal liver, and potato cells. In this simulation, yeast-derived Catalase is mixed with Hydrogen Peroxide in a graduated cylinder. The rising foam/froth height represents the cumulative volume of oxygen gas trapped by liquid surfactant.',
    safety: [
      'Hydrogen Peroxide (H₂O₂) is a strong oxidizing agent; avoid skin and eye contact.',
      'Use safety gloves and goggles throughout the experiment.',
      'Report any chemical spills immediately to the supervisor.'
    ],
    equipment: [
      'Graduated test tube / cylinder (250 mL)',
      'Digital thermometer',
      'pH meter',
      'Electronic pipette'
    ],
    materials: [
      'Yeast suspension (Catalase enzyme source)',
      '3% Hydrogen Peroxide (H₂O₂)',
      'Buffer solutions (pH 1 to 14)',
      'Water bath (0°C to 100°C)'
    ],
    controls: [
      {
        id: 'ph',
        name: 'Solution pH',
        type: 'slider',
        min: 1,
        max: 14,
        step: 1,
        defaultValue: 7,
        unit: 'pH'
      },
      {
        id: 'temp',
        name: 'Reaction Temperature',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 20,
        unit: '°C'
      },
      {
        id: 'enzyme',
        name: 'Catalase Concentration',
        type: 'slider',
        min: 10,
        max: 100,
        step: 10,
        defaultValue: 40,
        unit: '%'
      }
    ],
    simulationType: 'catalase',
    compute: (inputs) => {
      const ph = inputs.ph ?? 7;
      const temp = inputs.temp ?? 20;
      const enzyme = inputs.enzyme ?? 40;
      const reactionRun = inputs.reactionRun ?? false;

      if (!reactionRun) {
        return { rate: 0, frothHeight: 0, status: 'Idle - Mixed reactant ready' };
      }

      // Enzyme denaturation parameters
      let isDenatured = false;
      let status = 'Active reaction';

      // 1. pH profile
      let phFactor = 0;
      if (ph <= 3 || ph >= 11) {
        phFactor = 0;
        isDenatured = true;
        status = `DENATURED - pH ${ph} disrupted active-site charge configurations.`;
      } else {
        // Bell-shaped pH activity curve around optimum pH 7
        phFactor = Math.max(0, 1.0 - Math.abs(ph - 7) / 4);
      }

      // 2. Temperature profile
      let tempFactor = 0;
      if (temp >= 60) {
        tempFactor = 0;
        isDenatured = true;
        status = `DENATURED - High temperature (${temp}°C) ruptured hydrogen/ionic bonds.`;
      } else if (temp >= 45) {
        tempFactor = 0.3;
        status = 'Partial denaturation - Heat destabilizing tertiary structure.';
      } else if (temp === 0) {
        tempFactor = 0.05;
        status = 'Inhibited - Kinetic energy too low for molecular collisions.';
      } else {
        // Kinetic activation up to optimum 37C
        const optimalTemp = 37;
        if (temp <= optimalTemp) {
          tempFactor = 0.2 + (temp / optimalTemp) * 0.8;
        } else {
          // Temperature denaturation curve starting past optimum
          tempFactor = 1.0 - ((temp - optimalTemp) / (60 - optimalTemp));
        }
      }

      const enzymeFactor = enzyme / 100;
      const combinedFactor = isDenatured ? 0 : phFactor * tempFactor * enzymeFactor;
      const rate = Math.round(combinedFactor * 100);
      const frothHeight = Math.round(combinedFactor * 160); // max 160px rise

      if (rate > 70) {
        status = 'Rapid Catalysis - Maximum gas release and foaming.';
      } else if (rate > 0 && status === 'Active reaction') {
        status = 'Slow Catalysis - Suboptimal environmental parameters.';
      }

      return { rate, frothHeight, status };
    },
    steps: [
      {
        title: 'Buffer pH Level',
        instruction: 'Catalase functions optimally at neutral pH. Adjust pH level to exactly 7.',
        check: (inputs) => inputs.ph === 7,
        successMsg: 'pH set to 7! Amino acid charges at the active site are stable.',
        hint: 'Slide the pH slider until it reads "pH 7".'
      },
      {
        title: 'Calibrate Temperature',
        instruction: 'Enzyme-substrate collisions increase with warmth. Set Temperature to 37°C.',
        check: (inputs) => inputs.temp === 35 || inputs.temp === 40,
        successMsg: 'Optimal temperature set! Kinetic collisions are maximized without rupturing bonds.',
        hint: 'Use the Temperature slider to choose 35°C or 40°C (physiological optimum).'
      },
      {
        title: 'Load Enzyme Volume',
        instruction: 'Increase enzyme concentration to 80% to ensure high concentration of active sites.',
        check: (inputs) => inputs.enzyme >= 80,
        successMsg: 'Enzyme loaded! High concentration of active sites available.',
        hint: 'Slide the Catalase Concentration slider to 80% or greater.'
      },
      {
        title: 'Perform Catalytic Mix',
        instruction: 'Click the "Run Catalysis" button to mix yeast with H₂O₂ and measure froth height.',
        check: (inputs, outputs) => inputs.reactionRun === true && outputs.rate > 50,
        successMsg: 'Catalytic reaction logged! Trapped oxygen froth height measured successfully.',
        hint: 'Double check: pH=7, Temp=35-40, Enzyme>=80, then click "Run Catalysis".'
      }
    ],
    hints: [
      'Catalase optimum pH is 7 and optimum temperature is approximately 37°C.',
      'Above 60°C, the thermal vibration breaks non-covalent bonds, permanently changing the enzyme shape.',
      'Trapped oxygen gas creates the froth height. More activity = higher froth.'
    ],
    expectedObservations: [
      'At pH 7 and 37°C, a dense, thick foam layer rapidly expands up the test tube.',
      'At pH 2 or temperature 80°C, yeast is added, but no foam forms at all.',
      'At 0°C, a slow, minor accumulation of bubbles forms over several minutes.'
    ],
    commonMistakes: [
      'Assuming denatured enzymes can reform simply by cooling down: thermal denaturation is usually irreversible as proteins coagulate.',
      'Confusing the role of Catalase and Hydrogen Peroxide: Catalase is the enzyme catalyst, and Hydrogen Peroxide is the toxic substrate.'
    ],
    scientificExplanation: 'The rate of enzymatic breakdown is governed by active site integrity and molecular collisions. Optimum conditions (pH 7, 37°C) maximize the formation of enzyme-substrate complexes. Extreme variables disrupt tertiary folding, leading to denaturation where the active site can no longer accommodate the H₂O₂ substrate.',
    realWorldApplications: [
      'Food processing: removing hydrogen peroxide from milk prior to cheese making.',
      'Contact lens cleaning: Catalase tables decompose disinfecting peroxide before insertion.',
      'Clinical diagnostics: checking bacterial presence via catalase positive tests.'
    ],
    cleanup: [
      'Wash out the graduated test tube with soapy water to remove yeast residue.',
      'Neutralize remaining hydrogen peroxide solutions.',
      'Wipe chemical counters dry.'
    ],
    conclusion: 'Enzyme activity is strictly dependent on tertiary structure stability. Deviations in pH and temperature reduce activity by limiting kinetic collisions or irreversibly denaturing active-site pockets.',
    references: [
      'Lehninger Principles of Biochemistry (8th Edition) - Chapter 6: Enzymes.',
      'Aebi, H. (1984). Catalase in vitro. Methods in Enzymology, 105, 121-126.'
    ],
    quiz: [
      {
        q: 'What structural change occurs in Catalase when heated to 80°C?',
        options: [
          'It is converted into a storage lipid.',
          'Its peptide bonds are completely hydrolyzed into free amino acids.',
          'It denatures; tertiary folding unfolds, destroying the shape of the active site.',
          'It crystallizes into an insoluble rigid grid.'
        ],
        ans: 2,
        explanation: 'Excess thermal energy breaks weak non-covalent bonds (hydrogen and ionic bonds) that stabilize the protein folding, leading to denaturation.'
      },
      {
        q: 'Why does the solution froth and foam during catalase activity?',
        options: [
          'Oxygen gas bubbles are produced and trapped in the liquid.',
          'Carbon dioxide gas is released by the yeast cells.',
          'Hydrogen peroxide boils due to endothermic absorption.',
          'Water is evaporated by heat release.'
        ],
        ans: 0,
        explanation: 'Catalase breaks H2O2 into H2O and O2 gas. The escaping oxygen gas creates bubbles that accumulate as foam in the liquid mixture.'
      },
      {
        q: 'How does an extreme pH of 2 cause enzyme inactivation?',
        options: [
          'It digests the primary peptide sequence of the enzyme.',
          'It alters ionic charges on amino acid side groups, disrupting active-site conformation.',
          'It turns hydrogen peroxide into water directly, skipping catalysis.',
          'It blocks substrate entry by neutralizing water molecules.'
        ],
        ans: 1,
        explanation: 'High concentration of H+ ions in acidic conditions protonates amino acid residues, disrupting the ionic interactions that hold the active site shape.'
      }
    ],
    observationQuestions: [
      {
        id: 'obs_denaturation_cause',
        question: 'Identify the exact parameters where zero froth was observed. Explain the physical state of the enzyme under those conditions.',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'Froth was zero at pH 1-2 and temperature 80C. Under these parameters, the Catalase enzyme was denatured, meaning its tertiary shape unfolded, rendering active sites unable to bind substrates.'
      },
      {
        id: 'obs_optimal_conditions',
        question: 'Compare the froth height at 20°C and 37°C (both at pH 7). Explain the molecular kinetics causing this difference.',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'Froth height was higher at 37C than at 20C. Higher thermal energy increases molecular kinetic velocity, leading to more frequent collisions between catalase active sites and hydrogen peroxide.'
      }
    ],
    vivaQuestions: [
      'Describe the molecular nature of the bonds disrupted during thermal denaturation vs. pH-induced denaturation.',
      'If you double the substrate concentration, will the maximum froth rate double? Explain in terms of substrate saturation limits.',
      'Why is yeast catalase structurally different from bacterial catalase, and how does that affect their optimal environmental limits?'
    ]
  },
  {
    id: 'osmosis',
    name: 'Cell Membrane Osmosis & Diffusion',
    subject: 'Cell Biology & Membrane Transport',
    difficulty: 'Intermediate',
    duration: '45 mins',
    objectives: [
      'Investigate passive transport across a semi-permeable cell membrane.',
      'Examine the influence of solute concentration gradients on osmotic flow.',
      'Observe plasmolysis (cell shrinking) and turgor (cell swelling) under hypertonic and hypotonic controls.',
      'Measure how membrane channel density regulates transport rates.'
    ],
    outcomes: [
      'Differentiate between diffusion, osmosis, and facilitated diffusion.',
      'Explain the terms hypertonic, hypotonic, and isotonic.',
      'Predict cell shape changes based on extracellular salt concentrations.'
    ],
    theory: `The plasma membrane is selectively permeable, allowing small nonpolar molecules to diffuse freely, while polar or charged molecules require channel proteins (facilitated diffusion). Osmosis is the passive net movement of water molecules across a selectively permeable membrane from an area of low solute concentration (high water potential) to high solute concentration (low water potential).
    
    Animal cells lacks cell walls; they shrivel in hypertonic environments (crenation) and burst in hypotonic environments (lysis). Plant cells shrivel (plasmolysis) or push against cell walls (turgor pressure) which maintains rigidity. Water moves through specialized channel proteins called Aquaporins.`,
    background: 'In this simulation, a synthetic cell membrane separates intracellular cytoplasm from extracellular solutions. Solute molecules (salt/glucose, purple spheres) and water molecules (blue spheres) drift, illustrating molecular movement across gradients.',
    safety: [
      'Avoid mouth pipetting chemical buffer solutions.',
      'Wash hands immediately if concentrated saline contacts skin.',
      'Clean up dialyzing tube leaks to avoid slippery floor conditions.'
    ],
    equipment: [
      'Semi-permeable dialysis tubing clamps',
      'Electronic balances (0.01g resolution)',
      'Conductivity meter',
      'Microscope slides'
    ],
    materials: [
      'Concentrated Saline (NaCl) solution',
      'Distilled water',
      'Starch/glucose reagents',
      'Red Blood Cell (RBC) samples (simulated)'
    ],
    controls: [
      {
        id: 'externalSolute',
        name: 'Extracellular Salt Conc.',
        type: 'slider',
        min: 0,
        max: 5,
        step: 0.5,
        defaultValue: 0.9, // 0.9% saline is isotonic for mammalian cells
        unit: '%'
      },
      {
        id: 'channelDensity',
        name: 'Aquaporin Channel Density',
        type: 'slider',
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 20,
        unit: '%'
      },
      {
        id: 'temperature',
        name: 'Solution Temperature',
        type: 'slider',
        min: 5,
        max: 45,
        step: 5,
        defaultValue: 25,
        unit: '°C'
      }
    ],
    simulationType: 'osmosis',
    compute: (inputs) => {
      const externalSolute = inputs.externalSolute ?? 0.9;
      const channelDensity = inputs.channelDensity ?? 20;
      const temperature = inputs.temperature ?? 25;
      const reactionRun = inputs.reactionRun ?? false;

      const internalSolute = 0.9; // Isotonic standard cytoplasm is 0.9% salt

      if (!reactionRun) {
        return { rate: 0, netDirection: 'None', cellState: 'Stable', status: 'Equilibrium' };
      }

      // Compute osmotic pressure/gradient
      const gradient = externalSolute - internalSolute;
      
      // Diffusion/Osmosis rate increases with temperature and aquaporin channels
      const speedMultiplier = (temperature / 25) * (0.2 + (channelDensity / 100) * 0.8);
      const rate = Math.round(Math.abs(gradient) * 35 * speedMultiplier);

      let netDirection = 'None (Dynamic Equilibrium)';
      let cellState = 'Isotonic (Normal)';
      let status = 'Dynamic equilibrium. No net water shift.';

      if (gradient > 0.1) {
        netDirection = 'Out of cell (Efflux)';
        cellState = 'Plasmolyzed (Shriveled)';
        status = 'Hypertonic extracellular environment. Water exiting cytoplasm.';
      } else if (gradient < -0.1) {
        netDirection = 'Into cell (Influx)';
        cellState = 'Turgid / Lysed (Swollen)';
        status = 'Hypotonic extracellular environment. Water filling cytoplasm.';
      }

      return { rate, netDirection, cellState, status };
    },
    steps: [
      {
        title: 'Establish Hypertonic Gradient',
        instruction: 'Increase extracellular salt concentration to 3.5% to create a high osmotic pressure gradient.',
        check: (inputs) => inputs.externalSolute >= 3.5,
        successMsg: 'Hypertonic state established! Extracellular water potential is now lower than cytoplasm.',
        hint: 'Slide Extracellular Salt Conc. slider to 3.5% or above.'
      },
      {
        title: 'Insert Aquaporin Channels',
        instruction: 'Enhance membrane permeability. Increase Aquaporin Channel Density to 60% or higher.',
        check: (inputs) => inputs.channelDensity >= 60,
        successMsg: 'Membrane channels loaded! Permeability index optimized for water molecule passage.',
        hint: 'Drag the Aquaporin Channel Density slider to 60% or above.'
      },
      {
        title: 'Run Water Efflux Trial',
        instruction: 'Click "Observe Reaction" to initiate osmotic flow and record cytoplasmic mass changes.',
        check: (inputs, outputs) => inputs.reactionRun === true && outputs.netDirection.includes('Out'),
        successMsg: 'Osmotic efflux logged! Solute gradient drove massive water exit (crenation).',
        hint: 'Make sure salt is high and channels are open, then click "Observe Reaction".'
      }
    ],
    hints: [
      'Water always flows towards the region of higher solute concentration (hypertonic side).',
      'Temperature increases kinetic movement, resulting in faster molecular diffusion.',
      'Aquaporins are pore-forming proteins that selectively conduct water molecules in and out of cells.'
    ],
    expectedObservations: [
      'In a hypertonic solution, water molecules flow rapidly out, causing the visual cell shell to contract.',
      'In pure water (0% salt), water molecules flood inside, swelling the cell, leading to rupture (lysis) if channels are high.',
      'At 0.9% salt, water molecules flow equally in both directions with no net cell volume change.'
    ],
    commonMistakes: [
      'Thinking solutes diffuse through aquaporins: aquaporin channels are narrow pores that block ions like Na+ and Cl- via electrostatic repulsions, conducting only water.',
      'Believing water movement stops at equilibrium: water molecules continue to cross the membrane in equal volumes, resulting in a net flow of zero.'
    ],
    scientificExplanation: 'Osmosis represents the thermodynamics of water striving to balance concentration. When extracellular solute exceeds cytoplasm (0.9%), a water potential gradient is created. Water molecules rapidly leave cytoplasm through lipid bilayers and aquaporins to dissolve external salt, reducing cytoplasmic volume and shrinking the cell membrane.',
    realWorldApplications: [
      'Preserving food with salt/sugar: dehydration prevents microbial cell survival.',
      'Intravenous fluids: IV drips must be isotonic (0.9% saline) to prevent lysing red blood cells.',
      'Reverse Osmosis: purifying sea water by forcing it through membranes under mechanical pressure.'
    ],
    cleanup: [
      'Dispose of saline waste safely down the sink drainage.',
      'Rinse dialysis tubing clamp fixtures.',
      'Return salt reagents to chemical locker.'
    ],
    conclusion: 'Osmotic flow direction is dictated by extracellular tonicity. Cell volume changes are governed by solute gradients, kinetic thermal factors, and membrane protein permeability.',
    references: [
      'Lodish Molecular Cell Biology (9th Edition) - Chapter 11: Transmembrane Transport.',
      'Agre, P. (2004). Aquaporin Water Channels (Nobel Lecture). Angewandte Chemie, 116(33), 4376-4389.'
    ],
    quiz: [
      {
        q: 'What will happen to a mammalian red blood cell placed in distilled water (0% salt)?',
        options: [
          'It will shrink and shrivel due to water exit.',
          'It will remain unchanged because salt cannot cross.',
          'It will swell and burst (lyse) due to water entry.',
          'It will convert starch into glucose to balance pressure.'
        ],
        ans: 2,
        explanation: 'Distilled water is highly hypotonic relative to cytoplasm (0.9% salt). Water will rapidly enter the cell via osmosis, causing animal cells (which lack cell walls) to swell and burst.'
      },
      {
        q: 'What is the role of Aquaporin channels in membranes?',
        options: [
          'They actively pump sodium ions out using ATP.',
          'They form selective pores allowing rapid passive transport of water molecules.',
          'They bind hormones to trigger endocytosis.',
          'They fuse lipids to seal membrane leaks.'
        ],
        ans: 1,
        explanation: 'Aquaporins are membrane channel proteins that facilitate rapid, passive water diffusion (osmosis) across cells, blocking ions and solutes.'
      },
      {
        q: 'Why are cells preserved in high sugar syrups resistant to bacterial decay?',
        options: [
          'Sugar denatures bacterial enzymes directly.',
          'Syrup forms an airtight seal blocking oxygen.',
          'High sugar creates a hypertonic environment, causing bacterial cells to dehydrate and die.',
          'Bacteria digest sugar into toxic alcohol.'
        ],
        ans: 2,
        explanation: 'High sugar creates a hypertonic environment. Water will be drawn out of any contaminating bacterial cells, dehydrating and inactivating them, preventing growth.'
      }
    ],
    observationQuestions: [
      {
        id: 'obs_cell_behavior',
        question: 'Detail the differences in cell appearance when extracellular salt is 0% versus 4.5%.',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'At 0% salt, the cell swells and expands due to water entry. At 4.5% salt, the cell shrinks, shrivels, and its outer boundary wrinkles due to water loss.'
      },
      {
        id: 'obs_aquaporin_effect',
        question: 'How did increasing Aquaporin channel density from 10% to 90% change the rate of osmosis? Why?',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'Increasing channel density drastically speeded up the rate of cell volume change. Aquaporins lower the activation energy barrier for water crossing, increasing membrane permeability.'
      }
    ],
    vivaQuestions: [
      'Explain how the selective filter of aquaporin prevents proton (H3O+) transport while allowing water molecules through.',
      'How does the presence of a cell wall in plant cells alter their response to extreme hypotonic environments compared to animal cells?',
      'If salt concentration is equal on both sides, does water exchange stop? Define the concept of dynamic equilibrium.'
    ]
  },
  {
    id: 'microscope',
    name: 'Microscope Cellular Exploration',
    subject: 'Cytology & Histology',
    difficulty: 'Beginner',
    duration: '30 mins',
    objectives: [
      'Master the adjustments of a light compound microscope: coarse focus, fine focus, and light source.',
      'Contrast the structural features of plant cells (Onion Peel) and animal cells (Human Cheek Cells).',
      'Identify stomata guard cells in Leaf Epidermis slides.',
      'Compare magnification sizes under low, medium, and high objectives.'
    ],
    outcomes: [
      'Demonstrate how focus adjustments align optical lenses.',
      'Identify cell walls, nuclei, cytoplasm, and guard cells under magnification.',
      'List the key differences in tissue arrangement between autotropic and heterotropic tissues.'
    ],
    theory: `The compound light microscope uses multiple lenses to magnify minute structures. Light passes from the sub-stage illuminator through the condenser, specimen slide, objective lens, and eyepiece to the eye.
    
    Adjustments are key for clarity:
    - **Coarse Focus Knob**: Moves the stage up and down rapidly to bring the specimen into general focus. Used only under low magnification.
    - **Fine Focus Knob**: Moves the stage minimally to sharpen the resolution.
    - **Aperture Diaphragm & Light Control**: Regulates contrast and illumination.
    
    Plant onion cells are rectangular, bordered by a rigid cell wall, containing nucleus and vacuoles. Animal cheek cells are irregular, containing only cell membranes and nuclei. Leaf epidermis slides show stomatal pores surrounded by bean-shaped guard cells regulating gas exchange.`,
    background: 'Students prepare slide mounts, place them under the mechanical stage clips, select magnification objective lenses, and adjust knobs to align light pathways for cellular observation.',
    safety: [
      'Always start focusing by looking from the side to avoid crushing specimen glass slides.',
      'Clean optical lenses only with specialized lens paper to avoid scratches.',
      'Carry the microscope with one hand supporting the arm and one on the base.'
    ],
    equipment: [
      'Compound light microscope',
      'Glass slides & coverslips',
      'Forceps & pipettes'
    ],
    materials: [
      'Onion skin epidermis',
      'Methylene Blue dye stain',
      'Iodine reagent stain',
      'Sterile buccal cheek swabs'
    ],
    controls: [
      {
        id: 'slideType',
        name: 'Specimen Slide Select',
        type: 'select',
        defaultValue: 'onion',
        options: [
          { value: 'onion', label: 'Onion Skin Epidermis (Plant)' },
          { value: 'cheek', label: 'Human Buccal Cheek (Animal)' },
          { value: 'stomata', label: 'Leaf Epidermis Stomata (Plant)' }
        ]
      },
      {
        id: 'coarse',
        name: 'Coarse Focus Knob',
        type: 'slider',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 10,
        unit: '%'
      },
      {
        id: 'fine',
        name: 'Fine Focus Knob',
        type: 'slider',
        min: 0,
        max: 100,
        step: 2,
        defaultValue: 20,
        unit: '%'
      },
      {
        id: 'mag',
        name: 'Objective Lens Magnification',
        type: 'select',
        defaultValue: '10x',
        options: [
          { value: '4x', label: '4x Scanning (40x Total)' },
          { value: '10x', label: '10x Low Power (100x Total)' },
          { value: '40x', label: '40x High Dry (400x Total)' }
        ]
      }
    ],
    simulationType: 'microscope',
    compute: (inputs) => {
      const slideType = inputs.slideType ?? 'onion';
      const coarse = inputs.coarse ?? 10;
      const fine = inputs.fine ?? 20;
      const mag = inputs.mag ?? '10x';
      const reactionRun = inputs.reactionRun ?? false;

      if (!reactionRun) {
        return { rate: 0, blur: 20, focusScore: 0, status: 'Illuminator Off' };
      }

      // Determine focus optimums based on magnification
      // High magnification is harder to focus, requiring narrow fine focus bounds
      let optCoarse = 45;
      let optFine = 50;

      if (mag === '4x') {
        optCoarse = 30;
        optFine = 50; // flexible
      } else if (mag === '10x') {
        optCoarse = 50;
        optFine = 60;
      } else if (mag === '40x') {
        optCoarse = 65;
        optFine = 72;
      }

      // Calculate focal distance delta
      const coarseDelta = Math.abs(coarse - optCoarse);
      const fineDelta = Math.abs(fine - optFine);

      const focusDiff = (coarseDelta * 1.5) + (fineDelta * 0.5);
      const blur = Math.min(25, focusDiff / 2);
      const focusScore = Math.max(0, 100 - focusDiff * 4);

      let status = 'Blurred Image - Specimen out of focal plane';
      if (focusScore > 90) {
        status = ' specimen in high-resolution focus!';
      } else if (focusScore > 50) {
        status = 'Partial focus. Specimens outlines visible but blurry.';
      }

      return { blur, focusScore: Math.round(focusScore), status: `Specimen: ${slideType.toUpperCase()}.${status}` };
    },
    steps: [
      {
        title: 'Select Sample Tissue',
        instruction: 'Mount the Onion Skin Epidermis slide on the stage.',
        check: (inputs) => inputs.slideType === 'onion',
        successMsg: 'Onion slide mounted successfully!',
        hint: 'Select "Onion Skin Epidermis" in the Specimen Slide Select dropdown.'
      },
      {
        title: 'Mount Objective Lens',
        instruction: 'Rotate the nosepiece to select the 10x Low Power objective lens.',
        check: (inputs) => inputs.mag === '10x',
        successMsg: 'Low Power objective engaged! Target field of view calibrated.',
        hint: 'Set Objective Lens Magnification select box to "10x Low Power".'
      },
      {
        title: 'Coarse Stage Calibration',
        instruction: 'Adjust the Coarse Focus knob to 50% to move the stage into the focal range.',
        check: (inputs) => inputs.coarse === 50,
        successMsg: 'Stage height calibrated near the focal point!',
        hint: 'Drag Coarse Focus slider to exactly 50%.'
      },
      {
        title: 'Fine Resolution Sharpening',
        instruction: 'Adjust the Fine Focus knob to 60% to resolve clear plant cell walls and nuclei.',
        check: (inputs) => inputs.fine === 60,
        successMsg: 'Specimen in razor-sharp focus! Stained cell components are resolved.',
        hint: 'Drag Fine Focus slider to exactly 60%.'
      },
      {
        title: 'Observe Cellular Specimen',
        instruction: 'Turn on the illuminator by clicking the "Observe specimen" button.',
        check: (inputs, outputs) => inputs.reactionRun === true && outputs.focusScore >= 95,
        successMsg: 'Specimen resolved! You can clearly observe nucleus, cell wall and cytoplasm.',
        hint: 'Make sure focus is set correctly and then click the button.'
      }
    ],
    hints: [
      'At 10x magnification, coarse focus should be 50% and fine focus should be 60% for a crisp view.',
      'Only use the fine focus knob at higher magnifications (40x) to avoid shattering slides.',
      'Plant cells have a cell wall. Onion cells lack chloroplasts because onions grow underground!'
    ],
    expectedObservations: [
      'Onion skin cells appear as brick-like rectangular rows with clear circular stained nuclei.',
      'Cheek cells appear as scattered, faint blue irregular polygons with central nuclei.',
      'Leaf stomata show paired guard cells forming kidney-like lips enclosing pores.'
    ],
    commonMistakes: [
      'Using coarse focus under 40x magnification: the objective lens is very close to the coverslip, and coarse adjustments can crack the slide.',
      'Searching for chloroplasts in onion peel cells: onion bulbs are underground roots designed for storage, so they do not photosynthesize.'
    ],
    scientificExplanation: 'Microscopes resolve images by focusing light pathways. The Coarse Focus knob performs large mechanical changes to align lens distance. The Fine Focus shifts lens distance micrometrically, matching the sample plane. Magnification restricts the focal depth, requiring precise adjustments at higher powers.',
    realWorldApplications: [
      'Clinical histopathology: diagnosing tumors by examining stained biopsied tissues.',
      'Hematology: counting RBCs/WBCs to identify infections or anemia.',
      'Forensics: examining crime scene hair, fibers, and pollen samples.'
    ],
    cleanup: [
      'Return objective lenses to 4x scanning magnification.',
      'Remove slides, wipe off oil/dye, and store in slide boxes.',
      'Turn down light brightness, turn off power, and cover microscope.'
    ],
    conclusion: 'Microscopic analysis is essential to identify cytological differences. Stains bind specific organelles (e.g. iodine binds starch, methylene blue binds nucleus DNA) to render colorless specimens visible.',
    references: [
      'Slayter, E. M., & Slayter, H. S. (1992). Light and Electron Microscopy. Cambridge University Press.',
      'Microbiology: Laboratory Theory and Application (4th Edition) - Section 1: Microscopy.'
    ],
    quiz: [
      {
        q: 'Why are cells stained with Iodine or Methylene Blue before observation?',
        options: [
          'To kill cellular bacteria on the slide.',
          'To increase contrast, highlighting specific structures like nuclei or cell walls.',
          'To glue the cells permanently to the glass slide.',
          'To trigger cellular respiration for active study.'
        ],
        ans: 1,
        explanation: 'Most biological cells are colorless and transparent. Stains selectively bind chemical components (like DNA in the nucleus or starch in vacuole), increasing visual contrast.'
      },
      {
        q: 'Which adjustment knob should NEVER be used when using the 40x High Dry objective?',
        options: [
          'Fine Focus Knob',
          'Light Dimmer Knob',
          'Coarse Focus Knob',
          'Diaphragm Lever'
        ],
        ans: 2,
        explanation: 'At 40x, the objective lens is extremely close to the slide cover slip. Using the coarse knob moves the stage too rapidly, risking crushing the slide and breaking the lens.'
      },
      {
        q: 'How does an onion skin epidermis cell differ from a human cheek cell under a microscope?',
        options: [
          'Onion cells lack nuclei while cheek cells contain them.',
          'Onion cells have irregular boundaries while cheek cells are brick-shaped.',
          'Onion cells possess cell walls and structured rectangular arrays; cheek cells are irregular with only membranes.',
          'Onion cells swim using flagella while cheek cells are anchored.'
        ],
        ans: 2,
        explanation: 'Onion epidermis cells are plant cells with a rigid cell wall providing a structured grid shape. Cheek cells are animal cell tissues with thin membranes, appearing rounded or irregular.'
      }
    ],
    observationQuestions: [
      {
        id: 'obs_cheek_vs_onion',
        question: 'Identify the structural components visible in the Onion Skin cells that are missing from the Cheek cells.',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'Onion cells contain a distinct cell wall surrounding the cell and are organized in tight, grid-like sheets. Cheek cells lack a cell wall, showing irregular borders, and are scattered.'
      },
      {
        id: 'obs_stomata_shape',
        question: 'Describe the shape and function of guard cells observed on the Leaf Epidermis slide.',
        placeholder: 'Enter your observation here...',
        sampleAnswer: 'Guard cells appear as pairs of kidney-shaped cells bordering a central stomatal pore. They expand and contract to control the opening and closing of the pore for transpiration.'
      }
    ],
    vivaQuestions: [
      'Explain the optical principles of magnification versus resolution in light microscopes.',
      'Why is it that onion bulb cells lack chloroplasts even though they are plant cells?',
      'Detail the path of light from the microscope light source to the observer ocular lens.'
    ]
  }
];
