"use client";

import { useEffect, useState } from "react";
import { fetchLearner, getLearnerId } from "@/lib/client";
import { BADGES, CHANNEL_LABEL, levelFor } from "@/lib/meta";
import { LESSONS, TOTAL_LESSONS } from "@/lib/lessons";
import type { LearnerStats } from "@/lib/types";
import { Chip, Kicker } from "@/components/ui";
import {
  ChannelIcon,
  IconCheck,
  IconLock,
  IconScan,
  IconShield,
  IconTrophy,
  IconX,
  IconZap,
} from "@/components/icons";

export default function DashboardPage() {
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLearner()
      .then((s) => {
        setStats(s);
        setName(s.name);
      })
      .catch(() => setStats(null));
  }, []);

  async function saveName() {
    if (!stats || saving || name.trim() === stats.name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/learner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: getLearnerId(), name: name.trim() }),
      });
      if (res.ok) {
        const s = (await res.json()) as LearnerStats;
        setStats(s);
        window.dispatchEvent(new Event("fraudlens:update"));
      }
    } finally {
      setSaving(false);
    }
  }

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.25em] text-fog">
          <span className="h-2 w-2 animate-ping rounded-full bg-mint" />
          Opening your dossier…
        </p>
      </div>
    );
  }

  const level = levelFor(stats.xp);
  const accuracy = stats.attempts > 0 ? Math.round((100 * stats.correct) / stats.attempts) : null;
  const badgeStats = {
    attempts: stats.attempts,
    correct: stats.correct,
    bestStreak: stats.bestStreak,
    lessonsDone: stats.lessonsDone,
    totalLessons: TOTAL_LESSONS,
    scansRun: stats.scansRun,
  };
  const maxCat = Math.max(1, ...stats.byCategory.map((b) => b.attempts));

  const tiles = [
    { label: "Total XP", value: String(stats.xp), tone: "text-mint" },
    { label: "Accuracy", value: accuracy !== null ? `${accuracy}%` : "—", tone: "text-cyan" },
    { label: "Cases judged", value: String(stats.attempts), tone: "text-snow" },
    { label: "Current streak", value: `×${stats.currentStreak}`, tone: "text-amber" },
    { label: "Best streak", value: `×${stats.bestStreak}`, tone: "text-amber" },
    { label: "Scans run", value: String(stats.scansRun), tone: "text-cyan" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Kicker>Agent dossier</Kicker>

      {/* header card */}
      <div className="relative mt-5 overflow-hidden rounded-xl border border-line bg-panel/70 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.05]">
          <IconShield className="h-64 w-64 text-mint" />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-mint/40 bg-mint/10">
            <IconShield className="h-10 w-10 text-mint" />
          </div>
          <div className="min-w-[240px] flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                className="w-56 rounded-md border border-transparent bg-transparent font-display text-2xl font-bold text-snow transition-colors hover:border-line focus:border-mint/60 focus:outline-none sm:text-3xl"
                aria-label="Agent name"
              />
              {name.trim() !== stats.name && (
                <button
                  onClick={saveName}
                  disabled={saving}
                  className="rounded-md bg-mint px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-widest text-deep transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              )}
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-fog">
              Rank {level.index + 1} · {level.name} · {stats.lessonsDone}/{LESSONS.length} lessons
            </p>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest">
              <span className="text-fog">
                {level.name}
                {level.nextName ? ` → ${level.nextName}` : " · max rank"}
              </span>
              <span className="text-mint">
                {level.next !== null ? `${stats.xp - level.min}/${level.next - level.min} XP` : "MAX"}
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mint via-cyan to-mint transition-all duration-1000"
                style={{ width: `${Math.round(level.progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* tiles */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-line bg-panel/60 p-4 transition-colors hover:border-line hover:bg-panel">
            <p className={`font-display text-2xl font-bold ${t.tone}`}>{t.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* category accuracy */}
        <div className="rounded-xl border border-line bg-panel/70 p-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-cyan">
            Accuracy by attack category
          </p>
          {stats.byCategory.length ? (
            <div className="mt-5 space-y-4">
              {stats.byCategory
                .slice()
                .sort((a, b) => b.attempts - a.attempts)
                .map((b) => {
                  const acc = Math.round((100 * b.correct) / b.attempts);
                  return (
                    <div key={b.category}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13.5px] font-medium text-snow/90">{b.category}</span>
                        <span className="font-mono text-[11px] text-fog">
                          {acc}% · {b.attempts} case{b.attempts === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/50">
                        <div
                          className={`h-full rounded-full ${acc >= 80 ? "bg-mint" : acc >= 50 ? "bg-amber" : "bg-alert"}`}
                          style={{ width: `${Math.max(4, (b.attempts / maxCat) * acc)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="mt-5 text-[13.5px] leading-relaxed text-fog">
              No data yet — run a few cases in the simulator and your weak spots will show up
              here.
            </p>
          )}
        </div>

        {/* badges */}
        <div className="rounded-xl border border-line bg-panel/70 p-6">
          <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-amber">
            <IconTrophy className="h-3.5 w-3.5" />
            Badge case
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGES.map((b) => {
              const earned = b.earned(badgeStats);
              return (
                <div
                  key={b.id}
                  title={b.desc}
                  className={`group rounded-lg border p-3 text-center transition-all ${
                    earned
                      ? "border-amber/50 bg-amber/10 hover:-translate-y-0.5"
                      : "border-line bg-deep/50 opacity-60"
                  }`}
                >
                  <span
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${
                      earned ? "border-amber/60 bg-amber/15 text-amber" : "border-line text-fog"
                    }`}
                  >
                    {earned ? <IconTrophy className="h-5 w-5" /> : <IconLock className="h-4 w-4" />}
                  </span>
                  <p className={`mt-2 font-display text-[11.5px] font-bold leading-tight ${earned ? "text-snow" : "text-fog"}`}>
                    {b.name}
                  </p>
                  <p className="mt-1 hidden font-mono text-[9.5px] leading-snug text-fog/70 sm:block">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* recent verdicts */}
      <div className="mt-6 rounded-xl border border-line bg-panel/70 p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-fog">
          Recent verdicts
        </p>
        {stats.recent.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line/70 font-mono text-[10px] uppercase tracking-[0.2em] text-fog/70">
                  <th className="pb-2.5 pr-4 font-medium">Case</th>
                  <th className="pb-2.5 pr-4 font-medium">Channel</th>
                  <th className="pb-2.5 pr-4 font-medium">Your call</th>
                  <th className="pb-2.5 pr-4 font-medium">Result</th>
                  <th className="pb-2.5 text-right font-medium">XP</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r, i) => (
                  <tr key={`${r.caseCode}-${i}`} className="border-b border-line/40 transition-colors hover:bg-panel2/50">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-[11px] text-fog">{r.caseCode}</span>
                      <span className="ml-2 text-[13px] font-medium text-snow/90">{r.title}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fog">
                        <ChannelIcon channel={r.channel} className="h-3.5 w-3.5 text-cyan" />
                        {CHANNEL_LABEL[r.channel] ?? r.channel}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <Chip tone={r.verdict === "scam" ? "alert" : "mint"}>
                        {r.verdict === "scam" ? "Scam" : "Legit"}
                      </Chip>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`flex items-center gap-1.5 font-display text-[12.5px] font-bold uppercase tracking-wider ${r.correct ? "text-mint" : "text-alert"}`}>
                        {r.correct ? <IconCheck className="h-3.5 w-3.5" /> : <IconX className="h-3.5 w-3.5" />}
                        {r.correct ? "Correct" : "Missed"}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-[12px] text-amber">+{r.xpEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center rounded-lg border border-dashed border-line py-10 text-center">
            <IconScan className="h-8 w-8 text-line" />
            <p className="mt-3 font-display text-base font-bold text-fog">No verdicts on record</p>
            <p className="mt-1 max-w-sm text-[13.5px] text-fog/70">
              Head to the simulator and judge your first case — your history, XP and badges
              start here.
            </p>
            <a
              href="/simulator"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-mint px-5 py-2.5 font-display text-[12px] font-bold uppercase tracking-widest text-deep transition-all hover:-translate-y-0.5"
            >
              <IconZap className="h-4 w-4" />
              Open simulator
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
