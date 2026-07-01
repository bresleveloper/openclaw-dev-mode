# FIX-06 — Memory Flush on /compact and /new

## Goal

When dev-mode is active, trigger the memory flush immediately when `/compact` or `/new` is manually called, instead of waiting for the next inbound message.

## Background

Auto-compact (preflight) triggers `runMemoryFlushIfNeeded()` automatically on every inbound message turn via `agent-runner.ts`. Manual `/compact` and `/new` bypass this path entirely — they go through `get-reply-native-slash-fast-path.ts` -> `handleInlineActions` -> `handleCommands`, which returns a result and exits WITHOUT going through `agent-runner.ts`. So `runMemoryFlushIfNeeded` is never called.

The memory flush (`runMemoryFlushIfNeeded` in `agent-runner-memory.ts`) runs an embedded LLM agent with `trigger: "memory"` to summarize the session transcript into a dated `memory/YYYY-MM-DD.md` file. It requires `FollowupRun` and `ReplyOperation` runtime objects that are NOT available in command handlers.

### Why this matters

- `/compact`: the count IS bumped by `incrementCompactionCount`, so the next message's `runMemoryFlushIfNeeded` WILL flush. But it's delayed by 1 message — not immediate.
- `/new`: the session is wiped BEFORE the next message arrives. The new session's first message has no old transcript to summarize. Memory of the old session is lost.

## Approach — Option B (standalone helper)

Create a new file `src/auto-reply/reply/dev-mode-memory-flush.ts` that:

1. Constructs a synthetic `FollowupRun` from `HandleCommandsParams`
2. Creates a fresh `ReplyOperation` via `createReplyOperation()`
3. Calls `runMemoryFlushIfNeeded()` with the constructed params
4. Completes the `ReplyOperation` in a finally block
5. Catches `ReplyRunAlreadyActiveError` (session lane busy) and silently skips

Then call the helper from:

- `commands-compact.ts` — AFTER `incrementCompactionCount()` (line ~314)
- `commands-reset.ts` — BEFORE `emitResetCommandHooks()` (line ~177)

Both calls gated with `if (isDevMode())`.

## Files to Change

| File                                            | Action                                        |
| ----------------------------------------------- | --------------------------------------------- |
| `src/auto-reply/reply/dev-mode-memory-flush.ts` | **CREATE** — the helper                       |
| `src/auto-reply/reply/commands-compact.ts`      | **EDIT** — add import + call after compaction |
| `src/auto-reply/reply/commands-reset.ts`        | **EDIT** — add import + call before reset     |

No changes to `agent-runner-memory.ts`, `commands-types.ts`, or `reply-run-registry.ts`.

---

## Step 1 — Create `src/auto-reply/reply/dev-mode-memory-flush.ts`

Full file path: `src/auto-reply/reply/dev-mode-memory-flush.ts`

```ts
import { resolveAgentDir } from "../../agents/agent-scope-config.js";
import { resolveSessionAgentId } from "../../agents/agent-scope.js";
import { isDevMode, logVerbose } from "../../globals.js";
import { resolveMemoryFlushPlan } from "../../plugins/memory-state.js";
import type { TemplateContext } from "../templating.js";
import { runMemoryFlushIfNeeded } from "./agent-runner-memory.js";
import type { HandleCommandsParams } from "./commands-types.js";
import type { FollowupRun } from "./queue/types.js";
import { createReplyOperation, ReplyRunAlreadyActiveError } from "./reply-run-registry.js";
import type { SessionEntry } from "../../config/sessions.js";

export async function runDevModeCommandMemoryFlush(
  params: HandleCommandsParams,
  targetSessionEntry: SessionEntry | undefined,
): Promise<void> {
  if (!isDevMode()) {
    return;
  }

  const sessionId = targetSessionEntry?.sessionId;
  if (!sessionId) {
    return;
  }

  const memoryFlushPlan = resolveMemoryFlushPlan({ cfg: params.cfg });
  if (!memoryFlushPlan) {
    return;
  }

  const sessionAgentId = params.sessionKey
    ? resolveSessionAgentId({ sessionKey: params.sessionKey, config: params.cfg })
    : (params.agentId ?? "main");
  const currentAgentId = params.agentId ?? "main";
  const agentDir =
    sessionAgentId === currentAgentId && params.agentDir
      ? params.agentDir
      : resolveAgentDir(params.cfg, sessionAgentId);

  const synthFollowupRun: FollowupRun = {
    prompt: "",
    enqueuedAt: Date.now(),
    run: {
      agentId: sessionAgentId,
      agentDir,
      sessionId,
      sessionKey: params.sessionKey,
      sessionFile: targetSessionEntry.sessionFile ?? "",
      workspaceDir: params.workspaceDir,
      config: params.cfg,
      provider: params.provider,
      model: params.model,
      timeoutMs: 0,
      blockReplyBreak: "text_end",
      messageProvider: params.command.channel,
      groupId: targetSessionEntry.groupId,
      groupChannel: targetSessionEntry.groupChannel,
      groupSpace: targetSessionEntry.space,
      senderId: params.command.senderId,
      senderName: params.ctx.SenderName,
      senderUsername: params.ctx.SenderUsername,
      senderE164: params.ctx.SenderE164,
      skillsSnapshot: targetSessionEntry.skillsSnapshot,
      ownerNumbers: params.command.ownerList.length > 0 ? params.command.ownerList : undefined,
      thinkLevel: params.resolvedThinkLevel,
    },
  };

  let flushReplyOperation;
  try {
    flushReplyOperation = createReplyOperation({
      sessionKey: params.sessionKey,
      sessionId,
      resetTriggered: false,
    });
  } catch (err) {
    if (err instanceof ReplyRunAlreadyActiveError) {
      logVerbose(`[dev-mode] memory flush: session lane busy for ${params.sessionKey}, skipping`);
      return;
    }
    throw err;
  }

  try {
    await runMemoryFlushIfNeeded({
      cfg: params.cfg,
      followupRun: synthFollowupRun,
      sessionCtx: params.ctx as TemplateContext,
      opts: params.opts,
      defaultModel: params.model,
      agentCfgContextTokens: params.contextTokens,
      resolvedVerboseLevel: params.resolvedVerboseLevel,
      sessionEntry: targetSessionEntry,
      sessionStore: params.sessionStore,
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      isHeartbeat: false,
      replyOperation: flushReplyOperation,
    });
    logVerbose("[dev-mode] memory flush: completed");
  } catch (err) {
    logVerbose(
      `[dev-mode] memory flush failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    flushReplyOperation.complete();
  }
}
```

### Why this code is safe

- `isDevMode()` guard at the top — no-op in stock OpenClaw
- `resolveMemoryFlushPlan` returns null if no memory-core plugin is configured — another no-op guard
- `ReplyRunAlreadyActiveError` catch — if the session lane is already occupied (e.g. agent is running), skip silently
- `finally { flushReplyOperation.complete() }` — always releases the session lane
- `params.ctx as TemplateContext` — safe cast; `TemplateContext = MsgContext & { BodyStripped?: string; SessionId?: string; IsNewSession?: string }` — all extra fields are optional
- `timeoutMs: 0` and `blockReplyBreak: "text_end"` — not used by the memory flush path, just satisfying required fields

---

## Step 2 — Edit `src/auto-reply/reply/commands-compact.ts`

### 2a. Add imports

Current line 17:

```ts
import { logVerbose } from "../../globals.js";
```

Change to:

```ts
import { isDevMode, logVerbose } from "../../globals.js";
```

After line 19 (`import type { CommandHandler } from "./commands-types.js";`), add:

```ts
import { runDevModeCommandMemoryFlush } from "./dev-mode-memory-flush.js";
```

### 2b. Add flush call after compaction

Find this block (around lines 303-316):

```ts
if (result.ok && result.compacted && !codexNativeCompactionStarted) {
  await runtime.incrementCompactionCount({
    cfg: params.cfg,
    sessionEntry: targetSessionEntry,
    sessionStore: params.sessionStore,
    sessionKey: params.sessionKey,
    storePath: params.storePath,
    // Update token counts after compaction
    tokensAfter: result.result?.tokensAfter,
    newSessionId: result.result?.sessionId,
    newSessionFile: result.result?.sessionFile,
  });
}
// Use the post-compaction token count for context summary if available
const tokensAfterCompaction = result.result?.tokensAfter;
```

Replace with:

```ts
if (result.ok && result.compacted && !codexNativeCompactionStarted) {
  await runtime.incrementCompactionCount({
    cfg: params.cfg,
    sessionEntry: targetSessionEntry,
    sessionStore: params.sessionStore,
    sessionKey: params.sessionKey,
    storePath: params.storePath,
    // Update token counts after compaction
    tokensAfter: result.result?.tokensAfter,
    newSessionId: result.result?.sessionId,
    newSessionFile: result.result?.sessionFile,
  });
}
if (isDevMode()) {
  const postCompactEntry = params.sessionStore?.[params.sessionKey] ?? targetSessionEntry;
  await runDevModeCommandMemoryFlush(params, postCompactEntry);
}
// Use the post-compaction token count for context summary if available
const tokensAfterCompaction = result.result?.tokensAfter;
```

---

## Step 3 — Edit `src/auto-reply/reply/commands-reset.ts`

### 3a. Add import

After line 13 (`import { isResetAuthorizedForContext } from "./reset-authorization.js";`), add:

```ts
import { runDevModeCommandMemoryFlush } from "./dev-mode-memory-flush.js";
```

### 3b. Add flush call before session reset

Find this block (around lines 175-177):

```ts
  const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;

  const hookResult = await emitResetCommandHooks({
```

Replace with:

```ts
  const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;

  if (isDevMode()) {
    await runDevModeCommandMemoryFlush(params, targetSessionEntry);
  }

  const hookResult = await emitResetCommandHooks({
```

Note: `isDevMode` is already imported at line 6 of this file.

---

## Step 4 — Build

```bash
pnpm build
pnpm ui:build
```

### Likely build errors and fixes

1. **Missing required field in `FollowupRun["run"]`**: If `FollowupRun["run"]` gains new required fields in future upstream merges, the build will fail here. Fix: add the missing field to the `synthFollowupRun.run` object in `dev-mode-memory-flush.ts`, mapping from `HandleCommandsParams` or using a safe default. Check `src/auto-reply/reply/queue/types.ts` lines 95-158 for the full type.

2. **Import path wrong for `FollowupRun`**: The type is exported from `src/auto-reply/reply/queue/types.ts`. The import path in the helper is `./queue/types.js`. If the file structure changes, update accordingly.

3. **`resolveAgentDir` signature changed**: Currently takes `(config, agentId)`. If it changes, check `src/agents/agent-scope-config.ts` line 204.

---

## Step 5 — Deploy to VPS

SSH into VPS (use Windows OpenSSH, key at `~/.ssh/dev_vps`, port 60022):

```bash
# Stop gateway first
openclaw gateway stop

# Pull latest
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks

# Install deps (in case new ones were added)
npm install --ignore-scripts

# Restore self-ref symlink
ln -sf /opt/openclaw-dev-mode /opt/openclaw-dev-mode/node_modules/openclaw

# Remove any stock WA managed install
rm -rf ~/.openclaw/extensions/whatsapp

# Start gateway
openclaw gateway start

# Wait for WA warmup
sleep 120

# Verify gateway is healthy
openclaw gateway status
```

---

## Step 6 — Test

### Test /compact memory flush

1. Send a few messages to the agent via WhatsApp to build up conversation context
2. Send `/compact` via WhatsApp
3. Check the gateway log for the dev-mode memory flush line:
   ```bash
   tail -100 /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | grep -i "dev-mode.*memory"
   ```
   Expected: `[dev-mode] memory flush: completed`
4. Check if a dated memory file was created:
   ```bash
   ls -la ~/.openclaw/workspace/*/memory/$(date +%Y-%m-%d)*.md 2>/dev/null
   ```
   (The exact path depends on the agent's workspace dir)

### Test /new memory flush

1. Send a few messages to build up conversation context
2. Send `/new` via WhatsApp
3. Check the gateway log — should see the memory flush BEFORE the session reset:
   ```bash
   tail -100 /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | grep -i "dev-mode.*memory\|session.*reset\|new.*session"
   ```
   Expected: `[dev-mode] memory flush: completed` appears BEFORE any session reset log lines
4. Check if a dated memory file was created (same ls command as above)

### Test session-lane-busy path

1. Send a long message that the agent is actively processing
2. While the agent is still responding, send `/compact` from another device/channel
3. Check the log — should see:
   ```
   [dev-mode] memory flush: session lane busy for ..., skipping
   ```
   This is the expected graceful degradation — no crash, no hang.

### Test non-dev-mode (safety check)

1. Temporarily remove `OPENCLAW_DEV_MODE=1` from `~/.openclaw/.env`
2. Restart gateway
3. Send `/compact` — should work identically to stock OpenClaw (no memory flush)
4. Re-add `OPENCLAW_DEV_MODE=1` and restart

---

## CLAUDE.md Update

After successful implementation, add to the SEC/FIX table:

```
| FIX-06  | `src/auto-reply/reply/dev-mode-memory-flush.ts` + `commands-compact.ts` + `commands-reset.ts` | Dev-mode best-effort memory flush on `/compact` and `/new` — flushes MEMORY.md immediately instead of waiting for the next inbound message |
```

Add `dev-mode-memory-flush.ts` to the "Source Files Modified" section under a new entry.

Add to "Source Files Modified" counts: Security items -- src/ goes from 18 to 19.

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
