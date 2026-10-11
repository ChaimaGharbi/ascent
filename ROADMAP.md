# Ascent roadmap

## How we split the work

- **You build the interesting part** of each milestone: the design decisions, the core logic, anything new to learn.
- **Claude builds the easy code** around it: forms, lists, styling, CRUD wiring, boilerplate, schemas and test scaffolding.
- Each milestone is one branch and one pull request. Claude's part lands first, so you start from a working screen.
- Before you code your part, write a short design note in the PR description (data shape, approach, trade-offs). Claude reviews the note, then the code.

Already done: Plan page with ticks and moving pictures, sync across devices, offline mode, installable PWA, TypeScript API.

---

## Milestone 1: Today page and daily log

A Today page keyed by date, so the app keeps working after the current plan ends.

**Claude builds**
- Today page layout: steps field, step goal bar, four meal fields, note, "count this day as complete", previous and next day arrows.
- Settings screen with the daily step goal.
- zod schema for the whole state, used on both client and server.

**You build**
- `DayLog` type and the date-keyed data model.
- 7-day step average and day completion logic (plan done, or complete your way).
- Sync conflict handling: today the newest save wins. Design a merge (per day, per field) so editing on phone and laptop never loses data.

**You learn:** data modeling, derived state, merge strategies for offline-first apps.

---

## Milestone 2: Customizable program and exercise database

Replace the fixed plan with programs you build and edit, and days you can change on the spot (rain cancels the hike).

**Claude builds**
- Import of free-exercise-db (800+ exercises, public domain): names, muscles, equipment, instructions, images.
- Exercise browser UI: search box, filters by muscle and equipment, detail view with the start and end photos.
- Program editor screens: add, remove and reorder exercises, sets, reps, weight, notes.
- "Edit this day" screen: change title, time and tags, swap or add exercises for one day only.

**You build**
- Program data model: templates (Legs: quads), weekly schedule, per-day overrides, without breaking past ticks.
- Search and ranking: fuzzy matching, filters, "similar exercise" suggestions when you swap one out.
- Progression logic: suggest the next weight or reps from what you logged last time.

**You learn:** relational modeling in a document store, search, recommendation basics.

---

## Milestone 3: Food logging with an LLM

Type what you ate in plain language, get foods, quantities, calories and macros.

**Design**
- Local model with **Ollama** on your laptop (Qwen 2.5 or Llama 3.2, 3B to 8B), structured output with a JSON schema.
- Phone reaches the laptop through **Tailscale**, with **Tailscale Serve** for a private HTTPS address.
- Nutrient values come from **USDA FoodData Central** (free key, 1,000 requests per hour), never from the model.
- Fallback when the laptop is off: queue the text and process it later, or use a small cloud model on your existing Anthropic or OpenAI credits.
- MyFitnessPal is not an option: its API is private and approval-only.

**Claude builds**
- Food log UI: text box per meal, results table, edit a parsed item, daily totals.
- USDA client and a Redis cache for lookups.
- Ollama and Tailscale setup guide, CORS settings, a health-check endpoint.

**You build**
- The extraction pipeline: prompt, JSON schema, validation, retries on invalid output.
- Matching parsed foods to the right USDA entry, and unit conversion (a cup, a handful, 2 eggs to grams).
- Routing between local and cloud, the offline queue.
- An evaluation set of about 50 real meals: measure parsing accuracy, latency and cost, local vs. cloud. Good material for a blog post.

**You learn:** structured LLM output, evaluation, LLM cost and latency optimization, private networking.

---

## Milestone 4: Daily to-dos and professional goals

**Claude builds**
- To-do list per day: add, tick, delete, "move unfinished to tomorrow".
- Goals tab: goals by area (career, fitness, personal), target date, checklist of steps.

**You build**
- Recurring to-dos (every weekday, every Monday) and how they appear in each day.
- Goal progress computed from linked to-dos and habits, not entered by hand.

**You learn:** recurrence rules, linking entities, computed progress.

---

## Milestone 5: Points, rewards, streaks and badges

**Claude builds**
- Habits screen (name, points), rewards screen (name, cost), redeem button, history list, badge display.

**You build**
- Points engine as pure functions with unit tests: earned from habits, a perfect training day, step goal, eating well, screen time under your limit.
- Balance always computed from the data, never stored.
- Streak rules (do rest days break a streak?) and badge conditions (7-day streak, 10 perfect days).
- Economy balance: rewards like guilt-free TikTok time should stay earned, not inflated.

**You learn:** game design logic, pure functions, test-driven development.

---

## Milestone 6: Reminders

Real notifications on your phone, for example "Chloe Ting at 16:00".

**Claude builds**
- Settings UI for reminders, VAPID key setup, subscription storage endpoint.

**You build**
- Push flow: `PushManager.subscribe`, the `push` handler in the service worker, sending from `api/remind`.
- Scheduling with **Upstash QStash** (Vercel Hobby cron runs only once a day), time zones, "snooze".
- Smart reminders: only remind if the thing isn't done yet.

**You learn:** service workers, web push, scheduled jobs, secrets.

---

## Milestone 7: Android app with Health Connect

**Claude builds**
- Capacitor setup, Android project, build and install guide for Android Studio, icons and splash screen.

**You build**
- Read steps and calories from **Health Connect**, request permissions, fill the Today page automatically.
- Handle conflicts between typed and synced steps.

Later, when Google opens the **Google Health API** to new developers, the web app could read the same data from the cloud.

**You learn:** hybrid apps, native permissions, Android build tooling.

---

## Milestone 8: App blocker

**Claude builds**
- Settings screen: choose apps to limit, daily limits, a native plugin skeleton.

**You build**
- Native Android module in Kotlin: **UsageStats** to detect the app in front, an overlay or Accessibility service to interrupt TikTok and other chosen apps.
- Link to milestone 5: spend points to unlock time.

Until then, Digital Wellbeing app timers do the job.

**You learn:** Kotlin, Android services, sensitive permissions, designing friction ethically.

---

## Migration from the old app

After milestone 1, Claude adds an export button to the old app. You write the import that maps old plan-day logs (`log["3"]`) to dates (`days["2026-10-07"]`), including ticks, food, steps and day edits. Then switch.

## Costs

Everything here is free for personal use: Vercel Hobby, Upstash free tiers, USDA, Ollama, Tailscale, Android Studio, Health Connect, sideloading the APK. Optional costs: a custom domain (about 10 to 15 euros a year), Play Store publishing (25 dollars once), cloud LLM fallback (your existing credits).
