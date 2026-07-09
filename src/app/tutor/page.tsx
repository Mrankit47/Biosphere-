"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { BackLink } from "@/components/ds";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const SUGGESTED_QUESTIONS = [
  { text: "How does cellular respiration produce energy?", label: "Cellular Respiration" },
  { text: "Can you explain the base pairing rules in a DNA double helix?", label: "DNA Structure" },
  { text: "What is the 10% rule in ecological food pyramids?", label: "Trophic Pyramids" },
  { text: "How does a virus capsid differ from a bacterial cell wall?", label: "Viruses vs Bacteria" }
];

export default function BiologyTutorPage() {
  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice & Speech synthesis states
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [systemLang, setSystemLang] = useState("en-US");
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from local storage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setSystemLang(navigator.language || "en-US");
    }
    
    // Inject Mermaid script
    if (!document.getElementById("mermaid-script")) {
      const script = document.createElement("script");
      script.id = "mermaid-script";
      script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).mermaid) {
          (window as any).mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            suppressErrors: true,
          });
        }
      };
      document.body.appendChild(script);
    }

    const stored = localStorage.getItem("biosphere_tutor_chats");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse conversations:", e);
      }
    }
  }, []);

  // Cancel speech on page leave and lock window scroll
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[*#_`~]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Auto-detect Hindi/Hinglish text
    const hasHindiOrHinglish = /[\u0900-\u097F]/g.test(cleanText) || 
      /\b(batao|hai|mujhe|tumhara|naam|kya|bataiye|sakte|aap|kaise|ko|se|ke|bare|mein)\b/i.test(cleanText);

    if (hasHindiOrHinglish) {
      utterance.lang = "hi-IN";
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi") || v.name.toLowerCase().includes("india"));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      utterance.lang = navigator.language || "en-US";
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onend = () => {
      setSpeakingText(null);
    };
    utterance.onerror = () => {
      setSpeakingText(null);
    };

    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = systemLang || "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error || e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const activeChat = conversations.find(c => c.id === activeChatId);

  // Save conversations to local storage
  const saveChats = (chats: Conversation[]) => {
    setConversations(chats);
    localStorage.setItem("biosphere_tutor_chats", JSON.stringify(chats));
  };

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, streamingMessage]);

  const handleNewChat = () => {
    const newChat: Conversation = {
      id: "chat_" + Date.now(),
      title: "New Biology Chat",
      messages: []
    };
    const updated = [newChat, ...conversations];
    saveChats(updated);
    setActiveChatId(newChat.id);
    setInput("");
    setStreamingMessage("");
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const filtered = conversations.filter(c => c.id !== id);
    saveChats(filtered);
    if (activeChatId === id) {
      if (filtered.length > 0) {
        setActiveChatId(filtered[0].id);
      } else {
        setActiveChatId("");
      }
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    let currentChatId = activeChatId;
    let currentChats = [...conversations];

    // If no active chat, create one automatically
    if (!activeChatId) {
      const newChat: Conversation = {
        id: "chat_" + Date.now(),
        title: textToSend.substring(0, 26) + "...",
        messages: []
      };
      currentChats = [newChat, ...currentChats];
      currentChatId = newChat.id;
      setActiveChatId(newChat.id);
    }

    const activeIndex = currentChats.findIndex(c => c.id === currentChatId);
    if (activeIndex === -1) return;

    const userMessage: Message = { role: "user", content: textToSend };
    
    // Add user message
    const updatedMessages = [...currentChats[activeIndex].messages, userMessage];
    currentChats[activeIndex] = {
      ...currentChats[activeIndex],
      messages: updatedMessages,
      // Auto update title if it was default
      title: currentChats[activeIndex].title === "New Biology Chat" 
        ? textToSend.substring(0, 24) + "..." 
        : currentChats[activeIndex].title
    };

    saveChats(currentChats);
    setInput("");
    setLoading(true);
    setStreamingMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!res.ok) throw new Error("Connection failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          assistantText += chunk;
          setStreamingMessage(assistantText);
        }
      }

      // Save complete stream response
      const finalChats = [...currentChats];
      const chatIdx = finalChats.findIndex(c => c.id === currentChatId);
      if (chatIdx !== -1) {
        finalChats[chatIdx] = {
          ...finalChats[chatIdx],
          messages: [...finalChats[chatIdx].messages, { role: "assistant", content: assistantText }]
        };
        saveChats(finalChats);
      }
    } catch (err) {
      console.warn("Chat API call failed:", err);
      // Append error message
      const finalChats = [...currentChats];
      const chatIdx = finalChats.findIndex(c => c.id === currentChatId);
      if (chatIdx !== -1) {
        finalChats[chatIdx] = {
          ...finalChats[chatIdx],
          messages: [
            ...finalChats[chatIdx].messages, 
            { role: "assistant", content: "⚠️ Sorry, I encountered an issue connecting to the biology stream. Please check your credentials or try again." }
          ]
        };
        saveChats(finalChats);
      }
    } finally {
      setStreamingMessage("");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={S.root} data-lenis-prevent>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .thinking-dot {
          animation: pulse 1.2s infinite both;
          color: #39FF14;
          font-size: 10px;
          margin: 0 3px;
          display: inline-block;
        }
      `}</style>
      {/* Glow Bg */}
      <div style={S.glowBg} />

      <div style={S.mainLayout}>
        {/* Sidebar */}
        <aside style={S.sidebar} data-lenis-prevent>
          <button onClick={handleNewChat} style={S.newChatBtn}>
            ➕ New Biology Chat
          </button>
          
          <div style={S.chatList} data-lenis-prevent>
            {conversations.length === 0 ? (
              <div style={S.emptyList}>No saved conversations.</div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveChatId(c.id);
                    setStreamingMessage("");
                  }}
                  style={{
                    ...S.chatItem,
                    background: c.id === activeChatId ? "rgba(57, 255, 20, 0.06)" : "transparent",
                    borderColor: c.id === activeChatId ? "rgba(57, 255, 20, 0.2)" : "rgba(255, 255, 255, 0.04)"
                  }}
                >
                  <span style={S.chatItemTitle}>💬 {c.title}</span>
                  <span 
                    onClick={(e) => handleDeleteChat(c.id, e)} 
                    style={S.chatItemDelete}
                    title="Delete Chat"
                  >
                    ✕
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main style={S.chatArea}>
          {/* Header */}
          <header style={S.chatHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <BackLink href="/" label="Home" relative={true} />
              <div>
                <h1 style={S.headerTitle}>BIOLOGY TUTOR 🔬</h1>
                <p style={S.headerSub}>Ask questions, generate flowcharts, and test your knowledge interactively.</p>
              </div>
            </div>
            <Link href="/learning-paths" style={S.dashboardLink}>
              🎓 Learning Paths
            </Link>
          </header>

          {/* Conversation Screen */}
          <div style={S.messageScrollWrap} data-lenis-prevent>
            {(!activeChat || activeChat.messages.length === 0) && !streamingMessage ? (
              <div style={S.welcomeView}>
                <div style={S.logoPulse}>🧬</div>
                <h2 style={{ color: "#fff", fontSize: "1.3rem", margin: "12px 0 6px" }}>Hello! I'm BioTutor.</h2>
                <p style={{ color: "rgba(200, 245, 200, 0.5)", fontSize: "0.85rem", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.5 }}>
                  I can explain biological processes, render flowcharts, and test you with interactive quizzes. Ask me about cell biology, genetics, ecosystems, or microbiology!
                </p>
                
                <h3 style={S.suggestedHeading}>SUGGESTED LESSONS</h3>
                <div style={S.suggestedGrid}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q.text)}
                      style={S.suggestedCard}
                    >
                      <span style={{ fontSize: "0.75rem", color: "#39FF14", display: "block", marginBottom: 4, letterSpacing: "0.08em" }}>{q.label}</span>
                      <p style={S.suggestedText}>{q.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={S.messagesList}>
                {activeChat?.messages.map((m, idx) => (
                  <MessageBubble 
                    key={idx} 
                    message={m} 
                    onSpeak={handleSpeak}
                    isSpeaking={speakingText === m.content}
                  />
                ))}
                {streamingMessage && (
                  <MessageBubble 
                    message={{ role: "assistant", content: streamingMessage }} 
                    isStreaming 
                    onSpeak={() => {}}
                    isSpeaking={false}
                  />
                )}
                {loading && !streamingMessage && (
                  <div style={{ ...S.bubbleRow, background: "rgba(57, 255, 20, 0.02)", borderBottom: "1px solid rgba(255, 255, 255, 0.02)" }}>
                    <div style={S.bubbleInner}>
                      <div style={{ ...S.avatarBox, background: "rgba(0, 212, 170, 0.15)", borderColor: "#00D4AA" }}>
                        🧬
                      </div>
                      <div style={S.bubbleContentWrap}>
                        <div style={S.bubbleRolePill}>
                          <span style={{ color: "#00D4AA", fontWeight: 700 }}>BIOTUTOR</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, height: 24 }}>
                          <span className="thinking-dot">●</span>
                          <span className="thinking-dot" style={{ animationDelay: "0.2s" }}>●</span>
                          <span className="thinking-dot" style={{ animationDelay: "0.4s" }}>●</span>
                          <span style={{ color: "rgba(200,245,200,0.5)", fontSize: "0.82rem", marginLeft: 8 }}>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <footer style={S.inputArea}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              style={S.inputForm}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? `🎙️ Listening (${systemLang})... Speak now!` : "Ask me a biology question (e.g. 'Explain carbon cycle')..."}
                disabled={loading}
                style={S.textInput}
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                style={{
                  ...S.micBtn,
                  background: isListening ? "#E24B4A" : "rgba(255,255,255,0.05)",
                  color: isListening ? "#fff" : "rgba(200,245,200,0.6)",
                  boxShadow: isListening ? "0 0 15px #E24B4A80" : "none",
                }}
                title={isListening ? "Stop listening" : "Start Voice Input (Supports All Languages)"}
              >
                {isListening ? "🛑" : "🎙️"}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  ...S.sendBtn,
                  background: input.trim() && !loading ? "#39FF14" : "rgba(255,255,255,0.05)",
                  color: input.trim() && !loading ? "#000" : "rgba(255,255,255,0.2)",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed"
                }}
              >
                {loading ? "..." : "Send ➔"}
              </button>
            </form>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ── Message Bubble Component ────────────────────────────────── */

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

function MessageBubble({ message, isStreaming = false, onSpeak, isSpeaking }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div 
      style={{ 
        ...S.bubbleRow, 
        background: isUser ? "transparent" : "rgba(57, 255, 20, 0.02)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
      }}
    >
      <div style={S.bubbleInner}>
        <div 
          style={{ 
            ...S.avatarBox, 
            background: isUser ? "rgba(57, 255, 20, 0.15)" : "rgba(0, 212, 170, 0.15)",
            borderColor: isUser ? "#39FF14" : "#00D4AA",
          }}
        >
          {isUser ? "👤" : "🧬"}
        </div>
        <div style={S.bubbleContentWrap}>
          <div style={S.bubbleRolePill}>
            <span style={{ color: isUser ? "#39FF14" : "#00D4AA", fontWeight: 700 }}>
              {isUser ? "YOU" : "BIOTUTOR"}
            </span>
            {isStreaming && <span className="pulse-dot" style={{ width: 6, height: 6, display: "inline-block", background: "#00D4AA" }} />}
            {!isStreaming && (
              <button
                onClick={() => onSpeak(message.content)}
                style={{ ...S.speakBtn, color: isSpeaking ? "#39FF14" : "rgba(200,245,200,0.5)" }}
                title={isSpeaking ? "Stop Reading" : "Read Aloud"}
              >
                {isSpeaking ? "🔇 Stop" : "🔊 Speak"}
              </button>
            )}
          </div>
          <div style={S.bubbleContent}>
            <ParsedContent text={message.content} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Content Parser & Renderer ───────────────────────────────── */

function ParsedContent({ text }: { text: string }) {
  // Split by code blocks ```
  const parts = text.split("```");

  return (
    <>
      {parts.map((part, index) => {
        const isCodeBlock = index % 2 !== 0;

        if (isCodeBlock) {
          const firstNewline = part.indexOf("\n");
          const lang = part.substring(0, firstNewline).trim();
          const code = part.substring(firstNewline + 1).trim();
          const isComplete = index < parts.length - 1;

          if (lang === "mermaid") {
            if (isComplete) {
              return <MermaidChart key={index} code={code} />;
            } else {
              return (
                <div key={index} style={S.renderingBadge}>
                  Generating biology flowchart...
                  <pre style={S.codePre}><code style={S.codeBlock}>{code}</code></pre>
                </div>
              );
            }
          }

          if (lang === "json" && code.startsWith("{") && code.includes('"quiz"')) {
            try {
              const quizData = JSON.parse(code);
              return <InteractiveQuizWidget key={index} quizData={quizData.quiz} />;
            } catch (e) {
              // Fail silently, fallback to standard pre
            }
          }

          return (
            <pre key={index} style={S.codePre}>
              <code style={S.codeBlock}>{code}</code>
            </pre>
          );
        }

        // Render standard paragraph markdown (lists, headers, bold)
        return <MarkdownText key={index} text={part} />;
      })}
    </>
  );
}

function MarkdownText({ text }: { text: string }) {
  // Simple markdown conversion regex
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^\s*[\-\*]\s+(.*$)/gim, "<li>$1</li>")
    .replace(/\n/g, "<br />");

  // Group adjacent <li> tags into <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  // Clean double lists
  html = html.replace(/<\/ul>\s*<ul>/g, "");

  return <div style={{ lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ── Mermaid Dynamic Chart Component ────────────────────────── */

function MermaidChart({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState(false);
  const chartId = useRef("mermaid-" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    let active = true;
    const renderChart = async () => {
      if ((window as any).mermaid) {
        let cleanCode = code.trim();
        
        // Ensure it starts with a valid diagram header
        if (!cleanCode.startsWith("graph ") && 
            !cleanCode.startsWith("flowchart ") && 
            !cleanCode.startsWith("sequenceDiagram") && 
            !cleanCode.startsWith("classDiagram") && 
            !cleanCode.startsWith("stateDiagram") && 
            !cleanCode.startsWith("erDiagram") && 
            !cleanCode.startsWith("gantt") && 
            !cleanCode.startsWith("pie")) {
          cleanCode = "graph TD\n" + cleanCode;
        }

        // Preprocess labels to prevent common syntax errors with special characters
        cleanCode = cleanCode.replace(/([\w\-]+)\s*\[([^"\n\]]+)\]/g, '$1["$2"]');
        cleanCode = cleanCode.replace(/([\w\-]+)\s*\(([^"\n\)]+)\)/g, '$1("$2")');
        cleanCode = cleanCode.replace(/([\w\-]+)\s*\{([^"\n\}]+)\}/g, '$1{"$2"}');

        try {
          setError(false);
          
          // Parse silently first to validate without adding error boxes to document body
          try {
            await (window as any).mermaid.parse(cleanCode);
          } catch (parseErr) {
            throw new Error("Syntax validation failed");
          }

          const { svg: svgHtml } = await (window as any).mermaid.render(chartId.current, cleanCode);
          if (active) setSvg(svgHtml);
        } catch (err) {
          console.warn("Mermaid parsing/rendering error:", err);
          
          // Instantly clean up any error elements injected by Mermaid
          if (typeof document !== "undefined") {
            setTimeout(() => {
              const errorDivs = document.querySelectorAll(`[id^="${chartId.current}"], [id^="dmermaid"], [id^="mermaid-"]`);
              errorDivs.forEach(div => {
                if (div.textContent?.includes("Syntax error") || div.innerHTML.includes("Syntax error")) {
                  div.remove();
                }
              });
              const allElements = document.querySelectorAll("div, pre, svg");
              allElements.forEach(el => {
                if (el.textContent?.includes("Syntax error in text") && el.textContent?.includes("mermaid")) {
                  el.remove();
                }
              });
            }, 0);
          }

          if (active) setError(true);
        }
      }
    };

    // Slight delay to ensure script has fully initialized
    const timer = setTimeout(renderChart, 100);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [code]);

  if (error) {
    return (
      <div style={{ ...S.mermaidWrapper, borderColor: "rgba(226, 75, 74, 0.25)", flexDirection: "column", alignItems: "stretch" }}>
        <div style={{ color: "#E24B4A", fontSize: "0.8rem", marginBottom: 8, fontWeight: 600 }}>
          ⚠️ Could not render flowchart due to syntax formatting. Showing source code:
        </div>
        <pre style={S.codePre}>
          <code style={S.codeBlock}>{code}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return <div style={S.renderingBadge}>Generating biology flowchart...</div>;
  }

  return (
    <div 
      style={S.mermaidWrapper} 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}

/* ── Interactive Generated Quiz Widget ───────────────────────── */

function InteractiveQuizWidget({ quizData }: { quizData: QuizQuestion[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  if (!quizData || quizData.length === 0) return null;

  const question = quizData[currentIdx];
  const isLast = currentIdx + 1 === quizData.length;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    setAnswers([...answers, selectedOpt]);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
    } else {
      setSelectedOpt(null);
      setSubmitted(false);
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    let score = 0;
    quizData.forEach((q, i) => {
      if (answers[i] === q.answerIndex) score++;
    });
    const pct = Math.round((score / quizData.length) * 100);

    return (
      <div style={S.quizBox}>
        <div style={S.quizHeaderBadge}>📝 LIVE QUIZ RESULT</div>
        <h4 style={{ color: "#fff", margin: "12px 0 4px", fontSize: "1.1rem" }}>You Scored {pct}%!</h4>
        <p style={{ color: "rgba(200,245,200,0.5)", fontSize: "0.78rem", margin: "0 0 16px" }}>
          You got {score} out of {quizData.length} questions correct.
        </p>
        <button onClick={handleReset} style={S.quizResetBtn}>
          ↺ Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={S.quizBox}>
      <div style={S.quizHeaderBadge}>📝 LIVE QUIZ: QUESTION {currentIdx + 1}/{quizData.length}</div>
      <h4 style={S.quizQuestionText}>{question.question}</h4>
      
      <div style={S.quizOptionsGrid}>
        {question.options.map((opt, oIdx) => {
          let border = "1px solid rgba(255,255,255,0.06)";
          let bg = "rgba(0,0,0,0.2)";
          let decorator = null;

          if (submitted) {
            if (oIdx === question.answerIndex) {
              border = "1.5px solid #39FF14";
              bg = "rgba(57, 255, 20, 0.08)";
              decorator = "✓";
            } else if (selectedOpt === oIdx) {
              border = "1.5px solid #E24B4A";
              bg = "rgba(226, 75, 74, 0.08)";
              decorator = "✕";
            } else {
              bg = "rgba(0,0,0,0.1)";
            }
          } else if (selectedOpt === oIdx) {
            border = "1.5px solid #00D4AA";
            bg = "rgba(0, 212, 170, 0.06)";
          }

          return (
            <button
              key={oIdx}
              onClick={() => handleSelect(oIdx)}
              disabled={submitted}
              style={{ ...S.quizOptionBtn, border, background: bg }}
            >
              <span style={{ flex: 1, textAlign: "left" }}>{opt}</span>
              {decorator && <span style={{ fontWeight: 800, color: decorator === "✓" ? "#39FF14" : "#E24B4A" }}>{decorator}</span>}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div style={S.quizExplanation}>
          <strong style={{ fontSize: "0.78rem", display: "block", marginBottom: 2 }}>EXPLANATION:</strong>
          <span style={{ fontSize: "0.76rem", color: "rgba(200,245,200,0.6)" }}>{question.explanation}</span>
        </div>
      )}

      <div style={S.quizActionRow}>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOpt === null}
            style={{ ...S.quizNavBtn, background: selectedOpt !== null ? "#00D4AA" : "rgba(255,255,255,0.04)", color: selectedOpt !== null ? "#000" : "rgba(255,255,255,0.2)" }}
          >
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNext} style={{ ...S.quizNavBtn, background: "#39FF14", color: "#000" }}>
            {isLast ? "Finish Quiz ➔" : "Next Question ➔"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── CSS Styles ──────────────────────────────────────────────── */

const S: Record<string, React.CSSProperties> = {
  root: {
    background: "var(--ds-bg-primary)",
    height: "calc(100vh - 64px)",
    color: "var(--ds-fg)",
    paddingTop: 0,
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  glowBg: {
    position: "absolute",
    top: -200,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(900px, 90vw)",
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(57,255,20,0.04) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    height: "100%",
    maxWidth: 1400,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },
  sidebar: {
    borderRight: "1px solid var(--ds-border-muted)",
    background: "var(--ds-surface-overlay)",
    backdropFilter: "blur(12px)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflowY: "auto",
  },
  newChatBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "1.5px solid var(--ds-border-accent)",
    background: "var(--ds-accent-faint)",
    color: "var(--ds-accent)",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
    boxShadow: "var(--ds-glow-sm)",
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
    overflowY: "auto",
  },
  emptyList: {
    textAlign: "center",
    color: "var(--ds-fg-subtle)",
    fontSize: "0.78rem",
    paddingTop: 40,
  },
  chatItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid var(--ds-border-muted)",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  chatItemTitle: {
    fontSize: "0.8rem",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: 8,
    flex: 1,
  },
  chatItemDelete: {
    fontSize: "0.8rem",
    color: "var(--ds-fg-subtle)",
    padding: "2px 6px",
    borderRadius: 4,
    transition: "color 0.2s",
  },
  chatArea: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid var(--ds-border-muted)",
  },
  headerTitle: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#fff",
    margin: 0,
  },
  headerSub: {
    fontSize: "0.75rem",
    color: "var(--ds-fg-subtle)",
    margin: "2px 0 0",
  },
  dashboardLink: {
    fontSize: "0.78rem",
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 999,
    border: "1.5px solid var(--ds-border-accent)",
    color: "var(--ds-accent)",
    textDecoration: "none",
  },
  messageScrollWrap: {
    flex: 1,
    overflowY: "auto",
    padding: "0 0 40px 0",
  },
  welcomeView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "60px 24px",
    maxWidth: 600,
    margin: "0 auto",
  },
  logoPulse: {
    fontSize: "3.5rem",
    animation: "microFloat 3s ease-in-out infinite",
  },
  suggestedHeading: {
    fontSize: "0.68rem",
    letterSpacing: "0.15em",
    color: "var(--ds-fg-subtle)",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  suggestedGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    width: "100%",
  },
  suggestedCard: {
    background: "var(--ds-surface-subtle)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 12,
    padding: 16,
    textAlign: "left",
    cursor: "pointer",
    transition: "border 0.2s, background 0.2s",
  },
  suggestedText: {
    fontSize: "0.78rem",
    color: "var(--ds-fg-muted)",
    lineHeight: 1.45,
    margin: 0,
  },
  messagesList: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  bubbleRow: {
    display: "flex",
    width: "100%",
    padding: "24px 24px",
    boxSizing: "border-box",
  },
  bubbleInner: {
    maxWidth: 800,
    margin: "0 auto",
    width: "100%",
    display: "flex",
    gap: 18,
    alignItems: "flex-start",
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid var(--ds-border-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.95rem",
    flexShrink: 0,
  },
  bubbleContentWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    overflow: "hidden",
  },
  bubbleRolePill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.62rem",
    letterSpacing: "0.15em",
    fontWeight: 700,
    borderBottom: "1px solid var(--ds-border-muted)",
    paddingBottom: 4,
    marginBottom: 2,
  },
  bubbleContent: {
    fontSize: "0.9rem",
    color: "var(--ds-fg-muted)",
  },
  inputArea: {
    padding: "16px 24px 24px",
    borderTop: "1px solid var(--ds-border-muted)",
    background: "var(--ds-surface-overlay)",
  },
  inputForm: {
    maxWidth: 800,
    margin: "0 auto",
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    background: "var(--ds-surface-subtle)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 12,
    padding: "14px 18px",
    color: "#fff",
    fontSize: "0.88rem",
    fontFamily: "inherit",
    outline: "none",
  },
  sendBtn: {
    padding: "14px 24px",
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  codePre: {
    background: "var(--ds-surface-raised)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 8,
    padding: 12,
    margin: "8px 0",
    overflowX: "auto",
  },
  codeBlock: {
    fontFamily: "monospace",
    fontSize: "0.78rem",
    color: "var(--ds-fg-subtle)",
  },
  renderingBadge: {
    color: "var(--ds-fg-subtle)",
    fontSize: "0.8rem",
    padding: "12px 0",
    fontStyle: "italic",
  },
  mermaidWrapper: {
    background: "var(--ds-surface-subtle)",
    border: "1.5px solid var(--ds-border-accent)",
    borderRadius: 12,
    padding: "20px 16px",
    overflowX: "auto",
    margin: "12px 0",
    display: "flex",
    justifyContent: "center",
  },
  quizBox: {
    background: "var(--ds-surface-subtle)",
    border: "1px dashed var(--ds-border-accent)",
    borderRadius: 14,
    padding: "20px 22px",
    margin: "14px 0",
  },
  quizHeaderBadge: {
    fontSize: "0.62rem",
    letterSpacing: "0.15em",
    fontWeight: 700,
    color: "var(--ds-accent)",
    background: "var(--ds-accent-faint)",
    padding: "4px 8px",
    borderRadius: 4,
    display: "inline-block",
  },
  quizQuestionText: {
    fontSize: "0.95rem",
    fontWeight: 750,
    color: "#fff",
    margin: "12px 0 16px",
    textAlign: "left",
  },
  quizOptionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  quizOptionBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    color: "var(--ds-fg)",
    fontFamily: "inherit",
    fontSize: "0.82rem",
    transition: "all 0.15s ease",
  },
  quizExplanation: {
    background: "var(--ds-surface-raised)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 8,
    padding: 12,
    textAlign: "left",
    marginBottom: 16,
  },
  quizActionRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  quizNavBtn: {
    padding: "8px 18px",
    borderRadius: 6,
    border: "none",
    fontWeight: 700,
    fontSize: "0.78rem",
    cursor: "pointer",
  },
  quizResetBtn: {
    padding: "8px 16px",
    borderRadius: 6,
    background: "var(--ds-surface-subtle)",
    border: "1px solid var(--ds-border-muted)",
    color: "var(--ds-fg-subtle)",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--ds-bg-primary)",
    padding: 24,
    textAlign: "center",
  },
  backBtn: {
    marginTop: 20,
    padding: "10px 20px",
    borderRadius: 8,
    background: "var(--ds-accent)",
    color: "#000",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  micBtn: {
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid var(--ds-border-muted)",
    cursor: "pointer",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.25s ease",
  },
  speakBtn: {
    background: "transparent",
    border: "none",
    color: "var(--ds-fg-subtle)",
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: "0.72rem",
    marginLeft: 12,
    transition: "color 0.2s",
    borderLeft: "1px solid var(--ds-border-muted)",
    height: 16,
    display: "inline-flex",
    alignItems: "center",
  }
};
