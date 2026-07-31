export const LEVELS = [
  { name: "Recruit", min: 0 },
  { name: "Cadet", min: 100 },
  { name: "Analyst", min: 250 },
  { name: "Hunter", min: 500 },
  { name: "Sentinel", min: 900 },
  { name: "Legend", min: 1500 },
] as const;

export interface LevelInfo {
  index: number;
  name: string;
  min: number;
  next: number | null;
  nextName: string | null;
  progress: number; // 0..1 inside current level
}

export function levelFor(xp: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) index = i;
  }
  const cur = LEVELS[index];
  const next = index + 1 < LEVELS.length ? LEVELS[index + 1] : null;
  return {
    index,
    name: cur.name,
    min: cur.min,
    next: next ? next.min : null,
    nextName: next ? next.name : null,
    progress: next ? Math.min(1, (xp - cur.min) / (next.min - cur.min)) : 1,
  };
}

export function xpForCorrect(correct: boolean, streak: number): number {
  if (!correct) return 5; // participation XP — learning still counts
  return 25 + Math.min(25, Math.max(0, streak - 1) * 5);
}

export interface BadgeStats {
  attempts: number;
  correct: number;
  bestStreak: number;
  lessonsDone: number;
  totalLessons: number;
  scansRun: number;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  earned: (s: BadgeStats) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: "first-catch",
    name: "First Catch",
    desc: "Correctly flag your first scam.",
    earned: (s) => s.correct >= 1,
  },
  {
    id: "eagle-eye",
    name: "Eagle Eye",
    desc: "10 correct verdicts in the simulator.",
    earned: (s) => s.correct >= 10,
  },
  {
    id: "streak-5",
    name: "Streak Machine",
    desc: "Reach a 5-verdict streak.",
    earned: (s) => s.bestStreak >= 5,
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    desc: "80%+ accuracy across 15+ cases.",
    earned: (s) => s.attempts >= 15 && s.correct / s.attempts >= 0.8,
  },
  {
    id: "case-closer",
    name: "Case Closer",
    desc: "Judge 25 simulator cases.",
    earned: (s) => s.attempts >= 25,
  },
  {
    id: "signal-scanner",
    name: "Signal Scanner",
    desc: "Run the message scanner 3 times.",
    earned: (s) => s.scansRun >= 3,
  },
  {
    id: "graduate",
    name: "Academy Graduate",
    desc: "Complete 4 academy lessons.",
    earned: (s) => s.lessonsDone >= 4,
  },
  {
    id: "scholar",
    name: "Cyber Scholar",
    desc: `Complete all ${8} academy lessons.`,
    earned: (s) => s.lessonsDone >= s.totalLessons && s.totalLessons > 0,
  },
];

export const CHANNEL_LABEL: Record<string, string> = {
  sms: "SMS",
  whatsapp: "WhatsApp",
  email: "Email",
  website: "Website",
  call: "Call",
  upi: "UPI",
};

export const RISK_COLOR: Record<string, string> = {
  high: "text-alert border-alert/40 bg-alert/10",
  medium: "text-amber border-amber/40 bg-amber/10",
  low: "text-mint border-mint/40 bg-mint/10",
};
