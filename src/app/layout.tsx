import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Chakra_Petch, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import Nav from "@/components/nav";
import { IconShield } from "@/components/icons";
import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FraudLens — Scam Defense Simulator for Students",
  description:
    "Train your scam radar. Judge realistic SMS, WhatsApp, email and UPI fraud attempts, scan suspicious messages for red flags, and level up your cyber defense skills.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
        <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen font-body text-snow antialiased">
        {/* <LoadingScreen /> */}
        <Nav />
        <main>{children}</main>
        {/* Global notification center */}
        {/* <NotificationCenter /> */}
        
        {/* Floating Action Button */}
        <a
          href="/simulator"
          className="fab group"
          title="Start Training"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>New</span>
          <span className="tooltip">Start Training</span>
        </a>
        
        <footer className="mt-20 border-t border-line/70 bg-deep/80">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-mint/40 bg-mint/10 text-mint">
                  <IconShield className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-bold tracking-wide">
                  FRAUD<span className="text-mint">LENS</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog">
                A cyber-defense training simulator built for students. Every message in the
                database is a fictional but realistic reconstruction of fraud patterns seen in
                the wild — no brand shown is affiliated with this project.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-fog/70">
                Training tool · not legal or financial advice
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">Train</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  ["Simulator", "/simulator"],
                  ["Message Scanner", "/scanner"],
                  ["Scam Database", "/database"],
                  ["Academy", "/academy"],
                  ["Dashboard", "/dashboard"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-fog transition-colors hover:text-mint">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-alert">
                If you got scammed
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <span className="font-display text-2xl font-bold text-snow">1930</span>
                  <span className="ml-2 text-fog">National cyber crime helpline</span>
                </li>
                <li>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-fog underline decoration-line underline-offset-4 transition-colors hover:text-mint"
                  >
                    cybercrime.gov.in
                  </a>
                  <span className="ml-2 text-fog">— file a complaint online</span>
                </li>
                <li className="text-fog">
                  Call your bank&apos;s official helpline first — the first minutes decide
                  whether money can be recovered.
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-line/50 py-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fog/60">
            FraudLens · built to make students un-phishable
          </div>
        </footer>
      </body>
    </html>
  );
}
