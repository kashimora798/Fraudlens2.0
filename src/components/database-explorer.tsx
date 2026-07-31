"use client";

import { useMemo, useState } from "react";
import type { ScamCase } from "@/lib/types";
import { CHANNEL_LABEL } from "@/lib/meta";
import { Chip } from "./ui";
import { ChannelIcon, IconCheck, IconFlag, IconSearch, IconX } from "./icons";

const RISK_TONE: Record<string, "alert" | "amber" | "mint"> = {
  high: "alert",
  medium: "amber",
  low: "mint",
};

export default function DatabaseExplorer({ cases }: { cases: ScamCase[] }) {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [category, setCategory] = useState("all");
  const [nature, setNature] = useState("all"); // all | scam | legit
  const [risk, setRisk] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const categories = useMemo(
    () => [...new Set(cases.map((c) => c.category))].sort(),
    [cases],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (channel !== "all" && c.channel !== channel) return false;
      if (category !== "all" && c.category !== category) return false;
      if (risk !== "all" && c.riskLevel !== risk) return false;
      if (nature === "scam" && !c.isScam) return false;
      if (nature === "legit" && c.isScam) return false;
      if (q) {
        const hay = `${c.title} ${c.content} ${c.sender} ${c.category} ${c.redFlags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cases, query, channel, category, risk, nature]);

  return (
    <div>
      {/* filter bar */}
      <div className="rounded-xl border border-line bg-panel/70 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-lg border border-line bg-deep px-3.5 py-2.5 focus-within:border-cyan/60">
            <IconSearch className="h-4 w-4 shrink-0 text-fog" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cases, keywords, senders…"
              className="w-full bg-transparent font-mono text-[13px] text-snow placeholder:text-fog/50 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-fog hover:text-alert">
                <IconX className="h-3.5 w-3.5" />
              </button>
            )}
          </label>

          <select
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            className="rounded-lg border border-line bg-deep px-3 py-2.5 font-mono text-[12px] uppercase tracking-wider text-fog focus:border-cyan/60 focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="scam">Scams</option>
            <option value="legit">Legit messages</option>
          </select>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="rounded-lg border border-line bg-deep px-3 py-2.5 font-mono text-[12px] uppercase tracking-wider text-fog focus:border-cyan/60 focus:outline-none"
          >
            <option value="all">All channels</option>
            {Object.entries(CHANNEL_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-line bg-deep px-3 py-2.5 font-mono text-[12px] uppercase tracking-wider text-fog focus:border-cyan/60 focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="rounded-lg border border-line bg-deep px-3 py-2.5 font-mono text-[12px] uppercase tracking-wider text-fog focus:border-cyan/60 focus:outline-none"
          >
            <option value="all">Any risk</option>
            <option value="high">High risk</option>
            <option value="medium">Medium risk</option>
            <option value="low">Low risk</option>
          </select>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fog/70">
          {filtered.length} of {cases.length} case files match
        </p>
      </div>

      {/* rows */}
      <div className="mt-5 space-y-3">
        {filtered.map((c) => {
          const isOpen = open === c.id;
          const catchRate = c.timesJudged > 0 ? Math.round((100 * c.timesCaught) / c.timesJudged) : null;
          return (
            <div
              key={c.id}
              className={`overflow-hidden rounded-xl border transition-colors ${
                isOpen ? "border-cyan/50 bg-panel" : "border-line bg-panel/60 hover:border-line hover:bg-panel"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-panel2 text-cyan">
                  <ChannelIcon channel={c.channel} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] tracking-widest text-fog">{c.caseCode}</span>
                    <Chip tone={c.isScam ? "alert" : "mint"}>{c.isScam ? "Scam" : "Legit"}</Chip>
                    <Chip tone={RISK_TONE[c.riskLevel] ?? "fog"}>{c.riskLevel} risk</Chip>
                    <span className="hidden font-mono text-[10.5px] uppercase tracking-widest text-fog/70 sm:inline">
                      {c.category} · {c.difficulty}
                    </span>
                  </span>
                  <span className="mt-1.5 block truncate font-display text-[15px] font-bold text-snow">
                    {c.title}
                  </span>
                </span>
                <span className={`font-display text-lg text-fog transition-transform ${isOpen ? "rotate-90 text-cyan" : ""}`}>
                  ›
                </span>
              </button>

              {isOpen && (
                <div className="feed-in border-t border-line/70 px-5 py-5">
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-fog">
                        Message as received
                      </p>
                      <div className="mt-2.5 rounded-lg border border-line/70 bg-deep/70 p-4">
                        <p className="font-mono text-[11.5px] text-amber">
                          From: {c.meta.from ?? c.meta.url ?? c.sender}
                        </p>
                        {c.meta.subject && (
                          <p className="mt-1 font-mono text-[11.5px] text-fog">Subject: {c.meta.subject}</p>
                        )}
                        <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-snow/95">
                          {c.content}
                        </p>
                      </div>
                      <p className="mt-4 text-[13.5px] leading-relaxed text-fog">
                        <span className="font-semibold text-cyan">Debrief: </span>
                        {c.explanation}
                      </p>
                      <p className="mt-3 rounded-lg border border-amber/30 bg-amber/5 px-4 py-3 text-[13px] leading-relaxed text-snow/90">
                        <span className="font-semibold text-amber">Field tip: </span>
                        {c.tip}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-alert">
                        Red flags on file
                      </p>
                      {c.redFlags.length > 0 ? (
                        <ul className="mt-3 space-y-2.5">
                          {c.redFlags.map((f) => (
                            <li key={f} className="flex gap-2.5 text-[13px] leading-relaxed text-snow/90">
                              <IconFlag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-alert" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 flex items-start gap-2.5 rounded-lg border border-mint/30 bg-mint/5 px-4 py-3 text-[13px] leading-relaxed text-snow/90">
                          <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                          Clean message — confirms your action, asks nothing, links nothing.
                        </p>
                      )}
                      <div className="mt-5 border-t border-line/60 pt-4">
                        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-fog">
                          <span>Caught by trainees</span>
                          <span>{catchRate !== null ? `${catchRate}% of ${c.timesJudged}` : "Not tested yet"}</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/50">
                          <div
                            className={`h-full rounded-full ${c.isScam ? "bg-alert/80" : "bg-mint/80"}`}
                            style={{ width: `${catchRate ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!filtered.length && (
          <div className="rounded-xl border border-dashed border-line py-16 text-center">
            <IconSearch className="mx-auto h-8 w-8 text-line" />
            <p className="mt-3 font-display text-lg font-bold text-fog">No matching case files</p>
            <p className="mt-1 text-[13.5px] text-fog/70">Loosen the filters or clear the search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
