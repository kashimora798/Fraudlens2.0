"use client";

import { useState, useEffect } from "react";
import { IconCheck, IconX, IconZap, IconShield, IconTarget, IconStar, IconArrow } from "@/components/icons";

const FEATURES = [
  {
    title: "🎯 Immersive Simulations",
    desc: "Step inside WhatsApp chats, Instagram DMs, and phone calls with real audio. Messages arrive with typing indicators and progressive dialogue trees.",
    icon: <IconTarget className="h-6 w-6 text-cyan-400" />,
  },
  {
    title: "📞 Phone Call Scams",
    desc: "Receive calls from 'CBI officers' with real voice synthesis. The browser's Web Speech API creates authentic Indian-English voices.",
    icon: <IconZap className="h-6 w-6 text-yellow-400" />,
  },
  {
    title: "🏆 Leaderboard",
    desc: "Compete with other agents. Track your XP, accuracy, and rank globally. Climb from Recruit to Legend.",
    icon: <IconStar className="h-6 w-6 text-amber-400" />,
  },
  {
    title: "🎓 Academy",
    desc: "8 short lessons covering OTP discipline, phishing links, UPI safety, and the golden-hour recovery drill.",
    icon: <IconShield className="h-6 w-6 text-mint" />,
  },
  {
    title: "📊 Message Scanner",
    desc: "Paste any suspicious message and our 17-rule engine will flag panic words, fake domains, credential asks, and more.",
    icon: <IconCheck className="h-6 w-6 text-green-400" />,
  },
  {
    title: "💾 Progress Tracking",
    desc: "Your XP, streaks, badges, and lesson progress are saved across sessions using your unique agent ID.",
    icon: <IconShield className="h-6 w-6 text-purple-400" />,
  },
];

export default function WhatsNewModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem("fraudlens-whatsnew-last");
    const version = "2.0";
    if (lastSeen !== version) {
      setVisible(true);
    }
  }, []);

  const close = () => {
    setVisible(false);
    localStorage.setItem("fraudlens-whatsnew-last", "2.0");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-[#0a1120] p-8 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              What&apos;s New in FraudLens 2.0
            </h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400">
              Hackathon Edition
            </p>
          </div>
          <button
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 bg-gray-800/50 text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group flex gap-4 rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 transition-all hover:border-cyan-500/30"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                {f.icon}
              </span>
              <div>
                <h3 className="font-display text-[14px] font-bold text-white">
                  {f.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-400">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <a
            href="/simulator"
            onClick={close}
            className="flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-black transition-all hover:bg-cyan-400"
          >
            Try it now
            <IconArrow className="h-4 w-4" />
          </a>
          <button
            onClick={close}
            className="rounded-full border border-gray-600 px-6 py-2.5 font-display text-[13px] font-semibold uppercase tracking-wider text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
