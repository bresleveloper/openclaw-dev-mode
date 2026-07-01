# OpenClaw WhatsApp Claw — Design Concept

- **Status:** Draft — for review
- **Date:** 2026-05-17
- **Feature dir:** `dev-mode/openclaw-whatsapp-claw/`
- **Origin:** brainstorming session (Ariel + Claude)

---

## 1. Summary

`openclaw-whatsapp-claw` ("WA Claw") is a **standalone web panel** for assigning
OpenClaw behavior to individual WhatsApp chats and groups. It turns a single
WhatsApp number into a fully managed comms surface — every chat can be handled
by an OC agent, a scheduled cron, a heartbeat, a shared default, or left alone —
configured through a WhatsApp-Web-style UI instead of hand-editing
`openclaw.json` and wrestling with the terminal.

WA Claw is a **configuration surface, not a new runtime.** It invents no handler
engine and no parallel config tree. Message handling stays 100% native
OpenClaw. The only genuinely new artifacts are the panel itself and one small
audit table.

## 2. Motivation

For an SMB, WhatsApp is usually a single number for both private and business
contact. Running a native OC agent on it has one structural friction: every
inbound message becomes an agent turn that is _expected to reply_. That makes OC
unusable as a general WhatsApp handler — you cannot have an agent that simply,
intelligently, stays quiet.

The fix is small: a turn that can **complete without sending anything** while
still building context. OpenClaw already supports this — the native `NO_REPLY`
reply token. WA Claw exposes it — plus the rest of OC's routing — through a
usable panel.

Target outcome: one OC instance can responsibly cover **100%** of a number's
WhatsApp traffic — replying where it should, staying silent where it should,
escalating where a human is needed — always identifying itself
("Ariel's Agent: …").

## 3. Goals / Non-goals

**Goals**

- Per-chat — and bulk, and default — assignment of OC behavior via UI.
- Selective reply: an agent that decides, per message, whether to reply, stay
  silent, log, or escalate.
- Reuse native OC primitives end to end (agents, bindings, sessions, crons,
  heartbeats, tools, permissions).
- Preserve full agent capability — a chat-bound agent can run any multi-step
  task, not just answer.

**Non-goals**

- No change to OC's Control UI. It stays separate and untouched; the Control UI
  and WA Claw run as independent services, side by side.
- No new runtime, handler engine, or config schema.
- No fork of OC's WhatsApp auto-reply pipeline — WA Claw _configures_ it.
- Multi-WhatsApp-account management — single account assumed for v1.

## 4. Handler model

Every WhatsApp chat (identified by JID) is assigned exactly one handler. Six
types, each mapping to native OC primitives:

| Handler            | Trigger                         | Session / context                                             | Route binding                               |
| ------------------ | ------------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **Default**        | inherits the configured default | —                                                             | —                                           |
| **Muted**          | never runs                      | —                                                             | allowlist exclusion (overrides any default) |
| **Full agent**     | per inbound message             | persistent session; context depth is a setting (full ↔ light) | bound (peer → agentId)                      |
| **Isolated agent** | per inbound message             | fresh session per run, cleaned afterward                      | bound                                       |
| **Cron**           | scheduled — every X             | per run, reads "since last time"                              | none                                        |
| **Heartbeat**      | agent heartbeat schedule        | per run, reads "since last time"                              | **none — deliberately unbound**             |

### 4.1 Full agent vs Isolated agent

Both run a complete native OC turn (§5); they differ in session lifetime.

- **Full agent** — one persistent session (per chat, or shared — see §4.5).
  Context accumulates across turns, silent turns included. Context _depth_ is a
  knob, not a separate type: a tightly bounded context window is "light
  context", an unbounded one is "full context". The panel exposes the native
  context settings.
- **Isolated agent** — each trigger spins a fresh full session, runs the turn,
  then **discards** it. No conversation carry-over between messages. Built on
  OC's native isolated-agent executor `runCronIsolatedAgentTurn`
  (`src/cron/isolated-agent/run.ts`), which already does per-run session-key
  isolation; OC's session reaper sweeps spent sessions, so cleanup never blocks
  a live turn. (`runHeartbeatOnce` is _not_ used here — see §4.3.)

  **Isolation is of the session, not the workspace.** The run resolves the
  agent's real `agentDir` / workspace and executes through `runEmbeddedPiAgent`
  — the same embedded runner as a normal turn. Each run is a first turn, so the
  bootstrap `.md` files (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, `IDENTITY.md`,
  `USER.md`, `MEMORY.md`) and skills load every time, exactly like a fresh
  normal session — `contextInjection: "continuation-skip"` does not suppress
  them (an isolated run is never a continuation). `MEMORY.md` written in one run
  is visible to the next: it is a workspace file, not session state. Only the
  raw conversation transcript is discarded. An Isolated agent is therefore a
  _full_ agent with durable memory that simply starts each message
  conversationally clean.

### 4.2 Cron handler

In the panel the user attaches a chat (or group) to a cron. The cron fires every
X; its prompt is parameterized — _"read the content of chat Z since last time
and do …"_. A per-chat **watermark** ("last time") is stored in the wa db.

By default, **assigning N chats to a cron duplicates the cron N times** — one
job per chat, each scoped to its own chat and watermark. The user may instead
opt into **aggregate mode**: one cron reads several chats together and decides
across them.

### 4.3 Heartbeat handler

The user attaches a chat to an agent as a heartbeat (not immediate). Crucially,
**the agent gets no route binding** — inbound messages never trigger turns, so
no needless token spend. The heartbeat prompt reads _"chat Z since last time and
do …"_ against the same watermark mechanism.

Unlike crons, a heartbeat is **not duplicated**: OC heartbeat config accepts
**multiple tasks**, so one heartbeat carries N tasks — one per chat — kept
correctly separated. On schedule it executes through OC's native
`runHeartbeatOnce` (`src/infra/heartbeat-runner.ts`) — the heartbeat handler's
primitive, distinct from the isolated-agent executor used in §4.1.

### 4.4 Native cron / heartbeat settings are exposed

The panel surfaces the native OC cron and heartbeat options — context settings,
target, schedule, model, and so on — rather than hiding them. WA Claw configures
native OC; it never wraps or narrows it.

### 4.5 Assignment & sessions

Assignment is free-form: N chats → 1 agent, 1:1, N → M, or N → M plus a default.
Sessions are independent of agent identity — 30 chats on one agent definition
can each carry their own session (30 sessions, one agent / one set of files) via
the binding's `dmScope`. WA Claw's core job is translating these UI assignments
into native `agents` / `bindings` / `cron` / heartbeat mutations, and reading
them back.

A chat with no assignment and no applicable default is **inert** — just a
WhatsApp chat, no OC behavior.

## 5. Agent turns are full native OC turns

**Critical.** The Full-agent and Isolated-agent handlers are _not_ one-shot
"reply-or-not" classifiers. Each is a **complete native OpenClaw agent turn** — the full agentic loop: tool
calls, multiple steps, subagents, until the task or intent is satisfied —
identical to talking to a native OC-WhatsApp agent today.

A chat can therefore be a casual FAQ responder _or_ an operational command line.
Sending _"there's a bug in X — run the tests, fix it, open a PR"_ to a chat
bound to a coding agent runs the entire task to completion and then reports
back. WA Claw constrains none of this.

Staying silent (next section) is a decision the _completed_ turn makes — it
never truncates the agent's work. "No reply" is an outcome, not an early exit.

## 6. Selective reply — the native `NO_REPLY` token

OpenClaw already has a purpose-built silence mechanism; WA Claw uses it as-is.

**The `NO_REPLY` token.** `src/auto-reply/tokens.ts` defines
`SILENT_REPLY_TOKEN = "NO_REPLY"`. An agent stays silent by emitting exactly
`NO_REPLY` as its reply. Handling is robust — whitespace-tolerant, a
`{"action":"NO_REPLY"}` JSON-envelope form, leading/trailing token stripping,
streaming-fragment safety. The WhatsApp dispatcher already honors it:
`inbound-dispatch.ts` skips delivery on the "silent token", no error.

So selective reply is pure prompt: the agent's `systemPromptOverride` says
_"reply normally; if you should stay silent — not mom, not on-topic — reply with
exactly `NO_REPLY`."_ The turn still runs fully and builds context; nothing is
delivered.

**The policy gotcha — DMs disallow silence by default.**
`src/shared/silent-reply-policy.ts` gates the token by conversation type:

- `DEFAULT_SILENT_REPLY_POLICY` = `direct: "disallow"`, `group: "allow"`,
  `internal: "allow"`.
- `DEFAULT_SILENT_REPLY_REWRITE` = `direct: true`, `group: false`.

→ Out of the box, a **DM** agent that emits `NO_REPLY` does **not** go silent —
the reply is _rewritten_ into a canned filler line ("Nothing to add right now.",
"Standing by.", …). Groups already allow true silence.

WA Claw must therefore set, for any DM chat that should genuinely stay quiet,
the native config keys `agents.defaults.silentReply.direct = "allow"` and
`agents.defaults.silentReplyRewrite.direct = false` (also settable per agent).
The panel exposes this as a per-chat "allow true silence" toggle.

**`message_tool_only` is a separate, optional delivery mode** — useful when the
agent's narration should stay private and only explicit `message`-tool calls are
delivered. It is orthogonal to `NO_REPLY` and not required for selective reply.

Net new OpenClaw runtime code for selective reply: **none** — native `NO_REPLY`
token plus native `silentReply` config.

Net new OpenClaw runtime code for this capability: **none.** It is configuration
plus prompt.

## 7. Outcomes & escalation

A handler turn ends in one of four outcomes, all driven by the agent's prompt:

- **Replied** — the agent produced a reply; delivered and recorded normally in
  `wa-history`.
- **Silent** — the agent emitted `NO_REPLY` (§6); the turn completed, nothing
  delivered. Optionally writes an audit row (§9) if the prompt instructs it.
- **Logged** — turn completed; the agent records something noteworthy to the
  audit table. OC session files already capture the turn itself.
- **Escalated** — the agent sends a WhatsApp message to the **owner's number**
  (using its normal send/message tool) and writes an `escalated` audit row.
  No new escalation machinery — it is an ordinary outbound message plus an audit
  record.

All inbound messages are recorded in `wa-history` regardless of outcome.

## 8. Data flow

**Inbound message — Agent handler**

1. WhatsApp message → Baileys → native OC auto-reply pipeline.
2. Route binding resolves the chat's agent.
3. Agent runs the **full turn loop** — could be a one-line reply or a long
   multi-step task.
4. Delivery per `visibleReplies` + the agent's choice: auto-reply, explicit
   `message`-tool reply, or silence. Context persists either way.
5. `wa-history` logs inbound + any outbound; the agent may write an audit row.

**Inbound message — Cron / Heartbeat handler**

Fires on schedule via native OC cron / heartbeat → periodic or batched agent
action on the chat → same delivery and audit rules as above.

**Configure a chat**

Col-3 edit → `panel-backend` → `claw-model` computes a config diff →
`oc-config-client` → gateway `config.patch` → OC validates + hot-reloads.

**Display a chat**

`panel-backend` → `wa-store` → Col 1 (chats) + Col 2 (messages).

## 9. Audit table

One minimal table added to `wa-history.db`:

```
wa_claw_audit(
  id, jid, message_id, ts,
  handler,   -- agentId / cronId
  outcome,   -- replied | silent | logged | escalated
  reason, detail
)
```

The **agent** writes it — given the table schema in its prompt and using its
existing tools, the same way agents already read the wa db. The panel reads it
for a "what was skipped / logged / escalated" view. Deliberately simple — not
over-planned. The DDL ships alongside the existing `wa-history.ts` schema
(see §13).

## 10. Components

| Unit               | Responsibility                                                                                          | Depends on               |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------ |
| `wa-store`         | Read-only access over `wa-history.db` (chats, messages); owns the audit-table DDL                       | SQLite file              |
| `oc-config-client` | Wraps the gateway config RPC (`config.get/patch/apply`, `schema.lookup`); loopback auth / pairing token | OC gateway               |
| `claw-model`       | The brain — translates panel concepts ⇄ native OC config mutations                                      | `oc-config-client`       |
| `panel-backend`    | HTTP service: serves the SPA, exposes the panel API, wires the above                                    | `wa-store`, `claw-model` |
| `panel-frontend`   | The 3-column SPA                                                                                        | `panel-backend`          |

`claw-model` is the highest-value, most-tested unit: the correctness of the
assignment → config-diff mapping is the whole feature.

## 11. Panel ↔ OC integration (Approach A)

The panel reaches OC two ways:

- **Config (read/write):** the gateway's existing config RPC — the same
  `config.get` / `config.patch` / `config.apply` the Control UI uses. Changes
  pass through OC's real validation and hot-reload; no manual restarts, no
  re-implemented schema logic, no restart-induced WhatsApp Signal-session
  hazard. The panel authenticates to the loopback gateway with a device /
  pairing token.
- **Chats & messages (read):** direct read-only SQLite open of `wa-history.db`.

The panel is the only config writer-via-RPC; the gateway serializes config
writes (V2026.5.12's centralized serialize+retry).

## 12. UI layout (WhatsApp-Web style)

Three columns:

- **Col 1 — chats + search.** From `wa-store`. Each row shows a handler badge:
  Agent / Cron / Heartbeat / Default / Muted.
- **Col 2 — conversation content.** Selected chat's message history, from
  `wa-store`.
- **Col 3 — OC settings for the selected chat.** Handler type; agent picker;
  prompt editor (`systemPromptOverride`); tools; session scoping (`dmScope`);
  reply prefix (`responsePrefix`); `visibleReplies` toggle. Plus a **Defaults**
  editor and **multi-select** to assign one handler to many chats at once.

## 13. Repo location, code placement & build

- **Docs:** `dev-mode/openclaw-whatsapp-claw/docs/`.
- **Panel code:** `dev-mode/openclaw-whatsapp-claw/app/` — a standalone app with
  its own `package.json` and build, run as its own service on its own port.
  It sits outside the main tsdown build (which already ignores `dev-mode/`).
- **Integration touchpoints follow the `wa-history.ts` pattern:** the
  implementation file lives under `dev-mode/`, and main OC code carries only a
  thin call-site. Example: the `wa_claw_audit` table DDL is added next to the
  existing `wa-history.ts` schema and created on the same Baileys-attach path.
  This keeps all fork code in one folder for upkeep while still being used by
  main code.
- The Control UI and WA Claw run as independent services; neither depends on the
  other.

## 14. Error handling

- Gateway unreachable / auth fails → banner; config editing disabled, but wa-db
  browsing still works.
- Gateway rejects a config write → surfaced inline in Col 3; nothing partially
  applied.
- `wa-history.db` missing / locked → graceful (WAL mode, read-only open).
- Concurrency: the panel is the only RPC config writer; the gateway serializes
  config writes.
- Never crash on a malformed chat / message row.

## 15. Testing

- `wa-store` — unit tests against a temp SQLite db.
- `oc-config-client` — against a mock gateway RPC.
- `claw-model` — unit tests on the assignment → config-diff mapping (the core).
- `panel-backend` — integration test with a temp db + mock gateway.
- `panel-frontend` — light component tests; layout verified manually.

## 16. Suggested build order

1. `wa-store` + audit table + read-only panel (Cols 1 & 2 browsing).
2. `oc-config-client` + `claw-model` + Col-3 assignment for the **Full-agent**
   handler.
3. **Cron** and **Heartbeat** handlers; **Defaults** + bulk multi-select; the
   audit / escalation view.

## 17. Decisions log

| Decision                | Choice                                                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New runtime / platform? | No — reuse native OC (agents, bindings, sessions, crons, heartbeats, tools).                                                                                                             |
| "No reply" mechanism    | Native `NO_REPLY` token + `silentReply` policy (DM silence needs `silentReply.direct = allow`). Zero new OC runtime code.                                                                |
| Agent handler scope     | Full native OC agent turn loop — multi-step, any task.                                                                                                                                   |
| Panel ↔ OC config       | Approach A — gateway config RPC (validation + hot-reload).                                                                                                                               |
| Panel hosting           | Standalone web app, separate from the Control UI.                                                                                                                                        |
| Outcome signalling      | Agent prompt + existing tools; no new outcome tools.                                                                                                                                     |
| Escalation              | Agent sends WhatsApp to owner number + writes an audit row.                                                                                                                              |
| Audit table             | One table in `wa-history.db`; agent reads/writes via prompt-supplied schema.                                                                                                             |
| Code placement          | Code in `dev-mode/openclaw-whatsapp-claw/app/`; integration via the `wa-history.ts` pattern.                                                                                             |
| Handler primitives      | Isolated agent → native `runCronIsolatedAgentTurn` (`src/cron/isolated-agent/`); Heartbeat → native `runHeartbeatOnce`; Full agent → native binding-routed turn; Cron → native cron job. |

## 18. Open assumptions

- Single WhatsApp account.
- The panel runs on the same host as the gateway (loopback RPC).
- Agents can read / write the wa db with their existing tools.
- A chat with no assignment and no applicable default is inert.
