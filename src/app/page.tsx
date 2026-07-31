import Link from "next/link";
import { db, scams } from "@/lib/server";
import type { ScamCase } from "@/lib/types";
import { TOTAL_LESSONS } from "@/lib/lessons";
import Radar from "@/components/radar";
import InterceptFeed from "@/components/feed";
import WhatsNewModal from "@/components/whats-new";
import { Chip, CountUp, Kicker, Reveal } from "@/components/ui";
import {
  ChannelIcon,
  IconArrow,
  IconBook,
  IconFlag,
  IconRadar,
  IconScan,
  IconTarget,
  IconTrophy,
  IconZap,
} from "@/components/icons";
import { CHANNEL_LABEL } from "@/lib/meta";

export const dynamic = "force-dynamic";

const MARQUEE_TERMS = [
  "URGENT ACTION REQUIRED",
  "SHARE YOUR OTP",
  "BIT.LY LINKS",
  "KYC EXPIRED",
  "GUARANTEED 20% RETURNS",
  "PAY TO CLAIM",
  "SCAN THIS QR",
  "YOU'VE WON",
  "INSTALL THIS APP",
  "DON'T TELL ANYONE",
  "ACCOUNT WILL BE BLOCKED",
  "CUSTOMS DUE PENDING",
];

const MANUAL_STEPS = [
  {
    n: "01",
    title: "Read the intercept",
    body: "Each case is a realistic reconstruction of a fraud format students actually face — SMS, WhatsApp, email, phishing page, phone call or UPI collect request.",
  },
  {
    n: "02",
    title: "Hunt the red flags",
    body: "Inspect the sender, the domain, the pressure words and where money flows. Red flags rarely travel alone — train yourself to see the pattern, not just one clue.",
  },
  {
    n: "03",
    title: "Call the verdict",
    body: "Stamp it: SCAM or LEGIT. Genuine messages are mixed in, because the goal is precision — not paranoia.",
  },
  {
    n: "04",
    title: "Debrief & level up",
    body: "Every verdict unlocks the full red-flag breakdown. Earn XP, build streaks, unlock badges, and turn every miss into a lesson you won't repeat in real life.",
  },
];

export default async function HomePage() {
  const all = await db.select().from(scams);
  const total = all.length;
  const scamCount = all.filter((c) => c.isScam).length;
  const scamJudged = all.filter((c) => c.isScam).reduce((a, c) => a + c.timesJudged, 0);
  const scamCaught = all.filter((c) => c.isScam).reduce((a, c) => a + c.timesCaught, 0);
  const accuracy = scamJudged > 0 ? Math.round((100 * scamCaught) / scamJudged) : null;
  const avgFlags = total > 0 ? all.reduce((a, c) => a + c.redFlags.length, 0) / total : 0;

  const catMap = new Map<string, number>();
  const chanMap = new Map<string, number>();
  for (const c of all) {
    catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1);
    chanMap.set(c.channel, (chanMap.get(c.channel) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);
  const maxCat = categories[0]?.[1] ?? 1;

  const feed: ScamCase[] = [...all]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((c) => ({ ...c, meta: c.meta as Record<string, string>, redFlags: c.redFlags as string[] }));

  const topCaught = all
    .filter((c) => c.isScam)
    .sort((a, b) => b.timesCaught - a.timesCaught || b.id - a.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* ============ CONSOLE ============ */}
      <section className="grid items-center gap-10 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-16">
        <div>
          <Kicker>Cyber defense training console</Kicker>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.04] tracking-tight text-snow sm:text-6xl">
            Learn to spot the scam{" "}
            <span className="relative inline-block">
              <span className="text-alert">before</span>
              <svg viewBox="0 0 120 10" className="absolute -bottom-1 left-0 w-full" aria-hidden="true">
                <path d="M2 7 Q 60 1 118 6" fill="none" stroke="#FF5D5D" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>{" "}
            it spots <span className="text-mint text-shadow-glow">you</span>.
          </h1>
          <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-fog">
            FraudLens drops you inside realistic scam simulations — the KYC threats, the
            free-diamond traps, the &quot;bro I&apos;m stuck abroad&quot; messages — and trains
            your eye to catch every red flag before real fraud gets a chance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="/simulator"
              className="group flex items-center gap-2.5 rounded-md bg-mint px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-deep transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(53,226,174,0.6)]"
            >
              <IconTarget className="h-4 w-4" />
              Start the simulator
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/scanner"
              className="flex items-center gap-2.5 rounded-md border border-cyan/50 bg-cyan/5 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-cyan transition-all hover:-translate-y-0.5 hover:bg-cyan/15"
            >
              <IconScan className="h-4 w-4" />
              Scan a message
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line/70 pt-7 sm:grid-cols-4">
            <div>
              <p className="font-display text-3xl font-bold text-snow">
                <CountUp to={total} />
              </p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fog">
                Case files
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-mint">
                {accuracy !== null ? <CountUp to={accuracy} suffix="%" /> : "—"}
              </p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fog">
                Scams caught
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-amber">
                <CountUp to={avgFlags} decimals={1} />
              </p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fog">
                Flags per scam
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-cyan">
                <CountUp to={TOTAL_LESSONS} />
              </p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fog">
                Academy lessons
              </p>
            </div>
          </div>
        </div>

        {/* radar + live feed */}
        <Reveal>
          <div className="relative rounded-xl border border-line bg-panel/70 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            <span className="absolute -left-px -top-px h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-mint" />
            <span className="absolute -right-px -top-px h-6 w-6 rounded-tr-xl border-r-2 border-t-2 border-mint" />
            <span className="absolute -bottom-px -left-px h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-mint" />
            <span className="absolute -bottom-px -right-px h-6 w-6 rounded-br-xl border-b-2 border-r-2 border-mint" />

            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-mint">
                <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
                Threat sensor online
              </p>
              <p className="font-mono text-[10.5px] tracking-widest text-fog/70">
                SECTOR 7G · <span className="text-alert">{scamCount} threats</span> ·{" "}
                <span className="text-mint">{total - scamCount} clean</span>
              </p>
            </div>

            <div className="flex justify-center py-4">
              <Radar size={300} />
            </div>

            <InterceptFeed cases={feed} />
          </div>
        </Reveal>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="relative -mx-4 overflow-hidden border-y border-line/70 bg-deep/70 py-3 sm:-mx-6">
        <div className="marquee gap-0">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {MARQUEE_TERMS.map((t) => (
                <span key={`${dup}-${t}`} className="flex items-center">
                  <span className="px-5 font-mono text-[11.5px] uppercase tracking-[0.22em] text-fog/80">
                    {t}
                  </span>
                  <span className="text-alert/70">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ FIELD MANUAL ============ */}
      <section className="py-20">
        <Reveal>
          <Kicker>Field manual</Kicker>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
              How the training loop works
            </h2>
            <Chip tone="mint">
              <IconRadar className="h-3 w-3" />
              4-step protocol
            </Chip>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line/60 md:grid-cols-2">
          {MANUAL_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="group relative h-full bg-panel p-7 transition-colors hover:bg-panel2">
                <span className="font-display text-5xl font-bold text-line transition-colors group-hover:text-mint/60">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-snow">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-md text-[14px] leading-relaxed text-fog">{s.body}</p>
                <span className="absolute right-6 top-7 h-2 w-2 rounded-full bg-line transition-colors group-hover:bg-mint" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ THREAT INDEX ============ */}
      <section className="pb-20">
        <Reveal>
          <Kicker>Live threat index</Kicker>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
            What&apos;s circulating right now
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="h-full rounded-xl border border-line bg-panel/70 p-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-fog">
                Cases by attack category
              </p>
              <div className="mt-5 space-y-4">
                {categories.map(([cat, n]) => (
                  <div key={cat}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[13.5px] font-medium text-snow/90">{cat}</span>
                      <span className="font-mono text-[11px] text-fog">
                        {n} {n === 1 ? "case" : "cases"}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-mint/70 to-cyan/70 transition-all duration-700"
                        style={{ width: `${Math.max(8, (n / maxCat) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-2 border-t border-line/60 pt-5">
                {[...chanMap.entries()].map(([ch, n]) => (
                  <span
                    key={ch}
                    className="flex items-center gap-1.5 rounded-md border border-line bg-deep px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-fog transition-colors hover:border-cyan/50 hover:text-cyan"
                  >
                    <ChannelIcon channel={ch} className="h-3.5 w-3.5" />
                    {CHANNEL_LABEL[ch] ?? ch} · {n}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-4">
              <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-fog">
                <IconTrophy className="h-3.5 w-3.5 text-amber" />
                Most-caught by trainees
              </p>
              {topCaught.map((c, i) => {
                const rate = c.timesJudged > 0 ? Math.round((100 * c.timesCaught) / c.timesJudged) : null;
                return (
                  <div
                    key={c.id}
                    className="group flex-1 rounded-xl border border-line bg-panel/70 p-5 transition-all hover:-translate-y-0.5 hover:border-alert/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xl font-bold text-alert">#{i + 1}</span>
                      <span className="font-mono text-[10.5px] uppercase tracking-widest text-fog">
                        {c.caseCode} · {CHANNEL_LABEL[c.channel]}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-[15px] font-bold text-snow">{c.title}</p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-fog">
                      {c.content}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-line/50">
                        <div
                          className="h-full rounded-full bg-alert/80"
                          style={{ width: `${rate ?? 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-fog">
                        {rate !== null ? `${rate}% caught` : "untested"}
                      </span>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/database"
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3.5 font-display text-[13px] font-bold uppercase tracking-wider text-fog transition-colors hover:border-mint/50 hover:text-mint"
              >
                <IconFlag className="h-4 w-4" />
                Browse all {total} case files
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SPLIT CTA ============ */}
      <section className="grid gap-6 pb-6 md:grid-cols-2">
        <Reveal>
          <Link
            href="/academy"
            className="group flex h-full items-start justify-between gap-6 rounded-xl border border-cyan/30 bg-gradient-to-br from-panel to-panel2 p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(83,200,245,0.35)]"
          >
            <div>
              <Chip tone="cyan">
                <IconBook className="h-3 w-3" />
                Academy
              </Chip>
              <h3 className="mt-4 font-display text-2xl font-bold text-snow">
                8 lessons. Zero jargon.
              </h3>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-fog">
                From OTP discipline to UPI rules to what to do in the golden hour after a scam —
                each lesson takes under 4 minutes.
              </p>
            </div>
            <IconArrow className="mt-1 h-6 w-6 shrink-0 text-cyan transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
        <Reveal delay={110}>
          <Link
            href="/dashboard"
            className="group flex h-full items-start justify-between gap-6 rounded-xl border border-mint/30 bg-gradient-to-br from-panel to-panel2 p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(53,226,174,0.35)]"
          >
            <div>
              <Chip tone="mint">
                <IconTrophy className="h-3 w-3" />
                Your rank
              </Chip>
              <h3 className="mt-4 font-display text-2xl font-bold text-snow">
                Track your defense rating
              </h3>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-fog">
                XP, streaks, badges and per-category accuracy — watch yourself go from Recruit
                to Legend.
              </p>
            </div>
            <IconArrow className="mt-1 h-6 w-6 shrink-0 text-mint transition-transform group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </section>

      {/* What's New Modal */}
      <WhatsNewModal />
    </div>
  );
}
