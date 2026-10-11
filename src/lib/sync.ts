import type { AppState } from "../types";

// Thin client for /api/state. The passphrase travels in a header; the server compares it in constant time.
export class SyncError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

async function call(method: "GET" | "PUT", pass: string, body?: AppState): Promise<AppState> {
  const res = await fetch("/api/state", {
    method,
    headers: { "Content-Type": "application/json", "x-passphrase": pass },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new SyncError(json.error ?? `Error ${res.status}`, res.status);
  return json as AppState;
}

export const pull = (pass: string) => call("GET", pass);
export const push = (pass: string, state: AppState) => call("PUT", pass, state);
