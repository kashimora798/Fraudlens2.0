"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1100;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(to * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Chip({
  children,
  tone = "fog",
  className = "",
}: {
  children: ReactNode;
  tone?: "fog" | "mint" | "alert" | "amber" | "cyan";
  className?: string;
}) {
  const tones: Record<string, string> = {
    fog: "border-line text-fog",
    mint: "border-mint/40 text-mint bg-mint/10",
    alert: "border-alert/40 text-alert bg-alert/10",
    amber: "border-amber/40 text-amber bg-amber/10",
    cyan: "border-cyan/40 text-cyan bg-cyan/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Stamp({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone: "mint" | "alert" | "amber";
  className?: string;
}) {
  const tones = {
    mint: "text-mint border-mint/70 shadow-[0_0_24px_rgba(53,226,174,0.25)]",
    alert: "text-alert border-alert/70 shadow-[0_0_24px_rgba(255,93,93,0.3)]",
    amber: "text-amber border-amber/70 shadow-[0_0_24px_rgba(255,178,36,0.25)]",
  };
  return (
    <span
      className={`stamp inline-block -rotate-6 rounded border-2 px-3 py-1 font-display text-sm font-bold uppercase tracking-[0.2em] sm:text-base ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">
      <span className="inline-block h-px w-8 bg-cyan/60" />
      {children}
    </p>
  );
}
