import { db } from "@/db";
import { desc } from "drizzle-orm";
import { learners, simSessions } from "@/db/schema";
import { Chip, Kicker, Reveal } from "@/components/ui";
import { IconCrown, IconMedal, IconStar, IconTrophy } from "@/components/icons";
import { levelFor } from "@/lib/meta";

export const dynamic = "force-dynamic";

const MEDALS = [
  <IconCrown className="h-6 w-6 text-yellow-400" />,
  <IconMedal className="h-6 w-6 text-gray-300" />,
  <IconMedal className="h-6 w-6 text-yellow-600" />,
];

const XP_MILESTONES = [
  { xp: 500, label: "Analyst" },
  { xp: 1000, label: "Hunter" },
  { xp: 2000, label: "Sentinel" },
  { xp: 5000, label: "Legend" },
];

export default async function LeaderboardPage() {
  const rows = await db
    .select({
      id: learners.id,
      name: learners.name,
      xp: learners.xp,
      simulationsCompleted: learners.simulationsCompleted,
      bestStreak: learners.bestStreak,
    })
    .from(learners)
    .orderBy(desc(learners.xp), desc(learners.simulationsCompleted))
    .limit(50);

  const sessions = await db.select().from(simSessions);

  const leaderboard = rows.map((r, i) => {
    const userSessions = sessions.filter((s) => s.learnerId === r.id);
    const caught = userSessions.filter((s) => s.outcome === "caught").length;
    const accuracy = userSessions.length > 0 ? Math.round((100 * caught) / userSessions.length) : 0;
    const level = levelFor(r.xp);
    return {
      rank: i + 1,
      id: r.id,
      name: r.name || "Rookie Agent",
      xp: r.xp,
      level: level.name,
      simulations: r.simulationsCompleted,
      accuracy,
      streak: r.bestStreak,
    };
  });

  const totalAgents = leaderboard.length;
  const totalXP = leaderboard.reduce((a, b) => a + b.xp, 0);
  const totalSimulations = leaderboard.reduce((a, b) => a + b.simulations, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>Hall of fame</Kicker>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Cyber defense leaderboard
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-400">
            The top agents who've trained the hardest and caught the most scams. Can you
            climb to the top?
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Chip tone="mint">
            <IconTrophy className="h-3.5 w-3.5" />
            {totalAgents} agents
          </Chip>
          <Chip tone="cyan">{totalXP.toLocaleString()} XP earned</Chip>
          <Chip tone="amber">{totalSimulations} simulations</Chip>
        </div>
      </div>

      {/* Podium */}
      {leaderboard.length >= 3 && (
        <Reveal className="mt-10">
          <div className="relative flex justify-center gap-4">
            {/* 2nd place */}
            <div className="relative z-10 mt-8 flex flex-col items-center">
              <div className="h-48 w-48 rounded-2xl border-2 border-gray-600 bg-[#0e1729]/80 p-6 shadow-2xl backdrop-blur-sm">
                <span className="text-2xl text-gray-500">2</span>
                <div className="mt-2 h-20 w-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-3xl font-bold text-white">
                  {leaderboard[1].name.slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 truncate text-center font-display text-lg font-bold text-white">
                  {leaderboard[1].name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
                  {leaderboard[1].xp} XP
                </p>
              </div>
            </div>

            {/* 1st place */}
            <div className="relative z-20 mt-0 flex flex-col items-center">
              <div className="absolute -top-12 text-6xl text-yellow-400 drop-shadow-[0_0_30px_rgba(255,215,0,0.7)]">
                {MEDALS[0]}
              </div>
              <div className="h-60 w-52 rounded-2xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-500/10 to-yellow-400/5 p-6 shadow-2xl shadow-yellow-500/20 backdrop-blur-sm">
                <span className="text-3xl font-bold text-yellow-400">1</span>
                <div className="mt-2 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-4xl font-bold text-white">
                  {leaderboard[0].name.slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 truncate text-center font-display text-xl font-bold text-white">
                  {leaderboard[0].name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-yellow-300">
                  {leaderboard[0].xp} XP · {leaderboard[0].accuracy}% accuracy
                </p>
              </div>
            </div>

            {/* 3rd place */}
            <div className="relative z-10 mt-8 flex flex-col items-center">
              <div className="h-48 w-48 rounded-2xl border-2 border-yellow-600/40 bg-[#0e1729]/80 p-6 shadow-2xl backdrop-blur-sm">
                <span className="text-2xl text-yellow-600">3</span>
                <div className="mt-2 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-900 flex items-center justify-center text-3xl font-bold text-white">
                  {leaderboard[2].name.slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 truncate text-center font-display text-lg font-bold text-white">
                  {leaderboard[2].name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
                  {leaderboard[2].xp} XP
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Full leaderboard */}
      <Reveal className="mt-12" delay={200}>
        <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-[#0e1729]/60">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-gray-700/50 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
                <th className="pb-3 pl-5 font-medium">Rank</th>
                <th className="pb-3 px-4 font-medium">Agent</th>
                <th className="pb-3 px-4 font-medium">Level</th>
                <th className="pb-3 px-4 font-medium text-right">XP</th>
                <th className="pb-3 px-4 font-medium text-right">Simulations</th>
                <th className="pb-3 px-4 font-medium text-right">Accuracy</th>
                <th className="pb-3 pr-5 font-medium text-right">Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((a, i) => (
                <tr
                  key={a.id}
                  className={`border-b border-gray-700/30 transition-colors hover:bg-gray-800/30 ${
                    i < 3 ? "bg-gray-800/20" : ""
                  }`}
                >
                  <td className="py-3 pl-5">
                    <span className="font-display text-lg font-bold text-gray-400">
                      {a.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 font-display text-[11px] font-bold text-white">
                        {a.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="font-display text-[13.5px] font-semibold text-white">
                        {a.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Chip tone="cyan" className="px-2 py-0.5 text-[10px]">
                      {a.level}
                    </Chip>
                  </td>
                  <td className="py-3 px-4 font-mono text-[13px] text-amber-400 text-right">
                    {a.xp.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-[13px] text-gray-400 text-right">
                    {a.simulations}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Chip tone={a.accuracy >= 80 ? "mint" : a.accuracy >= 50 ? "amber" : "alert"}>
                      {a.accuracy}%
                    </Chip>
                  </td>
                  <td className="py-3 pr-5 font-mono text-[12px] text-cyan-400 text-right">
                    ×{a.streak}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* XP Milestones */}
      <Reveal className="mt-12" delay={400}>
        <div className="rounded-xl border border-gray-700/50 bg-[#0e1729]/60 p-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-cyan-400">
            XP milestones
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {XP_MILESTONES.map((m) => {
              const count = leaderboard.filter((a) => a.xp >= m.xp).length;
              const pct = Math.round((100 * count) / totalAgents);
              return (
                <div key={m.xp} className="rounded-lg border border-gray-700/50 bg-gray-800/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    {m.label}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-white">
                    {m.xp.toLocaleString()} XP
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-mint-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-gray-500">
                    {count} agents ({pct}%)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10 text-center" delay={600}>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-600">
          Want to join the leaderboard?
        </p>
        <a
          href="/simulator"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 px-6 py-3 font-display text-[13px] font-bold uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-500"
        >
          Train now
        </a>
      </Reveal>
    </div>
  );
}
