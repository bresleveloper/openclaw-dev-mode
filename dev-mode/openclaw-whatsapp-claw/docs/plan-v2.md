# WhatsApp Claw — v2 Implementation Plan (Read-Only OC Settings)

- **Status:** Revised after Q01 grilling (2026-05-20)
- **Date:** 2026-05-20 (rev 2)
- **Supersedes:** plan-v2.md rev 1
- **Input:** `plan-v1-q01.md` + `plan-v2-q01.md` (Ariel's answers), VPS research
- **Scope:** v2 = read-only Column 3 + custom instant handler for I1/I2. v3 = OC config writes.
- **OC version:** V2026.5.12

---

## 1. What v2 delivers

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │                          v2 DELIVERABLES                            │
  ├─────────────────────┬────────────────────────────────────────────────┤
  │  READ-ONLY VIEW     │  Column 3 shows live OC config for selected  │
  │  (OC-native paths)  │  chat: handler type, agent, cron, heartbeat, │
  │                     │  system prompt, tools, silence policy         │
  ├─────────────────────┼────────────────────────────────────────────────┤
  │  DEFAULTS ENTRY     │  Default BEHAVIOR for all unbound chats —    │
  │                     │  one config that applies to every chat       │
  │                     │  without a specific handler                   │
  ├─────────────────────┼────────────────────────────────────────────────┤
  │  CUSTOM INSTANT     │  WA Claw's own event emitter for I1 (static │
  │  HANDLER (new)      │  reply) and I2 (stateless model call) — the  │
  │                     │  ONE feature that IS writable in v2          │
  ├─────────────────────┼────────────────────────────────────────────────┤
  │  DATA MODEL         │  Rename wa-history.db →                      │
  │  CHANGES            │  openclaw-whatsapp-claw.db; add phone_e164   │
  │                     │  column + handler/defaults/audit tables to   │
  │                     │  the single unified DB                       │
  ├─────────────────────┼────────────────────────────────────────────────┤
  │  CENTRAL PROMPT     │  Shared WA auto-answering rules file used    │
  │  FILE               │  by all handler paths                        │
  ├─────────────────────┼────────────────────────────────────────────────┤
  │  READ-ONLY MODE     │  App global variable — UI defaults to        │
  │  TOGGLE             │  read-only, "Edit" button enables editing    │
  └─────────────────────┴────────────────────────────────────────────────┘
```

---

## 2. Architecture — two paths

v2 has TWO distinct paths for handling WhatsApp messages. This is the core
architectural decision.

```
                    ┌─────────────────────────┐
                    │   Inbound WA message     │
                    │   (Baileys messages.     │
                    │    upsert event)         │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  openclaw-whatsapp-       │
                    │  claw.ts (logs +          │
                    │  custom handlers)         │
                    └────────────┬─────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
        PATH A (new)      PATH B (OC-native)     │
        WA Claw custom    OC agent pipeline      │
                 │               │               │
        ┌────────▼────────┐     │               │
        │ openclaw-       │     │               │
        │ whatsapp-claw.ts│     │               │
        │ (custom handler)│     │               │
        │                 │     │               │
        │ Checks handler  │     │               │
        │ config (in      │     │               │
        │ openclaw-       │     │               │
        │ whatsapp-       │     │               │
        │ claw.db)        │     │               │
        │                 │     │               │
        │ I1: static text │     │     ┌─────────▼─────────┐
        │ I2: stateless   │     │     │ OC binding check   │
        │     model call  │     │     │ → agent pipeline   │
        │                 │     │     │ → cron scheduler   │
        └────────┬────────┘     │     │ → heartbeat runner │
                 │              │     └─────────┬─────────┘
                 │              │               │
                 ▼              │               ▼
        Reply via              │        OC handles it
        openclaw message       │        (I3, I4, S1a-c, S2)
        send (or NO_REPLY)     │
                               │
                               ▼
                    ┌─────────────────────────┐
                    │  Panel reads config     │
                    │  (openclaw config get   │
                    │   + openclaw cron list) │
                    │  and displays in Col 3  │
                    └─────────────────────────┘
```

### Path A: WA Claw custom instant handler (NEW in v2)

For **I1 (static reply)** and **I2 (stateless model call)**, we build our own
lightweight handler that runs BEFORE OC's agent pipeline. This is the only
writable feature in v2.

**Why a custom path?** OC has no native mechanism for static replies or truly
stateless model calls. Every OC message goes through an agent with a session.
Rather than hack OC's internals, we add our own event emitter at the same code
location where we already hook into Baileys for openclaw-whatsapp-claw.db logging.

**Where it lives:** `extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts`
— this is the unified file that replaces `wa-history.ts`. It handles BOTH
message logging (v1 job) and custom instant handlers (v2 job) in one Baileys
subscription, one DB connection. Activated via env-var gated dynamic
`import()` in `session.ts`.

**Config storage:** `openclaw-whatsapp-claw.db` (the single unified WA Claw
database) — NOT in `openclaw.json` (Zod strict would reject our custom keys).

### Path B: OC-native (read-only in v2)

For **I3 (thin agent)**, **I4 (full agent)**, **S1a-S1c (crons)**, **S2 (heartbeats)**,
we use OC's native config system. v2 READS this config and displays it in
Column 3. v3 will WRITE it.

**Data source:** `openclaw config get` and `openclaw cron list` CLI commands,
executed via `child_process.execFile()` on the server.

### Why terminal commands (not RPC)

- `openclaw config get <path>` returns JSON to stdout — parse it
- `openclaw cron list --json` returns all cron jobs
- Same commands Ariel runs manually — fully debuggable
- No WebSocket/HTTP connection management needed
- CLI reads config file directly — no gateway auth needed for reads

---

## 3. Handler taxonomy — verified against source code (V2026.5.12)

### 3.0 General rules

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                     GENERAL RULES                                │
  │                                                                  │
  │  1. PRE-PROMPT: Every AI handler path (all except I1 static)    │
  │     gets the central WA prompt (§6) — a comprehensive reference │
  │     doc with WA rules, DB schema, tools, paths, escalation      │
  │     procedure, and response format.                             │
  │                                                                  │
  │  2. RESPONSE: Model returns text → delivered to chat.           │
  │     Model returns NO_REPLY → message dropped (silence).         │
  │     Requires silentReply.direct: "allow" for DMs.               │
  │                                                                  │
  │  3. LAST RUN TIME: Tracked in openclaw-whatsapp-claw.db (§7).  │
  │     Agent self-reports via session ID as key.                   │
  └──────────────────────────────────────────────────────────────────┘
```

**NO_REPLY mechanism (verified):**

- `NO_REPLY` is a magic text token in the agent's response
- Pipeline in `normalizeReplyPayload()` detects and drops it
- OC defaults: DMs = `"disallow"`, Groups = `"allow"`
- **WA Claw requires:** `agents.defaults.silentReply.direct: "allow"` (global) — all agents must be able to stay silent. This is the whole point of the "think IF to reply" logic.

---

### 3.1 SCHEDULED PATHS

#### Handler S1: Cron — three sub-types

**Cron jobs are gateway-managed state** — they're NOT in `openclaw.json`.
Managed via `openclaw cron` CLI:

```
openclaw cron add       # create
openclaw cron list      # read (v2 uses this)
openclaw cron edit      # modify
openclaw cron rm        # delete
openclaw cron runs      # run history
openclaw cron run       # debug: run now
```

**Two independent axes control what the cron agent sees
(proven in proof-01-cronVSheartbeat.md):**

```
  AXIS 1: lightContext — which bootstrap files are loaded?
  ┌───────────────────────────────────────────────────────────────────┐
  │ Cron  lightContext: true  │ ZERO bootstrap files loaded           │
  │ Cron  lightContext: false │ ALL bootstrap files loaded            │
  ├──────────────────────────────────────────────────────────────────┤
  │ HB    lightContext: true  │ Only HEARTBEAT.md loaded              │
  │ HB    lightContext: false │ ALL bootstrap files loaded            │
  └───────────────────────────────────────────────────────────────────┘

  Source: bootstrap-files.ts → applyContextModeFilter()
    - contextMode "lightweight" + runKind "cron/default" → empty []
    - contextMode "lightweight" + runKind "heartbeat"    → HEARTBEAT.md only

  AXIS 2: payload.kind — what session context does the agent get?
  ┌───────────────────────────────────────────────────────────────────┐
  │ agentTurn   │ Fresh turn — isolated or main session, but no     │
  │             │ prior conversation history injected automatically  │
  │ systemEvent │ Fires INTO the agent's existing session — agent   │
  │             │ has its full conversation history                  │
  └───────────────────────────────────────────────────────────────────┘
```

These two axes are independent. Combining them gives us three useful
cron flavors:

##### S1a: Stupid Cron (`agentTurn` + `lightContext: true`)

```
  ┌──────────┐   schedule   ┌────────────────┐           ┌──────────────┐
  │  Timer   │─────fires───▶│  Cron job      │──────────▶│  Agent gets: │
  └──────────┘              │                │           │              │
                            │ kind: agentTurn│  isolated │ ❌ no files   │
                            │ lightCtx: true │  session  │ ❌ no history │
                            │ no agentId     │           │ ✅ prompt     │
                            └───────┬────────┘           └──────┬───────┘
                                    │                           │
                              delivery.to               reply or NO_REPLY
                                    ▼                           ▼
                              ┌──────────┐             ┌──────────────┐
                              │ WhatsApp │◀────────────│ WA delivery  │
                              │ chat     │             └──────────────┘
                              └──────────┘
```

**Zero bootstrap files, no history.** The agent gets ONLY the cron's
`payload.message` — no SOUL.md, no MEMORY.md, no AGENTS.md, nothing.
Cheapest possible scheduled check. Good for simple "look at this chat
and reply if needed" prompts that don't need workspace context.

```jsonc
{
  "id": "wa-claw-check-alice",
  "name": "Check Alice (stupid)",
  // agentId OMITTED → uses default agent
  "enabled": true,
  "schedule": { "kind": "every", "everyMs": 1800000 },
  "sessionTarget": "isolated",
  "wakeMode": "now",
  "payload": {
    "kind": "agentTurn",
    "message": "[central WA prompt] Check chat since [datetime]...",
    "lightContext": true, // ZERO bootstrap files for cron
  },
  "delivery": {
    "mode": "announce",
    "channel": "whatsapp",
    "to": "+972501234567",
  },
}
```

##### S1b: Smart Cron (`agentTurn` + `lightContext: false`)

```
  ┌──────────┐   schedule   ┌────────────────┐           ┌──────────────┐
  │  Timer   │─────fires───▶│  Cron job      │──────────▶│  Agent gets: │
  └──────────┘              │                │           │              │
                            │ kind: agentTurn│  isolated │ ✅ ALL files  │
                            │ lightCtx: false│  session  │ ❌ no history │
                            │ no agentId     │           │ ✅ prompt     │
                            └───────┬────────┘           └──────┬───────┘
                                    │                           │
                              delivery.to               reply or NO_REPLY
                                    ▼                           ▼
                              ┌──────────┐             ┌──────────────┐
                              │ WhatsApp │◀────────────│ WA delivery  │
                              │ chat     │             └──────────────┘
                              └──────────┘
```

**All bootstrap files, no history.** Agent gets SOUL.md, MEMORY.md,
AGENTS.md, TOOLS.md, etc. — it knows who it is and what context it
operates in. But still runs in an isolated session (no conversation
history). More expensive per-tick than S1a.

Same config as S1a but with `"lightContext": false` (or omitted — false
is the default).

##### S1c: Agent Cron (`systemEvent` + `lightContext: false`)

```
  ┌──────────┐   schedule   ┌────────────────┐           ┌──────────────┐
  │  Timer   │─────fires───▶│  Cron job      │──────────▶│  Agent gets: │
  └──────────┘              │                │           │              │
                            │ kind:          │  agent's  │ ✅ ALL files  │
                            │  systemEvent   │  MAIN     │ ✅ FULL       │
                            │ lightCtx: false│  session  │    history   │
                            │ agentId: set   │           │ ✅ prompt     │
                            └───────┬────────┘           └──────┬───────┘
                                    │                           │
                              delivery.to               reply or NO_REPLY
                                    ▼                           ▼
                              ┌──────────┐             ┌──────────────┐
                              │ WhatsApp │◀────────────│ WA delivery  │
                              │ chat     │             └──────────────┘
                              └──────────┘
```

**All files + full conversation history.** The cron fires INTO the
agent's existing session using `payload.kind: "systemEvent"`. The agent
has all its accumulated context — past conversations, memory, everything.
This is a scheduled nudge to an already-running agent: "hey, check
WhatsApp."

```jsonc
{
  "id": "wa-claw-agent-alice",
  "name": "Nudge Alice's agent",
  "agentId": "thin-agent-alice", // explicit agent
  "enabled": true,
  "schedule": { "kind": "every", "everyMs": 3600000 },
  "sessionTarget": "main", // agent's main session
  "wakeMode": "now",
  "payload": {
    "kind": "systemEvent", // fires INTO existing session
    "text": "Check WhatsApp chat for new messages since last check.",
    "lightContext": false, // all bootstrap files
  },
  "delivery": {
    "mode": "announce",
    "channel": "whatsapp",
    "to": "+972501234567",
  },
}
```

**Schema note (verified against `src/gateway/protocol/schema/cron.ts`):**
`agentTurn` payloads use field `message`, `systemEvent` payloads use field
`text`. Different names — not interchangeable.

**N chats = N cron jobs**, each with its own `delivery.to`. Per-chat
independence is automatic across all three sub-types.

**Panel shows (all sub-types):** cron sub-type (stupid/smart/agent),
schedule (human-readable), agent (default or named), session target,
lightContext, payload kind + preview, last run + status (from
`cron runs`).

#### Handler S2: Heartbeat (tasks in HEARTBEAT.md)

```
  ┌──────────┐   heartbeat    ┌───────────┐   tasks:     ┌──────────┐
  │  Timer   │──────tick─────▶│  Agent    │──due check──▶│ HEARTBEAT│
  │ (every)  │                │ heartbeat │              │ .md file │
  └──────────┘                │ config    │              │          │
                              └─────┬─────┘              │ tasks:   │
                                    │                    │ - name:  │
                              target + to                │   inbox  │
                                    │                    │   interval│
                                    ▼                    │   prompt: │
                              ┌──────────┐              │ - name:  │
                              │ WhatsApp │              │   alice  │
                              │ delivery │              │   ...    │
                              └──────────┘              └──────────┘
```

**Ariel was right — heartbeat DOES support multiple tasks.** But the tasks live
in the **HEARTBEAT.md workspace file** (YAML `tasks:` block), NOT in
`openclaw.json`.

Two layers:

1. **`openclaw.json` → `agents.list[].heartbeat`** — scheduling config (one
   block per agent): `every`, `target`, `to`, `lightContext`, `isolatedSession`,
   `model`, `activeHours`, etc.
2. **`HEARTBEAT.md` → `tasks:` block** — the actual task list: each task has
   `{ name, interval, prompt }`. Only due tasks are injected into the heartbeat
   prompt for that tick.

```yaml
# HEARTBEAT.md example
Check my WhatsApp conversations for anything requiring attention.

tasks:
- name: check-alice
  interval: 30m
  prompt: "Review Alice's chat since last check. Reply if needed, NO_REPLY otherwise."
- name: check-bob
  interval: 1h
  prompt: "Check Bob's messages. Summarize if there are 3+ unread."
- name: daily-digest
  interval: 24h
  prompt: "Compile a daily summary of all WhatsApp activity."
```

**HeartbeatSchema (Zod, in openclaw.json) — single object per agent:**

```
every, activeHours, model, session, target, to, accountId,
prompt, lightContext, isolatedSession, skipWhenBusy, ...
```

**For multi-chat: use tasks in HEARTBEAT.md** — one agent, multiple task
prompts, each on its own interval. Much lighter than N agents.

**Panel shows:** heartbeat config (every, target, active hours), HEARTBEAT.md
task list preview (from file read), due status per task.

---

### 3.2 INSTANT PATHS (message-triggered)

#### Handler I1: Static Auto-Reply (WA Claw custom — Path A)

```
  ┌──────────┐               ┌──────────────┐             ┌──────────┐
  │ Inbound  │───upsert────▶│ openclaw-    │──reply────▶│ WhatsApp │
  │ message  │               │ whatsapp-    │  text       │ (same    │
  └──────────┘               │ claw.ts      │             │  chat)   │
                             │              │             └──────────┘
                             │ Checks       │
                             │ openclaw-    │
                             │ whatsapp-    │
                             │ claw.db      │
                             │ for JID      │
                             │              │
                             │ type: static │
                             │ text: "..."  │
                             └──────────────┘
```

**No AI. No session. No agent.** Fires a fixed reply string via
`openclaw message send` (or direct Baileys send if available).

**Config (in openclaw-whatsapp-claw.db, not openclaw.json):**

```sql
INSERT INTO wa_claw_handlers (jid, phone_e164, handler_type, config_json)
VALUES ('972501234567@s.whatsapp.net', '+972501234567', 'static', '{
  "text": "Thanks, I will get back to you.",
  "model": null
}');
```

**Model:** `null` — I1 doesn't use a model. Field present for schema
consistency (every handler row has the same config_json shape).

**This IS writable in v2** — the panel can create/edit/delete these handlers
because they live in our own DB, not OC config. Safe, no gateway restart.

#### Handler I2: Stateless Model Call (WA Claw custom — Path A)

```
  ┌──────────┐               ┌──────────────┐   stateless  ┌──────────┐
  │ Inbound  │───upsert────▶│ openclaw-    │───agent────▶│ Ollama   │
  │ message  │               │ whatsapp-    │   turn       │ / model  │
  └──────────┘               │ claw.ts      │  (w/tools)   │ provider │
                             │              │              └────┬─────┘
                             │ type:        │                   │
                             │  stateless   │              response
                             │ model: kimi  │              (+ tool calls)
                             │ prompt: ...  │                   │
                             └──────┬───────┘              ┌────▼─────┐
                                    │                      │ WhatsApp │
                                    │◀─────────────────────│ reply    │
                                    └──────────────────────└──────────┘
```

**Full agent turn** with: central WA prompt (§6) + user-configured prompt +
inbound message + tool definitions. No persistent session, no history, but
the model CAN call tools (escalate via message send, write to audit DB, etc.).

**How to make the model call:** Call Ollama's HTTP API directly (`POST /api/chat`
to `localhost:11434`) with tool definitions. Our code in
`openclaw-whatsapp-claw.ts` implements a tool-call loop: if the model returns
tool calls, execute them and feed results back until the model returns a final
text response. This is a mini-agent loop — stateless (no persistent session)
but capable (tools available).

**Config (in openclaw-whatsapp-claw.db):**

```sql
INSERT INTO wa_claw_handlers (jid, phone_e164, handler_type, config_json)
VALUES ('972501234567@s.whatsapp.net', '+972501234567', 'stateless', '{
  "model": "ollama/kimi-k2.6:cloud",
  "prompt": "You are Alice assistant. Be brief."
}');
```

**Model:** Explicit per-handler. If `null` or omitted, inherits from
the default handler's model (§5).

### Model inheritance (all handlers)

Every handler has a model field. Resolution order:

```
  1. Handler-specific model  (config_json.model on wa_claw_handlers row)
  2. Default handler model   (config_json.model on wa_claw_defaults row)
  3. OC agent default model  (agents.defaults.model.primary from OC config)
```

- **I1 (static):** `model: null` — no AI, field exists for schema consistency
- **I2 (stateless):** model used for the single API call. Falls back to default → OC
- **I3/I4 (OC agents):** model comes from OC config (`agents.list[].model` or
  `agents.defaults.model`). Panel displays it read-only from OC.
- **S1a-c (crons):** model comes from OC cron config or agent config. Read-only.
- **S2 (heartbeat):** model comes from OC heartbeat config or agent config. Read-only.

Panel shows model for ALL handlers. For OC-native handlers (I3, I4, S1, S2) it's
read-only from OC config. For custom handlers (I1, I2) and the default, it's
editable in v2.

#### Handler I3: Thin Agent (OC-native — Path B)

**How `systemPromptOverride` works (verified in source —
`system-prompt-override.ts`):**

```
  resolveSystemPromptOverride():
    1. Check per-agent systemPromptOverride → trimNonEmpty()
    2. Fall back to agents.defaults.systemPromptOverride
    3. Empty/whitespace string → returns undefined → full OC prompt used

  buildAttemptSystemPrompt():
    if systemPromptOverrideText exists:
      USE IT as base prompt (replaces ~15k-token OC core prompt)
      STILL APPEND: bootstrap files (SOUL.md, MEMORY.md, etc.)
      STILL APPEND: model identity, extra system context
    else:
      build full OC embedded system prompt
```

**Key facts:**

- `systemPromptOverride` replaces the OC core prompt — NOT the bootstrap files
- Bootstrap files (SOUL.md, MEMORY.md, AGENTS.md, etc.) always append
  (unless `skipBootstrap: true` globally, which we don't touch)
- Empty string `""` is trimmed to `undefined` → falls through to full OC prompt
- `skipBootstrap`, `contextInjection`, `silentReply` are global only — leave them

**The secret sauce — working WITH OC:**

Three-part trick to get an effectively empty agent that stays sharp:

```
  SETUP (one-time config):
  ┌──────────────────────────────────────────────────────────────────┐
  │  1. systemPromptOverride = minimal shell                         │
  │     "You are a WhatsApp responder assistant.                     │
  │      Follow your instructions strictly."                         │
  │     → replaces the ~15k-token OC core prompt with 1 line        │
  │                                                                  │
  │  2. Bootstrap files = MOSTLY EMPTY                               │
  │     SOUL.md, MEMORY.md, AGENTS.md, TOOLS.md → all empty files   │
  │     identity.md → COPY of wa-auto-prompt.md (§6) content         │
  │     → OC appends them: only identity.md has content              │
  │     → agent's system prompt = 1-line override + WA rules         │
  └──────────────────────────────────────────────────────────────────┘

  PER-MESSAGE (every inbound WhatsApp message):
  ┌──────────────────────────────────────────────────────────────────┐
  │  3. Prepend to every message:                                    │
  │     ┌────────────────────────────────────────┐                   │
  │     │  user's custom prompt for this chat    │  ← user intent   │
  │     │  + the actual WhatsApp message         │  ← inbound msg   │
  │     └────────────────────────────────────────┘                   │
  │                                                                  │
  │  WA rules already in identity.md (bootstrap file, loaded every   │
  │  turn). User prompt + message prepended per-message → no context │
  │  degeneration over long sessions.                                │
  └──────────────────────────────────────────────────────────────────┘
```

**Why this works:**

- `systemPromptOverride` kills the 15k OC core prompt → 1 line
- Empty bootstrap files (except identity.md) → OC's append is near-zero
- `identity.md` = copy of wa-auto-prompt.md → WA rules loaded as bootstrap
  file on every turn automatically by OC. No custom injection needed.
- User prompt prepended per-message → always fresh, never degrades as the
  session grows.
- Human owner can still connect via Control UI to talk to/orient the
  agent — the session is stateful, just the system prompt is minimal.

**Config structure:**

```jsonc
// agents.list[] (array entry)
{
  "id": "thin-agent-alice",
  "name": "Alice Handler",
  "model": { "primary": "ollama/kimi-k2.6:cloud" },
  "systemPromptOverride": "You are a WhatsApp responder assistant. Follow your instructions strictly."
}

// bindings[] (top-level array)
{
  "agentId": "thin-agent-alice",
  "match": {
    "channel": "whatsapp",
    "peer": { "kind": "direct", "id": "+972501234567" }
  },
  "session": { "dmScope": "per-peer" }
}
```

**Per-message injection** is handled by the cron/heartbeat payload
message (for scheduled paths) or by the binding's delivery pipeline
(for instant paths). For I3/I4 agents, wa-auto-prompt.md content lives in
`identity.md` (loaded as bootstrap every turn), so per-message only needs:
`[user prompt]\n[inbound WA message]`

For non-agent paths (I2, S1a-c, S2), the full composition is:
`[wa-auto-prompt.md]\n[user prompt]\n[inbound WA message]`

**agents.list is an ARRAY** (not keyed object). Each entry has an `id`
field. 12 agents currently exist on the VPS.

**Panel shows:** agent name, model, systemPromptOverride preview, bound
chat, session scope. The human can connect via Control UI to orient the
agent.

#### Handler I4: Full Agent (OC-native — Path B)

Same as I3 but WITHOUT `systemPromptOverride` — uses the full OC system
prompt (~15k tokens) + bootstrap files. The agent is a complete OC agent
with all capabilities (tools, workspace, files) that also handles WA.

The `systemPromptOverride` can optionally ADD WA-specific rules on top
of the full OC prompt — or leave it unset for a stock OC agent bound to
a WhatsApp chat.

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  I4 FULL AGENT — what the agent actually sees                    │
  │                                                                  │
  │  ┌─ Full OC core system prompt (~15k tokens) ────────────────┐  │
  │  │  The standard OpenClaw agent prompt with all capabilities  │  │
  │  │  + optionally: systemPromptOverride to add WA rules        │  │
  │  └────────────────────────────────────────────────────────────┘  │
  │                                                                  │
  │  ┌─ Bootstrap files (FULL content — unlike I3's empty files) ┐  │
  │  │  SOUL.md, MEMORY.md, AGENTS.md, TOOLS.md, IDENTITY.md     │  │
  │  └────────────────────────────────────────────────────────────┘  │
  │                                                                  │
  │  ┌─ Inbound message ─────────────────────────────────────────┐  │
  │  │  The WhatsApp message that triggered the agent             │  │
  │  └────────────────────────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Handler taxonomy summary (revised)

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                        HANDLER TAXONOMY                                 │
  ├──────┬───────────────────────┬───────────┬──────────────┬──────────────┤
  │  ID  │  Name                 │ Trigger   │ Path         │ v2 writable? │
  ├──────┼───────────────────────┼───────────┼──────────────┼──────────────┤
  │ S1a  │ Stupid Cron           │ Schedule  │ B (OC cron)  │ read-only    │
  │      │ (lightCtx, no files)  │           │              │              │
  │ S1b  │ Smart Cron            │ Schedule  │ B (OC cron)  │ read-only    │
  │      │ (full bootstrap)      │           │              │              │
  │ S1c  │ Agent Cron            │ Schedule  │ B (OC cron)  │ read-only    │
  │      │ (systemEvent+session) │           │              │              │
  │ S2   │ Heartbeat Tasks       │ Timer     │ B (OC agent) │ read-only    │
  │ I1   │ Static Reply          │ Message   │ A (custom)   │ ✅ YES       │
  │ I2   │ Stateless Call        │ Message   │ A (custom)   │ ✅ YES       │
  │ I3   │ Thin Agent            │ Message   │ B (OC bind)  │ read-only    │
  │ I4   │ Full Agent            │ Message   │ B (OC bind)  │ read-only    │
  └──────┴───────────────────────┴───────────┴──────────────┴──────────────┘
```

---

## 4. The custom instant handler (Path A)

### 4.0 Enums — `openclaw-whatsapp-claw.enums.ts`

All typed string constants live in one file, imported by `openclaw-whatsapp-claw.ts`
and by the panel server. Every DB column that stores a type/status string MUST use
one of these enums — no bare string literals.

```ts
// --- Handler type (which handler is configured for a chat) ---
// Used in: wa_claw_handlers.handler_type
export enum CustomHandlerType {
  Static = "static", // I1: fixed text reply
  Stateless = "stateless", // I2: single model call, no session
}

// Used in: wa_claw_defaults.handler_type (superset — includes OC-native types)
export enum DefaultHandlerType {
  None = "none", // no default behavior
  Static = "static", // I1
  Stateless = "stateless", // I2
  Cron = "cron", // S1a/S1b/S1c — v3: bash scripts auto-create cron jobs
  Heartbeat = "heartbeat", // S2 — v3: bash scripts auto-configure heartbeats
}

// --- Handler taxonomy ID (the 8 handler types in the system) ---
// Used in: panel UI, reverse-mapping result, Column 3 display
export enum HandlerTaxonomyId {
  S1a = "S1a", // Stupid Cron
  S1b = "S1b", // Smart Cron
  S1c = "S1c", // Agent Cron
  S2 = "S2", // Heartbeat Tasks
  I1 = "I1", // Static Reply
  I2 = "I2", // Stateless Call
  I3 = "I3", // Thin Agent
  I4 = "I4", // Full Agent
}

// --- Cron sub-type (classification of S1 crons) ---
// Used in: panel display, cron classification logic
export enum CronSubType {
  Stupid = "stupid", // S1a: agentTurn + lightContext:true
  Smart = "smart", // S1b: agentTurn + lightContext:false
  Agent = "agent", // S1c: systemEvent + lightContext:false
}

// --- Audit outcome (what happened when a message was processed) ---
// Used in: wa_claw_audit.outcome
export enum AuditOutcome {
  Replied = "replied", // model generated a reply, delivered to chat
  Silent = "silent", // model returned NO_REPLY, message dropped
  Escalated = "escalated", // model returned NO_REPLY + sent escalation to owner
  Error = "error", // handler failed (model timeout, send failure, etc.)
}

// --- Audit handler source (who processed the message) ---
// Used in: wa_claw_audit.handler (for custom handlers; OC agents use agentId string)
export enum AuditHandlerSource {
  Static = "static", // I1 custom handler
  Stateless = "stateless", // I2 custom handler
  // OC-native handlers use their agentId or cronId string directly
}
```

### 4.1 Design

```
  extensions/whatsapp/src/dev-mode/
  ├── wa-history.ts                       (v1 — DELETED in v2, merged below)
  ├── openclaw-whatsapp-claw.ts           (v2 — unified: logging + custom handlers)
  └── openclaw-whatsapp-claw.enums.ts     (v2 — all string enums, imported by .ts)

  activation in session.ts:
    if OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES=1:
      import("./dev-mode/openclaw-whatsapp-claw.js")
```

**Why one file?** Both wa-history.ts and the custom handler hook into the
same Baileys `messages.upsert` event and write to the same DB. Merging them
gives one event subscription, one DB connection, one activation point.

`openclaw-whatsapp-claw.ts` on every inbound message:

```
  ┌──────────────────────────────────────────────┐
  │  openclaw-whatsapp-claw: onMessage(msg)       │
  │                                              │
  │  1. Extract JID + normalize to E.164         │
  │  2. Log message to DB (v1 behavior)          │
  │     — includes phone_e164 on every row       │
  │  3. Query wa_claw_handlers for this JID      │
  │  4. If no handler → return (OC handles it)   │
  │  5. If handler found:                        │
  │     a. I1 (static): send fixed text reply    │
  │     b. I2 (stateless): call model API,       │
  │        send response                         │
  │  6. Log to wa_claw_audit (with phone_e164)   │
  │  7. Emit event for panel real-time updates   │
  └──────────────────────────────────────────────┘
```

### 4.2 Config storage: openclaw-whatsapp-claw.db

```sql
CREATE TABLE wa_claw_handlers (
  jid TEXT PRIMARY KEY,          -- E.164 phone or @g.us group JID
  phone_e164 TEXT,               -- E.164 phone (NULL for groups)
  handler_type TEXT NOT NULL,    -- CustomHandlerType enum
  config_json TEXT NOT NULL,     -- JSON: {text, model, prompt, ...}
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE wa_claw_last_run (
  session_key TEXT PRIMARY KEY,  -- agent session ID or cron ID
  jid TEXT NOT NULL,
  phone_e164 TEXT,               -- E.164 phone (NULL for groups)
  last_run_at TEXT NOT NULL,     -- ISO timestamp
  updated_at TEXT DEFAULT (datetime('now'))
);
```

Panel manages these tables directly (read AND write in v2 for I1/I2 handlers).

### 4.3 I2 agent turn implementation

I2 is a **mini-agent loop** — stateless (no persistent session) but with
tool support. The model gets the full wa-auto-prompt.md (§6) as system
prompt, which includes DB schema, available tools, escalation procedure,
and all paths.

```ts
// I2 agent turn — Ollama API with tool definitions
async function handleI2Turn(handler, inboundMessage, waAutoPrompt) {
  const messages = [
    { role: "system", content: waAutoPrompt + "\n" + handler.config.prompt },
    { role: "user", content: inboundMessage.text },
  ];
  const tools = getI2ToolDefinitions(); // message_send, db_audit_log, etc.

  // Tool-call loop: execute tool calls until final text response
  while (true) {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({
        model: handler.config.model.replace("ollama/", ""),
        messages,
        tools,
        stream: false,
      }),
    });
    const result = await response.json();

    if (!result.message.tool_calls?.length) {
      return result.message.content; // final text response
    }

    // Execute tool calls, append results, loop
    messages.push(result.message);
    for (const call of result.message.tool_calls) {
      const toolResult = await executeI2Tool(call);
      messages.push({ role: "tool", content: toolResult });
    }
  }
}
```

**Available tools for I2** (defined in `openclaw-whatsapp-claw.ts`):

- `message_send` — send WA message (for escalation to owner)
- `db_audit_log` — write to wa_claw_audit table
- `db_last_run_update` — update wa_claw_last_run table
- `db_query` — read from openclaw-whatsapp-claw.db (for owner_phone lookup)

These are OUR tools, not OC tools. Defined as Ollama tool schemas, executed
by our code. The wa-auto-prompt.md (§6) documents them fully.

### 4.4 Interaction with OC pipeline

**IMPORTANT:** The custom handler fires at the Baileys event level. OC's agent
pipeline also receives the same message via its own Baileys subscription. To
prevent double-reply:

- If I1/I2 handler fires → we need to prevent OC from also replying
- Options:
  1. Don't bind these chats in OC config → OC ignores them (default behavior
     for unbound chats without `allowFrom`)
  2. Add the JID to a "handled by WA Claw" skip-list that OC checks
  3. Accept double replies as a v2 limitation, fix in v3

Option 1 is simplest and safest. If a chat has no OC binding and is not in
`allowFrom`, OC won't auto-reply to it. The custom handler is the only
responder.

---

## 5. Defaults entry — default BEHAVIOR for all chats

### 5.1 What "Defaults" means (corrected)

**NOT `agents.defaults.*`.** The Defaults entry defines a DEFAULT HANDLER
BEHAVIOR that applies to ALL WhatsApp chats that don't have a specific handler.

Example: Ariel wants a cron that checks all 50 chats every hour. Rather than
creating 50 individual cron entries, the Defaults entry configures ONE behavior
(e.g., "Simple Cron, every 1h, isolated, lightContext") that applies to all
chats without a specific handler.

### 5.2 How it works

The Defaults config lives in `openclaw-whatsapp-claw.db`:

```sql
CREATE TABLE wa_claw_defaults (
  id INTEGER PRIMARY KEY CHECK (id = 1),  -- singleton row
  handler_type TEXT NOT NULL,              -- DefaultHandlerType enum
  config_json TEXT NOT NULL,               -- handler-specific config
  enabled INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT (datetime('now'))
);
```

**For v2 (read-only OC paths):** The Defaults entry ALSO shows the current
`agents.defaults` config from OC (model, tools, silence policy) since that's
what unbound chats effectively use.

**For I1/I2 (writable custom paths):** The Defaults entry can set a default
static reply or stateless handler for all chats. The `config_json.model`
field on the defaults row is the fallback model for all custom handlers
that don't specify their own (see "Model inheritance" in §3.2).

### 5.3 Panel display (Column 3 when Defaults is selected)

```
┌─────────────────────────────────────┐
│  ⚙️ Default Behavior               │
│  ─────────────────────────────────  │
│                                     │
│  ── WA Claw Default ────────────   │
│  Handler: Static Reply (I1)         │
│  Model: ollama/kimi-k2.6:cloud     │
│  Text: "Thanks, I'll get back to    │
│   you soon."                        │
│  [Edit]                             │
│                                     │
│  ── OC Agent Defaults ──────────   │
│  (applies to chats routed to OC)    │
│  Model: ollama/kimi-k2.6:cloud     │
│  Fallbacks: ollama/gemma4:31b-cloud│
│  Thinking: high                     │
│  Tools: messaging                   │
│  Silent reply (DM): disallow        │
│  Silent reply (Group): allow        │
│                                     │
│  [Refresh]                          │
└─────────────────────────────────────┘
```

---

## 6. Central prompt file — wa-auto-prompt.md

### Philosophy

**Overdoing it > being efficient.** This file is a comprehensive reference
document for any AI that handles WhatsApp messages. It includes EVERYTHING
the AI needs: rules, DB schema with full CREATE TABLE statements, DB file
path, available tools with parameter schemas, escalation procedure,
owner_phone lookup instructions, and response format.

We spend tokens freely. Normal OC agents sometimes forget their own tools —
our prompt prevents this by being an exhaustive, self-contained reference.

### Location

```
dev-mode/openclaw-whatsapp-claw/wa-auto-prompt.md
```

(One level above `app/` — shared across panel server, agent workspaces,
and cron templates. Not a web-app-only file.)

### Content (template — refined during implementation)

````markdown
# OpenClaw WhatsApp Auto-Response — Agent Reference

You are an OpenClaw WhatsApp auto-responder. This document is your complete
reference. It applies to EVERY response you generate.

---

## 1. Response Rules

### When to reply

- Reply ONLY if the message requires or merits a response.
- If you have nothing meaningful to add, respond with exactly: NO_REPLY
- NO_REPLY means true silence — the sender sees nothing.
- OC config `agents.defaults.silentReply.direct` must be `"allow"` for
  NO_REPLY to work in DMs.

### Response format

- EVERY message you send MUST start with exactly:
  `[OpenClaw Auto AI Generated Response:]`
  including the brackets. No exceptions.
- Be brief. WhatsApp messages should be short.
- Match the language of the sender.
- No greetings unless the sender greeted first.

### When to escalate

- If the message is urgent, sensitive, or beyond your capability:
  1. Respond with exactly: NO_REPLY (sender sees nothing)
  2. Look up the human owner's phone number: query `config_json` from
     the `wa_claw_handlers` table for this chat's JID. If not found,
     query `wa_claw_defaults` (id=1). The `owner_phone` field in
     `config_json` contains the E.164 phone number.
  3. Send a WhatsApp message to the owner explaining:
     - Who sent the original message (phone number + name if known)
     - What the message said
     - Why you are escalating
  4. Log the escalation to the audit table with outcome = "escalated"

---

## 2. Database Reference

### File path

`~/.openclaw/dev-mode/openclaw-whatsapp-claw.db` (SQLite)

### Tables

#### messages (WA message log)

```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  jid TEXT,
  phone_e164 TEXT,
  sender TEXT,
  timestamp INTEGER,
  message_text TEXT,
  raw_json TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```
````

#### chats (JID → name mapping)

```sql
CREATE TABLE chats (
  jid TEXT PRIMARY KEY,
  phone_e164 TEXT,
  name TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### wa_claw_handlers (custom handler config)

```sql
CREATE TABLE wa_claw_handlers (
  jid TEXT PRIMARY KEY,
  phone_e164 TEXT,
  handler_type TEXT NOT NULL,   -- 'static' | 'stateless'
  config_json TEXT NOT NULL,    -- JSON: {text, model, prompt, owner_phone, ...}
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### wa_claw_defaults (default behavior, singleton row)

```sql
CREATE TABLE wa_claw_defaults (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  handler_type TEXT NOT NULL,
  config_json TEXT NOT NULL,    -- JSON: {model, prompt, owner_phone, ...}
  enabled INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### wa_claw_last_run (last-run tracking)

```sql
CREATE TABLE wa_claw_last_run (
  session_key TEXT PRIMARY KEY,
  jid TEXT NOT NULL,
  phone_e164 TEXT,
  last_run_at TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### wa_claw_audit (audit log)

```sql
CREATE TABLE wa_claw_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jid TEXT,
  phone_e164 TEXT,
  message_id TEXT,
  ts TEXT DEFAULT (datetime('now')),
  handler TEXT,                 -- your agentId, cronId, 'static', or 'stateless'
  outcome TEXT,                 -- 'replied' | 'silent' | 'escalated' | 'error'
  reason TEXT,
  detail TEXT
);
```

### How to write to the database

- Use the `exec` or `shell` tool to run sqlite3 commands:
  `sqlite3 ~/.openclaw/dev-mode/openclaw-whatsapp-claw.db "INSERT INTO ..."`
- ALWAYS include `phone_e164` in every INSERT.
- For `phone_e164`: DM JIDs → strip `@s.whatsapp.net`, add `+` prefix.
  Group JIDs (`@g.us`) → NULL.

---

## 3. Audit Logging

After processing any message, log the outcome:

```sql
INSERT INTO wa_claw_audit (jid, phone_e164, message_id, handler, outcome, reason)
VALUES ('<jid>', '<phone>', '<msg_id>', '<your_handler_id>', '<outcome>', '<reason>');
```

Outcomes: `replied`, `silent`, `escalated`, `error`

Log EVERY interaction — even NO_REPLY (outcome = 'silent').

---

## 4. Last-Run Tracking

After processing, update your last-run timestamp:

```sql
INSERT OR REPLACE INTO wa_claw_last_run (session_key, jid, phone_e164, last_run_at, updated_at)
VALUES ('<your_session_id>', '<jid>', '<phone>', datetime('now'), datetime('now'));
```

---

## 5. Tools Available

### message_send (WhatsApp)

Send a WhatsApp message to any phone number. Used for:

- Escalation messages to the human owner
- Replies to other chats if instructed

Usage: `openclaw message send --channel whatsapp --to <phone_e164> --text "<message>"`

### Database access

Read/write to `openclaw-whatsapp-claw.db` via sqlite3 (see §2 above).

### owner_phone lookup

To find the human owner's phone number for escalation:

1. Query `wa_claw_handlers` for the current chat's JID → `config_json.owner_phone`
2. If not found, query `wa_claw_defaults` (id=1) → `config_json.owner_phone`

---

## 6. Handler Paths Reference

You may be operating as one of these handler types:

| ID  | Name           | How you were triggered                            |
| --- | -------------- | ------------------------------------------------- |
| I2  | Stateless Call | Inbound WA message → model call with tools        |
| I3  | Thin Agent     | Inbound WA message → OC agent (minimal prompt)    |
| I4  | Full Agent     | Inbound WA message → OC agent (full capabilities) |
| S1a | Stupid Cron    | Scheduled timer, no files, no history             |
| S1b | Smart Cron     | Scheduled timer, all bootstrap files, no history  |
| S1c | Agent Cron     | Scheduled timer, fires into your existing session |
| S2  | Heartbeat      | Heartbeat tick, task-driven                       |

Your specific handler type and chat JID should be provided in the message
context. If not, check your session configuration.

```

### How it reaches each handler

- **I1 (static):** N/A — no AI, code sends fixed text with
  `[OpenClaw Auto AI Generated Response:]` prefix
- **I2 (stateless agent turn):** Injected as system prompt by
  `openclaw-whatsapp-claw.ts`. Model gets tool definitions too.
- **S1a-c (crons):** Included in `payload.message` (agentTurn) or
  `payload.text` (systemEvent) template
- **S2 (heartbeat):** Included in HEARTBEAT.md task prompts
- **I3/I4 (OC agents):** Content COPIED into the agent's `IDENTITY.md`
  bootstrap file in the agent's workspace. Loaded on every turn
  automatically by OC. When wa-auto-prompt.md changes, IDENTITY.md must
  be re-synced.

**Why `IDENTITY.md` for agents?** OC agents can't read arbitrary files
from `dev-mode/`. But `IDENTITY.md` is one of 8 recognized bootstrap files
(verified in `src/agents/workspace.ts` → `VALID_BOOTSTRAP_NAMES`), loaded
on every turn including subagent turns. Copying wa-auto-prompt.md content
into IDENTITY.md ensures the agent always has the full reference.

---

## 7. Data model — single database: `openclaw-whatsapp-claw.db`

All WA Claw data lives in ONE SQLite file: `openclaw-whatsapp-claw.db`.
v2 renames the existing `wa-history.db` and adds new tables.

```

┌─────────────────────────────────────────────────────────────────┐
│ DATABASE EVOLUTION │
│ │
│ v1: wa-history.db │
│ ├── messages (WA message log) │
│ └── chats (JID → name mapping) │
│ │
│ v2: openclaw-whatsapp-claw.db (RENAMED + NEW TABLES) │
│ ├── messages (+ phone_e164 column) │
│ ├── chats (+ phone_e164 column) │
│ ├── wa_claw_handlers (I1/I2 custom handler config) │
│ ├── wa_claw_defaults (default behavior, singleton) │
│ ├── wa_claw_last_run (last-run tracking per session) │
│ └── wa_claw_audit (audit log, agent-initiated) │
└─────────────────────────────────────────────────────────────────┘

````

### 7.1 DB rename + migration

**Rename:** `wa-history.db` → `openclaw-whatsapp-claw.db`

**Source file rename:**
- `extensions/whatsapp/src/dev-mode/wa-history.ts` → `openclaw-whatsapp-claw.ts`
- `extensions/whatsapp/src/session.ts` — update import from `./dev-mode/wa-history.js` → `./dev-mode/openclaw-whatsapp-claw.js`

**DB name update in source:**
- `openclaw-whatsapp-claw.ts` — `DEFAULT_DB_PATH` string
- `dev-mode/openclaw-whatsapp-claw/app/src/config.mjs` line 16 — fallback path
- `dev-mode/openclaw-whatsapp-claw/app/src/wa-store.mjs` line 38 — error message
- 4 test files that assert the old default path

**VPS migration (during deploy):**
```bash
# 1. Stop gateway (prevents writes to old DB)
openclaw gateway stop

# 2. Rename the DB file
mv ~/.openclaw/dev-mode/wa-history.db ~/.openclaw/dev-mode/openclaw-whatsapp-claw.db

# 3. Update the DB viewer app at port 18081 to point to new filename

# 4. Deploy new code (git pull), restart gateway
openclaw gateway restart
````

### 7.2 New column: `phone_e164`

```sql
ALTER TABLE messages ADD COLUMN phone_e164 TEXT;
CREATE INDEX idx_messages_phone ON messages(phone_e164);

ALTER TABLE chats ADD COLUMN phone_e164 TEXT;
CREATE INDEX idx_chats_phone ON chats(phone_e164);
```

Populated by `openclaw-whatsapp-claw.ts` on message insert:

- For `@s.whatsapp.net` JIDs: strip suffix, add `+` prefix
- For `@lid` JIDs: extract `remoteJidAlt` from the Baileys message key
- For `@g.us` JIDs: NULL (groups don't have phone numbers)

Used by the reverse-mapping algorithm to match chats against OC bindings.

### 7.3 New tables (added to the single DB)

```sql
-- Custom instant handlers (I1, I2)
CREATE TABLE wa_claw_handlers (
  jid TEXT PRIMARY KEY,
  phone_e164 TEXT,               -- E.164 phone (NULL for groups)
  handler_type TEXT NOT NULL,     -- CustomHandlerType enum
  config_json TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Default behavior (singleton)
CREATE TABLE wa_claw_defaults (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  handler_type TEXT NOT NULL,     -- DefaultHandlerType enum
  config_json TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Last-run tracking (agents and crons self-report)
CREATE TABLE wa_claw_last_run (
  session_key TEXT PRIMARY KEY,
  jid TEXT NOT NULL,
  phone_e164 TEXT,               -- E.164 phone (NULL for groups)
  last_run_at TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Audit log (agent-initiated logging, optional)
CREATE TABLE wa_claw_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jid TEXT,
  phone_e164 TEXT,               -- E.164 phone (NULL for groups)
  message_id TEXT,
  ts TEXT DEFAULT (datetime('now')),
  handler TEXT,                   -- AuditHandlerSource enum or agentId/cronId string
  outcome TEXT,                   -- AuditOutcome enum
  reason TEXT,
  detail TEXT
);
```

All new tables are created via `CREATE TABLE IF NOT EXISTS` — safe to run
on a renamed DB that already has `messages` and `chats`.

---

## 8. Reverse-mapping: config → handler type

### 8.1 Algorithm

```
  For a given WhatsApp JID:

  ┌──────────────────────────────┐
  │ 1. Normalize JID to E.164    │
  │    (using phone_e164 column  │
  │    or remoteJidAlt)          │
  └─────────────┬────────────────┘
                │
  ┌─────────────▼────────────────┐     ┌──────────────┐
  │ 2. Check openclaw-whatsapp-  │────▶│ I1 (static)  │
  │    claw.db wa_claw_handlers  │     │ I2 (stateless)│
  │    table for this JID        │     └──────────────┘
  └─────────────┬────────────────┘
                │ not found
  ┌─────────────▼────────────────┐     ┌──────────────┐
  │ 3. Check OC bindings[]       │────▶│ I3 (thin) or │
  │    for channel=whatsapp +    │     │ I4 (full)    │
  │    peer.id matching E.164    │     └──────────────┘
  └─────────────┬────────────────┘
                │ not found
  ┌─────────────▼────────────────┐     ┌──────────────┐
  │ 4. Check cron jobs           │────▶│ S1a (stupid) │
  │    (openclaw cron list)      │     │ S1b (smart)  │
  │    for delivery.to matching  │     │ S1c (agent)  │
  │                              │     └──────────────┘
  └─────────────┬────────────────┘
                │ not found
  ┌─────────────▼────────────────┐     ┌──────────────┐
  │ 5. Check agents with         │────▶│ S2 (heartbeat│
  │    heartbeat.to matching     │     │    tasks)    │
  └─────────────┬────────────────┘     └──────────────┘
                │ not found
  ┌─────────────▼────────────────┐     ┌──────────────┐
  │ 6. Check wa_claw_defaults    │────▶│ Default      │
  │    for default behavior      │     │ behavior     │
  └─────────────┬────────────────┘     └──────────────┘
                │ none configured
                ▼
        "No handler — OC defaults"
```

### 8.2 Multiple handlers

A chat CAN have multiple handlers (e.g., a binding for instant replies AND a
cron for periodic checks). The panel shows ALL matching handlers in sections.

### 8.3 Channel-wide bindings

A binding without `peer` matches ALL chats on that channel. Panel shows
"Channel-wide binding: [agent]" for chats matched this way.

---

## 9. Column 3 UI design

### 9.1 Read-only mode (app global variable)

```js
// In app.js — global state
const state = {
  // ... existing state
  editMode: false, // default: read-only
};
```

UI defaults to read-only. An "Edit" button toggles `editMode = true`. In v2,
edit mode only enables I1/I2 handler editing (openclaw-whatsapp-claw.db). OC config editing
is disabled until v3.

### 9.2 Layout

```
┌─────────────────────────────────────┐
│  OC Settings: Alice (+972501234567) │
│  ─────────────────────────────────  │
│  [Edit] [Refresh]                   │
│                                     │
│  ── Instant Handler ────────────   │
│  Type: Static Reply (I1)            │
│  Model: (none — static)             │
│  Text: "Thanks, I'll reply later."  │
│  Source: WA Claw (custom handler)    │
│                                     │
│  ── OC Binding ─────────────────   │
│  Agent: thin-agent-alice            │
│  Model: ollama/kimi-k2.6:cloud     │
│  System prompt: "You are Alice's..."│
│  Session: per-peer                  │
│  Source: OC config (read-only)      │
│                                     │
│  ── Scheduled ──────────────────   │
│  Cron: "Check Alice" every 30m      │
│    Agent: default                   │
│    Session: isolated                │
│    Status: ok, last: 5m ago         │
│  Source: OC cron (read-only)        │
│                                     │
│  ── Audit (3) ──────────────────   │
│  2026-05-20 14:30 replied "..."     │
│  2026-05-20 13:00 silent (NO_REPLY) │
│  2026-05-20 12:15 escalated→owner   │
│                                     │
└─────────────────────────────────────┘
```

### 9.3 States

- **Loading:** spinner while CLI commands execute
- **Error:** banner with error message, Columns 1-2 unaffected
- **No handler:** "No specific handler. Uses OC defaults." + link to Defaults
- **Handler found:** full detail view (all matching handlers in sections)
- **Edit mode (I1/I2 only):** inline editor for custom handlers

### 9.4 Tutorial page

A "Tutorial" button in the panel nav opens a dedicated page. Two sections:

**Top section — Handler paths flow charts**

Simple ASCII-style or HTML flow charts showing all handler paths at a glance.
One chart per handler type:

```
┌──────────────────────────────────────────────────────────┐
│  Handler Paths                                           │
│                                                          │
│  ── Instant Handlers ──────────────────────────────────  │
│                                                          │
│  I1 (Static Reply)                                       │
│  Message in → DB lookup → static text → send reply       │
│                                                          │
│  I2 (Stateless AI)                                       │
│  Message in → DB lookup → Ollama agent turn (with tools) │
│  → reply / NO_REPLY / escalate+NO_REPLY                  │
│                                                          │
│  I3 (OC Thin Agent)                                      │
│  Message in → OC binding → thin agent (IDENTITY.md only) │
│  → reply / NO_REPLY                                      │
│                                                          │
│  I4 (OC Full Agent)                                      │
│  Message in → OC binding → full agent (all bootstrap)    │
│  → reply / NO_REPLY                                      │
│                                                          │
│  ── Scheduled Handlers ────────────────────────────────  │
│                                                          │
│  S1a (Stupid Cron)                                       │
│  Timer → lightContext:true → isolated → zero files       │
│                                                          │
│  S1b (Smart Cron)                                        │
│  Timer → lightContext:false → isolated → full bootstrap   │
│                                                          │
│  S1c (Agent Cron)                                        │
│  Timer → systemEvent → full agent session + history      │
│                                                          │
│  S2 (Heartbeat)                                          │
│  Heartbeat timer → HEARTBEAT.md tasks → agent session    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Bottom section — Static prompt (read-only)**

Renders the full content of `wa-auto-prompt.md` as read-only formatted text.
**Must read the original file at runtime** — the server serves it via a
dedicated endpoint (`GET /api/tutorial/prompt`), the frontend fetches and
renders it. No hardcoded copy. If the file changes, the tutorial page
reflects it on next load.

```
┌──────────────────────────────────────────────────────────┐
│  AI Static Prompt (wa-auto-prompt.md) — read only        │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  # WhatsApp Claw — AI Agent Instructions                 │
│  ...                                                     │
│  (full rendered content of wa-auto-prompt.md)             │
│  ...                                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 10. API endpoints

### Existing (v1):

```
GET /api/chats          → openclaw-whatsapp-claw.db chat list
GET /api/messages?jid=  → openclaw-whatsapp-claw.db messages
GET /api/audit?jid=     → wa_claw_audit entries
```

### New (v2):

```
GET  /api/oc/defaults          → OC agents.defaults + wa_claw_defaults
GET  /api/oc/handler/:jid      → reverse-mapping result for JID
GET  /api/oc/agents            → OC agents.list (from openclaw config get)
GET  /api/oc/crons             → OC cron jobs (from openclaw cron list --json)
GET  /api/oc/raw               → full OC config snapshot (debug)

GET  /api/claw/handler/:jid    → custom handler for JID
POST /api/claw/handler/:jid    → create/update I1 or I2 handler (v2 writable!)
DELETE /api/claw/handler/:jid  → remove custom handler

GET  /api/claw/defaults        → wa_claw_defaults row
POST /api/claw/defaults        → set default behavior

GET  /api/claw/last-run/:key   → last run timestamp for session key

GET  /api/tutorial/prompt      → raw content of wa-auto-prompt.md (read from disk)
```

---

## 11. Terminal command catalog (v3 reference)

### Cron management (fully featured CLI):

```bash
openclaw cron add --name "Check Alice" ...     # create
openclaw cron list --json                      # read
openclaw cron edit <id> --payload-message "..." # modify
openclaw cron rm <id>                          # delete
openclaw cron enable <id> / disable <id>       # toggle
openclaw cron run <id>                         # debug run
openclaw cron runs <id>                        # run history
```

### Agent + binding management:

```bash
# agents.list is an ARRAY — config set for arrays needs research
# bindings is also an ARRAY — same issue
# v3 will likely need jq/python3 for array mutations
openclaw config get agents.list                # read
openclaw config get bindings                   # read
openclaw gateway restart                       # apply changes
```

---

## 12. Task breakdown

### Phase 0: Data model + infrastructure

| Task | File                                                                                             | Description                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T0m  | `wa-history.ts` → `openclaw-whatsapp-claw.ts`, `session.ts`, `config.mjs`, `wa-store.mjs`, tests | Rename file `wa-history.ts` → `openclaw-whatsapp-claw.ts`, rename DB `wa-history.db` → `openclaw-whatsapp-claw.db` in all source + tests, update `session.ts` import          |
| T0e  | `openclaw-whatsapp-claw.enums.ts`                                                                | Create enums file with all typed string constants: `CustomHandlerType`, `DefaultHandlerType`, `HandlerTaxonomyId`, `CronSubType`, `AuditOutcome`, `AuditHandlerSource` (§4.0) |
| T0a  | `openclaw-whatsapp-claw.ts`                                                                      | Add `phone_e164` column to ALL tables (messages, handlers, last_run, audit) + populate on every INSERT                                                                        |
| T0b  | `wa-store.mjs`                                                                                   | Add new tables (handlers, defaults, last_run, audit) to `openclaw-whatsapp-claw.db` via `CREATE TABLE IF NOT EXISTS` (§7.3)                                                   |
| T0c  | `wa-auto-prompt.md`                                                                              | Create central WA prompt file at `dev-mode/openclaw-whatsapp-claw/wa-auto-prompt.md` (§6)                                                                                     |
| T0f  | `openclaw-whatsapp-claw.ts`                                                                      | Add `phone_e164` to existing `chats` table: `ALTER TABLE chats ADD COLUMN phone_e164 TEXT` + populate from JID on upsert (§7.2)                                               |
| T0g  | `wa-auto-prompt.md`                                                                              | IDENTITY.md template generation: code in `openclaw-whatsapp-claw.ts` that copies wa-auto-prompt.md content into IDENTITY.md for I3 thin agents (§6)                           |
| T0d  | `public/app.js`                                                                                  | Add `state.editMode` global variable (default false)                                                                                                                          |

### Phase 1: Custom instant handler (Path A — writable in v2)

| Task | File                                   | Description                                                                                                                                                          |
| ---- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1a  | `openclaw-whatsapp-claw.ts`            | Add I1 (static reply) handler logic after message logging                                                                                                            |
| T1b  | `openclaw-whatsapp-claw.ts`            | Add I2 (full agent turn) — Ollama `/api/chat` with tool definitions + tool-call loop (§4.3). Tools: `message_send`, `db_audit_log`, `db_last_run_update`, `db_query` |
| T1b2 | `openclaw-whatsapp-claw.ts`            | I2 tool implementations: `getI2ToolDefinitions()` + `executeI2Tool()` — WA message send, SQLite audit/last-run writes, DB query for owner_phone                      |
| T1c  | `test/openclaw-whatsapp-claw.test.mjs` | Tests for I1 and I2 handlers (including I2 tool-call loop)                                                                                                           |

### Phase 2: Server-side OC config reader (Path B — read-only)

| Task | File                      | Description                                                                                                                       |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| T2a  | `src/oc-config.mjs`       | `ocConfigGet(path)` + `ocCronList()` wrappers with 30s cache. Cron JSON parsing must match verified schema (§3.1 verified fields) |
| T2b  | `src/oc-config.mjs`       | `getHandlerForJid(jid)` — reverse-mapping algorithm (§8.1)                                                                        |
| T2c  | `src/oc-config.mjs`       | JID normalization (E.164 from phone_e164 column)                                                                                  |
| T2d  | `src/oc-config.mjs`       | `getDefaults()` — OC defaults + wa_claw_defaults                                                                                  |
| T2e  | `test/oc-config.test.mjs` | Tests with mock config data                                                                                                       |

### Phase 3: API routes

| Task | File                   | Description                                                                                      |
| ---- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| T3a  | `src/server.mjs`       | OC read endpoints: `/api/oc/defaults`, `/api/oc/handler/:jid`, `/api/oc/agents`, `/api/oc/crons` |
| T3b  | `src/server.mjs`       | WA Claw write endpoints: `/api/claw/handler/:jid` (GET/POST/DELETE), `/api/claw/defaults`        |
| T3c  | `test/server.test.mjs` | Tests for all new endpoints                                                                      |

### Phase 4: Frontend — Column 3

| Task | File               | Description                                            |
| ---- | ------------------ | ------------------------------------------------------ |
| T4a  | `public/app.js`    | `fetchOcSettings(jid)` — call reverse-mapping endpoint |
| T4b  | `public/app.js`    | `renderOcSettings(data)` — handler detail cards        |
| T4c  | `public/app.js`    | Edit mode toggle + I1/I2 inline editor                 |
| T4d  | `public/app.js`    | Loading/error/no-handler states                        |
| T4e  | `public/app.js`    | Refresh button                                         |
| T4f  | `public/style.css` | Column 3 styling                                       |

### Phase 5: Frontend — Defaults entry

| Task | File            | Description                                          |
| ---- | --------------- | ---------------------------------------------------- |
| T5a  | `public/app.js` | `fetchDefaults()` + `renderDefaults()`               |
| T5b  | `public/app.js` | Default behavior editor (I1/I2 type, writable in v2) |

### Phase 6: Audit display

| Task | File            | Description                                             |
| ---- | --------------- | ------------------------------------------------------- |
| T6a  | `public/app.js` | Render wa_claw_audit entries in Column 3 bottom section |

### Phase 6b: Tutorial page

| Task | File               | Description                                                                                                                    |
| ---- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| T6b1 | `src/server.mjs`   | `GET /api/tutorial/prompt` — reads `wa-auto-prompt.md` from disk, returns raw content                                          |
| T6b2 | `public/app.js`    | Tutorial page: nav button, handler path flow charts (all 8 types), fetch + render wa-auto-prompt.md read-only at bottom (§9.4) |
| T6b3 | `public/style.css` | Tutorial page styling: flow chart cards, read-only prompt display                                                              |

### Phase 7: Build + deploy

| Task | File   | Description                                                                                            |
| ---- | ------ | ------------------------------------------------------------------------------------------------------ |
| T7a  | build  | `pnpm build` (openclaw-whatsapp-claw.ts compiles into WA extension dist)                               |
| T7b  | VPS    | Rename DB file: `mv ~/.openclaw/dev-mode/wa-history.db ~/.openclaw/dev-mode/openclaw-whatsapp-claw.db` |
| T7c  | VPS    | Update DB viewer app at port 18081 to point to `openclaw-whatsapp-claw.db`                             |
| T7d  | deploy | Push, pull on VPS, restart gateway, verify Column 3 shows real config                                  |
| T7e  | verify | Test I1 handler: set static reply for a test chat, send message, confirm reply                         |

---

## 13. Verified facts (VPS research, V2026.5.12)

| Fact                | Verified value                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `agents.list`       | **Array** of objects with `id` field (12 agents on VPS)                                      |
| `openclaw cron` CLI | **Fully featured**: add, list, edit, rm, enable, disable, run, runs, show, status            |
| Cron storage        | **Gateway-managed state**, NOT in `openclaw.json`. Config only has `cron.sessionRetention`   |
| Current crons       | **11 cron jobs** exist, some with WhatsApp delivery                                          |
| Current bindings    | **11 RouteBindings**, all Discord (no WhatsApp bindings yet)                                 |
| `silentReply`       | **Not configured** (using schema defaults)                                                   |
| `skipBootstrap`     | Exists in `AgentDefaultsSchema` — **global only, NOT per-agent**                             |
| `contextInjection`  | Exists in `AgentDefaultsSchema` — **global only, NOT per-agent**                             |
| Heartbeat tasks     | **In HEARTBEAT.md** (YAML `tasks:` block), not in JSON config                                |
| HeartbeatSchema     | Single `.strict()` object — `every`, `target`, `to`, `lightContext`, `isolatedSession`, etc. |
