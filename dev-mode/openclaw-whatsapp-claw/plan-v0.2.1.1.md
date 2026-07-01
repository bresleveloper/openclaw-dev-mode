# Plan v0.2.1.1 — Bugfixes + Model Dropdown + Error Log

**Branch:** `v2-impl`  
**Status:** Draft — pending Ariel's review

---

## Bug 1: "Invalid time value" crash (portal unusable for contacts with audit entries)

**Root cause:** `formatTimestamp()` in `lib.js` expects numeric unix-seconds, but `wa_claw_audit.ts` column is `TEXT DEFAULT (datetime('now'))` — stores `"2026-05-25 07:43:15"` strings. `new Date("2026-05-25 07:43:15" * 1000)` → `NaN` → crash.

**Fix:** Make `formatTimestamp` handle both formats (numeric seconds AND ISO/datetime strings).

**Files:** `app/public/lib.js` — `formatTimestamp()`

---

## Bug 2: `DROP TABLE IF EXISTS wa_claw_audit` in panel's `wa-store.mjs`

**Root cause:** `AUDIT_DDL` in `wa-store.mjs` starts with `DROP TABLE IF EXISTS wa_claw_audit`. Every time the panel restarts (or `openStore()` is called), all audit data is wiped. The extension file (`openclaw-whatsapp-claw.ts`) was already fixed last session, but the panel's own DDL still has it.

**Fix:** Remove the `DROP TABLE` line from `wa-store.mjs` AUDIT_DDL. Use `CREATE TABLE IF NOT EXISTS` only.

**Files:** `app/src/wa-store.mjs`

---

## Bug 3: "no model configured for stateless handler"

**Root cause:** `handleI2Turn` in `openclaw-whatsapp-claw.ts` checks `handler.config.model`, then `selectDefaults.get()?.config_json?.model`. If neither has a model, it throws. There's no fallback to the OC global default model (`agents.defaults.model.primary`).

**Fix:** Add a third fallback step — read the OC default model. Two options:

- **Option A (recommended):** Shell out to `openclaw config get agents.defaults.model.primary --json` at startup (cache it), use as final fallback.
- **Option B:** Read `~/.openclaw/openclaw.json` directly with `JSON.parse(fs.readFileSync(...))` and extract `agents.defaults.model.primary`.

Either way: if all three sources are empty, log a clear error to the new log file and skip (don't crash).

**Files:** `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts` — `handleI2Turn`

---

## Feature 1: Model `<select>` dropdown from OC config

**Current state:** Model field is a plain `<input type="text">` with placeholder "(inherits default model)".

**Goal:** Replace with a `<select>` populated from OC's configured models, PLUS keep the text input as "override" for user-supplied model strings.

**Implementation:**

1. **New API route** `/api/oc/models` in `server.mjs`:
   - Calls `ocConfigGet("agents.defaults.model")` → gets `{ primary, fallbacks, reasoning }`.
   - Calls `ocConfigGet("agents.list")` → extracts unique `model.primary` values from all agents.
   - Returns `{ default: "ollama/kimi-k2.6:cloud", available: ["ollama/kimi-k2.6:cloud", "ollama/gemma4:31b-cloud", ...] }`.

2. **UI changes** in `app.js` (both per-chat edit form and Defaults edit form):
   - Fetch models from `/api/oc/models` when entering edit mode.
   - Render a `<select>` with options from `available`, first option = `"(OC default: <name>)"`.
   - Below the select, keep the text input as "Model override:" — if non-empty, it takes precedence over the dropdown.
   - On save: send `model = override || selectedDropdown` (empty string = inherit default).

**Files:**

- `app/src/server.mjs` — new route
- `app/src/oc-config.mjs` — new `getAvailableModels()` function
- `app/public/app.js` — edit form builder (2 places: per-chat ~line 167, defaults ~line 513)

---

## Feature 2: Error log file + Log viewer page

**Goal:** Dedicated log file for WA Claw errors, viewable from the panel UI.

### 2a. Log file

- **Location:** `openclaw-whatsapp-claw.log` — sibling to `openclaw-whatsapp-claw.db` (i.e., `~/.openclaw/dev-mode/openclaw-whatsapp-claw.log`)
- **Format:** One JSON line per entry: `{"ts":"2026-05-25T12:34:56.789Z","level":"error","fn":"handleI2Turn","message":"...","stack":"..."}`
- **Writer:** New `logToFile(level, fn, message, extra?)` utility in `openclaw-whatsapp-claw.ts` (extension side). Appends to the log file. Uses `fs.appendFileSync` for simplicity.
- **Panel side:** Mirror utility in a new `app/src/log.mjs` for panel-specific errors.
- **Integration:** Wrap top-level exported functions (`attachWaHistoryLogger`, `handleInstantMessage`, `handleI2Turn`) in try-catch. On catch: call `logToFile(...)`, then **re-throw** (bubble the error — logging is additive, not suppressive).
- **Rotation:** Not needed for v0.2.1.1. File will be small. Can add rotation later.

### 2b. API route

- **`/api/claw/log`** in `server.mjs`:
  - Reads the log file (last 30 lines).
  - Parses each JSON line.
  - Returns `{ entries: [...] }`.
  - If file doesn't exist, returns `{ entries: [] }`.

### 2c. UI: Log viewer button + page

- **index.html:** Add a third pinned item between "Defaults" and "Tutorial":

  ```html
  <li id="log-item" class="chat-item chat-item-pinned">📋 Log</li>
  ```

- **app.js:** On click:
  - Hide layout, show a new `#log-view` section (same pattern as Tutorial).
  - Fetch `/api/claw/log`.
  - Render a simple HTML `<table>` with columns: Timestamp, Level, Function, Message.
  - Show last 30 entries, newest first.
  - "Back" button returns to layout.

**Files:**

- `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts` — `logToFile()` + try-catch wrappers
- `app/src/log.mjs` — new file, panel-side log utility
- `app/src/server.mjs` — `/api/claw/log` route
- `app/public/index.html` — log button + log-view section
- `app/public/app.js` — log viewer click handler + render
- `app/public/style.css` — log table styles (minimal)

---

## Task Order

| #   | Task                                                     | Type    | Files                               |
| --- | -------------------------------------------------------- | ------- | ----------------------------------- |
| 1   | Fix `formatTimestamp` to handle string dates             | bugfix  | `lib.js`                            |
| 2   | Remove `DROP TABLE` from `wa-store.mjs`                  | bugfix  | `wa-store.mjs`                      |
| 3   | Add OC default model fallback in I2 handler              | bugfix  | `openclaw-whatsapp-claw.ts`         |
| 4   | Add `/api/oc/models` route + `getAvailableModels()`      | feature | `server.mjs`, `oc-config.mjs`       |
| 5   | Replace model `<input>` with `<select>` + override input | feature | `app.js`                            |
| 6   | Add `logToFile()` + try-catch in extension top-level fns | feature | `openclaw-whatsapp-claw.ts`         |
| 7   | Add panel-side log utility                               | feature | `log.mjs` (new)                     |
| 8   | Add `/api/claw/log` route                                | feature | `server.mjs`                        |
| 9   | Add Log button + viewer page in UI                       | feature | `index.html`, `app.js`, `style.css` |
| 10  | Test all changes (207 existing tests + new)              | verify  | test files                          |

---

## Open Questions for Ariel

1. **Model dropdown source:** Should the dropdown show ONLY models from `agents.defaults.model` (primary + fallbacks), or also every unique model from `agents.list[].model`? The plan assumes both.

Ariel Answer: both AND there should be something like `openclaw models --json`, so read docs and implement correctly.

2. **Log file location:** Plan puts it at `~/.openclaw/dev-mode/openclaw-whatsapp-claw.log` (next to the DB). Good, or prefer somewhere else?

Ariel Answer: good

3. **Extension-side logging vs panel-side:** The extension runs inside the gateway process. Its log file writes will happen in the gateway's context. The panel reads the same file via the `/api/claw/log` route. Both sides append to the same file — acceptable?

Ariel Answer: NO. we do not touch nor change the upstream unless absolutly needed to

normal error is:
OC-code -> error -> OC log file

new path only for our nich code:
OC-code -> our new code inside try catch -> error -> catch logs to our independent log file, then throw the error -> normal OC error handling -> -> OC log file
