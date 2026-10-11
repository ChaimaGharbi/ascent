import { useState } from "react";
import { useAppState } from "./lib/useAppState";
import { PlanPage } from "./pages/PlanPage";
import { TodayPage } from "./pages/TodayPage";

type Tab = "today" | "plan";

export default function App() {
  const { state, update, pass, setPass, status } = useAppState();
  const [tab, setTab] = useState<Tab>("plan");

  return (
    <div className="wrap">
      <header className="top">
        <h1>Ascent</h1>
        <span className="status" aria-live="polite">{status}</span>
      </header>

      {!pass && (
        <form className="sync" onSubmit={(e) => { e.preventDefault(); const v = new FormData(e.currentTarget).get("pass"); if (typeof v === "string" && v.trim()) setPass(v.trim()); }}>
          <label htmlFor="pass">Sync passphrase</label>
          <input id="pass" name="pass" type="password" autoComplete="current-password" />
          <button type="submit">Connect</button>
        </form>
      )}

      <nav className="tabs" aria-label="Sections">
        {(["today", "plan"] as Tab[]).map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t === "today" ? "Today" : "Plan"}</button>
        ))}
      </nav>

      {tab === "today" ? <TodayPage state={state} update={update} /> : <PlanPage state={state} update={update} />}
    </div>
  );
}
