"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Zap } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string }

const SUGGESTED = [
  "Which zones need the most volunteers?",
  "Show me critical healthcare needs",
  "How can I improve volunteer match scores?",
  "What events are coming up this week?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm **NEXUS-ALLOC**, your AI coordination intelligence for HelpConnect. I can help you analyze volunteer needs, optimize assignments, and provide real-time insights. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    setLoading(false);
    setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "Sorry, I couldn't process that." }]);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 9rem)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--green-dark)" }}>
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--ink)" }}>NEXUS-ALLOC</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>AI Coordination Intelligence · Live DB Context</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs" style={{ color: "var(--muted)" }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "" : ""}`}
                style={{ background: m.role === "user" ? "var(--green-dark)" : "var(--green-pale)" }}>
                {m.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} style={{ color: "var(--green-dark)" }} />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user" ? "text-white rounded-tr-sm" : "border-l-4 rounded-tl-sm"
              }`}
                style={{
                  background: m.role === "user" ? "var(--green-dark)" : "white",
                  borderLeftColor: m.role !== "user" ? "var(--green-accent)" : undefined,
                  color: m.role === "user" ? "white" : "var(--ink)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--green-pale)" }}>
                <Bot size={14} style={{ color: "var(--green-dark)" }} />
              </div>
              <div className="px-4 py-3 rounded-2xl border-l-4 bg-white flex items-center gap-1" style={{ borderLeftColor: "var(--green-accent)" }}>
                {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--green-accent)", animationDelay: `${i * 150}ms` }} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 py-3">
          {SUGGESTED.map(s => (
            <button key={s} onClick={() => send(s)}
              className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-green-700 hover:text-green-800"
              style={{ borderColor: "var(--green-light)", color: "var(--muted)" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--green-pale)" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
          style={{ borderColor: "var(--green-light)", background: "var(--green-pale)" }}
          placeholder="Ask NEXUS-ALLOC anything…" />
        <button id="send-chat" onClick={() => send()} disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
          style={{ background: "var(--green-dark)" }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
