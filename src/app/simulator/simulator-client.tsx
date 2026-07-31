"use client";

import { useCallback, useEffect, useState } from "react";
import { getLearnerId } from "@/lib/client";
import {
  WhatsAppSimulator,
  InstagramSimulator,
  PhoneCallSimulator,
  SMSNotification,
} from "@/components/social-sims/chat-sims";
import DebriefModal from "@/components/social-sims/debrief";
import TutorialModal from "@/components/tutorial";
import { Chip, Reveal } from "@/components/ui";
import {
  IconCall,
  IconFlag,
  IconGlobe,
  IconShield,
  IconSms,
  IconTarget,
  IconWhatsApp,
  IconZap,
} from "@/components/icons";
import { playVictory, playFail, playXPEarned } from "@/lib/sounds";
import type { SimPhase } from "@/db/schema";
import type { ReactNode } from "react";

interface Scenario {
  id: number;
  slug: string;
  title: string;
  platform: string;
  scammerName: string;
  scammerAvatar: string;
  scammerNumber: string;
  category: string;
  difficulty: string;
  riskLevel: string;
  phases: SimPhase[];
  redFlags: string[];
  debriefTitle: string;
  debriefBody: string;
  debriefTip: string;
  xpReward: number;
}

type SimState = "selecting" | "preparing" | "running" | "debrief";

const PLATFORM_ICONS: Record<string, ReactNode> = {
  whatsapp: <IconWhatsApp className="h-5 w-5" />,
  instagram: <IconGlobe className="h-5 w-5" />,
  call: <IconCall className="h-5 w-5" />,
  sms: <IconSms className="h-5 w-5" />,
};

export default function SimulatorClient({
  scenarios,
  platformMeta,
}: {
  scenarios: Scenario[];
  platformMeta: Record<string, any>;
}) {
  const [state, setState] = useState<SimState>("selecting");
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [outcome, setOutcome] = useState<"caught" | "fell-for-it" | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);

  const startScenario = (s: Scenario) => {
    setSelected(s);
    setState("preparing");
    setIsFinished(false);
    setOutcome(null);
    setTimeout(() => setState("running"), 1500);
  };

  const handleFinish = useCallback(
    (result: "caught" | "fell-for-it") => {
      setIsFinished(true);
      setOutcome(result);
      setState("debrief");

      if (selected) {
        fetch("/api/sim-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerId: getLearnerId(),
            scenarioId: selected.id,
            outcome: result,
          }),
        })
          .then(() => window.dispatchEvent(new Event("fraudlens:update")))
          .catch(() => {});
      }
    },
    [selected],
  );

  const closeDebrief = () => {
    setState("selecting");
    setSelected(null);
    setIsFinished(false);
    setOutcome(null);
  };

  return (
    <>
      {state === "selecting" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((s, i) => {
            const meta = platformMeta[s.platform] ?? platformMeta["sms"];
            return (
              <Reveal key={s.id} delay={i * 70}>
                <button
                  onClick={() => startScenario(s)}
                  className="group w-full rounded-2xl border border-gray-700/70 bg-[#0e1729] p-5 text-left transition-all hover:-translate-y-1 hover:border-gray-600 hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.8)]"
                >
                  <div className="flex items-start justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                      {meta.icon}
                    </span>
                    <Chip tone={s.riskLevel === "high" ? "alert" : s.riskLevel === "medium" ? "amber" : "mint"}>
                      {s.difficulty}
                    </Chip>
                  </div>
                  <h3 className="mt-4 font-display text-[16px] font-bold leading-snug text-white group-hover:text-green-400 transition-colors">
                    {s.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      {s.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-600" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      {meta.label}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-amber-400">+{s.xpReward}XP</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      )}

      {state === "preparing" && selected && (
        <div className="mt-12 flex flex-col items-center justify-center gap-6 py-20">
          <div className="relative">
            <span className="pulse-ring absolute inset-0 rounded-full border-2 border-green-500/50" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 text-green-400">
              <IconShield className="h-10 w-10" />
            </span>
          </div>
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-white">{selected.title}</h2>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.25em] text-amber-400">
              Scenario initializing...
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-green-500" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-green-500" style={{ animationDelay: "200ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-green-500" style={{ animationDelay: "400ms" }} />
          </div>
          <p className="max-w-sm text-center text-[13px] leading-relaxed text-gray-500">
            A simulated conversation is about to begin. The person you&apos;re talking to is NOT
            real. Make choices as you normally would — there are no wrong answers in training.
          </p>
        </div>
      )}

      {state === "running" && selected && (
        <div className="relative mt-8">
          {/* Discreet training badge */}
          <div className="absolute -top-7 right-0 z-50 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
            Training mode · {selected.platform.toUpperCase()}
          </div>

          {/* Phone frame */}
          <div className="mx-auto max-w-[420px] overflow-hidden rounded-[36px] border-[6px] border-gray-800 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            {/* Notch */}
            <div className="flex items-center justify-center bg-black pb-1 pt-2">
              <div className="h-5 w-32 rounded-full bg-gray-800" />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between bg-black px-6 pb-1.5 text-white">
              <span className="font-mono text-[10.5px] font-semibold">9:41</span>
              <span className="flex items-center gap-1">
                <span className="flex gap-[2px]">
                  <i className="h-1.5 w-[3px] rounded-[1px] bg-white/80" />
                  <i className="h-2.5 w-[3px] rounded-[1px] bg-white/80" />
                  <i className="h-3.5 w-[3px] rounded-[1px] bg-white/80" />
                </span>
                <span className="ml-0.5 font-mono text-[10px]">WiFi</span>
                <span className="ml-1 inline-block h-2.5 w-5 rounded-[3px] border border-white/50 p-[2px]">
                  <i className="block h-full w-3/4 rounded-[1px] bg-green-400" />
                </span>
              </span>
            </div>

            {/* App content */}
            <div className="h-[620px] overflow-hidden rounded-b-[28px]">
              {selected.platform === "whatsapp" && (
                <WhatsAppSimulator
                  scammerName={selected.scammerName}
                  scammerAvatar={selected.scammerAvatar}
                  scammerNumber={selected.scammerNumber}
                  phases={selected.phases}
                  onPhaseEnd={() => {}}
                  onFinish={handleFinish}
                  isFinished={isFinished}
                />
              )}
              {selected.platform === "instagram" && (
                <InstagramSimulator
                  scammerName={selected.scammerName}
                  scammerAvatar={selected.scammerAvatar}
                  scammerNumber={selected.scammerNumber}
                  phases={selected.phases}
                  onPhaseEnd={() => {}}
                  onFinish={handleFinish}
                  isFinished={isFinished}
                />
              )}
              {selected.platform === "call" && (
                <PhoneCallSimulator
                  scammerName={selected.scammerName}
                  scammerAvatar={selected.scammerAvatar}
                  scammerNumber={selected.scammerNumber}
                  phases={selected.phases}
                  onPhaseEnd={() => {}}
                  onFinish={handleFinish}
                  isFinished={isFinished}
                />
              )}
              {selected.platform === "sms" && (
                <div className="flex h-full flex-col bg-[#000000] p-6">
                  <p className="mb-4 font-mono text-[12px] text-gray-500">Messages</p>
                  {selected.phases[0]?.messages.map((m, i) => (
                    <div key={i} className="mb-3">
                      <SMSNotification
                        sender={selected.scammerName}
                        message={m.text}
                        onAction={(action) => {
                          if (action === "report") handleFinish("caught");
                          else if (action === "open") handleFinish("fell-for-it");
                          else handleFinish("caught");
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="mx-auto mt-5 flex justify-center">
            <div className="h-1 w-32 rounded-full bg-gray-800" />
          </div>
        </div>
      )}

      {state === "debrief" && selected && outcome && (
        <DebriefModal
          open={true}
          outcome={outcome}
          title={selected.debriefTitle}
          body={selected.debriefBody}
          tip={selected.debriefTip}
          redFlags={selected.redFlags}
          xpReward={selected.xpReward}
          onClose={closeDebrief}
        />
      )}

      {/* Judge-the-case classic mode moved below when nothing selected */}
      {state === "selecting" && (
        <div className="mt-12 border-t border-gray-700/50 pt-10">
          <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.25em] text-gray-600">
            Also available: classic judge-the-message mode
          </p>
          <div className="mt-4 text-center">
            <a
              href="/simulator-classic"
              className="inline-flex items-center gap-2 rounded-full border border-gray-600/50 bg-gray-800/50 px-5 py-2.5 font-display text-[12px] font-semibold uppercase tracking-wider text-gray-300 transition-colors hover:border-green-500/40 hover:text-green-400"
            >
               <IconFlag className="h-4 w-4" />
              Classic Verdict Mode
            </a>
          </div>
        </div>
      )}

      {/* animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-down { animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1); }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease; }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.08); }
          70% { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounceIn 0.7s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>
    </>
  );
}
