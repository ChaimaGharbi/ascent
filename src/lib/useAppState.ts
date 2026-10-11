import { useCallback, useEffect, useRef, useState } from "react";
import type { AppState } from "../types";
import { loadLocal, loadPass, saveLocal, savePass } from "./storage";
import { pull, push, SyncError } from "./sync";

// One hook owns the whole app state:
// 1. starts from the local copy (instant, works offline)
// 2. pulls from the server when a passphrase is set and when the app comes back to the foreground
// 3. pushes changes about a second after the last edit (debounce), newest save wins
export function useAppState() {
  const [state, setState] = useState<AppState>(loadLocal);
  const [pass, setPassState] = useState<string | null>(loadPass);
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const dirty = useRef(false);

  const doPull = useCallback(async (p: string | null) => {
    if (!p || dirty.current) return;
    try {
      setStatus("Syncing");
      const remote = await pull(p);
      setState(remote);
      saveLocal(remote);
      setStatus("Synced");
    } catch (e) {
      if (e instanceof SyncError && e.status === 401) { savePass(null); setPassState(null); setStatus("Wrong passphrase"); }
      else setStatus("Offline: changes stay on this device");
    }
  }, []);

  useEffect(() => { doPull(pass); }, [pass, doPull]);
  useEffect(() => {
    const onShow = () => { if (document.visibilityState === "visible") doPull(pass); };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [pass, doPull]);

  // Every edit goes through update(): it saves locally right away and schedules a push.
  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev);
      saveLocal(next);
      if (pass) {
        dirty.current = true;
        setStatus("Saving");
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(async () => {
          try { await push(pass, next); setStatus("Synced"); }
          catch { setStatus("Could not sync, will retry on next change"); }
          dirty.current = false;
        }, 1000);
      }
      return next;
    });
  }, [pass]);

  const setPass = (p: string) => { savePass(p); setPassState(p); };

  return { state, update, pass, setPass, status };
}
