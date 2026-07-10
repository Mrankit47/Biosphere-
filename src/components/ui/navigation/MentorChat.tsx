"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMentor, type DifficultyLevel } from "./MentorContext";
import { getFullProgress, getWeakTopics, getBookmarkedLessons, getAnalytics } from "@/utils/progressEngine";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  quizData?: any;
  flashcardData?: any;
}

export const MentorChat: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    pageContext,
    clearPageContext,
    difficulty,
    setDifficulty,
    triggerMentorAction
  } = useMentor();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `### Hello, I'm BioTutor! 🔬
I am your personal Context-Aware Biology Mentor. I automatically understand what page or organ structure you are looking at.

How can I help you today? Or choose one of the study tools below to generate customized review resources!`
      }
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingText]);

  // Parse action tags from LLM stream e.g. [ACTION: zoom heart]
  const parseActionTags = (text: string): { cleanText: string; action?: { type: string; id: string } } => {
    const actionRegex = /\[ACTION:\s*(\w+)\s+(\w+)\]/i;
    const match = text.match(actionRegex);
    if (match) {
      const type = match[1].toLowerCase();
      const id = match[2].toLowerCase();
      const cleanText = text.replace(actionRegex, "").trim();
      return { cleanText, action: { type, id } };
    }
    return { cleanText: text };
  };

  // Parse JSON payloads (quizzes/flashcards)
  const parseJsonPayloads = (text: string): { cleanText: string; quiz?: any; flashcards?: any } => {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match) {
      try {
        const parsed = JSON.parse(match[1].trim());
        const cleanText = text.replace(jsonRegex, "").trim();
        if (parsed.quiz) {
          return { cleanText, quiz: parsed.quiz };
        }
        if (parsed.flashcards) {
          return { cleanText, flashcards: parsed.flashcards };
        }
      } catch (err) {
        // Not fully formatted JSON yet (still streaming)
      }
    }
    return { cleanText: text };
  };

  const handleSendMessage = async (customText?: string, actionType?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && !actionType) return;

    setInput("");
    setLoading(true);
    setStreamingText("");

    // Add User message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend || `Generate ${actionType} on ${pageContext.selectedOrgan || pageContext.page}`
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Gather progress details
      const progress = getFullProgress();
      const analytics = getAnalytics();
      const progressPayload = {
        completedLessonsCount: progress.completedLessons?.length || 0,
        bookmarkedLessonsCount: progress.bookmarkedLessons?.length || 0,
        weakTopics: analytics.weakTopics || [],
        favoriteTopics: analytics.favoriteTopics || [],
        totalXp: progress.totalXp || 0
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
          context: pageContext,
          progress: progressPayload,
          difficulty,
          action: actionType
        })
      });

      if (!res.ok) throw new Error("Network issue");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulated += chunk;
          setStreamingText(accumulated);
        }
      }

      // Final processing of completed stream
      const { cleanText: textWithoutActions, action } = parseActionTags(accumulated);
      const { cleanText, quiz, flashcards } = parseJsonPayloads(textWithoutActions);

      // Trigger visual action if received
      if (action) {
        triggerMentorAction(action);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: cleanText || (quiz ? "I generated a practice quiz for you:" : flashcards ? "Here are your study flashcards:" : ""),
          quizData: quiz,
          flashcardData: flashcards
        }
      ]);
    } catch (err) {
      console.warn("Failed to talk to Mentor API:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "⚠️ I had trouble syncing with the biology knowledge stream. Please try again."
        }
      ]);
    } finally {
      setStreamingText("");
      setLoading(false);
    }
  };

  const activeContextLabel = pageContext.selectedOrgan || pageContext.selectedCell || pageContext.selectedDisease || pageContext.selectedSpecies || (pageContext.page !== "home" ? pageContext.page : null);

  return (
    <div className={`mentor-chat-container ${compact ? "compact" : ""}`}>
      {/* Mentor Header */}
      <div className="mentor-header-card glassmorphic">
        <div className="mentor-prof-info">
          <span className="prof-avatar">🎓</span>
          <div>
            <span className="prof-title">BioTutor Professor</span>
            <span className="prof-status">Online • Context-Aware</span>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="diff-pill-selector">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            className="diff-select"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="medical">Medical Student</option>
            <option value="teacher">Teacher Mode</option>
          </select>
        </div>
      </div>

      {/* Active Context Banner */}
      {activeContextLabel && (
        <div className="active-context-banner glassmorphic">
          <div className="context-indicator">
            <span className="indicator-pulse" />
            <span className="context-txt">Synced Topic: <b>{activeContextLabel.toUpperCase()}</b></span>
          </div>
          <button onClick={clearPageContext} className="clear-context-btn" title="Reset current context">
            ✕ Reset
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="mentor-messages-scroller">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble-wrapper ${m.role}`}>
            <div className={`chat-bubble glassmorphic ${m.role}`}>
              {/* Message Header */}
              <span className="bubble-speaker-tag">
                {m.role === "assistant" ? "🎓 Professor BioTutor" : "👤 Student"}
              </span>
              
              {/* Parse and render standard markdown sections */}
              <div className="bubble-content-text">
                {m.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("###")) {
                    return <h4 key={pIdx} className="bubble-heading">{para.replace("###", "").trim()}</h4>;
                  }
                  if (para.startsWith("-") || para.startsWith("*")) {
                    return (
                      <ul key={pIdx} className="bubble-list">
                        {para.split("\n").map((li, lIdx) => (
                          <li key={lIdx}>{li.replace(/^[\s-*]+/, "").trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx} className="bubble-para">{para}</p>;
                })}
              </div>

              {/* Render dynamic quiz if available */}
              {m.quizData && <InteractiveQuiz questions={m.quizData} />}

              {/* Render dynamic flashcards if available */}
              {m.flashcardData && <InteractiveFlashcards cards={m.flashcardData} />}
            </div>
          </div>
        ))}

        {/* Streaming text container */}
        {streamingText && (
          <div className="chat-bubble-wrapper assistant">
            <div className="chat-bubble assistant streaming glassmorphic">
              <span className="bubble-speaker-tag">🎓 Professor BioTutor (Writing...)</span>
              <div className="bubble-content-text">
                <p className="bubble-para">{streamingText.replace(/\[ACTION:[\s\S]*?\]/g, "")}</p>
              </div>
            </div>
          </div>
        )}

        {loading && !streamingText && (
          <div className="chat-bubble-wrapper assistant">
            <div className="chat-bubble assistant loading-bubble glassmorphic">
              <div className="glowing-spinner-tiny" />
              <span>Consulting biology archives...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Action Toolbelt Panel */}
      <div className="mentor-toolbelt-panel">
        <button onClick={() => handleSendMessage("", "quiz")} className="toolbelt-btn quiz" disabled={loading}>
          📝 Quiz Me
        </button>
        <button onClick={() => handleSendMessage("", "flashcards")} className="toolbelt-btn cards" disabled={loading}>
          🧬 Flashcards
        </button>
        <button onClick={() => handleSendMessage("", "summary")} className="toolbelt-btn summary" disabled={loading}>
          📖 Summary
        </button>
        <button onClick={() => handleSendMessage("", "notes")} className="toolbelt-btn notes" disabled={loading}>
          📓 Study Notes
        </button>
      </div>

      {/* Input box */}
      <div className="mentor-input-row glassmorphic">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={`Ask about ${activeContextLabel || "biology"}...`}
          className="mentor-chat-input"
          disabled={loading}
        />
        <button onClick={() => handleSendMessage()} className="mentor-send-btn" disabled={loading}>
          Send 🚀
        </button>
      </div>

      <style>{`
        .mentor-chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 12px;
          color: #fff;
          font-family: inherit;
          box-sizing: border-box;
          max-width: 100%;
        }

        /* Header Card */
        .mentor-header-card {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mentor-prof-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .prof-avatar { font-size: 1.6rem; }
        .prof-title { font-size: 0.8rem; font-weight: 800; display: block; }
        .prof-status { font-size: 0.58rem; color: var(--ds-accent); display: block; }

        .diff-select {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--ds-glass-border);
          border-radius: 6px;
          color: #fff;
          font-size: 0.72rem;
          padding: 4px 8px;
          outline: none;
          font-family: inherit;
        }

        /* Context Banner */
        .active-context-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px dashed rgba(57, 255, 20, 0.3);
          background: rgba(57, 255, 20, 0.03);
        }
        .context-indicator { display: flex; align-items: center; gap: 8px; }
        .indicator-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ds-accent);
          box-shadow: 0 0 6px var(--ds-accent);
          animation: context-ping 1.5s infinite alternate;
        }
        .context-txt { font-size: 0.65rem; color: var(--ds-fg-muted); }
        .context-txt b { color: var(--ds-accent); }
        .clear-context-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 0.58rem;
          cursor: pointer;
        }
        .clear-context-btn:hover { color: #fff; }

        /* Scroller */
        .mentor-messages-scroller {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 4px;
          min-height: 200px;
        }
        .chat-bubble-wrapper {
          display: flex;
          width: 100%;
        }
        .chat-bubble-wrapper.user { justify-content: flex-end; }
        .chat-bubble-wrapper.assistant { justify-content: flex-start; }

        .chat-bubble {
          max-width: 85%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .chat-bubble.user {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }
        .chat-bubble.assistant {
          background: rgba(255,255,255,0.01);
        }
        .bubble-speaker-tag {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ds-accent-muted);
          display: block;
          margin-bottom: 6px;
        }
        .chat-bubble.user .bubble-speaker-tag {
          color: var(--ds-accent);
        }

        .bubble-heading {
          font-size: 0.85rem;
          font-weight: 800;
          color: #fff;
          margin: 10px 0 6px;
          border-bottom: 1px solid var(--ds-glass-border);
          padding-bottom: 3px;
        }
        .bubble-para {
          font-size: 0.76rem;
          color: var(--ds-fg-muted);
          line-height: 1.5;
          margin: 0 0 8px;
        }
        .bubble-list {
          padding-left: 14px;
          margin: 0 0 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bubble-list li {
          font-size: 0.76rem;
          color: var(--ds-fg-muted);
        }

        /* Toolbelt Panel */
        .mentor-toolbelt-panel {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .toolbelt-btn {
          flex: 1;
          min-width: 80px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
          font-size: 0.65rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .toolbelt-btn:hover {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        /* Input Row */
        .mentor-input-row {
          display: flex;
          padding: 6px;
          border-radius: 10px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.2);
        }
        .mentor-chat-input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 0.78rem;
          padding: 8px;
          outline: none;
          font-family: inherit;
        }
        .mentor-send-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: none;
          background: var(--ds-accent);
          color: #050a05;
          font-weight: 800;
          font-size: 0.7rem;
          cursor: pointer;
          box-shadow: var(--ds-glow-sm);
        }

        /* Spinner & Loader */
        .loading-bubble {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.7rem;
          color: var(--ds-fg-subtle);
        }
        .glowing-spinner-tiny {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1.5px solid var(--ds-border-muted);
          border-top-color: var(--ds-accent);
          animation: spin-tiny 1s linear infinite;
        }

        @keyframes spin-tiny {
          to { transform: rotate(360deg); }
        }
        @keyframes context-ping {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

/* ─── Inner Component: Interactive Quiz ─────────────────── */

const InteractiveQuiz: React.FC<{ questions: any[] }> = ({ questions }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [verified, setVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[qIdx];

  const handleVerify = () => {
    if (selectedIdx === null) return;
    if (selectedIdx === currentQ.answerIndex) {
      setScore((s) => s + 1);
    }
    setVerified(true);
  };

  const handleNext = () => {
    if (qIdx + 1 < questions.length) {
      setQIdx(qIdx + 1);
      setSelectedIdx(null);
      setVerified(false);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="quiz-card-wrapper glassmorphic">
      <div className="quiz-card-hdr">💡 Practise Quiz</div>
      
      {finished ? (
        <div className="quiz-card-finished">
          <span className="quiz-card-medal">🏆</span>
          <h5>Quiz Completed!</h5>
          <p>Score: <b>{score} / {questions.length}</b></p>
          <button onClick={() => { setQIdx(0); setSelectedIdx(null); setVerified(false); setScore(0); setFinished(false); }} className="quiz-card-action">
            Retry Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-card-question-panel">
          <span className="quiz-card-tracker">Question {qIdx + 1} of {questions.length}</span>
          <p className="quiz-card-q">{currentQ.question}</p>
          <div className="quiz-card-options">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedIdx === idx;
              let optClass = "";
              if (verified) {
                if (idx === currentQ.answerIndex) optClass = "correct";
                else if (isSelected) optClass = "incorrect";
                else optClass = "disabled";
              } else if (isSelected) {
                optClass = "selected";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !verified && setSelectedIdx(idx)}
                  className={`quiz-card-opt-btn ${optClass}`}
                  disabled={verified}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {!verified ? (
            <button onClick={handleVerify} disabled={selectedIdx === null} className="quiz-card-action verify">
              Verify Answer →
            </button>
          ) : (
            <div className="quiz-card-feedback-box">
              <span className={`feedback-badge-txt ${selectedIdx === currentQ.answerIndex ? "correct" : "incorrect"}`}>
                {selectedIdx === currentQ.answerIndex ? "✓ Correct!" : "✗ Incorrect"}
              </span>
              <p className="feedback-explanation-txt">{currentQ.explanation}</p>
              <button onClick={handleNext} className="quiz-card-action next">
                {qIdx + 1 < questions.length ? "Next Question" : "Finish Quiz"}
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .quiz-card-wrapper {
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          border: 1px dashed var(--ds-border-accent);
          background: rgba(57, 255, 20, 0.02);
        }
        .quiz-card-hdr {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-accent);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .quiz-card-finished { text-align: center; padding: 10px 0; }
        .quiz-card-medal { font-size: 1.8rem; }
        .quiz-card-finished h5 { font-size: 0.8rem; margin: 4px 0; }
        .quiz-card-finished p { font-size: 0.72rem; margin: 0 0 10px; color: var(--ds-fg-muted); }

        .quiz-card-tracker { font-size: 0.52rem; color: var(--ds-fg-subtle); display: block; margin-bottom: 4px; }
        .quiz-card-q { font-size: 0.76rem; font-weight: 700; color: #fff; margin: 0 0 10px; }
        .quiz-card-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
        .quiz-card-opt-btn {
          text-align: left;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
          font-size: 0.7rem;
          cursor: pointer;
          font-family: inherit;
        }
        .quiz-card-opt-btn.selected { border-color: var(--ds-border-accent); color: var(--ds-accent); }
        .quiz-card-opt-btn.correct { border-color: #10b981; color: #10b981; background: rgba(16,185,129,0.06); }
        .quiz-card-opt-btn.incorrect { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.06); }
        .quiz-card-opt-btn.disabled { opacity: 0.45; }

        .quiz-card-action {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
        }
        .quiz-card-action:disabled { opacity: 0.4; }

        .quiz-card-feedback-box {
          padding: 10px;
          border-radius: 6px;
          border: 1px dashed var(--ds-glass-border);
          background: rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .feedback-badge-txt { font-size: 0.58rem; font-weight: 900; }
        .feedback-badge-txt.correct { color: #10b981; }
        .feedback-badge-txt.incorrect { color: #ef4444; }
        .feedback-explanation-txt { font-size: 0.68rem; color: var(--ds-fg-muted); line-height: 1.4; margin: 0; }
      `}</style>
    </div>
  );
};

/* ─── Inner Component: Flipping Flashcards ───────────────── */

const InteractiveFlashcards: React.FC<{ cards: any[] }> = ({ cards }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[idx];

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  return (
    <div className="flashcards-wrapper glassmorphic">
      <div className="flashcards-hdr">🧬 Revision Flashcard</div>

      <div className="flashcard-box" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
          <div className="card-face front">
            <span className="face-title">Question</span>
            <p className="face-txt">{currentCard.front}</p>
            {currentCard.hint && <span className="face-hint">💡 Hint: {currentCard.hint}</span>}
            <span className="click-flip-tag">Tap to reveal Answer ➔</span>
          </div>
          <div className="card-face back">
            <span className="face-title">Definition / Answer</span>
            <p className="face-txt">{currentCard.back}</p>
            <span className="click-flip-tag">Tap to view question ➔</span>
          </div>
        </div>
      </div>

      <div className="flashcard-footer">
        <span className="flashcard-tracker">{idx + 1} of {cards.length}</span>
        <button onClick={handleNext} className="flashcard-next-btn">Next Card ➔</button>
      </div>

      <style>{`
        .flashcards-wrapper {
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          border: 1px dashed var(--ds-border-accent);
          background: rgba(0, 212, 170, 0.02);
        }
        .flashcards-hdr {
          font-size: 0.65rem;
          font-weight: 800;
          color: #00D4AA;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .flashcard-box {
          height: 120px;
          perspective: 600px;
          cursor: pointer;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.5s;
        }
        .flashcard-inner.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.35);
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-face.back {
          transform: rotateY(180deg);
          border-color: rgba(0, 212, 170, 0.2);
        }

        .face-title { font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ds-fg-subtle); }
        .face-txt { font-size: 0.78rem; font-weight: 700; text-align: center; color: #fff; margin: auto 0; }
        .face-hint { font-size: 0.62rem; color: var(--ds-fg-subtle); }
        .click-flip-tag { font-size: 0.52rem; color: var(--ds-accent); text-align: right; }

        .flashcard-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .flashcard-tracker { font-size: 0.58rem; color: var(--ds-fg-subtle); }
        .flashcard-next-btn {
          background: none;
          border: none;
          color: #00D4AA;
          font-size: 0.68rem;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
