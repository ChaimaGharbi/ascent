# Ascent

My personal app for training, steps, food, goals and habits. React + TypeScript + Vite, installable as a PWA, synced through a Vercel function and Upstash Redis.

## Run it

```bash
npm install
npm run dev        # front end only, http://localhost:5173 (sync shows "Offline")
npm run dev:full   # front end + /api with real env vars (needs: npm i -g vercel, vercel link, vercel env pull .env.local)
npm test           # unit tests (vitest)
npm run build      # typecheck + production build + service worker
```

## How it fits together

```
src/
  data/plan.json        the training plan (content, read-only)
  data/moves.json       warm-up, mobility and stretching moves
  types.ts              shapes of the plan and of AppState
  lib/plan.ts           plan helpers: tickId, sessionFor, sessionDone
  lib/dates.ts          ISO date helpers (+ dates.test.ts)
  lib/storage.ts        local copy in localStorage (offline, instant start)
  lib/sync.ts           client for /api/state
  lib/useAppState.ts    the one hook that owns state: load local, pull, debounce push
  components/           AnimatedPicture, TickRow
  pages/                PlanPage (done), TodayPage (milestone 1)

See ROADMAP.md for the milestones and who builds what.
api/state.ts            GET/PUT the whole state in Redis, guarded by a passphrase
public/exercises/       start (-0) and end (-1) photo for each move
```

Data flow: a component calls `update(fn)` → the hook saves locally → about 1 s later it PUTs the whole state → other devices pull it when the app comes back to the foreground. Newest save wins.

## Deploy

1. New GitHub repo, push this folder.
2. Vercel: import the repo. Framework preset Vite is detected automatically.
3. Storage → connect your existing Upstash database (prefix `KV`), or create one.
4. Environment variables: `APP_PASSPHRASE`.
5. Deploy. It uses its own Redis key (`ascent:state:v1`), so the old app keeps working until you migrate.

## Credits

Exercise photos: free-exercise-db (public domain). Plan sources: Amanda (hip and quad work), Jessica Bickling (hip mobility), rigiiko (leg press positions), Chloe Ting (home workouts).
