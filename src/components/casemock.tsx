"use client";

import type { ScamCase } from "@/lib/types";
import { ChannelIcon, IconLock } from "./icons";

function paragraphs(text: string): string[] {
  return text.split("\n").filter((l) => l.trim().length > 0);
}

function withUrls(text: string) {
  const parts = text.split(/((?:https?:\/\/|www\.)[^\s]+|[a-z0-9-]+\.(?:in|com|top|xyz|info|site|center|net|icu|xyz|club|live|tk)(?:\/[^\s,.]*)?)/gi);
  return parts.map((p, i) =>
    /^(https?:\/\/|www\.)/i.test(p) ||
    /^[a-z0-9-]+\.(in|com|top|xyz|info|site|center|net|icu|club|live|tk)(\/|$)/i.test(p) ? (
      <span key={i} className="break-all text-cyan underline decoration-cyan/50 underline-offset-2">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function FrameLabel({ label, channel }: { label: string; channel: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line/70 bg-panel px-4 py-2">
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
        <ChannelIcon channel={channel} className="h-3.5 w-3.5 text-cyan" />
        {label}
      </span>
      <span className="rounded border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
        Simulation
      </span>
    </div>
  );
}

function SmsMock({ c }: { c: ScamCase }) {
  return (
    <div className="flex min-h-[320px] flex-col bg-[#0B0F1A]">
      <div className="flex items-center justify-between px-4 pt-2 font-mono text-[10px] text-fog">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="flex gap-[2px]">
            <i className="h-1.5 w-[3px] rounded-[1px] bg-fog/60" />
            <i className="h-2.5 w-[3px] rounded-[1px] bg-fog/60" />
            <i className="h-3.5 w-[3px] rounded-[1px] bg-fog/60" />
          </span>
          <span className="ml-1 inline-block h-2.5 w-5 rounded-[3px] border border-fog/60 p-[2px]">
            <i className="block h-full w-3/4 rounded-[1px] bg-mint" />
          </span>
        </span>
      </div>
      <div className="border-b border-line/60 px-4 py-2 text-center font-mono text-[11px] tracking-widest text-fog">
        <span className="text-snow">{c.sender}</span>
      </div>
      <div className="flex-1 px-4 py-4">
        <div className="max-w-[85%] rounded-lg rounded-tl-sm border border-line/60 bg-panel2 px-3.5 py-3 text-[13.5px] leading-relaxed text-snow/95">
          {withUrls(c.content)}
        </div>
        <p className="mt-1.5 pl-1 font-mono text-[10px] text-fog/70">Today, 10:24 AM</p>
      </div>
    </div>
  );
}

function WhatsAppMock({ c }: { c: ScamCase }) {
  const name = c.meta.name ?? c.sender;
  const initial = (name[0] ?? "?").toUpperCase();
  return (
    <div className="flex min-h-[320px] flex-col bg-[#0B141A]">
      <div className="flex items-center gap-3 border-b border-[#1F2C34] bg-[#111B21] px-4 py-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A3942] font-display text-sm font-bold text-snow">
          {initial}
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-[13px] font-semibold text-snow">{name}</p>
          <p className="font-mono text-[10.5px] text-[#8696A0]">{c.sender}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#8696A0]">chat</span>
      </div>
      <div className="wa-bg flex-1 px-4 py-4">
        <p className="mx-auto mb-3 w-fit rounded bg-[#182229] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#8696A0]">
          Today
        </p>
        <div className="max-w-[88%] rounded-lg rounded-tl-none bg-[#1F2C34] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[#E9EDEF] shadow-sm">
          {withUrls(c.content)}
          <span className="float-right ml-2 mt-1.5 font-mono text-[10px] text-[#8696A0]">10:24</span>
        </div>
      </div>
    </div>
  );
}

function EmailMock({ c }: { c: ScamCase }) {
  return (
    <div className="flex min-h-[320px] flex-col bg-panel">
      <div className="border-b border-line/70 px-4 py-3">
        <p className="text-[15px] font-semibold text-snow">{c.meta.subject ?? "(no subject)"}</p>
        <div className="mt-2 space-y-0.5 font-mono text-[11px] leading-relaxed">
          <p className="text-fog">
            <span className="text-fog/60">From:</span> <span className="text-amber">{c.meta.from ?? c.sender}</span>
          </p>
          <p className="text-fog">
            <span className="text-fog/60">To:</span> you@studentmail.in
          </p>
        </div>
      </div>
      <div className="flex-1 space-y-3 px-4 py-4 text-[13.5px] leading-relaxed text-snow/90">
        {paragraphs(c.content).map((p, i) => (
          <p key={i}>{withUrls(p)}</p>
        ))}
      </div>
    </div>
  );
}

function WebsiteMock({ c }: { c: ScamCase }) {
  return (
    <div className="flex min-h-[320px] flex-col bg-panel">
      <div className="flex items-center gap-2 border-b border-line/70 bg-deep px-3 py-2">
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-alert/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-amber/80" />
          <i className="h-2.5 w-2.5 rounded-full bg-mint/80" />
        </span>
        <span className="flex flex-1 items-center gap-2 rounded-md border border-line bg-panel2 px-3 py-1.5 font-mono text-[11.5px] text-snow/90">
          <IconLock className="h-3 w-3 shrink-0 text-mint" />
          <span className="truncate">{c.meta.url}</span>
        </span>
      </div>
      <div className="flex-1 space-y-4 px-5 py-5">
        {paragraphs(c.content).map((p, i) =>
          p.startsWith("[") ? (
            <p key={i} className="rounded border border-dashed border-line px-3 py-2 font-mono text-[11.5px] text-fog">
              {p}
            </p>
          ) : (
            <p key={i} className="text-[14px] leading-relaxed text-snow/95">{withUrls(p)}</p>
          ),
        )}
        {c.meta.button && (
          <div>
            <span
              title="Disabled inside the simulator"
              className="inline-block cursor-not-allowed rounded-md bg-cyan px-5 py-2.5 font-display text-sm font-semibold text-deep opacity-80"
            >
              {c.meta.button}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CallMock({ c }: { c: ScamCase }) {
  return (
    <div className="relative flex min-h-[320px] flex-col items-center overflow-hidden bg-gradient-to-b from-[#101B33] to-[#0B0F1A] px-6 py-6">
      <div className="relative mt-2">
        <span className="pulse-ring absolute inset-0 rounded-full border-2 border-alert/50" />
        <span className="pulse-ring-slow absolute inset-0 rounded-full border border-alert/30" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-panel2 text-alert">
          <ChannelIcon channel="call" className="h-9 w-9" />
        </span>
      </div>
      <p className="mt-4 font-display text-lg font-bold text-snow">{c.meta.callerName ?? c.sender}</p>
      <p className="font-mono text-[11.5px] text-fog">{c.sender}</p>
      <p className="mt-1 animate-pulse font-mono text-[11px] uppercase tracking-[0.25em] text-mint">
        Incoming call…
      </p>
      <div className="mt-5 w-full rounded-lg border border-line/70 bg-deep/70 p-3.5">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fog">Transcript</p>
        <p className="text-[13px] leading-relaxed text-snow/90">
          <span className="mr-1 font-mono text-alert">▸</span>
          {c.content}
        </p>
      </div>
    </div>
  );
}

function UpiMock({ c }: { c: ScamCase }) {
  return (
    <div className="flex min-h-[320px] flex-col bg-panel px-5 py-5">
      <p className="mx-auto rounded-full border border-amber/40 bg-amber/10 px-4 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
        Collect request
      </p>
      <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-panel2">
        <ChannelIcon channel="upi" className="h-7 w-7 text-mint" />
      </div>
      <p className="mt-3 text-center font-display text-lg font-bold text-snow">{c.meta.name ?? c.sender}</p>
      <p className="text-center font-mono text-[12px] text-fog">{c.meta.from ?? c.sender}</p>
      {c.meta.amount && (
        <p className="mt-4 text-center font-display text-4xl font-bold tracking-tight text-snow">
          {c.meta.amount}
        </p>
      )}
      <p className="mx-auto mt-4 max-w-sm rounded-lg border border-line/70 bg-deep/60 p-3 text-center text-[13px] leading-relaxed text-snow/85">
        {c.content}
      </p>
      <div className="mt-auto flex justify-center gap-3 pt-5">
        <span className="cursor-not-allowed rounded-md border border-line px-6 py-2 font-display text-sm font-semibold text-fog">Decline</span>
        <span className="cursor-not-allowed rounded-md bg-mint/90 px-6 py-2 font-display text-sm font-bold text-deep">Approve</span>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-fog/60">
        Buttons disabled — simulation only
      </p>
    </div>
  );
}

export default function CaseMock({ c }: { c: ScamCase }) {
  const label: Record<string, string> = {
    sms: "Incoming SMS",
    whatsapp: "WhatsApp message",
    email: "Email inbox",
    website: "Browser session",
    call: "Phone call",
    upi: "UPI payment request",
  };
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-deep shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
      <FrameLabel label={label[c.channel] ?? c.channel} channel={c.channel} />
      {c.channel === "sms" && <SmsMock c={c} />}
      {c.channel === "whatsapp" && <WhatsAppMock c={c} />}
      {c.channel === "email" && <EmailMock c={c} />}
      {c.channel === "website" && <WebsiteMock c={c} />}
      {c.channel === "call" && <CallMock c={c} />}
      {c.channel === "upi" && <UpiMock c={c} />}
      <div className="border-t border-line/70 bg-panel px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fog/70">
        Case {c.caseCode} — fictional training sample. Nothing here is real or clickable.
      </div>
    </div>
  );
}
