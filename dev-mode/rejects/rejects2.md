# PR #37427 — Round 2 Issues

> After pushing our R1-R9 fixes (commit `e086f0ec5a`), CI ran and Codex did a 2nd review.
> Greptile has NOT re-reviewed yet (still showing old commit).
> Human reviewer (sxu75374) comment is tracked separately.

---

## Status Overview

| #   | Issue                                          | Source            | Severity | Status                       |
| --- | ---------------------------------------------- | ----------------- | -------- | ---------------------------- |
| F1  | CI: test expects loadDotEnv called once, got 2 | CI (3 jobs)       | Blocking | TODO                         |
| F2  | CI: oxfmt formatting issues in 30 files        | CI (check job)    | Blocking | TODO                         |
| C1  | --dev-mode 1 clobbers broken config            | Codex P1 (new)    | Medium   | TODO                         |
| C2  | Env-var dev mode doesn't register hub plugin   | Codex P2 (new)    | Low      | TODO                         |
| C3  | Config load before bypass checks (repeat)      | Codex P1 (repeat) | —        | ALREADY FIXED (R7 try-catch) |
| C4  | Route-first dev mode (repeat)                  | Codex P2 (repeat) | —        | ALREADY FIXED (R8 env var)   |

---

## F1. CI test failure: loadDotEnv called twice — TODO

**Source**: 3 failing CI jobs (bun test, node test shard 5, check)
**Test**: `src/cli/run-main.profile-env.test.ts` line 75
**Error**: `expected "vi.fn()" to be called once, but got 2 times`

**Problem**: Our R8 fix added `loadConfig()` in `run-main.ts` BEFORE `loadDotEnv()`. The `loadConfig()` call internally triggers `loadDotEnv` as a side effect (config loading needs env vars). So loadDotEnv runs twice: once from our loadConfig, once from the explicit call.

The test mocks loadDotEnv and asserts it's called exactly once. This is a legitimate test — it verifies the profile env is applied before dotenv loads.

**Fix**: Move our R8 block to AFTER `loadDotEnv()` + `normalizeEnv()` but still BEFORE `tryRouteCli()`. The code flow becomes:

```
1. parseCliProfileArgs          (existing)
2. --dev-mode handling           (existing, returns if active)
3. loadDotEnv({ quiet: true })   (existing — called once)
4. normalizeEnv()                (existing)
5. OUR: loadConfig + set env var (moved here — after dotenv, before routing)
6. ensureOpenClawCliOnPath()     (existing)
7. assertSupportedRuntime()      (existing)
8. tryRouteCli()                 (existing — now sees isDevMode() = true)
```

This preserves the test's expectation (loadDotEnv called once) and still sets the env var before tryRouteCli.

---

## F2. CI formatting: oxfmt issues in 30 files — TODO

**Source**: `check` job (types + lint + oxfmt)
**Error**: `Format issues found in above 30 files. Run without --check to fix.`

**Problem**: The oxfmt formatter flags formatting issues. The 30 files include our markdown docs (which were never formatted with oxfmt) AND our modified TS files. The markdown files are likely pre-existing format violations (they existed in the first commit too), but our TS changes may also have minor format issues.

**Fix**: Run the project's formatter locally to auto-fix:

```bash
pnpm oxfmt          # or whatever the format command is
```

Need to check what the format script is in package.json. This should auto-fix all formatting in our changed files. The markdown files we can either format or add to an ignore list if oxfmt shouldn't touch docs.

---

## C1. --dev-mode 1 clobbers broken config — TODO

**Source**: Codex P1 (new) | **File**: `src/cli/run-main.ts:81`

**Problem**: In `run-main.ts`, the `--dev-mode 1` handler does:

```typescript
const cfg = loadConfig(); // returns {} if config is broken
cfg.cli = { ...cfg.cli, devMode: true };
await writeConfigFile(cfg); // writes {cli: {devMode: true}} — everything else gone
```

If the user's config is malformed, `loadConfig()` returns `{}`. Writing it back with just `devMode` destroys all existing settings (API keys, channel configs, etc.).

**Fix**: Before writing, check if the config loaded is essentially empty. If so, warn the user instead of writing:

```typescript
const cfg = loadConfig();
if (!cfg.cli && !cfg.gateway && !cfg.agents && Object.keys(cfg).length === 0) {
  console.error("[dev-mode] Config appears broken or empty. Fix it first: openclaw doctor");
  console.error("[dev-mode] Not writing dev-mode flag to avoid overwriting your config.");
  return;
}
cfg.cli = { ...cfg.cli, devMode: parsedProfile.devMode === "1" };
await writeConfigFile(cfg);
```

Or simpler: read the raw config file, parse it, patch just the `cli.devMode` field, and write back — preserving everything else. But the "check if empty" approach is simpler and sufficient.

---

## C2. Env-var dev mode doesn't register hub plugin — TODO

**Source**: Codex P2 (new) | **File**: `src/cli/program/preaction.ts:122`

**Problem**: In preaction.ts, hub plugin registration is gated on `cfg.cli?.devMode` only. If someone enables dev mode via `OPENCLAW_DEV_MODE=1` env var (without setting it in config), `isDevMode()` returns true but the hub plugin path never gets added to `plugins.load.paths`.

**Fix**: Check `isDevMode()` instead of (or in addition to) `cfg.cli?.devMode`:

```typescript
try {
  const { loadConfig } = await import("../../config/config.js");
  const cfg = loadConfig();
  if (cfg.cli?.devMode) {
    setDevMode(true);
  }
  // Register hub plugin if dev mode is active (config OR env var)
  if (isDevMode()) {
    // ... hub plugin path registration ...
  }
} catch (err) { ... }
```

This splits the logic: config sets the global flag, then `isDevMode()` (which checks both global and env var) gates the plugin registration.

---

## C3. Config load before bypass checks — ALREADY FIXED

**Source**: Codex P1 (repeat from round 1)

Codex re-posted this on our new commit. Our R7 fix (try-catch wrapper) already addresses this — if loadConfig fails, we log the error and continue, so recovery commands still work. Codex doesn't understand that try-catch is a valid alternative to reordering.

**Action**: Resolve the conversation on GitHub. No code changes needed.

---

## C4. Route-first dev mode — ALREADY FIXED

**Source**: Codex P2 (repeat from round 1)

Codex re-posted this on our new commit. Our R8 fix (set env var in run-main.ts before tryRouteCli) already addresses this.

**Action**: Resolve the conversation on GitHub. No code changes needed.
