# Handoff — 2026-07-21 session

State at time of writing: **nothing committed, nothing pushed, nothing deployed.**
VPS is still running V2026.6.11 and is healthy. All code work sits uncommitted in the
local working tree on branch `upgrade-2026.7.1`.

Source of truth for decisions: `dev-mode/my-archive/my.2026.07.21.md` (Ariel's answers inline).

---

## 1. VPS — kapso teardown (task 1) — COMPLETE AND VERIFIED

All done on the dev VPS. Gateway pid `6704` never changed — no restart was needed at any
point, every config write hot-applied. WhatsApp kept sending successfully throughout.

### Config backup taken first
- `~/.openclaw/openclaw.json.bak-pre-kapso-teardown-20260721` (13729 bytes, root:root, 600)

### Agents / bindings removed
- `openclaw agents delete kapso-pinhas --force --json`
- `openclaw agents delete kapso-elhanan-k --force --json`
- `openclaw agents delete kapso-igal --force --json`
- Each call also removed its own binding and workspace directory.
- Additionally `rmdir`'d three leftover empty `~/.openclaw/agents/kapso-*` state dirs.
- Result: `agents.list` = `main`, `skill-suggester`. `bindings` = empty array.

### Plugin removed
- `openclaw config unset plugins.entries.whatsapp-kapso-claw`
- `openclaw config set plugins.allow [...]` — re-set without `whatsapp-kapso-claw`
- `rm -rf ~/.openclaw/npm/projects/whatsapp-kapso-claw`
- NOTE: the CLI `openclaw plugins uninstall` hung the SSH pipe twice (interactive prompt
  desyncing shared stdin, even with `--force`). No remote process was ever wedged. The
  fallback `rm -rf` was used instead. **Lesson: always add `< /dev/null` to openclaw CLI
  calls over SSH.**
- Final grep of the whole config for `kapso|wa-claw`: **no matches.**

### Message database moved (this was the valuable bit)
- Verified nothing held it open (`lsof`/`fuser` both empty), no `-wal`/`-shm` sidecars.
- Removed the two symlinks `~/.openclaw/dev-mode/wa-history.db` and
  `~/.openclaw/dev-mode/openclaw-whatsapp-claw.db` (verified they were symlinks first).
- `mv ~/.openclaw/wa-claw-kapso/wa-claw-baileys.db ~/.openclaw/dev-mode/wa-history.db`
- **Byte count before and after: 238141440 — exact match.** `file` confirms SQLite 3.x,
  58140 pages. Now `root:root`, mode `600`.

### Files deleted
- `~/.openclaw/wa-claw-kapso/` (whole dir, incl. `wa-claw-kapso.db`, `last-poll`)
- `~/.openclaw/dev-mode/wa-claw.env` (credentials)
- `~/.openclaw/dev-mode/openclaw-whatsapp-claw.db.bak-20260702` (225 MB stale backup)
- `~/.openclaw/dev-mode/openclaw-whatsapp-claw.log`
- `~/.openclaw/openclaw.json.bak-kapso-park` (held real Kapso API creds in plaintext)
- `~/.openclaw/workspaces/kapso-*`, `~/.openclaw/agents/kapso-*`

### Network / service surface closed
- `/etc/nginx/conf.d/wa-claw.conf` removed (backup kept at `/root/wa-claw.conf.bak-teardown-20260721`);
  `nginx -t` passed before reload; nginx reloaded cleanly.
- ufw: deleted both `17890/tcp` rules (v4 and v6). Port is closed.
- `/etc/ssl/wa-claw/` (cert.pem, key.pem) removed.
- `wa-claw-panel.service`: stopped, disabled, unit file deleted, `daemon-reload` run.
  Unit is now "could not be found".

### ⚠️ OPEN ITEM — gateway token
The deleted `wa-claw-panel.service` contained `OPENCLAW_GATEWAY_TOKEN` in plaintext.
**It MATCHED the live `gateway.auth.token` in `openclaw.json`.** The plaintext copy is gone,
but the token itself was **NOT rotated** — deliberately left for Ariel to do while present,
since rotating it can break other clients.

### Side effects
- `channels` is now exactly `["whatsapp", "discord"]`. Only one WhatsApp-family channel
  remains, so the "Channel is required when multiple channels are configured" implicit-send
  problem is resolved as a byproduct.
- `openclaw message send --help` no longer lists `whatsapp-kapso`.

### Pre-existing, untouched
- `plugins.entries.openclaw-web-search` throws a stale packaging warning on every config
  load. Unrelated to kapso, left alone.
- `/opt/openclaw-dev-mode/dev-mode/openclaw-whatsapp-claw/` does **not** exist on the VPS
  (nothing to clean there).
- The VPS git checkout is dirty (`M npm-shrinkwrap.json` + ~17 `T` type-changes on CLAUDE.md
  files, the known `core.symlinks` drift) and is BEHIND local main — VPS HEAD is
  `ec8a11848e`, local main is `244849d3575`.

---

## 2. Local repo — upgrade to upstream v2026.7.1 (task 4)

- Branch **`upgrade-2026.7.1`** created from tag `v2026.7.1` (lowercase `v` — the actual git
  tag casing, unlike the `V2026.x.x` prose convention in CLAUDE.md).
- **`main` is untouched at `244849d3575`.**
- Scope: 3,368 upstream commits, 8,767 files changed between `v2026.6.11` and `v2026.7.1`.
- WhatsApp extension was *additive only* this cycle (82 files, +2,728/-354, no deletes or
  renames) — NOT a repeat of the V2026.3.13 disaster.
- 12 of the fork's patched files were byte-identical at 7.1 and applied verbatim.
- `.github/workflows/` removed — **68 files** (upstream added 4 since 6.11: `android-release.yml`,
  `mantis-web-ui-chat-proof.yml`, `native-app-locale-refresh.yml`, `plugin-init-scaffold-validation.yml`).

### Patch catalogue location
Scratchpad holds `CATALOGUE.md` + 32 `patch-*.diff` files (each = `git diff v2026.6.11..main -- <file>`):
`C:\Users\Ariel\AppData\Local\Temp\claude\C--Users-Ariel-source-openclaw-chaos-mode-openclaw-dev-mode\32ace420-1335-42c3-ad5c-4f7d61179943\scratchpad`

### Newly discovered patched file (was NOT in CLAUDE.md's list)
- `src/auto-reply/reply/get-reply-native-slash-fast-path.ts` — part of FIX-06 (fork commit
  `fd267f00487`). Adds `!(isDevMode() && commandName === "compact")` to
  `shouldRunNativeSlashCommandFastPath()` so `/compact` goes through the normal pipeline in
  dev-mode. **Add this to CLAUDE.md's Source Files Modified list.**

### Flagged but NOT ported (needs Ariel's call)
- `.agents/skills/blacksmith-testbox/SKILL.md`, `.agents/skills/optimizetests/{SKILL.md,agents/openai.yaml}`
  — trace to one-off commit `35fc674f4e7` ("pre glm fix-06"), look like accidentally-restored
  upstream docs, unrelated to any SEC/FIX patch.

---

## 3. Decisions applied from Ariel's answers

| Decision | Applied as |
|---|---|
| SEC-97 UI half: **skip for now**, show him new stock UI first | No `ui/` patch ported. `ui/src/ui/dev-mode-boot.ts` (fork-original) dropped. Upstream deleted the entire `ui/src/ui/` tree (386 files, -163K lines) and rebuilt the Control UI as a page router. |
| SEC-97 server half: keep | `src/config/redact-snapshot.raw.ts`, `redact-snapshot.ts`, `types.openclaw.ts` ported, so the raw config editor still works and a future UI patch has the `devMode` flag to read. |
| wa-claw socket tap: remove | `__waClawSocks` / `__waClawSockTap` block deleted from `extensions/whatsapp/src/session.ts`. One less keep-ours patch. |
| Only `OPENCLAW_DEV_MODE=1` gates anything | `OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES`, `OPENCLAW_DEV_MODE_CLEAR_UI`, `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES` removed everywhere. SEC-WA1 is now unconditional under dev-mode. |
| Version: stable | `v2026.7.1`, not the `v2026.7.2-beta.3` that exists upstream. |
| Order: upgrade first, then patches | Done — tasks 2 and 3 were written on top of 7.1, not on 6.11. |

---

## 4. Task 2 — WhatsApp history recorder restored

New file: **`extensions/whatsapp/src/dev-mode/wa-history.ts`** (~228 lines).
Rebuilt from commit `5475e57965` (the last good version before it was handed to the plugin
on 2026-07-02), with these changes layered on:

- **`phone_e164 TEXT`** added to both `messages` and `chats`, plus indexes
  `idx_messages_phone_e164` / `idx_chats_phone_e164`.
- **`jidToPhoneE164()`** ported from the plugin: `@g.us` → null, `@s.whatsapp.net` → strip
  and prefix `+`, `@lid` → falls back to `remoteJidAlt`. Handles the Baileys 7.x `@lid` JIDs
  the original fork logger predated.
- **`ensureColumn()` migration guard** — after `CREATE TABLE IF NOT EXISTS`, checks
  `PRAGMA table_info` and only `ALTER TABLE ... ADD COLUMN` if missing. Works against a fresh
  DB, the existing 227 MB DB (which already has the column), or an old pre-column DB.
- `recordChatName()` uses `phone_e164 = COALESCE(chats.phone_e164, excluded.phone_e164)` so
  an existing value is never overwritten with a worse guess.
- Group-name backfill unchanged (`groupFetchAllParticipating` on first `connection.update ===
  "open"`, plus `groups.upsert` / `groups.update` / `GROUP_CREATE` / `GROUP_CHANGE_SUBJECT`).
- Uses Node built-in `node:sqlite` (`DatabaseSync`) — **no new dependencies.**
- DB path: `~/.openclaw/dev-mode/wa-history.db` (matches where the VPS DB now lives).
- Uses `oxlint-disable-next-line typescript/no-explicit-any` (this repo is oxlint, not eslint).

Hook re-added in `extensions/whatsapp/src/session.ts`, right before `return sock;` — the same
spot the removed wa-claw tap occupied:
```ts
  // [dev-mode] Attach WhatsApp history logger
  if (process.env.OPENCLAW_DEV_MODE === "1") {
    try {
      const { attachWaHistoryLogger } = await import("./dev-mode/wa-history.js");
      attachWaHistoryLogger(sock);
    } catch {
      // dev-mode history logger is best-effort — never block channel startup
    }
  }
```
`createWaSocket` is already `async`, so the dynamic import needed no signature change.

**Verified bundled**: after the build, `grep -rl attachWaHistoryLogger dist/` returns
`dist/session-Bl3_JezT.js` and `dist/wa-history-CfXbg--w.js`.

---

## 5. Task 3 — FIX-05 redesigned: compact instead of reset

Files touched: `src/auto-reply/reply/session.ts`, `src/auto-reply/reply/commands-compact.ts`,
`src/auto-reply/templating.ts`.

### Mechanism
At the daily boundary (stock default `mode: "daily"`, `atHour: 4`), instead of minting a new
session, `session.ts` rewrites the trigger body to a synthetic `"/compact <prompt>"` so the
existing `/compact` handler runs. That gives, for free and from already-proven code:
- the FIX-06 forced memory flush (`runDevModeCommandMemoryFlush()`),
- compaction with `customInstructions`,
- the greet-after-compact path.

`skipImplicitExpiry` reverted to upstream shape (`resetPolicy.configured !== true &&
hasProviderOwnedSession(entry)`) — dev-mode no longer forces `{fresh: true}`, because the real
staleness result is needed to detect the boundary.

### The prompt
```
const DEV_MODE_AUTO_COMPACT_DEFAULT_PROMPT =
  "this is auto compact, so try to remember everything the user talked with you other than daily news or security or hub notifications";
```
Overridable via `OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT`. **Note the tension**: Q9 said "remove
all flags, only `OPENCLAW_DEV_MODE=1`", Q13 said yes to an env-overridable prompt. Resolved as:
this is a *value* override, never a gate — the feature works fully with only
`OPENCLAW_DEV_MODE=1`. If Ariel wants it gone, delete `resolveDevModeAutoCompactPrompt()` and
inline the constant.

### Re-trigger gating
No new persisted field. `sessionEntry.sessionStartedAt` is advanced to `now` in the same branch
— exactly what a real daily reset already does. `evaluateSessionFreshness` computes
`staleDaily = sessionStartedAt < dailyResetAt`, so the session reads fresh for the rest of the
day. Verified `incrementCompactionCount` / `session-updates.ts` never clobber `sessionStartedAt`.
Advanced *before* compaction runs, so a failed compaction cannot cause a re-trigger loop.

### Three defects found and fixed after the first implementation
1. **User's message was being swallowed.** The synthetic `/compact` replaced the real message,
   so the first message each day got a greeting back and the question vanished. Fixed: a
   `DevModeAutoCompact` marker on `TemplateContext` lets `commands-compact.ts` restore the
   user's original body after compacting and continue the turn, so they get a real answer in
   the freshly-compacted session. The greeting is preserved **only** for manual `/compact`.
2. **Skip/failure paths also ate the message.** An auto-compact that skips or fails now logs
   and continues with the original message instead of showing the user
   `⚙️ Compaction skipped: …` plumbing they never asked for.
3. **Unauthorized senders.** `/compact` dispatch is gated on `isAuthorizedSender`. First
   version let those turns fall through to a stock hard reset — violating "DO NOT new session".
   Fixed by splitting the condition: `devModeAutoCompactEligible` (feeds `freshEntry`, so the
   session is always preserved) vs `devModeAutoCompact` (additionally requires
   `resolveCommandAuthorization(...).isAuthorizedSender`; gates the body rewrite, the marker,
   and the `sessionStartedAt` advance). An unauthorized sender's message is answered normally,
   the session is kept, and the compaction fires on the next authorized message.

### Verified unaffected
Non-dev-mode; configured reset policy; provider-owned (CLI) sessions; system/heartbeat events;
explicit `/new` and `/reset`; soft reset. Each either keeps its own independent
freshEntry-preserving arm or is intentionally excluded.

### Deliberately left alone
`terminalMainTranscriptNewerThanRegistry` is `&&`-ed onto the whole `freshEntry` chain and can
still force a reset. It's a transcript/registry desync safety net, unrelated to daily-reset
policy, and predates FIX-05. Reusing an entry known to disagree with the on-disk transcript is
the worse failure. Not changed.

---

## 6. Build status

| Step | Result |
|---|---|
| `pnpm tsgo` | **PASS**, exit 0 |
| `pnpm lint` (oxlint type-aware) | **PASS**, exit 0, no errors in our files |
| `pnpm build` | **FAILED at the final step only** — see below |
| `pnpm ui:build` | ran inside build-all, done in 3.52s |

`dist/` is 130 MB and complete: tsdown 376.4s, runtime-postbuild 6.62s, plugins:assets,
check-plugin-sdk-exports, write-build-info all succeeded. `dist/extensions/whatsapp/` exists.

### ⚠️ THE BLOCKER
```
[build-all] write-cli-startup-metadata
Error: Failed to render source secrets help: openclaw: Node.js >=22.22.3 <23, >=24.15.0 <25,
or >=25.9.0 is required (current: v22.21.1).
[ELIFECYCLE] Command failed with exit code 1.
```
Upstream v2026.7.1 raised the Node engine floor. This machine runs **v22.21.1**. The step runs
the freshly-built CLI to render help text into startup metadata, and the CLI refuses to start.

Environment survey:
- `node -v` → `v22.21.1`
- nvm IS installed at `C:\Users\Ariel\AppData\Roaming\nvm`, but the only version present is
  `v16.13.1`
- a system Node exists at `C:\Program Files\nodejs\node.exe`

**Fix**: `nvm install 24 && nvm use 24`, then re-run `pnpm build`. (VPS already runs Node
v24.14.0, so the VPS side is fine either way.) Whether the missing startup metadata actually
breaks runtime was NOT determined — do not assume it's cosmetic.

---

## 7. ⚠️ Open item — session.test.ts failures, cause UNKNOWN

`npx vitest run src/auto-reply/reply/session.test.ts src/auto-reply/reply/commands-compact.test.ts`
- `commands-compact.test.ts` — **PASSES**
- `session.test.ts` — **136 failed / 13 passed**

Every failure is the same error, in `afterEach`:
```
TypeError: Cannot read properties of undefined (reading 'mockRestore')
 ❯ src/auto-reply/reply/session.test.ts:1960:48
    clearBootstrapSnapshotOnSessionRolloverSpy.mockRestore();
```
i.e. `vi.spyOn(bootstrapCache, "clearBootstrapSnapshotOnSessionRollover")` in `beforeEach`
never produced a spy, so all tests in the `initSessionState reset policy` describe block blow
up in teardown. The export exists and is imported normally
(`src/agents/bootstrap-cache.ts:77`), so this smells like a spy/ESM-module-mutability setup
failure rather than our logic — **but this was NOT proven.**

**The A/B test was never run.** The plan was: `git show v2026.7.1:src/auto-reply/reply/session.ts`
into a temp file, `cp` the pristine version over ours, re-run the test, then `cp` ours back —
no git writes. This could not be done while the build was reading `src/`, and the session ended
before it could be done afterwards. **Do this before deploying.** If it fails identically on
pristine 7.1, it's pre-existing upstream/Windows breakage and can be ignored. If it passes on
pristine, FIX-05 broke it and must be fixed.

---

## 8. ⚠️ Repo hazard — read before touching git

This repo tracks a **self-referencing symlink**:
`packages/speech-core/node_modules/openclaw` → the repo root.
`git checkout` walks into it, resolves `.../openclaw/.git/index.lock` back to this repo's own
`.git`, and destroys `.git/HEAD`, `.git/config`, `.git/index`.

**This happened TWICE this session** — once during the initial branch creation, once when
repairing symlinks. Both recovered; no objects, refs or commits were ever lost.

Critically: `git config core.symlinks false` does **NOT** protect you. It only changes how git
*writes* symlinks; it does not stop git *traversing* one that already exists on disk. And
`pnpm install` recreates the symlink.

**Correct procedure — always, before any git command that writes the working tree:**
```bash
find . -type l -not -path "./.git/*" -exec sh -c \
  'test "$(readlink "$1")" = "/c/Users/Ariel/source/openclaw chaos mode/openclaw-dev-mode"' _ {} \; -print
# remove anything printed with plain `rm "<path>"` — never rm -rf, never a trailing slash
```
Re-run that sweep after every `pnpm install` / `pnpm tsgo` (tsgo triggers an install).

### Recovery already applied
- `.git/HEAD` rewritten to `ref: refs/heads/upgrade-2026.7.1`
- `.git/config` reconstructed by hand with `symlinks = false` now **permanent**, and remotes:
  - `origin` → `https://github.com/bresleveloper/openclaw-dev-mode.git`
  - `upstream` → `https://github.com/openclaw/openclaw.git`
  - **Verify these URLs are right before pushing.**
- Index rebuilt with `git read-tree HEAD` (does not touch working-tree files)
- `git fsck --connectivity-only`: clean, only harmless dangling objects
- The first crash also silently deleted **413 tracked files** (whole workspace packages
  `packages/ai`, `gateway-client`, `gateway-protocol`, `normalization-core`,
  `media-core/src`, plus `.agents/skills/**`, `.env.example`, `.dockerignore`, `.crabbox.yaml`).
  All restored via `git diff --name-only --diff-filter=D | grep -v '^\.github/workflows/'`
  piped to `git checkout --`.

---

## 9. Current working tree

Branch `upgrade-2026.7.1`. `git status --porcelain` = **33 M / 68 D / 3 ??**

- **68 D** — `.github/workflows/**` only. Intentional, keep deleted.
- **3 ??** — `dev-mode/`, `extensions/whatsapp/src/dev-mode/`, `src/auto-reply/reply/dev-mode-memory-flush.ts`
- **33 M** — the dev-mode patch set:
  `CLAUDE.md`, `README.md`, `package.json`, `scripts/lib/bundled-plugin-build-entries.mjs`,
  `extensions/browser/src/browser/navigation-guard.ts`, `extensions/ollama/src/stream.ts`,
  `extensions/whatsapp/src/auto-reply/deliver-reply.ts`,
  `extensions/whatsapp/src/auto-reply/monitor/on-message.ts`, `extensions/whatsapp/src/session.ts`,
  `src/acp/translator.ts`, `src/agents/agent-tools.ts`, `src/agents/system-prompt.ts`,
  `src/agents/tools/web-fetch.ts`, `src/agents/workspace.ts`,
  `src/auto-reply/reply/agent-runner-memory.ts`, `src/auto-reply/reply/commands-compact.ts`,
  `src/auto-reply/reply/commands-reset.ts`,
  `src/auto-reply/reply/get-reply-native-slash-fast-path.ts`,
  `src/auto-reply/reply/reply-elevated.ts`, `src/auto-reply/reply/session.ts`,
  `src/auto-reply/reply/untrusted-context.ts`, `src/auto-reply/templating.ts`,
  `src/cli/config-cli.ts`, `src/commands/onboard-config.ts`,
  `src/config/redact-snapshot.raw.ts`, `src/config/redact-snapshot.ts`,
  `src/config/types.openclaw.ts`, `src/gateway/control-plane-rate-limit.ts`,
  `src/gateway/tool-resolution.ts`, `src/globals.ts`, `src/media/local-media-access.ts`,
  `src/security/channel-metadata.ts`, `src/status/status-message.ts`

`dist/` is untracked on this branch (cut from the upstream tag, where `dist/` is gitignored).
It must be force-added: **`git add -f dist/`** — `git add -A` silently skips new dist chunks
and the first gateway start then dies with `Cannot find module`.

---

## 10. Remaining work, in order

1. `nvm install 24 && nvm use 24`; re-run `pnpm build` to completion (fixes §6 blocker).
2. Run the §7 A/B test on `session.test.ts` to settle whether FIX-05 broke it.
3. Verify `grep -rl attachWaHistoryLogger dist/` still non-empty after the clean rebuild.
4. Check `dist/extensions/tlon` / `dist-runtime/extensions/tlon` dirt (known Windows symlink
   artifact) — restore from git if dirty.
5. Commit: `git add -f dist/` plus the 33 modified + 3 untracked paths.
6. Push. **Recommendation: push `upgrade-2026.7.1` as a normal branch and switch the VPS to
   it — do NOT force-push `main`.** Fully reversible; Ariel promotes to `main` after testing.
   (The previous upgrade rewrote `main` onto the upstream tag; that would need a force push.)
7. Deploy on VPS: `git config core.symlinks false && git checkout -- . ; git fetch &&
   git checkout upgrade-2026.7.1 && git config --unset core.symlinks &&
   npm install --ignore-scripts && openclaw gateway restart`.
   The VPS tree is currently dirty and behind — expect to reset it.
8. Wait ~2 min for the known WA listener warm-up before judging WhatsApp.
9. Run the config round-trip diff recipe (raw vs Zod-coerced) — 124 upstream commits touched
   `src/config/` and commit-subject scanning found no obvious breaker, but that method has
   missed real ones before (e.g. the V2026.4.24 TTS rename). Ask Ariel to click the Raw tab.
10. Send the test WhatsApp message. Ariel asked for "some love ♥ ☺".

## 11. Decisions still needed from Ariel

- Rotate the gateway token? (It was exposed in the deleted unit file; not rotated.)
- Promote `upgrade-2026.7.1` to `main`, or keep as a branch?
- SEC-97 UI: he wants to see the new stock Control UI and then point at what to re-patch.
- The two `.agents/skills/` files — port or drop?
- `coder` (uid 1001) owns much of `~/.openclaw`; it's his browser-based mini-VSCode on port
  38080. He asked whether permissions can be set correctly. Not addressed this session. The
  WA history DB is now root-owned, which is what matters for the gateway.
