import { useState } from "react";
import type { AppState, Move } from "../types";
import { moves, plan, sessionDone, tickId } from "../lib/plan";
import { todayISO } from "../lib/dates";
import { AnimatedPicture } from "../components/AnimatedPicture";
import { TickRow } from "../components/TickRow";

type Props = { state: AppState; update: (fn: (s: AppState) => AppState) => void };

function MoveGrid({ list }: { list: Move[] }) {
  return (
    <ul className="moves">
      {list.map((m, i) => (
        <li key={i}><AnimatedPicture img={m.img} /><span>{m.text}</span></li>
      ))}
    </ul>
  );
}

export function PlanPage({ state, update }: Props) {
  const today = todayISO();
  const [n, setN] = useState(() => (plan.days.find((d) => d.date >= today) ?? plan.days[0]).n);
  const s = plan.days.find((d) => d.n === n)!;

  // Immutable update: copy the ticks object, then add or remove one id.
  const toggle = (id: string, on: boolean) =>
    update((st) => {
      const ticks = { ...st.ticks };
      if (on) ticks[id] = true; else delete ticks[id];
      return { ...st, ticks };
    });

  return (
    <>
      <nav className="strip" aria-label="Plan days">
        {plan.days.map((d) => (
          <button key={d.n} className={`chip${sessionDone(d, state) ? " chip--done" : ""}`} aria-pressed={d.n === n} onClick={() => setN(d.n)}>
            <span className="chip__kind">{d.kind}</span>
            <span className="chip__n">{d.n}</span>
            <span className="chip__date">{d.date.slice(5)}</span>
          </button>
        ))}
      </nav>

      <section className="card">
        <div className="eyebrow">Day {s.n} · {s.date}</div>
        <h2>{s.kind}</h2>
        <div className="tags">
          {s.time !== "none" && <span className="tag tag--time">Go at {s.time}</span>}
          {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        {s.note && <p className="note">{s.note}</p>}

        {s.warmup && (
          <div className="block">
            <h3>Before · {s.warmup === "mobility" ? "hip mobility" : "dynamic warm-up"}</h3>
            <ul className="list">
              <TickRow id={tickId(s.n, "warm")} item={{ text: s.warmup === "mobility" ? "Hip mobility warm-up, 6 to 7 min" : "Dynamic warm-up, 5 to 6 min" }} checked={!!state.ticks[tickId(s.n, "warm")]} onToggle={toggle} />
            </ul>
            <MoveGrid list={s.warmup === "mobility" ? moves.mobility : moves.dynamic} />
          </div>
        )}

        <div className="block">
          <h3>Main work</h3>
          <ul className="list">
            {s.main.map((it, i) => {
              const id = tickId(s.n, "main", i);
              return <TickRow key={id} id={id} item={it} checked={!!state.ticks[id]} onToggle={toggle} />;
            })}
          </ul>
        </div>

        {s.cooldown && (
          <div className="block">
            <h3>After · static stretching</h3>
            <ul className="list">
              <TickRow id={tickId(s.n, "cool")} item={{ text: "Static stretches, 30 s each side" }} checked={!!state.ticks[tickId(s.n, "cool")]} onToggle={toggle} />
            </ul>
            <MoveGrid list={moves.cooldown} />
          </div>
        )}

        {s.afternoon && (
          <div className="block">
            <h3>{s.afternoon.label} · {s.afternoon.time}</h3>
            <ul className="list">
              {s.afternoon.items.map((it, i) => {
                const id = tickId(s.n, "pm", i);
                return <TickRow key={id} id={id} item={it} checked={!!state.ticks[id]} onToggle={toggle} />;
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
