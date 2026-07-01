# WhatsApp Claw — v2 Plan Grilling Questions (Q01)

- **Status:** Questions for Ariel before implementing v2
- **Date:** 2026-05-20
- **Input doc:** `plan-v2.md`

---

## Pushbacks (things I think you got wrong)

### P1 — Heartbeat is NOT a list of tasks

You said: "heartbeat can accept list of tasks, in our case list of chats and
prompts per chat."

**The source code says otherwise.** `HeartbeatSchema` in
`src/config/zod-schema.agent-runtime.ts` is a single `z.object({...})` — one
heartbeat per agent. One prompt, one target, one schedule.

To do heartbeats for 5 different chats with 5 different prompts, you'd need 5
separate agents in `agents.list`, each with its own `heartbeat` block. That's
heavyweight.

**My recommendation (in the plan):** Use **cron jobs** for multi-chat scheduling
instead. Crons are lightweight (share the default agent), support per-chat
delivery, and have all the same controls (lightContext, isolated session, model
override). Heartbeats make sense only for the ONE agent that needs a recurring
self-check on its own session.

**Do you agree to use crons instead of heartbeats for multi-chat scheduling?**

USER ANSWER: read this `https://docs.openclaw.ai/gateway/heartbeat#tasks-blocks` MUHAHA (i am right baby)

### P2 — Handler I1 (dry automated answer) doesn't exist in OC

You described: "simplest ever, every message reply with a fixed string, no AI."

OpenClaw has no mechanism for static replies without AI. Every inbound message
goes through an agent. The closest approximation is an agent with
`systemPromptOverride: "Always reply with exactly: [text]"` — but that's a full
LLM call for a static string.

A true static auto-reply would need custom code in the WA Claw panel itself
(intercept message, send canned reply via `openclaw message send`, skip agent).
That's a v3+ feature.

**For v2 (read-only): I've deferred I1 entirely. Agree?**

USER ANSWER: lets start with the fact that NOT every message goes through an agent, only messages with correct bindings and allowed lists in settings. and yes, we need to patch something for that. MUST not touch the wa plugin. we need to think do we want to create another event emitter at the same spot we log all messages to the db? or someplace else. and actulaly this is the only item i DO want to implement in v2, as its super easy to play with. we need our own option to emit events. hell, maybe we really just need to make our own bindings ect meaning every message we log we also have it emmited at same place in the code, just to have an option? we still prefer to use OC default options when it comes to agents, crons, and heartbeats, but for instant message i like this option. ponder alot and think of something smart.

### P3 — Handler I2 (stateless answer) doesn't exist in OC

You described: "just use api to model provider with minimal systemPrompt, no
session."

OC doesn't support truly stateless responses. All agent turns have a session.
The closest: thin agent (I3) with `skipBootstrap: true` +
`contextInjection: "never"` — minimal context, but still session-based.

**I've merged I2 into I3 as a configuration variant. Agree?**

USER ANSWER: that goes with your P2, if we have our own path escape, we can use current used model just like as OC uses it for crons, it finds the model/provider and send stateless request, we do the same, we find the code that create stateless request and we use it.

### P4 — `sessionTarget` is a flat string, not an object

You wrote `sessionTarget.isolated`. The actual schema is
`sessionTarget: "isolated"` (a plain string). Other values: `"main"`,
`"current"`, `"session:<key>"`.

Not a design issue — just a syntax correction for your mental model.

USER ANSWER: part of your job is to audit all syntax for all my suggestions and fix them according to actual source code

---

## Questions

### Q1 — `skipBootstrap` vs `contextInjection`

`systemPromptOverride` replaces the core OC prompt but **still appends context
files** (AGENTS.md, SOUL.md, etc.). To suppress those too, the source code
shows two separate mechanisms:

- `skipBootstrap: true` — skips bootstrap file injection
- `contextInjection: "never"` or `"continuation-skip"` — skips context injection

Are both needed for a truly "thin" agent? Or is one sufficient? I need to verify
the exact behavior, but I want your input: for a thin WA handler, do you want
ZERO context files (pure system prompt override), or is some bootstrap OK?

USER ANSWER: i want ZERO context files (pure system prompt override). the only important thing here, well generally, we want the human owner to talk to the agents and orient them, otherwise there is no point of having an agent.

### Q2 — `agents.list` structure

Is `agents.list` a **keyed object** (like `agents.list.myAgent = {...}`) or an
**array** (like `agents.list = [{id: "myAgent", ...}]`)? This affects how the
panel reads and (in v3) writes agent configs.

The config get output and the binding's `agentId` reference suggest it's keyed
by agent ID, but I want to confirm. This determines whether
`openclaw config set agents.list.thin-alice.model.primary "..."` works.

USER ANSWER: anything that is query/read and not changing anything i encourage you to actually connect to the vps and research and learn. write this rule at top of the claude.md and have yourself a /dev-mode/claude-learnings.md with all your tests and results for forever reference, only important thing is always write the current OC version as things change

### Q3 — Cron management CLI

Does `openclaw cron list` exist as a CLI command? Or do cron jobs live in
`openclaw.json` under a `cron` key readable via `openclaw config get cron`?

This matters because:

- If `openclaw cron list/create/delete` exists → use it for both read (v2) and
  write (v3)
- If crons are in config → use `openclaw config get cron` for read, and the
  array mutation problem (§8 of plan) applies for write

USER ANSWER: same as Q2

### Q4 — Where does the "WA Claw pre-prompt" live?

General rule 1 says: "the pre-prompt must remind the model this is a WA chat —
think IF to reply."

Where does this text live?

- **In the agent's `systemPromptOverride`** — means every handler agent needs it
  manually set
- **In a shared file** (like `AGENTS.md` or a new `WA-RULES.md`) in the
  workspace — automatically appended by bootstrap
- **In the panel's cron `payload.message`** — prepended by WA Claw when
  creating cron jobs

Option B (shared file) is cleanest — write it once, all agents pick it up via
bootstrap. But thin agents with `skipBootstrap: true` would miss it.

What's your preference?

USER ANSWER: our folder `openclaw-whatsapp-claw`, perhaps eventually in `app` subfolder, should have this managed so we can update that over time. its should be a prompt detailing all our rules like this is a wa-auto-answering-agentic-workflow-bla-bla and the NO_REPLY rules and all that, as we need the same prompt to be sent with all paths. so 1 central place for that. and we'll see how to inject them in v3.

### Q5 — "Last run/query time" for crons and agents

General rule 3 says: "agents and crons need somewhere to save last run/query
time."

- **Crons**: OC tracks `updatedAtMs` and run history natively. The panel can
  display this.
- **Agents**: OC does NOT track "last query time" per chat. The session has
  message history, but no explicit "last active" timestamp.

For agents, the panel can infer last activity from `wa-history.db` (last message
timestamp for the JID). Is that sufficient, or do you need something more
explicit?

USER ANSWER: bad idea. i think Q4 prompt should teach the agent to query his own session id as key column to another db table that will hold last query time. the query time must be independent for the wa db, otherwise we lose things.

### Q6 — JID matching for `@lid` contacts

Bindings and cron delivery use E.164 phone numbers (e.g. `+972501234567`).
`wa-history.db` stores messages under `@lid` JIDs (e.g. `231370005725382@lid`)
which don't contain the phone number directly.

To match a `@lid` JID to a binding, the panel needs to:

1. Parse `raw_json` from a message for that JID
2. Extract `remoteJidAlt` (the `@s.whatsapp.net` phone number)
3. Convert to E.164 format
4. Match against binding `peer.id`

This works but adds a DB query per `@lid` JID. Is this acceptable, or should
we maintain a JID→phone mapping table?

USER ANSWER: we must create a new column in the wa-db for E.164 phone numbers to make it easy for make matches and indices

### Q7 — Defaults scope (confirming your answer)

You clarified: "Defaults" means the default WhatsApp auto-response for ALL
chats without a specific handler. Not `agents.defaults.*` globally.

But `agents.defaults` IS the config path — it defines the model, tools, silence
policy, etc. for the default agent that handles unbound chats.

So the Defaults entry shows `agents.defaults.*` — but framed as "this is what
happens to chats without a specific handler." Correct?

USER ANSWER: you have it wrong. forget about `agents.defaults.*`. i just want default BEHAVIOR for all chats. from scratch: we build a system where every chat can be binded to some behavior (cron, agent, ect), but what if i want 1 behavior for all my WA? say a cron? its not acceptable to force me go to each and every chat in the panel! i have a default tab (already exists) that open the column3, and i can set the behavior to allllll chats.

### Q8 — Audit table: what columns to show?

The `wa_claw_audit` table exists but is empty. When we render it in Column 3,
what columns should the UI expect? The current schema from `wa-store.mjs` is:

```sql
CREATE TABLE IF NOT EXISTS wa_claw_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  action TEXT,
  details TEXT
)
```

Is this the final schema, or will v3 change it? Should the UI render all 4
columns (id, timestamp, action, details), or just timestamp + action + details?

```
wa_claw_audit(
  id, jid, message_id, ts,
  handler,   -- agentId / cronId
  outcome,   -- replied | silent | logged | escalated
  reason, detail
)
```

USER ANSWER: this table is for log level, to have history about chats ourcomes. its optional, the agent should reason if he wants to log here something. that should be included in the initial prompt file mentioned in Q4

### Q9 — Testing without a VPS

The `openclaw config get` calls require the `openclaw` CLI to be installed. On
your Windows dev machine, OpenClaw is NOT installed. How should we test?

Options:

- **Mock `ocConfigGet`** in tests with sample config data (already planned in
  T7/T13)
- **Stub the CLI** with a script that returns fixture JSON
- **Test only on VPS** after deploy

I'm planning mock-based tests. Is that sufficient, or do you want a CLI stub
too?

USER ANSWER: same as Q2. also your working folder is the source code.

### Q10 — Read-only browsing mode (your Q8 answer)

You mentioned: "come to think of it we should handle later a readonly mode for
browsing."

What did you mean? The entire v2 IS read-only. Did you mean a mode where the
panel doesn't even read OC config — pure wa-history.db browsing with no Column 3
settings at all? Like a "light mode" for when the gateway is down?

USER ANSWER: i mean default when user browse to the panel is readonly and he actually needs to press an "edit" button to be able to edit stuff. so yes v2 is all readonly but make it an app global variable,

---

## Verification needed before implementation

These are things I need to confirm in the source code (will do via Sonnet
agents during implementation):

1. Does `skipBootstrap` exist as a config key on `agents.list[]`? (Need to
   check schema)
2. Does `contextInjection` exist as a config key on `agents.list[]`? (Need to
   check schema)
3. Does `openclaw cron list` CLI command exist?
4. Is `agents.list` keyed by ID or an array?
5. Can `openclaw config get cron` read cron jobs from config?
6. What is the exact `silentReply` default for the main agent?

USER ANSWER: same as Q2. also your working folder is the source code.

dont create a new file, update `plan-v2.md`, also add more flow charts to it so i can have easier time to read it.
