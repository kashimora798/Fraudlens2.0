import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { learners, simSessions, simScenarios } from "@/db/schema";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { learnerId, scenarioId, outcome } = body as {
    learnerId?: string;
    scenarioId?: number;
    outcome?: string;
  };

  if (!learnerId || typeof scenarioId !== "number" || !outcome) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Upsert learner
  await db
    .insert(learners)
    .values({ id: learnerId })
    .onConflictDoNothing({ target: learners.id });

  const scenario = await db
    .select()
    .from(simScenarios)
    .where(eq(simScenarios.id, scenarioId))
    .limit(1);

  let xpEarned = 0;
  if (scenario.length) {
    xpEarned = outcome === "caught" ? scenario[0].xpReward : Math.round(scenario[0].xpReward * 0.3);
  }

  await db.insert(simSessions).values({
    learnerId,
    scenarioId,
    outcome,
    xpEarned,
    finishedAt: new Date(),
  });

  await db
    .update(learners)
    .set({
      xp: sql`${learners.xp} + ${xpEarned}`,
      simulationsCompleted: sql`${learners.simulationsCompleted} + 1`,
    })
    .where(eq(learners.id, learnerId));

  return NextResponse.json({ xpEarned, outcome });
}

export const dynamic = "force-dynamic";
