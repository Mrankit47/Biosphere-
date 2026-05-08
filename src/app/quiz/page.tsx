"use client";

import { useState, useCallback } from "react";

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
interface MCQ { q: string; options: string[]; answer: number }
const MCQS: MCQ[] = [
  { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], answer: 1 },
  { q: "DNA stands for?", options: ["Deoxyribonucleic Acid", "Deoxyribonitric Acid", "Double Nucleic Acid", "None"], answer: 0 },
  { q: "Which organelle makes proteins?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], answer: 2 },
  { q: "Photosynthesis happens in?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], answer: 2 },
  { q: "Volvox belongs to which group?", options: ["Bacteria", "Fungi", "Green Algae", "Protozoa"], answer: 2 },
  { q: "How many base pairs in human DNA?", options: ["3 billion", "1 million", "500,000", "10 billion"], answer: 0 },
  { q: "Cell membrane is made of?", options: ["Proteins only", "Phospholipid bilayer", "Carbohydrates", "DNA"], answer: 1 },
  { q: "Archaea live in?", options: ["Normal soil", "Extreme environments", "Fresh water", "Air"], answer: 1 },
  { q: "Fungi cell walls are made of?", options: ["Cellulose", "Chitin", "Peptidoglycan", "Lignin"], answer: 1 },
  { q: "E.coli is a?", options: ["Virus", "Fungi", "Bacterium", "Protozoa"], answer: 2 },
];

// Mode 3 — Fill the Blank
interface FTB { sentence: string; blank: string; answer: string }
const FTBS: FTB[] = [
  { sentence: "The ___ is the control center of the cell.", blank: "___", answer: "nucleus" },
  { sentence: "Plants make food through a process called ___.", blank: "___", answer: "photosynthesis" },
  { sentence: "DNA is shaped like a double ___.", blank: "___", answer: "helix" },
  { sentence: "Mitochondria produce ___ for the cell.", blank: "___", answer: "energy" },
  { sentence: "Fungi cell walls are made of ___.", blank: "___", answer: "chitin" },
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
                x={spot.x - 5} y={spot.y - 5} width={90} height={28} rx={6}
                fill={isPlaced ? (isCorrect ? "rgba(57,255,20,0.12)" : "rgba(226,75,74,0.12)") : dragging ? "rgba(57,255,20,0.06)" : "rgba(255,255,255,0.03)"}
                stroke={isPlaced ? (isCorrect ? "#39FF14" : "#E24B4A") : "rgba(255,255,255,0.1)"}
                strokeWidth={1.2}
                style={{ cursor: dragging ? "pointer" : "default" }}
                onClick={() => handleDrop(spot.id)}
              />
              {isPlaced ? (
                <text x={spot.x + 40} y={spot.y + 14} textAnchor="middle" fill={isCorrect ? "#39FF14" : "#E24B4A"} fontSize={11} fontFamily="system-ui" fontWeight={500}>
                  {isCorrect ? "+" : "x"} {placed[spot.id]}
                </text>
              ) : (
                <text x={spot.x + 40} y={spot.y + 14} textAnchor="middle" fill="rgba(200,245,200,0.25)" fontSize={10} fontFamily="system-ui">?</text>
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

function McqMode() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [showResult, setShowResult] = useState(false);

  const q = MCQS[current];

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

  const reset = () => { setCurrent(0); setSelected(null); setScore(0); setAnswers(Array(10).fill(null)); setShowResult(false); };

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
        {MCQS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? (answers[i] === MCQS[i].answer ? "#39FF14" : "#E24B4A") : i === current ? "rgba(57,255,20,0.3)" : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />
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

function FtbMode() {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const done = results.length === FTBS.length;
  const score = results.filter(Boolean).length;

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = input.trim().toLowerCase() === FTBS[current].answer.toLowerCase();
    setResults(r => [...r, correct]);
    setShowAnswer(true);
    setTimeout(() => {
      if (current < FTBS.length - 1) { setCurrent(c => c + 1); setInput(""); setShowAnswer(false); }
    }, 1200);
  };

  const reset = () => { setCurrent(0); setInput(""); setResults([]); setShowAnswer(false); };

  if (done) {
    return (
      <div style={S.scoreBox}>
        <span style={{ fontSize: "2.5rem" }}>{score === 5 ? "🏆" : score >= 3 ? "🎉" : "📚"}</span>
        <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#39FF14" }}>{score}/{FTBS.length}</span>
        <p style={{ color: "rgba(200,245,200,0.6)", fontSize: "0.85rem", margin: 0 }}>{score === 5 ? "Flawless!" : score >= 3 ? "Well done!" : "Review and retry!"}</p>
        <button onClick={reset} style={S.retryBtn}>Try Again</button>
      </div>
    );
  }

  const fb = FTBS[current];
  const parts = fb.sentence.split(fb.blank);

  return (
    <div style={{ maxWidth: 550, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {FTBS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < results.length ? (results[i] ? "#39FF14" : "#E24B4A") : i === current ? "rgba(57,255,20,0.3)" : "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
      <p style={{ color: "rgba(200,245,200,0.4)", fontSize: "0.72rem", margin: "0 0 8px", letterSpacing: "0.1em" }}>SENTENCE {current + 1} OF {FTBS.length}</p>
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

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>("mcq");

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

      {/* Content */}
      <div style={S.content}>
        {mode === "label" && <LabelMode />}
        {mode === "mcq" && <McqMode />}
        {mode === "ftb" && <FtbMode />}
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
  title: { fontSize: "1.4rem", fontWeight: 700, color: "#39FF14", letterSpacing: "0.06em", margin: 0, textShadow: "0 0 20px rgba(57,255,20,0.3)" },
  subtitle: { fontSize: "0.75rem", color: "rgba(200,245,200,0.45)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  tabs: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 28, flexWrap: "wrap" as const },
  tab: { display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 10, border: "1px solid", cursor: "none", fontFamily: "inherit", transition: "all 0.25s ease", backdropFilter: "blur(6px)" },

  content: { maxWidth: 700, margin: "0 auto" },

  chip: { padding: "7px 14px", borderRadius: 8, border: "1px solid", color: "#C8F5C8", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" },

  scoreBox: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, padding: "28px 24px", borderRadius: 16, background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.1)", width: "100%" },
  retryBtn: { padding: "10px 24px", borderRadius: 10, border: "1.5px solid #39FF14", background: "rgba(57,255,20,0.08)", color: "#39FF14", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 4 },

  optBtn: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "1px solid", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500, transition: "all 0.25s ease", textAlign: "left" as const },
  optLetter: { width: 28, height: 28, borderRadius: 8, border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 },

  textInput: { flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(57,255,20,0.15)", background: "rgba(5,10,5,0.6)", color: "#C8F5C8", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" },
  submitBtn: { padding: "10px 20px", borderRadius: 10, border: "1.5px solid #39FF14", background: "rgba(57,255,20,0.1)", color: "#39FF14", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};
