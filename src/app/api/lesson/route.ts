import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { LESSONS } from "@/lib/lessons";
import { db, getOrCreateLearner, ID_RE, lessonProgress } from "@/lib/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("learnerId") ?? "";
  if (!ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid learner id" }, { status: 400 });
  }
  const rows = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.learnerId, id));
  return NextResponse.json({ completed: rows.map((r) => r.lessonId) });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { learnerId, lessonId } = body as { learnerId?: string; lessonId?: string };
  if (!learnerId || !ID_RE.test(learnerId)) {
    return NextResponse.json({ error: "Invalid learner id" }, { status: 400 });
  }
  if (!lessonId || !LESSONS.some((l) => l.id === lessonId)) {
    return NextResponse.json({ error: "Unknown lesson" }, { status: 400 });
  }

  await getOrCreateLearner(learnerId);
  await db
    .insert(lessonProgress)
    .values({ learnerId, lessonId })
    .onConflictDoNothing();

  const rows = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.learnerId, learnerId));
  return NextResponse.json({ completed: rows.map((r) => r.lessonId) });
}

export const dynamic = "force-dynamic";
