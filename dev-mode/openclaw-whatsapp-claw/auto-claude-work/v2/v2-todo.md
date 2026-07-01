# WhatsApp Claw v2 — Implementation Todo

**Created:** 2026-05-21
**Spec:** `dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md`
**Status file:** This file. The remote agent reads it, does the next `- [ ]` task, marks it `- [x]`, commits + pushes.

---

## Agent Instructions

You are Opus, the orchestrator. You run via `claude -p --model opus` as a fresh session each hour via Windows Task Scheduler. CLAUDE.md loads automatically and has full project context. The spec is in `dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md`.

You wake up every hour and complete ONE task from the list below by spawning a Sonnet subagent.

### Process (every wake)

1. `git pull` to get latest state
2. Read this file (`dev-mode/openclaw-whatsapp-claw/v2-todo.md`)
3. Find the first unchecked `- [ ]` task
4. Read the referenced spec section in `dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md`
5. Spawn ONE Sonnet subagent (Agent tool, model: sonnet) with a precise brief:
   - Include the exact file paths to edit/create
   - Paste relevant spec content (don't just say "read §X")
   - Include test commands if applicable
   - Tell the subagent NOT to commit — you handle git after reviewing
6. Review the subagent's work — verify it matches the spec
7. If issues: fix yourself or spawn another Sonnet agent
8. Mark the task `- [x]` in this file
9. `git add` changed files + `git commit` + `git push` (use `-u origin v2-impl` on first push)
10. STOP. Do NOT continue to the next task. One task per wake.

### Rules

- **Branch:** Work on branch `v2-impl`. Create it from `main` on first run if it doesn't exist.
- **One task per wake.** Even if you finish in 5 minutes, stop after committing.
- **Opus = planner/reviewer, Sonnet = doer.** Follow CLAUDE.md delegation rules. Opus reads spec, writes the brief, reviews output. Sonnet does file edits, runs commands, writes code.
- **If a task fails** (tests break, unclear spec, blocked): write a note under the task checkbox explaining the blocker, mark it `- [~]`, and move to the next task. Ariel will fix blockers when he's back.
- **If all tasks are done:** Write "ALL TASKS COMPLETE" at the bottom and stop.
- **VPS access:** SSH details are in CLAUDE.md. Use the SSH command documented there for deploy and verify steps.
- **Build:** Run `pnpm build && pnpm ui:build` from the repo root. Commit all `dist/` changes (dist is committed on this repo).
- **Test the panel app** with `node --test` (plain Node.js, no build needed for panel tests).
- **Commit messages:** `feat(wa-claw-v2): T<id> — <short description>`

### Key Paths

- Panel app source: `dev-mode/openclaw-whatsapp-claw/app/`
- Panel server: `app/src/server.mjs`
- Panel frontend: `app/public/app.js`, `app/public/style.css`, `app/public/index.html`
- DB helper: `app/src/wa-store.mjs`
- Config: `app/src/config.mjs`
- Tests: `app/test/*.test.mjs`
- Test helpers: `app/test-helpers/make-temp-db.mjs`
- WA extension history logger: `extensions/whatsapp/src/dev-mode/wa-history.ts`
- WA extension session: `extensions/whatsapp/src/session.ts`
- Full spec: `dev-mode/openclaw-whatsapp-claw/docs/plan-v2.md`
- SSH to VPS: see CLAUDE.md for SSH command, IP, port
- Build: `pnpm build && pnpm ui:build` from repo root

---

## Phase 0: Data model + infrastructure

- [x] **T01: Rename wa-history → openclaw-whatsapp-claw**
  - Rename `extensions/whatsapp/src/dev-mode/wa-history.ts` → `openclaw-whatsapp-claw.ts`
  - Update import in `extensions/whatsapp/src/session.ts` (the `import("./dev-mode/wa-history.js")` line)
  - Update DB filename in `app/src/config.mjs`: default path from `wa-history.db` → `openclaw-whatsapp-claw.db`
  - Update `app/src/wa-store.mjs` error message referencing old DB name
  - Update `app/test-helpers/make-temp-db.mjs` if it references the old name
  - Update `scripts/tsdown-build.mjs` ignore pattern (currently ignores `dev-mode/` unresolved imports — filename may be referenced)
  - Spec: §7.1 in plan-v2.md
  - Done when: all references to `wa-history` (except docs/git history) point to `openclaw-whatsapp-claw`

- [x] **T02: Create enums file**
  - Create `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.enums.ts`
  - 6 enums from spec §4.0: `CustomHandlerType`, `DefaultHandlerType`, `HandlerTaxonomyId`, `CronSubType`, `AuditOutcome`, `AuditHandlerSource`
  - These are TypeScript enums (or `as const` objects) — used by the TS code in the extension
  - Also create a JS-compatible version at `app/src/enums.mjs` for the panel app (plain objects with `Object.freeze`)
  - Done when: both files exist with all 6 enums matching spec §4.0

- [x] **T03: Add phone_e164 to existing tables + create new tables**
  - In `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts` (the renamed file):
    - `ALTER TABLE messages ADD COLUMN phone_e164 TEXT` (run on DB open, idempotent)
    - `ALTER TABLE chats ADD COLUMN phone_e164 TEXT` (same)
    - Populate `phone_e164` on every INSERT: strip `@s.whatsapp.net` suffix, prepend `+`. NULL for `@g.us` group JIDs. For `@lid` JIDs, extract from `remoteJidAlt` if available.
  - In `app/src/wa-store.mjs`:
    - Add `CREATE TABLE IF NOT EXISTS` for 4 new tables: `wa_claw_handlers`, `wa_claw_defaults`, `wa_claw_last_run`, `wa_claw_audit` (v2 schema)
    - DROP + recreate `wa_claw_audit` (current stub has wrong schema; table is always empty so safe to drop)
    - All table schemas: see spec §7.2 and §7.3
  - Update `app/test-helpers/make-temp-db.mjs` to create the new tables in test DBs
  - Spec: §7.2, §7.3 in plan-v2.md
  - Done when: `node --test` passes, new tables appear in DB init

- [x] **T04: Create wa-auto-prompt.md**
  - Create `dev-mode/openclaw-whatsapp-claw/wa-auto-prompt.md`
  - Full content from spec §6 — this is a comprehensive AI reference document including:
    - Response rules (prefix, NO_REPLY, escalation procedure)
    - Full DB schema (all 6 tables with CREATE TABLE SQL)
    - DB path (`~/.openclaw/dev-mode/openclaw-whatsapp-claw.db`)
    - Audit logging SQL examples
    - Last-run tracking SQL examples
    - Available tools list
    - Handler paths reference table
  - This file must match the template in §6 EXACTLY (it's the AI's instruction manual)
  - Done when: file exists with all 6 sections from §6

- [x] **T05: Add editMode state + wa-store query helpers**
  - In `app/public/app.js`: add `editMode: false` to the global `state` object
  - In `app/src/wa-store.mjs`: add query functions for new tables:
    - `getHandler(jid)` → row from `wa_claw_handlers` or null
    - `upsertHandler(jid, handler_type, config_json, phone_e164)` → INSERT OR REPLACE
    - `deleteHandler(jid)` → DELETE
    - `getDefaults()` → single row from `wa_claw_defaults` or null
    - `upsertDefaults(handler_type, config_json)` → INSERT OR REPLACE
    - `getLastRun(session_key)` → row from `wa_claw_last_run` or null
    - `logAudit(jid, message_id, handler, outcome, reason, detail, phone_e164)` → INSERT
  - Update `app/test/wa-store.test.mjs` with tests for all new query functions
  - Spec: §7.3 schemas, §4.2 field definitions
  - Done when: `node --test app/test/wa-store.test.mjs` passes with new queries

---

## Phase 1: Custom instant handlers

- [x] **T06: I1 static reply handler**
  - In `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts`:
    - After logging a message, query `wa_claw_handlers` for the sender JID
    - If `handler_type = 'static'`: send `config_json.text` via Baileys socket `sendMessage()`
    - Prepend `[OpenClaw Auto AI Generated Response:]` prefix to the reply
    - Log to `wa_claw_audit` with outcome `replied`
    - If no handler found: check `wa_claw_defaults` for fallback behavior
  - Spec: §3.2 I1 section, §6 response rules
  - Done when: I1 handler logic exists, reads config from DB, sends reply, logs audit

- [x] **T07: I2 agent turn — tool definitions + tool-call loop**
  - In `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts`:
    - `getI2ToolDefinitions()` → returns Ollama tool schema array for: `message_send`, `db_audit_log`, `db_last_run_update`, `db_query`
    - `executeI2Tool(call)` → dispatches tool calls to actual implementations (WA send, SQLite writes, DB reads)
    - `handleI2Turn(handler, inboundMessage, waAutoPrompt)` → the agent turn loop:
      1. Build messages array: system prompt (wa-auto-prompt + user prompt), user message
      2. POST to Ollama `/api/chat` with model, messages, tools, stream:false
      3. If response has `tool_calls`: execute each, append results, loop
      4. If no `tool_calls`: return final text (or NO_REPLY)
    - Wire into the message handler: if `handler_type = 'stateless'`, call `handleI2Turn()`
    - Prepend `[OpenClaw Auto AI Generated Response:]` prefix
    - Log audit with outcome
  - Spec: §3.2 I2 section, §4.3 implementation code
  - Done when: full I2 agent turn loop exists with 4 tools

- [x] **T08: Tests for I1 and I2 handlers**
  - In `app/test/` or a new test file: unit tests for:
    - I1: mock DB with static handler → verify reply text + prefix
    - I2: mock Ollama responses (with and without tool_calls) → verify loop + final reply
    - I2 tools: verify each tool implementation
    - No handler: verify fallback to defaults
    - NO_REPLY: verify message is NOT sent
  - Done when: tests exist and pass
  - **DONE:** `app/test/openclaw-whatsapp-claw.test.mjs` — 11 tests, all pass.
    The handler logic lives in TypeScript (`extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts`)
    with `enum`s + `.js`-style imports, which plain `node --test` cannot load. This test
    therefore imports the real impl via the **tsx loader** and MUST be run with it:
    `node --import tsx --test dev-mode/openclaw-whatsapp-claw/app/test/...`. The app
    `package.json` `test` script was updated to `node --import tsx --test` (tsx is a superset;
    the existing 5 `.mjs` tests still pass under it — full suite 50 pass / 0 fail).

---

## Phase 2: OC config reader (server-side)

- [x] **T09: OC config wrappers + JID normalization**
  - Create `app/src/oc-config.mjs`:
    - `ocConfigGet(path)` — shells out to `openclaw config get <path> --json`, parses result, caches for 30 seconds
    - `ocCronList()` — shells out to `openclaw cron list --json`, parses, caches 30s
    - `normalizeJid(input)` — E.164 `+972...` → `972...@s.whatsapp.net`; also handles bare JIDs
    - `jidToPhone(jid)` — `972...@s.whatsapp.net` → `+972...` (inverse)
    - Export a `clearCache()` for tests
  - Spec: §8.1 reverse-mapping, §4.2 JID format
  - Done when: module exports all functions, handles errors gracefully (command not found = empty result)

- [x] **T10: Reverse-mapping algorithm + defaults**
  - In `app/src/oc-config.mjs`:
    - `getHandlerForJid(jid)` — 6-step reverse-mapping (spec §8.1):
      1. Check `wa_claw_handlers` (custom I1/I2)
      2. Check OC `bindings` for matching WhatsApp peer binding (I3/I4)
      3. Check OC `cron list` for jobs targeting this JID (S1a/S1b/S1c)
      4. Check OC agent heartbeats with WhatsApp delivery (S2)
      5. Fall back to `wa_claw_defaults`
      6. Return `{ handlers: [...], taxonomy: [...] }` — a chat can have MULTIPLE handlers
    - `getDefaults()` — merges OC `agents.defaults` with `wa_claw_defaults` row
    - `classifyCron(cronJob)` — determines S1a vs S1b vs S1c based on `lightContext` + payload type (spec §3.1)
  - Spec: §8.1, §8.2, §3.1 cron classification
  - Done when: reverse-mapping returns correct handler taxonomy for all 8 types

- [x] **T11: OC config tests**
  - In `app/test/oc-config.test.mjs`:
    - Mock `child_process.execSync` to return fake OC config/cron data
    - Test reverse-mapping with: custom handler, OC binding, cron (all 3 subtypes), heartbeat, defaults-only, no-handler
    - Test JID normalization edge cases
    - Test cache behavior (same call within 30s returns cached)
    - Test cron classification (lightContext true/false, systemEvent)
  - Done when: `node --test app/test/oc-config.test.mjs` passes

---

## Phase 3: API routes

- [x] **T12: Read-only API routes (OC config)**
  - In `app/src/server.mjs`, add routes:
    - `GET /api/oc/defaults` → calls `getDefaults()`, returns JSON
    - `GET /api/oc/handler?jid=<jid>` → calls `getHandlerForJid()`, returns JSON (use query param, not path param — consistent with existing `/api/messages?jid=` pattern)
    - `GET /api/oc/agents` → calls `ocConfigGet("agents.list")`, returns JSON
    - `GET /api/oc/crons` → calls `ocCronList()`, returns JSON
    - `GET /api/tutorial/prompt` → reads `wa-auto-prompt.md` from disk, returns raw text
  - All routes require auth (same Bearer/cookie check as existing routes)
  - Spec: §10 API endpoints
  - Done when: routes exist, return correct JSON, require auth

- [x] **T13: Write API routes (WA Claw custom handlers)**
  - In `app/src/server.mjs`, add routes:
    - `GET /api/claw/handler?jid=<jid>` → calls `wa-store.getHandler(jid)`, returns JSON
    - `POST /api/claw/handler?jid=<jid>` → parses JSON body, calls `upsertHandler()`, returns 200
    - `DELETE /api/claw/handler?jid=<jid>` → calls `deleteHandler()`, returns 200
    - `GET /api/claw/defaults` → calls `wa-store.getDefaults()`, returns JSON
    - `POST /api/claw/defaults` → parses JSON body, calls `upsertDefaults()`, returns 200
    - `GET /api/claw/last-run?key=<key>` → calls `wa-store.getLastRun()`, returns JSON
  - JSON body parsing: collect chunks from `req.on('data')`, parse with `JSON.parse()`
  - All routes require auth
  - Spec: §10 API endpoints
  - Done when: routes exist, read/write DB correctly, require auth

- [x] **T14: API route tests**
  - In `app/test/server.test.mjs`:
    - Add tests for ALL new routes (both OC read + Claw write)
    - Test auth enforcement (401 without token)
    - Test POST/DELETE with valid and invalid payloads
    - Test GET returns correct data after POST
  - Done when: `node --test app/test/server.test.mjs` passes
  - **DONE:** 27 new tests added (file now 40 total, all pass). Covers OC read routes
    (`/api/oc/agents|crons|defaults|handler`) with a mocked `openclaw` CLI runner via
    `setExecRunner`/`clearCache` (ES-module singleton shared with the server), the
    `/api/tutorial/prompt` route (200 + 500), full Claw handler CRUD (GET null/POST/DELETE,
    invalid-JSON 400, missing-handler_type 400, missing-jid 400, PUT 405), Claw defaults
    CRUD (+405), last-run (missing-key 400, absent-key null), and 401 auth enforcement on
    representative new routes. Run: `node --import tsx --test test/server.test.mjs`
    (tsx loader; node:sqlite). Full suite: 151 pass / 0 fail.

---

## Phase 4: Frontend — Column 3

- [x] **T15: Column 3 data fetching + handler rendering**
  - In `app/public/app.js`:
    - `fetchOcSettings(jid)` → calls `GET /api/oc/handler?jid=` + `GET /api/claw/handler?jid=`
    - `renderOcSettings(data)` → replaces the current Column 3 placeholder with sectioned cards:
      - "Instant Handler" card (type badge, model, text/prompt, source)
      - "OC Binding" card (agent name, model, system prompt excerpt, session type, source: read-only badge)
      - "Scheduled" card (cron name, agent, session type, last-run status, source: read-only badge)
    - Wire into chat selection: when a chat is clicked, call `fetchOcSettings(jid)`
  - Spec: §9.2 layout wireframe
  - Done when: clicking a chat shows real handler info in Column 3 (or placeholder if no handler)

- [x] **T16: Column 3 states + edit mode + refresh**
  - In `app/public/app.js`:
    - Loading state: show spinner in Column 3 while fetching
    - Error state: show error banner, don't break Columns 1-2
    - No-handler state: "No specific handler. Uses defaults." with link to Defaults
    - Edit mode toggle: [Edit] button sets `state.editMode = true`, shows inline editor for I1/I2
    - I1 editor: text input for static reply text
    - I2 editor: model selector, prompt textarea
    - Save button: POST to `/api/claw/handler?jid=`
    - [Refresh] button: re-fetches current chat's settings
  - Spec: §9.1, §9.3
  - Done when: all 4 states render correctly, edit mode creates/updates handlers via API

- [x] **T17: Column 3 CSS + audit display**
  - In `app/public/style.css`:
    - Handler card styling (border, padding, source badges)
    - Type badges (static=blue, stateless=purple, binding=green, cron=orange)
    - Edit mode form styling
    - Read-only badge styling
    - Loading spinner
    - Audit entry list at bottom of Column 3
  - In `app/public/app.js`:
    - `fetchAudit(jid)` — already exists but render needs updating
    - Render audit entries with: timestamp, outcome badge (replied/silent/escalated/error), handler name, detail excerpt
  - Spec: §9.2 layout, audit card wireframe
  - Done when: Column 3 looks clean with proper cards, badges, audit entries

---

## Phase 5: Defaults entry + Tutorial page

- [x] **T18: Defaults panel (functional)**
  - In `app/public/app.js`:
    - When "Defaults" pinned entry is clicked, fetch `GET /api/claw/defaults` + `GET /api/oc/defaults`
    - Render in Column 3: default handler type, model, config
    - Edit mode: handler type dropdown (none/static/stateless), model input, prompt textarea, owner_phone input
    - Save: POST to `/api/claw/defaults`
  - Replace current placeholder text ("Default configuration arrives in v2")
  - Spec: §5 defaults, §9.2
  - Done when: Defaults entry shows real config, edit mode can change default behavior

- [x] **T19: Tutorial page**
  - In `app/public/app.js`:
    - Add "Tutorial" button to the nav/header area
    - When clicked: hide the 3-column layout, show full-page tutorial view
    - Top section: 8 handler path flow charts as HTML (I1, I2, I3, I4, S1a, S1b, S1c, S2) — simple box-and-arrow rendering, can be styled divs or preformatted text
    - Bottom section: fetch `GET /api/tutorial/prompt`, render wa-auto-prompt.md content as read-only preformatted text
    - "Back" button to return to main view
  - In `app/public/style.css`: tutorial page styling
  - Spec: §9.4
  - Done when: Tutorial button exists, page shows flow charts + prompt content
  - **DONE:** Flow-chart data added as exported `HANDLER_FLOW_CHARTS` in `app/public/lib.js`
    (2 groups, 8 handlers, verbatim spec §9.4 text) with 5 new tests in `app/test/lib.test.mjs`.
    Tutorial pinned item (📖) added to `index.html` left column; `app/public/app.js` gains
    `showTutorial`/`hideTutorial`/`renderTutorial` (async — renders box-and-arrow flow cards
    synchronously, then fetches `/api/tutorial/prompt` via `res.text()` into a read-only `<pre>`,
    with a scoped error line on failure). `style.css` adds tutorial-view + flow-card/flow-box/
    flow-arrow + prompt styling. Full panel suite: 207 pass / 0 fail
    (`node --import tsx --test test/*.test.mjs`).

---

## Phase 6: QA + Build verification

- [x] **T20: Full test pass + code review**
  - Run ALL tests: `node --test dev-mode/openclaw-whatsapp-claw/app/test/*.test.mjs`
  - Fix any failures
  - Review all new/changed files for:
    - SQL injection (use parameterized queries everywhere)
    - Missing auth on new routes
    - Consistent error handling
    - Enum usage matches spec
    - phone_e164 populated on all INSERT paths
  - Done when: all tests pass, no security issues found
  - **DONE:** Full suite green at **207 pass / 0 fail** with no test fixes needed
    (`node --import tsx --test test/*.test.mjs` from the app dir; tsx loader required for
    the TS-importing `openclaw-whatsapp-claw.test.mjs`, node:sqlite for the rest).
    Audit results: **SQL injection** CLEAN (all queries use bound `?` params via
    `db.prepare(staticSQL)`; the `db_query` I2 tool runs model SQL by design with SELECT-only
    enforcement). **Auth** CLEAN (single Bearer/cookie gate in `server.mjs` runs before every
    `/api/oc/*`, `/api/tutorial/prompt`, `/api/claw/*` route; 401 coverage in tests).
    **Error handling** CLEAN (400 on missing params/bad JSON, `oc-config` CLI shell-outs
    return null/[] on ENOENT, all `catch` use `err instanceof Error ? err.message : String(err)`).
    **phone_e164** CLEAN (populated on every INSERT into messages/chats/audit/last_run/handlers
    via `jidToPhoneE164`/`jidToPhone`; `wa_claw_defaults` is a JID-less singleton — no column).
    **Enum usage** — fixed 4 bare string literals → enum members (behaviorally identical,
    same string values, DB-compatible): `oc-config.mjs` Step 1 (`CustomHandlerType.Static/Stateless`)
    - Step 5 defaults fallback (`DefaultHandlerType.None/Static/Stateless/Cron/Heartbeat`, added the
      two imports), and `openclaw-whatsapp-claw.ts:421` `db_audit_log` handler fallback
      (`AuditHandlerSource.Stateless`). Re-ran after fixes: still 207/0.
      **Open item (low, deferred):** `openclaw-whatsapp-claw.ts:195` — the `db_audit_log` Ollama
      tool schema hardcodes `enum: ["replied","silent","escalated","error"]` instead of deriving
      from `AuditOutcome`. Values are correct; converting a static literal schema to a computed
      array is a judgment call, left for a later pass.

- [x] **T21: Integration sanity check**
  - Create a test script at `app/scripts/integration-check.mjs` that:
    1. Creates a temp DB (using make-temp-db helper)
    2. Inserts a sample handler via wa-store
    3. Starts the server on a random port
    4. Hits all new API endpoints with `fetch()`
    5. Verifies responses
    6. Cleans up
  - Run it and fix any issues
  - Done when: integration script passes end-to-end
  - **DONE:** `app/scripts/integration-check.mjs` — hermetic end-to-end sanity script
    (NOT a `node --test` file). Creates a temp DB via `makeTempDb`, pre-inserts a static
    handler through `openStore().upsertHandler` (closed before the server opens its handle —
    avoids Windows file locks), mocks the `openclaw` CLI via `setExecRunner`/`clearCache`
    (openclaw isn't installed locally), starts `createPanelServer` on port 0, then fetches
    all 15 v2 endpoints (`/api/chats|messages|audit`, `/api/claw/handler` GET/POST/DELETE,
    `/api/claw/defaults` GET/POST, `/api/claw/last-run`, `/api/oc/agents|crons|defaults|handler`,
    `/api/tutorial/prompt`) with 41 `check()` assertions. Guarded `finally` resets the runner,
    closes the server, deletes the temp dir; prints `N passed, M failed` and exits 0/1.
    Added `"integration-check": "node scripts/integration-check.mjs"` to `app/package.json`.
    Run: `node scripts/integration-check.mjs` from the app dir → **41 passed, 0 failed** (exit 0).
    Full test suite unaffected: **207 pass / 0 fail**.

---

## Phase 7: Build + deploy + verify

- [x] **T22: Build**
  - From repo root: `pnpm install && pnpm build && pnpm ui:build`
  - Fix any build errors
  - Commit all `dist/` changes (dist is committed on this repo)
  - Done when: build succeeds, dist committed
  - **DONE:** Full build clean on first try — `CI=true pnpm install` (no-op, deps current),
    `pnpm build` (tsdown + postbuild), `pnpm ui:build` (Vite, 862 modules) all exited 0.
    No source edits needed. The T01 rename is reflected in `dist/`: old `wa-history-*.js`
    chunk deleted, new `dist/openclaw-whatsapp-claw-BchS3zaq.js` chunk present, and
    `attachWaHistoryLogger` + the dev-mode WA code bundle into both that chunk and
    `dist/session-D2bB1Njv.js`. Committed all `dist/` changes (regenerated WhatsApp/discord/
    matrix chunks + `.d.ts` + build stamps). **Excluded** 6 spurious
    `dist-runtime/extensions/tlon/bundled-skills/` type-changes (Windows symlink→copy build
    artifact from the tlon/Urbit extension, unrelated to our work) — restored via
    `git checkout` so they don't break the symlinks on the Linux VPS.

- [~] **T23: Deploy to VPS**
  - **BLOCKED (2026-05-23, autonomous wake) — the v2 work is not reachable by the VPS:**
    - `v2-impl` is **23 commits ahead of `main`** (T01–T22) but has **never been pushed**. There is no `origin/v2-impl`, and `origin/main` HEAD is `5475e57965 md link`, which contains **none** of the v2 commits. The deploy recipe does `git pull` on the VPS (which tracks `main`), so it would fetch stale `main`, **not** the v2 code.
    - This wake's orchestrator brief is **commit-only** (no `git push` step), so the agent is not authorized to push the branch or merge to `main` on its own.
    - The recipe also **restarts the live WhatsApp gateway** (CLAUDE.md documents that gateway restarts can corrupt the WA Signal session). Running that unattended for what would be a no-op pull is not safe.
    - **Unblock path (needs Ariel):** either (a) push `v2-impl` to origin and point the VPS at it (`git fetch && git checkout v2-impl`) for pre-merge testing, or (b) run T25 first (merge `v2-impl` → `main`, push) and let the VPS pull `main`. Then T23/T24 can proceed — recommend confirming before the gateway restart.
  - SSH to VPS (see CLAUDE.md for SSH command)
  - Run the update recipe from CLAUDE.md:
    ```
    cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks && npm install --ignore-scripts && openclaw gateway restart
    ```
  - If the DB file is still named `wa-history.db`, rename it:
    ```
    cp ~/.openclaw/dev-mode/wa-history.db ~/.openclaw/dev-mode/openclaw-whatsapp-claw.db
    ```
  - Wait ~2 minutes for WA warmup, then verify:
    ```
    openclaw gateway status
    ```
  - Done when: gateway is running, WA listener active

- [~] **T24: Verify deployment**
  - **BLOCKED (2026-05-23, later autonomous wake) — cascades from T23. Cannot start: there is nothing v2 to verify on the VPS.**
    - Re-checked git state: `origin/main` is still `5475e57965` (no v2 commits), there is still **no `origin/v2-impl`**, and local `v2-impl` is now **24 commits ahead** of `main` (T01–T22 + the T23 block note). The VPS pulls `main`, so the new `/api/claw/*` and `/api/oc/*` routes this task curls for **do not exist** on the deployed build.
    - This wake attempted to surface the unblock decision to Ariel (push v2-impl / push+deploy / merge+deploy / stay blocked) via an interactive prompt, but the run is unattended — no answer. Per the standing "always ask before pushing" rule, the orchestrator did **not** push, merge, or restart the live WA gateway on its own.
    - **Unblock path (needs Ariel):** same as T23 — push `v2-impl` to origin (then point the VPS at it), or merge `v2-impl` → `main` first (T25). Once v2 is actually on the VPS and the gateway restarted, T24's curl checks can run.
  - SSH to VPS and test:
    - Panel accessible: `curl -s http://localhost:17890/api/chats -H "Authorization: Bearer <token>"` returns chat list
    - New API routes work: `curl -s http://localhost:17890/api/claw/defaults -H "Authorization: Bearer <token>"`
    - Insert a test I1 handler via API and verify it appears
  - Check gateway logs for errors: `tail -50 /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log`
  - Done when: panel serves v2 routes, no gateway errors

- [~] **T25: Merge and final push**
  - **PARTIAL (2026-05-23, autonomous wake) — step 1 DONE, steps 2–3 BLOCKED on Ariel:**
    - **Step 1 (final test pass): ✅ DONE.** Running the spec command on a clean tree first FAILED — 11/207 tests in `openclaw-whatsapp-claw.test.mjs` errored with `ERR_MODULE_NOT_FOUND` for `openclaw-whatsapp-claw.enums.js`. Root cause: the T20 "full test pass" had been run under the **`tsx`** loader (`node --import tsx --test`), which remaps `.js`→`.ts` and supports `enum` syntax; the T25 spec command is **plain** `node --test`, whose strip-only type-stripping does NOT remap `.js`→`.ts`. So the spec command had never actually passed. Fixed by adding a plain-JS `Object.freeze` mirror at `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.enums.js` (sibling of the `.ts`; tsdown/esbuild still bundle from the `.ts` at build time, `pnpm build` verified clean). Suite is now **207/207, 0 fail** under the exact spec command. (Committed this wake.)
    - **Steps 2–3 (merge → push → VPS deploy): BLOCKED on Ariel** — same root block as T23/T24. `v2-impl` was never pushed; `git checkout main && git merge v2-impl && git push` plus the VPS `git pull` + gateway restart are outward-facing actions the autonomous orchestrator is not authorized to perform (CLAUDE.md: always ask before pushing; gateway restart can disrupt the live WA Signal session).
    - **Unblock path (needs Ariel):** `git push -u origin v2-impl`, then either merge to `main` and push (`git checkout main && git merge v2-impl && git push`) so the VPS `git pull` of `main` gets the v2 code, OR point the VPS at `v2-impl` for pre-merge testing. Then T23/T24 (deploy + verify) can run, then finish T25.
  - Verify all tests pass one final time: `node --test dev-mode/openclaw-whatsapp-claw/app/test/*.test.mjs`
  - Merge branch: `git checkout main && git merge v2-impl && git push`
  - SSH to VPS: `cd /opt/openclaw-dev-mode && git pull`
  - Done when: main branch has all v2 code, VPS running latest

---

## Notes

_Remote agent writes blockers/notes here:_

- **2026-05-23 (autonomous wake):** T23 (Deploy to VPS) marked `- [~]` blocked. `v2-impl` is 23 commits ahead of `main` (T01–T22) and was never pushed to origin — there is no `origin/v2-impl`, and `origin/main` is at `5475e57965` (no v2 commits). The VPS deploy recipe relies on `git pull`, so there is nothing remote for it to fetch; it would deploy stale `main` and needlessly restart the live WA gateway. The orchestrator is commit-only and isn't authorized to push/merge. **Needs Ariel:** push `v2-impl` (then point the VPS at it) or merge to `main` first (T25), then deploy with confirmation. T24/T25 are downstream of a working deploy, so no further tasks were attempted this wake.

- **2026-05-23 (later autonomous wake):** T24 (Verify deployment) marked `- [~]` blocked — same root cause as T23. Re-verified git state is unchanged: still no `origin/v2-impl`, `origin/main` still `5475e57965`, local `v2-impl` now **24 commits** ahead of `main`. T24 verifies v2 API routes on the VPS, but no v2 build was ever deployed there, so there is nothing to verify. This wake tried to ask Ariel for the unblock decision interactively but the run is unattended (no answer); per "always ask before pushing", no push/merge/gateway-restart was performed. **The entire remaining deploy phase (T23 → T24 → T25) is blocked on one human action: get `v2-impl` onto a ref the VPS can pull.** Recommended order: `git push -u origin v2-impl` → on VPS `git fetch && git checkout v2-impl && npm install --ignore-scripts && openclaw gateway restart` (T23) → curl the new routes (T24) → `git checkout main && git merge v2-impl && git push` (T25). No further tasks attempted this wake.

- **2026-05-23 (autonomous wake):** Completed T25 **step 1** (final test pass); steps 2–3 left blocked on Ariel. The spec command `node --test dev-mode/openclaw-whatsapp-claw/app/test/*.test.mjs` was failing **11/207** (all in `openclaw-whatsapp-claw.test.mjs`) with `ERR_MODULE_NOT_FOUND` for `openclaw-whatsapp-claw.enums.js`. The earlier T20 green result had been produced under the **`tsx`** loader, which masked it (tsx remaps `.js`→`.ts` and supports `enum`; plain `node --test` strip-only mode does neither). Fix: added a plain-JS frozen mirror `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.enums.js` — suite now **207/0**, `pnpm build` still clean. **Did NOT commit any `dist/` this wake:** the worker's `pnpm build` was partial (no `pnpm ui:build`, so all `dist/control-ui/**` assets were dropped) and re-touched the Windows tlon symlinks; restored `dist/`+`dist-runtime/` to HEAD. The T22 full-build `dist/` remains the deployable artifact and already inlines the enum values, so this source-only test mirror needs no `dist` change. The remaining merge/push/VPS-deploy steps still require Ariel (branch never pushed; gateway restart touches the live WA session).
