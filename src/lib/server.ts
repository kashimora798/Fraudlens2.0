import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { attempts, learners, lessonProgress, scams } from "@/db/schema";
import type { LearnerStats } from "./types";

export const ID_RE = /^[a-zA-Z0-9-]{8,64}$/;

export async function getOrCreateLearner(id: string) {
  const existing = await db
    .select()
    .from(learners)
    .where(eq(learners.id, id))
    .limit(1);
  if (existing.length) return existing[0];
  await db.insert(learners).values({ id }).onConflictDoNothing({
    target: learners.id,
  });
  const created = await db
    .select()
    .from(learners)
    .where(eq(learners.id, id))
    .limit(1);
  return created[0];
}

export async function learnerStats(id: string): Promise<LearnerStats> {
  const profile = await getOrCreateLearner(id);

  const rows = await db
    .select({
      caseId: attempts.caseId,
      verdict: attempts.verdict,
      correct: attempts.correct,
      xpEarned: attempts.xpEarned,
      createdAt: attempts.createdAt,
      caseCode: scams.caseCode,
      title: scams.title,
      channel: scams.channel,
    })
    .from(attempts)
    .innerJoin(scams, eq(attempts.caseId, scams.id))
    .where(eq(attempts.learnerId, id))
    .orderBy(desc(attempts.id));

  const total = rows.length;
  const correct = rows.filter((r) => r.correct).length;

  let currentStreak = 0;
  for (const r of rows) {
    if (r.correct) currentStreak++;
    else break;
  }

  const byCat = await db
    .select({
      category: scams.category,
      n: count(),
      ok: sql<number>`sum(case when ${attempts.correct} then 1 else 0 end)`,
    })
    .from(attempts)
    .innerJoin(scams, eq(attempts.caseId, scams.id))
    .where(eq(attempts.learnerId, id))
    .groupBy(scams.category);

  const lessons = await db
    .select({ n: count() })
    .from(lessonProgress)
    .where(eq(lessonProgress.learnerId, id));

  return {
    id: profile.id,
    name: profile.name,
    xp: profile.xp,
    bestStreak: profile.bestStreak,
    scansRun: profile.scansRun,
    attempts: total,
    correct,
    currentStreak,
    lessonsDone: lessons[0]?.n ?? 0,
    byCategory: byCat.map((b) => ({
      category: b.category,
      attempts: b.n,
      correct: Number(b.ok ?? 0),
    })),
    recent: rows.slice(0, 8).map((r) => ({
      caseCode: r.caseCode,
      title: r.title,
      channel: r.channel,
      verdict: r.verdict,
      correct: r.correct,
      xpEarned: r.xpEarned,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function currentStreakFor(learnerId: string): Promise<number> {
  const rows = await db
    .select({ correct: attempts.correct })
    .from(attempts)
    .where(eq(attempts.learnerId, learnerId))
    .orderBy(desc(attempts.id))
    .limit(60);
  let streak = 0;
  for (const r of rows) {
    if (r.correct) streak++;
    else break;
  }
  return streak;
}

export { and, db, attempts, learners, lessonProgress, scams };
