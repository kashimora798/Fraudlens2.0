import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { analyzeText } from "@/lib/scanner";
import { db, ID_RE, learners } from "@/lib/server";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { text, learnerId } = body as { text?: string; learnerId?: string };

  if (typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json(
      { error: "Paste at least a sentence (10+ characters) to scan." },
      { status: 400 },
    );
  }
  if (text.length > 5000) {
    return NextResponse.json(
      { error: "Message too long — keep scans under 5,000 characters." },
      { status: 400 },
    );
  }

  if (learnerId && ID_RE.test(learnerId)) {
    await db
      .update(learners)
      .set({ scansRun: sql`${learners.scansRun} + 1` })
      .where(eq(learners.id, learnerId))
      .catch(() => {});
  }

  const result = analyzeText(text.trim());
  return NextResponse.json(result);
}

export const dynamic = "force-dynamic";
