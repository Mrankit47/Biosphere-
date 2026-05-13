"use client";

import { useState, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

// Mode 1 — Label the Cell
interface LabelSpot { id: string; label: string; x: number; y: number; lineX: number; lineY: number }
const LABELS: LabelSpot[] = [
  { id: "membrane", label: "Membrane", x: 440, y: 60, lineX: 400, lineY: 120 },
  { id: "nucleus", label: "Nucleus", x: 70, y: 160, lineX: 200, lineY: 200 },
  { id: "mitochondria", label: "Mitochondria", x: 70, y: 280, lineX: 180, lineY: 280 },
  { id: "ribosome", label: "Ribosome", x: 440, y: 310, lineX: 340, lineY: 270 },
  { id: "golgi", label: "Golgi Body", x: 440, y: 180, lineX: 350, lineY: 180 },
  { id: "er", label: "ER", x: 70, y: 360, lineX: 230, lineY: 320 },
];

// Mode 2 — MCQ
interface MCQ { q: string; options: string[]; answer: number; category: string }
const MCQS: MCQ[] = [
  // Cell Explorer & Genetics
  { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], answer: 1, category: "cells" },
  { q: "DNA stands for?", options: ["Deoxyribonucleic Acid", "Deoxyribonitric Acid", "Double Nucleic Acid", "None"], answer: 0, category: "cells" },
  { q: "Which organelle makes proteins?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], answer: 2, category: "cells" },
  { q: "How many base pairs in human DNA?", options: ["3 billion", "1 million", "500,000", "10 billion"], answer: 0, category: "cells" },
  { q: "Cell membrane is made of?", options: ["Proteins only", "Phospholipid bilayer", "Carbohydrates", "DNA"], answer: 1, category: "cells" },
  { q: "What structure organizes cell division?", options: ["Centrosome", "Lysosome", "Vacuole", "Smooth ER"], answer: 0, category: "cells" },

  // Microorganisms
  { q: "Volvox belongs to which group?", options: ["Bacteria", "Fungi", "Green Algae", "Protozoa"], answer: 2, category: "microbes" },
  { q: "Archaea usually live in?", options: ["Normal soil", "Extreme environments", "Fresh water", "Air"], answer: 1, category: "microbes" },
  { q: "Fungi cell walls are made of?", options: ["Cellulose", "Chitin", "Peptidoglycan", "Lignin"], answer: 1, category: "microbes" },
  { q: "E.coli is an example of a?", options: ["Virus", "Fungi", "Bacterium", "Protozoa"], answer: 2, category: "microbes" },
  { q: "Which microorganism is known as a 'water bear'?", options: ["Amoeba", "Tardigrade", "Paramecium", "Rotifer"], answer: 1, category: "microbes" },
  { q: "How does an Amoeba move?", options: ["Flagella", "Cilia", "Pseudopods", "Gliding"], answer: 2, category: "microbes" },
  { q: "Stentor is shaped like a?", options: ["Sphere", "Trumpet", "Rod", "Spiral"], answer: 1, category: "microbes" },
  { q: "Penicillium is famous for producing?", options: ["Antibiotics", "Insulin", "Alcohol", "Vitamins"], answer: 0, category: "microbes" },

  // Viruses
  { q: "Which virus causes COVID-19?", options: ["SARS-CoV-2", "H1N1", "Ebola", "HIV"], answer: 0, category: "viruses" },
  { q: "What type of virus is HIV?", options: ["Adenovirus", "Retrovirus", "Filovirus", "Coronavirus"], answer: 1, category: "viruses" },
  { q: "Ebola is known for its high ___?", options: ["Contagiousness", "Mutation rate", "Mortality rate", "Incubation period"], answer: 2, category: "viruses" },
  { q: "What helps SARS-CoV-2 attach to cells?", options: ["Cilia", "Capsid", "Protein Spikes", "Tail fibers"], answer: 2, category: "viruses" },
  { q: "Bacteriophages infect which organisms?", options: ["Animals", "Plants", "Bacteria", "Fungi"], answer: 2, category: "viruses" },
  { q: "Adenoviruses typically cause?", options: ["Flu", "Common Cold", "Malaria", "Polio"], answer: 1, category: "viruses" },

  // Human Body
  { q: "The brain contains roughly how many neurons?", options: ["1 billion", "10 billion", "86 billion", "1 trillion"], answer: 2, category: "anatomy" },
  { q: "How many times does the human heart beat per day?", options: ["10,000", "50,000", "100,000", "250,000"], answer: 2, category: "anatomy" },
  { q: "Which organ can completely regenerate from just 25%?", options: ["Lungs", "Liver", "Kidneys", "Brain"], answer: 1, category: "anatomy" },
  { q: "Your stomach lining completely renews every ___?", options: ["3-4 days", "1 week", "1 month", "1 year"], answer: 0, category: "anatomy" },
  { q: "How many lobes does the right lung have?", options: ["1", "2", "3", "4"], answer: 2, category: "anatomy" },
  { q: "The small intestine has a surface area equivalent to a?", options: ["Ping pong table", "Tennis court", "Football field", "Basketball court"], answer: 1, category: "anatomy" },
  { q: "Your kidneys filter about ___ liters of blood every day?", options: ["50", "100", "180", "500"], answer: 2, category: "anatomy" },
];

// Mode 3 — Fill the Blank
interface FTB { sentence: string; blank: string; answer: string; category: string }
const FTBS: FTB[] = [
  { sentence: "The ___ is the control center of the cell.", blank: "___", answer: "nucleus", category: "cells" },
  { sentence: "Plants make food through a process called ___.", blank: "___", answer: "photosynthesis", category: "cells" },
  { sentence: "DNA is shaped like a double ___.", blank: "___", answer: "helix", category: "cells" },
  { sentence: "Mitochondria produce ___ for the cell.", blank: "___", answer: "energy", category: "cells" },
  { sentence: "Fungi cell walls are made of ___.", blank: "___", answer: "chitin", category: "microbes" },
  { sentence: "The human heart pumps ___ liters of blood per day.", blank: "___", answer: "7500", category: "anatomy" },
  { sentence: "The ___ can completely regenerate itself.", blank: "___", answer: "liver", category: "anatomy" },
  { sentence: "Tardigrades can survive extreme conditions in a state called ___.", blank: "___", answer: "cryptobiosis", category: "microbes" },
  { sentence: "HIV is a type of ___virus.", blank: "___", answer: "retro", category: "viruses" },
  { sentence: "SARS-CoV-2 uses ___ proteins to enter human cells.", blank: "___", answer: "spike", category: "viruses" },
  { sentence: "The right lung has ___ lobes.", blank: "___", answer: "three", category: "anatomy" },
  { sentence: "Amoebas move using false feet called ___.", blank: "___", answer: "pseudopods", category: "microbes" },
  { sentence: "The ___ intestine absorbs most of the nutrients from food.", blank: "___", answer: "small", category: "anatomy" },
  { sentence: "___phages are viruses that infect bacteria.", blank: "___", answer: "bacterio", category: "viruses" },
];

type Mode = "label" | "mcq" | "ftb";

/* ═══════════════════════════════════════════════════════════════
   MODE 1 — LABEL THE CELL
   ═══════════════════════════════════════════════════════════════ */

function LabelMode() {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const available = LABELS.filter(l => !Object.values(placed).includes(l.label));
  const score = Object.values(results).filter(Boolean).length;
  const done = Object.keys(results).length === 6;

  const handleDrop = useCallback((spotId: string) => {
    if (!dragging) return;
    const spot = LABELS.find(l => l.id === spotId);
    if (!spot) return;
    const correct = spot.label === dragging;
    setPlaced(p => ({ ...p, [spotId]: dragging }));
    setResults(r => ({ ...r, [spotId]: correct }));
    setDragging(null);
  }, [dragging]);

  const reset = () => { setPlaced({}); setResults({}); setDragging(null); };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* Cell SVG */}
      <svg viewBox="0 0 500 420" style={{ width: "100%", maxWidth: 520, height: "auto" }}>
        {/* Cell body */}
        <ellipse cx={260} cy={210} rx={160} ry={160} fill="none" stroke="#39FF14" strokeWidth={2} opacity={0.3} />
        <ellipse cx={260} cy={210} rx={162} ry={162} fill="none" stroke="#39FF14" strokeWidth={0.5} opacity={0.15} strokeDasharray="4 4" />
        {/* Nucleus */}
        <circle cx={230} cy={200} r={50} fill="#378ADD20" stroke="#378ADD" strokeWidth={1.5} />
        <circle cx={230} cy={200} r={15} fill="#378ADD40" stroke="#378ADD" strokeWidth={1} />
        {/* Mitochondria */}
        <ellipse cx={160} cy={280} rx={30} ry={14} fill="#1D9E7530" stroke="#1D9E75" strokeWidth={1.5} transform="rotate(-20 160 280)" />
        {/* Ribosomes */}
        {[[310, 250], [330, 270], [320, 290], [350, 260], [300, 280]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} fill="#ffffff40" stroke="#fff" strokeWidth={0.5} />
        ))}
        {/* Golgi */}
        {[0, 8, 16].map((o, i) => (
          <ellipse key={i} cx={340} cy={170 + o} rx={25} ry={5} fill="none" stroke="#D4A017" strokeWidth={1.2} opacity={0.6} />
        ))}
        {/* ER */}
        <path d="M 200 280 Q 220 300 240 290 Q 260 280 270 300 Q 280 320 260 330" fill="none" stroke="#9B59B6" strokeWidth={1.5} opacity={0.5} />

        {/* Drop zones + labels */}
        {LABELS.map(spot => {
          const isPlaced = placed[spot.id];
          const isCorrect = results[spot.id];
          return (
            <g key={spot.id}>
              <line x1={spot.x > 250 ? spot.x - 10 : spot.x + 70} y1={spot.y + 10} x2={spot.lineX} y2={spot.lineY} stroke="rgba(57,255,20,0.2)" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={spot.lineX} cy={spot.lineY} r={5} fill="rgba(57,255,20,0.2)" stroke="#39FF14" strokeWidth={1} />
              <rect
                x={spot.x - 5} y={spot.y - 8} width={100} height={32} rx={6}
                fill={isPlaced ? (isCorrect ? "rgba(57,255,20,0.12)" : "rgba(226,75,74,0.12)") : dragging ? "rgba(57,255,20,0.06)" : "rgba(255,255,255,0.03)"}
                stroke={isPlaced ? (isCorrect ? "#39FF14" : "#E24B4A") : "rgba(255,255,255,0.1)"}
                strokeWidth={1.2}
                style={{ cursor: dragging ? "pointer" : "pointer" }}
                onClick={() => handleDrop(spot.id)}
              />
              {isPlaced ? (
                <text x={spot.x + 45} y={spot.y + 13} textAnchor="middle" fill={isCorrect ? "#39FF14" : "#E24B4A"} fontSize={12} fontFamily="system-ui" fontWeight={600} pointerEvents="none">
                  {isCorrect ? "+" : "x"} {placed[spot.id]}
                </text>
              ) : (
                <text x={spot.x + 45} y={spot.y + 13} textAnchor="middle" fill="rgba(200,245,200,0.4)" fontSize={12} fontFamily="system-ui" fontWeight={600} pointerEvents="none">Click to label</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Draggable chips */}
      {!done && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {available.map(l => (
            <button
              key={l.label}
              onClick={() => setDragging(dragging === l.label ? null : l.label)}
              style={{ ...S.chip, borderColor: dragging === l.label ? "#39FF14" : "rgba(255,255,255,0.1)", background: dragging === l.label ? "rgba(57,255,20,0.1)" : "rgba(5,10,5,0.6)" }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
      {dragging && <p style={{ color: "rgba(57,255,20,0.5)", fontSize: "0.75rem", margin: 0 }}>Now click the correct drop zone</p>}

      {/* Score */}
      {done && (
        <div style={S.scoreBox}>
          <span style={{ fontSize: "2rem" }}>{score === 6 ? "🎉" : score >= 4 ? "👍" : "📚"}</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#39FF14" }}>{score}/6</span>
          <p style={{ color: "rgba(200,245,200,0.6)", fontSize: "0.82rem", margin: 0 }}>{score === 6 ? "Perfect!" : score >= 4 ? "Great job!" : "Keep studying!"}</p>
          <button onClick={reset} style={S.retryBtn}>Try Again</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODE 2 — QUICK FIRE MCQ
   ═══════════════════════════════════════════════════════════════ */

function McqMode({ topic }: { topic: string }) {
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [showResult, setShowResult] = useState(false);

  // Initialize random pool of 10 questions on mount or topic change
  useEffect(() => {
    const filtered = topic === "all" ? MCQS : MCQS.filter(q => q.category === topic);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrent(0); setSelected(null); setScore(0); setAnswers(Array(10).fill(null)); setShowResult(false);
  }, [topic]);

  if (questions.length === 0) return (
    <div style={{ textAlign: "center", padding: 40, color: "rgba(200,245,200,0.5)" }}>
      No questions available for this topic.
    </div>
  );

  const q = questions[current];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const newAnswers = [...answers];
    newAnswers[current] = i;
    setAnswers(newAnswers);
    if (i === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (current < 9) { setCurrent(c => c + 1); setSelected(null); }
      else setShowResult(true);
    }, 800);
  };

  const reset = () => { 
    const filtered = topic === "all" ? MCQS : MCQS.filter(q => q.category === topic);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrent(0); setSelected(null); setScore(0); setAnswers(Array(10).fill(null)); setShowResult(false); 
  };

  if (showResult) {
    const emoji = score >= 9 ? "🏆" : score >= 7 ? "🎉" : score >= 5 ? "👍" : "📚";
    return (
      <div style={{ ...S.scoreBox, maxWidth: 400 }}>
        <span style={{ fontSize: "3rem" }}>{emoji}</span>
        <span style={{ fontSize: "2rem", fontWeight: 700, color: "#39FF14" }}>{score}/10</span>
        <p style={{ color: "rgba(200,245,200,0.6)", fontSize: "0.9rem", margin: 0 }}>
          {score >= 9 ? "Biology genius!" : score >= 7 ? "Great knowledge!" : score >= 5 ? "Good effort!" : "Keep exploring BioSphere!"}
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={reset} style={S.retryBtn}>Play Again</button>
          <button onClick={() => { navigator.clipboard?.writeText(`I scored ${score}/10 on BioSphere Quiz! 🧬`); }} style={{ ...S.retryBtn, background: "rgba(55,138,221,0.15)", borderColor: "#378ADD", color: "#5AAFFF" }}>
            Share Score
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 550, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? (answers[i] === questions[i].answer ? "#39FF14" : "#E24B4A") : i === current ? "rgba(57,255,20,0.3)" : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />
        ))}
      </div>
      <p style={{ color: "rgba(200,245,200,0.4)", fontSize: "0.72rem", margin: "0 0 8px", letterSpacing: "0.1em" }}>QUESTION {current + 1} OF 10</p>
      <h3 style={{ color: "#C8F5C8", fontSize: "1.1rem", fontWeight: 600, margin: "0 0 20px", lineHeight: 1.5 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.answer;
          const showFeedback = selected !== null;
          let bg = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.08)";
          let color = "rgba(200,245,200,0.8)";
          if (showFeedback && isCorrect) { bg = "rgba(57,255,20,0.1)"; border = "#39FF14"; color = "#39FF14"; }
          else if (showFeedback && isSelected && !isCorrect) { bg = "rgba(226,75,74,0.1)"; border = "#E24B4A"; color = "#E24B4A"; }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{ ...S.optBtn, background: bg, borderColor: border, color, opacity: showFeedback && !isCorrect && !isSelected ? 0.4 : 1 }}>
              <span style={{ ...S.optLetter, borderColor: border, color }}>{String.fromCharCode(65 + i)}</span>
              {opt}
              {showFeedback && isCorrect && <span style={{ marginLeft: "auto", fontSize: "1rem" }}>&#10003;</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{ marginLeft: "auto", fontSize: "1rem" }}>&#10007;</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODE 3 — FILL THE BLANK
   ═══════════════════════════════════════════════════════════════ */

function FtbMode({ topic }: { topic: string }) {
  const [questions, setQuestions] = useState<FTB[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const filtered = topic === "all" ? FTBS : FTBS.filter(q => q.category === topic);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrent(0); setInput(""); setResults([]); setShowAnswer(false);
  }, [topic]);

  if (questions.length === 0) return (
    <div style={{ textAlign: "center", padding: 40, color: "rgba(200,245,200,0.5)" }}>
      No fill-in-the-blank questions available for this topic.
    </div>
  );

  const done = results.length === questions.length;
  const score = results.filter(Boolean).length;

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = input.trim().toLowerCase() === questions[current].answer.toLowerCase();
    setResults(r => [...r, correct]);
    setShowAnswer(true);
    setTimeout(() => {
      if (current < questions.length - 1) { setCurrent(c => c + 1); setInput(""); setShowAnswer(false); }
    }, 1200);
  };

  const reset = () => { 
    const filtered = topic === "all" ? FTBS : FTBS.filter(q => q.category === topic);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setCurrent(0); setInput(""); setResults([]); setShowAnswer(false); 
  };

  if (done) {
    return (
      <div style={S.scoreBox}>
        <span style={{ fontSize: "2.5rem" }}>{score === 5 ? "🏆" : score >= 3 ? "🎉" : "📚"}</span>
        <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#39FF14" }}>{score}/{questions.length}</span>
        <p style={{ color: "rgba(200,245,200,0.6)", fontSize: "0.85rem", margin: 0 }}>{score === 5 ? "Flawless!" : score >= 3 ? "Well done!" : "Review and retry!"}</p>
        <button onClick={reset} style={S.retryBtn}>Try Again</button>
      </div>
    );
  }

  const fb = questions[current];
  const parts = fb.sentence.split(fb.blank);

  return (
    <div style={{ maxWidth: 550, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < results.length ? (results[i] ? "#39FF14" : "#E24B4A") : i === current ? "rgba(57,255,20,0.3)" : "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
      <p style={{ color: "rgba(200,245,200,0.4)", fontSize: "0.72rem", margin: "0 0 8px", letterSpacing: "0.1em" }}>SENTENCE {current + 1} OF {questions.length}</p>
      <div style={{ fontSize: "1.1rem", color: "#C8F5C8", lineHeight: 1.8, margin: "0 0 20px" }}>
        {parts[0]}
        <span style={{ display: "inline-block", minWidth: 100, borderBottom: "2px solid #39FF14", color: showAnswer ? (results[current] ? "#39FF14" : "#E24B4A") : "#39FF14", fontWeight: 700, padding: "0 4px", textAlign: "center" }}>
          {showAnswer ? fb.answer : input || "___"}
        </span>
        {parts[1]}
      </div>

      {!showAnswer && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Type your answer..."
            style={S.textInput}
            autoFocus
          />
          <button onClick={handleSubmit} style={S.submitBtn} disabled={!input.trim()}>Check</button>
        </div>
      )}

      {showAnswer && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: results[results.length - 1] ? "rgba(57,255,20,0.08)" : "rgba(226,75,74,0.08)", border: `1px solid ${results[results.length - 1] ? "rgba(57,255,20,0.2)" : "rgba(226,75,74,0.2)"}`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1.2rem" }}>{results[results.length - 1] ? "\u2713" : "\u2717"}</span>
          <span style={{ color: results[results.length - 1] ? "#39FF14" : "#E24B4A", fontSize: "0.85rem" }}>
            {results[results.length - 1] ? "Correct!" : `Answer: ${fb.answer}`}
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

const TABS: { id: Mode; label: string; emoji: string }[] = [
  { id: "label", label: "Label the Cell", emoji: "🔬" },
  { id: "mcq", label: "Quick Fire", emoji: "⚡" },
  { id: "ftb", label: "Fill the Blank", emoji: "✏️" },
];

const TOPICS = [
  { id: "all", label: "All Topics" },
  { id: "cells", label: "Cell Biology" },
  { id: "microbes", label: "Microbes" },
  { id: "viruses", label: "Viruses" },
  { id: "anatomy", label: "Human Body" }
];

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>("mcq");
  const [topic, setTopic] = useState<string>("all");

  return (
    <div style={S.root}>
      <div style={S.header}>
        <h1 style={S.title}>Biology Quiz</h1>
        <p style={S.subtitle}>Test your knowledge</p>
      </div>

      {/* Mode tabs */}
      <div style={S.tabs}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setMode(t.id)} style={{ ...S.tab, borderColor: mode === t.id ? "#39FF14" : "rgba(255,255,255,0.06)", background: mode === t.id ? "rgba(57,255,20,0.08)" : "rgba(5,10,5,0.5)", color: mode === t.id ? "#39FF14" : "rgba(200,245,200,0.5)" }}>
            <span>{t.emoji}</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Topic selector (only for MCQ and FTB) */}
      {mode !== "label" && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {TOPICS.map(t => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              style={{
                ...S.chip,
                borderColor: topic === t.id ? "#378ADD" : "rgba(255,255,255,0.06)",
                background: topic === t.id ? "rgba(55,138,221,0.15)" : "rgba(5,10,5,0.5)",
                color: topic === t.id ? "#5AAFFF" : "rgba(200,245,200,0.5)",
                fontSize: "0.75rem",
                padding: "6px 12px"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={S.content}>
        {mode === "label" && <LabelMode />}
        {mode === "mcq" && <McqMode topic={topic} />}
        {mode === "ftb" && <FtbMode topic={topic} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */

const S: Record<string, React.CSSProperties> = {
  root: { width: "100%", minHeight: "calc(100vh - 64px)", background: "#050A05", padding: "24px clamp(16px,4vw,40px) 60px", boxSizing: "border-box" },
  header: { textAlign: "center", marginBottom: 20 },
  title: { fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 800, color: "#39FF14", letterSpacing: "0.06em", margin: 0, textShadow: "0 0 20px rgba(57,255,20,0.3)" },
  subtitle: { fontSize: "clamp(0.7rem, 2vw, 0.85rem)", color: "rgba(200,245,200,0.45)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  tabs: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 32, flexWrap: "wrap" as const },
  tab: { display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, border: "1px solid", cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s ease", backdropFilter: "blur(6px)" },

  content: { maxWidth: 700, margin: "0 auto", width: "100%" },

  chip: { padding: "8px 16px", borderRadius: 10, border: "1px solid", color: "#C8F5C8", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" },

  scoreBox: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, padding: "32px 24px", borderRadius: 16, background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.1)", width: "100%", boxSizing: "border-box" },
  retryBtn: { padding: "12px 28px", borderRadius: 10, border: "1.5px solid #39FF14", background: "rgba(57,255,20,0.08)", color: "#39FF14", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 },

  optBtn: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, border: "1px solid", cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 500, transition: "all 0.25s ease", textAlign: "left" as const, minHeight: 56 },
  optLetter: { width: 32, height: 32, borderRadius: 8, border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 },

  textInput: { flex: 1, padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(57,255,20,0.15)", background: "rgba(5,10,5,0.6)", color: "#C8F5C8", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", minWidth: 0 },
  submitBtn: { padding: "14px 24px", borderRadius: 10, border: "1.5px solid #39FF14", background: "rgba(57,255,20,0.1)", color: "#39FF14", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};
