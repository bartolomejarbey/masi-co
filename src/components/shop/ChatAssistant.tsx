"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { X, Send, MessageCircle } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatAssistant() {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Omlouvám se, zkuste to znovu." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Nepodařilo se spojit s asistentem. Zkuste to za chvíli." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Fully dismissed — show only small reopen button
  if (dismissed && !open) {
    return (
      <button
        onClick={() => { setDismissed(false); setOpen(true); }}
        className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#CC1939] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Otevřít chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  // Chat window open
  if (open) {
    return (
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 bg-[#CC1939] px-4 py-3 text-white">
          <span className="text-2xl" role="img" aria-label="robot">
            🤖
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">MASI-CO Asistent</p>
            <p className="text-xs opacity-80">Poradíme s výběrem</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 transition-colors hover:bg-white/20"
            aria-label="Zavřít chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="rounded-xl bg-white px-4 py-3 text-sm text-gray-700 shadow-sm border border-gray-100">
              Ahoj! Jsem MASI-CO asistent. Poradím s výběrem masa, uzenin
              nebo hotových jídel. Na co se chcete zeptat?
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#CC1939] text-white"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napište zprávu..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#CC1939] focus:ring-1 focus:ring-[#CC1939]/30"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#CC1939] text-white transition-all hover:bg-[#A81430] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Odeslat"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    );
  }

  // Default: mascot bubble with greeting
  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex items-end gap-3">
      {/* Speech bubble */}
      <div className="relative max-w-[260px] rounded-2xl rounded-br-md bg-white px-5 py-4 shadow-xl border border-gray-200 animate-[fadeSlideIn_0.5s_ease-out_0.3s_both]">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs transition-colors hover:bg-gray-300 hover:text-gray-700"
          aria-label="Zavřít"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <p className="text-sm text-gray-800 leading-relaxed">
          Potřebujete pomoci s výběrem nebo máte dotaz?
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full rounded-full bg-[#CC1939] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#A81430] hover:shadow-md"
        >
          Napište nám
        </button>
      </div>

      {/* Mascot */}
      <button
        onClick={() => setOpen(true)}
        className="flex-shrink-0 animate-[fadeSlideIn_0.5s_ease-out] cursor-pointer"
        aria-label="Otevřít chat s asistentem"
      >
        <div className="relative h-16 w-16 rounded-full bg-[#CC1939] shadow-lg flex items-center justify-center transition-transform hover:scale-110">
          <span className="text-3xl animate-[wave_2s_ease-in-out_infinite]" role="img" aria-label="robot">
            🤖
          </span>
        </div>
      </button>
    </div>
  );
}
