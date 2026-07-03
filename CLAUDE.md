# OpenClaw Dev Mode

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw
- **Fork point**: commit `029c47372` (V2026.3.2)
- **Current base**: V2026.6.11 (merged 2026-07-01). Clean-room patch approach (branch from upstream tag, apply patches fresh) to avoid 524 merge conflicts. SEC-67 SKIPPED (Ariel's future compaction plans). SEC-80 DROPPED (upstream deleted the function). FIX-02 removed (already resolved). Added SEC-100, SEC-101, SEC-102, FIX-05. Massive `pi-*` → `agent-*` rename across agent infrastructure. WhatsApp admission refactor (`WebInboundMsg` → `AdmittedWebInboundMessage`). See "V2026.6.11 Upgrade" below.
- **Purpose**: Add dev-mode flag to OpenClaw that relaxes security features for dev environments

## Branches

- `main` — Ariel's only branch. Has `dist/` committed for easy VPS deployment, includes `dev-mode/rejects/` folder. Deployed to VPS. This is about making life easier — experimental, practical, no polish needed.
- `pr-ready` — DELETED (2026-03-23). Upstream PR abandoned.

## Post-Merge Cleanup Checklist (run after EVERY upstream merge)

Upstream re-introduces things this fork doesn't want. Each item below is recurring — verify and fix after every merge, before pushing/deploying:

1. **Remove GitHub Actions workflows** — `git rm -r .github/workflows`. Upstream carries ~64 CI workflow files (`ci.yml`, `codeql.yml`, `docker-release.yml`, `mantis-*.yml`, `windows-*.yml`, `stale.yml`, etc.); this fork has no CI. Leave non-workflow `.github/` content (issue templates, `dependabot.yml`, `CODEOWNERS`, `codeql/` query packs, `actions/` composite actions) alone. (2026-07-01: removed 64 files / 30K lines.)
2. **Keep-ours on WhatsApp build-exclusion lists** — `scripts/lib/bundled-plugin-build-entries.mjs` (`EXCLUDED_CORE_BUNDLED_PLUGIN_DIRS`) + `package.json` `files` (`!dist/extensions/whatsapp/**`). If an upgrade slips `whatsapp` back into either, the fork's WhatsApp patches silently revert to the stock ClawHub package. See "WhatsApp Extension — The Heart of This Fork".
3. **Keep-ours on `README.md`** — the fork's "OpenClaw Dev Mode" landing page (NOT a SEC patch).
4. **Stage dist with `git add -f dist/`** — `dist/` is in `.gitignore` but tracked; `git add -A` skips NEW dist chunks from the build and the first VPS gateway start fails with `Cannot find module`. See the ⚠️ note in Build & Deploy.
5. **Restore `dist/extensions/tlon` from git** before committing — pnpm build on Windows dirties those files as a symlink artifact. `git checkout -- dist/extensions/tlon`.
6. **Re-verify dev-mode patches survived** — quick grep for a few `isDevMode()` anchors in src/ and `grep -rl __waClawSockTap /opt/openclaw-dev-mode/dist/` on the VPS after deploy.

## Dev Environment

- **This PC**: Windows, Claude Code only. No OpenClaw installed. Do NOT run/test openclaw locally, but ALWAYS build (`pnpm build`) before pushing to validate the dist.
- **VPS**: Linux, has OpenClaw installed with dev-mode. Ariel pulls and tests there.
- **Workflow**: Build/edit code here → push → pull on VPS and restart gateway. Always ask permission before pushing. Always run full `pnpm build` — never cherry-pick individual build steps.

### Delegate Work to Sonnet Subagents — ALWAYS

**ALWAYS delegate execution to a Sonnet subagent** (Agent tool, `subagent_type: general-purpose`, `model: sonnet`). This is a non-negotiable standing rule from Ariel.

The main thread (Opus) is for planning, judgement, synthesis, and writing the final user-facing report — NOT for running commands, SSHing to the VPS, doing investigations, editing files, analyzing build output, or executing deploy steps. ALL execution — even urgent recovery work, even seemingly-small tasks — goes to the Sonnet worker (the little brother). Give the subagent a precise brief, let it execute, then synthesize its report.

Main thread exceptions (do NOT delegate these):
- (a) The final user-facing prose report.
- (b) Trivially small writes that are already fully decided and would cost more to brief than to do (a one-line config edit, a one-character fix in a known file).
- (c) The decision-making step itself — picking between options the subagent reported back.

Everything else: Sonnet. Even when it feels faster to just do it — delegate.

### SSH Access to VPS

Claude Code can SSH into the dev VPS. Key is at `~/.ssh/dev_vps`. Look up IP and port from `~/.ssh/known_hosts`. Use Windows OpenSSH:
```
/c/Windows/System32/OpenSSH/ssh.exe -i "C:/Users/Ariel/.ssh/dev_vps" -p <PORT> root@<IP> "COMMAND"
```
Never log VPS connection details (IP, port) in commits or output.

### VPS Layout

- **Fork cloned to**: `/opt/openclaw-dev-mode`
- **Symlinked to**: `/usr/lib/node_modules/openclaw → /opt/openclaw-dev-mode` (CLI install symlink)
- **Self-ref symlink**: `/opt/openclaw-dev-mode/node_modules/openclaw → /opt/openclaw-dev-mode` (required V2026.4.24; **possibly obsolete since V2026.5.2** — upstream's new `src/plugin-sdk/root-alias.cjs` + `src/plugins/sdk-alias.ts` resolve `openclaw/plugin-sdk/*` programmatically. Test deploy WITHOUT the symlink first; if WA/model warmup fails, restore it.)
- **CLI wrapper**: `/usr/local/bin/openclaw` (runs `node /opt/openclaw-dev-mode/openclaw.mjs`)
- **OpenClaw home**: `~/.openclaw/` (config, credentials, sessions, workspace, etc.)
- **Config**: `~/.openclaw/openclaw.json`
- **Env**: `~/.openclaw/.env` (contains `OPENCLAW_DEV_MODE=1` and `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1`)
- **WA credentials**: `~/.openclaw/credentials/whatsapp/default/`
- **Gateway**: user-level systemd service `openclaw-gateway.service` (at `~/.config/systemd/user/`), port 18789, loopback
- **Gateway logs**: `/tmp/openclaw/openclaw-YYYY-MM-DD.log` (daily rotation, JSON lines)
- **Node**: v24.14.0

## Build & Deploy

- **Build**: `pnpm build` (then `pnpm ui:build` for Control UI)
- **Build tool**: tsdown (esbuild-based), output in `dist/`
- **Formatter**: oxfmt (`pnpm format` / `pnpm format:check`)
- **Linter**: oxlint (`pnpm lint` runs `oxlint --type-aware`)
- **dist/ is committed** on `main` branch (~2996 files, 1.5M lines — drowns out real changes in PR diffs)
- **⚠️ `dist/` is in `.gitignore`** (line 7) but tracked files persist from a prior `git add -f`. This means `git add -A` updates already-tracked dist files (modifications + deletions) but **silently skips NEW dist files** created by a build (e.g. new hashed chunks like `dist/route-IbC_DJaQ.js`). A deploy that only runs `git add -A` will push a dist/ missing the new chunks → first gateway start fails with `Cannot find module .../<new-chunk>.js`. **Always stage dist with `git add -f dist/` after a build** so new files are included. (Learned during FIX-06 deploy: needed a second commit `e2441cf1d9` to force-add 626 missing chunks after the first gateway start failed.)
- **Package manager**: pnpm locally, npm on VPS
- **Platform**: Build output is platform-independent JS — build on Windows, deploy to Linux
- **Prerequisites**: Node.js 22.12+, Git

## WhatsApp Extension — The Heart of This Fork

**This fork exists to add dev-mode WhatsApp features.** `extensions/whatsapp/` carries SEC-WA1 (💭 thinking messages), the self-chat echo filter, and the wa-claw socket tap (feeds the standalone whatsapp-kapso-claw plugin's WA history recorder). It MUST be built and deployed as a first-class artifact — do not assume it "just loads from source."

### Why it needs special handling (V2026.5.12)

Upstream V2026.5.12 spun WhatsApp out of the bundled extension set: it's in `EXCLUDED_CORE_BUNDLED_PLUGIN_DIRS` (`scripts/lib/bundled-plugin-build-entries.mjs`) and `!dist/extensions/whatsapp/**` (`package.json` `files`), and is published standalone as `@openclaw/whatsapp` on ClawHub. On a stock setup, `repairMissingConfiguredPluginInstalls` auto-installs the ClawHub package into `~/.openclaw/extensions/whatsapp/` on every upgrade. That managed install (loader `origin: "global"`) **overrides** the in-repo `extensions/whatsapp/` — so the fork's WhatsApp patches are silently bypassed, no error logged. (V2026.5.12 did exactly this: `wa-history.db` froze 2026-05-17 and SEC-WA1 + the echo filter went dead until the 2026-05-19 fix.)

**This fork removes `whatsapp` from both exclusion lists** so `pnpm build` compiles the patched WhatsApp into `dist/extensions/whatsapp/` like every other bundled extension. **Keep-ours on both** during every upstream merge — if an upgrade slips them back, WhatsApp silently reverts to the stock ClawHub package.

### Build & deploy — part of EVERY deploy

- **Build**: `pnpm build` builds `extensions/whatsapp/` → `dist/extensions/whatsapp/` (+ `dist-runtime/`). `dist/` is committed, so the patched `@openclaw/whatsapp` ships on `main`.
- **One-time on the VPS** (first deploy after V2026.5.12): remove the stock managed install so the bundled fork build wins — `openclaw plugins uninstall whatsapp` (or `rm -rf ~/.openclaw/extensions/whatsapp`), then `openclaw gateway restart`. Once a bundled WhatsApp exists in `dist/extensions/`, the upgrade repair stops re-installing the ClawHub package (it skips `origin: "bundled"` entries).
- **Verify after EVERY deploy**: `grep -rl __waClawSockTap /opt/openclaw-dev-mode/dist/` must be non-empty — the fork's WhatsApp runtime code bundles into root-level `dist/*.js` hashed chunks (`session-*.js`, `monitor-*.js`), NOT into `dist/extensions/whatsapp/` (that dir holds only re-export stubs that import from `../../`). Also: `openclaw plugins list` must show WhatsApp under the `stock` source root, not `global`, and, when the whatsapp-kapso-claw plugin is installed, the gateway log should show its Baileys tap attaching. If a stale `~/.openclaw/extensions/whatsapp/` reappeared, uninstall it and restart.

### VPS Deployment

The `main` branch ships with pre-built `dist/`, so no build step is needed on VPS. Clone, `npm install --ignore-scripts`, create self-ref symlink (`ln -sf /opt/openclaw-dev-mode node_modules/openclaw`), symlink to `/usr/lib/node_modules/openclaw`, create CLI wrapper at `/usr/local/bin/openclaw`, add `OPENCLAW_DEV_MODE=1` to `~/.openclaw/.env`, start gateway.

**Update** (V2026.5.2+ recipe — `stage-bundled-plugin-runtime-deps.mjs` deleted upstream, self-ref symlink possibly obsolete):

```
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks && npm install --ignore-scripts && openclaw gateway restart
```

**If gateway boots but WA/model warmup fails** with `Cannot find package 'openclaw'`, the V2026.5.2 sdk-alias resolver isn't bootstrapping in your environment. Restore the V2026.4.24 self-ref symlink:
```
ln -sf /opt/openclaw-dev-mode node_modules/openclaw && openclaw gateway restart
```

**If plugin runtime deps are missing** (e.g. WA listener fails to load), wipe stale node_modules and let the loader's runtime self-heal rebuild from scratch on gateway start:
```
rm -rf dist-runtime/extensions/*/node_modules && openclaw gateway restart
```
Note: first gateway start after a wipe takes ~2 min as the loader installs plugin deps. See "WA Listener Takes ~2 Minutes After Upgrade Restart" below.

**Historical context** (pre-V2026.5.2): The deleted `scripts/stage-bundled-plugin-runtime-deps.mjs` used to align `dist-runtime/extensions/*/node_modules` with bumped plugin deps before restart. Upstream removed it because `scripts/postinstall-bundled-plugins.mjs` now handles this cleanly with `replaceDirAtomically`, with explicit comment: "Plugin package dependencies are installed only by explicit plugin install/update flows, never postinstall." The `ENOTEMPTY` issue we hit in V2026.4.24 should not recur.

**Extension deps** (run once after major upgrades): `node -e "const fs=require('fs'),p=require('path');const deps=[];for(const d of fs.readdirSync('extensions',{withFileTypes:true}).filter(d=>d.isDirectory())){try{const pkg=JSON.parse(fs.readFileSync(p.join('extensions',d.name,'package.json'),'utf8'));for(const[k,v]of Object.entries(pkg.dependencies||{}))deps.push(k+'@'+v)}catch{}}console.log(deps.join(' '))" | xargs npm install --ignore-scripts`

**Revert**: Stop gateway, remove `OPENCLAW_DEV_MODE=1` from `.env`, remove symlink, restore backup, start gateway.

**Verify**: talk to main agent with OLLAMA model to see thinking

## Architecture of the Dev Mode Feature

### How dev-mode is activated

Dev mode is controlled **entirely via env var**. No config file changes.

```bash
# Add to ~/.openclaw/.env
OPENCLAW_DEV_MODE=1
OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1   # SEC-WA1: 💭 prefix on Ollama reasoning
OPENCLAW_DEV_MODE_CLEAR_UI=1
```

The `.env` file is loaded on every CLI invocation by `loadDotEnv()` in `run-main.ts`, before any command runs. This includes `gateway start/restart`.

### Why NOT config persistence (lesson learned)

We originally had `--dev-mode 1` CLI flag that wrote `cli.devMode: true` to `openclaw.json`. Removed because:

1. Zod schema uses `.strict()` on all objects — unknown keys reject entire config
2. Reverting to stock openclaw code (without `devMode` in schema) makes config invalid
3. Gateway crashes in a loop because config validation fails on every startup
4. Only fix is manually editing JSON to remove the `cli` section

The env var approach is immune: `.env` is a flat file no schema can reject.

### Global State

`src/globals.ts` — `isDevMode()` simply checks `process.env.OPENCLAW_DEV_MODE === "1"`. No `setDevMode()`, no `globalDevMode` variable. Pure env var check.

### Startup Flow

1. `src/cli/run-main.ts` — `loadDotEnv()` loads `~/.openclaw/.env` into `process.env`

### The Security & Fix Items

Each one is a minimal `if (isDevMode()) { ... }` check in the relevant source file:

| ID      | File                                                                             | What it does                                                                                    |
| ------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| SEC-15a | `src/agents/system-prompt.ts`                                                    | Removes safety-first paragraph; keeps self-preservation line per Ariel's decision               |
| SEC-27  | `src/security/channel-metadata.ts` + `src/auto-reply/reply/untrusted-context.ts` | Returns plain text instead of UNTRUSTED wrapper; header says "Channel context:"                 |
| SEC-59  | `src/commands/onboard-config.ts`                                                 | Skips tools profile default in onboarding                                                       |
| ~~SEC-67~~ | ~~`src/agents/agent-settings.ts`~~                                            | SKIPPED in V2026.6.11 — Ariel has future compaction plans. `resolveEffectiveCompactionMode()` moved from deleted `pi-settings.ts` to `agent-settings.ts` |
| SEC-70  | `extensions/browser/src/browser/navigation-guard.ts`                             | Early return in `assertBrowserNavigationAllowed()` — skips all URL checks                       |
| SEC-71  | `src/agents/tools/web-fetch.ts`                                                  | `resolveFetchMaxResponseBytes()` returns 50MB instead of 2MB                                    |
| SEC-72  | `src/cli/config-cli.ts`                                                          | `runConfigGet` skips `redactConfigObject()` — API keys visible                                  |
| SEC-78  | `src/gateway/control-plane-rate-limit.ts`                                        | `consumeControlPlaneWriteBudget` returns `{ allowed: true, ... }` immediately                   |
| SEC-79  | `src/acp/translator.ts`                                                          | `MAX_PROMPT_BYTES` ternary: 50MB when `isDevMode()`, 2MB otherwise                              |
| ~~SEC-80~~ | ~~`src/gateway/startup-auth.ts`~~                                              | DROPPED in V2026.6.11 — upstream deleted `assertHooksTokenSeparateFromGatewayAuth()` entirely   |
| ~~SEC-96~~ | ~~`src/infra/host-env-security.ts`~~                                           | DROPPED in V2026.3.22 — upstream env sanitization accepted as-is                                |
| SEC-WA1 | `extensions/whatsapp/src/auto-reply/deliver-reply.ts`                             | Replaces responsePrefix with 💭 on reasoning text (opt-in via `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1`) |
| SEC-97 | `src/config/redact-snapshot.raw.ts` + `src/config/redact-snapshot.ts` + `src/config/types.openclaw.ts` + `ui/src/ui/types.ts` + `ui/src/ui/views/config.ts` + `ui/src/ui/app-render.ts` + `ui/src/ui/app.ts` + `ui/src/ui/controllers/config.ts` + `ui/src/ui/dev-mode-boot.ts` | `shouldFallbackToStructuredRawRedaction()` returns `false`; snapshot exposes `devMode` flag to UI which (a) skips Quick Settings, (b) forces raw view, (c) bypasses sensitive-value reveal blur. UI also caches the flag to localStorage (`openclaw:devMode`) so the very first paint after a reload starts in advanced+raw — eliminates the "Quick Settings → flash → raw" jump. |
| SEC-98 | `src/agents/system-prompt.ts`                                                 | Removes approval restrictions + config/update caution lines; appends permissive safety line      |
| SEC-99 | `src/auto-reply/reply/reply-elevated.ts`                                    | `resolveElevatedPermissions()` returns allowed when dev-mode + Full profile — skips all 4 gates |
| SEC-100 | `src/gateway/tool-resolution.ts`                                             | `ownerOnlyGatewayDeny` returns `[]` in dev-mode — `cron`, `gateway`, `nodes` tools available to non-owner callers |
| SEC-101 | `src/agents/agent-tools.ts`                                                  | Skips `filterToolsByMessageProvider()` in dev-mode — all tools available on all channels (Discord, node, etc.) |
| SEC-102 | `src/media/local-media-access.ts`                                            | `assertLocalMediaAllowed()` returns immediately in dev-mode — media tools can read from any path |
| FIX-01  | `src/agents/workspace.ts`                                                        | Writes `MEMORY.md` via `writeFileIfMissing()` after heartbeat template                          |
| ~~FIX-02~~ | ~~`extensions/ollama/src/stream.ts`~~                                         | RESOLVED — duplicate thinking accumulation already removed in V2026.5.2 merge                   |
| FIX-03  | `src/status/status-message.ts`                                                   | `selectionConfig` merges `args.config.agents.defaults` with per-agent override (was per-agent only — caused fallthrough to `DEFAULT_MODEL = "gpt-5.5"` when global default was set but per-agent had no `model` field). Also adds `⚙️ Runtime:` line below `🧠 Model:` so config-vs-runtime drift is visible without log-tailing. Both changes upstream-worthy — see `dev-mode/fix-03.md` |
| FIX-04  | `src/auto-reply/reply/commands-reset.ts`                                         | Gates the hardcoded ACK behind `!isDevMode()` — dev-mode falls through to `null`, restoring the greeting flow via `BARE_SESSION_RESET_PROMPT_BASE`. Affects inbound `/new` and `/reset` on all message channels; TUI `/new` is unaffected. |
| FIX-05  | `src/auto-reply/reply/session.ts`                                                | `skipImplicitExpiry` includes `isDevMode()` when reset not explicitly configured — prevents daily session rollover in dev-mode. Sessions pile up indefinitely unless `session.reset` is explicitly set. |
| FIX-06  | `src/auto-reply/reply/dev-mode-memory-flush.ts` + `commands-compact.ts` + `commands-reset.ts` + `src/auto-reply/reply/agent-runner-memory.ts` | Dev-mode best-effort memory flush on `/compact` and `/new` — flushes a dated `memory/YYYY-MM-DD.md` immediately instead of waiting for the next inbound message (which for `/new` never comes, since the session is wiped first). Standalone helper synthesizes a `FollowupRun` from `HandleCommandsParams` and calls `runMemoryFlushIfNeeded()`; catches `ReplyRunAlreadyActiveError` to skip silently if the session lane is busy. **Gate bypass in `agent-runner-memory.ts` (keep-ours)**: the helper's `entryForFlush` clears `memoryFlushCompactionCount` (bypasses gate #2 `hasAlreadyFlushedForCurrentCompaction`) but `runMemoryFlushIfNeeded` still gated flush on the token threshold inside `shouldRunMemoryFlush` (gate #1) — so `/compact` on a session below the auto-flush threshold skipped the flush entirely (returned before `ensureMemoryFlushTargetFile`, no file created) while manual compaction still ran, masking it. Fix ORs `isDevMode()` into the existing force-flush clause `(shouldForceFlushByTranscriptSize || isDevMode()) && entry != null && !hasAlreadyFlushedForCurrentCompaction(entry)` — bypasses gate #1 in dev mode while preserving gate #2, keeping the auto-compact path bounded to one flush per compaction cycle (no per-message regression). Re-apply after every upstream merge or the gate #1 bypass silently disappears. |

## Tool Restrictions (SEC-16 Analysis)

### 1. Tool Profiles (the starting gate)

`src/agents/tool-catalog.ts` — Profile defines a whitelist. 4 profiles: `minimal` (1 tool), `coding` (16 tools), `messaging` (5 tools), `full` (all tools). Since SEC-59 (v2026.3.2), onboarding defaults to `"messaging"`. Set via `tools.profile` in config or `agents.<id>.tools.profile` per-agent.

### 2. Provider-Based Policies

`src/agents/pi-tools.policy.ts` — Restrict tools per AI model provider via `tools.byProvider.<provider>`. No hardcoded defaults.

### 3. Global Tool Policy

`tools.allow` (whitelist), `tools.deny` (blacklist), `tools.alsoAllow` (additive). No hardcoded defaults.

### 4. Per-Agent Tool Policy

`agents.<id>.tools.allow/deny` — same as global but scoped. No hardcoded defaults.

### 5. Group/Channel Tool Policy

Per group chat restrictions via channel "dock". No hardcoded defaults.

### 6. The Pipeline (7-step sequential filter)

`src/agents/tool-policy-pipeline.ts` — Each step can only REMOVE tools:
1. Profile → 2. Provider profile → 3. Global allow/deny → 4. Global provider → 5. Agent allow/deny → 6. Agent provider → 7. Group policy

### 7. Gateway HTTP Tool Deny List

`src/security/dangerous-tools.ts` — Hardcoded: `sessions_spawn`, `sessions_send`, `cron`, `gateway`, `whatsapp_login` always blocked via HTTP API.

### 8. ACP Dangerous Tools

`src/security/dangerous-tools.ts` — 10 tools require explicit approval via ACP: `exec`, `spawn`, `shell`, `sessions_spawn`, `sessions_send`, `gateway`, `fs_write`, `fs_delete`, `fs_move`, `apply_patch`. Hardcoded, not configurable.

### 9. Subagent Tool Deny Lists

`src/agents/pi-tools.policy.ts` — 8 tools always denied for subagents, 3 additional for leaf subagents. Hardcoded, partially overridable via config.

## Source Files Modified

Infrastructure (1): `src/globals.ts`

Security items — src/ (20): `system-prompt.ts` (SEC-15a + SEC-98), `channel-metadata.ts`, `untrusted-context.ts`, `onboard-config.ts`, `web-fetch.ts`, `config-cli.ts`, `control-plane-rate-limit.ts`, `translator.ts`, `tool-resolution.ts` (SEC-100), `agent-tools.ts` (SEC-101), `local-media-access.ts` (SEC-102), `workspace.ts`, `redact-snapshot.raw.ts` + `redact-snapshot.ts` + `types.openclaw.ts` (SEC-97), `reply-elevated.ts` (SEC-99), `commands-reset.ts` (FIX-04), `session.ts` (FIX-05), `dev-mode-memory-flush.ts` (FIX-06), `commands-compact.ts` (FIX-06), `agent-runner-memory.ts` (FIX-06 — gate #1 threshold bypass in dev mode, keep-ours)

Security items — ui/ (6, all SEC-97): `ui/src/ui/types.ts`, `ui/src/ui/views/config.ts`, `ui/src/ui/app-render.ts` (skip Quick Settings, force raw view, bypass reveal blur); `ui/src/ui/app.ts`, `ui/src/ui/controllers/config.ts`, `ui/src/ui/dev-mode-boot.ts` (localStorage `openclaw:devMode` hint pre-flips state at `@state()` initializer time so the first paint after a reload skips the Quick-Settings flash)

Security items — extensions/ browser (1): `extensions/browser/src/browser/navigation-guard.ts` (SEC-70)

Security items — extensions/ WA (1): `extensions/whatsapp/src/auto-reply/deliver-reply.ts` (SEC-WA1)

Echo + wa-claw tap (2): `extensions/whatsapp/src/auto-reply/monitor/on-message.ts` (self-chat reasoning echo filter), `extensions/whatsapp/src/session.ts` (wa-claw Baileys socket tap — source-level equivalent of the whatsapp-kapso-claw plugin's `patch-baileys` dist patch; keep-ours on every merge)

Ollama thinking (1): `extensions/ollama/src/stream.ts` (send `think: true` in request body when dev-mode; upstream handles thinking extraction natively, only the request-side injection remains ours)

OpenAI reasoning: DROPPED in V2026.5.12. Upstream now sets `reasoning.summary: "auto"` natively.

Build fixes (2): `scripts/lib/bundled-plugin-build-entries.mjs` + `package.json` `files` (remove `whatsapp` from upstream's build-exclusion lists so the patched WhatsApp compiles into `dist/` — keep-ours on every merge; see "WhatsApp Extension — The Heart of This Fork")

Status display fix (1): `src/status/status-message.ts` (FIX-03 — `selectionConfig` merge + `⚙️ Runtime:` line)

Fork-customized (keep-ours on every merge — NOT a SEC patch): `README.md` (the fork's "OpenClaw Dev Mode" landing page).

Dropped patches (no longer in codebase): SEC-67 (SKIPPED), SEC-80 (upstream deleted function), SEC-96 (upstream accepted), FIX-02 (already resolved), `stage-bundled-plugin-runtime.mjs` (script deleted upstream), `tsdown-build.mjs` (dead code removed)

## Key OpenClaw Internals

- **Commander.js** for CLI parsing
- **Zod** for config schema validation (`.strict()` rejects unknown keys!)
- **Config flow**: JSON5 file → Zod validation → runtime defaults merge → `loadConfig()`
- **`loadConfig()` internally calls `loadDotEnv`** when using real `process.env` — use `createConfigIO({ env: { ...process.env } })` to avoid
- **Runtime overrides**: `setConfigOverride(key, value)` — runtime-only, not persisted
- **Plugin system**: `openclaw.plugin.json` manifest + `register(api)` entry point
- **Plugins discovered from**: `plugins.load.paths` config + `extensions/` directory
- **Route-first commands**: `tryRouteCli()` handles `config get`, `health`, `status` — bypass Commander preAction hooks
- **Pre-action hooks**: `src/cli/program/preaction.ts` runs before every Commander CLI command
- **Gateway**: systemd service, runs `dist/index.js gateway --port PORT`
- **Bootstrap files**: MEMORY.md etc, injected into agent context, max 20K chars per file
- **.env loading**: `loadDotEnv()` loads CWD `.env` first, then `~/.openclaw/.env` (global fallback)

## Key Gotchas

- **oxlint curly rule**: All `if` statements must use braces, even one-liners
- **restrict-template-expressions**: `catch (err)` gives `unknown` — use `err instanceof Error ? err.message : String(err)`
- **Zod strict()**: Adding fields to config JSON not in schema crashes gateway
- **loadDotEnv duplication**: `loadConfig()` internally calls `loadDotEnv` — use `createConfigIO({ env: { ...process.env } })` to skip
- **CLAUDE.md symlink→file migration**: VPS had CLAUDE.md as a symlink (`120000` git mode). Changing it to a real file causes `git reset --hard` to fail with "File name too long". Fix: `git config core.symlinks false`, reset, then `git config --unset core.symlinks`.
- **Config version mismatch**: Running older OpenClaw (3.11) with config last touched by newer (3.14) produces noisy warnings. Run `openclaw doctor --fix` to re-stamp.
- **`bindings` is a top-level config key**, not under `agents`. Putting it under `agents` causes Zod rejection.
- **Discord account `allowFrom`**: For a user to message in a Discord channel, their user ID must be in BOTH the guild `users` list AND the account-level `allowFrom`. Missing from either = messages silently dropped.
- **Discord token format**: Valid Discord bot tokens are ~72 chars. Longer tokens (100+) are likely corrupted/encoded. Always verify with a fresh token from Discord Developer Portal.

## VPS Operational Lessons

### Gateway Restart Can Break WhatsApp (2026-03-22)

Config changes (e.g. agent modifying `openclaw.json` to clean sessions) trigger automatic gateway restart. On V3.11, this can corrupt the WhatsApp Signal Protocol encryption session. Symptoms: "Decrypted message with closed session" warnings, "Bad MAC" errors from libsignal, messages queuing server-side for 5-10+ min then arriving in a burst. Fix: another `openclaw gateway restart` to get a fresh WA session.

**Lesson**: Be aware that any config write triggers a gateway reload/restart. After restart, verify WhatsApp is responsive — don't assume it reconnected cleanly.

### WA Listener Takes ~2 Minutes After Upgrade Restart (2026-04-23)

After `openclaw gateway restart` following an upstream upgrade, `openclaw gateway status` can return `Connectivity probe: ok` and `Capability: admin-capable` while WhatsApp is still warming up. `openclaw message send --channel whatsapp` will return `No active WhatsApp Web listener (account: default)` for roughly 2 minutes after restart. This is normal post-upgrade warm-up — wait and retry before assuming the upgrade broke WA. If still failing after ~2 min, check `/tmp/openclaw/openclaw-YYYY-MM-DD.log` for real errors.

### Two WhatsApp Channels — Implicit Sends Fail (2026-07-02)

Since the whatsapp-kapso-claw plugin registered a second WhatsApp-family channel, any send WITHOUT an explicit
channel fails: `Channel is required when multiple channels are configured: whatsapp, whatsapp-kapso.` The dormant
dummy channel counts as a candidate — `src/infra/outbound/channel-selection.ts` checks configured+enabled (not
connected) and throws for >1 with no tie-break. Always pass `--channel whatsapp` (CLI) / `channel: "whatsapp"`
(agent message tool). Agents self-heal off the error text; the VPS agent is also taught this in
`~/.openclaw/workspace/TOOLS.md` (appended 2026-07-03). Do NOT "fix" it by disabling the kapso channel — see the
invariants in the WhatsApp Message History section (it kills the plugin). If the friction ever matters, the clean
fix is a dev-mode tie-break in channel-selection.ts (candidate FIX-07, deliberately not shipped).

### VPS Watchdog Flags Our Own SSH Bursts as Attacks (2026-07-02)

Ariel's on-VPS agent monitors auth.log and escalates to his WhatsApp ("30+ root logins in the past hour, same key —
shall I block the IP?") when a Claude Code session runs many one-command-per-connection SSH calls — exactly our
documented access pattern (sub-2-second sessions, key comment `claude-code-dev-vps`). Before treating such an alert
as a real incident: correlate the timestamps with our own session activity and check the reported key fingerprint.
Never block the source IP or revoke that key on the strength of the burst alone — it locks this machine out of the
VPS.

## Upstream Upgrade Lessons

### V2026.3.13 WhatsApp Disaster (2026-03-21)

Upgraded from 3.11 to 3.13/3.14. WhatsApp became unusable — echoing messages, dropping connections, losing credentials. Root cause: upstream did a massive WhatsApp extension refactor (15K+ lines rewritten, monolithic `channel.ts` split into 110 files). The refactor broke the append recency filter (causing echoes) and had creds persistence issues. Both fixes exist but were still in upstream's "Unreleased" section at time of upgrade.

**Decision**: Rolled back to V2026.3.11. Don't upgrade until upstream tags a release with the WA reconnect fix (`843e3c1efb`) confirmed stable.

**Lesson**: Before merging upstream, check `git diff --stat` on `extensions/whatsapp/` — if it's a massive rewrite, test WhatsApp thoroughly before deploying to VPS.

### V2026.3.22 Upgrade (2026-03-23)

Upgraded from 3.11 to 3.22 (3,469 commits). Only 6 merge conflicts (expected 16 — git auto-merged the rest). WhatsApp echo fix `843e3c1efb` confirmed working. No echo/duplicate/Bad MAC issues post-upgrade.

**Extension deps on VPS**: Extensions are separate workspace packages. `npm install --ignore-scripts` at root does NOT install their deps. Use the generic command from "Extension deps" in VPS Deployment section above — it reads all `extensions/*/package.json` and installs their dependencies.

**WhatsApp loads from source, not dist** — ⚠️ STALE since V2026.5.12. Was true 2026-03 → 2026-05: WhatsApp ran as TypeScript from `extensions/whatsapp/` at runtime. V2026.5.12 made WhatsApp a ClawHub-published plugin (`@openclaw/whatsapp`); it now MUST be built into `dist/extensions/whatsapp/`. See "WhatsApp Extension — The Heart of This Fork".

**Plugin SDK imports from extensions**: Importing from `openclaw/plugin-sdk/*` in extension code resolves to compiled `dist/plugin-sdk/`. New imports not already used by the extension can fail silently at runtime. Prefer reading from `params.cfg` directly rather than importing new plugin-sdk utilities.

**Reasoning suppression layers**: WhatsApp has THREE layers that suppress `isReasoning: true` payloads:
1. `dispatch-from-config.ts` — `onBlockReply` callback kills `isReasoning` payloads
2. `dispatch-from-config.ts` — final reply loop kills `isReasoning` payloads
3. `process-message.ts` — `info.kind !== "final"` kills all block replies

**How Ollama reasoning bypasses all 3 layers**: Ollama reasoning is NOT an `isReasoning: true` payload. It's inline text in the final response (containing `"Reasoning:\n_..._"`). Layers 1-3 only filter `isReasoning` flag payloads. SEC-WA1 in `deliver-reply.ts` regex-replaces the prefix to `💭 Reasoning:`, and `shouldSuppressReasoningReply()` then fails to match (because `💭` prefix doesn't start with `[` and isn't stripped by the regex). Codex sends `isReasoning: true` with empty `thinking` text — killed by Layer 1 before even reaching delivery.

**Echo cache timing**: The WhatsApp echo cache stores `payload.text` in `process-message.ts` (via `rememberSentText`) AFTER `deliverWebReply()` returns. Since SEC-WA1 modifies `replyResult.text` inside `deliverWebReply()`, the echo cache stores the `💭`-modified text — matching what WhatsApp echoes back. Command responses (e.g. `/new` → "New session started") bypass the echo cache entirely because they're sent through the command handler, not the auto-reply pipeline.

**Ollama Gemini 3 Flash**: `ollama/gemini-3-flash-preview:cloud` has issues with Ollama's native `/api/chat` endpoint (tool parsing errors, thinking tag issues). Workaround: set the model's `api` to `"openai-completions"` in config, which routes through Ollama's OpenAI-compatible `/v1/chat/completions` endpoint instead. This bypasses thinking tags entirely. Can be done per-model in `models.providers.ollama.models[]` config without code changes.

**`ollama-web-tools.service`**: Disabled on VPS (2026-03-23). Replaced by the bundled Ollama web search provider. Service was at `/root/.openclaw/workspace/JarvisDeLaAriGitHub/ollama-web-tools/main.py`.

### V2026.3.24 Upgrade (2026-03-27)

Upgraded from 3.22 to 3.24 (585 upstream commits). Clean merge. WhatsApp identity refactor (`3b6d980c52`) replaced `msg.senderE164`/`msg.selfE164` with helper functions from new `identity.ts` — SEC-WA1 code in `deliver-reply.ts` unaffected (different file). `reasoningDefault` config key rejected by Zod schema (`agents.defaults: Unrecognized key: "reasoningDefault"`) — reasoning works via session-level `/reason on` command instead.

**Gateway is user-level systemd**: Not at `/etc/systemd/system/` but at `~/.config/systemd/user/openclaw-gateway.service`. `journalctl -u openclaw-gateway` returns no entries — use file logs at `/tmp/openclaw/openclaw-YYYY-MM-DD.log` instead. `openclaw gateway status` shows correct service info.

**Debug patching compiled dist**: When adding temp debug logging to compiled `dist/*.js` files on VPS, use `writeFileSync` (already imported from `node:fs` at top of ESM files). Do NOT use `require("fs")` — it fails silently in ESM context. Always restore dist from git after debugging: `git config core.symlinks false && git checkout -- dist/file.js && git config --unset core.symlinks`.

### V2026.4.5 Upgrade (2026-04-07)

Upgraded from 3.24 to 4.5 (~6300 upstream commits). 9 content conflicts + 8 CI workflow deletions. Two files deleted upstream and moved to extensions:
- `src/agents/ollama-stream.ts` → `extensions/ollama/src/stream.ts`
- `src/browser/navigation-guard.ts` → `extensions/browser/src/browser/navigation-guard.ts`

**Pre-merge cleanup strategy**: Revert our dev-mode patches in deleted files to upstream v2026.3.24 BEFORE merging. This lets git cleanly delete them instead of producing "deleted by them, modified by us" conflicts. Re-apply patches to new locations after merge. Cleaner than resolving deletion conflicts mid-merge.

**Extension code can't import from src/globals.ts**: Files in `extensions/` are plugins — they can't import from `../../globals.js`. Use `process.env.OPENCLAW_DEV_MODE === "1"` directly instead of `isDevMode()`.

**Config schema migration required**: V2026.4.5 renames Discord `channels.discord.accounts.<id>.guilds.<id>.channels.<id>.allow` → `.enabled` and moves TTS keys from `messages.tts.<provider>` → `messages.tts.providers.<provider>`. Gateway refuses to start until fixed. Run `openclaw doctor --fix` after upgrade.

**process-message.ts refactored**: Upstream split the monolithic `process-message.ts` into `process-message.ts` (dispatcher), `inbound-dispatch.ts` (dispatch logic), `inbound-context.ts` (visibility filtering). Our inline `deliver` callback was removed — upstream extracted delivery into `dispatchWhatsAppBufferedReply()`. SEC-WA1 still works because it's in `deliver-reply.ts` which is called by the new dispatcher.

**Upstream echo fix**: `e45533d568` adds ID-based outbound message tracking (`isRecentOutboundMessage()`) at the inbound reception layer. Broader than our pattern-based reasoning filter. Our echo loop fix is now defense-in-depth, not primary.

**Upstream reasoning suppression**: New `shouldSuppressWhatsAppPayload()` in `inbound-dispatch.ts` explicitly suppresses `isReasoning=true` and `isCompactionNotice=true` payloads. SEC-WA1 still works because Ollama reasoning is inline text, not an `isReasoning` flag payload.

**OpenAI WS stream refactored**: Payload construction extracted into `buildOpenAIWebSocketResponseCreatePayload()` and `planTurnInput()`. Our reasoning summary injection (`reasoning.summary: "auto"`) moved to after `requestPayload` is built.

**Web search registry files deleted**: `bundled-web-search-ids.ts`, `bundled-web-search-provider-ids.ts`, `bundled-web-search-registry.ts` all removed upstream (replaced by manifest-derived contracts). Our Ollama web search provider additions were already removed — no conflict.

**New upstream config knobs** (potential alternatives to patching):
- `agents.defaults.systemPromptOverride` — full system prompt replacement (replaces EVERYTHING including context files; useful for testing, not for replacing SEC-15a)
- `sandbox.tools.alsoAllow` — re-enable specific tools blocked by sandbox
- `agents.defaults.contextInjection: "continuation-skip"` — skip bootstrap on continuation turns

**IMPORTANT — Check Zod schema defaults after every upstream upgrade**: New Zod defaults OR scalar→object coercions that aren't already in `~/.openclaw/openclaw.json` silently break the Control UI Raw config editor (`config.get` returns `raw: null` because the round-trip check in `src/config/redact-snapshot.raw.ts` compares Zod-coerced `snapshot.config` against the parsed raw file). `openclaw doctor --fix` does NOT materialize these. Symptom: Raw tab in the dashboard is unclickable. After every upgrade, diff `snapshot.config` vs. `JSON5.parse(snapshot.raw)` and update the raw file explicitly.

**Diff recipe** (run on VPS): drop a `.mts` script under `dev-mode/` that imports `readConfigFileSnapshot` from `src/config/io.ts`, parses `snap.raw` via `JSON5`, deep-compares to `snap.config`, and prints per-path diffs. Run with `./node_modules/.bin/tsx dev-mode/diff-cfg.mts`. Must be placed inside the project (not `/tmp`) so `json5` resolves. Delete after use.

**Known round-trip breakers** (add these to `~/.openclaw/openclaw.json` after upgrades):
- `channels.discord.groupPolicy` (V2026.4.5)
- `plugins.entries.ollama.config` / `openai.config` / `browser.config` (V2026.4.5 — empty `{}` fine)
- `channels.discord.streaming` and `channels.discord.accounts.<id>.streaming`: **scalar `"off"` must become object `{ "mode": "off" }`** (V2026.4.9 — Zod now coerces scalar into object form, old scalar raw trips the round-trip check).
- `messages.tts.provider`: **`"edge"` must become `"microsoft"`** (V2026.4.24 — TTS provider name renamed; Zod coerces old name to new canonical).

**Post-deploy verification**: After any upstream upgrade deploy, ASK ARIEL to open the dashboard and click the Raw tab. If it's unclickable, the round-trip is still broken — re-run the diff recipe.

### V2026.4.24 Upgrade (2026-04-26)

Upgraded from 4.22 to 4.24 (~1338 upstream commits). Build clean. No files deleted upstream. No config schema migration required (Zod check passed — one new round-trip breaker; see below).

**Critical new requirement: self-ref symlink.** Since V2026.4.24, bundled extension dist files import `openclaw/plugin-sdk/*` (self-reference to the package). Node.js ESM resolution needs `node_modules/openclaw` to point back to the project root. Without this symlink, the gateway boots (plugins load) but WA channel startup fails, model warmup fails, and any bundled extension using plugin-sdk crashes. Fix (already applied on VPS):
```
ln -sf /opt/openclaw-dev-mode /opt/openclaw-dev-mode/node_modules/openclaw
```
This symlink is in `.gitignore` (it's inside `node_modules/`) so it must be recreated after each fresh clone and after `npm install` if it gets cleared. Added to both the install recipe and the update recipe in CLAUDE.md.

**Staging script fallback used.** `node scripts/stage-bundled-plugin-runtime-deps.mjs` errored with "runtime dependency closure must resolve from the installed root workspace graph" for `amazon-bedrock-mantle` (unresolved `@aws/bedrock-token-generator`). Fell back to the documented fallback: `rm -rf dist-runtime/extensions/*/node_modules && openclaw gateway restart`. Plugin self-heal installed `browser` and `whatsapp` runtime deps on first start (~7s and ~11s respectively). No issues.

**Conflict resolution summary:** (all conflicts resolved in the merge commit `41e41b2a36`)
- `src/agents/system-prompt.ts` (SEC-15a + SEC-98): kept our `isDevMode()` gates around upstream's updated prompt text additions (forked subagent context, Codex app-server lines)
- `src/commands/onboard-config.ts` (SEC-59): took upstream's `applySkipBootstrapConfig` addition; our SEC-59 early return preserved
- `src/agents/pi-embedded-runner/extensions.ts` (SEC-67): took upstream's middleware factory additions + `runtime: "pi"` rename + `qualityGuardEnabled: true` default; re-attached our `if (isDevMode()) return "default"` in `resolveCompactionMode()`
- `extensions/browser/src/browser/navigation-guard.ts` (SEC-70): took upstream's proxy-mode refactor (`BrowserNavigationProxyMode` type, `explicit-browser-proxy` check); kept our `process.env.OPENCLAW_DEV_MODE === "1"` early return at top of `assertBrowserNavigationAllowed`
- `src/agents/tools/web-fetch.ts` (SEC-71): auto-merged; our `resolveFetchMaxResponseBytes()` 50MB return preserved
- `src/cli/config-cli.ts` (SEC-72): auto-merged; our `runConfigGet` redact skip preserved
- `src/agents/workspace.ts` (FIX-01): took upstream's `reconcileWorkspaceBootstrapCompletion` + `WORKSPACE_ONBOARDING_PROFILE_FILENAMES` additions; FIX-01 `writeFileIfMissing(memoryPath, ...)` **kept** — upstream does not yet write MEMORY.md natively in `ensureAgentWorkspace`
- `src/agents/openai-ws-stream.ts` (OpenAI reasoning): took upstream's `convertResponseToInputItems` + `planOpenAIWebSocketRequestPayload` restructure; re-attached `reasoning.summary: "auto"` injection after `fullPayload` build
- `extensions/whatsapp/src/auto-reply/deliver-reply.ts` (SEC-WA1): took upstream's `normalizeWhatsAppOutboundPayload` + `sendWhatsAppOutboundWithRetry` refactor; re-attached SEC-WA1 regex mutation on `replyResult.text` **before** the normalization call
- `extensions/whatsapp/src/auto-reply/monitor/on-message.ts` (echo filter): took upstream's preflight audio transcription addition; our self-chat reasoning echo filter kept before the audio path
- `extensions/whatsapp/src/session.ts` (WA history): took upstream's `qrcode-tui` replacement for `qrcode-terminal`; our `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES` activation preserved

**FIX-01 kept.** Upstream's workspace refactor adds profile-setup detection but does not seed MEMORY.md natively. Our `writeFileIfMissing(memoryPath, memoryTemplate)` call is still needed.

**plugins.allow state.** The 10-plugin set from the 2026-04-25 rescue incident is unchanged: `acpx, browser, device-pair, memory-core, ollama, openai, openclaw-web-search, phone-control, talk-voice, whatsapp`. Post-upgrade boot showed only 8 plugins in the `ready` line — `ollama` and `openai` not listed, but `agent model: ollama/kimi-k2.6:cloud` appears without error. They appear to be loaded as model-provider plugins via a different registration path (not counted in the `ready (N plugins)` line). Functional — model warmup succeeded on the clean boot.

**Round-trip diff result.** One new breaker: `messages.tts.provider: raw="edge" cfg="microsoft"`. The TTS provider name was renamed from `"edge"` to `"microsoft"` in V2026.4.24; Zod coerces the old value. **Action needed by Ariel**: change `messages.tts.provider` from `"edge"` to `"microsoft"` in `~/.openclaw/openclaw.json` to fix the Raw config editor tab.


### V2026.5.2 Upgrade (2026-05-03)

**Self-ref symlink possibly obsolete.** Per audit: upstream's new `root-alias.cjs` + `sdk-alias.ts` resolve `openclaw/plugin-sdk/*` programmatically without filesystem self-ref. **Action**: deploy WITHOUT the symlink first; if WA/model warmup fails with `Cannot find package 'openclaw'`, restore it. CLAUDE.md is conservative — keeps the symlink in the layout description marked as "possibly obsolete" until proven on VPS.

**Extension patches re-applied** (commit `a9263a0787`):
- `extensions/whatsapp/src/auto-reply/deliver-reply.ts` (SEC-WA1): re-applied at lines 50–58 (new function signature `Promise<WhatsAppReplyDeliveryResult>`, new `normalizedReplyResult` optional input, new `WhatsAppSendResult[]` plumbing — our regex mutation runs BEFORE all of it)
- `extensions/whatsapp/src/auto-reply/monitor/on-message.ts` (echo filter): re-applied at lines 121–135, between echo tracker check and the new `runAudioPreflightOnce` declaration (upstream hoisted preflight ahead of group-gating)
- `extensions/whatsapp/src/session.ts` (WA history): re-applied at lines 220–229 (added between `connection.update` handler and WebSocket error handler)
- `extensions/ollama/src/stream.ts` (body.think): re-applied at lines 1049–1052, after the new `buildOllamaChatRequest({...requestParams: resolveOllamaTopLevelParams(model)})` call (FIX-02 dropped — upstream's `resolveOllamaThinkParamValue()` makes manual accumulation redundant)
- `extensions/browser/src/browser/navigation-guard.ts` (SEC-70): re-applied at lines 96–98 (early return at top of `assertBrowserNavigationAllowed`)


## CI Pipeline

`pr-ready` branch deleted — CI no longer relevant for us. For reference, upstream CI runs: `pnpm format:check`, `pnpm tsgo`, `pnpm lint`, `pnpm test`, `bunx vitest run`, `pnpm protocol:check`, build artifacts, secrets scan, etc.


### Ollama Thinking Support (dev-mode)

`extensions/ollama/src/stream.ts` (moved from `src/agents/ollama-stream.ts` in V2026.4.5) — Three changes to enable Ollama thinking in dev-mode:
1. Sends `think: true` in Ollama API request body when `isDevMode()`
2. Accumulates `message.thinking`/`message.reasoning` from streamed chunks
3. Converts accumulated thinking to `{ type: "thinking", thinking: "..." }` content blocks in `buildAssistantMessage()`

Controlled by: `agents.defaults.thinkingDefault: "high"` + `agents.list[].reasoningDefault: "on"` in config.


### SEC-WA1: WhatsApp Thinking Messages

Opt-in via `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES=1` in `.env` (requires `OPENCLAW_DEV_MODE=1`). Located in `deliver-reply.ts` — replaces `responsePrefix...Reasoning:` with `💭 Reasoning:` via regex. Applied inside `deliverWebReply()` so it covers ALL delivery paths. The `shouldSuppressReasoningReply()` function in the same file then fails to match the `💭` prefix, allowing the message through.

**Only works for Ollama** — Ollama reasoning is inline text in the final response. Codex/OpenAI reasoning uses `isReasoning: true` flag payloads which are suppressed by 3 layers in `dispatch-from-config.ts` and `process-message.ts`. See "Codex Reasoning — Closed" below.

### WhatsApp Self-Chat Echo Loop Fix (2026-03-27)

`extensions/whatsapp/src/auto-reply/monitor/on-message.ts` — In dev-mode self-chat (`from === to`), skips inbound messages matching reasoning echo patterns: `[prefix] Reasoning:`, `💭 Reasoning:`, or bare `Reasoning:`. Without this, reasoning echoes bypass the echo tracker (text mismatch from SEC-WA1 prefix swap) and trigger an infinite reply loop, especially after `/new` session.

**Root cause**: In self-chat, the echo tracker stores text AFTER SEC-WA1 modifies it, but WhatsApp echoes back the same modified text — normally this should match. However, command responses like "✅ New session started" bypass the echo cache entirely (sent via command handler, not auto-reply pipeline). Their echoes trigger the agent, which produces reasoning that echoes, creating a feedback loop.

**The filter only catches reasoning patterns** — not all bot-prefixed messages. `[openclaw] 🦞 ...` is the user's own self-chat prefix too.

### WhatsApp Message History — moved to the whatsapp-kapso-claw plugin (2026-07-02)

WA message history recording and the WhatsApp Claw panel now live in the standalone
`whatsapp-kapso-claw` OpenClaw plugin (repo: `C:\Users\Ariel\source\openclaw chaos mode\openclaw-whatsapp-claw`,
installed on the VPS from its npm-pack tgz). The fork no longer contains a history logger —
`extensions/whatsapp/src/dev-mode/` was deleted 2026-07-02 and the
`OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES` env flag is retired.

What the fork DOES carry (keep-ours on every merge): the **wa-claw socket tap** in
`extensions/whatsapp/src/session.ts`, right before `return sock;`:
`(globalThis.__waClawSocks ??= []).push(sock); globalThis.__waClawSockTap?.(sock);`
This is the source-level equivalent of the plugin's `openclaw wa-claw patch-baileys` binary
dist patch (which only scans ClawHub npm-managed installs and cannot see this fork's bundled
WhatsApp). The plugin's `installBaileysTap()` drains `__waClawSocks` and registers
`__waClawSockTap`, so plugin/extension load order doesn't matter. The tap is inert when the
plugin isn't installed. Panel: served by the plugin on the gateway HTTP listener at
`/whatsapp-kapso/panel/` (nginx proxies HTTPS :17890 → gateway :18789 for that path).
Panel auth: `plugins.entries.whatsapp-kapso-claw.config.panelToken` (Bearer).

**Deployed to the VPS 2026-07-02**: installed via `openclaw plugins install npm-pack:whatsapp-kapso-claw-0.1.0.tgz`
(lands under `~/.openclaw/npm/projects/whatsapp-kapso-claw/`, loader origin "global"; the installer auto-appended
the id to `plugins.allow`). History db MOVED to the plugin's default `~/.openclaw/wa-claw-kapso/wa-claw-baileys.db`
(schema-identical to the old logger's); compat symlinks left at the old `~/.openclaw/dev-mode/` names; pre-migration
backup at `~/.openclaw/dev-mode/openclaw-whatsapp-claw.db.bak-20260702`. The old standalone `wa-claw.service` (+ its
loopback :18790 listener) is retired; nginx `/etc/nginx/conf.d/wa-claw.conf` now proxies HTTPS :17890 (ufw open) →
gateway :18789, panel path only. Panel URL needs the trailing slash: `https://<vps>:17890/whatsapp-kapso/panel/`.

**⚠️ `channels.whatsapp-kapso` invariants** (the block holds DUMMY Kapso creds + `deliveryMode: "domain"` + junk
webhook secrets — fully dormant, zero polling, deny-all inbound):

1. The block MUST exist and be schema-valid — without it the host loads only the plugin's setup entry and the
   tap/recorder/panel silently never register (`shouldLoadChannelPluginInSetupRuntime` → `isChannelConfigured`).
2. NEVER add undeclared keys — the manifest channel schema is `additionalProperties: false`, and e.g. `baileysDbPath`
   is read by plugin code but NOT declared in the schema: setting it makes config validation throw → gateway
   crash-loop until the JSON is hand-fixed.
3. NEVER set `enabled: false` — same silent plugin-death as (1).

Since 2026-07-03 the channel block holds Ariel's REAL Kapso sandbox creds (`deliveryMode: "polling"`; key
recorded in the plugin repo's `docs/.env`) — `openclaw wa-claw preflight` exits 0; only cosmetic WARNs remain
(`baileys tap` — its detector only knows ClawHub npm layouts — and silent-reply policy). Don't chase them.

### Adding a Kapso agent for a new number (recurring request)

When Ariel says "create a kapso agent for +9725XXXXXXX" he means EXACTLY this, on the VPS — nothing more.
All writes hot-reload in-process (no restart, Baileys socket untouched). `cp /root/.openclaw/openclaw.json
/root/.openclaw/openclaw.json.bak-<name>` first, then:

1. Next indices: `AN=$(node -e "console.log(require('/root/.openclaw/openclaw.json').agents.list.length)")`;
   same for `BN` with `.bindings.length`.
2. Agent (messaging profile): `openclaw config set "agents.list[$AN]" '{"id":"kapso-<name>","name":"Kapso <Name>","workspace":"/root/.openclaw/workspaces/kapso-<name>","tools":{"profile":"messaging"}}' --strict-json`
3. Kapso channel binding: `openclaw config set "bindings[$BN]" '{"agentId":"kapso-<name>","match":{"channel":"whatsapp-kapso","peer":{"kind":"direct","id":"+<number>"}},"session":{"dmScope":"per-peer"}}' --strict-json`
4. Allowlist: re-set the FULL `channels.whatsapp-kapso` block (all existing keys verbatim, never new ones —
   invariants above) with the number appended to `allowedNumbers`.
5. Round-and-round bridge: `openclaw wa-claw bridge add <digits-no-plus> --note "kapso-<name> round-and-round"`
6. Verify: `[wa-claw] started (mode=polling...)` re-emits in the gateway log; read back agent/binding/allowlist
   with a node one-liner.

Done so far: `kapso-pinhas` (+972508483001), `kapso-elhanan-k` (+972559116367), `kapso-igal` (+972503143391) —
all 2026-07-03.

**LESSON (learned live with kapso-igal, 2026-07-03): an Active sandbox session is NOT enough.** Even with the
number registered and "Already activated" on the Kapso dashboard, every outbound send fails with 422
`Cannot send non-template messages outside the 24-hour window` until the peer sends ONE WhatsApp message of
their own TO the sandbox line. Meta's 24h customer-service window opens only on the peer's direct inbound to
the Kapso number — bridged messages to Ariel's personal line do NOT open or renew it. So after creating a kapso
agent, the peer must message the sandbox bot first; replies then flow for 24h from their last direct message to
that line (after that: another direct message from them, or paid template messages). The agent itself runs fine
the whole time — replies are generated and die only at delivery (`[wa-claw] final reply failed ... 422`).

### V2026.5.4 Upgrade (2026-05-05)

**New upstream deps required.** `web-tree-sitter@^0.26.8` + `tree-sitter-bash` for the new shell command explainer at `src/infra/command-explainer/`. The `pnpm build:plugin-sdk:dts` step fails until `pnpm install` runs them in. On VPS the `npm install --ignore-scripts` step in the update recipe handled it automatically.


### V2026.5.6 Upgrade (2026-05-07)


**FIX-03 introduced.** Discovered during this session — see `dev-mode/fix-03.md` for the upstream-bound issue text. Bug exists on V2026.5.4, V2026.5.5, AND V2026.5.6 verbatim — not a regression, just a long-standing bug surfaced because Ariel's `agents.list[].main` record has no `model` field (relies on global default). Two-line patch in our fork; planning to file upstream.

**Self-ref symlink.** Still required as of V2026.5.6 — VPS update recipe wiped it during `git checkout -- .` and the gateway boot DID need `ln -sf /opt/openclaw-dev-mode /opt/openclaw-dev-mode/node_modules/openclaw` re-applied before restart succeeded. Per V2026.5.2's "possibly obsolete" note: **NOT obsolete**. Keep the symlink restoration step in the update recipe.

**New upstream features in 5.5+5.6 worth knowing:**
- `fix(net): bound guarded fetch dispatcher cleanup` — fixes long-standing fetch hang on timeout
- `fix(plugins): repair managed npm openclaw peers` — plugin install/update reliability
- `fix(sessions): restore Control UI /new hooks` — Control UI session reset works again
- `fix(discord): route guild text commands` (#78080)
- `fix: cap memory wiki filenames for safe writes`
- `fix(line): require wildcard for open dm policy`
- `fix(feishu): keep topic sessions stable`

### V2026.5.12 Upgrade (2026-05-17)

**OpenAI reasoning patch DROPPED — upstream does it natively now.** `src/agents/openai-ws-stream.ts` (and the whole `openai-ws-*` family) was deleted upstream; the OpenAI WebSocket transport is now `src/agents/openai-transport-stream.ts`. That file sets `reasoning.summary: options?.reasoningSummary || "auto"` whenever reasoning is enabled and effort ≠ "none" (~line 1384). Our dev-mode `reasoning.summary: "auto"` injection is redundant — we deleted the file and re-applied nothing. One fewer patch to carry.

**SEC-67 relocated.** Upstream removed `resolveCompactionMode()` from `pi-embedded-runner/extensions.ts` (callers now use `resolveEffectiveCompactionMode()` in `src/agents/pi-settings.ts`). SEC-67's `isDevMode()` early-return moved into `resolveEffectiveCompactionMode()`; the dead local function + its `isDevMode` import were deleted from `extensions.ts`.

**workspace.ts (FIX-01).** Import-block conflict only — upstream renamed `openBoundaryFile` → `openRootFile` and added `pathExists`/`replaceFileAtomic`. Kept our `isDevMode` import alongside; FIX-01 body auto-merged.

**pnpm wants a full node_modules purge.** `pnpm install` aborts with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` because the merge churned 127 workspace package.json files. Locally: `CI=true pnpm install`. On VPS the `npm install --ignore-scripts` recipe step is unaffected.

**WhatsApp became a ClawHub plugin — fork patches silently bypassed (found + fixed 2026-05-19).** V2026.5.12 excluded WhatsApp from the bundled build and published it as `@openclaw/whatsapp` on ClawHub. The upgrade's `repairMissingConfiguredPluginInstalls` auto-installed the stock package into `~/.openclaw/extensions/whatsapp/`, which the loader ranks above the in-repo extension. Result: SEC-WA1, the echo filter, and the WA history logger all went dead; `wa-history.db` froze at 2026-05-17 20:43. Fix: removed `whatsapp` from `EXCLUDED_CORE_BUNDLED_PLUGIN_DIRS` + `package.json` `files`, moved `wa-history.ts` into `extensions/whatsapp/src/dev-mode/` so it bundles, and removed the stock managed install on the VPS. See "WhatsApp Extension — The Heart of This Fork". **Recurring merge hazard** — upstream will re-add both exclusions on every merge; keep-ours.


## Project File Structure (our additions)

```
dev-mode/
  README.md                       -- Fork install guide and feature table
  list.sec/                       -- Individual implementation plans
```
