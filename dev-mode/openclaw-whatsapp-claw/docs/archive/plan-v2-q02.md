# WhatsApp Claw — v2 Plan Grilling Round 2

**Date:** 2026-05-21
**Auditor:** Claude (full re-read of plan-v2.md after 6-issue fix batch)
**Method:** Section-by-section audit for design gaps, inconsistencies, stale
references, and open questions requiring Ariel's input.

---

## CRITICAL — Design gaps that block implementation

### Q02-01: I2 escalation is impossible as written

**Section:** §6 (central prompt) + §3.2 (I2 handler)

The central prompt tells the model:

> "Use the message tool to send a WhatsApp message to the human owner"

But I2 is a **stateless model call** — single `POST /api/chat` to Ollama.
There are NO tools. The model can only return text. It cannot "use the
message tool."

**Options:**

1. I2 escalation uses a special response marker (e.g., model returns
   `ESCALATE: [reason]` instead of `NO_REPLY`). Our code in
   `openclaw-whatsapp-claw.ts` detects the marker, sends the WA message
   to the owner, and logs the escalation.
2. I2 doesn't support escalation — only `replied` / `silent` / `error`.
   Escalation is agent-only (I3/I4/S1c).
3. Add an `EscalateMarker` to the enums and handle it in code.

**Same issue for S1a (stupid cron):** lightContext:true + agentTurn =
zero files, isolated session. Does the agent even have the message tool?
Depends on tool profile. S1b has the same question.

**Ariel:** Which option? And should S1a/S1b support escalation?

USER ANSWER: for S1a (stupid cron) its ok, basic is basic. but I2 is still a full agent turn, so we need to have for that one extra prompt md with all the instuctions, explaining its an openclaw stateless agent, its tools, schema db, ect. its ok that the prompt gets big, so he can do a full turn like escelate, decide to use message tool, ect. you know what? the normal agents sometimes forget their own tools, so just make out main static prompt fully full with all tools , paths, and db schema and location.

---

### Q02-02: OC agents can't write to our DB

**Section:** §6 (audit logging + last-run tracking instructions)

The central prompt tells agents:

> "log it to the audit table"
> "update your last-run timestamp in the tracking table"

But I3/I4 agents are OC-native. They don't have direct SQLite access to
`openclaw-whatsapp-claw.db`. They don't have a tool for it. They can't
`import` our code.

**Options:**

1. **Our code tracks it** — `openclaw-whatsapp-claw.ts` sees every
   inbound message AND every outbound reply (via Baileys events). It can
   log audit + last-run for ALL handler types automatically, without
   relying on the agent to self-report. This is more reliable anyway.
2. Provide a custom OC tool that agents can call (complex, probably v3).
3. Agent writes to audit via `exec` tool running SQL (hacky, fragile).

Option 1 seems right — our code is the observer, it should do the tracking.
If so, remove the "Audit logging" and "Last-run tracking" sections from
wa-auto-prompt.md entirely (agents don't need these instructions).

**Ariel:** Option 1? If yes, the central prompt gets simpler.

USER ANSWER: like Q02-01, our static prompt must include everything, db schema and path, tools, everything. we are openclaw people, we love spending tokens

---

### Q02-03: Per-message injection for I3/I4 — how?

**Section:** §3.2 (I3 secret sauce, per-message injection)

The plan says we prepend `[user prompt]\n[inbound WA message]` to every
message for I3/I4 agents. But I3/I4 are OC-native bound agents — OC
receives the raw WhatsApp message through its own Baileys subscription and
delivers it to the bound agent. **We don't control OC's inbound message
pipeline.**

For I3, the WA rules are in `IDENTITY.md` (bootstrap, loaded every turn) —
that part works. But the **user's custom prompt per chat** — where does it
live? Options:

1. **It's in `systemPromptOverride`** — loaded every turn by OC. No
   per-message injection needed. The user prompt IS the override.
   Limitation: same prompt for all chats bound to this agent (but each
   thin agent handles one chat, so this is fine).
2. **It's in `IDENTITY.md`** alongside the WA rules — same file, same
   limitation (per-agent, not per-chat). Fine for I3 (one agent per chat).
3. **We modify the Baileys message before OC sees it** — intercept in our
   `messages.upsert` handler, prepend the user prompt to the message text,
   then let OC process the modified message. Risky — OC may have its own
   expectations about message format.
4. **We don't inject per-message at all** — for I3/I4, the bootstrap
   files + systemPromptOverride are sufficient. The user prompt is static
   per-agent, not per-message. The WA rules are in IDENTITY.md.

**Ariel:** I think option 1 or 4 is correct — for I3, each thin agent has
one chat, so the user prompt in systemPromptOverride IS the per-chat config.
No dynamic per-message injection needed. The plan's "prepend to every
message" language is misleading for I3/I4. Confirm?

USER ANSWER: i dont understand ur question, but again, out static prompt must include everything, to every prompt, to every agent, cron, every path except the very 1st static code fixed response.

---

### Q02-04: Default handler_type "cron"/"heartbeat" — what does it DO?

**Section:** §5 (defaults) + §4.0 (DefaultHandlerType enum)

`DefaultHandlerType` includes `Cron` and `Heartbeat`. But in v2, we can't
CREATE cron jobs or configure heartbeats — those are OC-native and read-only.

If a user sets the default to `handler_type = "cron"`, what happens?

- We can't auto-generate N cron jobs for all unbound chats
- We can't write to `openclaw.json` for heartbeat config
- It's a declaration of intent with no implementation

**Options:**

1. v2 defaults only support `None`, `Static`, `Stateless` (writable types).
   Remove `Cron`/`Heartbeat` from `DefaultHandlerType`. Add them in v3.
2. Keep them as display-only labels — "I WANT cron for defaults, but it's
   not configured yet." Panel shows a "v3 required" badge.
3. Keep the enum but validate on write — reject cron/heartbeat in v2.

**Ariel:** Option 1 (simplest) or option 2?

USER ANSWER: in v3 our hard work will be to create full bash scripts to create everything, crons, heartbeats, ect. leave it for now. currenlty we just need to manually create some cron to some chat and register it in the db so we can see it in the panel.

---

## IMPORTANT — Consistency issues to fix

### Q02-05: I1/I2 flow diagrams — stale filename

**Section:** §3.2, lines ~409 and ~445

Both I1 and I2 ASCII flow diagrams reference `wa-claw-handler.ts`:

```
│ wa-claw-     │
│ handler.ts   │
```

Should be `openclaw-whatsapp-claw.ts` (the unified file).

**Action:** Fix both diagrams. No question needed.

---

### Q02-06: I4 flow chart says "Bootstrap files (same as I3)" — WRONG

**Section:** §3.2, I4 flow chart, line ~589

```
│  ┌─ Bootstrap files (same as I3) ────────────────────────────┐  │
│  │  SOUL.md, MEMORY.md, AGENTS.md, TOOLS.md, etc.            │  │
```

I3 has **empty** bootstrap files (except IDENTITY.md). I4 has **full**
bootstrap files. "(same as I3)" is the opposite of true.

**Action:** Change to "(full content)" and note it's the key difference
from I3.

---

### Q02-07: JID format in INSERT examples has `+` prefix

**Section:** §3.2 (I1/I2 config examples) + §4.2

Baileys JIDs are `972501234567@s.whatsapp.net` (no `+` prefix).
The `+` is only in E.164 format (`+972501234567`).

Current examples:

```sql
VALUES ('+972501234567@s.whatsapp.net', '+972501234567', ...)
```

Should be:

```sql
VALUES ('972501234567@s.whatsapp.net', '+972501234567', ...)
```

JID column = Baileys format (no `+`). phone_e164 column = E.164 (with `+`).

**Action:** Fix all INSERT examples. No question needed.

---

### Q02-08: `chats` table missing phone_e164

**Section:** §7 (data model)

Issue 1 rule: "every entry includes phone_e164." The `chats` table maps
JID → name and currently says "(unchanged)". But it should also get
`phone_e164` for consistency with the rule and for easy panel lookups.

The `chats` table has both DM JIDs (have phone numbers) and group JIDs
(don't). Same pattern as other tables — `phone_e164 TEXT` nullable.

**Action:** Add `ALTER TABLE chats ADD COLUMN phone_e164 TEXT` to §7.2
and update the DB evolution diagram. No question needed.

---

### Q02-09: §4.0 appears after §4.1 in the file

**Section:** §4

The enums section (§4.0) was inserted between §4.1 (Design) header and its
"Why one file?" content. Numbering is backwards — §4.0 should come before
§4.1.

**Action:** Reorder so §4.0 is first in the section. Minor.

---

## DESIGN QUESTIONS — Need Ariel's input

### Q02-10: I1 static reply — should it have the `[OpenClaw Auto AI Generated Response:]` prefix?

**Section:** §6 (response format rule)

The rule says: "EVERY message you send MUST start with exactly:
`[OpenClaw Auto AI Generated Response:]`"

But I1 is a static text reply — no AI generated it. Options:

1. I1 uses a different prefix: `[OpenClaw Auto Reply:]`
2. I1 uses the same prefix (even though it's not AI-generated — simpler)
3. I1 has no prefix (it's just user-configured text, delivered as-is)

**Ariel:** Which? This affects whether the prefix is in wa-auto-prompt.md
(AI instruction) or in our send code (applied to ALL outbound messages
including static).

USER ANSWER: leave it as is. in v3 i want to also implement to let the user override this. so i dont care about this being not accurate, its just basic gate for idiot user

---

### Q02-11: owner_phone for OC agents — where does it live?

**Section:** §6 (escalation)

For I1/I2 custom handlers, `owner_phone` is in `config_json` in our DB.
For I3/I4 OC agents, there's no `config_json` — they're configured in
`openclaw.json`. Where does the agent learn the owner's phone number?

Options:

1. Put it in IDENTITY.md (hardcoded in the bootstrap file content)
2. Put it in `wa-auto-prompt.md` → IDENTITY.md (same for all agents)
3. Our code handles escalation (per Q02-02) — the agent doesn't need to
   know; it just returns NO_REPLY and our code decides whether to escalate

If Q02-02 goes with Option 1 (our code tracks everything), then Q02-11
is also answered: `owner_phone` lives in `wa_claw_defaults.config_json`
(or per-handler in `wa_claw_handlers.config_json`), and our code reads it.

**Ariel:** Tied to Q02-02 decision.

USER ANSWER: static propmt should include instuctions about going to find owner phone in `config_json` in our DB.

---

### Q02-12: Cron JSON schema — are these field names real?

**Section:** §3.1 (cron config examples)

The cron JSON examples use field names like:

- `schedule: { kind: "every", everyMs: 1800000 }`
- `sessionTarget: "isolated"`
- `wakeMode: "now"`
- `payload: { kind: "agentTurn", message: "...", lightContext: true }`
- `delivery: { mode: "announce", channel: "whatsapp", to: "..." }`

These were extrapolated from the VPS research but the exact OC cron JSON
schema was never verified against source code. The `openclaw cron add`
CLI accepts these as flags/options — but the internal JSON representation
may differ.

**Risk:** Panel classification logic (S1a vs S1b vs S1c) depends on these
exact field names. If the real schema uses different names, the classifier
breaks silently.

**Action needed:** Before implementation, verify cron job JSON schema
against `openclaw cron list --json` output on VPS. Add to T2a task.

USER ANSWER: audit and verify, your folder is the source code.

---

### Q02-13: Multiple handlers on one chat — is it desired?

**Section:** §8.2

The plan says "a chat CAN have multiple handlers" (e.g., I1 instant reply

- S1 periodic cron). The reverse-mapping shows all of them.

But at RUNTIME, if a chat has both an I1 handler in our DB AND a cron that
fires for that chat — both will produce replies independently. Is this the
intended behavior?

Concrete scenario: Alice has I1 (static "I'm busy") + S1a cron (every 30m
check for messages). Alice sends a message → gets static reply immediately,
AND 30 minutes later the cron fires and potentially replies again.

**Ariel:** Is this desired? Or should one take priority (e.g., custom
handler disables scheduled handlers for that chat)?

USER ANSWER: yes. definitely yes. we are building a platform, not a final product.

---

### Q02-14: model field on I1 — useful or noise?

**Section:** §3.2 (I1 config)

I1 stores `"model": null` in config_json "for schema consistency." But:

- I1 never uses a model
- The panel would show "Model: (none — static)" which is obvious
- It's one more field to validate, migrate, and explain

**Ariel:** Keep it (consistency) or drop it (simplicity)?

USER ANSWER: i dont understand whats the other (simplicity) option? seems simpler to keep (consistency).

---

## MINOR — Auto-fixable, no question needed

### Q02-15: §3.0 Rule 1 says "every handler path" but I1 doesn't get the prompt

I1 is static text, no prompt injection. Rule 1 should say "every AI handler
path" or "every handler path except I1."

### Q02-16: §12 missing tasks

Tasks not in the breakdown:

- Create IDENTITY.md template for thin agents (I3 setup)
- Verify cron JSON schema from VPS (part of T2a)
- Handle I2 escalation mechanism (depends on Q02-01)
- Add phone_e164 to chats table (depends on Q02-08)

### Q02-17: wa-auto-prompt.md location

Currently: `dev-mode/openclaw-whatsapp-claw/app/wa-auto-prompt.md`

This file needs to be:

- Read by the panel server (in `app/`)
- Copied to agent workspaces as IDENTITY.md
- Referenced by cron payload templates

Living inside `app/` makes it a panel-app file. Should it be one level up
at `dev-mode/openclaw-whatsapp-claw/wa-auto-prompt.md` since it's shared
across concerns, not just the web app? Minor, but affects import paths.

---

## Summary

| Priority  | Count | Key items                                                              |
| --------- | ----- | ---------------------------------------------------------------------- |
| Critical  | 4     | I2 escalation, agent DB access, I3/I4 injection, default cron/HB       |
| Important | 5     | Stale filenames, I4 bootstrap label, JID format, chats phone, §4 order |
| Design Q  | 5     | I1 prefix, owner_phone, cron schema, multi-handler, I1 model           |
| Minor     | 3     | Rule 1 wording, missing tasks, prompt file location                    |

## USER FINAL ADDITION

we should add in the panel a button to "tutorial"

currenlty that page will have all paths with as simple flow chart, thats it.

also main thing from this grilling - our static prompt should really be full docs for the ai, prefer overdoing it than being efficient. and add that in the tutorial page bottom section read only. make sure the page read the original file, dont just dump copy.

so every issue here treat as a single task to audit and update plan-v2.md. take your time, reason well, do it 1 by 1.
