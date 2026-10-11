import type { AppState } from "../types";

// Local copy of the state, so the app works offline and opens instantly.
const KEY = "ascent:state:v1";
const PASS = "ascent:pass";

export const emptyState = (): AppState => ({ version: 1, ticks: {}, days: {}, settings: {} });

export function loadLocal(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...emptyState(), ...JSON.parse(raw) };
  } catch { /* private mode or corrupted data: start empty */ }
  return emptyState();
}

export function saveLocal(s: AppState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage full or blocked */ }
}

export const loadPass = () => { try { return localStorage.getItem(PASS); } catch { return null; } };
export const savePass = (p: string | null) => {
  try { if (p) localStorage.setItem(PASS, p); else localStorage.removeItem(PASS); } catch { /* ignore */ }
};
