import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { xpForCorrect } from "@/lib/meta";
import {
  attempts,
  currentStreakFor,
  db,
  getOrCreateLearner,
  ID_RE,
  learners,
  scams,
} from "@/lib/server";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { learnerId, caseId, verdict } = body as {
    learnerId?: string;
    caseId?: number;
    verdict?: string;
  };

  if (!learnerId || !ID_RE.test(learnerId)) {
    return NextResponse.json({ error: "Missing learner id" }, { status: 400 });
  }
  if (typeof caseId !== "number" || !Number.isFinite(caseId)) {
    return NextResponse.json({ error: "Missing case id" }, { status: 400 });
  }
  if (verdict !== "scam" && verdict !== "legit") {
    return NextResponse.json({ error: "Verdict must be scam or legit" }, { status: 400 });
  }

  const cases = await db.select().from(scams).where(eq(scams.id, caseId)).limit(1);
  if (!cases.length) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  const c = cases[0];

  const profile = await getOrCreateLearner(learnerId);
  const before = await currentStreakFor(learnerId);

  const correct = (verdict === "scam") === c.isScam;
  const streak = correct ? before + 1 : 0;
  const xpEarned = xpForCorrect(correct, streak);

  await db.insert(attempts).values({
    learnerId,
    caseId: c.id,
    verdict,
    correct,
    xpEarned,
    streak,
  });

  await db
    .update(learners)
    .set({
      xp: sql`${learners.xp} + ${xpEarned}`,
      bestStreak: sql`GREATEST(${learners.bestStreak}, ${streak})`,
    })
    .where(eq(learners.id, profile.id));

  await db
    .update(scams)
    .set({
      timesJudged: sql`${scams.timesJudged} + 1`,
      timesCaught: sql`${scams.timesCaught} + ${correct ? 1 : 0}`,
    })
    .where(eq(scams.id, c.id));

  return NextResponse.json({
    correct,
    isScam: c.isScam,
    title: c.title,
    riskLevel: c.riskLevel,
    category: c.category,
    redFlags: c.redFlags,
    explanation: c.explanation,
    tip: c.tip,
    xpEarned,
    streak,
    xp: profile.xp + xpEarned,
  });
}

export const dynamic = "force-dynamic";
