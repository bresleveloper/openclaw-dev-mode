# WhatsApp Claw — Column 3 Grilling Questions (Q01)

- **Status:** Questions for Ariel before planning v1.5 / v2
- **Date:** 2026-05-20
- **Input doc:** `plan-v1-OC-settings.md`

---

## Decision: Ship read-only v1.5 before full v2 writes?

### Context — where we are today

Column 3 ("OC Settings") in the WhatsApp Claw panel is currently a placeholder.
It shows four static fields (JID, type, message count, and the text
"configuration arrives in v2") plus an always-empty Audit list. This is by
design — **v1 is a standalone read-only panel** that reads `wa-history.db`
directly via SQLite. It has zero connection to the OpenClaw gateway and knows
nothing about OpenClaw's configuration.

The end goal (v2, per `design-concept.md` §10–§12) is to turn Column 3 into a
**live config editor**: pick a handler type for a chat, assign an agent, edit
the system prompt, toggle tools — and have WA Claw write those changes to
`openclaw.json` via the gateway's config RPC. That's the full vision.

### What v1.5 would be

An **intermediate step** between "Column 3 is empty" (today) and "Column 3 can
read AND write config" (v2). In v1.5, Column 3 would:

- **Connect to the gateway** over loopback (`127.0.0.1:18789`) using the
  existing gateway token for auth
- **Read** the current config via `config.get`
- **Display** the selected chat's current settings read-only: which agent
  handles it, what system prompt it uses, what tool profile is active, what
  session scoping is set, etc.
- **Write nothing.** No Save button, no config mutations, no gateway restarts.

### Why this matters — the risk argument

The v2 write path is dangerous. Every `config.patch` call triggers a gateway
reload, which can corrupt the WhatsApp Signal Protocol session (see CLAUDE.md
"Gateway Restart Can Break WhatsApp"). A malformed write can also brick the
gateway entirely — OpenClaw uses Zod `.strict()` validation, so any unexpected
key rejects the whole config file and the gateway crashes in a loop.

v1.5 forces us to solve three hard problems **before we touch the write path**:

1. **Gateway RPC connection + auth** — prove that WA Claw can actually talk to
   the gateway and authenticate. If this fails, the entire v2 design needs
   rethinking.
2. **Handler reverse-mapping** — a chat's "handler" is not stored as one field.
   It's inferred from `bindings` (peer → agent), `agents.list`, `cron` jobs,
   and heartbeat config. The read path must reconstruct the handler concept from
   these scattered config structures. Getting this logic wrong in a read-only
   view shows wrong labels. Getting it wrong in a write view **corrupts the
   config**.
3. **Error handling and degradation** — what happens when the gateway is down,
   restarting, or unreachable? v1.5 proves the "gateway unavailable" banner
   works and that Columns 1–2 (WA history browsing) stay functional.

If v1.5's read-only view is wrong, the worst case is displaying incorrect
labels. If v2's write path is wrong, the worst case is a bricked gateway and a
dead WhatsApp connection.

**Recommendation: Yes, ship v1.5 first.** It's mandatory homework, not optional
polish.

USER ANSWER: i agree. to the contrary, every settings we are planning to allow to edit we must prepare a simple terminal commands codes, no arbitrary agent to just edit, they r wrong all the time. so YES, v2 will be read-only for now. (i dont wanna do 1.5, just integers)

---

## Questions

### Q1 — RPC protocol

What protocol does the gateway expose for config operations — HTTP REST on `:18789`, or the Control UI's WebSocket channel? This shapes the entire `oc-config-client`:

- **HTTP**: simple request/response, stateless, easy for a Node server to call
- **WebSocket**: persistent connection, more complex, but gets push updates when config changes externally

Which one does `config.get` / `config.patch` actually use?

USER ANSWER: terminal commands. simplest, safest, most documented

### Q2 — Handler reverse-mapping: the hard part

The doc says a chat's handler is "inferred from bindings, agents, cron, and heartbeat." This is where the real complexity lives. Before coding, we need a concrete lookup table:

For each of the 6 handler types from design-concept.md §4, what exact config keys determine membership?

Specific sub-questions:

- **Full agent vs Isolated agent** — what distinguishes them in config? Is it `dmScope` on the agent? A session scoping field?
- **Muted** — what does "muted" look like in `openclaw.json`? A binding to a no-op agent? A deny rule? `visibleReplies: false`? Something else?
- **Cron vs Heartbeat** — both are scheduled. What structurally separates them in config?
- **Ambiguous configs** — if someone configured a chat manually with settings that don't cleanly map to any of the 6 types, what does the panel show? A "Custom" label? An error? This edge case defines whether the abstraction holds.

USER ANSWER START:
let me start describing:

IMPORTANT - its YOUR JOB to make sure i am right about these settings and read source code to verify they are right and that is all that needed (or maybe i over did it)

general rules:

1. the pre-prompt (like system prompt) must be to remind the model that this is a wa chat that need to think IF to reply. or escelate if user select it.
2. model/agent return (if decides) response. system need to do nothing/use NO-REPLY for silence or use message tool to whatsapp
3. agents and crons need somewhere to save last run/query time.

from simplest to largest:

part 1 - the schedules paths:

1. just cron. that cron is not even connected to any agent, meaning that it should just operate under main agent. the cron settings (OC settings for crons) sessionTarget.isolated, payload.kind="agentTurn", payload.lightContext=true, that way the cron is basically a simple agent turn prompt to look at the chat since datetime X, see 0 or N messages, decide on answer based on the prompt. IMPORTANT FOR THIS ONE unless user explicitly said so, if user select same cron to N chats, the cron needs to run independentlty per chat.
2. HEARTBEAT - simpley append to the agent's heartbeat (read docs, heartbeat can accept list of tasks, in our case list of chats and prompts per chat) and have the settings:

- lightContext true/false
- isolatedSession true/false
- select session (IF user select true+true then maybe he wants to keep talking to the session after each run to polish the agent, so WA, discord, ect)
  that basically covers 3 paths for heartbeat

3. cron to agent - if payload.kind="agentTurn" thats basically running the full agent session periodically.

part 1 - the instants paths:

1. dry automated anwer - simplest ever, every message reply with "........", not ai, just simple code
2. stateless answer - just use api to model provider with some minimal systemPrompt as in general rules, the user prompt, and the message.
3. stateful answer thin agent (not sure how to define it) - there is a way now to define an agent with a systemPrompt override, meaning instead of the agent getting 15k tokens of the OC systemPrompt and the files, its just start a session, act as an agent with stateful session, but besically empty. that means some good things:

- every message will accumilate
- must remind with every message the user prompt and general rules
- user can connect with some channel to that session and talk to it to polish and think

4. full on agent - basically just like "normal" agent binding to channel+peer, with every message the user prompt and general rules so its reminded to shut up unless there is a reason to talk (or is reminded for auto answer instead of NO_REPLY ect.)

think about it , you may push back, we dont need it fast, we need it excelent

USER ANSWER END.

### Q3 — Config write restarts the gateway (and may drop WhatsApp)

Every `config.patch` triggers a gateway reload. Per CLAUDE.md, this can corrupt the WhatsApp Signal Protocol session — "Bad MAC" errors, messages queuing for 5-10 min.

For a tool that manages WhatsApp chat handlers, triggering WA disconnects on save is terrible UX. The plan says "batch edits" but doesn't define what that means in the UI.

**Proposed answer:** Explicit **Save** button with a confirmation warning ("Saving will restart the gateway and may briefly disconnect WhatsApp"). No auto-save, no save-on-blur, no debounce. The user must consciously choose to apply.

Is this the right call, or is there a way to patch config without a full gateway restart?

USER ANSWER: idk, this is kinda the limitation. we will just currenlty after "save" accumilate the list of terminal commands for settings and always end with "openclaw gateway restart"

### Q4 — Concurrency with the Control UI

If Ariel (or the OC agent itself) edits config via the Control UI dashboard while WA Claw has a stale cached read — what happens on the next WA Claw write?

At minimum: re-read config immediately before every write and warn if it changed since the panel's last read. But should WA Claw also poll for external changes, or is a "Refresh" button enough?

USER ANSWER: currenlty we just expect that when user is setting his response agents he doesnt uses his ui or other.

### Q5 — Defaults editor scope

The Defaults entry is mentioned but what exactly does it edit?

- `agents.defaults.*` (model, system prompt, tools, reasoning)?
- Global tool policies (`tools.allow` / `tools.deny`)?
- WhatsApp-specific defaults (`channels.whatsapp.*`)?

The Defaults editor is potentially the most dangerous part — it affects every chat, not just one. Needs explicit scoping before implementation.

USER ANSWER START:
you miss-understand me. just like in Q2, the default means a definition for auto whatsapp response for all chats, contacts and groups.

so say i have 50 chats, for 2 i set a cron, another 2 i set an agent. for the other 46 i want another agent or heartbeat.

basically in the end the bindings section of the settings will be

```
  "bindings": [
    {
      "agentId": "agent-A",
      "match": {
        "channel": "whatsapp",
        "peer": { "kind": "direct", "id": "+972542634114" }
      }
    },
    {
      "agentId": "agent-B",
      "match": {
        "channel": "whatsapp",
        "peer": { "kind": "direct", "id": "+972525550040" }
      }
    },
```

thats for full agents, crons/heartbeat wont have that.

USER ANSWER END.

### Q6 — Auth verification

Insight #1 assumes the gateway accepts `Authorization: Bearer <OPENCLAW_GATEWAY_TOKEN>` on the config RPC over loopback. Has this been tested?

**Action item:** One curl on the VPS to confirm before planning around it:

```
curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" http://127.0.0.1:18789/api/config
```

If this returns 401, the entire v2 auth model needs rethinking.

USER ANSWER: yes the panel works great

### Q7 — Available agents discovery

The handler editor needs an agent picker. How does the panel discover available agents?

- `config.get` the `agents.list` section?
- A dedicated RPC endpoint?
- Hardcoded list?

The answer affects whether the picker shows only configured agents or also "create new agent" flow.

USER ANSWER: `agents.list` or matching terminal command

### Q8 — Multi-select bulk assign timing

The doc mentions assigning one handler to many chats at once. Should this land in v1.5 (read-only, so just a multi-select view), v2 (with writes), or v3? It adds significant UI complexity — worth deferring if it's not a daily need.

USER ANSWER: yes. we will manually try to create a "default" and some active agents, so 1.5 (which is actually v2 cuz i want only full integers as versions) should already have everything in readonly mode. come to think of it we should handle later a readonly mode for browsing.

### Q9 — Audit table

`wa_claw_audit` already exists (empty). Should v1.5 show it read-only (even if empty, to prove the UI), or leave it hidden until v3 when handlers actually write audit rows? Showing an empty audit section is arguably worse than hiding it.

USER ANSWER: show

---

## Recommended next steps (in order)

1. **Verify auth** (Q6) — one curl on the VPS, 30 seconds
2. **Document the handler-to-config mapping table** (Q2) — the 6 types x which config keys define each
3. **Plan v1.5** — read-only Column 3: handler type, agent name, system prompt excerpt, tool profile
4. **v2 after v1.5 is proven** — write path with explicit Save + restart warning

USER ANSWER: read this document, reason and think, create `plan-v2.md` and then `plan-v2-q01.md` for more grilling questions. as far as i am concerned i dont care it to be 5mb size of plan file, i really prefer everything covered for v2 (your v1.5)
