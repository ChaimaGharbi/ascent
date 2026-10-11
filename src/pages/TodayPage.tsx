import type { AppState } from "../types";
import { formatShort, todayISO } from "../lib/dates";
import { sessionFor } from "../lib/plan";

type Props = { state: AppState; update: (fn: (s: AppState) => AppState) => void };

// Milestone 1 starts here. See ROADMAP.md for what this page should do.
export function TodayPage({ state }: Props) {
  const date = todayISO();
  const session = sessionFor(date);
  return (
    <section className="card">
      <div className="eyebrow">{formatShort(date)}</div>
      <h2>Today</h2>
      <p className="note">
        {session ? `Plan day ${session.n}: ${session.kind}, ${session.tags.join(", ")}.` : "No plan session today."}
      </p>
      <p className="note">Build me in milestone 1: steps, food, note, "count as complete". You have {Object.keys(state.days).length} logged days.</p>
    </section>
  );
}
