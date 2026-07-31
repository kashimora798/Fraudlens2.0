import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const learners = pgTable("learners", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default("Rookie Agent"),
  xp: integer("xp").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  scansRun: integer("scans_run").notNull().default(0),
  simulationsCompleted: integer("simulations_completed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const scams = pgTable("scams", {
  id: serial("id").primaryKey(),
  caseCode: text("case_code").notNull().unique(),
  title: text("title").notNull(),
  channel: text("channel").notNull(),
  category: text("category").notNull(),
  riskLevel: text("risk_level").notNull().default("high"),
  isScam: boolean("is_scam").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  sender: text("sender").notNull(),
  content: text("content").notNull(),
  meta: jsonb("meta").$type<Record<string, string>>().notNull().default({}),
  redFlags: jsonb("red_flags").$type<string[]>().notNull().default([]),
  explanation: text("explanation").notNull(),
  tip: text("tip").notNull(),
  timesJudged: integer("times_judged").notNull().default(0),
  timesCaught: integer("times_caught").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  learnerId: text("learner_id")
    .notNull()
    .references(() => learners.id),
  caseId: integer("case_id")
    .notNull()
    .references(() => scams.id),
  verdict: text("verdict").notNull(),
  correct: boolean("correct").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: serial("id").primaryKey(),
    learnerId: text("learner_id")
      .notNull()
      .references(() => learners.id),
    lessonId: text("lesson_id").notNull(),
    completedAt: timestamp("completed_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("uq_learner_lesson").on(t.learnerId, t.lessonId)],
);

/* ----- IMMERSIVE SIMULATION SCENARIOS ----- */

export interface SimMessage {
  from: "scammer" | "user-option";
  text: string;
  delayMs: number; // ms after previous message
}

export interface SimPhase {
  id: string;
  messages: SimMessage[];
  userPrompt?: string; // shown while waiting for user to "respond"
  userOptions?: { label: string; nextPhase: string }[];
}

export const simScenarios = pgTable("sim_scenarios", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  platform: text("platform").notNull(), // whatsapp | instagram | call | sms
  scammerName: text("scammer_name").notNull(),
  scammerAvatar: text("scammer_avatar").notNull().default(""),
  scammerNumber: text("scammer_number").notNull().default(""),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  riskLevel: text("risk_level").notNull().default("high"),
  phases: jsonb("phases").$type<SimPhase[]>().notNull(),
  redFlags: jsonb("red_flags").$type<string[]>().notNull().default([]),
  debriefTitle: text("debrief_title").notNull(),
  debriefBody: text("debrief_body").notNull(),
  debriefTip: text("debrief_tip").notNull(),
  xpReward: integer("xp_reward").notNull().default(50),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const simSessions = pgTable("sim_sessions", {
  id: serial("id").primaryKey(),
  learnerId: text("learner_id")
    .notNull()
    .references(() => learners.id),
  scenarioId: integer("scenario_id")
    .notNull()
    .references(() => simScenarios.id),
  outcome: text("outcome"), // caught | fell-for-it | in-progress
  xpEarned: integer("xp_earned").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
});
