"use client";

import { useEffect, useState } from "react";
import type { ScamCase } from "@/lib/types";
import { CHANNEL_LABEL } from "@/lib/meta";
import { ChannelIcon } from "./icons";

export default function InterceptFeed({ cases }: { cases: ScamCase[] }) {
  const [idx, setIdx] = useState(0);
  const list = cases.length ? cases : [];

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 4200);
    return () => clearInterval(t);
  }, [list.length]);

  if (!list.length) return null;
  const c = list[idx % list.length];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-alert/60" />
            <span className="relative h-2 w-2 rounded-full bg-alert" />
          </span>
          Live intercepts
        </p>
        <p className="font-mono text-[10px] tracking-widest text-fog/70">
          {String((idx % list.length) + 1).padStart(2, "0")}/{String(list.length).padStart(2, "0")}
        </p>
      </div>

      <div key={c.id} className="feed-in mt-2 rounded-lg border border-line bg-panel/90 p-3.5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-panel2 text-cyan">
            <ChannelIcon channel={c.channel} className="h-4 w-4" />
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-cyan">
            {CHANNEL_LABEL[c.channel] ?? c.channel}
          </span>
          <span className="ml-auto font-mono text-[10px] text-fog/70">{c.caseCode}</span>
        </div>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-snow/90">{c.content}</p>
        <div className="mt-2.5 h-0.5 overflow-hidden rounded-full bg-line/60">
          <div key={`bar-${c.id}`} className="feed-bar h-full rounded-full bg-mint/70" />
        </div>
      </div>
    </div>
  );
}
