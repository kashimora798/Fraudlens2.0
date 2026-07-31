"use client";

import { useEffect, useState } from "react";
import { Chip, Stamp } from "@/components/ui";
import { IconCheck, IconFlag, IconShield, IconZap } from "@/components/icons";

export default function DebriefModal({
  open,
  outcome,
  title,
  body,
  tip,
  redFlags,
  xpReward,
  onClose,
}: {
  open: boolean;
  outcome: "caught" | "fell-for-it";
  title: string;
  body: string;
  tip: string;
  redFlags: string[];
  xpReward: number;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<"reveal" | "details">("reveal");

  useEffect(() => {
    if (open) {
      setStage("reveal");
      setShow(true);
      const t = setTimeout(() => setStage("details"), 2800);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* reveal stage */}
      {stage === "reveal" && (
        <div className="relative z-10 flex flex-col items-center gap-6 text-center animate-bounce-in">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-500/20 shadow-[0_0_60px_rgba(255,0,0,0.5)]">
            <IconShield className="h-14 w-14 text-red-400" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-red-400 sm:text-5xl">
            IT WAS A SCAM
          </h1>
          <p className="max-w-md text-lg text-gray-300">
            This entire conversation was a simulation. None of it was real.
          </p>
          <p className="animate-pulse font-mono text-[13px] uppercase tracking-[0.3em] text-gray-500">
            Training complete...
          </p>
        </div>
      )}

      {/* details stage */}
      {stage === "details" && (
        <div className="relative z-10 w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl border border-gray-700 bg-[#0e1729] shadow-2xl">
          {/* header */}
          <div className={`px-6 py-5 ${outcome === "caught" ? "bg-green-500/10" : "bg-red-500/10"}`}>
            <div className="flex items-center gap-4">
              <Stamp tone={outcome === "caught" ? "mint" : "alert"}>
                {outcome === "caught" ? "YOU CAUGHT IT! 🎯" : "YOU GOT CAUGHT 💀"}
              </Stamp>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-white">{title}</h2>
          </div>

          {/* body */}
          <div className="space-y-5 px-6 py-5">
            <p className="text-[14px] leading-relaxed text-gray-300">{body}</p>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-amber-400">
                <IconZap className="h-3.5 w-3.5" />
                Field tip
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-gray-200">{tip}</p>
            </div>

            {redFlags.length > 0 && (
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-red-400">
                  Red flags in this scenario
                </p>
                <ul className="mt-3 space-y-2.5">
                  {redFlags.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed text-gray-300">
                      <IconFlag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3">
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-green-400">
                XP earned
              </span>
              <span className="font-display text-2xl font-bold text-green-400">
                +{outcome === "caught" ? xpReward : Math.round(xpReward * 0.3)} XP
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-green-500 py-3.5 font-display text-[14px] font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-[0_12px_30px_-10px_rgba(0,255,0,0.4)] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <IconCheck className="h-4 w-4" />
                Continue training
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
