import planJson from "../data/plan.json";
import movesJson from "../data/moves.json";
import type { AppState, Moves, Plan, Session } from "../types";

export const plan = planJson as Plan;
export const moves = movesJson as Moves;

export type Part = "warm" | "main" | "cool" | "pm";

// A tick id is stable as long as the plan content keeps its order: "<day>-<part>-<index>".
export const tickId = (n: number, part: Part, i = 0) => `${n}-${part}-${i}`;

export function sessionFor(date: string): Session | undefined {
  return plan.days.find((d) => d.date === date);
}

// Every tick id that has to be done for the session to count as complete.
export function requiredTicks(s: Session): string[] {
  const ids: string[] = [];
  if (s.warmup) ids.push(tickId(s.n, "warm"));
  s.main.forEach((_, i) => ids.push(tickId(s.n, "main", i)));
  if (s.cooldown) ids.push(tickId(s.n, "cool"));
  if (s.afternoon?.counts) s.afternoon.items.forEach((_, i) => ids.push(tickId(s.n, "pm", i)));
  return ids;
}

export function sessionDone(s: Session, state: AppState): boolean {
  return requiredTicks(s).every((id) => state.ticks[id]);
}
