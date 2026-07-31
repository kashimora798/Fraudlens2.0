"use client";

import { useState, useEffect } from "react";
import { IconCheck, IconX, IconShield, IconTarget, IconZap, IconArrow } from "@/components/icons";

export default function TutorialModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("fraudlens-tutorial-seen");
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const close = () => {
    setVisible(false);
    localStorage.setItem("fraudlens-tutorial-seen", "true");
    onComplete();
  };

  if (!visible) return null;

  const steps = [
    {
      title: "Welcome to FraudLens",
      content: "This is a cyber-defense training simulator. You'll face realistic scam scenarios and learn to spot red flags before real fraud can reach you.",
      icon: <IconShield className="h-12 w-12 text-cyan-400" />,
    },
    {
      title: "Immersive Simulations",
      content: "Step inside WhatsApp chats, Instagram DMs, and phone calls. Messages arrive in real-time with typing indicators and audio. Make choices as you normally would.",
      icon: <IconTarget className="h-12 w-12 text-green-400" />,
    },
    {
      title: "The Big Reveal",
      content: "When each scenario ends, you'll find out if you caught the scam or fell for it. Every choice is a learning moment — there are no wrong answers in training.",
      icon: <IconZap className="h-12 w-12 text-yellow-400" />,
    },
    {
      title: "Earn XP & Badges",
      content: "Every scam you catch earns XP. Build streaks, unlock badges, and climb the leaderboard. Your progress is saved across sessions.",
      icon: <IconCheck className="h-12 w-12 text-mint" />,
    },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#0a1120] p-8 shadow-2xl shadow-cyan-500/10">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            {current.icon}
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-white">
            {current.title}
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-gray-400">
            {current.content}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  i === step ? "bg-cyan-400" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-black transition-all hover:bg-cyan-400"
              >
                Next
                <IconArrow className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={close}
                className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-black transition-all hover:bg-green-400"
              >
                Start training
                <IconArrow className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800/50 text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
