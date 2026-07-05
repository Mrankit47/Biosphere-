import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION = `You are a specialized AI Biology Tutor for the BioSphere application.
Your name is BioTutor. You are ONLY allowed to answer questions related to biology (e.g., cells, genetics, human anatomy, microbiology, viruses, ecology, botany, zoology, biochemistry).
If the user asks about any other topic (such as programming, math, history, general advice, politics, etc.), you must politely decline to answer, explaining that your programming is strictly limited to biology, and suggest they ask a biology-related question instead.

Formatting Rules:
1. Render headings, lists, bold text using standard Markdown.
2. If explaining a process, cycle, or structure that can be visualised as a diagram, write a Mermaid.js flowchart inside a code block marked with "mermaid".
   Example:
   \`\`\`mermaid
   graph TD
   A[Cell] --> B[Nucleus]
   \`\`\`
3. If the user asks for a quiz, OR if you believe a quiz would help consolidate their learning, generate a multiple-choice quiz.
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
   Do NOT add any other conversational text inside that code block besides the JSON object.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "";
    const groqKey = process.env.GROQ_API_KEY || "";

    // Tier 1: Try Gemini API first (First preference)
    if (apiKey) {
      try {
        console.log("Attempting Gemini API call...");
        return await callGeminiAPI(messages, apiKey);
      } catch (geminiError: any) {
        console.warn("Gemini call failed (rate limit or token issue). Fallback path active. Error:", geminiError.message || geminiError);
        
        // If Gemini fails, immediately try Groq fallback if key exists
        if (groqKey) {
          try {
            console.log("Gemini failed. Falling back to Groq API...");
            return await callGroqAPI(messages, groqKey);
          } catch (groqError: any) {
            console.warn("Groq fallback also failed. Falling back to offline mock database. Error:", groqError.message || groqError);
            return makeMockResponse(messages);
          }
        } else {
          // If no Groq fallback, fall back to offline mock database so the user experience is never broken
          console.warn("No Groq key available. Falling back to offline mock database.");
          return makeMockResponse(messages);
        }
      }
    }

    // Tier 2: If Gemini key is not set, but Groq key is set, call Groq directly
    if (groqKey) {
      try {
        console.log("Attempting Groq API call directly...");
        return await callGroqAPI(messages, groqKey);
      } catch (groqError: any) {
        console.warn("Groq call failed. Falling back to offline mock database. Error:", groqError.message || groqError);
        return makeMockResponse(messages);
      }
    }

    // Tier 3: If no API keys are present, call the local mock database directly
    console.log("No API keys found. Accessing offline mock biology database...");
    return makeMockResponse(messages);

  } catch (error: any) {
    console.error("General routing error:", error);
    // Absolute safety fallback: always return a mock stream rather than crashing with 500
    try {
      const { messages } = await req.json();
      return makeMockResponse(messages);
    } catch {
      return makeMockResponse([]);
    }
  }
}

// ── Helper API Functions ──────────────────────────────────────────

async function callGeminiAPI(messages: any[], apiKey: string) {
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
          parts: [{ text: SYSTEM_INSTRUCTION }]
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
                // Ignore parsing errors of partial JSON chunks
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

async function callGroqAPI(messages: any[], groqKey: string) {
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
          { role: "system", content: SYSTEM_INSTRUCTION },
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
                // Ignore parsing errors of partial JSON chunks
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

function makeMockResponse(messages: any[]) {
  const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
  let responseText = "";

  const nonBiologyKeywords = ["code", "python", "javascript", "react", "programming", "math", "history", "geography", "politic", "movie", "song"];
  const isNonBiology = nonBiologyKeywords.some(keyword => userMessage.includes(keyword));

  if (isNonBiology) {
    responseText = `I am strictly a Biology Tutor. I apologize, but I cannot assist with non-biological subjects like programming, mathematics, or general history.

Please ask me a biology question, such as:
- *How does cellular respiration produce energy?*
- *Can you explain DNA replication?*
- *What is the difference between prokaryotic and eukaryotic cells?*`;
  } else if (userMessage.includes("quiz") || userMessage.includes("test")) {
    responseText = `Certainly! Let's test your knowledge on cell biology with this short quiz. 

Answer the questions below to see how well you understand cell structures:

\`\`\`json
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
  } else if (userMessage.includes("respiration") || userMessage.includes("atp")) {
    responseText = `### Cellular Respiration & ATP Production

Cellular respiration is the process by which cells break down glucose and oxygen to produce energy in the form of **Adenosine Triphosphate (ATP)**, water, and carbon dioxide.

It occurs in three primary stages:
1. **Glycolysis** (takes place in the cytosol, breaks glucose into pyruvate).
2. **The Krebs Cycle / Citric Acid Cycle** (occurs in the mitochondrial matrix, releases carbon dioxide and charges energy carriers).
3. **The Electron Transport Chain (ETC)** (located on the mitochondrial cristae, produces the bulk of ATP via oxidative phosphorylation).

Here is a visual map of the energy pathway:

\`\`\`mermaid
graph TD
  A[Glucose] -->|Glycolysis| B[Pyruvate]
  B -->|Krebs Cycle| C[CO2 + Charged Carriers]
  C -->|Electron Transport Chain| D[ATP + H2O]
\`\`\`

Would you like to test your understanding of cellular respiration? Simply ask me for a **respiration quiz**!`;
  } else if (userMessage.includes("dna") || userMessage.includes("helix") || userMessage.includes("genetics")) {
    responseText = `### The DNA Double Helix

**Deoxyribonucleic Acid (DNA)** is the double-stranded molecule that encodes the genetic instructions for all living organisms.

#### Molecular Structure
- **Sugar-Phosphate Backbones**: The outer rails of the DNA ladder, held together by strong covalent bonds.
- **Nitrogenous Rungs**: The ladder rungs, formed by base pairs held together by weak hydrogen bonds.
  - **Adenine (A)** pairs only with **Thymine (T)** (2 hydrogen bonds).
  - **Guanine (G)** pairs only with **Cytosine (C)** (3 hydrogen bonds).

Here is a simplified flowchart of how DNA transcription translates into traits:

\`\`\`mermaid
graph LR
  DNA -->|Transcription| mRNA
  mRNA -->|Translation| Protein
  Protein -->|Folds| Trait[Physical Trait]
\`\`\`

Would you like to take a **DNA quiz** to test your knowledge?`;
  } else if (userMessage.includes("virus") || userMessage.includes("capsid")) {
    responseText = `### The Architecture of Viruses

A **virus** is a small infectious agent that replicates only inside the living cells of an organism. They lack cellular structures and are not considered fully alive.

#### Viral Structures
- **Capsid**: The outer protein shell protecting the viral genome. It is composed of protein subunits called protomers.
- **Envelope**: A lipid bilayer membrane surrounding the capsid (in enveloped viruses like influenza or coronavirus), derived from host cell membranes and studded with viral glycoproteins (spikes).
- **Genetic Material**: Can be DNA or RNA, single-stranded or double-stranded.

Here is a diagram representing a simple bacteriophage virus structure:

\`\`\`mermaid
graph TD
  Head[Icosahedral Head: DNA] --> Collar[Collar]
  Collar --> Sheath[Helical Sheath]
  Sheath --> Baseplate[Baseplate]
  Baseplate --> Fibers[Tail Fibers: Receptor Keys]
\`\`\`

Would you like to test your understanding of virus structures? Just ask me for a **virus quiz**!`;
  } else if (userMessage.includes("human") || userMessage.includes("body") || userMessage.includes("anatomy") || userMessage.includes("organ")) {
    responseText = `### Human Anatomy & Physiological Systems

Human anatomy is the study of the structure of the human body, while physiology is the study of how these structures function together to maintain life.

#### Key Physiological Systems
1. **The Cardiovascular System**: The heart, blood vessels, and blood. It pumps oxygen and nutrients throughout the body.
2. **The Nervous System**: The brain, spinal cord, and nerves. It controls voluntary and involuntary actions.
3. **The Skeletal System**: 206 bones in adults that provide structure, protect organs, and support movement.

Here is a simplified flowchart of blood circulation through the heart:

\`\`\`mermaid
graph TD
  Body[Deoxygenated Blood from Body] --> RA[Right Atrium]
  RA --> RV[Right Ventricle]
  RV -->|Pulmonary Artery| Lungs[Lungs: Oxygenation]
  Lungs -->|Pulmonary Veins| LA[Left Atrium]
  LA --> LV[Left Ventricle]
  LV -->|Aorta| BodyOut[Oxygenated Blood to Body]
\`\`\`

Would you like to test your understanding of human anatomy? Ask me for an **anatomy quiz**!`;
  } else if (userMessage.includes("ecology") || userMessage.includes("ecosystem") || userMessage.includes("pyramid") || userMessage.includes("10%")) {
    responseText = `### Ecosystems & Trophic Pyramids

An ecosystem represents the interaction between living (biotic) organisms and non-living (abiotic) elements. Energy flows through ecosystems via food chains and webs.

#### The 10% Ecological Rule
When energy is transferred from one trophic level to the next, **only about 10% of the energy is stored as biomass** and made available to the next consumer level. The remaining 90% is lost as metabolic heat during respiration, motion, and decomposition.

Here is how energy flows up the trophic pyramid:

\`\`\`mermaid
graph TD
  A[Sunlight] --> B[Producers: 100% Energy]
  B --> C[Primary Consumers: 10% Energy]
  C --> D[Secondary Consumers: 1% Energy]
  D --> E[Tertiary Consumers: 0.1% Energy]
\`\`\`

Ask me for an **ecology quiz** if you'd like to test your knowledge!`;
  } else {
    const messageCount = messages.length;
    if (messageCount > 1) {
      responseText = `### Biology Insights: "${messages[messages.length - 1]?.content}"

I understand you are interested in this topic! As a mock biology tutor (running because no \`GEMINI_API_KEY\` or \`GROQ_API_KEY\` is active in your \`.env\` file yet, or requests rate-limited), I have pre-programmed interactive lessons for:
- **Cellular Respiration & ATP** (try typing "respiration" or "atp")
- **Genetics & DNA structure** (try typing "dna" or "helix")
- **Ecosystems & Trophic Pyramids** (try typing "ecology" or "pyramid")
- **Microorganisms & Viruses** (try typing "virus" or "capsid")

To unlock live, open-ended tutoring on **any** biological question (like photosynthesis, protein folding, cell division, etc.), please set up your API keys in the \`.env\` file.`;
    } else {
      responseText = `### Welcome to BioTutor! 🔬

I am your personal AI Biology Tutor. I can explain complex biological processes, render flowcharts, and compile custom quizzes.

What would you like to explore today?
- **Cell Biology**: Cellular respiration, organelles, membrane transport.
- **Genetics**: DNA double-helix, translation, replication.
- **Ecosystems**: Trophic levels, carbon cycle, food webs.
- **Microorganisms & Viruses**: Capsids, bacteria structures, viruses.

*Tip: You can ask me to "give me a quiz" at any time to test your learning!*`;
    }
  }

  // Stream the mock text to the client
  const encoder = new TextEncoder();
  const words = responseText.split(" ");
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i === words.length - 1 ? "" : " ");
        controller.enqueue(encoder.encode(word));
        // Simulate networking delays
        await new Promise(resolve => setTimeout(resolve, 25));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
