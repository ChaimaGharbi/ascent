// Vercel serverless function: GET and PUT the whole app state in Upstash Redis.
// Both need the header  x-passphrase: <APP_PASSPHRASE>.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { timingSafeEqual } from "node:crypto";

const KEY = "ascent:state:v1"; // separate from the old app's key, so both can run side by side
const MAX_BYTES = 256 * 1024;  // a year of daily logs fits easily

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const PASS = process.env.APP_PASSPHRASE ?? "";

function passOk(given: unknown): boolean {
  if (!PASS || typeof given !== "string") return false;
  const a = Buffer.from(given), b = Buffer.from(PASS);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function redis(cmd: (string | number)[]) {
  const r = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const j = (await r.json()) as { result?: unknown; error?: string };
  if (!r.ok || j.error) throw new Error(j.error ?? `Redis HTTP ${r.status}`);
  return j.result;
}

// Learning task (milestone 1): replace this shape check with a real schema, for example with zod.
function looksLikeState(x: unknown): x is Record<string, unknown> {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const s = x as Record<string, unknown>;
  return s.version === 1 && typeof s.ticks === "object" && typeof s.days === "object" && typeof s.settings === "object";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOKEN) return res.status(500).json({ error: "Database not connected." });
  if (!PASS) return res.status(500).json({ error: "APP_PASSPHRASE is not set." });
  if (!passOk(req.headers["x-passphrase"])) return res.status(401).json({ error: "Wrong passphrase." });

  try {
    if (req.method === "GET") {
      const raw = (await redis(["GET", KEY])) as string | null;
      return res.status(200).json(raw ? JSON.parse(raw) : { version: 1, ticks: {}, days: {}, settings: {} });
    }
    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
      if (!looksLikeState(body)) return res.status(400).json({ error: "Body is not an Ascent state." });
      const text = JSON.stringify(body);
      if (Buffer.byteLength(text) > MAX_BYTES) return res.status(413).json({ error: "State too large." });
      await redis(["SET", KEY, text]);
      return res.status(200).json(body);
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (e) {
    return res.status(502).json({ error: "Database error: " + (e as Error).message });
  }
}
