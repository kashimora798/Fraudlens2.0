"use client";

import { useState } from "react";
import { IconAlert, IconCheck, IconLink } from "@/components/icons";

export default function ShareButton({
  text,
  title,
  className = "",
}: {
  text: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const shareData = {
    title: title || "FraudLens - Scam Defense Simulator",
    text: text,
    url: typeof window !== "undefined" ? window.location.href : "https://fraudlens.vercel.app",
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setCopied(true);
        setShow(true);
        setTimeout(() => setShow(false), 2000);
      }
    } catch (e) {
      // User cancelled or error
      console.log("Share cancelled or failed:", e);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 rounded-full border border-gray-600/50 bg-gray-800/50 px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-wider text-gray-300 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400 ${className}`}
      >
        <IconLink className="h-4 w-4" />
        Share
      </button>

      {show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 backdrop-blur-sm">
            <IconCheck className="h-5 w-5 text-green-400" />
            <span className="font-display text-[13px] font-semibold text-green-400">
              Link copied!
            </span>
          </div>
        </div>
      )}
    </>
  );
}
