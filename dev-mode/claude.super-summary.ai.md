# Claude Super Summary — OpenClaw Dev Mode

> This file is a comprehensive brain dump for future Claude sessions. Read this FIRST.

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw (V2026.3.2, commit 029c47372)
- **PR**: https://github.com/openclaw/openclaw/pull/37337
- **Owner**: Ariel (bresleveloper)
- **Purpose**: Add `--dev-mode` flag to OpenClaw that relaxes security features for dev environments
- **Status**: IMPLEMENTED, BUILT, DEPLOYED, TESTED, PR SUBMITTED

## Local Paths

- **Windows dev**: `C:\Users\Ariel\source\openclaw chaos mode\openclaw-dev-mode`
- **VPS production**: `/opt/openclaw-dev-mode` (symlinked to `/usr/lib/node_modules/openclaw`)
- **VPS**: `srv1150525` (root user, Linux, systemd manages gateway)
- **Old folder** (may still exist): `C:\Users\Ariel\source\openclaw chaos mode\openclaw-chaos-mode`

## Build & Deploy

- **Build**: `pnpm build` (then `pnpm ui:build` for Control UI)
- **Build tool**: tsdown (esbuild-based), output in `dist/`
- **dist/ is committed** to the repo (so VPS can clone and run without building)
- **Control UI**: `dist/control-ui/` — also committed, built separately via `pnpm ui:build`
- **Package manager**: pnpm locally, npm on VPS
- **VPS install**: `npm install --ignore-scripts` (no pnpm needed, no build needed)
- **Platform**: Build output is platform-independent JS — build on Windows, deploy to Linux

## Architecture of the Dev Mode Feature

### Global State Pattern

OpenClaw uses a globals pattern in `src/globals.ts`:
- `setVerbose(v)` / `isVerbose()` — existing pattern we followed
- `setDevMode(v)` / `isDevMode()` — our addition
- `isDevMode()` also checks `process.env.OPENCLAW_DEV_MODE === "1"` as fallback

### Config Persistence

- `devMode` lives under `cli.devMode` in `~/.openclaw/openclaw.json`
- Added to TypeScript type: `src/config/types.cli.ts` — `devMode?: boolean`
- Added to Zod schema: `src/config/zod-schema.ts` line ~260 — `devMode: z.boolean().optional()`
- **CRITICAL**: The zod schema uses `.strict()` — forgetting to add devMode there caused the gateway to crash with "Unrecognized key: devMode". This was a bug we hit in production.

### CLI Parsing Flow

1. `src/cli/profile.ts` — Parses `--dev-mode 0/1` from argv early (same pattern as `--profile`)
2. `src/cli/run-main.ts` — If `--dev-mode` is set, writes config and runs `openclaw gateway restart` via `execFileSync`, then exits
3. `src/cli/program/preaction.ts` — On every command, loads config; if `cfg.cli?.devMode`, calls `setDevMode(true)` and:
   - Auto-adds hub plugin path to `plugins.load.paths` via `setConfigOverride()` (runtime-only, not persisted)
   - Auto-starts hub server (`server.py`) if port 10020 is free (spawns detached python3 process)

### The 13 Security Items

Each one is a minimal `if (isDevMode())` check in the relevant source file:

| ID | File | What it does |
|----|------|-------------|
| SEC-00 | `src/globals.ts`, `src/config/types.cli.ts`, `src/config/zod-schema.ts`, `src/cli/profile.ts`, `src/cli/run-main.ts`, `src/cli/program/preaction.ts` | Infrastructure: flag, config, parsing, loading |
| SEC-15a | `src/agents/system-prompt.ts` | Removes "Prioritize safety and human oversight..." paragraph |
| SEC-27 | `src/security/channel-metadata.ts` + `src/auto-reply/reply/untrusted-context.ts` | Returns plain text instead of UNTRUSTED wrapper; header says "Channel context:" instead of "Untrusted context..." |
| SEC-59 | `src/commands/onboard-config.ts` | Skips messaging profile default (`ONBOARDING_DEFAULT_TOOLS_PROFILE`) |
| SEC-67 | `src/agents/pi-embedded-runner/extensions.ts` | `resolveCompactionMode()` returns "default" instead of "safeguard" |
| SEC-70 | `src/browser/navigation-guard.ts` | Early return in `assertBrowserNavigationAllowed()` — skips all URL checks |
| SEC-71 | `src/agents/tools/web-fetch.ts` | `resolveFetchMaxResponseBytes()` returns 50MB instead of 2MB |
| SEC-72 | `src/cli/config-cli.ts` | `runConfigGet` skips `redactConfigObject()` — API keys visible |
| SEC-78 | `src/gateway/control-plane-rate-limit.ts` | `consumeControlPlaneWriteBudget` returns `{ allowed: true, ... }` immediately |
| SEC-79 | `src/acp/translator.ts` | `getMaxPromptBytes()` returns 50MB instead of 2MB (was module-level const, changed to function) |
| SEC-80 | `src/gateway/startup-auth.ts` | Early return in `assertHooksTokenSeparateFromGatewayAuth()` |
| SEC-96 | `src/infra/host-env-security.ts` | `sanitizeHostExecEnv()` copies all env vars without filtering |
| FIX-01 | `src/agents/workspace.ts` | Writes `MEMORY.md` via `writeFileIfMissing()` after heartbeat template |

### Hub Notification Plugin

- **Location**: `dev-mode/hub/`
- **Files**: `server.py` (Python HTTP server), `index.ts` (OpenClaw plugin), `openclaw.plugin.json` (manifest)
- **Port**: 10020 (configurable)
- **Auto-start**: In `preaction.ts`, checks if 10020 is listening, spawns `python3 server.py` detached if not
- **Ariel's existing hub**: JarvisHub runs on port **10021** — no conflict
- **Tools registered**: `hub_notify` (POST /notify), `hub_pending` (GET /pending), `hub_done` (POST /done/{id})
- **Storage**: SQLite (`hub.db` in the hub directory)
- **Plugin loading**: Uses `setConfigOverride("plugins.load.paths", [...])` — runtime-only, not persisted to config file

## VPS Deployment Details

### How it's installed

1. Original openclaw was installed via npm globally (`/usr/lib/node_modules/openclaw/`)
2. Gateway runs as systemd service: `openclaw-gateway.service`
3. Service command: `/usr/bin/node /usr/lib/node_modules/openclaw/dist/index.js gateway --port 18789`
4. We backed up original: `mv /usr/lib/node_modules/openclaw /usr/lib/node_modules/openclaw.bak`
5. Cloned fork to `/opt/openclaw-dev-mode`
6. Symlinked: `ln -s /opt/openclaw-dev-mode /usr/lib/node_modules/openclaw`
7. CLI wrapper at `/usr/local/bin/openclaw` → `exec node /opt/openclaw-dev-mode/openclaw.mjs "$@"`
8. The symlink is CRITICAL — without it, the systemd service uses the old code which doesn't have devMode in its schema, causing config validation failure and gateway crash loop

### VPS Environment

- Node.js v24.13.1
- Python 3 (for hub server)
- systemd user service for gateway
- Gateway port: 18789 (loopback only)
- WhatsApp channel active and tested working
- JarvisHub on port 10021 (Ariel's existing, separate from ours)

## Bugs We Hit & Fixed

### 1. Config schema validation crash (CRITICAL)
- **Symptom**: `Config validation failed: cli: Unrecognized key: "devMode"` — gateway crash loop
- **Cause**: Added `devMode` to TypeScript type but not to Zod schema (which uses `.strict()`)
- **Fix**: Added `devMode: z.boolean().optional()` to `src/config/zod-schema.ts`

### 2. Systemd service using old code
- **Symptom**: Gateway 502, no agent responses, config invalid errors
- **Cause**: systemd runs `/usr/lib/node_modules/openclaw/dist/index.js` directly, not our wrapper
- **Fix**: Symlink `/usr/lib/node_modules/openclaw` → `/opt/openclaw-dev-mode`

### 3. npm install from GitHub missing files
- **Symptom**: `openclaw.mjs` not found, broken symlink, running from npm cache temp dir
- **Cause**: npm GitHub installs are unreliable for this project structure
- **Fix**: Abandoned npm approach, used git clone + symlink + CLI wrapper instead

### 4. Missing dependencies on VPS
- **Symptom**: `Cannot find package 'chalk'`
- **Cause**: Git clone doesn't include node_modules
- **Fix**: `npm install --ignore-scripts` in the clone directory

### 5. Missing Control UI
- **Symptom**: "Control UI assets not found" warning
- **Cause**: `pnpm ui:build` is separate from `pnpm build`
- **Fix**: Built UI locally, committed `dist/control-ui/` to repo

### 6. SEC-27 wrong implementation target
- **Symptom**: Plan assumed `runtimeInfo.channelMeta` which doesn't exist
- **Cause**: Metadata was refactored — moved to `UntrustedContext` via `buildUntrustedChannelMetadata()`
- **Fix**: Found via `git show 35eb40a70`, implemented bypass at `channel-metadata.ts` and `untrusted-context.ts`

### 7. SEC-79 module-level constant
- **Symptom**: `MAX_PROMPT_BYTES` evaluated before `setDevMode()` runs
- **Cause**: Module-level `const` is evaluated at import time
- **Fix**: Changed to `getMaxPromptBytes()` function called at runtime

### 8. pnpm not found
- **Symptom**: Build failed
- **Fix**: `npm install -g pnpm`

## Project File Structure (our additions)

```
dev-mode/
  req.md                          — Original 5-phase requirements doc
  list.sec.features.md            — All 97 security items reviewed
  list.sec/                       — Individual implementation plans
    SEC-00-dev-mode-flag-infrastructure.md
    SEC-15a.md
    SEC-27.md
    SEC-59.md
    SEC-67.md
    SEC-70.md
    SEC-71.md
    SEC-72.md
    SEC-78.md
    SEC-79.md
    SEC-80.md
    SEC-96.md
    FIX-01.md
  hub/
    server.py                     — Python HTTP notification server
    index.ts                      — OpenClaw plugin (registers 3 tools)
    openclaw.plugin.json          — Plugin manifest
    README.md                     — Full API reference
    flow-comparison.html          — Visual comparison of Hub vs Heartbeat
    .gitignore                    — Excludes *.db, *.log, __pycache__
  tools-restrictions.md           — Analysis of tool restrictions
  yes.2026.03.06.html             — HTML visualization of YES items
  claude.super-summary.ai.md     — THIS FILE
```

## Source Files Modified (18 files)

1. `src/globals.ts` — `setDevMode()` / `isDevMode()`
2. `src/config/types.cli.ts` — `devMode?: boolean`
3. `src/config/zod-schema.ts` — `devMode: z.boolean().optional()`
4. `src/cli/profile.ts` — Parse `--dev-mode 0/1` from argv
5. `src/cli/run-main.ts` — Persist config + auto gateway restart
6. `src/cli/program/preaction.ts` — Load devMode from config, auto-enable hub, auto-start server
7. `src/agents/system-prompt.ts` — SEC-15a
8. `src/security/channel-metadata.ts` — SEC-27
9. `src/auto-reply/reply/untrusted-context.ts` — SEC-27
10. `src/commands/onboard-config.ts` — SEC-59
11. `src/agents/pi-embedded-runner/extensions.ts` — SEC-67
12. `src/browser/navigation-guard.ts` — SEC-70
13. `src/agents/tools/web-fetch.ts` — SEC-71
14. `src/cli/config-cli.ts` — SEC-72
15. `src/gateway/control-plane-rate-limit.ts` — SEC-78
16. `src/acp/translator.ts` — SEC-79
17. `src/gateway/startup-auth.ts` — SEC-80
18. `src/infra/host-env-security.ts` — SEC-96
19. `src/agents/workspace.ts` — FIX-01

## Ariel's Preferences

- Wants things simple, minimal, no over-engineering
- Prefers existing patterns in the codebase over new abstractions
- Wants the hub as an independent standalone thing, presented to agents as a tool
- Wants dev-mode to auto-enable everything (hub included) — no manual steps
- Fine with committing dist/ to the repo for easy deployment
- Uses WhatsApp as primary channel for testing
- Has JarvisHub on port 10021 (keep ours on 10020, no conflict)
- Communicates casually, expects fast direct responses
- "work slow, work simple, audit yourself" — his implementation philosophy

## Key OpenClaw Internals (for future reference)

- **Commander.js** for CLI parsing
- **tsdown** (esbuild-based) for building
- **Zod** for config schema validation (`.strict()` rejects unknown keys!)
- **Config flow**: JSON5 file → Zod validation → runtime defaults merge → `loadConfig()`
- **Runtime overrides**: `setConfigOverride(key, value)` — runtime-only, not persisted
- **Plugin system**: `openclaw.plugin.json` manifest + `register(api)` entry point
- **Plugins discovered from**: `plugins.load.paths` config + `extensions/` directory
- **Bootstrap files**: MEMORY.md etc, injected into agent context, max 20K chars per file (configurable via `agents.defaults.bootstrapMaxChars`)
- **Gateway**: systemd service, runs `dist/index.js gateway --port PORT`
- **Pre-action hooks**: `src/cli/program/preaction.ts` runs before every CLI command
- **Profile parsing**: `src/cli/profile.ts` runs before Commander, extracts early flags

## Git Commits (chronological)

1. `4561d0f8b` — feat: add --dev-mode flag (all 13 items + hub plugin + plans)
2. `04d2b3511` — chore: include dist/ in repo
3. `4d962c4bb` — docs: update README with install instructions
4. `da8e721d8` — docs: add version note
5. `8308a78d4` — docs: fix markdown link syntax
6. `c8f3ff170` — fix: add devMode to cli config zod schema
7. `0bb88184f` — feat: auto-start hub server in dev-mode + README
8. `138d86286` — feat: auto-restart gateway after --dev-mode toggle
9. `6ce39d20f` — chore: include control-ui assets in dist
10. `8e65cd734` — docs: update install guide with symlink step
11. `474016d14` — docs: update hub section with conflict guidance
