import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const CONTEXT_GUIDES: Record<string, string> = {
  heart: `
Current topic: Human Heart
Suggested topics: Blood circulation, Arteries, Veins, Cardiovascular core, Cardiac cycle
Relevant clinical diseases: Heart Attack (Myocardial infarction), Arrhythmia, Hypertension, Coronary artery disease
Relevant simulations: Blood Flow, Cardiac Pace
`,
  brain: `
Current topic: Human Brain
Suggested topics: Neurons, Central Nervous System, Synapses, Neurotransmitters, Cerebrum
Relevant clinical diseases: Stroke, Alzheimer's disease, Meningitis, Glioma
Relevant simulations: Nerve Pulse Transmission
`,
  lungs: `
Current topic: Human Lungs
Suggested topics: Respiration, Alveoli, Gas Exchange, Oxygen transport, Ventilation
Relevant clinical diseases: Asthma, Pneumonia, COPD, Emphysema
Relevant simulations: Pulmonary Expansion
`,
  liver: `
Current topic: Human Liver
Suggested topics: Metabolism, Detoxification, Bile production, Hepatic portal circuit
Relevant clinical diseases: Hepatitis, Cirrhosis, Fatty liver disease
Relevant simulations: Liver Detox Lab
`,
  stomach: `
Current topic: Human Stomach
Suggested topics: Digestion, Gastric acid, Protease breakdown, Gastrointestinal tract
Relevant clinical diseases: Gastritis, Peptic ulcers, Acid reflux (GERD)
Relevant simulations: Digestive Breakdown
`,
  intestines: `
Current topic: Human Intestines
Suggested topics: Nutrient absorption, Microbiome, Peristalsis, Water recovery
Relevant clinical diseases: Celiac disease, Crohn's disease, Irritable Bowel Syndrome (IBS)
Relevant simulations: Nutrient Absorption Lab
`,
  kidneys: `
Current topic: Human Kidneys
Suggested topics: Nephrons, Blood filtration, Osmoregulation, Urine formation
Relevant clinical diseases: Chronic kidney disease, Kidney stones, Nephritis
Relevant simulations: Dialysis Simulator
`,
  bladder: `
Current topic: Human Bladder
Suggested topics: Urinary system, Fluid excretion, Detrusor muscle, Micturition
Relevant clinical diseases: Cystitis, Bladder stones, Urinary Tract Infection (UTI)
Relevant simulations: Homeostasis Lab
`,
  thyroid: `
Current topic: Thyroid Gland
Suggested topics: Endocrine system, Metabolism regulation, T3/T4 hormones, Goiter
Relevant clinical diseases: Hyperthyroidism, Hypothyroidism, Graves' disease
Relevant simulations: Hormonal Feedback Loops
`,
  pituitary: `
Current topic: Pituitary Gland
Suggested topics: Master endocrine gland, Growth hormone, Hypothalamus axis
Relevant clinical diseases: Gigantism, Pituitary adenoma, Acromegaly
Relevant simulations: Endocrine Cascades
`,
  spleen: `
Current topic: Human Spleen
Suggested topics: Lymphatic system, Red blood cell recycling, Immune filtration, Platelet storage
Relevant clinical diseases: Splenomegaly, Splenic rupture
Relevant simulations: Immune Surveillance Sim
`,
  reproductive: `
Current topic: Reproductive Organs
Suggested topics: Gametes, Sex hormones (testosterone, estrogen), Meiosis
Relevant clinical diseases: Polycystic Ovary Syndrome (PCOS), Prostate hyperplasia
Relevant simulations: Meiosis Simulation
`,
  membrane: `
Current topic: Cell Membrane
Suggested topics: Phospholipid bilayer, Active transport, Passive diffusion, Osmosis, Ion channels
Relevant clinical diseases: Cystic fibrosis (CFTR channel defect), Familial hypercholesterolemia
Relevant simulations: Membrane Permeability Sim
`,
  nucleus: `
Current topic: Cell Nucleus
Suggested topics: Transcription, Chromatin structure, Nuclear pore complex, Nucleolus, DNA replication
Relevant clinical diseases: Progeria (lamin A defect), Genetic mutations
Relevant simulations: DNA Transcription Lab
`,
  mitochondria: `
Current topic: Mitochondria
Suggested topics: ATP synthesis, Citric Acid Cycle, Oxidative phosphorylation, Electron Transport Chain
Relevant clinical diseases: Mitochondrial myopathies, Leber hereditary optic neuropathy (LHON)
Relevant simulations: ATP Synthesis Sim
`,
  ribosome: `
Current topic: Ribosome
Suggested topics: Translation, Protein synthesis, Peptide bond formation, tRNA, mRNA decoding
Relevant clinical diseases: Ribosomopathies (e.g., Diamond-Blackfan anemia)
Relevant simulations: Translation Speed Lab
`
};

function buildSystemPrompt(context: any, progress: any, difficulty: string, action?: string) {
  let prompt = `You are a Context-Aware Biology Mentor for the BioSphere application. Your name is BioTutor.
You are ONLY allowed to answer questions related to biology (cells, genetics, anatomy, microbiology, viruses, ecology, botany, zoology, biochemistry).
If the user asks about other topics (coding, math, history, general advice, etc.), politely decline, explaining your programming is limited to biology, and suggest they ask a biology question.

--- TEACHER PERSONALITY ---
Never sound like ChatGPT. You are a friendly, curious biology professor.
- Encourage curiosity: use active phrases like "Fascinating inquiry!", "Let's investigate this together!", "Did you know that...".
- Ask guidance follow-up questions at the end to prompt student thinking.
- Never overwhelm with massive information walls; keep formatting tidy and readable.

--- ADAPTIVE TEACHING LEVEL ---
You must tailor your explanation style to the requested difficulty level: "${difficulty || 'intermediate'}".
- beginner: Explain with simple, everyday analogies (e.g. comparing mitochondria to power generators or lysosomes to trash compactors). Avoid complex formulas or dense medical terms.
- intermediate: High school or undergraduate level. Use standard biological concepts (e.g., ATP synthesis, active transport).
- advanced: Graduate or researcher level. Focus on molecular pathways, protein names, membrane biochemistry.
- medical: Medical student level. Focus on clinical relevance, pathology, diagnostic markers, and anatomical relationships.
- teacher: Focus on pedagogical strategies, key study topics, classroom experiments, and helping students clarify misconceptions.

--- VISUAL INTEGRATION COMMANDS ---
If the topic discussed directly relates to a specific 3D model, organ, or cell structure present in our system, you MUST output a control tag at the very end of your response (after all conversational text):
\`[ACTION: zoom <id>]\` or \`[ACTION: highlight <id>]\` or \`[ACTION: play <animation>]\` or \`[ACTION: open <lesson>]\`.
Valid IDs: "brain", "heart", "lungs", "liver", "stomach", "intestines", "kidneys", "bladder", "thyroid", "pituitary", "spleen", "reproductive", "membrane", "nucleus", "mitochondria", "ribosome".

--- RESPONSE STRUCTURE ---
`;

  if (action === "viva_grade") {
    prompt += `
The student is taking the oral examination (Viva Voce) for the virtual laboratory experiment: "${context?.experimentName || 'Biology Lab'}".
The user message contains the student's answer to a viva question.
Your goals:
1. Act as the friendly but rigorous biology professor.
2. Evaluate the accuracy of the student's answer based on biological principles.
3. Provide a brief, encouraging, constructive critique explaining why their answer is correct, partially correct, or incorrect.
4. Conclude your response with the grade out of 10 in this exact format:
SCORE: X/10 (where X is a number from 0 to 10 based on their answer quality).
Example output:
"Fascinating answer! You correctly identified that Aquaporins do not require ATP because they are channel proteins facilitating passive transport down a gradient. However, you forgot to mention that water moves from high to low water potential.
SCORE: 8/10"
Keep it concise. Do NOT add other formatting templates.
`;
  } else if (context && context.page === "process-simulations") {
    prompt += `
The student is currently watching an interactive biology process simulation: "${context.simulationName}".
Simulation ID: ${context.simulationId}
Active milestone index: ${context.activeStepIdx} (Title: "${context.activeStepTitle}")
Timeline Scrubber Percentage: ${Math.round(context.timeline || 0)}%
Active variable configurations: ${JSON.stringify(context.controls || {})}

Your goals:
1. Act as the friendly biology tutor and explain what cellular/molecular actions are occurring at this specific timeline stage.
2. Address custom variables:
   - In DNA Replication: Explain leading/lagging synthesis, single-strand binding proteins (SSBs), replication forks, and ligase activity.
   - In Mitosis: Describe chromosome packaging, centromere alignment, spindle fiber spindle checkpoints, and actomyosin cytokinetic rings. Explain how Colchicine blocks spindle fiber assembly, preventing division.
   - In Protein Synthesis: Differentiate transcription (RNA Polymerase base matches, nucleus) and translation (mRNA translocation, codons, tRNA anticodon loops, peptide bonding in ribosome chambers).
   - In Neuron Transmission: Detail Na+/K+ ATPase active pumps (-70mV), depolarization (+40mV Na+ entry), repolarization (K+ exit), and synaptic exocytosis of neurotransmitters. Discuss how myelination (sheaths) accelerates propagation via saltatory skipping.
3. Guide their conceptual understanding and predict outcomes.

Structure your response like this:

### 🧬 Simulation Phase Overview
[Analogy or simple breakdown of the active milestone]

### 🔬 Molecular Mechanisms
[Detailed biochemical explanation of active structures, enzymes, or ion gates]

### ⚠️ Common Student Misconceptions
- [Misconceptions or errors to clarify about this cellular process]

### ❓ Active Inquiry Prompt
[Conceptual biology question to prompt student reflection]
`;
  } else if (context && context.page === "virtual-lab") {
    prompt += `
The student is currently running a virtual biology laboratory experiment: "${context.experimentName}".
Experiment ID: ${context.experimentId}
Lab Mode: ${context.mode}
Active step index: ${context.currentStepIndex} (Title: "${context.currentStepTitle}")
Equipped Cabinet Items: ${context.equippedItems?.join(", ") || "None"}
Active Simulator Inputs: ${JSON.stringify(context.inputs || {})}
Live Simulator Outputs: ${JSON.stringify(context.outputs || {})}

Your goals:
1. Help the student complete the lab steps, explain concepts when they are stuck, or suggest corrections.
2. If they ask to check for mistakes, look at their active simulator inputs and compare them with the biological principles:
   - In Photosynthesis: If drops = 0, warn them that no CO2 means Rubisco cannot fix carbon. If distance > 40, light is too low to power Photosystem II photolysis. If wavelength = green, remind them chlorophyll reflects green light.
   - In Catalase: If pH is highly acidic/basic (pH 1-3, 11-14) or temperature is >= 60°C, explain that Catalase has denatured because weak hydrogen/ionic bonds maintaining active-site folding have ruptured. If temp is 0°C, explain that kinetic energy is too low for molecular collisions.
   - In Osmosis: Explain plasmolysis/crenation if saline is hypertonic (> 0.9%) and lysis/turgor if hypotonic (< 0.9%).
   - In Microscope: Help them calibrate Coarse and Fine focus knobs.
3. Keep your advice focused on biology and the active lab parameters. Keep formatting tidy and short.

Structure your normal message response like this:

### 🔬 Practical Lab Insight
[Analogy or quick breakdown of what is happening or what they should do next]

### 💡 Biological Explanation
[Detailed scientific context about the mechanism: photolysis, denaturation, concentration gradients, focus, etc.]

### ⚠️ Common Pitfalls
- [Misconceptions or errors to watch out for in this lab step]

### ❓ Next Steps Guidance
[Follow-up question or recommendation on what variables to adjust next]
`;
  } else if (action === "quiz") {
    prompt += `
The user wants you to generate a multiple-choice quiz based on the active topic. Generate 3 questions.
Format the quiz ONLY as a single valid JSON block inside a code block marked with "json". The JSON must have this exact schema:
{
  "quiz": [
    {
      "question": "The question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 2,
      "explanation": "Explanation for why the correct answer is correct."
    }
  ]
}
Do NOT add any other conversational text inside or outside that code block. Just return the JSON code block.
`;
  } else if (action === "flashcards") {
    prompt += `
The user wants you to generate revision flashcards based on the active topic. Generate 4 cards.
Format the flashcards ONLY as a single valid JSON block inside a code block marked with "json". The JSON must have this exact schema:
{
  "flashcards": [
    {
      "front": "Front question or concept...",
      "back": "Back answer or detail...",
      "hint": "Brief hint..."
    }
  ]
}
Do NOT add any other conversational text inside or outside that code block. Just return the JSON code block.
`;
  } else if (action === "summary") {
    prompt += `
Generate a highly structured revision summary of the active topic. Use headings and bullet points. Include key takeaways and a short review checklist.
`;
  } else if (action === "notes") {
    prompt += `
Generate comprehensive study revision notes. Focus on explaining core mechanisms, chemical structures/pathways, and highlights to focus on for exams.
`;
  } else {
    prompt += `
Every normal message response must strictly follow this template (do not deviate):

### 💡 Simple Explanation
[Analogy and simple breakdown]

### 🔬 Scientific Explanation (Level: ${difficulty || 'intermediate'})
[Detailed physiological/biological explanation]

### 🔑 Key Terms
- **[Term Name]**: [Definition]
- ...

### 💡 Interesting Facts
- [Fact 1]
- ...

### ⚠️ Common Mistakes
- [Misconception 1] (Why it happens and how to think about it correctly)

### 🧭 Recommended Path
- **Related Lessons**: [Lesson Title](URL)
- **3D Model**: [Anatomy or Cell Explorer name]
- **Simulation**: [Simulation name]
- **Quiz**: [Quiz name]
- **Further Reading**: [Topics/links]

### ❓ Ask Another Question
[Friendly professor prompt and a follow-up question]
`;
  }

  // Append user progress context if available
  if (progress) {
    prompt += `
--- USER LEARNING PROGRESS CONTEXT ---
Completed lessons count: ${progress.completedLessonsCount || 0}
Weak topics: ${progress.weakTopics?.join(", ") || "None registered yet"}
Total study XP: ${progress.totalXp || 0}
Bookmarks count: ${progress.bookmarkedLessonsCount || 0}
Recent study focus: ${progress.favoriteTopics?.join(", ") || "None"}
`;
  }

  // Append current page and item context
  if (context) {
    const organId = context.selectedOrgan || context.selectedCell || "";
    const contextGuide = CONTEXT_GUIDES[organId.toLowerCase()] || "";
    
    prompt += `
--- ACTIVE VIEWING CONTEXT ---
Current page: ${context.page || "tutor"}
Active Lesson: ${context.lesson || "None"}
Active Learning Program: ${context.program || "None"}
Selected Organ: ${context.selectedOrgan || "None"}
Selected Cell: ${context.selectedCell || "None"}
Selected Disease: ${context.selectedDisease || "None"}
Selected Species: ${context.selectedSpecies || "None"}
${contextGuide}
`;
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context, progress, difficulty, action } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "";
    const groqKey = process.env.GROQ_API_KEY || "";

    const systemPrompt = buildSystemPrompt(context, progress, difficulty, action);

    // Tier 1: Try Gemini API first (First preference)
    if (apiKey) {
      try {
        console.log("Attempting Gemini API call...");
        return await callGeminiAPI(messages, systemPrompt, apiKey);
      } catch (geminiError: any) {
        console.warn("Gemini call failed. Fallback path active. Error:", geminiError.message || geminiError);
        
        if (groqKey) {
          try {
            console.log("Gemini failed. Falling back to Groq API...");
            return await callGroqAPI(messages, systemPrompt, groqKey);
          } catch (groqError: any) {
            console.warn("Groq fallback also failed. Falling back to offline mock database. Error:", groqError.message || groqError);
            return makeMockResponse(messages, difficulty, action);
          }
        } else {
          console.warn("No Groq key available. Falling back to offline mock database.");
          return makeMockResponse(messages, difficulty, action);
        }
      }
    }

    // Tier 2: If Gemini key is not set, but Groq key is set, call Groq directly
    if (groqKey) {
      try {
        console.log("Attempting Groq API call directly...");
        return await callGroqAPI(messages, systemPrompt, groqKey);
      } catch (groqError: any) {
        console.warn("Groq call failed. Falling back to offline mock database. Error:", groqError.message || groqError);
        return makeMockResponse(messages, difficulty, action);
      }
    }

    // Tier 3: If no API keys are present, call the local mock database directly
    console.log("No API keys found. Accessing offline mock biology database...");
    return makeMockResponse(messages, difficulty, action);

  } catch (error: any) {
    console.error("General routing error:", error);
    try {
      const { messages, difficulty, action } = await req.json();
      return makeMockResponse(messages, difficulty, action);
    } catch {
      return makeMockResponse([], "intermediate");
    }
  }
}

// ── Helper API Functions ──────────────────────────────────────────

async function callGeminiAPI(messages: any[], systemPrompt: string, apiKey: string) {
  const geminiMessages = messages.map((m: any) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: geminiMessages,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = response.body?.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const data = JSON.parse(jsonStr);
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8" }
  });
}

async function callGroqAPI(messages: any[], systemPrompt: string, groqKey: string) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content }))
        ],
        stream: true
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Groq API responded with status ${response.status}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = response.body?.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleaned = line.trim();
            if (cleaned.startsWith("data: ")) {
              const jsonStr = cleaned.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const data = JSON.parse(jsonStr);
                const text = data.choices?.[0]?.delta?.content || "";
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8" }
  });
}

function makeMockResponse(messages: any[], difficulty: string, action?: string) {
  const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
  let responseText = "";

  const nonBiologyKeywords = ["code", "python", "javascript", "react", "programming", "math", "history", "geography", "politic", "movie", "song"];
  const isNonBiology = nonBiologyKeywords.some(keyword => userMessage.includes(keyword));

  if (isNonBiology) {
    responseText = `I am strictly a Biology Mentor. I apologize, but I cannot assist with non-biological subjects like programming, mathematics, or general history.

Please ask me a biology question, such as:
- *How does cellular respiration produce energy?*
- *Can you explain DNA replication?*
- *What is the difference between prokaryotic and eukaryotic cells?*`;
  } else if (action === "viva_grade") {
    responseText = `Fascinating answer! You have correctly identified the core biological mechanism involved in this virtual practical module.

SCORE: 9/10`;
  } else if (userMessage.includes("myelin") || userMessage.includes("transcription") || userMessage.includes("spindle") || userMessage.includes("codon") || userMessage.includes("phase") || userMessage.includes("predict")) {
    responseText = `### 🧬 Simulation Phase Overview
This milestone visualizes a key cellular process. We can adjust variables to see how structures respond in real-time.

### 🔬 Molecular Mechanisms
- **Depolarization**: Myelin sheaths act as electrical insulators, forcing the action potential to jump from node to node (saltatory conduction) which increases speed up to 120 m/s.
- **DNA Transcription**: RNA Polymerase matches Uracil (U) to Adenine (A) templates inside the nucleus.
- **Spindle Checkpoint**: Colchicine binds to tubulin dimers, halting spindle fiber assembly and arresting division at metaphase.

### ⚠️ Common Student Misconceptions
- Thinking translation occurs in the nucleus (it occurs in cytoplasm ribosomes).
- Believing the myelin sheath covers the entire axon continuously (nodes of Ranvier are left exposed).

### ❓ Active Inquiry Prompt
What would happen if we disabled proofreading in DNA Polymerase? How would it affect cell mutation rates?`;
  } else if (userMessage.includes("mistake") || userMessage.includes("stuck") || userMessage.includes("explain")) {
    responseText = `### 🔬 Practical Lab Insight
We want to keep inputs optimized. Remember that enzymes operate only within precise limits and chloroplasts require active light.

### 💡 Biological Explanation
- **Temperature Denaturation**: Above 60°C, high thermal energy breaks the weak hydrogen bonds holding Catalase's tertiary structure, permanently unfolding its active site.
- **Limiting Factors**: Under low light or zero CO2 drops, photosynthesis rates fall to zero because photolysis cannot proceed without light absorption or rubisco substrate.
- **Tonicity Gaps**: Extracellular salt changes the direction of osmosis. High salt causes shriveling (plasmolysis).

### ⚠️ Common Pitfalls
- Assuming plants do not photosynthesize in green light (they reflect it).
- Using coarse focus under high magnification (risks cracking slide).

### ❓ Next Steps Guidance
Try resetting the controls, ensuring pH is 7 and Temperature is 37°C for enzyme trials!`;
  } else if (action === "quiz" || userMessage.includes("quiz") || userMessage.includes("test")) {
    responseText = `\`\`\`json
{
  "quiz": [
    {
      "question": "Which organelle is responsible for synthesizing proteins?",
      "options": ["Mitochondria", "Ribosome", "Lysosome", "Golgi Apparatus"],
      "answerIndex": 1,
      "explanation": "Ribosomes are the cellular structures responsible for protein synthesis by translating genetic codes into amino acid chains."
    },
    {
      "question": "What is the main compound that cells use for storing energy?",
      "options": ["Glucose", "DNA", "ATP", "Lipids"],
      "answerIndex": 2,
      "explanation": "Adenosine Triphosphate (ATP) is the primary energy currency of the cell, storing energy in its high-energy phosphate bonds."
    }
  ]
}
\`\`\``;
  } else if (action === "flashcards") {
    responseText = `\`\`\`json
{
  "flashcards": [
    {
      "front": "Mitochondria",
      "back": "The powerhouse of the cell, generating ATP through oxidative phosphorylation.",
      "hint": "Cellular energy"
    },
    {
      "front": "Nucleus",
      "back": "The organelle containing genetic chromatin structures and directing transcription.",
      "hint": "Control center"
    }
  ]
}
\`\`\``;
  } else if (action === "summary" || action === "notes" || userMessage.includes("respiration") || userMessage.includes("atp")) {
    responseText = `### 💡 Simple Explanation
Think of Cellular Respiration like a power plant. The cell takes in glucose (fuel) and oxygen (air), processes it inside the mitochondria, and outputs ATP (batteries) to power all cellular tools.

### 🔬 Scientific Explanation (Level: ${difficulty})
Cellular respiration breaks down glucose in the presence of oxygen. It occurs in three major steps:
1. **Glycolysis**: Cytosolic pathway converting glucose into pyruvate, yielding 2 ATP and 2 NADH.
2. **Krebs Cycle**: Mitochondrial matrix cycle producing carbon dioxide and energy carriers.
3. **Electron Transport Chain (ETC)**:cristae membrane flow generating 32-34 ATP via ATP Synthase motors.

\`\`\`mermaid
graph TD
  A[Glucose] -->|Glycolysis| B[Pyruvate]
  B -->|Krebs Cycle| C[CO2 + Charged Carriers]
  C -->|Electron Transport Chain| D[ATP + H2O]
  style D fill:#39FF14,stroke:#00D4AA,stroke-width:2px
\`\`\`

### 🔑 Key Terms
- **ATP**: Adenosine Triphosphate, the main energy currency.
- **Glycolysis**: Soluble breakdown of sugar.

### 💡 Interesting Facts
- Your body turns over its own weight in ATP every single day!

### ⚠️ Common Mistakes
- Thinking plants only perform photosynthesis. Plants actually perform respiration too, using mitochondria to break down sugars at night!

### 🧭 Recommended Path
- **Related Lessons**: [Cell Introduction](/learning-paths/cell-biology)
- **3D Model**: [Mitochondria Model]
- **Simulation**: [Membrane Transport]
- **Quiz**: [Respiration Challenge]

[ACTION: zoom mitochondria]
`;
  } else {
    responseText = `### 💡 Simple Explanation
Welcome! I am your personal Context-Aware Biology Mentor. I sync with whatever page or organ structure you are currently viewing to guide your studies!

### 🔬 Scientific Explanation (Level: ${difficulty})
BioSphere compiles custom pathways. I can explain genetic transcripts, physiological structures, and disease pathologies.

### 🔑 Key Terms
- **Homeostasis**: Maintenance of steady internal states.

### 💡 Interesting Facts
- We share 60% of our DNA layout with bananas!

### 🧭 Recommended Path
- **Related Lessons**: [Evolutionary Path](/tree-of-life)
- **3D Model**: [Human Anatomy]

### ❓ Ask Another Question
What biology concept would you like to investigate next? Or click the action cards to generate custom flashcards!
`;
  }

  // Stream the mock text
  const encoder = new TextEncoder();
  const words = responseText.split(" ");
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i === words.length - 1 ? "" : " ");
        controller.enqueue(encoder.encode(word));
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
