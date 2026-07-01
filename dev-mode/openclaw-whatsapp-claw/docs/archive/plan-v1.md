# WhatsApp Claw — Implementation Plan v1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, build-free web panel that shows every WhatsApp chat from the existing `wa-history.db` in a 3-column WhatsApp-Web-style layout (chats+search · messages · per-chat OC info/audit).

**Architecture:** A standalone Node app under `dev-mode/openclaw-whatsapp-claw/app/`. Backend = plain ESM (`.mjs`) on Node's built-in `http` + `node:sqlite`, zero npm dependencies, no build step. Frontend = static `index.html` + vanilla ESM JS, served by the backend. Tests = Node's built-in test runner (`node --test`).

**Tech Stack:** Node.js ≥ 22.5 (for `node:sqlite`); `node:http`, `node:sqlite`, `node:test`; vanilla browser ESM. No bundler, no TypeScript, no npm dependencies.

---

## Handoff notes — read before executing

This plan was produced by a brainstorm → design → plan flow. The conversation that produced it may be compacted away; this section + `design-concept.md` are the durable record.

- **Companion doc:** `design-concept.md` (same folder). **Read it first.** It holds the full feature vision, the §17 decisions log, and all OpenClaw-integration knowledge for v2/v3. This plan (v1) deliberately touches **no** OpenClaw code — it is a standalone app.
- **Execution model: subagent-driven** (chosen by Ariel). Use `superpowers:subagent-driven-development` — dispatch a fresh subagent per task with review between tasks. Execute Tasks 1→7 in order; each depends on the previous.
- **Per-task discipline:** follow the TDD steps literally — write the failing test, **run it and watch it fail**, then implement, then run and watch it pass. The "watch it fail" step is not optional; it proves the test is real.
- **Commits:** every task ends with a local commit. **Never `git push`** and never amend — pushing is Ariel's decision.
- **Scope fence:** stay strictly inside `dev-mode/openclaw-whatsapp-claw/`. Do not modify `dev-mode/wa-history.ts` or anything else in the repo.
- **Environment:** the dev machine is Windows with **no OpenClaw installed**; the VPS runs Node 24. All of v1 is verifiable on the dev machine using the seeded sample db (Task 7) — no VPS, no OpenClaw, no network needed.
- **Doc status:** `design-concept.md` and this `plan-v1.md` are currently **uncommitted**. Whether/when to commit them is Ariel's call — do not commit them as part of task execution.

---

## Scope of v1

v1 = **Phase 1** of `design-concept.md` (§16). It delivers the foundations and a **read-only panel**:

- Browse every WhatsApp chat (DM + group) with client-side search.
- View a selected chat's message history.
- A 3rd column showing the chat's OC info and its (initially empty) audit history.
- The `wa_claw_audit` table is created so later phases can use it.

**Out of scope for v1** (later plans): writing OC config, handler assignment, agents/crons/heartbeats, the `NO_REPLY` wiring. v1 writes **nothing** to OpenClaw config and **nothing** to the `messages` table — it only reads.

v1 is independently runnable and testable: every task is TDD where code has logic, and the final task is an end-to-end manual check against a seeded sample database.

## Context for the engineer (assume zero repo context)

- **`wa-history.db`** is an existing SQLite database at `~/.openclaw/dev-mode/wa-history.db`, written by `dev-mode/wa-history.ts` (a logger attached to the WhatsApp socket). **Do not modify `wa-history.ts` in v1.**
- Schema of the table you read — `messages`:
  | column | type | notes |
  |---|---|---|
  | `id` | TEXT PRIMARY KEY | message id |
  | `jid` | TEXT NOT NULL | chat id; ends with `@g.us` for groups, else a DM |
  | `sender` | TEXT | sender id |
  | `push_name` | TEXT | sender display name (may be empty) |
  | `timestamp` | INTEGER | unix **seconds** |
  | `body` | TEXT | message text (may be empty) |
  | `chat_type` | TEXT | `"group"` or `"dm"` |
  | `from_me` | INTEGER | `1` if sent by the account, else `0` |
  | `raw_json` | TEXT | full raw message (ignore in v1) |
  | `created_at` | TEXT | ignore in v1 |
- The **development machine has no OpenClaw installed** and no real `wa-history.db`. All automated tests build a temporary SQLite db. Task 7 adds a seed script so the panel can be run and eyeballed on the dev machine.
- **Node ≥ 22.5 is required** — `node:sqlite` does not exist before that. `node:sqlite` prints an `ExperimentalWarning` on use; that warning is **expected and harmless** — do not try to suppress or "fix" it. **Before Task 1, run `node --version` and confirm it is ≥ 22.5.**
- This app is **standalone**: it lives entirely under `dev-mode/openclaw-whatsapp-claw/app/`, is outside the main repo build (`tsdown` already ignores `dev-mode/`), and has **no build step**. Run it with `node`, test it with `node --test`.
- **Do not modify any file outside `dev-mode/openclaw-whatsapp-claw/`.**
- **Commits are local only.** Do not `git push`. Pushing is Ariel's decision (per repo `CLAUDE.md`).
- The repo root is `C:\Users\Ariel\source\openclaw chaos mode\openclaw-dev-mode` (path has spaces — quote it in shell commands). All paths below are relative to that repo root.
- **Working directories:** run every `node` command (test / run / seed) from `dev-mode/openclaw-whatsapp-claw/app/`; run every `git` command from the repo root. The `git add` paths in this plan are written repo-root-relative.
- **The audit table is created by the panel.** `wa-store` runs `CREATE TABLE IF NOT EXISTS wa_claw_audit`. This is an intentional v1 refinement of design-concept §11/§13 — v1 never modifies `wa-history.ts`, and idempotent creation from the panel side is safe; v3 can additionally ship the same `IF NOT EXISTS` DDL beside `wa-history.ts` with no conflict.

## File Structure

Every file v1 creates (all under `dev-mode/openclaw-whatsapp-claw/`):

```
app/
  package.json                  -- "type":"module", scripts; zero dependencies
  README.md                     -- how to run / test / seed
  .gitignore                    -- ignore *.db and node_modules/
  src/
    config.mjs                  -- resolve db path / port / publicDir from env + defaults
    wa-store.mjs                -- open wa-history.db; read chats/messages; ensure+read audit table
    server.mjs                  -- node:http server: JSON API + static file serving
    main.mjs                    -- entry point: resolveConfig() + startPanelServer()
  public/
    index.html                  -- 3-column layout markup
    style.css                   -- 3-column layout styling
    lib.js                      -- pure browser-safe helpers (no DOM) — unit tested
    app.js                      -- frontend DOM wiring (imports lib.js)
  scripts/
    seed-sample-db.mjs           -- write a sample wa-history.db for local manual runs
  test-helpers/
    make-temp-db.mjs             -- build a throwaway wa-history.db with sample rows
  test/
    config.test.mjs
    wa-store.test.mjs
    server.test.mjs
    lib.test.mjs
```

**Responsibilities (one job per file):**

- `config.mjs` — pure: env → `{ dbPath, port, publicDir }`. No I/O.
- `wa-store.mjs` — the only file that touches SQLite. Opens the db, ensures the audit table, exposes read methods.
- `server.mjs` — HTTP only: routing, JSON responses, static files. Delegates all data to `wa-store`.
- `main.mjs` — wiring only: config → server. The only file with import-time side effects.
- `public/lib.js` — pure functions used by `app.js` and unit-tested in Node.
- `public/app.js` — browser DOM only.

---

## Task 1: Scaffold the app + `config.mjs`

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/package.json`
- Create: `dev-mode/openclaw-whatsapp-claw/app/.gitignore`
- Create: `dev-mode/openclaw-whatsapp-claw/app/README.md`
- Create: `dev-mode/openclaw-whatsapp-claw/app/src/config.mjs`
- Test: `dev-mode/openclaw-whatsapp-claw/app/test/config.test.mjs`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "openclaw-whatsapp-claw",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Standalone WhatsApp Claw panel for OpenClaw (dev-mode).",
  "scripts": {
    "start": "node src/main.mjs",
    "test": "node --test",
    "seed": "node scripts/seed-sample-db.mjs"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
*.db
*.db-wal
*.db-shm
```

- [ ] **Step 3: Create `README.md`**

```markdown
# WhatsApp Claw — panel app

Standalone read-only panel (v1) over OpenClaw's `wa-history.db`.

## Requirements

Node.js >= 22.5 (for `node:sqlite`). No npm install needed — zero dependencies.

## Run

    node src/main.mjs

Then open the printed `http://127.0.0.1:<port>` URL.

Environment variables:

- `WA_CLAW_DB` — path to wa-history.db (default: `~/.openclaw/dev-mode/wa-history.db`)
- `WA_CLAW_PORT` — panel port (default: `18790`)

## Test

    node --test

## Seed a sample database (for local demo without OpenClaw)

    node scripts/seed-sample-db.mjs ./sample.db
    WA_CLAW_DB=./sample.db node src/main.mjs
```

- [ ] **Step 4: Write the failing test — `test/config.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { resolveConfig } from "../src/config.mjs";

test("resolveConfig builds the default db path under the home dir", () => {
  const home = join("/tmp", "home");
  const cfg = resolveConfig({ HOME: home });
  assert.equal(cfg.dbPath, join(home, ".openclaw", "dev-mode", "wa-history.db"));
  assert.equal(cfg.port, 18790);
  assert.ok(cfg.publicDir.endsWith("public"));
});

test("resolveConfig honors env overrides", () => {
  const cfg = resolveConfig({ WA_CLAW_DB: "/x/y.db", WA_CLAW_PORT: "9999" });
  assert.equal(cfg.dbPath, "/x/y.db");
  assert.equal(cfg.port, 9999);
});
```

- [ ] **Step 5: Run the test, verify it fails**

Run (from `dev-mode/openclaw-whatsapp-claw/app/`): `node --test test/config.test.mjs`
Expected: FAIL — `Cannot find module '../src/config.mjs'`.

- [ ] **Step 6: Implement `src/config.mjs`**

```js
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve runtime configuration from environment variables.
 * Pure — no filesystem access.
 * @param {Record<string, string|undefined>} env
 * @returns {{ dbPath: string, port: number, publicDir: string }}
 */
export function resolveConfig(env = process.env) {
  const home = env.HOME || env.USERPROFILE || homedir();
  const dbPath = env.WA_CLAW_DB || join(home, ".openclaw", "dev-mode", "wa-history.db");
  const port = Number(env.WA_CLAW_PORT) || 18790;
  const publicDir = resolve(HERE, "..", "public");
  return { dbPath, port, publicDir };
}
```

- [ ] **Step 7: Run the test, verify it passes**

Run: `node --test test/config.test.mjs`
Expected: PASS — 2 tests passing. (An `ExperimentalWarning` for `node:sqlite` will NOT appear here — `config.mjs` does not import it.)

- [ ] **Step 8: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/package.json" "dev-mode/openclaw-whatsapp-claw/app/.gitignore" "dev-mode/openclaw-whatsapp-claw/app/README.md" "dev-mode/openclaw-whatsapp-claw/app/src/config.mjs" "dev-mode/openclaw-whatsapp-claw/app/test/config.test.mjs"
git commit -m "feat(wa-claw): scaffold panel app + config resolver"
```

---

## Task 2: Test helper — `make-temp-db.mjs`

This task creates the shared test fixture used by Tasks 3 and 4. It has no logic of its own, so it is not TDD'd; it is verified by being used in the next task's tests.

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/test-helpers/make-temp-db.mjs`

- [ ] **Step 1: Create `test-helpers/make-temp-db.mjs`**

```js
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Sample message rows. Two DMs from "Mom" + one group message.
 * Shape matches the `messages` table written by dev-mode/wa-history.ts.
 */
export const SAMPLE_ROWS = [
  {
    id: "m1",
    jid: "111@s.whatsapp.net",
    sender: "111@s.whatsapp.net",
    pushName: "Mom",
    timestamp: 1000,
    body: "hi",
    chatType: "dm",
    fromMe: 0,
  },
  {
    id: "m2",
    jid: "111@s.whatsapp.net",
    sender: "me",
    pushName: "",
    timestamp: 1001,
    body: "hello mom",
    chatType: "dm",
    fromMe: 1,
  },
  {
    id: "m3",
    jid: "999@g.us",
    sender: "222@s.whatsapp.net",
    pushName: "Bob",
    timestamp: 1002,
    body: "group msg",
    chatType: "group",
    fromMe: 0,
  },
];

/**
 * Create a throwaway wa-history.db populated with the given rows.
 * @param {Array<object>} [rows]
 * @returns {{ dbPath: string, cleanup: () => void }}
 */
export function makeTempDb(rows = SAMPLE_ROWS) {
  const dir = mkdtempSync(join(tmpdir(), "wa-claw-test-"));
  const dbPath = join(dir, "wa-history.db");
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE messages (
      id TEXT PRIMARY KEY,
      jid TEXT NOT NULL,
      sender TEXT,
      push_name TEXT,
      timestamp INTEGER,
      body TEXT,
      chat_type TEXT,
      from_me INTEGER DEFAULT 0,
      raw_json TEXT,
      created_at TEXT
    );
  `);
  const insert = db.prepare(
    `INSERT INTO messages (id, jid, sender, push_name, timestamp, body, chat_type, from_me)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const r of rows) {
    insert.run(r.id, r.jid, r.sender, r.pushName, r.timestamp, r.body, r.chatType, r.fromMe);
  }
  db.close();
  return { dbPath, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}
```

- [ ] **Step 2: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/test-helpers/make-temp-db.mjs"
git commit -m "test(wa-claw): add temp-db fixture helper"
```

---

## Task 3: `wa-store.mjs` — read chats/messages, ensure audit table

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/src/wa-store.mjs`
- Test: `dev-mode/openclaw-whatsapp-claw/app/test/wa-store.test.mjs`

`openStore(dbPath)` returns an object with these exact methods:

- `listChats()` → `Array<{ jid, chatType, displayName, lastTimestamp, messageCount }>` (most-recent chat first)
- `getMessages(jid, limit = 200)` → `Array<{ id, sender, pushName, timestamp, body, fromMe }>` (oldest first; `fromMe` is a boolean)
- `getAudit(jid, limit = 100)` → `Array<{ id, jid, messageId, ts, handler, outcome, reason, detail }>` (most recent first)
- `close()` → void

- [ ] **Step 1: Write the failing test — `test/wa-store.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { openStore } from "../src/wa-store.mjs";
import { makeTempDb } from "../test-helpers/make-temp-db.mjs";

test("openStore throws a clear error when the db file is missing", () => {
  assert.throws(() => openStore("/no/such/wa-history.db"), /not found/i);
});

test("listChats groups messages into chats, newest first", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const chats = store.listChats();
    assert.equal(chats.length, 2);
    // group 999@g.us has the newest message (ts 1002) -> first
    assert.equal(chats[0].jid, "999@g.us");
    assert.equal(chats[0].chatType, "group");
    assert.equal(chats[0].messageCount, 1);
    const dm = chats.find((c) => c.jid === "111@s.whatsapp.net");
    assert.equal(dm.chatType, "dm");
    assert.equal(dm.messageCount, 2);
    assert.equal(dm.displayName, "Mom"); // newest inbound push_name
    assert.equal(dm.lastTimestamp, 1001);
  } finally {
    store.close();
    cleanup();
  }
});

test("getMessages returns a chat's messages oldest-first with boolean fromMe", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const msgs = store.getMessages("111@s.whatsapp.net");
    assert.equal(msgs.length, 2);
    assert.equal(msgs[0].body, "hi");
    assert.equal(msgs[0].fromMe, false);
    assert.equal(msgs[1].body, "hello mom");
    assert.equal(msgs[1].fromMe, true);
  } finally {
    store.close();
    cleanup();
  }
});

test("getMessages honors the limit", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    assert.equal(store.getMessages("111@s.whatsapp.net", 1).length, 1);
  } finally {
    store.close();
    cleanup();
  }
});

test("the audit table is created and getAudit returns an empty array initially", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    assert.deepEqual(store.getAudit("111@s.whatsapp.net"), []);
  } finally {
    store.close();
    cleanup();
  }
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `node --test test/wa-store.test.mjs`
Expected: FAIL — `Cannot find module '../src/wa-store.mjs'`.

- [ ] **Step 3: Implement `src/wa-store.mjs`**

```js
import { existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const AUDIT_DDL = `
  CREATE TABLE IF NOT EXISTS wa_claw_audit (
    id TEXT PRIMARY KEY,
    jid TEXT NOT NULL,
    message_id TEXT,
    ts INTEGER,
    handler TEXT,
    outcome TEXT,
    reason TEXT,
    detail TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_wa_claw_audit_jid ON wa_claw_audit(jid);
`;

/**
 * Open the wa-history database for the panel.
 * Opens read/write ONLY to ensure the `wa_claw_audit` table exists;
 * never writes the `messages` table.
 * @param {string} dbPath
 */
export function openStore(dbPath) {
  if (!existsSync(dbPath)) {
    throw new Error(`wa-history.db not found at: ${dbPath}`);
  }
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(AUDIT_DDL);

  const listChatsStmt = db.prepare(`
    SELECT jid,
           chat_type   AS chatType,
           MAX(timestamp) AS lastTimestamp,
           COUNT(*)    AS messageCount
    FROM messages
    GROUP BY jid
    ORDER BY lastTimestamp DESC
  `);
  const displayNameStmt = db.prepare(`
    SELECT push_name AS pushName
    FROM messages
    WHERE jid = ? AND from_me = 0 AND push_name IS NOT NULL AND push_name <> ''
    ORDER BY timestamp DESC
    LIMIT 1
  `);
  const messagesStmt = db.prepare(`
    SELECT id, sender, push_name AS pushName, timestamp, body, from_me AS fromMe
    FROM messages
    WHERE jid = ?
    ORDER BY timestamp ASC
    LIMIT ?
  `);
  const auditStmt = db.prepare(`
    SELECT id, jid, message_id AS messageId, ts, handler, outcome, reason, detail
    FROM wa_claw_audit
    WHERE jid = ?
    ORDER BY ts DESC
    LIMIT ?
  `);

  function listChats() {
    return listChatsStmt.all().map((r) => {
      const jid = String(r.jid);
      const isGroup = jid.endsWith("@g.us");
      const nameRow = displayNameStmt.get(jid);
      const displayName = isGroup
        ? `Group ${jid.replace("@g.us", "")}`
        : nameRow?.pushName || jid.replace("@s.whatsapp.net", "");
      return {
        jid,
        chatType: r.chatType || (isGroup ? "group" : "dm"),
        displayName,
        lastTimestamp: r.lastTimestamp ?? 0,
        messageCount: r.messageCount ?? 0,
      };
    });
  }

  function getMessages(jid, limit = 200) {
    return messagesStmt.all(jid, limit).map((r) => ({
      id: r.id,
      sender: r.sender,
      pushName: r.pushName,
      timestamp: r.timestamp ?? 0,
      body: r.body ?? "",
      fromMe: r.fromMe === 1,
    }));
  }

  function getAudit(jid, limit = 100) {
    return auditStmt.all(jid, limit);
  }

  function close() {
    db.close();
  }

  return { listChats, getMessages, getAudit, close };
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `node --test test/wa-store.test.mjs`
Expected: PASS — 5 tests passing. An `ExperimentalWarning` for `node:sqlite` is printed; ignore it.

- [ ] **Step 5: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/src/wa-store.mjs" "dev-mode/openclaw-whatsapp-claw/app/test/wa-store.test.mjs"
git commit -m "feat(wa-claw): wa-store — read chats/messages, ensure audit table"
```

---

## Task 4: `server.mjs` — HTTP API + static serving

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/src/server.mjs`
- Create: `dev-mode/openclaw-whatsapp-claw/app/src/main.mjs`
- Test: `dev-mode/openclaw-whatsapp-claw/app/test/server.test.mjs`

API contract:

- `GET /api/chats` → `200` JSON array from `store.listChats()`
- `GET /api/messages?jid=<jid>` → `200` JSON array; `400 {error}` if `jid` missing
- `GET /api/audit?jid=<jid>` → `200` JSON array; `400 {error}` if `jid` missing
- any other `/api/*` → `404 {error}`
- any data error (e.g. db missing) → `503 {error}` with the error message
- everything else → static file from `publicDir` (`/` serves `index.html`); missing file → `404`

- [ ] **Step 1: Write the failing test — `test/server.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createPanelServer } from "../src/server.mjs";
import { makeTempDb } from "../test-helpers/make-temp-db.mjs";

/** Start a server on an ephemeral port; return { base, close }. */
async function startTestServer(opts) {
  const server = createPanelServer(opts);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return {
    base: `http://127.0.0.1:${port}`,
    // Await this before deleting the temp db: closeAllConnections() drops
    // keep-alive sockets, and the server's 'close' event closes the SQLite
    // handle (an open db file cannot be deleted on Windows).
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}

test("GET /api/chats returns chats from the db", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await fetch(`${srv.base}/api/chats`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.ok(body.some((c) => c.jid === "111@s.whatsapp.net"));
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/messages requires a jid", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await fetch(`${srv.base}/api/messages`);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /jid/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/messages?jid= returns that chat's messages", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await fetch(
      `${srv.base}/api/messages?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 2);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/audit?jid= returns an array", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await fetch(
      `${srv.base}/api/audit?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
    );
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("a missing db surfaces a 503 with an error message", async () => {
  const srv = await startTestServer({
    dbPath: "/no/such/wa-history.db",
    publicDir: "/no/such/dir",
  });
  try {
    const res = await fetch(`${srv.base}/api/chats`);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.match(body.error, /not found/i);
  } finally {
    await srv.close();
  }
});

test("unknown /api route is 404", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await fetch(`${srv.base}/api/nope`);
    assert.equal(res.status, 404);
  } finally {
    await srv.close();
    cleanup();
  }
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `node --test test/server.test.mjs`
Expected: FAIL — `Cannot find module '../src/server.mjs'`.

- [ ] **Step 3: Implement `src/server.mjs`**

```js
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { openStore } from "./wa-store.mjs";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(data);
}

async function serveStatic(pathname, publicDir, res) {
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const full = normalize(join(publicDir, rel));
  // Path-traversal guard: resolved path must stay inside publicDir.
  if (full !== publicDir && !full.startsWith(publicDir + sep)) {
    sendJson(res, 403, { error: "forbidden" });
    return;
  }
  try {
    const data = await readFile(full);
    res.writeHead(200, {
      "content-type": MIME[extname(full)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

/**
 * Create the panel HTTP server (not yet listening).
 * @param {{ dbPath: string, publicDir: string }} opts
 * @returns {import("node:http").Server}
 */
export function createPanelServer({ dbPath, publicDir }) {
  let store = null;
  // Lazily open the store; on failure leave it null so the next request retries.
  function getStore() {
    if (!store) {
      store = openStore(dbPath);
    }
    return store;
  }

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    try {
      if (url.pathname === "/api/chats") {
        sendJson(res, 200, getStore().listChats());
        return;
      }
      if (url.pathname === "/api/messages") {
        const jid = url.searchParams.get("jid");
        if (!jid) {
          sendJson(res, 400, { error: "missing jid" });
          return;
        }
        sendJson(res, 200, getStore().getMessages(jid));
        return;
      }
      if (url.pathname === "/api/audit") {
        const jid = url.searchParams.get("jid");
        if (!jid) {
          sendJson(res, 400, { error: "missing jid" });
          return;
        }
        sendJson(res, 200, getStore().getAudit(jid));
        return;
      }
      if (url.pathname.startsWith("/api/")) {
        sendJson(res, 404, { error: "not found" });
        return;
      }
      await serveStatic(url.pathname, publicDir, res);
    } catch (err) {
      sendJson(res, 503, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // Close the SQLite handle when the server closes. On Windows an open db
  // file cannot be deleted, so this lets temp dirs (and tests) clean up.
  server.on("close", () => {
    if (store) {
      try {
        store.close();
      } catch {
        /* ignore */
      }
      store = null;
    }
  });

  return server;
}

/**
 * Open the server and start listening on the loopback interface.
 * @param {{ dbPath: string, port: number, publicDir: string }} config
 * @returns {Promise<import("node:http").Server>}
 */
export function startPanelServer(config) {
  const server = createPanelServer(config);
  return new Promise((resolvePromise) => {
    server.listen(config.port, "127.0.0.1", () => resolvePromise(server));
  });
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `node --test test/server.test.mjs`
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Implement the entry point `src/main.mjs`**

```js
import { resolveConfig } from "./config.mjs";
import { startPanelServer } from "./server.mjs";

const config = resolveConfig();
const server = await startPanelServer(config);
const { port } = server.address();
console.log(`[wa-claw] panel listening on http://127.0.0.1:${port}  (db: ${config.dbPath})`);
```

- [ ] **Step 6: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/src/server.mjs" "dev-mode/openclaw-whatsapp-claw/app/src/main.mjs" "dev-mode/openclaw-whatsapp-claw/app/test/server.test.mjs"
git commit -m "feat(wa-claw): http server — chats/messages/audit API + static serving"
```

---

## Task 5: Frontend pure helpers — `public/lib.js`

`lib.js` holds browser-safe, DOM-free pure functions, so they can be unit-tested in Node and reused by `app.js`.

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/public/lib.js`
- Test: `dev-mode/openclaw-whatsapp-claw/app/test/lib.test.mjs`

- [ ] **Step 1: Write the failing test — `test/lib.test.mjs`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { filterChats, formatTimestamp, messageLineClass } from "../public/lib.js";

test("filterChats matches displayName and jid, case-insensitive", () => {
  const chats = [
    { jid: "111@s.whatsapp.net", displayName: "Mom" },
    { jid: "999@g.us", displayName: "Group 999" },
  ];
  assert.equal(filterChats(chats, "mom").length, 1);
  assert.equal(filterChats(chats, "999").length, 1);
  assert.equal(filterChats(chats, "").length, 2);
  assert.equal(filterChats(chats, "   ").length, 2);
});

test("formatTimestamp formats unix seconds and handles 0", () => {
  assert.equal(formatTimestamp(0), "");
  assert.equal(formatTimestamp(1000), "1970-01-01 00:16");
});

test("messageLineClass reflects message direction", () => {
  assert.equal(messageLineClass({ fromMe: true }), "msg msg-out");
  assert.equal(messageLineClass({ fromMe: false }), "msg msg-in");
});
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `node --test test/lib.test.mjs`
Expected: FAIL — `Cannot find module '../public/lib.js'`.

- [ ] **Step 3: Implement `public/lib.js`**

```js
// Pure, browser-safe helpers. No DOM access — also imported by Node tests.

/**
 * Filter chats by a search query against displayName and jid.
 * @param {Array<{jid:string, displayName:string}>} chats
 * @param {string} query
 */
export function filterChats(chats, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) {
    return chats;
  }
  return chats.filter(
    (c) => c.displayName.toLowerCase().includes(q) || c.jid.toLowerCase().includes(q),
  );
}

/**
 * Format a unix-seconds timestamp as "YYYY-MM-DD HH:MM" (UTC).
 * Returns "" for falsy input.
 * @param {number} unixSeconds
 */
export function formatTimestamp(unixSeconds) {
  if (!unixSeconds) {
    return "";
  }
  return new Date(unixSeconds * 1000).toISOString().replace("T", " ").slice(0, 16);
}

/**
 * CSS class for a message line based on its direction.
 * @param {{fromMe:boolean}} msg
 */
export function messageLineClass(msg) {
  return msg.fromMe ? "msg msg-out" : "msg msg-in";
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `node --test test/lib.test.mjs`
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/public/lib.js" "dev-mode/openclaw-whatsapp-claw/app/test/lib.test.mjs"
git commit -m "feat(wa-claw): frontend pure helpers (filter/format/class)"
```

---

## Task 6: Frontend DOM — `index.html`, `style.css`, `app.js`

This task is DOM wiring; it is verified by the manual end-to-end check in Task 7 (not unit-tested — pure logic already lives in `lib.js`).

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/public/index.html`
- Create: `dev-mode/openclaw-whatsapp-claw/app/public/style.css`
- Create: `dev-mode/openclaw-whatsapp-claw/app/public/app.js`

- [ ] **Step 1: Create `public/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>WhatsApp Claw</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div id="banner" class="banner hidden"></div>
    <main class="layout">
      <section class="col col-chats">
        <input id="search" class="search" type="search" placeholder="Search chats…" />
        <ul id="chat-list" class="chat-list"></ul>
      </section>
      <section class="col col-content">
        <header id="content-header" class="content-header">Select a chat</header>
        <ul id="message-list" class="message-list"></ul>
      </section>
      <section class="col col-oc">
        <header class="oc-header">OC Settings</header>
        <div id="oc-panel" class="oc-panel">
          <p class="muted">Select a chat to see its info.</p>
        </div>
      </section>
    </main>
    <script type="module" src="/app.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `public/style.css`**

```css
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  height: 100%;
}
body {
  font:
    14px/1.4 system-ui,
    sans-serif;
  color: #111;
}

.banner {
  padding: 8px 12px;
  background: #fde2e2;
  color: #7a1f1f;
}
.banner.hidden {
  display: none;
}

.layout {
  display: flex;
  height: 100vh;
}
.col {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.col-chats {
  width: 280px;
  border-right: 1px solid #ddd;
}
.col-content {
  flex: 1;
  border-right: 1px solid #ddd;
}
.col-oc {
  width: 320px;
}

.search {
  margin: 8px;
  padding: 6px 8px;
}
.chat-list,
.message-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}

.chat-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}
.chat-item:hover {
  background: #f5f5f5;
}
.chat-item.selected {
  background: #e6f0ff;
}

.content-header,
.oc-header {
  padding: 10px 12px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}
.message-list {
  padding: 8px;
  gap: 4px;
}
.msg {
  padding: 6px 8px;
  margin: 2px 0;
  border-radius: 6px;
  max-width: 80%;
}
.msg-in {
  background: #f1f1f1;
  align-self: flex-start;
}
.msg-out {
  background: #d9fdd3;
  align-self: flex-end;
}
.message-list {
  display: flex;
  flex-direction: column;
}

.oc-panel {
  padding: 12px;
  overflow-y: auto;
}
.oc-info dt {
  font-weight: 600;
  margin-top: 6px;
}
.oc-info dd {
  margin: 0 0 4px;
}
.audit-list {
  list-style: none;
  padding: 0;
}
.muted {
  color: #888;
}
```

- [ ] **Step 3: Create `public/app.js`**

```js
import { filterChats, formatTimestamp, messageLineClass } from "/lib.js";

const state = { chats: [], selectedJid: null };

const els = {
  banner: document.getElementById("banner"),
  search: document.getElementById("search"),
  chatList: document.getElementById("chat-list"),
  contentHeader: document.getElementById("content-header"),
  messageList: document.getElementById("message-list"),
  ocPanel: document.getElementById("oc-panel"),
};

function showBanner(msg) {
  els.banner.textContent = msg;
  els.banner.classList.remove("hidden");
}
function clearBanner() {
  els.banner.classList.add("hidden");
}

async function api(path) {
  const res = await fetch(path);
  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    throw new Error((body && body.error) || `HTTP ${res.status}`);
  }
  return body;
}

function renderChats() {
  const filtered = filterChats(state.chats, els.search.value);
  els.chatList.replaceChildren(
    ...filtered.map((c) => {
      const li = document.createElement("li");
      li.className = "chat-item" + (c.jid === state.selectedJid ? " selected" : "");
      li.textContent = `${c.displayName} (${c.messageCount})`;
      li.title = c.jid;
      li.addEventListener("click", () => selectChat(c.jid));
      return li;
    }),
  );
}

function renderMessages(messages) {
  els.messageList.replaceChildren(
    ...messages.map((m) => {
      const li = document.createElement("li");
      li.className = messageLineClass(m);
      const who = m.fromMe ? "me" : m.pushName || m.sender || "?";
      li.textContent = `[${formatTimestamp(m.timestamp)}] ${who}: ${m.body}`;
      return li;
    }),
  );
}

function renderOcPanel(chat, audit) {
  els.ocPanel.replaceChildren();
  const dl = document.createElement("dl");
  dl.className = "oc-info";
  const rows = [
    ["JID", chat ? chat.jid : ""],
    ["Type", chat ? chat.chatType : ""],
    ["Messages", String(chat ? chat.messageCount : 0)],
    ["Handler", "configuration arrives in v2"],
  ];
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    if (label === "Handler") {
      dd.className = "muted";
    }
    dl.append(dt, dd);
  }
  const h3 = document.createElement("h3");
  h3.textContent = `Audit (${audit.length})`;
  const ul = document.createElement("ul");
  ul.className = "audit-list";
  for (const a of audit) {
    const li = document.createElement("li");
    li.textContent = `${formatTimestamp(a.ts)} — ${a.outcome || ""} (${a.handler || ""})`;
    ul.append(li);
  }
  els.ocPanel.append(dl, h3, ul);
}

async function selectChat(jid) {
  state.selectedJid = jid;
  renderChats();
  const chat = state.chats.find((c) => c.jid === jid);
  els.contentHeader.textContent = chat ? `${chat.displayName} — ${chat.jid}` : jid;
  try {
    const messages = await api(`/api/messages?jid=${encodeURIComponent(jid)}`);
    renderMessages(messages);
    const audit = await api(`/api/audit?jid=${encodeURIComponent(jid)}`);
    renderOcPanel(chat, audit);
    clearBanner();
  } catch (err) {
    showBanner(err.message);
  }
}

async function init() {
  els.search.addEventListener("input", renderChats);
  try {
    state.chats = await api("/api/chats");
    clearBanner();
    renderChats();
  } catch (err) {
    showBanner(`Cannot load chats: ${err.message}`);
  }
}

init();
```

- [ ] **Step 4: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/public/index.html" "dev-mode/openclaw-whatsapp-claw/app/public/style.css" "dev-mode/openclaw-whatsapp-claw/app/public/app.js"
git commit -m "feat(wa-claw): 3-column read-only panel UI"
```

---

## Task 7: Sample-db seed script + end-to-end manual verification

**Files:**

- Create: `dev-mode/openclaw-whatsapp-claw/app/scripts/seed-sample-db.mjs`

- [ ] **Step 1: Create `scripts/seed-sample-db.mjs`**

```js
// Create a sample wa-history.db so the panel can be demoed without OpenClaw.
// Usage: node scripts/seed-sample-db.mjs [outputPath]
//   default outputPath: ./sample.db
import { DatabaseSync } from "node:sqlite";
import { existsSync, rmSync } from "node:fs";

const outPath = process.argv[2] || "./sample.db";
if (existsSync(outPath)) {
  rmSync(outPath);
}

const db = new DatabaseSync(outPath);
db.exec(`
  CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    jid TEXT NOT NULL,
    sender TEXT,
    push_name TEXT,
    timestamp INTEGER,
    body TEXT,
    chat_type TEXT,
    from_me INTEGER DEFAULT 0,
    raw_json TEXT,
    created_at TEXT
  );
`);
const insert = db.prepare(
  `INSERT INTO messages (id, jid, sender, push_name, timestamp, body, chat_type, from_me)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
);
const now = Math.floor(Date.now() / 1000);
const rows = [
  [
    "s1",
    "111@s.whatsapp.net",
    "111@s.whatsapp.net",
    "Mom",
    now - 600,
    "are you coming for dinner?",
    "dm",
    0,
  ],
  ["s2", "111@s.whatsapp.net", "me", "", now - 590, "yes, around 7", "dm", 1],
  [
    "s3",
    "222@s.whatsapp.net",
    "222@s.whatsapp.net",
    "Supplier Dan",
    now - 300,
    "invoice attached",
    "dm",
    0,
  ],
  ["s4", "999@g.us", "333@s.whatsapp.net", "Alice", now - 120, "team standup at 10", "group", 0],
  ["s5", "999@g.us", "444@s.whatsapp.net", "Bob", now - 60, "on my way", "group", 0],
];
for (const r of rows) {
  insert.run(...r);
}
db.close();
console.log(`Seeded ${rows.length} messages into ${outPath}`);
```

- [ ] **Step 2: Run the seed script**

Run (from `dev-mode/openclaw-whatsapp-claw/app/`): `node scripts/seed-sample-db.mjs ./sample.db`
Expected: prints `Seeded 5 messages into ./sample.db`.

- [ ] **Step 3: Run the full test suite**

Run: `node --test`
Expected: ALL tests pass — `config.test.mjs` (2), `wa-store.test.mjs` (5), `server.test.mjs` (6), `lib.test.mjs` (3). 16 tests, 0 failures.

- [ ] **Step 4: Start the panel against the sample db**

Run: `WA_CLAW_DB=./sample.db node src/main.mjs`
(Windows PowerShell equivalent: `$env:WA_CLAW_DB="./sample.db"; node src/main.mjs`)
Expected: prints `[wa-claw] panel listening on http://127.0.0.1:18790 (db: ./sample.db)`.
If port 18790 is already in use, pick another with `WA_CLAW_PORT`:
`WA_CLAW_PORT=18799 WA_CLAW_DB=./sample.db node src/main.mjs`
(PowerShell: `$env:WA_CLAW_PORT="18799"; $env:WA_CLAW_DB="./sample.db"; node src/main.mjs`).

- [ ] **Step 5: Manual UI check in a browser**

Open `http://127.0.0.1:18790` (or the port printed in Step 4). Verify:

- Column 1 lists 3 chats, newest-active first: "Group 999 (2)", "Supplier Dan (1)", "Mom (2)".
- Typing "mom" in search narrows the list to just "Mom".
- Clicking "Mom" shows 2 messages in column 2; the "yes, around 7" line is right-aligned/green (sent by me), the other left-aligned/grey.
- Column 3 shows JID, Type `dm`, Messages `2`, Handler "configuration arrives in v2", and "Audit (0)".
- Stop the server (Ctrl+C). Restart it pointed at a bad path: `WA_CLAW_DB=./nope.db node src/main.mjs` (PowerShell: `$env:WA_CLAW_DB="./nope.db"; node src/main.mjs`); reload the page — a red banner reads "Cannot load chats: wa-history.db not found at: ./nope.db".

- [ ] **Step 6: Commit**

```bash
git add "dev-mode/openclaw-whatsapp-claw/app/scripts/seed-sample-db.mjs"
git commit -m "feat(wa-claw): sample-db seed script for local demo"
```

---

## Definition of done (v1)

- `node --test` from `app/` passes all 16 tests with 0 failures.
- `node scripts/seed-sample-db.mjs ./sample.db` then `WA_CLAW_DB=./sample.db node src/main.mjs` serves the 3-column panel and the manual checks in Task 7 Step 5 all pass.
- No file outside `dev-mode/openclaw-whatsapp-claw/` was modified.
- All commits are local; nothing pushed.

## Roadmap — v2 / v3 (NOT part of this plan)

Each gets its own detailed plan. Recorded here so the v1 structure stays aligned and the design research survives conversation compaction.

- **v2 — config write path.** Add `oc-config-client` (talks to the OpenClaw gateway's config RPC — `config.get` / `config.patch` / `config.apply` / `schema.lookup`, the same RPCs the Control UI uses; authenticate over loopback with a device/pairing token) and `claw-model` (translate panel assignments ⇄ native `agents` / `bindings` mutations). Column 3 becomes editable: assign a **Full-agent** handler to a chat; edit its prompt (`systemPromptOverride`), `responsePrefix`, and the silence toggle. Bulk multi-select + a Defaults editor.
- **v3 — remaining handlers** (Cron, Heartbeat, Isolated-agent), the watermark, the inbound hook, and the live audit/escalation view.

### v3 implementation notes (researched during design — do not re-derive)

- **Selective reply uses the native `NO_REPLY` token.** `src/auto-reply/tokens.ts` exports `SILENT_REPLY_TOKEN = "NO_REPLY"`. An agent stays silent by replying exactly `NO_REPLY`; the WhatsApp dispatcher (`extensions/whatsapp/src/auto-reply/monitor/inbound-dispatch.ts`, ~line 586) already skips delivery on it, no error. **Gotcha:** `src/shared/silent-reply-policy.ts` defaults DMs to `disallow` + rewrite-to-filler — so for DM chats that must truly go silent, set `agents.defaults.silentReply.direct = "allow"` and `silentReplyRewrite.direct = false` (also settable per agent). Groups already allow silence.
- **Isolated-agent handler** → call `runCronIsolatedAgentTurn` (`src/cron/isolated-agent/run.ts`). There is **no** native per-message session scope (`DmScope` is only `main | per-peer | per-channel-peer | per-account-channel-peer`), so isolation cannot come from binding config — it must come from the isolated executor. Mechanism: the chat has **no route binding**; an inbound hook (the `wa-history.ts` integration pattern — implementation file under `dev-mode/openclaw-whatsapp-claw/`, thin call-site in `extensions/whatsapp/`) claims the message, builds a synthetic `CronJob`-shaped object (agentId, prompt, delivery target = the WA chat — the same delivery shape a real cron job uses to post to a chat), and calls `runCronIsolatedAgentTurn` with a fresh `sessionKey`. It runs the full agent turn via `runEmbeddedPiAgent`, loads all bootstrap `.md` files, and OC's session reaper cleans the spent session. Isolation is of the _conversation transcript_, not the workspace — `MEMORY.md` and identity files persist.
- **Heartbeat handler** → native agent heartbeat config, executed by `runHeartbeatOnce` (`src/infra/heartbeat-runner.ts`); deliberately **unbound** (no route binding → no needless turns); one heartbeat carries multiple tasks, one per chat.
- **Cron handler** → native `cfg.cron` jobs; N chats duplicate to N jobs by default, or one job in aggregate mode. A per-chat "since last time" watermark is stored in the wa db.
- **Audit/escalation** → Column 3's audit view goes live, reading `wa_claw_audit` (v1 already creates the table). "Escalate" = the agent sends a WhatsApp message to the owner's number + writes an `escalated` audit row — no new machinery.

## Audit log

Three audit passes were run against this plan before handoff.

**Pass 1 — spec coverage, placeholders, type consistency.**

- Spec coverage: design-concept §16 Phase-1 items — `wa-store`, the `wa_claw_audit` table, and the read-only 3-column panel — all map to Tasks 3 / 4 / 6. The §12 column-3 is delivered read-only (chat info + audit). ✓
- Type consistency: `resolveConfig`, `openStore`, `createPanelServer`, `startPanelServer`, `makeTempDb` / `SAMPLE_ROWS`, and `filterChats` / `formatTimestamp` / `messageLineClass` are each defined once and used with matching signatures across tasks. ✓
- Fix: design §11 describes the wa-db open as "read-only", but the panel must open read/write once to run `CREATE TABLE IF NOT EXISTS wa_claw_audit`. Documented in Context as an intentional v1 refinement.
- Fix: filled this Audit log section (was a placeholder).

**Pass 2 — executability (can the executor run every step verbatim).**

- Fix: `node` vs `git` working directories were ambiguous — added an explicit Context rule (node from `app/`, git from the repo root).
- Fix: the test helper sat in `test/helpers/`; Node's `--test` runner treats files under a `test/` directory as test files and would load the helper. Moved it to `app/test-helpers/` (outside `test/`) and updated both test imports.
- Fix: `server.test.mjs` called only `server.close()`; Node `fetch` keep-alive sockets can keep the event loop alive and hang `node --test`. Added `server.closeAllConnections()` before `close()`.
- Fix: Task 7 Step 5 listed the chat order as "Mom, Supplier Dan, Group 999", but the seed data is ordered newest-active first → "Group 999, Supplier Dan, Mom". Corrected.
- Fix: added a port-in-use fallback (`WA_CLAW_PORT`) to Task 7 Step 4 and the PowerShell env-var form to Step 5.
- Verified: SQL matches the `messages` schema; `node:sqlite` positional-parameter usage is correct; the static-file path-traversal guard is sound; the manual-check expectations match the seed data.

**Pass 3 — deeper correctness (cross-platform + resource lifecycle).**

- Fix: `server.test.mjs` opened the SQLite db (via the server's lazy `getStore()`) but never closed it before `cleanup()` deleted the temp directory. On Windows an open db file cannot be deleted → `rmSync` would throw `EBUSY`. `createPanelServer` now closes the store on the server's `'close'` event, and `startTestServer`'s `close()` returns a promise the tests `await` before cleanup.
- Fix: added a Node-version preflight (`node --version` ≥ 22.5) to Context — `node:sqlite` is absent on older Node.
- Verified: `node --test` discovers only `test/*.test.mjs` (4 files, 16 tests) — `test-helpers/` and `scripts/` are not scanned, and `src/` files match no test pattern.
- Verified: each task's `git add` lists exactly the files its steps create; `.gitignore` keeps `*.db` (seed + temp dbs) out of commits.
- Verified: task ordering satisfies every cross-file import (helper before its consumers; `lib.js` before `app.js`).
