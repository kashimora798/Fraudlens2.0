import { db, scams } from "@/lib/server";
import { asc } from "drizzle-orm";
import type { ScamCase } from "@/lib/types";
import { Chip, Kicker, Reveal } from "@/components/ui";
import { IconDatabase } from "@/components/icons";
import DatabaseExplorer from "@/components/database-explorer";

export const dynamic = "force-dynamic";

export default async function DatabasePage() {
  const rows = await db.select().from(scams).orderBy(asc(scams.caseCode));
  const cases: ScamCase[] = rows.map((c) => ({
    ...c,
    meta: c.meta as Record<string, string>,
    redFlags: c.redFlags as string[],
  }));

  const scamCount = cases.filter((c) => c.isScam).length;
  const highRisk = cases.filter((c) => c.riskLevel === "high").length;
  const totalFlags = cases.reduce((a, c) => a + c.redFlags.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Evidence vault</Kicker>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-snow sm:text-5xl">
            The scam database
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog">
            Every fraud pattern students face, reconstructed as realistic case files — with the
            red flags annotated. No public dataset of this kind exists safely, so each entry is
            a generated, fictional sample modeled on documented scam formats. Study them like
            flashcards.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Chip tone="alert" className="px-3 py-1.5 text-[12px]">
            <IconDatabase className="h-3.5 w-3.5" />
            {cases.length} files
          </Chip>
          <Chip tone="alert" className="px-3 py-1.5 text-[12px]">
            {scamCount} scams
          </Chip>
          <Chip tone="mint" className="px-3 py-1.5 text-[12px]">
            {cases.length - scamCount} legit
          </Chip>
          <Chip tone="amber" className="px-3 py-1.5 text-[12px]">
            {highRisk} high-risk
          </Chip>
          <Chip tone="cyan" className="px-3 py-1.5 text-[12px]">
            {totalFlags} flags tagged
          </Chip>
        </div>
      </div>

      <Reveal className="mt-8">
        <DatabaseExplorer cases={cases} />
      </Reveal>
    </div>
  );
}
