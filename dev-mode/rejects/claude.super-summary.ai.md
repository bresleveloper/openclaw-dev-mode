# Claude Super Summary — OpenClaw Dev Mode

> This file is a comprehensive brain dump for future Claude sessions. Read this FIRST.

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw (V2026.3.2, commit 029c47372)
- **PR**: https://github.com/openclaw/openclaw/pull/37427
- **Purpose**: Add `--dev-mode` flag to OpenClaw that relaxes security features for dev environments
- **Status**: PR submitted, CI fully green, addressing reviewer feedback

## Branches

- `main` — has `dist/` committed for easy VPS deployment
- `pr-ready` — clean branch without `dist/`, used for upstream PR

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
2. `src/cli/run-main.ts` — If `--dev-mode` is set:
   - Guards against broken/empty config before writing (prevents clobbering)
   - Writes config and runs `openclaw gateway restart` via `execFileSync`, then exits
   - For non-`--dev-mode` runs: loads config after dotenv using `createConfigIO({ env: { ...process.env } })` to avoid duplicate `loadDotEnv` calls, sets `OPENCLAW_DEV_MODE=1` env var for route-first commands
3. `src/cli/program/preaction.ts` — On every command, loads config; if `cfg.cli?.devMode`, calls `setDevMode(true)`. Then if `isDevMode()` (checks both config flag AND env var):
   - Auto-adds hub plugin path to `plugins.load.paths` via `setConfigOverride()` (runtime-only, not persisted)
4. `src/gateway/server.impl.ts` — At gateway start, if `isDevMode()`:
   - Checks if hub server is already running on port 10020
   - If not, spawns `python3 server.py` detached
   - Handles missing python3 (ENOENT) with clear error message
   - Runs once per gateway start/restart

### The 13 Security Items

Each one is a minimal `if (isDevMode()) { ... }` check in the relevant source file:

| ID      | File                                                                                                                                                 | What it does                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| SEC-00  | `src/globals.ts`, `src/config/types.cli.ts`, `src/config/zod-schema.ts`, `src/cli/profile.ts`, `src/cli/run-main.ts`, `src/cli/program/preaction.ts` | Infrastructure: flag, config, parsing, loading                                                                    |
| SEC-15a | `src/agents/system-prompt.ts`                                                                                                                        | Removes "Prioritize safety and human oversight..." paragraph                                                      |
| SEC-27  | `src/security/channel-metadata.ts` + `src/auto-reply/reply/untrusted-context.ts`                                                                     | Returns plain text instead of UNTRUSTED wrapper; header says "Channel context:" instead of "Untrusted context..." |
| SEC-59  | `src/commands/onboard-config.ts`                                                                                                                     | Skips messaging profile default (`ONBOARDING_DEFAULT_TOOLS_PROFILE`)                                              |
| SEC-67  | `src/agents/pi-embedded-runner/extensions.ts`                                                                                                        | `resolveCompactionMode()` returns "default" instead of "safeguard"                                                |
| SEC-70  | `src/browser/navigation-guard.ts`                                                                                                                    | Early return in `assertBrowserNavigationAllowed()` — skips all URL checks                                         |
| SEC-71  | `src/agents/tools/web-fetch.ts`                                                                                                                      | `resolveFetchMaxResponseBytes()` returns 50MB instead of 2MB                                                      |
| SEC-72  | `src/cli/config-cli.ts`                                                                                                                              | `runConfigGet` skips `redactConfigObject()` — API keys visible                                                    |
| SEC-78  | `src/gateway/control-plane-rate-limit.ts`                                                                                                            | `consumeControlPlaneWriteBudget` returns `{ allowed: true, ... }` immediately                                     |
| SEC-79  | `src/acp/translator.ts`                                                                                                                              | `getMaxPromptBytes()` returns 50MB instead of 2MB (was module-level const, changed to function)                   |
| SEC-80  | `src/gateway/startup-auth.ts`                                                                                                                        | Early return in `assertHooksTokenSeparateFromGatewayAuth()`                                                       |
| SEC-96  | `src/infra/host-env-security.ts`                                                                                                                     | `sanitizeHostExecEnv()` copies all env vars without filtering                                                     |
| FIX-01  | `src/agents/workspace.ts`                                                                                                                            | Writes `MEMORY.md` via `writeFileIfMissing()` after heartbeat template                                            |

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
- **Not in npm artifacts**: Hub files only exist in the source tree / fork. If missing, plugin silently doesn't load. All 13 SEC items work regardless.

## PR Review History

### Round 1 — Greptile + Codex (automated reviewers)

9 issues flagged (R1-R9). All addressed:

| ID | Issue | Fix |
|----|-------|-----|
| R1 | Security concern about bypassing all checks | Added warning banner in README |
| R2 | README.md conflicts with upstream | Moved our README to `dev-mode/README.md`, restored upstream root README |
| R3 | Hardcoded "Jarvis" name and WhatsApp channel | Renamed to generic terms, added `OPENCLAW_AGENT` and `HUB_CHANNEL` env vars |
| R4 | server.py broken indentation (GitHub suggestion acceptance bug) | Restored proper Python indentation |
| R5 | Personal branding in docs | Removed personal references from all tracked files |
| R6 | Hub auto-start in preAction hook (runs every CLI command, 1s latency) | Moved to `server.impl.ts` — runs once at gateway start only |
| R7 | Silent failures in dev-mode activation | Added try-catch with clear `console.error` messages |
| R8 | loadConfig called before loadDotEnv (route-first commands) | Added dev-mode env var block in `run-main.ts` after dotenv, before `tryRouteCli()` |
| R9 | No error handling for missing python3 | Added ENOENT detection with clear dependency message |

### Round 2 — CI failures + Codex P1/P2 comments

| ID | Issue | Fix |
|----|-------|-----|
| F1 | Test `run-main.profile-env.test.ts` failed — loadDotEnv called twice | Moved dev-mode config block after `loadDotEnv()` in run-main.ts |
| F2 | oxfmt formatter failures (30 files) | Ran `pnpm format` — all cosmetic (import sorting, line wrapping) |
| C1 | P1: `--dev-mode 1` on broken config clobbers all settings | Added empty config guard before writing |
| C2 | P2: Hub plugin only loaded from config, not env var | Split logic: `cfg.cli?.devMode` sets global flag, `isDevMode()` gates hub registration |

### Round 3 — Duplicate loadDotEnv + lint errors

| ID | Issue | Fix |
|----|-------|-----|
| F3 | Same test still failing — loadConfig() internally calls loadDotEnv via `maybeLoadDotEnvForConfig` | Used `createConfigIO({ env: { ...process.env } })` — env copy bypasses the `env !== process.env` check, skipping internal loadDotEnv |
| L1 | 6x `eslint(curly)` errors — one-liner `if` statements need braces | Added `{ }` braces to all `if (isDevMode()) return;` patterns |
| L2 | 4x `restrict-template-expressions` — `unknown` in template literals | Wrapped with `String()` for unknown types in error logging |

### Codex comments we replied to (not code changes)

| Comment | Our reply |
|---------|-----------|
| P2: Fresh install can't enable dev mode (empty config guard too aggressive) | Non-issue: fresh installs have no API keys/gateway/agent config. Users must `openclaw configure` first. By the time `--dev-mode` is relevant, config exists. Guard protects broken configs from clobbering. |
| P2: Hub plugin path not in npm release artifacts | By design: hub is a runtime addon for source-tree/fork users. Path resolved via `import.meta.url`, `fs.existsSync` skips silently if missing. All 13 SEC items work regardless. |

### Human reviewer (sxu75374)

- Raised security concerns about the overall approach of disabling security features
- Not yet addressed — separate discussion from the automated review fixes

## Key Gotcha: loadDotEnv duplication

`loadConfig()` (via `src/config/io.ts` → `createConfigIO` → `maybeLoadDotEnvForConfig`) internally calls `loadDotEnv({ quiet: true })` when `env === process.env` (reference equality check). This means any `loadConfig()` call in `run-main.ts` triggers a second `loadDotEnv` after our explicit one.

**Solution**: Use `createConfigIO({ env: { ...process.env } })` — spreading creates a copy, so the reference check `env !== process.env` is true, and the internal loadDotEnv is skipped.

## Key Gotcha: oxlint curly rule

The codebase enforces `eslint(curly)` — all `if` statements must use braces, even one-liners. `if (isDevMode()) return;` is a lint error. Must be:
```typescript
if (isDevMode()) {
  return;
}
```

## Key Gotcha: restrict-template-expressions

`catch (err)` gives `unknown` type. Using `${err}` in template literals is a lint error. Must use `String(err)`:
```typescript
`Error: ${err instanceof Error ? err.message : String(err)}`
```

## Project File Structure (our additions)

```
dev-mode/
  README.md                       -- Fork install guide and feature table
  list.sec/                       -- Individual implementation plans (SEC-00 through FIX-01)
  tools-restrictions.md           -- Analysis of tool restrictions
  yes.2026.03.06.html             -- HTML visualization of YES items (for human reviewers)
  hub/
    server.py                     -- Python HTTP notification server
    index.ts                      -- OpenClaw plugin (registers 3 tools)
    openclaw.plugin.json          -- Plugin manifest
    README.md                     -- Full API reference
    flow-comparison.html          -- Visual comparison of Hub vs Heartbeat (for human reviewers)
    .gitignore                    -- Excludes *.db, *.log, __pycache__
  rejects/                        -- Gitignored: PR review tracking, working docs, this file
```

## Source Files Modified (20 files)

1. `src/globals.ts` — `setDevMode()` / `isDevMode()`
2. `src/config/types.cli.ts` — `devMode?: boolean`
3. `src/config/zod-schema.ts` — `devMode: z.boolean().optional()`
4. `src/cli/profile.ts` — Parse `--dev-mode 0/1` from argv
5. `src/cli/run-main.ts` — Persist config + auto gateway restart + empty config guard + route-first dev-mode env var
6. `src/cli/program/preaction.ts` — Load devMode from config, auto-enable hub plugin via `isDevMode()`
7. `src/gateway/server.impl.ts` — Auto-start hub server at gateway start
8. `src/agents/system-prompt.ts` — SEC-15a
9. `src/security/channel-metadata.ts` — SEC-27
10. `src/auto-reply/reply/untrusted-context.ts` — SEC-27
11. `src/commands/onboard-config.ts` — SEC-59
12. `src/agents/pi-embedded-runner/extensions.ts` — SEC-67
13. `src/browser/navigation-guard.ts` — SEC-70
14. `src/agents/tools/web-fetch.ts` — SEC-71
15. `src/cli/config-cli.ts` — SEC-72
16. `src/gateway/control-plane-rate-limit.ts` — SEC-78
17. `src/acp/translator.ts` — SEC-79
18. `src/gateway/startup-auth.ts` — SEC-80
19. `src/infra/host-env-security.ts` — SEC-96
20. `src/agents/workspace.ts` — FIX-01

## Key OpenClaw Internals (for future reference)

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

## CI Pipeline

The PR runs these checks (all must pass):

- `pnpm format:check` — oxfmt formatter compliance
- `pnpm tsgo` — TypeScript type check
- `pnpm lint` — oxlint with type-aware rules (curly, restrict-template-expressions, etc.)
- `pnpm test` — vitest on Node (Linux) + 6 sharded Windows runners
- `bunx vitest run` — bun test runner
- `pnpm protocol:check` — protocol compliance
- Build artifacts, Android build/test, install smoke test, secrets scan, actionlint, no-tabs, check-docs
- `check` umbrella job — gates on all above, fails if any sub-job fails
