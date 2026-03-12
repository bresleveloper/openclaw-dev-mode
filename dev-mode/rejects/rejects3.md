# Rejects Round 3 — PR #37427 (commit 73f19e09)

> CI failures + new Codex/Greptile/human review comments after updating to v2026.3.7 and removing config persistence.

## Failed CI Checks (4)

### 1. `check` — oxfmt formatting failure

**File:** `src/commands/doctor-gateway-auth-token.test.ts`

**Error:** `Format issues found in above 1 files. Run without --check to fix.`

**Analysis:** This is an upstream file we didn't touch. The upstream `main` branch likely merged a change to this file after our fork point that wasn't formatted with oxfmt. Our PR branch includes this file from the v2026.3.7 merge, and CI's `pnpm format:check` catches it.

**Fix:** Run `pnpm format` on pr-ready and commit the result. One file, cosmetic only.

---

### 2. `checks (bun, test)` — bun vitest failure

**Error:** `[vitest] No "isDevMode" export is defined on the "../../globals.js" mock. Did you forget to return it from "vi.mock"?`

**File:** `src/cli/program/preaction.test.ts`

**Analysis:** The existing test mocks `../../globals.js` at line 15-17 with only `setVerbose`. Our `preaction.ts` now imports `isDevMode` from the same module (line 121). Since the mock doesn't include `isDevMode`, vitest throws when `preaction.ts` calls `isDevMode()` during any test that runs `runPreAction()`. This affects 5 test cases (lines 136, 178, 188, 212, 221).

**Fix:** Add `isDevMode` to the mock:

```typescript
vi.mock("../../globals.js", () => ({
  setVerbose: setVerboseMock,
  isDevMode: () => false, // dev-mode off by default in tests
}));
```

This is the right approach — tests should run with dev-mode off unless specifically testing dev-mode behavior. No new test file needed, just one line added to the existing mock.

---

### 3. `checks-windows (node, test, shard 2/6)` — Windows vitest failure

**Error:** Same as #2 — `No "isDevMode" export is defined on the "../../globals.js" mock`

**Analysis:** Identical root cause to #2. The same `preaction.test.ts` file fails on Windows Node.js runner (shard 2 of 6). Same 5 test cases fail.

**Fix:** Same fix as #2 — adding `isDevMode` to the mock fixes both Linux bun and Windows node runners.

---

### 4. `secrets` — detect-secrets scan failure

**Error:** `Potential secrets about to be committed to git repo!`

**Flagged locations (all false positives in test files / docs):**

- `extensions/googlechat/src/channel.outbound.test.ts:23` — Secret Keyword
- `src/commands/gateway-status.test.ts:152` — Secret Keyword
- `extensions/feishu/src/onboarding.test.ts:102,116,120,131` — Secret Keyword
- `src/pairing/setup-code.test.ts:75,107` — Secret Keyword
- `docs/tools/web.md:107` — Secret Keyword

**Analysis:** These are ALL upstream files we didn't modify. The detect-secrets scan runs on ALL files (it fell back to full scan because it couldn't diff against base). These are test fixtures containing words like "secret", "token", "password" in mock data — standard false positives.

**Fix:** This is NOT our problem. These false positives exist in upstream's own codebase. Options:

1. **Do nothing**

---

## PR Review Comments

### Codex (automated) — 5 review rounds

Codex reviewed commits 42ea45d, e086f0ec, d73d2aac, 73f19e09, and bca10e9b. The inline comments raised these issues:

| ID    | Priority | Issue                                                    | Status                                                                                                                                                                                                                                             |
| ----- | -------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-P1e | P1       | Avoid blocking notify flow on single-threaded Hub server | **Valid concern** — `HTTPServer` is single-threaded, `wake_agent()` blocks during the HTTP call to gateway. If agent calls `hub_done` during processing, it'll timeout. Fix: use `ThreadingHTTPServer` or make `wake_agent()` async via threading. |
| C-P1f | P1       | Read the gateway auth token env name                     | **Valid concern** — Hub reads `OPENCLAW_TOKEN` but gateway uses `OPENCLAW_GATEWAY_TOKEN`. Fix: change `server.py` to read `OPENCLAW_GATEWAY_TOKEN`.                                                                                                |

**Actually actionable from Codex:**

1. Fix `server.py` to use `OPENCLAW_GATEWAY_TOKEN` instead of `OPENCLAW_TOKEN`
2. Fix `server.py` single-threaded blocking — use `ThreadingHTTPServer`
3. Verify `setConfigOverride` values don't leak into `writeConfigFile`

---

## Summary: What needs to be done

### Must fix (CI blockers):

1. `pnpm format` on pr-ready (1 upstream file: `doctor-gateway-auth-token.test.ts`)
2. Add `isDevMode: () => false` to the globals mock in `preaction.test.ts`

### Should fix (valid review feedback):

3. `server.py`: Change `OPENCLAW_TOKEN` to `OPENCLAW_GATEWAY_TOKEN`
4. `server.py`: Use `ThreadingHTTPServer` instead of `HTTPServer`
5. Add startup warning banner when dev-mode is active
