"use client";

import { useEffect, useState } from "react";
import { IconShield } from "@/components/icons";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-[#0a1120] via-[#070c16] to-[#0a1120]">
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-mint/40" style={{ clipPath: `inset(0 0 0 ${100 - progress}%)` }} />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/10 to-mint-500/10">
            <IconShield className="h-12 w-12 animate-pulse text-cyan-400" />
          </div>
        </div>
        <p className="mt-6 font-display text-xl font-bold text-white">
          FRAUD<span className="text-mint">LENS</span>
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gray-500">
          Initializing scam defense systems...
        </p>
        <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-mint-400 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
