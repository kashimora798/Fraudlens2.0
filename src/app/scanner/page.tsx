"use client";

import { useState, type ReactNode } from "react";
import { Chip, Kicker } from "@/components/ui";
import { IconAlert, IconCheck, IconFlag, IconScan } from "@/components/icons";
import { getLearnerId } from "@/lib/client";
import type { ScanFlag, ScanResult } from "@/lib/types";

const SAMPLES: { label: string; text: string }[] = [
  {
    label: "KYC threat SMS",
    text: "Dear customer, your SBI account will be BLOCKED within 24 hours. Update your KYC immediately to avoid suspension: sbi-kyc-verify.in/update — SBI Team",
  },
  {
    label: "QR cashback trap",
    text: "Congratulations! You have won a Rs. 999 cashback. To receive the amount, scan this QR code and enter your UPI PIN to authenticate. Amount reflects in 2 minutes.",
  },
  {
    label: "Clean OTP message",
    text: "482913 is the OTP to login to HDFC Bank MobileBanking. Valid for 5 minutes. DO NOT share this OTP with anyone. HDFC Bank never calls asking for it.",
  },
];

const SEV_STYLE: Record<ScanFlag["severity"], { mark: string; chip: string; label: string }> = {
  critical: {
    mark: "bg-alert/25 text-alert decoration-alert underline decoration-2 underline-offset-2",
    chip: "border-alert/50 text-alert bg-alert/10",
    label: "Critical",
  },
  high: {
    mark: "bg-amber/20 text-amber decoration-amber underline decoration-2 underline-offset-2",
    chip: "border-amber/50 text-amber bg-amber/10",
    label: "High",
  },
  medium: {
    mark: "bg-cyan/20 text-cyan underline decoration-cyan underline-offset-2",
    chip: "border-cyan/50 text-cyan bg-cyan/10",
    label: "Medium",
  },
  low: {
    mark: "bg-fog/15 text-fog underline decoration-fog/60 underline-offset-2",
    chip: "border-line text-fog bg-panel2",
    label: "Low",
  },
};

function highlighted(text: string, flags: ScanFlag[]) {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  flags.forEach((f, i) => {
    if (f.start > cursor) nodes.push(<span key={`t${i}`}>{text.slice(cursor, f.start)}</span>);
    nodes.push(
      <span key={`f${i}`} className={`rounded px-0.5 ${SEV_STYLE[f.severity].mark}`}>
        {text.slice(f.start, f.end)}
      </span>,
    );
    cursor = f.end;
  });
  if (cursor < text.length) nodes.push(<span key="tail">{text.slice(cursor)}</span>);
  return nodes;
}

export default function ScannerPage() {
  const [text, setText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runScan() {
    if (scanning) return;
    setError(null);
    setResult(null);
    setScanning(true);
    try {
      await new Promise((r) => setTimeout(r, 1300));
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, learnerId: getLearnerId() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scan failed");
      setResult(data as ScanResult);
      window.dispatchEvent(new Event("fraudlens:update"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed — try again.");
    } finally {
      setScanning(false);
    }
  }

  const score = result?.score ?? 0;
  const gaugeColor =
    result?.verdict === "danger" ? "#FF5D5D" : result?.verdict === "suspicious" ? "#FFB224" : "#35E2AE";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Kicker>Message scanner</Kicker>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-snow sm:text-5xl">
        Paste it. Scan it. <span className="text-cyan">Expose it.</span>
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog">
        Got a message that smells fishy? Run it through FraudLens. The scanner hunts for 17
        fraud signals — panic words, fake domains, credential asks, QR traps — and shows you
        exactly where the message betrays itself.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* input */}
        <div>
          <div className="rounded-xl border border-line bg-panel/70 p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-cyan">
                Evidence input
              </p>
              <span className="font-mono text-[10.5px] text-fog/70">{text.length}/5000</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 5000))}
              rows={9}
              placeholder="Paste the SMS, WhatsApp message or email body here… e.g. 'Your SBI account will be blocked within 24 hours. Update KYC: sbi-kyc…'"
              className="mt-3 w-full resize-y rounded-lg border border-line bg-deep px-4 py-3.5 font-mono text-[13px] leading-relaxed text-snow placeholder:text-fog/50 focus:border-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyan/20"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                Try:
              </span>
              {SAMPLES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setText(s.text);
                    setResult(null);
                    setError(null);
                  }}
                  className="rounded-md border border-line bg-deep px-2.5 py-1 font-mono text-[11px] text-fog transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={runScan}
              disabled={scanning || text.trim().length < 10}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg bg-cyan px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-deep transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_44px_-12px_rgba(83,200,245,0.6)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconScan className="h-4.5 w-4.5" />
              {scanning ? "Scanning signal…" : "Run the scan"}
            </button>
            {error && <p className="mt-3 text-center text-[13px] text-alert">{error}</p>}
          </div>

          <div className="mt-5 rounded-xl border border-line/70 bg-deep/60 p-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-fog">
              Scanner doctrine
            </p>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-fog">
              <li className="flex gap-2.5">
                <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                A clean scan is not a guarantee — scammers evolve. Trust your gut too.
              </li>
              <li className="flex gap-2.5">
                <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                Never paste real passwords, full card numbers or your own OTPs into any tool —
                including this one.
              </li>
              <li className="flex gap-2.5">
                <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                Scans run locally on our server and are not stored or shared.
              </li>
            </ul>
          </div>
        </div>

        {/* output */}
        <div>
          {scanning ? (
            <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-cyan/40 bg-deep p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
                Analyzing signal<span className="blink">▌</span>
              </p>
              <p className="mt-4 whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-fog/70">
                {text.slice(0, 600)}
              </p>
              <div className="scan-beam pointer-events-none absolute left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_18px_rgba(83,200,245,0.8)]" />
              <div className="absolute bottom-5 left-5 right-5 space-y-2">
                {["Checking urgency patterns…", "Inspecting links & domains…", "Cross-referencing brand impersonation…"].map(
                  (s, i) => (
                    <p key={s} className="flex items-center gap-2 font-mono text-[11px] text-cyan/80">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan" style={{ animationDelay: `${i * 0.3}s` }} />
                      {s}
                    </p>
                  ),
                )}
              </div>
            </div>
          ) : result ? (
            <div className="feed-in space-y-5">
              {/* verdict */}
              <div
                className={`rounded-xl border p-6 ${
                  result.verdict === "danger"
                    ? "border-alert/50 bg-alert/5"
                    : result.verdict === "suspicious"
                      ? "border-amber/50 bg-amber/5"
                      : "border-mint/50 bg-mint/5"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="relative h-28 w-28 shrink-0">
                    <svg viewBox="0 0 200 120" className="h-full w-full">
                      <path d="M20 105 A 80 80 0 0 1 180 105" fill="none" stroke="#22304F" strokeWidth="14" strokeLinecap="round" pathLength={100} />
                      <path
                        d="M20 105 A 80 80 0 0 1 180 105"
                        fill="none"
                        stroke={gaugeColor}
                        strokeWidth="14"
                        strokeLinecap="round"
                        pathLength={100}
                        strokeDasharray={`${score} 100`}
                        style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }}
                      />
                    </svg>
                    <span className="absolute inset-x-0 bottom-1 text-center font-display text-2xl font-bold text-snow">
                      {score}
                    </span>
                  </div>
                  <div>
                    <p
                      className="font-display text-xl font-bold tracking-wide"
                      style={{ color: gaugeColor }}
                    >
                      {result.verdictLabel}
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-fog">{result.summary}</p>
                    <p className="mt-2 font-mono text-[10.5px] uppercase tracking-widest text-fog/70">
                      {result.flags.length} signal{result.flags.length === 1 ? "" : "s"} detected
                    </p>
                  </div>
                </div>
              </div>

              {/* evidence */}
              {result.flags.length > 0 ? (
                <div className="rounded-xl border border-line bg-panel/70 p-5">
                  <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-alert">
                    <IconFlag className="h-3.5 w-3.5" />
                    Evidence breakdown
                  </p>
                  <ul className="mt-4 space-y-4">
                    {result.flags.map((f, i) => (
                      <li key={`${f.ruleId}-${i}`} className="rounded-lg border border-line/70 bg-deep/60 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${SEV_STYLE[f.severity].chip}`}>
                            {SEV_STYLE[f.severity].label}
                          </span>
                          <span className="text-[13.5px] font-semibold text-snow">{f.label}</span>
                        </div>
                        <p className="mt-1.5 font-mono text-[12px] text-cyan">&quot;{f.matched}&quot;</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-fog">{f.tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-xl border border-mint/40 bg-mint/5 p-5">
                  <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.25em] text-mint">
                    <IconCheck className="h-3.5 w-3.5" />
                    No red flags found
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-fog">
                    Nothing in this message tripped the scanner. Still apply the golden rules:
                    never share OTP, PIN or passwords — and verify anything money-related on the
                    official channel.
                  </p>
                </div>
              )}

              {/* annotated preview */}
              <div className="rounded-xl border border-line bg-deep/70 p-5">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-fog">
                  Annotated message
                </p>
                <p className="mt-3 whitespace-pre-wrap font-mono text-[13px] leading-[1.9] text-snow/90">
                  {highlighted(result.text, result.flags)}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 border-t border-line/60 pt-3">
                  {(["critical", "high", "medium", "low"] as const).map((sev) => (
                    <span key={sev} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-fog">
                      <span className={`inline-block h-2 w-2 rounded-sm ${sev === "critical" ? "bg-alert" : sev === "high" ? "bg-amber" : sev === "medium" ? "bg-cyan" : "bg-fog"}`} />
                      {sev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-panel/40 p-8 text-center">
              <IconAlert className="h-10 w-10 text-line" />
              <p className="mt-4 font-display text-lg font-bold text-fog">Awaiting input</p>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-fog/70">
                Paste a suspicious message on the left — or load one of the samples — and hit
                &quot;Run the scan&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
