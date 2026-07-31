"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchLearner } from "@/lib/client";
import { levelFor } from "@/lib/meta";
import { IconRadar, IconShield, IconZap } from "./icons";

const LINKS = [
  { href: "/", label: "Console" },
  { href: "/simulator", label: "Simulator" },
  { href: "/scanner", label: "Scanner" },
  { href: "/database", label: "Database" },
  { href: "/academy", label: "Academy" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Nav() {
  const pathname = usePathname();
  const [xp, setXp] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetchLearner()
      .then((l) => {
        if (alive) setXp(l.xp);
      })
      .catch(() => {});
    const onStorage = () => {
      fetchLearner()
        .then((l) => {
          if (alive) setXp(l.xp);
        })
        .catch(() => {});
    };
    window.addEventListener("fraudlens:update", onStorage);
    return () => {
      alive = false;
      window.removeEventListener("fraudlens:update", onStorage);
    };
  }, [pathname]);

  const level = xp !== null ? levelFor(xp) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-mint/40 bg-mint/10 text-mint transition-shadow group-hover:shadow-[0_0_20px_rgba(53,226,174,0.35)]">
            <IconShield className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-alert animate-pulse" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-bold tracking-wide text-snow">
              FRAUD<span className="text-mint">LENS</span>
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.28em] text-fog">
              Scam defense sim
            </span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 font-display text-[13px] font-semibold uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-panel2 text-mint"
                    : "text-fog hover:bg-panel hover:text-snow"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {level ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md border border-mint/30 bg-mint/5 px-3 py-1.5 transition-colors hover:bg-mint/15"
              title="Your rank — open dashboard"
            >
              <IconZap className="h-3.5 w-3.5 text-amber" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-snow">
                {level.name}
                <span className="ml-1.5 text-mint">{xp} XP</span>
              </span>
            </Link>
          ) : (
            <span className="h-8 w-24 animate-pulse rounded-md border border-line bg-panel" />
          )}
          <IconRadar className="hidden h-5 w-5 text-fog sm:block" />
        </div>
      </div>

      <nav className="scrollbar-none flex gap-1 overflow-x-auto border-t border-line/50 px-3 py-2 lg:hidden">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 font-display text-[12px] font-semibold uppercase tracking-wider ${
                active ? "bg-panel2 text-mint" : "text-fog"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
