import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, scams } from "@/lib/server";
import type { Channel } from "@/lib/types";

const CHANNELS: Channel[] = ["sms", "whatsapp", "email", "website", "call", "upi"];
const DIFFICULTIES = ["easy", "medium", "hard"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");
  const difficulty = searchParams.get("difficulty");
  const excludeRaw = searchParams.get("exclude") ?? "";

  const excludeIds = excludeRaw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));

  const conds = [];
  if (channel && CHANNELS.includes(channel as Channel)) {
    conds.push(eq(scams.channel, channel));
  }
  if (difficulty && DIFFICULTIES.includes(difficulty)) {
    conds.push(eq(scams.difficulty, difficulty));
  }

  let rows = await db
    .select()
    .from(scams)
    .where(conds.length ? and(...conds) : undefined);

  if (!rows.length && conds.length) {
    rows = await db.select().from(scams);
  }

  let pool = rows;
  if (excludeIds.length) {
    const filtered = rows.filter((r) => !excludeIds.includes(r.id));
    if (filtered.length) pool = filtered;
  }

  if (!pool.length) {
    return NextResponse.json({ error: "No cases in the database" }, { status: 404 });
  }

  const pick = pool[Math.floor(Math.random() * pool.length)];
  return NextResponse.json(pick);
}

export const dynamic = "force-dynamic";
