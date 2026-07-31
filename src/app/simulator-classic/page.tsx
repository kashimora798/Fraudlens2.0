"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CaseMock from "@/components/casemock";
import { Chip, Kicker, Stamp } from "@/components/ui";
import { IconAlert, IconArrow, IconCheck, IconFlag, IconZap } from "@/components/icons";
import { getLearnerId } from "@/lib/client";
import type { ScamCase } from "@/lib/types";
import { CHANNEL_LABEL } from "@/lib/meta";

type Phase = "loading" | "answering" | "revealed";

interface VerdictResult {
  correct: boolean;
  isScam: boolean;
  title: string;
  category: string;
  redFlags: string[];
  explanation: string;
  tip: string;
  xpEarned: number;
  streak: number;
  xp: number;
}

const CHECKLIST = [
  "Who is the sender — really? Check the number / domain, not the display name.",
  "Any link? Read the domain right-to-left. .top, .xyz, bit.ly = traps.",
  "Pressure words? 'Within 24 hours', 'blocked', 'last chance' manufacture panic.",
  "Where does money or data flow? Paying to receive is always fraud.",
];

export default function ClassicSimulator() {
  const [channel, setChannel] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [phase, setPhase] = useState<Phase>("loading");
  const [current, setCurrent] = useState<ScamCase | null>(null);
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState({ judged: 0, correct: 0, streak: 0 });
  const excludeRef = useRef<number[]>([]);

  const loadCase = useCallback(async (ch: string, diff: string) => {
    setPhase("loading");
    setResult(null);
    try {
      const params = new URLSearchParams();
      if (ch !== "all") params.set("channel", ch);
      if (diff !== "all") params.set("difficulty", diff);
      if (excludeRef.current.length) params.set("exclude", excludeRef.current.join(","));
      const res = await fetch(`/api/case?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("no case");
      const c = (await res.json()) as ScamCase;
      excludeRef.current = [...excludeRef.current.slice(-5), c.id];
      setCurrent(c);
      setPhase("answering");
    } catch {
      setPhase("loading");
    }
  }, []);

  useEffect(() => { loadCase(channel, difficulty); }, [channel, difficulty, loadCase]);

  async function judge(verdict: "scam" | "legit") {
    if (!current || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerId: getLearnerId(), caseId: current.id, verdict }),
      });
      if (!res.ok) throw new Error("verdict failed");
      const r = (await res.json()) as VerdictResult;
      setResult(r);
      setPhase("revealed");
      setSession((s) => ({
        judged: s.judged + 1,
        correct: s.correct + (r.correct ? 1 : 0),
        streak: r.streak,
      }));
      window.dispatchEvent(new Event("fraudlens:update"));
    } finally {
      setBusy(false);
    }
  }

  const channels = ["all", "sms", "whatsapp", "email", "website", "call", "upi"];
  const difficulties = ["all", "easy", "medium", "hard"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Classic verdict mode</Kicker>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Judge the intercept
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-400">
            Read each message, hunt the red flags, then stamp your verdict. Some are
            legitimate — precision beats paranoia.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-gray-700 bg-[#0e1729] px-4 py-3">
          <div className="text-center"><p className="font-display text-xl font-bold text-white">{session.judged}</p><p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-gray-400">Judged</p></div>
          <span className="h-8 w-px bg-gray-700" />
          <div className="text-center"><p className="font-display text-xl font-bold text-green-400">{session.correct}</p><p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-gray-400">Correct</p></div>
          <span className="h-8 w-px bg-gray-700" />
          <div className="text-center"><p className="flex items-center gap-1 font-display text-xl font-bold text-amber-400"><IconZap className="h-4 w-4" />{session.streak}</p><p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-gray-400">Streak</p></div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Channel</span>
          {channels.map((ch) => (
            <button key={ch} onClick={() => setChannel(ch)} className={`rounded-md px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-wider transition-colors ${channel === ch ? "bg-green-500 text-black" : "border border-gray-700 bg-[#0e1729] text-gray-400 hover:border-green-500/40 hover:text-white"}`}>{ch === "all" ? "All" : CHANNEL_LABEL[ch]}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Difficulty</span>
          {difficulties.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} className={`rounded-md px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-wider transition-colors ${difficulty === d ? "bg-cyan-500 text-black" : "border border-gray-700 bg-[#0e1729] text-gray-400 hover:border-cyan-500/40 hover:text-white"}`}>{d === "all" ? "Any" : d}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          {phase === "loading" ? (
            <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-gray-700 bg-[#0e1729]/60">
              <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.25em] text-gray-500"><span className="h-2 w-2 animate-ping rounded-full bg-green-500" />Pulling case file…</p>
            </div>
          ) : current ? (
            <div key={current.id} className="feed-in"><CaseMock c={current} /></div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          {phase !== "revealed" ? (
            <>
              <div className="rounded-xl border border-gray-700 bg-[#0e1729]/70 p-6">
                <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-cyan-400"><IconAlert className="h-3.5 w-3.5" />Analysis checklist</p>
                <ul className="mt-4 space-y-3">
                  {CHECKLIST.map((item) => (
                    <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed text-gray-400"><IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-500/70" />{item}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => judge("scam")} disabled={phase !== "answering" || busy} className="group rounded-xl border-2 border-red-500/50 bg-red-500/5 px-4 py-6 transition-all enabled:hover:-translate-y-1 enabled:hover:bg-red-500/15 enabled:hover:shadow-[0_16px_50px_-16px_rgba(255,93,93,0.5)] disabled:opacity-40">
                  <IconFlag className="mx-auto h-7 w-7 text-red-400 transition-transform group-hover:scale-110" />
                  <span className="mt-3 block font-display text-base font-bold uppercase tracking-widest text-red-400">Flag as scam</span>
                </button>
                <button onClick={() => judge("legit")} disabled={phase !== "answering" || busy} className="group rounded-xl border-2 border-green-500/50 bg-green-500/5 px-4 py-6 transition-all enabled:hover:-translate-y-1 enabled:hover:bg-green-500/15 enabled:hover:shadow-[0_16px_50px_-16px_rgba(53,226,174,0.5)] disabled:opacity-40">
                  <IconCheck className="mx-auto h-7 w-7 text-green-400 transition-transform group-hover:scale-110" />
                  <span className="mt-3 block font-display text-base font-bold uppercase tracking-widest text-green-400">Mark legit</span>
                </button>
              </div>
            </>
          ) : result && (
            <div className="feed-in flex flex-col gap-5">
              <div className={`relative overflow-hidden rounded-xl border p-6 ${result.correct ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`font-mono text-[10.5px] uppercase tracking-[0.25em] ${result.correct ? "text-green-400" : "text-red-400"}`}>{result.correct ? "Verdict confirmed" : "Verdict overturned"}</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-white">{result.title}</h2>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-400">{result.explanation}</p>
                  </div>
                  <Stamp tone={result.correct ? "mint" : result.isScam ? "alert" : "amber"}>{result.correct ? result.isScam ? "Good catch" : "Correct call" : result.isScam ? "You got caught" : "False alarm"}</Stamp>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Chip tone={result.correct ? "mint" : "alert"}><IconZap className="h-3 w-3" />+{result.xpEarned} XP</Chip>
                  <Chip tone="amber">Streak ×{result.streak}</Chip>
                  <Chip tone="cyan">{result.category}</Chip>
                </div>
              </div>
              {result.isScam && result.redFlags.length > 0 && (
                <div className="rounded-xl border border-gray-700 bg-[#0e1729]/70 p-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-red-400">Red flags</p>
                  <ul className="mt-4 space-y-3">{result.redFlags.map((f: string) => (<li key={f} className="flex gap-3 text-[13.5px] leading-relaxed text-gray-200"><IconFlag className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />{f}</li>))}</ul>
                </div>
              )}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-amber-400">Field tip</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-gray-200">{result.tip}</p>
              </div>
              <button onClick={() => loadCase(channel, difficulty)} className="group flex items-center justify-center gap-3 rounded-xl bg-green-500 px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-black transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-12px_rgba(53,226,174,0.6)]">Next case <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
