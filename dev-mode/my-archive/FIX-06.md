# FIX-06 — Memory Flush + Greet-After-Compact

## Overview

Two dev-mode features for `/compact` and `/new`:

1. **Memory flush** — flush MEMORY.md immediately instead of waiting for next inbound message
2. **Greet-after-compact** — after successful compaction, the agent produces a persona greeting (same concept as FIX-04 for `/new`)

## Status

- `/new` memory flush: **WORKING** (implemented by prior agent)
- `/compact` memory flush: **BROKEN** — bug found, fix documented below
- Greet-after-compact: **NOT IMPLEMENTED** — plan documented below

---

## Part A — Fix /compact Memory Flush Bug

### Root Cause

The flush call is placed AFTER `incrementCompactionCount()` (line ~317), which writes the small post-compact token count to the session entry. `runMemoryFlushIfNeeded` internally calls `shouldRunMemoryFlush`, which gates on `totalTokens < threshold`. The post-compact count is always below threshold, so it silently skips.

The `/new` path works because `runDevModeCommandMemoryFlush` is called BEFORE the reset, with `targetSessionEntry` still holding the full pre-reset token count.

### Fix

Move the flush call from AFTER compaction to BEFORE compaction.

**File**: `src/auto-reply/reply/commands-compact.ts`

Find the current FIX-06 code (lines ~317-320):

```ts
if (isDevMode()) {
  const postCompactEntry = params.sessionStore?.[params.sessionKey] ?? targetSessionEntry;
  await runDevModeCommandMemoryFlush(params, postCompactEntry);
}
```

**DELETE** that block entirely.

Then find this line (line ~249):

```ts
  const result = await runtime.compactEmbeddedAgentSession({
```

**INSERT BEFORE IT**:

```ts
if (isDevMode()) {
  await runDevModeCommandMemoryFlush(params, targetSessionEntry);
}
```

At this point, `targetSessionEntry` is the pre-compact entry (resolved at line 209), which has the full session history and token count above threshold — exactly the same timing as the `/new` flush.

The full context around the insertion point (lines ~224-249):

```ts
  if (runtime.isEmbeddedAgentRunAbortableForCompaction(sessionId)) {
    runtime.abortEmbeddedAgentRun(sessionId);
    await runtime.waitForEmbeddedAgentRunEnd(sessionId, 15_000);
  }
  const sessionAgentId = params.sessionKey
    ? resolveSessionAgentId({ sessionKey: params.sessionKey, config: params.cfg })
    : (params.agentId ?? "main");
  // ... more setup ...
  const contextTokenBudget = resolveManualCompactContextTokenBudget({
    // ...
  });
  // >>> INSERT HERE <<<
  if (isDevMode()) {
    await runDevModeCommandMemoryFlush(params, targetSessionEntry);
  }
  const result = await runtime.compactEmbeddedAgentSession({
```

Use the Edit tool with:

- `old_string`: `  const result = await runtime.compactEmbeddedAgentSession({`
- `new_string`:

```
  if (isDevMode()) {
    await runDevModeCommandMemoryFlush(params, targetSessionEntry);
  }
  const result = await runtime.compactEmbeddedAgentSession({
```

---

## Part B — Greet-After-Compact (new feature)

### How FIX-04 works for /new (reference)

`/new` and `/reset` are excluded from the native slash command fast path (`shouldRunNativeSlashCommandFastPath` checks `commandName !== "new"` and `commandName !== "reset"`). They go through the full main pipeline.

In FIX-04 (`commands-reset.ts` line ~187), dev-mode skips the hardcoded "New session started" ACK by returning `null` (not handled). `handleCommands` falls through to `{ shouldContinue: true }`. The main pipeline then runs the agent with `BARE_SESSION_RESET_PROMPT_BASE` as the user prompt, producing a persona greeting.

### Why /compact needs a different approach

- `/compact` currently goes through the native fast path (it's not excluded like /new and /reset)
- The session is NOT reset, so `BARE_SESSION_RESET_PROMPT_BASE` won't apply
- We need to: (a) exclude /compact from the fast path in dev-mode, (b) mutate the body to a greeting prompt, (c) return `shouldContinue: true` so the agent runs

### Files to Change

| File                                                       | Change                                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| `src/auto-reply/reply/get-reply-native-slash-fast-path.ts` | Exclude `/compact` from fast path in dev-mode                  |
| `src/auto-reply/reply/commands-compact.ts`                 | Return `shouldContinue: true` with greeting prompt in dev-mode |

### Step 1 — Exclude /compact from fast path in dev-mode

**File**: `src/auto-reply/reply/get-reply-native-slash-fast-path.ts`

Add `isDevMode` to imports. Current imports (line 1-20) do NOT include globals.js. Add:

```ts
import { isDevMode } from "../../globals.js";
```

Find the function (lines 69-78):

```ts
function shouldRunNativeSlashCommandFastPath(ctx: MsgContext): boolean {
  const commandTurn = resolveCommandTurnContext(ctx);
  const commandName = resolveNativeSlashCommandName(ctx);
  return Boolean(
    commandName &&
    commandName !== "new" &&
    commandName !== "reset" &&
    (isNativeCommandTurn(commandTurn) ||
      shouldRunInternalTextSlashCommandFastPath(ctx, commandTurn, commandName)),
  );
}
```

Replace with:

```ts
function shouldRunNativeSlashCommandFastPath(ctx: MsgContext): boolean {
  const commandTurn = resolveCommandTurnContext(ctx);
  const commandName = resolveNativeSlashCommandName(ctx);
  return Boolean(
    commandName &&
    commandName !== "new" &&
    commandName !== "reset" &&
    !(isDevMode() && commandName === "compact") &&
    (isNativeCommandTurn(commandTurn) ||
      shouldRunInternalTextSlashCommandFastPath(ctx, commandTurn, commandName)),
  );
}
```

Use the Edit tool with:

- `old_string`:

```
    commandName !== "reset" &&
    (isNativeCommandTurn(commandTurn) ||
```

- `new_string`:

```
    commandName !== "reset" &&
    !(isDevMode() && commandName === "compact") &&
    (isNativeCommandTurn(commandTurn) ||
```

### Step 2 — Return greeting on successful compact

**File**: `src/auto-reply/reply/commands-compact.ts`

Find the return block at the end of `handleCompactCommand` (lines ~333-340):

```ts
runtime.enqueueSystemEvent(line, { sessionKey: params.sessionKey });
return {
  shouldContinue: false,
  reply: {
    text: `⚙️ ${line}`,
    isStatusNotice: true,
  },
};
```

Replace with:

```ts
runtime.enqueueSystemEvent(line, { sessionKey: params.sessionKey });
if (isDevMode() && result.ok && result.compacted && !codexNativeCompactionStarted) {
  const greetPrompt =
    "The session context was just compacted. Briefly greet the user now. Be yourself — use your configured persona, voice, and mood. Keep it to 1-2 sentences. Do not mention compaction, technical details, internal steps, or files.";
  const mutableCtx = params.ctx as Record<string, unknown>;
  mutableCtx.Body = greetPrompt;
  mutableCtx.BodyForAgent = greetPrompt;
  mutableCtx.BodyStripped = greetPrompt;
  return { shouldContinue: true };
}
return {
  shouldContinue: false,
  reply: {
    text: `⚙️ ${line}`,
    isStatusNotice: true,
  },
};
```

Use the Edit tool with:

- `old_string`:

```
  runtime.enqueueSystemEvent(line, { sessionKey: params.sessionKey });
  return {
    shouldContinue: false,
    reply: {
      text: `⚙️ ${line}`,
      isStatusNotice: true,
    },
  };
```

- `new_string`:

```
  runtime.enqueueSystemEvent(line, { sessionKey: params.sessionKey });
  if (isDevMode() && result.ok && result.compacted && !codexNativeCompactionStarted) {
    const greetPrompt =
      "The session context was just compacted. Briefly greet the user now. Be yourself — use your configured persona, voice, and mood. Keep it to 1-2 sentences. Do not mention compaction, technical details, internal steps, or files.";
    const mutableCtx = params.ctx as Record<string, unknown>;
    mutableCtx.Body = greetPrompt;
    mutableCtx.BodyForAgent = greetPrompt;
    mutableCtx.BodyStripped = greetPrompt;
    return { shouldContinue: true };
  }
  return {
    shouldContinue: false,
    reply: {
      text: `⚙️ ${line}`,
      isStatusNotice: true,
    },
  };
```

### How the greeting flow works after these changes

For a successful dev-mode `/compact`:

1. Fast path is SKIPPED (excluded by the new condition)
2. Full pipeline: `initSessionState` runs, `isNewSession = false`
3. `handleInlineActions` -> `handleCommands` calls `handleCompactCommand` (once)
4. Compaction runs. `enqueueSystemEvent("Compacted (X -> Y) ...")` queues the status
5. Body mutated to greeting prompt. Returns `{ shouldContinue: true }`
6. `handleInlineActions` returns `{ kind: "continue", cleanedBody: greetPrompt }`
7. `runPreparedReply` called. `isBareSessionReset = false`, so no BARE_SESSION_RESET_PROMPT_BASE
8. `drainFormattedSystemEvents` prepends "Compacted (X -> Y)..." as `System:` line
9. Agent sees: `System: Compacted (X -> Y) ...` + `User: The session context was just compacted...`
10. Agent produces a greeting in its persona

For failed/skipped compaction or non-dev-mode: falls through to the old `{ shouldContinue: false, reply: "..." }` — unchanged behavior.

### Why the body mutation pattern is safe

- Uses `params.ctx as Record<string, unknown>` — same cast pattern used in `applyAcpResetTailContext` in `commands-reset.ts` lines 20-30
- Sets `Body`, `BodyForAgent`, and `BodyStripped` so all downstream consumers see the greeting prompt
- `handleCommands` is called exactly once because the fast path is excluded (no double-invocation risk)

---

## Build & Deploy

```bash
# Build locally
pnpm build
pnpm ui:build

# Commit (do NOT commit dist/ yet — test source first)
git add src/auto-reply/reply/dev-mode-memory-flush.ts \
        src/auto-reply/reply/commands-compact.ts \
        src/auto-reply/reply/commands-reset.ts \
        src/auto-reply/reply/get-reply-native-slash-fast-path.ts
git commit -m "fix(dev-mode): FIX-06 — memory flush before compact + greet-after-compact"

# Add dist/ separately
git add -f dist/
git commit -m "chore: rebuild dist/"

# Push (ask Ariel first!)
git push origin main
```

### Deploy to VPS

SSH into VPS (use Windows OpenSSH, key at `~/.ssh/dev_vps`, port 60022):

```bash
openclaw gateway stop
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks
npm install --ignore-scripts
ln -sf /opt/openclaw-dev-mode /opt/openclaw-dev-mode/node_modules/openclaw
rm -rf ~/.openclaw/extensions/whatsapp
openclaw gateway start
sleep 120
openclaw gateway status
```

---

## Test Plan

### Test 1 — /compact memory flush (the bug fix)

1. Send several messages to the agent via WhatsApp to build up conversation
2. Send `/compact`
3. Check log:
   ```bash
   tail -200 /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | grep -i "dev-mode.*memory"
   ```
   Expected: `[dev-mode] memory flush: completed` (BEFORE any compaction log lines)
4. Check for memory file:
   ```bash
   find ~/.openclaw/workspace -name "$(date +%Y-%m-%d)*.md" -path "*/memory/*" 2>/dev/null
   ```

### Test 2 — /compact greeting (the new feature)

1. Send several messages to the agent via WhatsApp
2. Send `/compact`
3. Agent should respond with a short persona greeting (1-2 sentences), NOT the old `⚙️ Compacted (X -> Y)...` status message
4. The compaction info ("Compacted...") should appear as a system event (visible in the dashboard, not in the WA reply)

### Test 3 — /compact failure/skip (no greeting)

1. Send `/compact` immediately after a fresh `/new` (nothing to compact)
2. Should get the old-style `⚙️ Compaction skipped` message (not a greeting)

### Test 4 — /new memory flush + greeting (regression check)

1. Send several messages
2. Send `/new`
3. Memory flush should complete (check log)
4. Agent should produce a greeting (same as before — FIX-04 behavior)

### Test 5 — Non-dev-mode (safety check)

1. Remove `OPENCLAW_DEV_MODE=1` from `~/.openclaw/.env`
2. Restart gateway
3. Send `/compact` — should get stock `⚙️ Compacted...` message, no greeting
4. Send `/new` — should get stock `✅ New session started.` message, no greeting
5. Re-add `OPENCLAW_DEV_MODE=1` and restart

---

## CLAUDE.md Updates

Add to SEC/FIX table:

```
| FIX-06  | `src/auto-reply/reply/dev-mode-memory-flush.ts` + `commands-compact.ts` + `commands-reset.ts` + `get-reply-native-slash-fast-path.ts` | Dev-mode memory flush on `/compact` (before compaction) and `/new` (before reset); greet-after-compact returns `shouldContinue: true` with persona greeting prompt |
```

Source Files Modified: add `dev-mode-memory-flush.ts` (our file), `get-reply-native-slash-fast-path.ts` (new patch). Count goes from 18 to 20.

---

## Key Type Reference

### `HandleCommandsParams` (from `commands-types.ts` lines 38-75)

Fields used by the helper:

- `ctx: MsgContext` — message context (has SenderName, SenderUsername, SenderE164)
- `cfg: OpenClawConfig` — full config
- `command: CommandContext` — has `channel`, `senderId`, `ownerList`
- `agentId?: string`, `agentDir?: string`
- `sessionStore?: Record<string, SessionEntry>`
- `sessionKey: string`
- `storePath?: string`
- `workspaceDir: string`
- `opts?: GetReplyOptions`
- `provider: string`, `model: string`, `contextTokens: number`
- `resolvedThinkLevel?: ThinkLevel`
- `resolvedVerboseLevel: VerboseLevel`

### `FollowupRun["run"]` required fields (from `queue/types.ts` lines 95-158)

- `agentId: string`
- `agentDir: string`
- `sessionId: string`
- `sessionFile: string`
- `workspaceDir: string`
- `config: OpenClawConfig`
- `provider: string`
- `model: string`
- `timeoutMs: number`
- `blockReplyBreak: "text_end" | "message_end"`

All other fields are optional.

### `runMemoryFlushIfNeeded` params (from `agent-runner-memory.ts` lines 1051-1068)

```ts
{
  cfg: OpenClawConfig;
  followupRun: FollowupRun;
  promptForEstimate?: string;        // omit
  sessionCtx: TemplateContext;
  opts?: GetReplyOptions;
  defaultModel: string;
  agentCfgContextTokens?: number;
  resolvedVerboseLevel: VerboseLevel;
  sessionEntry?: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey?: string;
  runtimePolicySessionKey?: string;  // omit
  storePath?: string;
  isHeartbeat: boolean;              // false
  replyOperation: ReplyOperation;
  onVisibleErrorPayloads?: (...) => void;  // omit
}
```

### `createReplyOperation` (from `reply-run-registry.ts` lines 362-369)

```ts
createReplyOperation(params: {
  sessionKey: string;
  sessionId: string;
  resetTriggered: boolean;
  routeThreadId?: string | number;
  upstreamAbortSignal?: AbortSignal;
  respectFollowupAdmissionBarrier?: boolean;
}): ReplyOperation
```

Throws `ReplyRunAlreadyActiveError` if session lane is already occupied.
`ReplyOperation.complete()` releases the session lane (must always be called).
