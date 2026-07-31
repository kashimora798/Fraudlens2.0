export type Verdict = "scam" | "legit";
export type Channel = "sms" | "whatsapp" | "email" | "website" | "call" | "upi";

export interface ScamCase {
  id: number;
  caseCode: string;
  title: string;
  channel: string;
  category: string;
  riskLevel: string;
  isScam: boolean;
  difficulty: string;
  sender: string;
  content: string;
  meta: Record<string, string>;
  redFlags: string[];
  explanation: string;
  tip: string;
  timesJudged: number;
  timesCaught: number;
}

export interface LearnerStats {
  id: string;
  name: string;
  xp: number;
  bestStreak: number;
  scansRun: number;
  attempts: number;
  correct: number;
  currentStreak: number;
  lessonsDone: number;
  byCategory: { category: string; attempts: number; correct: number }[];
  recent: {
    caseCode: string;
    title: string;
    channel: string;
    verdict: string;
    correct: boolean;
    xpEarned: number;
    createdAt: string;
  }[];
}

export interface ScanFlag {
  ruleId: string;
  label: string;
  severity: "critical" | "high" | "medium" | "low";
  matched: string;
  tip: string;
  start: number;
  end: number;
}

export interface ScanResult {
  text: string;
  score: number;
  verdict: "danger" | "suspicious" | "clean";
  verdictLabel: string;
  summary: string;
  flags: ScanFlag[];
}
