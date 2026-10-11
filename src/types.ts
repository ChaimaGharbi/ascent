// Shared types. Plan types describe src/data/plan.json (read-only content).
// AppState is what you own and sync: ticks, daily logs, settings.

export type Item = {
  text: string;
  img?: string;      // key of a picture in /public/exercises/<img>-0.jpg and -1.jpg
  climber?: boolean; // stair climber rows get a blue edge
  tip?: string;
};

export type Session = {
  n: number;          // plan day number, 2 to 31
  date: string;       // ISO date, e.g. "2026-10-07"
  kind: string;       // "Gym", "Gym + home", "Home", "Rest", ...
  time: string;       // "09:00", "any", "none"
  tags: string[];
  note?: string;
  warmup: "dynamic" | "mobility" | null;
  cooldown: boolean;
  main: Item[];
  afternoon?: { time: string; label: string; counts: boolean; items: Item[] };
};

export type Plan = { title: string; days: Session[] };
export type Move = { text: string; img: string };
export type Moves = { dynamic: Move[]; mobility: Move[]; cooldown: Move[] };

// Milestone 1: design DayLog yourself (steps, food, note, complete...). See ROADMAP.md.
export type DayLog = Record<string, unknown>;

export type AppState = {
  version: 1;
  ticks: Record<string, true>;   // tick ids, see tickId() in src/lib/plan.ts
  days: Record<string, DayLog>;  // keyed by ISO date
  settings: { stepGoal?: number };
};
