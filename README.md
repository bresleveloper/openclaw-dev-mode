# OpenClaw Dev Mode — the Bresleveloper's OpenClaw

## Presenting - Dev Mode, my Dev Frienldy fork, and now FULL local WhatsApps AI-OC-Powered

# BACK to FUN LEVEL!

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

## What have I done (main features)

1. MAIN & MAJOR -> building local WA framework to power your WA fully by OC and AI (port 17890, need gateway token)
2. Some Security easings (see below)
3. WhatsApp features
   - Show model thinking/reasoning messages (`💭 Reasoning:` prefix, OpenAI + Ollama)
   - Save full WA history to SQLite (at `~/.openclaw/dev-mode/wa-history.db`) so agents can passively query it
4. Write `MEMORY.md` on agent creation

saving full log to enjoy my journey with OC ♥

## CHANGE LOG

- 2026-05-25 - MAJOR -> [`openclaw-whatsapp-claw`](https://github.com/bresleveloper/openclaw-dev-mode/tree/main/dev-mode/openclaw-whatsapp-claw/docs) v0.2.1 - confirmed working WA auto-response
- 2026-05-21 - MAJOR -> [`openclaw-whatsapp-claw`](https://github.com/bresleveloper/openclaw-dev-mode/tree/main/dev-mode/openclaw-whatsapp-claw/docs) v0.2 - upgraded panel to be readonly to real resources (automated work)
- 2026-05-17 - Upgraded to V2026.5.12
  - MAJOR -> [`openclaw-whatsapp-claw`](https://github.com/bresleveloper/openclaw-dev-mode/tree/main/dev-mode/openclaw-whatsapp-claw/docs) v0.1 - panel for full WA control with openclaw agents and features (currenlty just concept and panel)
- 2026-05-08 - Upgraded to V2026.5.7
  - FIX 04 using old prompt base for `/new`
- 2026-05-07 - Upgraded to V2026.5.6
  - FIX 03 `/status` sometimes showing wrong runtime model
- 2026-05-03 - Upgraded to V2026.5.4
  - Web GUI config tab start at show raw + no block (loading time at 1st time)
- 2026-05-03 - Upgraded to V2026.5.2
- 2026-04-26 - Upgraded to V2026.4.24
- 2026-04-23 - Upgraded to V2026.4.22
- 2026-04-19 - Upgraded to V2026.4.15
- 2026-04-15
  - Always show raw config in web GUI (no block)
  - Remove restrictive prompt sections (internal initial prompts)
  - Skip elevated permission gates when dev-mode + Full profile
  - reasoning WA bug fix
- 2026-04-09 - Upgraded to V2026.4.9
- 2026-04-07
  - Upgraded to V2026.4.5
  - Tracking all `dist/*/` folders so that updates always includes all artifacts
- 2026-03-27
  - Upgraded to V2026.3.24
  - Removed dev-mode hub plugin (VPS uses [JarvisHub](https://github.com/JarvisDeLaAri/YourJarvisHub) directly).
  - Removed custom Ollama web search provider ([use official plugin](https://docs.ollama.com/integrations/openclaw)).
  - Control UI: agent files and raw config secrets visible by default.
  - WhatsApp history logger: saves all messages to SQLite (`~/.openclaw/dev-mode/wa-history.db`). (enabled with `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES=1`)
  - Renamed env var `OPENCLAW_WA_THINKING_MESSAGES` to `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES`.
- 2026-03-23
  - Upgraded to V2026.3.22 (3,469 upstream commits).
  - Dropped SEC-96.
  - Added SEC-WA1: WhatsApp thinking messages with 💭 prefix (opt-in via `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1`).
  - Removed custom Ollama web search provider (was 10th bundled provider, now upstream).
  - No WhatsApp echo issues — V2026.3.22 fixes confirmed stable.
  - Support ollama `think: true` and output with `reasoning level: on`
- 2026-03-12 - updated to mains V2026.3.11
- 2026-03-06 - updated to mains V2026.3.7 + removed interactions with openclaw.json (now saves devMode in .env)
- 2026-03-05 - created dev mode on V2026.3.2 with following security dedactions

`dev-mode` is now my Dev Frienldy fork

## About

OpenClaw is AMAZING. And security is awesome for prod. And a hell of a buzz killer for dev/other situations.

I cloned, listed all security features (latest - V2026.3.2) and just added a simple flag to relax them:

```bash
# Add to ~/.openclaw/.env
OPENCLAW_DEV_MODE=1
OPENCLAW_DEV_MODE_CLEAR_UI=1
OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1
OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES=1
```

Because the beauty of any opensource project is that it's MINE and I am allowed to enjoy it to its full extent.

## What dev-mode changes

### Security easings

Gated by `OPENCLAW_DEV_MODE=1`. Each is a minimal `if (isDevMode()) { … }` check.

| ID         | What it does                                                                               |
| ---------- | ------------------------------------------------------------------------------------------ |
| SEC-15a    | Lighter safety section in system prompt                                                    |
| SEC-27     | Channel metadata treated as trusted (no "UNTRUSTED" wrapper)                               |
| SEC-59     | Skip messaging profile default in onboarding                                               |
| SEC-67     | Default compaction mode (no safeguard)                                                     |
| SEC-70     | Skip browser navigation URL checks                                                         |
| SEC-71     | 50MB web fetch cap (instead of 2MB)                                                        |
| SEC-72     | Unredacted config in CLI (API keys visible)                                                |
| SEC-78     | No control plane rate limiting                                                             |
| SEC-79     | 50MB prompt cap (instead of 2MB)                                                           |
| SEC-80     | Skip hooks token uniqueness check                                                          |
| SEC-97     | Always show raw config in web GUI (skip round-trip check)                                  |
| SEC-98     | Remove restrictive prompt sections (approval, config caution) + add permissive safety line |
| SEC-99     | Skip elevated permission gates when dev-mode + Full profile                                |
| ~~SEC-96~~ | ~~All env vars passed through to child processes~~ — dropped in V2026.3.22                 |

### WhatsApp features

Each opt-in via its own env var (requires `OPENCLAW_DEV_MODE=1` first).

| ID      | Env var                                    | What it does                                                                                     |
| ------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| SEC-WA1 | `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1` | Unsuppress model thinking on WhatsApp, swap response prefix with `💭 Reasoning:`                 |
| WA-HIST | `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES=1`     | Log every inbound/outbound WhatsApp message to SQLite at `~/.openclaw/dev-mode/wa-history.db`    |
| WA-ECHO | (always on in dev-mode)                    | In self-chat mode, filter inbound messages matching reasoning-echo patterns to break reply loops |

### Model provider tweaks

Both gated by `OPENCLAW_DEV_MODE=1`.

| ID        | What it does                                                                                                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OLL-THINK | Send `think: true` in the Ollama API request body so the model actually generates reasoning                                                                                                           |
| OAI-SUM   | Inject `reasoning.summary: "auto"` into OpenAI WebSocket stream requests — implementation is in place but OpenAI returns empty reasoning for gpt-5.3-codex regardless, so this is effectively dormant |

### Control UI (always on, hardcoded into the UI build)

| ID    | What it does                                                                      |
| ----- | --------------------------------------------------------------------------------- |
| UI-01 | Agent file textarea no longer blurs when not focused (`components.css`)           |
| UI-02 | Raw config secrets revealed by default — no eye-toggle click needed (`config.ts`) |

### Fix

| ID     | What it does                                                                                                                                                                                                                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FIX-01 | Auto-bootstrap `MEMORY.md` alongside heartbeat template in new workspaces                                                                                                                                                                                                                                              |
| FIX-02 | Fix doubled reasoning text in Ollama thinking (duplicate accumulation from V2026.4.9 merge)                                                                                                                                                                                                                            |
| FIX-03 | `/status` now merges global `agents.defaults` before model resolution (no more spurious `gpt-5.5` fallback) and renders an `⚙️ Runtime:` line below `🧠 Model:` so config-vs-runtime mismatches are visible at a glance                                                                                                |
| FIX-04 | Inbound `/new` and `/reset` restore the bare-reset greeting (`BARE_SESSION_RESET_PROMPT_BASE`) instead of the hardcoded `"✅ New session started."` ACK that upstream introduced in V2026.5.4 (commit `a68ca1ae0b`). Affects WhatsApp + any inbound channel; TUI `/new` is unaffected (always silent since V2026.3.22) |

## How to install

See [dev-mode/install-guide.md](dev-mode/install-guide.md) for the full VPS install, update, revert, and verification steps.
