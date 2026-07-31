import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { learners, simSessions } from "@/db/schema";

export async function GET() {
  const rows = await db
    .select({
      id: learners.id,
      name: learners.name,
      xp: learners.xp,
      simulationsCompleted: learners.simulationsCompleted,
    })
    .from(learners)
    .orderBy(desc(learners.xp), desc(learners.simulationsCompleted))
    .limit(50);

  const sessions = await db
    .select({
      learnerId: simSessions.learnerId,
      caught: sql<boolean>`${simSessions.outcome} = 'caught'`,
    })
    .from(simSessions);

  const stats = rows.map((r) => {
    const userSessions = sessions.filter((s) => s.learnerId === r.id);
    const caught = userSessions.filter((s) => s.caught).length;
    return {
      rank: 0,
      id: r.id,
      name: r.name || "Rookie Agent",
      xp: r.xp,
      simulations: r.simulationsCompleted,
      accuracy: userSessions.length > 0 ? Math.round((100 * caught) / userSessions.length) : 0,
    };
  });

  const withRank = stats.map((s, i) => ({ ...s, rank: i + 1 }));

  return NextResponse.json({ leaderboard: withRank, updatedAt: new Date().toISOString() });
}

export const dynamic = "force-dynamic";
