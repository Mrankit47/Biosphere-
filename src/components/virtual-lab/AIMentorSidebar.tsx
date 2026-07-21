"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIMentorSidebarProps {
  experimentId: string;
  experimentName: string;
  currentStepIndex: number;
  currentStepTitle: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  equippedItems: string[];
  mode: "step-by-step" | "exploration" | "ai-guided" | "assessment";
  vivaActive: boolean;
  onVivaComplete: (score: number, transcript: string) => void;
}

export default function AIMentorSidebar({
  experimentId,
  experimentName,
  currentStepIndex,
  currentStepTitle,
  inputs,
  outputs,
  equippedItems,
  mode,
  vivaActive,
  onVivaComplete
}: AIMentorSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Viva Voce state
  const [currentVivaQIdx, setCurrentVivaQIdx] = useState(0);
  const [vivaAnswers, setVivaAnswers] = useState<string[]>([]);
  const [vivaEvaluations, setVivaEvaluations] = useState<string[]>([]);
  const [vivaScores, setVivaScores] = useState<number[]>([]);

  // Initialize welcome message
  useEffect(() => {
    if (vivaActive) {
      setMessages([
        {
          id: "welcome-viva",
          role: "assistant",
          content: `### 🎓 Welcome to the Lab Viva Voce!
I am Professor BioTutor, your oral examiner. I will ask you 3 conceptual questions to test your practical understanding of the **${experimentName}** experiment.

Type your answer for Question 1 in the box below, and I will evaluate it.`
        }
      ]);
      setCurrentVivaQIdx(0);
      setVivaAnswers([]);
      setVivaEvaluations([]);
      setVivaScores([]);
    } else {
      setMessages([
        {
          id: "welcome-normal",
          role: "assistant",
          content: `### Hello, I'm BioTutor! 🔬
I am monitoring your progress in the **${experimentName}** lab.

You are currently in **${mode.toUpperCase()}** mode. 
- *Stuck on a step?* Click "Get Step Help" below.
- *Adjusted something wrong?* I will flag errors.
- *Have a question?* Just ask me!`
        }
      ]);
    }
  }, [vivaActive, experimentId, experimentName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingText]);

  // API Message sender
  const handleSendMessage = async (textToSend: string, isVivaAnswer = false) => {
    if (!textToSend.trim()) return;

    setInput("");
    setLoading(true);
    setStreamingText("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Gather active lab parameters to send as context to the AI
      const labContext = {
        page: "virtual-lab",
        experimentId,
        experimentName,
        currentStepIndex,
        currentStepTitle,
        mode,
        inputs,
        outputs,
        equippedItems
      };

      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      // If in Viva mode, route as a custom action
      const action = isVivaAnswer ? "viva_grade" : "";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          context: labContext,
          difficulty: "intermediate",
          action
        })
      });

      if (!res.ok) throw new Error("API sync failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value);
          setStreamingText(accumulated);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: accumulated
        }
      ]);

      if (isVivaAnswer) {
        // Simple heuristic to extract score (e.g. "SCORE: 8/10")
        const scoreMatch = accumulated.match(/SCORE:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 7; // default to 7 if not clearly formatted

        const nextAnswers = [...vivaAnswers, textToSend];
        const nextEvals = [...vivaEvaluations, accumulated];
        const nextScores = [...vivaScores, score];

        setVivaAnswers(nextAnswers);
        setVivaEvaluations(nextEvals);
        setVivaScores(nextScores);

        const nextQIdx = currentVivaQIdx + 1;
        if (nextQIdx < 3) {
          setCurrentVivaQIdx(nextQIdx);
          // Ask next question
          setTimeout(() => {
            triggerNextVivaQuestion(nextQIdx);
          }, 1500);
        } else {
          // Finished all 3 questions! Calculate average score and compile transcript
          const totalScore = nextScores.reduce((a, b) => a + b, 0);
          const finalPercentage = Math.round((totalScore / 30) * 100);
          
          let transcript = "";
          for (let i = 0; i < 3; i++) {
            transcript += `Q${i+1}: ${nextAnswers[i] || ""}\nEvaluation: ${nextEvals[i] || ""}\n\n`;
          }

          setTimeout(() => {
            onVivaComplete(finalPercentage, transcript);
            setMessages((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                role: "assistant",
                content: `### Viva Assessment Complete! 🎉
You have completed the oral examination.
**Final Viva Score: ${finalPercentage}%**

Your report has been updated with these details. Click **Submit Lab Report** to certify your grade.`
              }
            ]);
          }, 1500);
        }
      }

    } catch (err) {
      console.warn("Mentor chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "⚠️ I had trouble connecting to the biology knowledge stream. Please try again."
        }
      ]);
    } finally {
      setStreamingText("");
      setLoading(false);
    }
  };

  const triggerNextVivaQuestion = (idx: number) => {
    let qText = "";
    if (experimentId === "photosynthesis") {
      const q = [
        "Explain why bubble rate decreases as the lamp is moved further away, in terms of the light intensity equation.",
        "What feedback loop prevents a plant from photosynthesizing if CO2 drops are completely missing, even in bright light?",
        "Why is a blue color filter more efficient at driving light-reactions than a green filter?"
      ];
      qText = q[idx] || "";
    } else if (experimentId === "catalase") {
      const q = [
        "Why is there a zero-activity height in froth at pH 2? What structural changes happened to the Catalase molecule?",
        "Contrast enzyme activity at 0°C and 37°C in terms of molecular kinetic energy.",
        "What is the difference between competitive and non-competitive inhibitors of catalase?"
      ];
      qText = q[idx] || "";
    } else if (experimentId === "osmosis") {
      const q = [
        "What would happen to red blood cells if they were suspended in 5.0% salt water? Explain using tonicity terms.",
        "How do Aquaporin channels speed up osmosis? Do they use metabolic ATP energy?",
        "Define plasmolysis and explain how cell walls protect plant cells from lysing in hypotonic environments."
      ];
      qText = q[idx] || "";
    } else {
      const q = [
        "Explain the optical difference between coarse and fine focus adjustments.",
        "Why does staining Onion cells with Iodine make the nucleus stand out under magnification?",
        "Detail the structural difference between plant guard cells and cheek cells."
      ];
      qText = q[idx] || "";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        role: "assistant",
        content: `### 🎓 Question ${idx + 1}
${qText}`
      }
    ]);
  };

  // Quick action: Ask for help on current step
  const handleGetStepHelp = () => {
    if (loading) return;
    const promptText = `I am stuck on Step ${currentStepIndex + 1}: "${currentStepTitle}". Can you explain what this instruction accomplishes biologically and give me a hint?`;
    handleSendMessage(promptText);
  };

  // Quick action: Flag errors
  const handleCheckMistakes = () => {
    if (loading) return;
    const promptText = `Analyze my active settings: ${JSON.stringify(inputs)}. Identify if I have made any mistakes or if any parameters are causing biological denaturation or rates limiting.`;
    handleSendMessage(promptText);
  };

  return (
    <div className="panel-card glassmorphic flex flex-col h-full min-h-[380px] bg-black/35 border-[var(--ds-glass-border)]">
      {/* Header */}
      <div className="border-b border-[var(--ds-border-muted)] pb-2 mb-2 flex items-center justify-between">
        <h3 className="panel-section-title !m-0 flex items-center gap-1.5 text-xs">
          <span>🎓</span> BIOTUTOR AI MENTOR
        </h3>
        <span className="text-[8px] bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] px-1.5 py-0.5 rounded text-[var(--ds-accent)] font-mono">
          {vivaActive ? "EXAMINER ACTIVE" : "ONLINE"}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[180px] text-[10.5px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase mb-0.5">
              {m.role === "user" ? "Student" : "Professor BioTutor"}
            </span>
            <div
              className={`rounded p-2 max-w-[88%] leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] text-[var(--ds-fg-bright)]"
                  : "bg-white/5 border border-[var(--ds-border-muted)] text-[var(--ds-fg)]"
              } whitespace-pre-line`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Streaming text logic */}
        {streamingText && (
          <div className="flex flex-col items-start">
            <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase mb-0.5">
              Professor BioTutor
            </span>
            <div className="rounded p-2 max-w-[88%] leading-relaxed bg-white/5 border border-[var(--ds-border-muted)] text-[var(--ds-fg)] whitespace-pre-line animate-pulse">
              {streamingText}
            </div>
          </div>
        )}

        {loading && !streamingText && (
          <div className="text-[9px] text-[var(--ds-accent)] animate-pulse pl-1">
            Professor BioTutor is analyzing lab context...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Action buttons (hidden in viva voce mode) */}
      {!vivaActive && (
        <div className="flex gap-2 my-2">
          <button
            onClick={handleGetStepHelp}
            disabled={loading}
            className="flex-1 text-[9px] bg-white/5 hover:bg-white/10 text-[var(--ds-fg-muted)] hover:text-white py-1 px-1.5 rounded border border-[var(--ds-border-muted)]"
          >
            ❓ Get Step Help
          </button>
          <button
            onClick={handleCheckMistakes}
            disabled={loading}
            className="flex-1 text-[9px] bg-white/5 hover:bg-white/10 text-[var(--ds-fg-muted)] hover:text-white py-1 px-1.5 rounded border border-[var(--ds-border-muted)]"
          >
            ⚠️ Check Mistakes
          </button>
        </div>
      )}

      {/* Input panel */}
      <div className="border-t border-[var(--ds-border-muted)] pt-2 mt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || loading) return;
            handleSendMessage(input, vivaActive);
          }}
          className="flex gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={
              vivaActive
                ? `Enter answer for Question ${currentVivaQIdx + 1}...`
                : "Ask BioTutor a biology question..."
            }
            className="flex-1 bg-black/40 border border-[var(--ds-border-muted)] rounded p-1.5 text-[10px] text-[var(--ds-fg)] placeholder-[var(--ds-fg-subtle)] outline-none focus:border-[var(--ds-accent-muted)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[var(--ds-accent-faint)] border border-[var(--ds-border-accent)] hover:bg-[var(--ds-accent-subtle)] text-[var(--ds-accent)] font-bold text-[10px] py-1 px-2.5 rounded transition-all disabled:opacity-50"
          >
            {vivaActive ? "Submit" : "Ask"}
          </button>
        </form>
      </div>
    </div>
  );
}
