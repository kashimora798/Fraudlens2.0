import { Kicker, Chip, Reveal } from "@/components/ui";
import { IconCall, IconGlobe, IconSms, IconTarget, IconWhatsApp } from "@/components/icons";
import { db } from "@/db";
import { simScenarios } from "@/db/schema";
import { asc } from "drizzle-orm";
import SimulatorClient from "./simulator-client";

export const dynamic = "force-dynamic";

const PLATFORM_META: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  whatsapp: { icon: <IconWhatsApp className="h-5 w-5" />, label: "WhatsApp", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  instagram: { icon: <IconGlobe className="h-5 w-5" />, label: "Instagram DM", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30" },
  call: { icon: <IconCall className="h-5 w-5" />, label: "Phone Call", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  sms: { icon: <IconSms className="h-5 w-5" />, label: "SMS / Text", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
};

export default async function SimulatorPage() {
  const rows = await db.select().from(simScenarios).orderBy(asc(simScenarios.id));
  const scenarios = rows.map((r: typeof rows[number]) => ({
    ...r,
    phases: r.phases as any,
    redFlags: r.redFlags as string[],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Immersive simulation</Kicker>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Live-fire training
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-400">
            Step inside a real scam — WhatsApp chats with typing indicators, Instagram DMs from
            fake brands, phone calls with audio from a &quot;CBI officer.&quot; The conversation
            adapts to your choices. When it ends, you find out whether you caught it or fell for it.
          </p>
        </div>
        <Chip tone="mint">
          <IconTarget className="h-3.5 w-3.5" />
          {scenarios.length} scenarios
        </Chip>
      </div>

      <SimulatorClient scenarios={scenarios} platformMeta={PLATFORM_META} />
    </div>
  );
}
