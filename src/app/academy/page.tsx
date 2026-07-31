"use client";

import { useEffect, useState } from "react";
import { LESSONS, TOTAL_LESSONS } from "@/lib/lessons";
import { getLearnerId } from "@/lib/client";
import { Chip, Kicker, Reveal } from "@/components/ui";
import { IconBook, IconCheck, IconClock, IconZap } from "@/components/icons";

export default function AcademyPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(LESSONS[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/lesson?learnerId=${encodeURIComponent(getLearnerId())}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { completed: [] }))
      .then((d: { completed: string[] }) => {
        setCompleted(new Set(d.completed));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function complete(lessonId: string) {
    if (busy || completed.has(lessonId)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerId: getLearnerId(), lessonId }),
      });
      if (res.ok) {
        const d = (await res.json()) as { completed: string[] };
        setCompleted(new Set(d.completed));
        window.dispatchEvent(new Event("fraudlens:update"));
      }
    } finally {
      setBusy(false);
    }
  }

  const pct = Math.round((100 * completed.size) / TOTAL_LESSONS);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Defense academy</Kicker>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-snow sm:text-5xl">
            Lessons that stick
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fog">
            Short, sharp briefings — no jargon, no filler. Each one ends with a rule you can
            carry into real life. Complete lessons to earn the Graduate and Scholar badges.
          </p>
        </div>
        <div className="min-w-[220px] rounded-lg border border-line bg-panel px-4 py-3">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-fog">
            <span>Progress</span>
            <span className="text-mint">
              {completed.size}/{TOTAL_LESSONS}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint to-cyan transition-all duration-700"
              style={{ width: loaded ? `${pct}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {LESSONS.map((lesson, i) => {
          const done = completed.has(lesson.id);
          const isOpen = open === lesson.id;
          return (
            <Reveal key={lesson.id} delay={i * 60}>
              <div
                className={`overflow-hidden rounded-xl border transition-colors ${
                  done ? "border-mint/40 bg-mint/[0.03]" : isOpen ? "border-cyan/50 bg-panel" : "border-line bg-panel/60 hover:bg-panel"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : lesson.id)}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 text-left"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-display text-sm font-bold ${
                      done ? "bg-mint/15 text-mint" : "bg-panel2 text-cyan"
                    }`}
                  >
                    {done ? <IconCheck className="h-5 w-5" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <Chip tone={done ? "mint" : "cyan"}>{lesson.tag}</Chip>
                      <span className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-fog/70">
                        <IconClock className="h-3 w-3" />
                        {lesson.minutes} min
                      </span>
                    </span>
                    <span className="mt-1.5 block font-display text-[16px] font-bold text-snow">
                      {lesson.title}
                    </span>
                  </span>
                  <span className={`font-display text-lg text-fog transition-transform ${isOpen ? "rotate-90 text-cyan" : ""}`}>
                    ›
                  </span>
                </button>

                {isOpen && (
                  <div className="feed-in border-t border-line/70 px-5 py-5 sm:px-[76px]">
                    <p className="text-[14.5px] font-medium leading-relaxed text-snow/95">
                      {lesson.summary}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {lesson.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[13.5px] leading-relaxed text-fog">
                          <IconZap className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 rounded-lg border border-cyan/30 bg-cyan/5 px-4 py-3">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-cyan">
                        Carry this rule
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-snow/90">{lesson.tip}</p>
                    </div>
                    <div className="mt-5">
                      {done ? (
                        <span className="inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-4 py-2 font-display text-[12.5px] font-bold uppercase tracking-widest text-mint">
                          <IconCheck className="h-4 w-4" />
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => complete(lesson.id)}
                          disabled={busy}
                          className="inline-flex items-center gap-2 rounded-md bg-mint px-5 py-2.5 font-display text-[12.5px] font-bold uppercase tracking-widest text-deep transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(53,226,174,0.6)] disabled:opacity-50"
                        >
                          <IconBook className="h-4 w-4" />
                          Mark lesson complete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
