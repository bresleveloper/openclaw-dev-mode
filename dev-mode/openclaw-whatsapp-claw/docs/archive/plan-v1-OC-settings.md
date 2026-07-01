# WhatsApp Claw — Column 3 "OC Settings" (situation & insights)

- **Status:** Pre-plan — situation + insights for grilling. NOT an implementation plan.
- **Date:** 2026-05-18
- **Companion docs:** `design-concept.md` (esp. §10–§12), `plan-v1.md` (v2 roadmap)
- **Why this doc exists:** Column 3 ("OC Settings") in the live panel is
  effectively empty. Ariel asked to capture the situation and the design
  insights now, to be grilled into a real plan later.

---

## 1. Situation today

Column 3 currently renders, for the selected chat, four static lines:

- **JID** — the chat id
- **Type** — `dm` / `group`
- **Messages** — message count
- **Handler** — the literal placeholder text _"configuration arrives in v2"_

…followed by an **Audit (0)** list that is always empty.

It is empty _by design of v1_, not by bug. Per `plan-v1.md`, **v1 is a
standalone, read-only panel.** Its only data source is a direct SQLite read of
`wa-history.db`. It **never talks to the OpenClaw gateway** and writes nothing
to OpenClaw config. There is simply no source of "OC settings" wired in.

(The new fixed **⚙️ Defaults** entry, added 2026-05-18, has the same shape: a
placeholder panel. It is the eventual entry point for the Defaults editor.)

## 2. Why it is empty — the missing pieces

OpenClaw's per-chat behavior lives in `~/.openclaw/openclaw.json` —
`agents`, `bindings`, `cron`, heartbeat config — **not** in `wa-history.db`.
That config is owned by the gateway and exposed through its config RPC
(`config.get` / `config.patch` / `config.apply` / `schema.lookup`) — the very
same RPC the Control UI uses.

So filling Column 3 needs two units that v1 deliberately does not build
(`design-concept.md` §10):

| Unit               | Responsibility                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `oc-config-client` | Wraps the gateway config RPC; authenticates over loopback.                                                                                 |
| `claw-model`       | Translates panel handler concepts ⇄ native OC config mutations, both directions (read a chat's current handler, and compute a write diff). |

This is exactly the **v2** scope in `plan-v1.md`'s roadmap.

## 3. What Column 3 should become (`design-concept.md` §12)

For the selected chat, an **editor**:

- **Handler type** picker — the six handlers of §4: Default, Muted, Full
  agent, Isolated agent, Cron, Heartbeat.
- **Agent** picker (for agent handlers).
- **Prompt editor** — `systemPromptOverride`.
- **Tools** — the tool profile / allow-deny for the chat's agent.
- **Session scoping** — `dmScope` (`main | per-peer | per-channel-peer |
per-account-channel-peer`).
- **Reply prefix** — `responsePrefix` ("Ariel's Agent: …").
- **`visibleReplies`** toggle.
- **"Allow true silence"** toggle — for DM chats, sets
  `agents.defaults.silentReply.direct = "allow"` +
  `silentReplyRewrite.direct = false` so a DM agent can emit `NO_REPLY` and
  actually stay silent (see §6 of the design concept).

Plus, not per-chat: a **Defaults editor** (behind the ⚙️ Defaults entry) and a
**multi-select** to assign one handler to many chats at once.

The bottom of Column 3 — the **Audit** list — reads the `wa_claw_audit` table.
That table **already exists**: `wa-store.mjs` creates it (`CREATE TABLE IF NOT
EXISTS wa_claw_audit`) in v1. It stays empty until v3, when handlers start
writing audit rows.

## 4. Insights for the grilling

1. **The panel already holds the gateway credential.** The token gate added at
   deploy time reads `OPENCLAW_GATEWAY_TOKEN` (the same token the Control UI
   uses). `oc-config-client` can therefore authenticate to the gateway with
   `Authorization: Bearer <that token>` over loopback — **no new pairing or
   device-token flow needed.** This materially shrinks v2.
2. **Co-located with the gateway.** WA Claw runs on the same VPS as the
   gateway (`127.0.0.1:18789`), so the config RPC is a plain loopback call.
3. **A read-only v1.5 is possible before the full write path.** Just
   `config.get` the relevant slices and _display_ the chat's current binding /
   agent / prompt read-only — no `claw-model` diff engine, no write RPC. That
   turns Column 3 from a placeholder into something truthful with a fraction of
   v2's effort. Worth grilling as a separate, smaller step.
4. **Reading a handler is reverse-mapping.** A chat's "handler" is not stored
   as one field — it is inferred from `bindings` (peer → agentId), `agents`,
   `cron` jobs, and heartbeat tasks. `claw-model`'s read path reconstructs the
   §4 handler concept from those native structures.
5. **Writing is a minimal diff.** `claw-model` computes the smallest
   `config.patch` for an assignment change; the gateway validates and
   hot-reloads. The panel is the only RPC config writer; the gateway
   serializes config writes (V2026.5.12 centralized serialize+retry).

## 5. Gotchas for the grilling

- **Zod `.strict()`.** Any key not in OpenClaw's schema rejects the _whole_
  config. `claw-model` must emit only schema-valid shapes.
- **Raw-config round-trip.** Per the fork's `CLAUDE.md`: Zod defaults /
  scalar→object coercions that are not materialized in `openclaw.json` break
  the Control UI Raw editor. A config writer must not reintroduce that drift.
- **A config write reloads the gateway.** That can briefly bounce the
  WhatsApp connection (`CLAUDE.md` "Gateway Restart Can Break WhatsApp").
  Batch edits; don't write on every keystroke.
- **Never partially apply.** On a rejected write, surface the error inline in
  Column 3 and leave config untouched (`design-concept.md` §14).
- **Gateway-unreachable degradation.** If the RPC is down, Column 3 shows a
  banner and disables editing, but Columns 1–2 (wa-db browsing) keep working.

## 6. Open questions to grill

- Ship a **read-only v1.5** Column 3 (`config.get` display only) before the
  full v2 write path — yes/no?
- How does the panel **discover available agents** to populate the picker —
  `config.get agents`, or a dedicated RPC?
- Handler UX: one type dropdown, or distinct cards per handler type?
- Multi-select bulk assign — same Column 3 form, or a separate mode?
- Does the Audit view (`wa_claw_audit`) wait for v3, or get a read-only stub in
  v2 since the table already exists?
- Auth: confirm the gateway accepts the static `gateway.auth.token` on the
  config RPC over loopback (it should — it is the Control UI's path).
