# Claude Super Summary — OpenClaw Dev Mode

> This file is a comprehensive brain dump for future Claude sessions. Read this FIRST.

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw
- **Fork point**: commit `029c47372` (V2026.3.2)
- **Current base**: V2026.3.11 (merged 2026-03-12, 893 upstream commits)
- **PR**: https://github.com/openclaw/openclaw/pull/37337
- **Purpose**: Add dev-mode flag to OpenClaw that relaxes security features for dev environments
- **Status**: PR submitted, updated to V2026.3.11, config persistence removed

## Branches

- `main` — has `dist/` committed for easy VPS deployment, includes `dev-mode/rejects/` folder
- `pr-ready` — clean branch without `dist/` or rejects, used for upstream PR

## Build & Deploy

- **Build**: `pnpm build` (then `pnpm ui:build` for Control UI)
- **Build tool**: tsdown (esbuild-based), output in `dist/`
- **Formatter**: oxfmt (`pnpm format` / `pnpm format:check`)
- **Linter**: oxlint (`pnpm lint` runs `oxlint --type-aware`)
- **dist/ is committed** on `main` branch (so VPS can clone and run without building)
- **Control UI**: `dist/control-ui/` — also committed on `main`, built separately via `pnpm ui:build`
- **Package manager**: pnpm locally, npm on VPS
- **Platform**: Build output is platform-independent JS — build on Windows, deploy to Linux

## Architecture of the Dev Mode Feature

### How dev-mode is activated

Dev mode is controlled **entirely via env var**. No config file changes.

```bash
# Add to ~/.openclaw/.env
OPENCLAW_DEV_MODE=1
```

The `.env` file is loaded on every CLI invocation by `loadDotEnv()` in `run-main.ts`, before any command runs. This includes `gateway start/restart`.

### Why NOT config persistence (lesson learned)

We originally had `--dev-mode 1` CLI flag that wrote `cli.devMode: true` to `openclaw.json`. This was removed because:

1. The zod schema uses `.strict()` on all objects — any unknown key rejects the entire config
2. If the user reverts to stock openclaw code (which doesn't have `devMode` in the schema), the config becomes invalid
3. Gateway crashes in a loop because config validation fails on every startup
4. The only fix is manually editing the JSON to remove the `cli` section

The env var approach is immune to this: `.env` is a flat file that no schema can reject.

### Global State

`src/globals.ts` — `isDevMode()` simply checks `process.env.OPENCLAW_DEV_MODE === "1"`.

No `setDevMode()`, no `globalDevMode` variable. Pure env var check.

### Startup Flow

1. `src/cli/run-main.ts` — `loadDotEnv()` loads `~/.openclaw/.env` into `process.env`
2. `src/cli/program/preaction.ts` — If `isDevMode()`, auto-adds hub plugin path to `plugins.load.paths` via `setConfigOverride()` (runtime-only, not persisted)
3. `src/gateway/server.impl.ts` — At gateway start, if `isDevMode()`:
   - Checks if hub server is already running on port 10020
   - If not, spawns `python3 server.py` detached
   - Handles missing python3 (ENOENT) with clear error message

### The 12 Security Items

Each one is a minimal `if (isDevMode()) { ... }` check in the relevant source file:

| ID      | File                                                                             | What it does                                                                                    |
| ------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| SEC-15a | `src/agents/system-prompt.ts`                                                    | Removes "Prioritize safety and human oversight..." paragraph                                    |
| SEC-27  | `src/security/channel-metadata.ts` + `src/auto-reply/reply/untrusted-context.ts` | Returns plain text instead of UNTRUSTED wrapper; header says "Channel context:"                 |
| SEC-59  | `src/commands/onboard-config.ts`                                                 | Skips tools profile default in onboarding                                                       |
| SEC-67  | `src/agents/pi-embedded-runner/extensions.ts`                                    | `resolveCompactionMode()` returns "default" instead of "safeguard"                              |
| SEC-70  | `src/browser/navigation-guard.ts`                                                | Early return in `assertBrowserNavigationAllowed()` — skips all URL checks                       |
| SEC-71  | `src/agents/tools/web-fetch.ts`                                                  | `resolveFetchMaxResponseBytes()` returns 50MB instead of 2MB                                    |
| SEC-72  | `src/cli/config-cli.ts`                                                          | `runConfigGet` skips `redactConfigObject()` — API keys visible                                  |
| SEC-78  | `src/gateway/control-plane-rate-limit.ts`                                        | `consumeControlPlaneWriteBudget` returns `{ allowed: true, ... }` immediately                   |
| SEC-79  | `src/acp/translator.ts`                                                          | `getMaxPromptBytes()` returns 50MB instead of 2MB (was module-level const, changed to function) |
| SEC-80  | `src/gateway/startup-auth.ts`                                                    | Early return in `assertHooksTokenSeparateFromGatewayAuth()`                                     |
| SEC-96  | `src/infra/host-env-security.ts`                                                 | `sanitizeHostExecEnv()` copies all env vars without filtering                                   |
| FIX-01  | `src/agents/workspace.ts`                                                        | Writes `MEMORY.md` via `writeFileIfMissing()` after heartbeat template                          |

### Hub Notification Plugin

- **Location**: `dev-mode/hub/`
- **Files**: `server.py` (Python HTTP server), `index.ts` (OpenClaw plugin), `openclaw.plugin.json` (manifest)
- **Port**: 10020 (configurable via plugin config)
- **Auto-start**: In `server.impl.ts` at gateway start, checks if port 10020 is listening, spawns `python3 server.py` detached if not
- **Plugin registration**: In `preaction.ts`, if `isDevMode()`, adds hub plugin path via `setConfigOverride()` — runtime-only, never persisted
- **Tools registered**: `hub_notify` (POST /notify), `hub_pending` (GET /pending), `hub_done` (POST /done/{id})
- **Storage**: SQLite (`hub.db` in the hub directory)
- **Agent/Channel**: Configurable via `OPENCLAW_AGENT` and `HUB_CHANNEL` env vars (defaults: `agent:main`, `WhatsApp`)
- **Gateway integration**: Hub POSTs to `/v1/chat/completions` to wake the agent, which then forwards via the configured channel
- **Not in npm artifacts**: Hub files only exist in the source tree / fork. If missing, plugin silently doesn't load.

## Upstream Merge History

### V2026.3.11 (2026-03-12, 893 commits)

3 merge conflicts resolved, all import/constant collisions:

| File                            | Conflict                                                                                            | Resolution                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `src/acp/translator.ts`        | (1) Our `isDevMode` import vs their new `GatewaySessionRow` import. (2) Our `getMaxPromptBytes()` function vs their new ACP config constants. | Kept both: their expanded imports + our function + their new constants |
| `src/agents/tools/web-fetch.ts` | Our `isDevMode` import vs their new `normalizeResolvedSecretInputString` import                     | Kept both imports                                     |
| `src/gateway/startup-auth.ts`   | Our `isDevMode` import vs their refactored secret-resolution imports (consolidated into `resolveRequiredConfiguredSecretRefInputString`) | Took upstream's refactored imports + kept our `isDevMode` import |

7 auto-merged files (no conflicts): `zod-schema.ts`, `run-main.ts`, `preaction.ts`, `server.impl.ts`, `system-prompt.ts`, `navigation-guard.ts`, `host-env-security.ts`

### V2026.3.7 (2026-03-06, 251 commits)

No merge conflicts. Clean merge. Also removed config persistence (env var only).

## PR Review History

### Round 1 — Greptile + Codex (automated reviewers)

9 issues flagged (R1-R9). All addressed:

| ID  | Issue                                                                 | Fix                                                                                |
| --- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| R1  | Security concern about bypassing all checks                           | Added warning banner in README                                                     |
| R2  | README.md conflicts with upstream                                     | Moved our README to `dev-mode/README.md`, restored upstream root README            |
| R3  | Hardcoded "Jarvis" name and WhatsApp channel                          | Renamed to generic terms, added `OPENCLAW_AGENT` and `HUB_CHANNEL` env vars        |
| R4  | server.py broken indentation (GitHub suggestion acceptance bug)       | Restored proper Python indentation                                                 |
| R5  | Personal branding in docs                                             | Removed personal references from all tracked files                                 |
| R6  | Hub auto-start in preAction hook (runs every CLI command, 1s latency) | Moved to `server.impl.ts` — runs once at gateway start only                        |
| R7  | Silent failures in dev-mode activation                                | Added try-catch with clear `console.error` messages                                |
| R8  | loadConfig called before loadDotEnv (route-first commands)            | Added dev-mode env var block in `run-main.ts` after dotenv, before `tryRouteCli()` |
| R9  | No error handling for missing python3                                 | Added ENOENT detection with clear dependency message                               |

### Round 2 — CI failures + Codex P1/P2 comments

| ID  | Issue                                                                | Fix                                                                                    |
| --- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| F1  | Test `run-main.profile-env.test.ts` failed — loadDotEnv called twice | Moved dev-mode config block after `loadDotEnv()` in run-main.ts                        |
| F2  | oxfmt formatter failures (30 files)                                  | Ran `pnpm format` — all cosmetic (import sorting, line wrapping)                       |
| C1  | P1: `--dev-mode 1` on broken config clobbers all settings            | Initially added guard, later removed config write entirely                             |
| C2  | P2: Hub plugin only loaded from config, not env var                  | Split logic: `cfg.cli?.devMode` sets global flag, `isDevMode()` gates hub registration |

### Round 3 — Config persistence removed

Removed all config persistence (`cli.devMode`, `--dev-mode` CLI flag, config write/read) to avoid schema validation crashes. Dev mode now uses `OPENCLAW_DEV_MODE=1` env var exclusively.

### Codex comments we replied to (not code changes)

| Comment                                                                     | Our reply                                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2: Fresh install can't enable dev mode (empty config guard too aggressive) | Non-issue: fresh installs have no API keys/gateway/agent config. Users must `openclaw configure` first. By the time `--dev-mode` is relevant, config exists. Guard protects broken configs from clobbering. |
| P2: Hub plugin path not in npm release artifacts                            | By design: hub is a runtime addon for source-tree/fork users. Path resolved via `import.meta.url`, `fs.existsSync` skips silently if missing. All 12 SEC items work regardless.                             |

### Human reviewer (sxu75374)

- Raised security concerns about the overall approach of disabling security features
- Not yet addressed — separate discussion from the automated review fixes

## Key Gotchas

### oxlint curly rule

All `if` statements must use braces, even one-liners:

```typescript
if (isDevMode()) {
  return;
}
```

### restrict-template-expressions

`catch (err)` gives `unknown` type. Using `${err}` is a lint error:

```typescript
`Error: ${err instanceof Error ? err.message : String(err)}`;
```

### Zod strict() mode

The config schema uses `.strict()` on every object. Adding fields to the config JSON that aren't in the schema will crash the gateway. This is why we removed config persistence.

### loadDotEnv duplication

`loadConfig()` (via `src/config/io.ts` → `createConfigIO` → `maybeLoadDotEnvForConfig`) internally calls `loadDotEnv({ quiet: true })` when `env === process.env` (reference equality check). This means any `loadConfig()` call in `run-main.ts` triggers a second `loadDotEnv` after our explicit one.

**Solution**: Use `createConfigIO({ env: { ...process.env } })` — spreading creates a copy, so the reference check `env !== process.env` is true, and the internal loadDotEnv is skipped.

## Project File Structure (our additions)

```
dev-mode/
  README.md                       -- Fork install guide and feature table
  claude.super-summary.ai.md      -- This file
  list.sec/                       -- Individual implementation plans (SEC-00 through FIX-01)
  tools-restrictions.md           -- Analysis of tool restrictions
  yes.2026.03.06.html             -- HTML visualization of YES items
  hub/
    server.py                     -- Python HTTP notification server
    index.ts                      -- OpenClaw plugin (registers 3 tools)
    openclaw.plugin.json          -- Plugin manifest
    README.md                     -- Full API reference
    flow-comparison.html          -- Visual comparison of Hub vs Heartbeat
    .gitignore                    -- Excludes *.db, *.log, __pycache__
  rejects/                        -- On main only: PR review tracking, working docs, config samples
```

## Source Files Modified (17 files)

Infrastructure (3 files):

1. `src/globals.ts` — `isDevMode()` (env var check only)
2. `src/cli/program/preaction.ts` — Auto-enable hub plugin via `isDevMode()`
3. `src/gateway/server.impl.ts` — Auto-start hub server at gateway start

Security items (14 files): 4. `src/agents/system-prompt.ts` — SEC-15a 5. `src/security/channel-metadata.ts` — SEC-27 6. `src/auto-reply/reply/untrusted-context.ts` — SEC-27 7. `src/commands/onboard-config.ts` — SEC-59 8. `src/agents/pi-embedded-runner/extensions.ts` — SEC-67 9. `src/browser/navigation-guard.ts` — SEC-70 10. `src/agents/tools/web-fetch.ts` — SEC-71 11. `src/cli/config-cli.ts` — SEC-72 12. `src/gateway/control-plane-rate-limit.ts` — SEC-78 13. `src/acp/translator.ts` — SEC-79 14. `src/gateway/startup-auth.ts` — SEC-80 15. `src/infra/host-env-security.ts` — SEC-96 16. `src/agents/workspace.ts` — FIX-01

Files removed vs V2026.3.2 original (no longer modified):

- `src/config/types.cli.ts` — was `devMode?: boolean`, reverted to upstream
- `src/config/zod-schema.ts` — was `devMode: z.boolean().optional()`, reverted to upstream
- `src/cli/profile.ts` — was `--dev-mode` flag parsing, reverted to upstream
- `src/cli/run-main.ts` — was config write + read blocks, reverted to upstream

## Key OpenClaw Internals

- **Commander.js** for CLI parsing
- **tsdown** (esbuild-based) for building
- **oxfmt** for formatting (`pnpm format`) — CI runs `pnpm format:check`
- **oxlint** for linting (`pnpm lint`) — CI runs `oxlint --type-aware`, enforces curly braces and strict template expressions
- **Zod** for config schema validation (`.strict()` rejects unknown keys!)
- **Config flow**: JSON5 file -> Zod validation -> runtime defaults merge -> `loadConfig()`
- **`loadConfig()` internally calls `loadDotEnv`** when using real `process.env` — use `createConfigIO({ env: { ...process.env } })` to avoid this
- **Runtime overrides**: `setConfigOverride(key, value)` — runtime-only, not persisted
- **Plugin system**: `openclaw.plugin.json` manifest + `register(api)` entry point
- **Plugins discovered from**: `plugins.load.paths` config + `extensions/` directory
- **Route-first commands**: `tryRouteCli()` handles `config get`, `health`, `status`, etc. — these bypass Commander preAction hooks
- **Pre-action hooks**: `src/cli/program/preaction.ts` runs before every Commander CLI command
- **Profile parsing**: `src/cli/profile.ts` runs before Commander, extracts early flags
- **Gateway**: systemd service, runs `dist/index.js gateway --port PORT`
- **Bootstrap files**: MEMORY.md etc, injected into agent context, max 20K chars per file
- **.env loading**: `loadDotEnv()` loads CWD `.env` first, then `~/.openclaw/.env` (global fallback)

## CI Pipeline

The PR runs these checks (all must pass):

- `pnpm format:check` — oxfmt formatter compliance
- `pnpm tsgo` — TypeScript type check
- `pnpm lint` — oxlint with type-aware rules
- `pnpm test` — vitest on Node (Linux) + 6 sharded Windows runners
- `bunx vitest run` — bun test runner
- `pnpm protocol:check` — protocol compliance
- Build artifacts, Android build/test, install smoke test, secrets scan, actionlint, no-tabs, check-docs
- `check` umbrella job — gates on all above, fails if any sub-job fails
