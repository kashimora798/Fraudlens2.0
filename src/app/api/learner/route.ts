import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, getOrCreateLearner, ID_RE, learnerStats, learners } from "@/lib/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";
  if (!ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid learner id" }, { status: 400 });
  }
  const stats = await learnerStats(id);
  return NextResponse.json(stats);
}

export async function PATCH(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { id, name } = body as { id?: string; name?: string };
  if (!id || !ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid learner id" }, { status: 400 });
  }
  const trimmed = (name ?? "").trim();
  if (trimmed.length < 2 || trimmed.length > 24) {
    return NextResponse.json(
      { error: "Agent name must be 2–24 characters" },
      { status: 400 },
    );
  }
  await getOrCreateLearner(id);
  await db.update(learners).set({ name: trimmed }).where(eq(learners.id, id));
  const stats = await learnerStats(id);
  return NextResponse.json(stats);
}

export const dynamic = "force-dynamic";
