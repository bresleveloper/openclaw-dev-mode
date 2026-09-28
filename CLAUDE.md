# OpenClaw Dev Mode

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw
- **Fork point**: commit `029c47372` (V2026.3.2)
- **Current base**: V2026.7.1 on `main` (deployed 2026-07-21).
- **Upgrade in progress**: V2026.9.6 on branch `upgrade-2026.9.6` (clean-room from tag `v2026.9.6`, ported 2026-09-27/28, NOT yet deployed/promoted). See "V2026.9.6 Upgrade" below — FIX-05/FIX-06/Ollama-think dropped (upstream native), SEC-WA1 + SEC-97 UI rebuilt, SEC-98 now bans agent-driven updates.
- **Previous bases**: V2026.6.11 (2026-07-01), V2026.7.1 (2026-07-21; kapso plugin removed, WA history back in-fork, only `OPENCLAW_DEV_MODE=1` gates anything).
- **Purpose**: Add dev-mode flag to OpenClaw that relaxes security features for dev environments

## Branches

- `main` — Ariel's ONLY long-lived branch. At the V2026.7.1 base. Has `dist/` + `packages/ai/dist/` committed for easy VPS deployment. This is about making life easier — experimental, practical, no polish needed.
- `upgrade-2026.9.6` — clean-room V2026.9.6 port (local, unpushed until Ariel approves). Promote the same way as 7.1: deploy, then force-move `main` onto it and delete the branch.
- Tag `main-pre-2026.7.1` (pushed to origin) preserves the old V2026.6.11-era main head (`244849d3575`) — the only remaining pointer to pre-7.1 fork history. Tag the 7.1-era `main` head the same way (`main-pre-2026.9.6`) before force-moving.
- Future upgrades: same clean-room pattern — branch from the upstream tag, re-apply patches, deploy, then force-move `main` and delete the branch.

## Post-Merge Cleanup Checklist (run after EVERY upstream merge)

Upstream re-introduces things this fork doesn't want. Each item below is recurring — verify and fix after every merge, before pushing/deploying:

1. **Remove GitHub Actions workflows** — `git rm -r .github/workflows` (106 files at 9.6). This fork has no CI. Leave non-workflow `.github/` content alone.
2. **Keep-ours on the WhatsApp build exclusion** — since 9.x the ONLY source is `package.json` `files` (`!dist/extensions/whatsapp/**`); `scripts/lib/root-package-bundled-plugin-excludes.mjs` derives the build excludes from it (`EXCLUDED_CORE_BUNDLED_PLUGIN_DIRS` is gone). Delete that line. If it slips back, the build DELETES `dist/extensions/whatsapp` and the VPS falls back to the stock ClawHub package. See "WhatsApp Extension — The Heart of This Fork".
3. **Keep-ours on `README.md`** — the fork's "OpenClaw Dev Mode" landing page (NOT a SEC patch).
4. **Stage dist with `git add -f dist/`** — `dist/` is in `.gitignore` but tracked; `git add -A` skips NEW dist chunks from the build and the first VPS gateway start fails with `Cannot find module`. See the ⚠️ note in Build & Deploy.
5. ~~Restore `dist/extensions/tlon`~~ — Windows-only symlink artifact; N/A on Linux builds.
6. **Re-verify dev-mode patches survived** — grep a few `isDevMode()` anchors in src/, and on the VPS after deploy: `grep -rl attachWaHistoryLogger /opt/openclaw-dev-mode/dist/extensions/whatsapp/` must be NON-empty (9.x bundles the fork's WA code under `dist/extensions/whatsapp/`, e.g. `.setup/wa-history-*.mjs`), `grep -rl formatDevModeReasoningPayload /opt/openclaw-dev-mode/dist/extensions/whatsapp/` NON-empty.
7. **Self-referencing symlinks** — the TRACKED `packages/speech-core/node_modules/openclaw` → repo root link (7.1-era `.git`-corruption hazard) is gone at 9.6. `pnpm install` still creates UNTRACKED `node_modules/openclaw` links in ~40 workspace packages; they live in ignored dirs git never traverses — just never `git add -f` anything under `node_modules/`. On a 7.1-era checkout, still `rm packages/speech-core/node_modules/openclaw` (plain rm) before switching branches.
8. **Stage `packages/ai/dist` with `git add -f packages/ai/dist/`** after every build — root `dependencies` has `"@openclaw/ai": "workspace:*"` and root dist chunks import `@openclaw/ai/internal/*` at runtime. It is the ONLY workspace package dist imports at runtime at 9.6 (`@openclaw/session-url-contract` is a devDependency bundled into dist; `@openclaw/fs-safe`/`@openclaw/proxyline` are npm deps). Re-check per upgrade: `grep -rhoE "from ['\"]@openclaw/[a-z0-9-]+" dist | sort | uniq -c` vs root `dependencies`.

## Dev Environment

- **Build machine (since 2026-09)**: Linux laptop (Arch/Omarchy), Node 26.8.1 via mise, pnpm 12.4.0 via `npm i -g pnpm@12.4.0` (Node 26 ships no corepack). Git has no `user.name` configured — commits so far are authored `Claude <noreply@anthropic.com>` via `GIT_AUTHOR_*`/`GIT_COMMITTER_*` env. Earlier notes reference the old Windows PC (`/c/Users/Ariel/...` paths, Windows OpenSSH).
- **VPS**: Linux, has OpenClaw installed with dev-mode. Ariel pulls and tests there.
- **Workflow**: Build/edit code here → push → pull on VPS and restart gateway. Always ask permission before pushing. Always run full `pnpm build` — never cherry-pick individual build steps. Do NOT run openclaw itself locally.

### Delegation: Opus writes code, Sonnet executes simple work

**Refined 2026-09-27 by Ariel** ("while its nice to let sonnet do simple stuff, actuall code changes are for you to do"): the main thread (Opus) writes ALL code changes — patch ports, refactors, any source edit. Delegate to a Sonnet subagent (Agent tool, `subagent_type: general-purpose`, `model: sonnet`) only simple execution: VPS/SSH ops, git fetch, read-only investigations/fan-out analysis, builds/test runs.

Verify subagent claims before acting on them — the 9.6 analysis agents were wrong twice (said the FIX-06 helper compiles unchanged; said `session-url-contract` needs a dist force-add).

**Fork patch style (Ariel, 2026-09-28)**: touch upstream code as little as possible — logic in fork-owned files (`extensions/whatsapp/src/dev-mode/*`, `ui/src/pages/config/dev-mode.ts`), one guarded hook in the upstream file, and comments with a regression checklist.

### SSH Access to VPS

Claude Code can SSH into the dev VPS. Key: `~/.ssh/dev_vps` (on the old Windows PC `C:/Users/Ariel/.ssh/dev_vps`; **not yet present on the Linux laptop as of 2026-09-28** — copy it or `ssh-copy-id` first). Look up IP and port from `~/.ssh/known_hosts`/`~/.ssh/config`.
```
ssh -i ~/.ssh/dev_vps -p <PORT> root@<IP> "COMMAND"
```
Never log VPS connection details (IP, port) in commits or output. Batch commands into few sessions (see "VPS Watchdog" below).

### VPS Layout

- **Fork cloned to**: `/opt/openclaw-dev-mode`
- **Symlinked to**: `/usr/lib/node_modules/openclaw → /opt/openclaw-dev-mode` (CLI install symlink)
- **Self-ref symlink**: `/opt/openclaw-dev-mode/node_modules/openclaw → /opt/openclaw-dev-mode` (required V2026.4.24; **possibly obsolete since V2026.5.2** — upstream's new `src/plugin-sdk/root-alias.cjs` + `src/plugins/sdk-alias.ts` resolve `openclaw/plugin-sdk/*` programmatically. Test deploy WITHOUT the symlink first; if WA/model warmup fails, restore it.)
- **CLI wrapper**: `/usr/local/bin/openclaw` (runs `node /opt/openclaw-dev-mode/openclaw.mjs`)
- **OpenClaw home**: `~/.openclaw/` (config, credentials, sessions, workspace, etc.)
- **Config**: `~/.openclaw/openclaw.json`
- **Env**: `~/.openclaw/.env` (contains `OPENCLAW_DEV_MODE=1` — the only flag that matters since 2026-07-21)
- **WA credentials**: `~/.openclaw/credentials/whatsapp/default/`
- **Gateway**: user-level systemd service `openclaw-gateway.service` (at `~/.config/systemd/user/`), port 18789, loopback
- **Gateway logs**: `/tmp/openclaw/openclaw-YYYY-MM-DD.log` (daily rotation, JSON lines)
- **Node**: v24.18.0 (nodesource apt, verified 2026-07-21)

## Build & Deploy

- **Build**: `pnpm build` (includes `ui:build`; ~11 min on the Linux laptop)
- **Build tool**: tsdown (esbuild-based), output in `dist/`
- **Formatter**: oxfmt (`pnpm exec oxfmt <files>`); it sorts imports — a file-header comment above the first import can end up between imports, keep the header above the import that sorts first
- **Linter**: oxlint (`node scripts/run-oxlint.mjs <files>`); typecheck: `pnpm tsgo:core`, `pnpm tsgo:extensions`, `pnpm tsgo:ui`
- **Tests**: `node scripts/run-vitest.mjs run <paths>` (one command at a time)
- **dist/ is committed** on `main` branch (~3000 files — drowns out real changes in PR diffs)
- **⚠️ `dist/` is in `.gitignore`** but tracked files persist from a prior `git add -f`. `git add -A` updates already-tracked dist files but **silently skips NEW dist files** (new hashed chunks) → first gateway start fails with `Cannot find module`. **Always stage dist with `git add -f dist/` after a build.** (Learned during FIX-06 deploy: second commit `e2441cf1d9` force-added 626 missing chunks.)
- **Package manager**: pnpm everywhere (VPS included — `"@openclaw/ai": "workspace:*"` makes plain `npm install` fail with `EUNSUPPORTEDPROTOCOL`). **9.6 pins pnpm 12.4.0** (major bump from 11.2.2 — upgrade the VPS pnpm on the first 9.6 deploy) and sets `minimumReleaseAgeStrict: true` in `pnpm-workspace.yaml` (a very fresh transitive dep can be refused; report, don't hack the yaml). Use `CI=true pnpm install --ignore-scripts`; if it aborts refusing to remove `node_modules` without a TTY, `rm -rf node_modules` first.
- **Platform**: Build output is platform-independent JS — build locally, deploy to Linux
- **Prerequisites**: Node.js `>=24.16.0 <25 || >=26.1.0` (9.6 engines; 7.1 was `>=24.15 <25`), Git

## WhatsApp Extension — The Heart of This Fork

**This fork exists to add dev-mode WhatsApp features.** `extensions/whatsapp/` carries SEC-WA1 (💭 thinking messages), the self-chat echo filter, and the in-fork WA history logger (`src/dev-mode/wa-history.ts`, hooked from `session.ts`). It MUST be built and deployed as a first-class artifact — do not assume it "just loads from source."

### Why it needs special handling (V2026.5.12)

Upstream V2026.5.12 spun WhatsApp out of the bundled extension set: it's in `EXCLUDED_CORE_BUNDLED_PLUGIN_DIRS` (`scripts/lib/bundled-plugin-build-entries.mjs`) and `!dist/extensions/whatsapp/**` (`package.json` `files`), and is published standalone as `@openclaw/whatsapp` on ClawHub. On a stock setup, `repairMissingConfiguredPluginInstalls` auto-installs the ClawHub package into `~/.openclaw/extensions/whatsapp/` on every upgrade. That managed install (loader `origin: "global"`) **overrides** the in-repo `extensions/whatsapp/` — so the fork's WhatsApp patches are silently bypassed, no error logged. (V2026.5.12 did exactly this: `wa-history.db` froze 2026-05-17 and SEC-WA1 + the echo filter went dead until the 2026-05-19 fix.)

**This fork removes `whatsapp` from both exclusion lists** so `pnpm build` compiles the patched WhatsApp into `dist/extensions/whatsapp/` like every other bundled extension. **Keep-ours on both** during every upstream merge — if an upgrade slips them back, WhatsApp silently reverts to the stock ClawHub package.

### Build & deploy — part of EVERY deploy

- **Build**: `pnpm build` builds `extensions/whatsapp/` → `dist/extensions/whatsapp/`. `dist/` is committed, so the patched WhatsApp ships on `main`.
- **One-time on the VPS** (first deploy after V2026.5.12, already done): remove the stock managed install so the bundled fork build wins — `openclaw plugins uninstall whatsapp < /dev/null` (or `rm -rf ~/.openclaw/extensions/whatsapp`), then `openclaw gateway restart`. Once a bundled WhatsApp exists in `dist/extensions/`, the upgrade repair stops re-installing the ClawHub package (it skips bundled entries).
- **Verify after EVERY deploy**: `grep -rl attachWaHistoryLogger /opt/openclaw-dev-mode/dist/extensions/whatsapp/` non-empty (9.x: fork WA code bundles under `dist/extensions/whatsapp/`, e.g. `.setup/wa-history-*.mjs`; on 7.1 it was root `dist/*.js` chunks). `openclaw plugins list` must show WhatsApp under the `stock`/bundled source root, not `global`. After the first WA message, the gateway log shows `[dev-mode] WhatsApp history logger attached`.

### VPS Deployment

The `main` branch ships with pre-built `dist/`, so no build step is needed on VPS. Clone, `npm install --ignore-scripts`, create self-ref symlink (`ln -sf /opt/openclaw-dev-mode node_modules/openclaw`), symlink to `/usr/lib/node_modules/openclaw`, create CLI wrapper at `/usr/local/bin/openclaw`, add `OPENCLAW_DEV_MODE=1` to `~/.openclaw/.env`, start gateway.

**Update** (V2026.7.1+ recipe — pnpm on VPS, see "Package manager" above):

```
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks && CI=true pnpm install --ignore-scripts && ln -sf /opt/openclaw-dev-mode node_modules/openclaw && openclaw gateway restart
```

(If pnpm aborts on a pre-existing npm-shaped `node_modules`: `rm -rf node_modules` and rerun. The old `npm install --ignore-scripts` recipe died with `EUNSUPPORTEDPROTOCOL` on `workspace:*` since v2026.7.1.)

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
OPENCLAW_DEV_MODE=1   # the ONLY gate — every dev-mode feature hangs off this single flag
```

**All secondary gate flags were retired 2026-07-21** (Ariel: "remove all flags from everywhere and only keep `OPENCLAW_DEV_MODE=1` for everything"). `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES`, `OPENCLAW_DEV_MODE_CLEAR_UI`, `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES` are gone — SEC-WA1 and the WA history logger are unconditional under dev-mode. The only remaining optional env var is `OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT` (FIX-05), which is a **value override, never a gate** — the feature works fully without it.

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

State on branch `upgrade-2026.9.6` (V2026.9.6). Each is a minimal `isDevMode()` gate (core) or `process.env.OPENCLAW_DEV_MODE === "1"` (extensions); larger logic lives in fork-owned `dev-mode` files.

| ID | File (9.6) | What it does |
| --- | --- | --- |
| SEC-15a | `src/agents/system-prompt.ts` | Drops "Safety/oversight > completion" line; keeps self-preservation line and upstream's credential-safety lines (`buildCredentialSafetyPrompt`, kept per Ariel 2026-09-28) |
| SEC-27 | `src/security/channel-metadata.ts` | `buildChannelMetadata()` returns plain `label:\nbody` without the external-content wrapper (only caller: Slack room context). The reply-context half is obsolete: 9.x replaced the UNTRUSTED header with a neutral "Context:" for everyone |
| SEC-59 | `src/commands/onboard-config.ts` | Skips tools profile default in onboarding |
| ~~SEC-67~~ | — | SKIPPED since V2026.6.11 (Ariel's compaction plans) |
| SEC-70 | `extensions/browser/src/browser/navigation-guard.ts` | Early return in `assertBrowserNavigationAllowed()` — skips all URL checks |
| SEC-71 | `src/agents/tools/web-fetch.ts` | `resolveFetchMaxResponseBytes()` returns 50MB |
| SEC-72 | `src/cli/config-cli.ts` | `runConfigGet` skips `redactConfigObject(snapshot.config, uiHints)` — API keys visible in `openclaw config get` |
| SEC-78 | `src/gateway/control-plane-rate-limit.ts` | `consumeControlPlaneWriteBudget` returns allowed (keeps 9.x per-method `key`) |
| SEC-79 | `src/acp/translator.prompt-stream.ts` | `getMaxPromptBytes()`: 50MB in dev-mode (moved from `translator.ts` in the 9.x split); resolved per call so `.env` loaded after import applies |
| ~~SEC-80~~ / ~~SEC-96~~ | — | DROPPED (upstream deleted / accepted) |
| SEC-WA1 | `extensions/whatsapp/src/dev-mode/reasoning.ts` + hooks in `auto-reply/monitor/inbound-dispatch.ts` (opts into `reasoningPayloadsEnabled`, converts in `preparePayload`) and `auto-reply/deliver-reply.ts` (fallback for routed replies) | Any reasoning — `isReasoning` payloads or text with a `Reasoning:`/`Thinking` preamble, response prefix stripped — becomes `💭 Reasoning:` + italic lines. Needs the session `/reasoning on`. File header lists the 3 upstream suppression points + regression checklist |
| WA echo guard | `extensions/whatsapp/src/dev-mode/echo-guard.ts` + hook in `auto-reply/monitor/on-message.ts` | SAFETY NET: drops self-chat inbound starting with `[prefix] `/`💭 ` + `Reasoning:`. Primary defense is upstream's message-id echo dedupe. Logs `Dropped self-chat reasoning echo (dev-mode safety net)` at info = upstream dedupe missed one |
| WA history | `extensions/whatsapp/src/dev-mode/wa-history.ts` + hook in `session.ts` | Baileys `messages.upsert` → `~/.openclaw/dev-mode/wa-history.db`; attaches only to `receiveMode === "normal"` sockets (9.x added short-lived "directory" sockets) |
| SEC-97 server | `src/config/redact-snapshot.raw.ts` + `redact-snapshot.ts` + `types.openclaw.ts` | `shouldFallbackToStructuredRawRedaction()` → false (Raw tab never nulled); snapshot carries `devMode` via `config.get`. Secrets still arrive as `__OPENCLAW_REDACTED__` |
| SEC-97 client | `ui/src/pages/config/dev-mode.ts` + hooks in `config-page.ts` (`synchronizeRuntimeConfig`, `resetConfigViewState`), `view-state.ts` (`resetConfigEphemeralState`), `ui/src/api/types.ts` | Advanced page opens in Raw with raw/env unblurred. Reveal follows the snapshot on screen per view state (non-dev gateway re-blurs; manual toggles never overridden). No localStorage (the 7.1 cache only hid the gone Quick-settings flash) |
| SEC-98 | `src/agents/system-prompt.ts` | Drops the config/scheduler caution + 3 approval lines; appends permissive line; replaces the update instructions with "Never update OpenClaw here…" (an update would overwrite the fork — Ariel 2026-09-28). Upstream's "Never run openclaw update / npm install -g openclaw via exec" line kept. Prompt-level only: `update.run` and `/update` still work in code |
| SEC-99 | `src/auto-reply/reply/reply-elevated.ts` | `resolveElevatedPermissions()` allowed when dev-mode + Full profile |
| SEC-100 | `src/gateway/tool-resolution.ts` | `ownerOnlyGatewayDeny` → `[]` |
| SEC-101 | `src/agents/agent-tools.ts` | Skips `filterToolsByMessageProvider()` |
| SEC-102 | `src/media/local-media-access.ts` | `resolveLocalMediaBoundary()` returns roots `"any"` — covers `assertLocalMediaAllowed` AND `readLocalMediaFile` (9.x re-checks the boundary at read time, so gating only the assert no longer worked) |
| FIX-01 | `src/agents/workspace.ts` | Seeds `MEMORY.md` via `publishBootstrapFile` only after `setupCompletedAt` — MEMORY.md is setup-completion evidence; seeding earlier marks a fresh workspace configured and deletes its pending BOOTSTRAP.md |
| ~~FIX-02~~ | — | RESOLVED upstream (V2026.5.2) |
| FIX-03 | `src/status/status-message.ts` | Dev-mode `▶️ Active model` line/row (model + auth that actually ran). The selection-merge half is fixed upstream (dropped). Named "Active model" because 9.x has its own `Runtime` (harness) and `⚙️ Execution` rows |
| FIX-04 | `src/auto-reply/reply/commands-reset.ts` | Skips the hardcoded reset ACK so the bare-reset greeting runs |
| ~~FIX-05~~ | — | DROPPED at 9.6: upstream default `session.reset` mode is `"none"` (#111140) — sessions never auto-reset; compaction manages size |
| ~~FIX-06~~ | — | DROPPED at 9.6: native pre-compaction memory flush + bundled `session-memory` hook (saves last messages to `memory/` on /new, /reset) |
| ~~Ollama think~~ | — | DROPPED at 9.6: `extensions/ollama/src/stream-compat.ts` forwards `think` natively from the thinking level |

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

State on `upgrade-2026.9.6`. Upstream files carry small guarded hooks; fork-owned files hold the logic.

Infrastructure (1): `src/globals.ts` (`isDevMode()`)

Core hooks (17): `src/agents/system-prompt.ts` (SEC-15a/98), `src/security/channel-metadata.ts` (SEC-27), `src/commands/onboard-config.ts` (SEC-59), `src/agents/tools/web-fetch.ts` (SEC-71), `src/cli/config-cli.ts` (SEC-72), `src/gateway/control-plane-rate-limit.ts` (SEC-78), `src/acp/translator.prompt-stream.ts` (SEC-79), `src/gateway/tool-resolution.ts` (SEC-100), `src/agents/agent-tools.ts` (SEC-101), `src/media/local-media-access.ts` (SEC-102), `src/agents/workspace.ts` (FIX-01), `src/config/redact-snapshot.raw.ts` + `redact-snapshot.ts` + `types.openclaw.ts` (SEC-97 server), `src/auto-reply/reply/reply-elevated.ts` (SEC-99), `src/auto-reply/reply/commands-reset.ts` (FIX-04), `src/status/status-message.ts` (FIX-03)

UI (3 hooks + fork file): `ui/src/api/types.ts`, `ui/src/pages/config/config-page.ts`, `ui/src/pages/config/view-state.ts`; fork-owned `ui/src/pages/config/dev-mode.ts` (+ `dev-mode.test.ts`)

Extensions: `extensions/browser/src/browser/navigation-guard.ts` (SEC-70); WhatsApp hooks `extensions/whatsapp/src/session.ts` (history), `auto-reply/monitor/inbound-dispatch.ts` + `auto-reply/deliver-reply.ts` (SEC-WA1), `auto-reply/monitor/on-message.ts` (echo guard); fork-owned `extensions/whatsapp/src/dev-mode/{wa-history,reasoning,echo-guard}.ts` (+ tests)

Build: `package.json` `files` — `!dist/extensions/whatsapp/**` removed (keep-ours on every merge)

Fork-customized (keep-ours, NOT a SEC patch): `README.md`

Dropped over time: SEC-67 (skipped), SEC-80, SEC-96, FIX-02, FIX-05, FIX-06, Ollama think injection, OpenAI reasoning injection, SEC-27 reply-context half, FIX-03 selection-merge half, wa-claw socket tap, 7.1 SEC-97 localStorage cache

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

### Two WhatsApp Channels — RESOLVED (2026-07-21)

The kapso teardown removed the second WhatsApp-family channel; `channels` is back to exactly
`["whatsapp", "discord"]`, so implicit sends (no `--channel`) work again. `--channel whatsapp`
is still harmless and fine to keep in scripts/docs. The VPS agent's `~/.openclaw/workspace/TOOLS.md`
still carries the "always pass channel" note from 2026-07-03 — outdated but not harmful.
(Historical: with >1 configured WA-family channel, `src/infra/outbound/channel-selection.ts`
throws `Channel is required when multiple channels are configured` — candidate FIX-07 tie-break
was never needed.)

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

**DROPPED at V2026.9.6.** Upstream `extensions/ollama/src/stream-compat.ts` (`resolveOllamaThinkParamValue` + `createOllamaThinkingWrapper`) sends `think` natively from the session/agent thinking level (`agents.defaults.thinkingDefault`). History: 7.x fork sent `think: true` in `extensions/ollama/src/stream.ts` (renamed `stream.runtime.ts` upstream).

### SEC-WA1: WhatsApp Thinking Messages

**Rebuilt at V2026.9.6** (`extensions/whatsapp/src/dev-mode/reasoning.ts`; its header documents everything below plus a regression checklist).

Stock 9.x blocks reasoning on WhatsApp at three points: (1) core drops `isReasoning` payloads unless `replyOptions.reasoningPayloadsEnabled` (Discord/Telegram set it for `/reasoning on`); (2) `resolveWhatsAppDeliverablePayload` in `auto-reply/monitor/inbound-dispatch.ts`; (3) `isReasoningReplyPayload` in `deliver-reply.ts`, which also matches text starting with `Reasoning:`/`Thinking`. In dev-mode WhatsApp opts in, and `formatDevModeReasoningPayload()` converts every reasoning payload into a plain `💭 Reasoning:` message with italic lines before those filters run.

Why 7.1 usually showed reasoning WITHOUT 💭: the old regex `^.*?Reasoning:` only matched "Reasoning:", but core formats reasoning with a "Thinking" preamble (`formatReasoningMessage`, `src/agents/embedded-agent-utils.ts`).

Core emits reasoning only when the session reasoning level is `on` (`/reasoning on` or `reasoningDefault: "on"`) and thinking is not `off`. Works for any model that returns reasoning, not only Ollama.

### WhatsApp Self-Chat Echo Loop Fix (2026-03-27)

History (7.x): in self-chat every sent message echoes back as inbound. The text-based echo tracker missed SEC-WA1-rewritten reasoning (and command replies like "✅ New session started"), so the agent replied to its own reasoning in an infinite loop. The fix skipped self-chat inbound matching reasoning patterns.

**At V2026.9.6** upstream dedupes echoes by WhatsApp message id (`inbound/socket-session.ts` `rememberOutboundMessage` records every send; `inbound/message-normalization.ts` `shouldSkipRecentOutboundEcho` drops matching `fromMe` messages first); the text EchoTracker is gone. The fork keeps a **safety net** only (Ariel, 2026-09-28): `extensions/whatsapp/src/dev-mode/echo-guard.ts` + one early return in `on-message.ts`. It logs `Dropped self-chat reasoning echo (dev-mode safety net)` at info level — seeing it means upstream's id dedupe missed an echo (a send path bypassing the socket-session wrapper, or an echo after a gateway restart). Side effect: a self-chat message YOU type starting with `Reasoning:`/`💭 Reasoning:` is ignored.

### WhatsApp Message History — back in the fork (2026-07-21)

The whatsapp-kapso-claw plugin era (2026-07-02 → 2026-07-21) is OVER — the plugin, its panel,
its nginx/ufw/cert surface, its systemd unit, and all kapso agents/bindings/channel config were
fully torn down on the VPS on 2026-07-21, and the fork's wa-claw socket tap was deleted. The
plugin repo still exists at `C:\Users\Ariel\source\openclaw chaos mode\openclaw-whatsapp-claw`
but nothing is installed anywhere.

History recording now lives in-fork again: `extensions/whatsapp/src/dev-mode/wa-history.ts`,
attached from `session.ts` via dynamic import right before `return sock;` (best-effort — a
failure never blocks channel startup). Active whenever `OPENCLAW_DEV_MODE=1`, no other flag.

- **DB**: `~/.openclaw/dev-mode/wa-history.db` — the SAME 227 MB SQLite file the plugin wrote
  (moved+renamed from `~/.openclaw/wa-claw-kapso/wa-claw-baileys.db` on 2026-07-21, byte-exact).
  History is continuous across the plugin era.
- **Schema**: plugin-compatible — `messages` + `chats` incl. `phone_e164` columns and indexes;
  `jidToPhoneE164()` handles Baileys 7.x `@lid` JIDs via `remoteJidAlt`; `ensureColumn()`
  migration guard handles fresh/pre-column DBs. Uses Node built-in `node:sqlite`, zero deps.
- Group-name backfill on first `connection.update === "open"` + live `groups.upsert`/`groups.update`/
  `GROUP_CREATE`/`GROUP_CHANGE_SUBJECT` handling.
- There is currently NO panel/browser UI for the history — the sqlite file is the interface.

### Kapso agents — RETIRED (2026-07-21)

The three kapso agents (`kapso-pinhas`, `kapso-elhanan-k`, `kapso-igal`), their bindings,
workspaces, the `channels.whatsapp-kapso` block, and the whole "adding a kapso agent" recipe
were removed with the plugin teardown on 2026-07-21. `agents.list` on the VPS is back to
`main` + `skill-suggester`, `bindings` is an empty array. If Kapso-style per-number agents ever
come back, the recipe lives in git history of this file (pre-2026-07-21) and in the plugin repo.
One durable lesson kept: Meta's 24h customer-service window only opens on the peer's OWN direct
inbound message to the business line — sends outside it fail with 422 unless using paid templates.

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

### V2026.7.1 Upgrade (2026-07-21)

Clean-room branch `upgrade-2026.7.1` cut from tag `v2026.7.1` (note: lowercase `v` is the real
tag casing). 3,368 upstream commits / 8,767 files since 6.11. WhatsApp extension was additive-only
this cycle (82 files, +2.7K/−354) — no 3.13-style disaster. 12 of the fork's patched files were
byte-identical at 7.1 and re-applied verbatim.

**⚠️ Node engine floor raised.** v2026.7.1 requires Node `>=22.22.3 <23, >=24.15.0 <25, or
>=25.9.0`. The build's final step (`write-cli-startup-metadata`) runs the freshly-built CLI and
hard-fails on older Node. Build PC upgraded to v24.18.0 (system MSI install, by Ariel — do NOT
auto-install Node on this machine, ask him). VPS verified on v24.18.0 (nodesource apt) at deploy
time — fine.

**⚠️ REPO HAZARD — self-referencing symlinks destroy .git.** The repo tracks
`packages/speech-core/node_modules/openclaw` → repo root. `git checkout`/`reset` traversing it
resolves `.git/index.lock` back into this repo's own `.git` and corrupts `HEAD`/`config`/`index`
(happened twice on 2026-07-21; recovered, no objects lost). `git config core.symlinks false`
does NOT protect (it only affects writes, not traversal), and `pnpm install` recreates the link.
Before ANY working-tree-writing git command, sweep and `rm` (plain rm, no -rf, no trailing slash):
`find . -type l -not -path "./.git/*" -exec sh -c 'test "$(readlink "$1")" = "/c/Users/Ariel/source/openclaw chaos mode/openclaw-dev-mode"' _ {} \; -print`

**Control UI rebuilt.** Upstream deleted the entire `ui/src/ui/` tree (386 files, −163K lines)
and rebuilt it as a page router. The six old SEC-97 UI patches died with it (server half kept).
Later the same day, after Ariel saw the new UI's Simple→Advanced→Raw→Reveal click chain, the
client half was re-implemented against the new layout in 4 files — see the SEC-97 row in the
SEC/FIX table.

**`session.test.ts` fails on pristine upstream (Windows).** 136/149 tests fail on the untouched
v2026.7.1 tag with `TypeError: ... reading 'mockRestore'` (a `vi.spyOn(bootstrapCache, ...)` that
never produces a spy). A/B-verified 2026-07-21: identical failures with and without our FIX-05
changes — pre-existing upstream/Windows breakage, ignore it. `commands-compact.test.ts` passes.

**Kapso teardown (VPS, same day).** Agents/bindings/channel/plugin/panel/nginx/ufw/cert/systemd
unit all removed; 227 MB history DB moved byte-exact to `~/.openclaw/dev-mode/wa-history.db`.
Gateway never restarted (all config writes hot-applied). NOTE: the old `wa-claw-panel.service`
held the live `gateway.auth.token` in plaintext; file deleted but token NOT rotated — Ariel's call.
Lesson: `openclaw plugins uninstall` over SSH hangs the pipe (interactive prompt) — append
`< /dev/null` to openclaw CLI calls over SSH.

**⚠️ New runtime workspace dep `@openclaw/ai` — npm can no longer install this repo.** Upstream
moved the model-provider adapters into `packages/ai` and declares it in root `dependencies` as
`"@openclaw/ai": "workspace:*"` — a pnpm/yarn-only protocol that plain npm rejects outright
(`EUNSUPPORTEDPROTOCOL`), and 40+ root dist chunks import `@openclaw/ai/internal/*` at runtime
(externalized, NOT bundled — `root-alias.cjs` only aliases it for the plugin-sdk jiti graph, not
for core chunks). Two consequences, both recurring: (1) `packages/ai/dist/` must be force-added
to git after every build (checklist item 8) — first done in commit after `2141418fceb`; (2) the
VPS now installs with `CI=true pnpm install --ignore-scripts` instead of npm. Discovered when the
first v2026.7.1 deploy attempt failed at `npm install` on the VPS (gateway was untouched, no outage).

**⚠️ Startup-migration checkpoint gate — caused a ~10-min gateway outage on deploy.** Since
v2026.7.1, the FIRST boot after a version change must complete state migrations with ZERO
warnings before the gateway reports ready (`src/commands/doctor-config-preflight.ts` — any
`startupMigrationWarnings` → throw → systemd crash-loop every ~12s; checkpoint = `schema_meta`
row `startup-migrations` in the state DB, so once recorded the gate never re-runs until the next
version bump). Two permanent-warning sources hit us, both now fixed on the VPS:
1. **Memory Core legacy JSON state**: `<workspace>/memory/.dreams/{daily-ingestion,session-ingestion,short-term-recall,phase-signals}.json`
   re-warn forever ("SQLite rows already exist; left legacy source in place"). The 6.11 runtime
   kept regenerating these after the Jun-20 migration; 7.1 memory-core is SQLite-native so they
   shouldn't come back. Fix: archived to `~/.openclaw/legacy-state-archive-20260721/`. If a
   future upgrade crash-loops with this message — archive them again.
2. **`openclaw-web-search` REMOVED from the VPS entirely** (2026-07-21): the stock
   `@ollama/openclaw-web-search` package ships TypeScript-only (publisher packaging bug) and the
   7.1 convergence smoke-check hard-rejects it. `openclaw update repair` set `enabled:false` but
   convergence STILL chased the stale npm install record every boot. Final fix: `config unset
   plugins.entries.openclaw-web-search` + `rm -rf ~/.openclaw/extensions/openclaw-web-search
   ~/.openclaw/npm/projects/ollama-openclaw-web-search-*`. There is NO web search provider
   configured now — bundled `duckduckgo`/`brave` extensions exist in dist if Ariel wants one.
   (Doctor convergence also rewrote `plugins.allow`: dropped `openclaw-web-search`, added
   `tts-local-cli`.) Config backup: `~/.openclaw/openclaw.json.bak-websearch-removal-20260721`.

**Round-trip breakers (Raw tab), materialized into the raw config 2026-07-21**:
`agents.defaults.subagents.archiveAfterMinutes: 60`, `cron.maxConcurrentRuns: 8`,
`plugins.entries.tts-local-cli.config: {}`.

**Env flag consolidation.** All secondary `OPENCLAW_DEV_MODE_*` gate flags retired; only
`OPENCLAW_DEV_MODE=1` gates features (+ optional value-override `OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT`).
FIX-05 redesigned to auto-compact (see the SEC/FIX table). WA history recorder back in-fork
(see "WhatsApp Message History — back in the fork").

**Open items at end of 2026-07-21** (all Ariel's call, none urgent):
- Gateway token NOT rotated (was in plaintext in the deleted kapso-era `wa-claw-panel.service`).
- No web-search provider configured (broken `openclaw-web-search` removed; bundled `duckduckgo`/`brave` exist in dist if wanted).
- Systemd unit carries a stale "installed by 2026.6.11" version stamp — cosmetic, `gateway status` warns about it.
- `~/.openclaw` ownership mess (`coder` uid 1001 owns much of it, incl. the workspace memory files) still unresolved — it's what load-blocked the kapso plugin and left the ownership landmine pattern; Ariel asked whether perms can be set correctly (his browser mini-VSCode on port 38080 needs read-write).
- Old `.agents/skills/{blacksmith-testbox,optimizetests}` files from pre-7.1 main were dropped as accidental upstream restores (recoverable from tag `main-pre-2026.7.1`).

### V2026.9.6 Upgrade (2026-09-27/28, branch `upgrade-2026.9.6`)

Clean-room branch from tag `v2026.9.6` (upstream 2026-09-22). ~33.4k upstream commits / 48k files since 7.1. **Upstream rewrote history**: `v2026.7.1` is NOT an ancestor of `v2026.9.6` (merge-base `b81666c`, 2026-07-08) — irrelevant for clean-room, but don't trust `v2026.7.1..v2026.9.6` counts.

**Process that worked**: 4 parallel read-only Sonnet analyses (per patch: SEAMLESS / ADAPT / THINK / DROP with 9.6 file:line) → Opus ports the confident set (`git apply --3way` of the fork diff for small hunks, manual re-homing otherwise) → Ariel decides THINK items one by one. Verify analysis claims — two were wrong (see Delegation).

**Upstream changes that shaped the port:**
- **Automatic session reset OFF by default** (#111140, `e23dde3de55`; `src/config/sessions/reset-policy.ts` `DEFAULT_RESET_MODE = "none"`). No doctor migration re-adds it. Sessions live until `/new`/`/reset`; compaction (with pre-compaction memory flush) manages size → FIX-05/FIX-06 dropped. ⚠️ ANY `session.reset` block in `openclaw.json` (even without `mode`) still yields daily — keep it absent on the VPS.
- Bundled `session-memory` hook (`src/hooks/bundled/session-memory`) saves the last 15 messages to `memory/YYYY-MM-DD-HHMM.md` on `/new`, `/reset`, auto-reset. Opt-in: `openclaw hooks enable session-memory`.
- Reasoning delivery / WhatsApp suppression / "Thinking" preamble → SEC-WA1 rebuilt (see its section). Echo dedupe by message id → echo filter kept as safety net only.
- WhatsApp opens short-lived "directory" sockets (`createWaDirectorySocket`) → history logger attaches to `receiveMode === "normal"` only.
- Control UI config page: no Quick/Advanced toggle, `advanced` page is the default and the only one with Form/Raw → SEC-97 client rebuilt (fork file + 3 hooks).
- Local media reads re-check the root boundary (`readLocalMediaFile`) → SEC-102 moved into `resolveLocalMediaBoundary`.
- Workspace bootstrap treats `MEMORY.md` as setup-completion evidence → FIX-01 seeds only after `setupCompletedAt`.
- WhatsApp build exclusion derived solely from `package.json` `files`; fork WA runtime code now bundles under `dist/extensions/whatsapp/`.
- Startup-migration gate: advisory warnings now only log ("continuing with degraded state", no success checkpoint); refusals (`DoctorStateMigrationRefusalError`) are still fatal. ~20 new state migrations (agent DB sessions/participants, operator approvals, restart handoff, session watch, user profiles, workspace setup, web push) — read the `openclaw doctor --fix` output on the first deploy.
- Toolchain: engines `>=24.16.0 <25 || >=26.1.0`; pnpm 12.4.0 (VPS: upgrade from 11.2.2); `minimumReleaseAgeStrict: true`. Only `packages/ai/dist` needs force-adding (see checklist item 8).
- Tracked self-ref symlink hazard resolved (see checklist item 7). The CLAUDE.md-as-symlink problem is fixed too: `CLAUDE.md` was committed with mode `120000` holding 69 KB of markdown, so Linux checkouts failed with "File name too long"; `89a6d85522` stores it as a regular file.
- Pre-existing test failure: `src/acp/translator.abort-cause.e2e.test.ts` ("shows the carried tool-validation cause before cancelled settlement") fails on pristine `v2026.9.6` too (Linux, Node 26.8; A/B verified) — ignore.

**Ariel's decisions (2026-09-28):** SEC-98 → ban agent-driven updates (not just strip the explicit-request qualifier); credential-safety prompt lines kept; SEC-27 channel-metadata re-applied (Slack-only today); FIX-03 → keep an always-visible active-model line; FIX-05/FIX-06 → drop (upstream native); SEC-WA1 → 9.x-native rebuild; echo filter → safety net with minimal upstream touch; SEC-97 UI → Advanced opens Raw, unblurred.

**First-deploy checklist for 9.6 (VPS):** snapshot `~/.openclaw` first; upgrade pnpm to 12.4.0; `git pull` + `CI=true pnpm install --ignore-scripts`; confirm no `session.reset` block in `openclaw.json`; `openclaw hooks enable session-memory`; `openclaw doctor --fix < /dev/null` and read every warning; restart gateway; WA checks (item 6); `/reasoning on` in self-chat → expect `💭 Reasoning:` messages and NO echo loop (and no `Dropped self-chat reasoning echo` log line); Control UI → Settings → Advanced opens in Raw, unblurred; `/status` shows `▶️ Active model`.

**Local incident 2026-09-26**: a fresh clone on the Linux laptop had no `.git/index` (git showed every file as deleted + untracked). `git reset` rebuilt the index; likely the tracked self-ref symlink hazard (checklist item 7).

## Project File Structure (our additions)

```
dev-mode/
  README.md                       -- Fork install guide and feature table
  list.sec/                       -- Individual implementation plans
```
