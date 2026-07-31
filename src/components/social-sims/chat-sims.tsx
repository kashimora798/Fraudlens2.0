"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { SimPhase } from "@/db/schema";

/* ---------- TTS Audio Engine ---------- */
function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 0.95;
    u.pitch = 0.85; // deeper, authoritative voice
    u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const male = voices.find(
      (v) =>
        (v.name.includes("Male") || v.name.includes("Ravi") || v.name.includes("Deep")) &&
        v.lang.includes("en"),
    );
    if (male) u.voice = male;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

/* ---------- WhatsApp Chat ---------- */
export function WhatsAppSimulator({
  scammerName,
  scammerAvatar,
  scammerNumber,
  phases,
  onPhaseEnd,
  onFinish,
  isFinished,
}: {
  scammerName: string;
  scammerAvatar: string;
  scammerNumber: string;
  phases: SimPhase[];
  onPhaseEnd: (phaseId: string) => void;
  onFinish: (outcome: "caught" | "fell-for-it") => void;
  isFinished: boolean;
}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [visibleMsgs, setVisibleMsgs] = useState<{ from: string; text: string; id: number }[]>([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phase = phases[phaseIdx];

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const addMessage = useCallback(
    (from: string, text: string) => {
      msgIdRef.current += 1;
      setVisibleMsgs((prev) => [...prev, { from, text, id: msgIdRef.current }]);
    },
    [],
  );

  // Progress through messages with typing indicators
  useEffect(() => {
    if (!phase || isFinished) return;
    if (!started) {
      const t = setTimeout(() => setStarted(true), 400);
      timerRef.current = t;
      return () => clearTimeout(t);
    }

    if (msgIdx >= phase.messages.length) return;

    const msg = phase.messages[msgIdx];
    if (msg.from === "user-option") return;

    setTyping(true);
    clearTimer();
    const t = setTimeout(() => {
      setTyping(false);
      addMessage("scammer", msg.text);
      if (msgIdx + 1 >= phase.messages.length) {
        onPhaseEnd(phase.id);
      }
      setMsgIdx((i) => i + 1);
    }, msg.delayMs);
    timerRef.current = t;
    return () => clearTimeout(t);
  }, [phase, msgIdx, started, isFinished, addMessage, onPhaseEnd]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMsgs, typing]);

  function handleChoice(nextPhase: string) {
    clearTimer();
    if (nextPhase === "caught") { onFinish("caught"); return; }
    if (nextPhase === "fell-for-it") { onFinish("fell-for-it"); return; }
    const idx = phases.findIndex((p) => p.id === nextPhase);
    if (idx >= 0) {
      setPhaseIdx(idx);
      setMsgIdx(0);
      setVisibleMsgs([]);
      setTyping(false);
      setStarted(false);
    }
  }

  const showOptions =
    phase && msgIdx >= phase.messages.length && phase.userOptions && phase.userOptions.length > 0 && !isFinished;

  return (
    <div className="flex h-full flex-col bg-[#0B141A]">
      {/* WhatsApp Header */}
      <div className="flex items-center gap-3 border-b border-[#1F2C34] bg-[#111B21] px-4 py-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A3942] font-display text-[15px] font-bold text-[#E9EDEF]">
          {scammerAvatar.slice(0, 1).toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[15px] font-medium text-[#E9EDEF]">{scammerName}</p>
          <p className="font-mono text-[11.5px] text-[#8696A0]">{typing ? "typing..." : scammerNumber}</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        <p className="mx-auto mb-3 w-fit rounded bg-[#182229] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#8696A0]">
          Today
        </p>
        {visibleMsgs.map((m) => (
          <div key={m.id} className={`mb-1.5 flex ${m.from === "scammer" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[82%] rounded-lg px-3.5 py-2 text-[13.5px] leading-[1.45] ${
                m.from === "scammer"
                  ? "rounded-tl-none bg-[#1F2C34] text-[#E9EDEF]"
                  : "rounded-tr-none bg-[#005C4B] text-[#E9EDEF]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="mb-1.5 flex justify-start">
            <div className="flex items-center gap-1 rounded-lg rounded-tl-none bg-[#1F2C34] px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696A0]" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696A0]" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696A0]" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Options */}
      {showOptions && (
        <div className="border-t border-[#1F2C34] bg-[#111B21] px-4 py-4">
          {phase.userPrompt && (
            <p className="mb-3 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#8696A0]">
              {phase.userPrompt}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {phase.userOptions!.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleChoice(opt.nextPhase)}
                className={`rounded-full px-4 py-2.5 font-display text-[12.5px] font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
                  opt.label.includes("🚩")
                    ? "border-2 border-[#FF5D5D]/70 bg-[#FF5D5D]/15 text-[#FF5D5D]"
                    : "border border-[#00A884]/50 bg-[#00A884]/15 text-[#00A884]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Instagram DM ---------- */
export function InstagramSimulator({
  scammerName,
  scammerAvatar,
  scammerNumber,
  phases,
  onPhaseEnd,
  onFinish,
  isFinished,
}: {
  scammerName: string;
  scammerAvatar: string;
  scammerNumber: string;
  phases: SimPhase[];
  onPhaseEnd: (phaseId: string) => void;
  onFinish: (outcome: "caught" | "fell-for-it") => void;
  isFinished: boolean;
}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [visibleMsgs, setVisibleMsgs] = useState<{ from: string; text: string; id: number }[]>([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phase = phases[phaseIdx];

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const addMessage = useCallback(
    (from: string, text: string) => {
      msgIdRef.current += 1;
      setVisibleMsgs((prev) => [...prev, { from, text, id: msgIdRef.current }]);
    },
    [],
  );

  useEffect(() => {
    if (!phase || isFinished) return;
    if (!started) {
      const t = setTimeout(() => setStarted(true), 400);
      timerRef.current = t;
      return () => clearTimeout(t);
    }
    if (msgIdx >= phase.messages.length) return;
    const msg = phase.messages[msgIdx];
    if (msg.from === "user-option") return;
    setTyping(true);
    clearTimer();
    const t = setTimeout(() => {
      setTyping(false);
      addMessage("scammer", msg.text);
      if (msgIdx + 1 >= phase.messages.length) onPhaseEnd(phase.id);
      setMsgIdx((i) => i + 1);
    }, msg.delayMs);
    timerRef.current = t;
    return () => clearTimeout(t);
  }, [phase, msgIdx, started, isFinished, addMessage, onPhaseEnd]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMsgs, typing]);

  function handleChoice(nextPhase: string) {
    clearTimer();
    if (nextPhase === "caught") { onFinish("caught"); return; }
    if (nextPhase === "fell-for-it") { onFinish("fell-for-it"); return; }
    const idx = phases.findIndex((p) => p.id === nextPhase);
    if (idx >= 0) {
      setPhaseIdx(idx);
      setMsgIdx(0);
      setVisibleMsgs([]);
      setTyping(false);
      setStarted(false);
    }
  }

  const showOptions =
    phase && msgIdx >= phase.messages.length && phase.userOptions && phase.userOptions.length > 0 && !isFinished;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Instagram DM Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2.5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[2px]">
            <div className="h-full w-full rounded-full bg-white" />
          </div>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-display text-[15px] font-bold text-gray-700">
            {scammerAvatar.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-[14.5px] font-semibold text-gray-900">{scammerName}</p>
          <p className="font-mono text-[11px] text-gray-400">{scammerNumber}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
        <p className="mx-auto mb-3 w-fit rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400">
          Today
        </p>
        {visibleMsgs.map((m) => (
          <div key={m.id} className={`mb-2 flex ${m.from === "scammer" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[80%] rounded-[22px] px-4 py-2.5 text-[13.5px] leading-[1.5] ${
                m.from === "scammer"
                  ? "rounded-bl-[6px] border border-gray-200 bg-gray-50 text-gray-900"
                  : "rounded-br-[6px] bg-gradient-to-br from-[#DD2A7B] to-[#8134AF] text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="mb-2 flex justify-start">
            <div className="flex items-center gap-[3px] rounded-[22px] rounded-bl-[6px] border border-gray-200 bg-gray-50 px-4 py-3">
              <span className="h-[7px] w-[7px] animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
              <span className="h-[7px] w-[7px] animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
              <span className="h-[7px] w-[7px] animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showOptions && (
        <div className="border-t border-gray-200 bg-white px-4 py-4">
          {phase.userPrompt && (
            <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
              {phase.userPrompt}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {phase.userOptions!.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleChoice(opt.nextPhase)}
                className={`rounded-full px-4 py-2.5 font-display text-[12px] font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
                  opt.label.includes("🚩")
                    ? "border-2 border-red-400 bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Phone Call ---------- */
export function PhoneCallSimulator({
  scammerName,
  scammerNumber,
  phases,
  onPhaseEnd,
  onFinish,
  isFinished,
}: {
  scammerName: string;
  scammerAvatar: string;
  scammerNumber: string;
  phases: SimPhase[];
  onPhaseEnd: (phaseId: string) => void;
  onFinish: (outcome: "caught" | "fell-for-it") => void;
  isFinished: boolean;
}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [callState, setCallState] = useState<"ringing" | "connected" | "ended">("ringing");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phase = phases[phaseIdx];

  useEffect(() => {
    if (callState === "connected" && !isFinished) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState, isFinished]);

  useEffect(() => {
    if (!phase || isFinished || callState !== "connected") return;
    if (msgIdx >= phase.messages.length) {
      onPhaseEnd(phase.id);
      return;
    }
    const msg = phase.messages[msgIdx];
    if (msg.from === "user-option") return;
    // Strip "AUDIO: " prefix
    const cleanText = msg.text.replace(/^AUDIO:\s*/i, "");

    const run = async () => {
      setSpeaking(true);
      await speak(cleanText);
      setSpeaking(false);
      setTranscript((prev) => [...prev, cleanText]);
      setMsgIdx((i) => i + 1);
    };
    const t = setTimeout(() => { run(); }, msg.delayMs);
    return () => clearTimeout(t);
  }, [phase, msgIdx, callState, isFinished, onPhaseEnd]);

  function handleChoice(nextPhase: string) {
    if (nextPhase === "caught" || nextPhase === "fell-for-it") {
      window.speechSynthesis?.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
      setCallState("ended");
      setTimeout(() => onFinish(nextPhase === "caught" ? "caught" : "fell-for-it"), 600);
      return;
    }
    const idx = phases.findIndex((p) => p.id === nextPhase);
    if (idx >= 0) {
      setPhaseIdx(idx);
      setMsgIdx(0);
      setTranscript([]);
    }
  }

  const showOptions =
    phase && msgIdx >= phase.messages.length && phase.userOptions && phase.userOptions.length > 0 && !isFinished;

  const timerStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#0a0f1a] via-[#0e1525] to-[#0a0f1a] px-6 py-8">
      {callState === "ringing" ? (
        <>
          <div className="relative mb-5">
            <span className="pulse-ring absolute inset-0 rounded-full border-2 border-red-500/60" />
            <span className="pulse-ring-slow absolute inset-0 rounded-full border border-red-500/30" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 text-4xl">
              👮
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">{scammerName}</h2>
          <p className="mt-1 font-mono text-[13px] text-gray-400">
            {scammerNumber}
            <span className="ml-2 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-red-400">
              CBI Delhi
            </span>
          </p>
          <p className="mt-3 animate-pulse font-mono text-[11px] uppercase tracking-[0.25em] text-green-400">
            Incoming call...
          </p>
          <div className="mt-10 flex gap-8">
            <button
              onClick={() => { handleChoice("caught"); }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-white shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-all hover:scale-110 active:scale-95"
            >
              ✕
            </button>
            <button
              onClick={() => setCallState("connected")}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white shadow-[0_0_30px_rgba(0,255,0,0.4)] transition-all hover:scale-110 active:scale-95"
            >
              ✓
            </button>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Decline &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Answer</p>
        </>
      ) : callState === "connected" ? (
        <>
          <div className="relative mb-3">
            {speaking && (
              <>
                <span className="pulse-ring absolute inset-0 rounded-full border-2 border-green-500/40" />
                <span className="pulse-ring-slow absolute inset-0 rounded-full border border-green-500/20" />
              </>
            )}
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 text-3xl">
              👮
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">{scammerName}</h2>
          <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-green-400">{timerStr}</p>
          {speaking && (
            <p className="mt-2 animate-pulse font-mono text-[11px] uppercase tracking-[0.25em] text-green-400/80">
              Speaking...
            </p>
          )}
          {transcript.length > 0 && (
            <div className="mt-4 max-h-[140px] w-full max-w-md overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-900/70 p-3.5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Call transcript</p>
              {transcript.map((t, i) => (
                <p key={i} className="mt-1 flex gap-2 text-[13px] leading-relaxed text-gray-200">
                  <span className="text-red-400 shrink-0">▸</span>
                  {t}
                </p>
              ))}
            </div>
          )}
          {showOptions && (
            <div className="mt-5 w-full max-w-md">
              {phase.userPrompt && (
                <p className="mb-3 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-gray-400">
                  {phase.userPrompt}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-2.5">
                {phase.userOptions!.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleChoice(opt.nextPhase)}
                    className={`rounded-full px-5 py-3 font-display text-[12.5px] font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
                      opt.label.includes("🚩")
                        ? "border-2 border-red-500/70 bg-red-500/15 text-red-400 hover:bg-red-500/25"
                        : "border border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => { window.speechSynthesis?.cancel(); handleChoice("caught"); }}
            className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all hover:scale-110 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
            </svg>
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="font-display text-xl font-bold text-red-400">Call ended</p>
          <p className="mt-2 font-mono text-[12px] text-gray-400">Duration: {timerStr}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- SMS Notification ---------- */
export function SMSNotification({
  sender,
  message,
  onAction,
}: {
  sender: string;
  message: string;
  onAction: (action: "open" | "dismiss" | "report") => void;
}) {
  return (
    <div className="mx-auto w-full max-w-sm animate-slide-down rounded-2xl bg-[#1C1C1E]/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700 text-lg">
          ⚡
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[13.5px] font-semibold text-white">{sender}</p>
            <span className="font-mono text-[10px] text-gray-500">now</span>
          </div>
          <p className="mt-0.5 line-clamp-3 text-[13px] leading-snug text-gray-300">{message}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onAction("dismiss")}
          className="flex-1 rounded-lg bg-gray-700/50 py-2 font-display text-[12px] font-semibold text-gray-300 transition-colors hover:bg-gray-700"
        >
          Dismiss
        </button>
        <button
          onClick={() => onAction("open")}
          className="flex-1 rounded-lg bg-blue-600 py-2 font-display text-[12px] font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Open
        </button>
        <button
          onClick={() => onAction("report")}
          className="flex-1 rounded-lg border border-red-500/40 bg-red-500/10 py-2 font-display text-[12px] font-semibold text-red-400 transition-colors hover:bg-red-500/20"
        >
          Report 🚩
        </button>
      </div>
    </div>
  );
}
