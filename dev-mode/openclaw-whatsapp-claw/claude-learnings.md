# Claude Learnings — VPS Research & Source Code Findings

**Purpose:** Permanent reference of all tests, queries, and discoveries made by Claude against the live VPS and source code. Always includes OC version so findings stay interpretable as the platform evolves.

---

## OC Version: V2026.5.12

### agents.list — structure

**Finding:** `agents.list` is an **array of objects**, each with an `id` field. NOT a keyed object.

**How verified:** `openclaw config get agents.list` on VPS (2026-05-20)

**Count:** 12 agents

**Implication:** `openclaw config set agents.list.myAgent.field value` does NOT work — there is no keyed access. Array mutation requires reading the full array, modifying in memory, and writing back (e.g., via `jq` on the JSON file directly). This is the v3 array-mutation problem.

---

### Cron jobs — fully featured CLI

**Finding:** `openclaw cron` has a full subcommand suite:

```
openclaw cron add       # create a cron job
openclaw cron list      # list all (supports --json)
openclaw cron edit      # modify an existing job
openclaw cron rm        # delete
openclaw cron enable    # enable a disabled job
openclaw cron disable   # disable without deleting
openclaw cron run       # debug: trigger immediately
openclaw cron runs      # view run history for a job
openclaw cron show      # detailed view of one job
openclaw cron status    # overall cron status
```

**How verified:** `openclaw cron --help` and `openclaw cron list` on VPS (2026-05-20)

**Count:** 11 cron jobs exist on VPS, some with WhatsApp delivery targets.

**Key fact:** Cron jobs are **gateway-managed state** — they are NOT stored in `openclaw.json`. The config file only has `cron.sessionRetention`. Cron job definitions live in the gateway's internal state and are managed exclusively through the CLI.

---

### Bindings — current state

**Finding:** 11 RouteBindings exist, ALL targeting Discord channels. Zero WhatsApp bindings configured yet.

**How verified:** `openclaw config get bindings` on VPS (2026-05-20)

**Schema (from source):** `BindingsSchema` = array of `RouteBinding | AcpBinding`. Each `RouteBinding` has:

- `agentId` (string)
- `match.channel` (string, e.g., "whatsapp", "discord")
- `match.peer` (`{ kind: "direct"|"group", id: string }`)
- `match.accountId` (optional)
- `session.dmScope` (optional)

**Top-level:** `bindings` is a TOP-LEVEL config key, NOT under `agents`.

---

### skipBootstrap / contextInjection / silentReply — scope

**Finding:** All three are **`agents.defaults` only** — they exist in `AgentDefaultsSchema` but NOT in `AgentEntrySchema` (per-agent config).

**How verified:** Source code inspection of `src/config/zod-schema.agents.ts` (2026-05-20)

- `skipBootstrap: z.boolean()` — in `AgentDefaultsSchema`
- `contextInjection: z.enum(["default","never","continuation-skip"])` — in `AgentDefaultsSchema`
- `silentReply: { direct: z.enum([...]), group: z.enum([...]) }` — in `AgentDefaultsSchema`

**Implication:** You CANNOT make one agent "thin" (skipBootstrap) and another "full" via config. Setting `skipBootstrap: true` affects ALL agents globally. The thin-agent (I3) design must use `systemPromptOverride` alone and accept bootstrap file overhead.

---

### AgentEntrySchema — what IS available per-agent

**Finding:** Per-agent config keys (from `AgentEntrySchema`):

```
id, name, description, disabled, model { primary, fallbacks, reasoning },
systemPromptOverride, heartbeat { every, target, to, ... },
tools { profile, allow, deny, alsoAllow, byProvider },
session { dmScope }
```

**NOT per-agent:** `skipBootstrap`, `contextInjection`, `silentReply`, `thinkingDefault`, `responsePrefix`

---

### Heartbeat — task list mechanism

**Finding:** Heartbeat supports **multiple tasks** via YAML `tasks:` blocks in the **HEARTBEAT.md workspace file**, NOT in `openclaw.json`.

**Two-layer model:**

1. `openclaw.json → agents.list[].heartbeat` — scheduling: `every`, `target`, `to`, `lightContext`, `isolatedSession`, `model`, `activeHours`
2. `HEARTBEAT.md → tasks:` — task definitions: each task has `{ name, interval, prompt }`. Parser: `parseHeartbeatTasks()` in source.

**HeartbeatSchema (Zod):** Single `.strict()` object. Fields: `every`, `activeHours`, `model`, `session`, `target`, `to`, `accountId`, `prompt`, `lightContext`, `isolatedSession`, `skipWhenBusy`, etc. NO `tasks` field — tasks are file-driven.

**How verified:** Ariel pointed to heartbeat docs + source code inspection of `HeartbeatSchema` in `src/config/zod-schema.agent-runtime.ts` (2026-05-20)

---

### lightContext — cron vs heartbeat behavior

**Finding:** `lightContext` means different things for crons and heartbeats:

| Setting                         | Behavior                                     |
| ------------------------------- | -------------------------------------------- |
| Cron `lightContext: true`       | ZERO bootstrap files loaded                  |
| Cron `lightContext: false`      | ALL bootstrap files loaded                   |
| Cron `systemEvent`              | Full agent session with conversation history |
| Heartbeat `lightContext: true`  | Only HEARTBEAT.md loaded                     |
| Heartbeat `lightContext: false` | ALL bootstrap files loaded                   |

**Source:** `bootstrap-files.ts` → `applyContextModeFilter()`. When `contextMode === "lightweight"`:

- `runKind === "heartbeat"` → filter to HEARTBEAT.md only
- `runKind === "cron"` or `"default"` → return empty array `[]`

Comment in source: `// cron/default lightweight mode keeps bootstrap context empty on purpose.`

**How verified:** Source code reading + documented in `proof-01-cronVSheartbeat.md` (2026-05-20)

**Implication:** Three cron flavors — S1a (stupid: lightCtx true, zero files), S1b (smart: lightCtx false, full bootstrap), S1c (agent: systemEvent, full session + history).

---

### NO_REPLY mechanism

**Finding:** `NO_REPLY` is a magic text token in the agent response. The pipeline in `normalizeReplyPayload()` detects it and drops the message (true silence).

**Default policy:**

- DMs: `silentReply.direct = "disallow"` → NO_REPLY is rewritten to a polite phrase
- Groups: `silentReply.group = "allow"` → NO_REPLY achieves true silence

**To enable DM silence:** Set `agents.defaults.silentReply.direct: "allow"` (global only)

---

### systemPromptOverride — behavior

**Finding:** `systemPromptOverride` (per-agent) replaces the core OC system prompt text but **bootstrap files are still appended** (AGENTS.md, SOUL.md, workspace files, etc.). Only `skipBootstrap: true` (global) prevents bootstrap injection.

**Implication:** A thin agent with `systemPromptOverride` still sees bootstrap content. The override text dominates behavior, but token cost includes bootstrap overhead.

---

### VPS model configuration (2026-05-20)

**Applied config:**

- Primary: `ollama/kimi-k2.6:cloud`
- Fallbacks: `["ollama/gemma4:31b-cloud"]`
- Thinking: `high`

**How applied:** Direct `jq` edit on `~/.openclaw/openclaw.json` + `openclaw gateway restart`

**Context:** DeepSeek was timing out, kimi was set as primary. Gateway verified healthy: 7 plugins loaded, WA history logger attached, 187 group names stored.

---

### wa-history.db — group names

**Finding:** Group names are captured by `wa-history.ts` via two mechanisms:

1. `messages.upsert` stub events (real-time as messages arrive)
2. `groupFetchAllParticipating` backfill (on startup)

**187 group names** stored on VPS (2026-05-20).

**`@lid` JIDs:** These are WhatsApp's Linked Identity format for contacts. They do NOT contain phone numbers. The `remoteJidAlt` field in message's raw JSON contains the corresponding `@s.whatsapp.net` JID. Contacts communicated with only recently may not yet have `push_name` populated in the message history.

---

### wa_claw_audit table

**Finding:** Table exists in wa-history.db (created by `wa-store.mjs`) with schema:

```sql
CREATE TABLE IF NOT EXISTS wa_claw_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  action TEXT,
  details TEXT
)
```

**Status:** Always empty — no handler writes to it yet. Will be populated by v2 custom handlers (I1/I2) and by agents following the central WA prompt instructions.

**v2 plan:** Redesigned schema in wa-claw.db (separate DB) with richer columns: `jid`, `message_id`, `ts`, `handler`, `outcome`, `reason`, `detail`.

# Claude Learnings - WA Claw v2

Accumulated lessons from deployment and debugging sessions.

---

## v0.2.1 - 2026-05-25 (First Live Deploy)

### Bugs Found & Fixed

1. **SQLite migration ordering** - `CREATE INDEX ... ON messages(phone_e164)` ran before `ALTER TABLE messages ADD COLUMN phone_e164`. On v1 DBs (where the table exists without that column), the index creation fails, which crashes `attachWaHistoryLogger` silently. Fix: run ALTER TABLE migrations before any CREATE INDEX that references the new columns.

2. **Silent `catch {}` in session.ts** - The `attachWaHistoryLogger` import was wrapped in a bare `catch {}` that swallowed all errors. The logger was failing on every gateway restart since the v2-impl deploy, but no error was ever logged. Fix: changed to `catch (err) { console.error(...) }`. Lesson: never use bare `catch {}` in dev-mode code - visibility matters more than resilience.

3. **`DROP TABLE IF EXISTS wa_claw_audit`** in `getDb()` - Left over from development, this wiped the audit table on every DB open (every gateway restart). Fix: removed.

4. **Auth was optional** - `config.mjs` fell back to `""` when no token env var was set, making the panel run ungated. `auth.mjs` had `if (!expectedToken) return true`. Fix: panel now throws on startup if no token is configured. Auth is mandatory, no opt-out.

5. **Control UI assets dropped on deploy** - `pnpm build` regenerates `dist/` which deletes `dist/control-ui/`. Must always run `pnpm ui:build` after `pnpm build` before committing dist. This was already a known lesson but bit us 3 times in one session.

### Deployment Lessons

6. **VPS SSH host** - The dev VPS is at 72.62.43.130:60022, not any of the other IPs in known_hosts. Multiple old/retired VPS entries exist there. Don't guess - use the known host.

7. **Panel systemd service needs the gateway token** - The `wa-claw-panel.service` must have `Environment="OPENCLAW_GATEWAY_TOKEN=<token>"` in its `[Service]` section. The token lives in `~/.openclaw/openclaw.json` under `gateway.auth.token`, not in `.env`.

8. **v1 panel was an orphaned process** - No systemd unit managed it. We killed it and replaced with a proper `wa-claw-panel.service`.

9. **DB rename is a one-time operation** - `wa-history.db` to `openclaw-whatsapp-claw.db`. The rename leaves orphaned `-shm` and `-wal` files from the old name. These are harmless but can be cleaned up.

10. **Gateway stuck in `channels.whatsapp.start-account`** - After a restart, WA can get stuck in the start-account phase. The agent session may still work (it talks via WA), but the Baileys session-open callback never fires, so `attachWaHistoryLogger` is never called. A second gateway restart usually clears this.

### Architecture Notes

11. **Handler dispatch lives in the extension, not the panel** - `openclaw-whatsapp-claw.ts` (compiled into the gateway process) has both the DB writer AND the handler lookup/dispatch. The panel is just a UI server. They share the same SQLite DB file via WAL mode.

12. **JID format matters for handler matching** - Handlers are stored by JID (exact string). WhatsApp uses two formats: `972...@s.whatsapp.net` (phone-based) and `17447...@lid` (Linked Identity Device). The lookup is exact match - a handler saved under one format won't match messages arriving on the other. The panel saves handlers using whatever JID the chat list shows.

13. **Duplicate chat entries** - The same person can appear twice in the chat list: once with `@s.whatsapp.net` JID and once with `@lid` JID. This is a WhatsApp protocol issue, not a panel bug.
