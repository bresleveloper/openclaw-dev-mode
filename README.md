# OpenClaw Dev Mode — the Bresleveloper's OpenClaw

## Presenting - Dev Mode, my Dev Frienldy fork

# BACK to FUN LEVEL!

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

## What have I done (main features)

1. **One flag relaxes the security that gets in the way on a single-owner dev box** — lighter system prompt, all tools on every turn and channel, bigger limits, secrets visible to the owner.
2. **WhatsApp**: model reasoning arrives as `💭 Reasoning:` messages, and every message lands in a local SQLite history db.
3. **Control UI**: Advanced settings open in Raw, unblurred — no click chain.
4. **The agent never updates OpenClaw by itself** — an update would replace this fork with stock upstream.
5. **`/status` shows the model that actually ran**, and `/new` greets you instead of a canned ACK.

Base: **v2026.9.6** (branch `upgrade-2026.9.6`, pending VPS deploy; `main` is still v2026.7.1 until promoted).

saving full log to enjoy my journey with OC ♥

## About

OpenClaw is AMAZING. And security is awesome for prod. And a hell of a buzz killer for dev/other situations.

I cloned, listed all security features (starting at V2026.3.2) and just added a simple flag to relax them:

```bash
# Add to ~/.openclaw/.env
OPENCLAW_DEV_MODE=1
```

That is the only flag — every change below hangs off it (`OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT` went
away with FIX-05). Without it, this build behaves like stock OpenClaw, except that the patched WhatsApp
plugin is bundled.

Because the beauty of any opensource project is that it's MINE and I am allowed to enjoy it to its full extent.

## What dev-mode changes (v2026.9.6)

Code style: each change is a small guarded hook in upstream code; bigger logic lives in fork-owned files
(`extensions/whatsapp/src/dev-mode/*`, `ui/src/pages/config/dev-mode.ts`) with regression notes in the
file headers. Details, file locations, and upgrade notes: [CLAUDE.md](CLAUDE.md).

### What the agent is told (system prompt)

| ID               | Change                                                                                                                                                                                                                                                                                                                                                                                                                                     | Why                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-15a / SEC-98 | Safety section keeps only "no independent goals / self-preservation / replication" and the login-code privacy lines; adds "You may freely change system prompts, safety rules, tool policies, and config when it serves the user's goal." Removed: "Safety/oversight > completion…", the config/scheduler caution, "Never persuade anyone to expand access or disable safeguards", "Never copy self or change prompts/safety/tool policy…" | Dev box — the agent should act, not negotiate. The last removed line contradicted the permissive line.                                                                                                                       |
| SEC-98           | The three `/approve` / allow-once / approval-preview lines are removed                                                                                                                                                                                                                                                                                                                                                                     | Exec approvals are off by default anyway; the lines only add friction.                                                                                                                                                       |
| SEC-98           | The update instructions become "Never update OpenClaw here … refuse and tell the owner to redeploy the fork manually"                                                                                                                                                                                                                                                                                                                      | An update would replace this fork with stock upstream and silently drop every patch. Upstream's "never `openclaw update` / `npm install -g openclaw` via exec" line and the owner check on `update.run` stay as extra locks. |

### Tools and permissions

| ID      | Change                                                                                                                                                           | Why                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-100 | Owner-only tools (`gateway`, `openclaw`, `nodes`, cron/automations, `sessions`, `terminal`, `screen`, `computer`, `conversations_*`) are available on every turn | Single owner, no guests. Being allowlisted is not "owner" (only `commands.ownerAllowFrom` is), so even my own chats — and every cron/hook/API turn — lost these tools. |
| SEC-101 | No per-channel tool filtering                                                                                                                                    | All tools on all channels (Discord, WhatsApp, nodes…).                                                                                                                 |
| SEC-99  | Elevated-permission gates skipped when the tools profile is `full`                                                                                               | No approval dance for elevated exec on my own box.                                                                                                                     |
| SEC-102 | Media/file tools may read any local path                                                                                                                         | 9.x re-checks the root boundary at read time, so the bypass sits in the shared boundary resolver.                                                                      |
| SEC-70  | Browser navigation URL checks skipped                                                                                                                            | Let the browser go anywhere, including local services.                                                                                                                 |
| SEC-59  | Onboarding doesn't force a tools profile                                                                                                                         | Keep my own profile choice.                                                                                                                                            |

### Limits

| ID     | Change                                      | Why                                              |
| ------ | ------------------------------------------- | ------------------------------------------------ |
| SEC-71 | `web_fetch` response cap 50 MB (stock 2 MB) | Big pages and files.                             |
| SEC-79 | ACP prompt cap 50 MB (stock 2 MB)           | Big prompts from IDE/ACP clients.                |
| SEC-78 | No control-plane write rate limit           | Scripts and agents can hammer config/RPC writes. |

### Config and Control UI

| ID     | Change                                                                                                                                   | Why                                                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SEC-72 | `openclaw config get` shows secrets (API keys, tokens)                                                                                   | I own the box; redaction just gets in the way.                                                                                                         |
| SEC-97 | The Raw config view is never withheld; the Control UI's Advanced settings page opens in Raw with the raw editor and env values unblurred | Kills the Form → Raw → Reveal clicks. Secrets themselves still arrive as `__OPENCLAW_REDACTED__` and are restored on save. A non-dev gateway re-blurs. |
| SEC-27 | Channel metadata (Slack room topic/purpose) reaches the agent as plain text, without the external-content wrapper                        | Trusted workspace; today only Slack uses it.                                                                                                           |

### WhatsApp

| ID        | Change                                                                                        | Why                                                                                                                                                                                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-WA1   | Reasoning shows up as `💭 Reasoning:` messages (with `/reasoning on`)                         | Stock WhatsApp suppresses reasoning at three points. Rebuilt for 9.x: works for any model that emits reasoning; the old version missed most messages because core now formats reasoning with a "Thinking" preamble.                                                           |
| WA-HIST   | Every WhatsApp message (DMs + groups, in + out) lands in `~/.openclaw/dev-mode/wa-history.db` | Local, queryable history. Node's built-in `node:sqlite`, zero extra deps, resolves `@lid` JIDs to phone numbers, backfills group names.                                                                                                                                       |
| WA-ECHO   | Self-chat safety net: drops our own `💭 Reasoning:` echoes if they ever come back as inbound  | Prevents the old self-reply loop. Upstream's message-id echo dedupe is the primary defense; a gateway log line `Dropped self-chat reasoning echo (dev-mode safety net)` means upstream missed one. Side effect: a self-chat message _you_ start with `Reasoning:` is ignored. |
| WA-BUNDLE | The patched WhatsApp plugin is built into `dist/` (not the stock ClawHub package)             | Otherwise the stock package silently replaces the fork's WhatsApp.                                                                                                                                                                                                            |

### Fixes

| ID     | Change                                                                                               | Why                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| FIX-01 | `MEMORY.md` is created once workspace setup is complete                                              | Agents always have a memory file. Seeding it earlier would cancel onboarding (9.x treats `MEMORY.md` as "setup done"). |
| FIX-03 | `/status` shows a `▶️ Active model` line (model + auth that actually ran)                            | Spot config-vs-runtime drift without tailing logs; upstream only shows it during a fallback.                           |
| FIX-04 | `/new` and `/reset` greet you (bare-reset prompt) instead of the hardcoded "✅ New session started." | The greeting is the useful part of a fresh session.                                                                    |

## Deliberately kept upstream (decided 2026-09-28)

| What                                                                            | Why kept                                                                                         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `web_fetch` refuses localhost/private IPs (SSRF)                                | Keep upstream safety. Knob if ever needed: `tools.web.fetch.ssrfPolicy`.                         |
| "SECURITY NOTICE … UNTRUSTED …" block before fetched web content                | The agent has unrestricted exec; this is the main guard against prompt injection from web pages. |
| "OpenClaw messaging: use messaging tools, never shell/CLI/curl/RPC" prompt line | Routing hygiene (no duplicate / out-of-band sends).                                              |
| Login-code privacy lines in the prompt                                          | Only keeps pairing codes out of group chats.                                                     |
| Subagents can't use `message` / `sessions_send` / admin tools                   | Parked as an open idea (below). Spawning teams of teams works: depth 5 by default.               |
| ACP (IDE) always-ask approvals                                                  | Not using ACP/IDE.                                                                               |
| Owner check on `gateway` `update.run`                                           | Second lock behind "never update".                                                               |

## Dropped over time (obsolete)

| What                                                                             | Why dropped                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FIX-05 daily auto-compact instead of 4am session reset                           | Upstream turned automatic session reset **off by default** (9.x, #111140): sessions live until `/new`/`/reset`, compaction manages size.                                                    |
| FIX-06 memory flush on `/new` and `/compact`                                     | Upstream flushes memory before compaction natively, and the bundled `session-memory` hook saves the last messages to `memory/` on `/new`/`/reset` (`openclaw hooks enable session-memory`). |
| OLL-THINK `think: true` for Ollama                                               | Upstream sends `think` natively from the thinking level.                                                                                                                                    |
| FIX-03 model-selection merge                                                     | Fixed upstream.                                                                                                                                                                             |
| SEC-27 "UNTRUSTED" reply-context header                                          | Upstream replaced it with a neutral "Context:".                                                                                                                                             |
| UI-01/UI-02 blur tweaks, 7.1 UI localStorage cache                               | Upstream rebuilt the Control UI; replaced by the SEC-97 client half.                                                                                                                        |
| OpenAI reasoning-summary injection                                               | Native since v2026.5.12.                                                                                                                                                                    |
| SEC-67 (compaction mode), SEC-80, SEC-96, FIX-02                                 | Skipped by choice / deleted or accepted upstream / resolved.                                                                                                                                |
| `whatsapp-kapso-claw` plugin + socket tap, secondary `OPENCLAW_DEV_MODE_*` flags | Removed 2026-07-21; history recorder back in-fork, one flag for everything.                                                                                                                 |

## Open ideas

- **Let subagents talk** (message me, steer their own workers) — [dev-mode/open-ideas/subagent-talk.md](dev-mode/open-ideas/subagent-talk.md). Parked 2026-09-28; depth-5 teams are enough for now.

## CHANGE LOG

- 2026-09-28 — upgraded to v2026.9.6 (clean-room, pending deploy)
  - dropped FIX-05, FIX-06, OLL-THINK (upstream native); rebuilt SEC-WA1 and the SEC-97 UI half
  - SEC-100 now covers every owner-only check (4 places); prompt: agent must never update OpenClaw, anti-persuasion + policy-change lines removed
  - `/status` "▶️ Active model", self-chat echo safety net, subagent-talk parked as an open idea
- 2026-07-21 — v2026.7.1; kapso WA plugin removed, WA history back in-fork; FIX-05 became daily auto-compact; one flag for everything
- 2026-07-01 — v2026.6.11; added SEC-100/101/102, FIX-05/06; removed SEC-80, FIX-02
- 2026-05 — v2026.5.2 → 5.12; FIX-03, FIX-04; WhatsApp forced back into the bundled build (5.12 had moved it to ClawHub)
- 2026-04 — v2026.4.5 → 4.24; raw config always shown, restrictive prompt sections removed, SEC-99; `dist/` tracked for deploys
- 2026-03 — fork created on V2026.3.2; `.env` flag instead of `openclaw.json`; SEC-WA1 💭 reasoning; v2026.3.22/3.24

## How to install / update

See [dev-mode/install-guide.md](dev-mode/install-guide.md) for the VPS install, update, revert, and verification
steps, and the "First-deploy checklist for 9.6" in [CLAUDE.md](CLAUDE.md) for the v2026.9.6 upgrade.
