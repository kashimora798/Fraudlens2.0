import type { LearnerStats } from "./types";

export function getLearnerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("fraudlens-id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `fl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("fraudlens-id", id);
  }
  return id;
}

export async function fetchLearner(): Promise<LearnerStats> {
  const id = getLearnerId();
  const res = await fetch(`/api/learner?id=${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load learner profile");
  return (await res.json()) as LearnerStats;
}
