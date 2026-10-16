# Plan: 2026-03-22 Session — Upgrade, WhatsApp Debug, New Features

## Status: PLAN ONLY — Nothing implemented yet

---

## 1. Upstream Merge (V2026.3.11 → V2026.3.22)

### Context

- **V2026.3.22** released today (2026-03-23). It's 3,469 commits ahead of our base.
- Contains THE WhatsApp fix we were waiting for: `843e3c1efb` — "restore append recency filter lost in extensions refactor"
- Plus 4 additional WhatsApp stability fixes (globalThis singleton, watchdog reconnect, QR pairing, outbound cycle)
- Your friend upgraded successfully — confirms this release is stable for WhatsApp

### Risk Assessment

- **122 files changed** in `extensions/whatsapp/` (the same massive refactor from 3.13, but now with fixes)
- **All 16 of our modified source files** have upstream changes. Expect merge conflicts in every one.
- Biggest upstream diffs in our files: `config-cli.ts` (+982 lines), `server.impl.ts` (+474 lines), `translator.ts` (+168 lines)
- Breaking changes: Plugin SDK rewrite, legacy env names removed
- **SEC-96 dropped**: We accept upstream's env sanitization (including new JVM/glibc/dotnet blocks). No practical impact on dev workflow.
- Default model switched to `openai/gpt-5.4` upstream

### Plan

#### Step 1: Prep (on this PC)

1. `git fetch upstream`
2. Create a fresh branch: `git checkout -b upgrade/v2026.3.22 main`
3. `git merge v2026.3.22` — expect conflicts

#### Step 2: Resolve Conflicts (16 files)

For each of our modified files, re-apply our `isDevMode()` blocks onto the new upstream code:

| File                                          | Our change                                                   | Expected difficulty           |
| --------------------------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `src/globals.ts`                              | `isDevMode()` function                                       | Easy — file is ours           |
| `src/cli/program/preaction.ts`                | Hub plugin registration                                      | Medium — +90 lines upstream   |
| `src/gateway/server.impl.ts`                  | Hub auto-start                                               | Hard — +474 lines upstream    |
| `src/agents/system-prompt.ts`                 | SEC-15a safety paragraph                                     | Easy — small change           |
| `src/security/channel-metadata.ts`            | SEC-27 plain text                                            | Easy — small change           |
| `src/auto-reply/reply/untrusted-context.ts`   | SEC-27 header                                                | Easy — small change           |
| `src/commands/onboard-config.ts`              | SEC-59 skip default                                          | Easy                          |
| `src/agents/pi-embedded-runner/extensions.ts` | SEC-67 compaction                                            | Easy                          |
| `src/browser/navigation-guard.ts`             | SEC-70 URL checks                                            | Easy                          |
| `src/agents/tools/web-fetch.ts`               | SEC-71 50MB limit                                            | Easy                          |
| `src/cli/config-cli.ts`                       | SEC-72 unredacted config                                     | Hard — +982 lines upstream    |
| `src/gateway/control-plane-rate-limit.ts`     | SEC-78 rate limit bypass                                     | Easy                          |
| `src/acp/translator.ts`                       | SEC-79 50MB prompt                                           | Medium — +168 lines           |
| `src/gateway/startup-auth.ts`                 | SEC-80 auth skip                                             | Easy                          |
| `src/infra/host-env-security.ts`              | ~~SEC-96~~ — DROPPED. Accept upstream env sanitization as-is | Easy — just revert our change |
| `src/agents/workspace.ts`                     | FIX-01 MEMORY.md                                             | Medium — +119 lines           |

#### Step 3: Build & Validate

1. `pnpm install`
2. `pnpm build` — must succeed
3. `pnpm format:check` / `pnpm lint` — fix any issues
4. Verify dist/ is regenerated

#### Step 4: Test on VPS

1. Push upgrade branch
2. SSH to VPS, switch to upgrade branch, `npm install --ignore-scripts`
3. `openclaw gateway restart`
4. Test WhatsApp immediately — send message, verify no echo
5. Test all 11 security items are still active (SEC-96 dropped)
6. If stable, merge to `main`

#### - no touching `pr-ready`

---

## 2. WhatsApp Echo Investigation

### What We Know

- **Our code is clean**: Full audit confirms our 12 `isDevMode()` changes touch ZERO WhatsApp/messaging/dedup/echo logic
- **SEC-27** only changes metadata headers in prompts — purely cosmetic
- **No modifications** to: message delivery, deduplication, recency filtering, append logic, or `extensions/whatsapp/`
- Your friend's upgrade worked fine — the echo issue is specific to our VPS
- V3.11 has the working append recency filter (the broken one was only in 3.13+)

### Most Likely Causes (ranked)

1. **Corrupted WhatsApp Signal session from the 3.13 rollback**
   - We upgraded to 3.13 (broken echo filter), then rolled back to 3.11
   - The WA credentials/session state at `~/.openclaw/credentials/whatsapp/default/` may have been mutated by 3.13's refactored code
   - V3.11 code then reads state it doesn't fully understand → intermittent echoes

2. **Stale gateway process or socket**
   - Config writes trigger auto-restart (documented gotcha)
   - If a previous gateway instance didn't fully die, two instances could both receive and forward messages

3. **Signal Protocol "Bad MAC" / encryption corruption**
   - Already documented in CLAUDE.md — gateway restarts can corrupt the WA encryption session
   - Manifests as: "Decrypted message with closed session", delayed message bursts, potential echoes

4. **Agent loop** (less likely)
   - Agent receives a message, responds, but the response triggers another inbound event
   - Would need to check inbound dedup logic and the `echo-cache` system

### Debug Plan (SSH to VPS)

#### Phase A: Observe Current State

```bash
# 1. Check for multiple gateway processes
ps aux | grep openclaw | grep -v grep

# 2. Check gateway logs for echo-related warnings
journalctl -u openclaw-gateway.service --since "1 hour ago" | grep -iE "echo|duplicate|recency|append|bad.mac|closed.session"

# 3. Check WA session state
ls -la ~/.openclaw/credentials/whatsapp/default/

# 4. Check gateway startup logs for WA connection
journalctl -u openclaw-gateway.service -n 200 | grep -iE "whatsapp|baileys|signal|connected|authenticated"
```

#### Phase B: Test Echo Reproduction

1. Send a single message to the bot via WhatsApp
2. Watch logs in real-time: `journalctl -u openclaw-gateway.service -f`
3. Look for: Is the inbound message processed more than once? Does the outbound response loop back as inbound?
4. Check if `inbound-dedupe` is catching/missing anything

#### Phase C: Nuclear Option — Fresh WA Session

If corruption is confirmed:

```bash
# Stop gateway
systemctl stop openclaw-gateway.service

# Backup and remove WA credentials
mv ~/.openclaw/credentials/whatsapp/default ~/.openclaw/credentials/whatsapp/default.bak.$(date +%s)

# Start gateway — will need QR re-pair
systemctl start openclaw-gateway.service
openclaw whatsapp login
```

#### Phase D: If Echo Persists After Fresh Session

- Add temporary debug logging to `src/auto-reply/reply/inbound-dedupe.ts` to trace message dedup
- Check if `src/web/auto-reply/monitor/echo.ts` (echo cache) is functioning correctly on V3.11
- Review `src/auto-reply/reply/reply-delivery.ts` for any dev-mode-adjacent behavior

### Decision Point

**If the upgrade to V2026.3.22 succeeds (Section 1), the echo investigation may be moot** — the new version has explicit echo fixes. Try the upgrade first; only deep-debug if echoes persist on 3.22.

---

## 3. Ollama Web Search Provider (Re-apply)

### Context

- Originally implemented on V2026.3.14 (commit `eb8ad01df2`), rolled back with 3.11 revert
- Full implementation documented in `dev-mode/ollama.web-search-provider.md`
- 3-file change, 218 lines new code + 2 small additions

### Plan

#### Step 1: Check Upstream First

Before re-applying, check if V2026.3.22 already added Ollama web search natively:

```bash
git show v2026.3.22:extensions/ollama/src/ | grep -i "web.search"
```

The upstream "Unreleased" notes mention Exa/Tavily/Firecrawl web search plugins — Ollama may also have been added.

#### Step 2A: If Upstream Has It

- Nothing to do. Remove `dev-mode/ollama.web-search-provider.md` or mark as "upstream now"

#### Step 2B: If Upstream Doesn't Have It

Re-apply the 3 changes onto the V2026.3.22 codebase:

1. **`extensions/ollama/index.ts`** — Add import + `api.registerWebSearchProvider()` call
2. **`extensions/ollama/src/ollama-web-search-provider.ts`** — Create new file (218 lines)
   - ⚠️ Check if plugin-sdk imports changed (Plugin SDK rewrite is a breaking change in 3.22)
   - May need to update imports from `openclaw/extension-api` → `openclaw/plugin-sdk/*`
3. **`src/plugins/bundled-web-search.ts`** — Add "ollama" to bundled list

#### Step 3: Test

1. Build locally
2. Deploy to VPS
3. `openclaw config set plugins.entries.ollama.config.webSearch.apiKey YOUR_KEY`
4. Test: ask agent to search the web, verify Ollama provider is used

### Dependencies

- Must complete Section 1 (upgrade) first — we need the 3.22 codebase to apply changes to

---

## 5. WhatsApp Thinking Messages (New Dev-Mode Feature)

### What

Upstream suppresses all reasoning/thinking payloads on WhatsApp (`shouldSuppressReasoningReply()` in `src/web/auto-reply/deliver-reply.ts`). We want to unsuppress them in dev-mode and add a hardcoded prefix so they're visually distinct from regular replies.

### Env Var Control

```bash
# Add to ~/.openclaw/.env
OPENCLAW_WA_THINKING_MESSAGES=1    # Enable thinking messages on WhatsApp
```

Only active when BOTH `OPENCLAW_DEV_MODE=1` AND `OPENCLAW_WA_THINKING_MESSAGES=1`. Dev-mode alone doesn't change the behavior — opt-in via separate flag.

### Implementation

**File**: `src/web/auto-reply/deliver-reply.ts` — 1 file, ~5 lines

```typescript
function shouldSuppressReasoningReply(payload: ReplyPayload): boolean {
  if (payload.isReasoning === true) {
    // Dev-mode: allow reasoning through if WA thinking messages enabled
    if (isDevMode() && process.env.OPENCLAW_WA_THINKING_MESSAGES === "1") {
      return false;
    }
    return true;
  }
  // ...
}
```

**Prefix**: In the same file, before delivering a reasoning payload, prepend `"💭 "` to `payload.text` so thinking messages are visually distinct in WhatsApp.

### New SEC Item

This would be **SEC-WA1** (or similar) — first WhatsApp-specific dev-mode item.

### Dependencies

- Should target V2026.3.22 codebase (after Section 1 upgrade)
- Verify `shouldSuppressReasoningReply()` still exists in the same form after merge

---

## Execution Order

```
┌─────────────────────────────────────────────────┐
│ 1. UPGRADE (V2026.3.22)                        │
│    ├─ Merge upstream                            │
│    ├─ Resolve 15 file conflicts (SEC-96 dropped) │
│    ├─ Build & validate locally                  │
│    └─ Deploy to VPS, test WhatsApp              │
├─────────────────────────────────────────────────┤
│ 2. WHATSAPP DEBUG (only if echoes persist)      │
│    ├─ Phase A: Observe logs                     │
│    ├─ Phase B: Reproduce echo                   │
│    ├─ Phase C: Fresh WA session                 │
│    └─ Phase D: Deep debug                       │
├─────────────────────────────────────────────────┤
│ 3. OLLAMA WEB SEARCH (after upgrade)            │
│    ├─ Check if upstream added it                │
│    └─ Re-apply if not                           │
├─────────────────────────────────────────────────┤
│ 4. CONFIGURE responsePrefix on VPS (post-upgrade)│
├─────────────────────────────────────────────────┤
│ 5. WA THINKING MESSAGES (after upgrade)         │
│    └─ Unsuppress reasoning + 💭 prefix           │
└─────────────────────────────────────────────────┘
```

**Section 1 is the critical path.** Everything else depends on being on V2026.3.22 first, because:

- WhatsApp echoes may self-resolve with the new WA fixes
- Ollama changes need the new codebase
- responsePrefix and reasoning are just config changes on VPS, no code needed

---

## Open Questions for Ariel

1. **Upgrade risk tolerance**: V2026.3.22 has Plugin SDK breaking changes. Confident enough to try, or want me to audit impact on our hub plugin first?
