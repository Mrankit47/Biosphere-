"use client";

import React, { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantPanelProps {
  simulationId: string;
  simulationName: string;
  activeStepTitle: string;
  activeStepIdx: number;
  timeline: number;
  controls: Record<string, any>;
}

export default function AIAssistantPanel({
  simulationId,
  simulationName,
  activeStepTitle,
  activeStepIdx,
  timeline,
  controls
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Welcome message initialization
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `### Welcome to the ${simulationName} Simulation! 🔬
I am BioTutor, your personal Biology Mentor. I automatically track the simulation timeline and active controls.

You are currently on **Milestone ${activeStepIdx + 1}: ${activeStepTitle}** (Timeline: ${Math.round(timeline)}%).

Ask me any questions about the mechanisms, or click "Explain Current Phase" for a quick tutorial.`
      }
    ]);
  }, [simulationId, simulationName]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingText]);

  const handleSendMessage = async (textToSend: string) => {
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
      // Gather active simulation parameters for context-aware prompt parsing
      const simulationContext = {
        page: "process-simulations",
        simulationId,
        simulationName,
        activeStepIdx,
        activeStepTitle,
        timeline,
        controls
      };

      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          context: simulationContext,
          difficulty: "intermediate"
        })
      });

      if (!res.ok) throw new Error("Sync failed");

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

    } catch (err) {
      console.warn("AI chat error:", err);
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

  const handleExplainPhase = () => {
    if (loading) return;
    const promptText = `Explain what is happening biologically during Milestone ${activeStepIdx + 1}: "${activeStepTitle}" in this ${simulationName} simulation. Explain the active structures or enzymes.`;
    handleSendMessage(promptText);
  };

  const handlePredictOutcome = () => {
    if (loading) return;
    const promptText = `Predict the biological outcome of this process. What happens next as the timeline shifts, and why is this stage critical for cellular survival?`;
    handleSendMessage(promptText);
  };

  return (
    <div className="panel-card glassmorphic flex flex-col h-full min-h-[380px] bg-black/35 border-[var(--ds-glass-border)]">
      {/* Header */}
      <div className="border-b border-[var(--ds-border-muted)] pb-2 mb-2 flex items-center justify-between">
        <h3 className="panel-section-title !m-0 flex items-center gap-1.5 text-xs">
          <span>🤖</span> BIOTUTOR SIMULATOR ASSISTANT
        </h3>
        <span className="text-[8px] bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] px-1.5 py-0.5 rounded text-[var(--ds-accent)] font-mono">
          ONLINE
        </span>
      </div>

      {/* Chat logs */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[160px] text-[10.5px]">
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
            Analyzing molecular process...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Action buttons */}
      <div className="flex gap-2 my-2 no-print">
        <button
          onClick={handleExplainPhase}
          disabled={loading}
          className="flex-1 text-[9px] bg-white/5 hover:bg-white/10 text-[var(--ds-fg-muted)] hover:text-white py-1 px-1.5 rounded border border-[var(--ds-border-muted)]"
        >
          💡 Explain Phase
        </button>
        <button
          onClick={handlePredictOutcome}
          disabled={loading}
          className="flex-1 text-[9px] bg-white/5 hover:bg-white/10 text-[var(--ds-fg-muted)] hover:text-white py-1 px-1.5 rounded border border-[var(--ds-border-muted)]"
        >
          🔮 Predict Outcome
        </button>
      </div>

      {/* Input row */}
      <div className="border-t border-[var(--ds-border-muted)] pt-2 mt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || loading) return;
            handleSendMessage(input);
          }}
          className="flex gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask BioTutor about the simulation..."
            className="flex-1 bg-black/40 border border-[var(--ds-border-muted)] rounded p-1.5 text-[10px] text-[var(--ds-fg)] placeholder-[var(--ds-fg-subtle)] outline-none focus:border-[var(--ds-accent-muted)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[var(--ds-accent-faint)] border border-[var(--ds-border-accent)] hover:bg-[var(--ds-accent-subtle)] text-[var(--ds-accent)] font-bold text-[10px] py-1 px-2.5 rounded transition-all disabled:opacity-50"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
