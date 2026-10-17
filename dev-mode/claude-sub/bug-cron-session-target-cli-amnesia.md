# BUG: cron jobs aimed at a chat session reset that chat's Claude CLI brain (message-policy ping-pong)

Investigated 2026-10-12 by Jarvis (OpenClaw main session, claude-cli runtime) for Ariel.
Status: **NOT fixed upstream** as of `openclaw/openclaw` main `76f4fdd41a` (2026-10-12 01:13 -0700, v2026.10.2).
Our fork: `bresleveloper/openclaw-dev-mode` at `5b6ed96eed6` (v2026.9.6 base), checked out in `/opt/openclaw-dev-mode`.
Upstream checkout used: `/root/.openclaw/workspace/upstream/openclaw`.

---

## 1. Symptom (one line)

A cron/automation job with `sessionTarget: "session:<chat session key>"` and the default `announce`
delivery runs inside the chat's OpenClaw session (same key, same sessionId, same transcript), but on a
**brand-new, empty `claude -p` session**. The chat's next normal turn then **also** starts on another
brand-new empty `claude -p` session. Net effect: each scheduled turn makes the chat agent forget everything twice.

## 2. Reproduction (what actually happened)

Session: `agent:main:whatsapp:direct:+<owner-number>`, OpenClaw sessionId `a45a5dcc-0b08-48bd-b4fa-00f325fa2984`,
model `anthropic/claude-opus-5-5` with `agentRuntime.id = "claude-cli"`.

1. In the chat, a "context-only secret" was established (never written to disk).
2. Three one-shot automations were created:
   `sessionTarget: "session:agent:main:whatsapp:direct:+<owner-number>"`, `payload.kind: "agentTurn"`, delivery default (announce → whatsapp).
   Job ids: `93e4bf36-…` (hubtest-2), `9248c14c-…` (hubtest-3), `4c21fc49-…` (hubtest-1).
3. Results:
   - Their prompts, tool calls and replies **were appended to the chat transcript** (transcript seq 4862+,
     `provenance.kind = "internal_system"`, `sourceTool: "cron"`, `runId = a45a5dcc…` = the chat's sessionId).
   - But the transcript entries carry `importedFrom: "claude-cli", cliSessionId: "fd3f1573-…"`: a new Claude
     session that started at 07:42:07 with the hubtest-2 prompt as its first user message. The chat's real Claude
     session was `83193806-…` (started 04:15, 865 KB, holds the secret).
   - None of the runs knew the secret without calling `sessions_history`.
   - All three jobs shared `fd3f1573` with each other (job 1 "remembered" jobs 2 and 3).
   - The next human message (07:46:41) started yet another fresh Claude session, `af60d38d-…`.
4. Gateway log (`/tmp/openclaw/openclaw-2026-10-12.log`, subsystem `agent/cli-backend`):
   ```
   07:42:06.553 cli session reset: provider=claude-cli reason=message-policy   ← first cron run
   07:42:06.562 cli session history refused across auth boundary: reason=auth-unknown
   07:46:41.566 cli session reset: provider=claude-cli reason=message-policy   ← next human chat turn
   07:46:41.571 cli session history refused across auth boundary: reason=auth-unknown
   ```
   (Claude session files: `/root/.claude/projects/-root--openclaw-workspace/<cliSessionId>.jsonl`.)

## 3. Root cause

### 3.1 What the "message policy" is

Before resuming a stored Claude CLI session, OpenClaw compares a fingerprint of the binding with the
current turn (`resolveCliSessionReuse`). One component is `messageToolPolicyHash`:

```ts
// upstream src/agents/cli-runner/prepare.ts:485-516   (fork: src/agents/cli-runner/prepare.ts:928-961)
const bindingFacts = params.cliSessionBindingFacts;
const bindingRequireExplicitMessageTarget =
  bindingFacts?.requireExplicitMessageTarget ??
  (hasCliSessionBindingFacts ? isSubagentSessionKey(params.sessionKey) : requireExplicitMessageTarget);
const bindingSourceReplyDeliveryMode = hasCliSessionBindingFacts
  ? bindingFacts.sourceReplyDeliveryMode
  : params.sourceReplyDeliveryMode;
...
const messageToolPolicyHash = hasBindingMessageToolPolicy
  ? hashCliSessionText(JSON.stringify({
      sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
      requireExplicitMessageTarget: bindingRequireExplicitMessageTarget,
    }))
  : undefined;
```

The two facts mean:

- `sourceReplyDeliveryMode`: whether the agent's plain final reply is auto-delivered (`automatic`) or the agent
  must use the message tool (`message_tool_only`).
- `requireExplicitMessageTarget`: whether message-tool sends must name the recipient explicitly.

The rules are baked into the resumed Claude session's instructions, so a mismatch means "start a fresh session":

```ts
// upstream src/agents/cli-session.ts:281-286   (fork: src/agents/cli-session.ts:268-271)
if (storedMessageToolPolicyHash !== currentMessageToolPolicyHash) {
  return { mode: "invalidate", invalidatedReason: "message-policy" };
}
```

`hashCliSessionText` = sha256 hex of the trimmed string (`src/agents/cli-session.ts:29`). Note that
`JSON.stringify` drops keys whose value is `undefined`.

### 3.2 The design rule cron violates

Upstream already decided that **binding facts must be session-stable, not per-turn**, and fixed it for other turn kinds:

- Heartbeats/system events: #121485. See `src/auto-reply/reply/session-stable-reply-mode.ts:30`
  (`/** Synthetic and chat turns must share messageToolPolicyHash to reuse CLI sessions (#121485). */`)
  and `src/auto-reply/reply/get-reply-run-context.ts:126-132`.
- Direct agent calls and subagent child completions: commit **`4ab382220e`**
  "fix: retain CLI conversations when child completions arrive (#164378)" (2026-10-03). Key change in
  `src/agents/command/prepare.ts:316-339`:
  ```ts
  const sessionStableReplyMode = await resolveSessionStableReplyMode({
    cfg, ctx: { CommandAuthorized: false }, sessionEntry: sessionEntryRaw, sessionAgentId, sessionKey,
  });
  commandOpts = {
    ...commandOpts,
    // Seed the same reusable policy before the first row and on later completion turns.
    cliSessionBindingFacts: commandOpts.cliSessionBindingFacts ?? {
      sourceReplyDeliveryMode: sessionStableReplyMode,
    },
    ...
  ```
  The same commit added legacy-hash normalization in `src/agents/cli-session.ts:217-231`
  (`DEFAULT_MESSAGE_TOOL_POLICY_HASH`, `LEGACY_EXPLICIT_FALSE_MESSAGE_TOOL_POLICY_HASH`, `normalizeCliMessageToolPolicyHash`).
  Docs: `docs/gateway/cli-backends.md:134-141`.

The **cron runner was not converted**. It still passes its own _per-run_ delivery policy as the _binding_ facts:

```ts
// upstream src/cron/isolated-agent/run-executor.ts:523-527   (fork: :572-575)
cliSessionBindingFacts: {
  extraSystemPromptStatic: params.deliverySystemPrompt,
  sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
  requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget,
},
```

and the per-run plan comes from:

```ts
// upstream src/cron/isolated-agent/source-delivery-plan.ts:8-34   (fork: same file, :38-51)
const announce = !webhook && params.deliveryPlan.mode !== "none";
...
sourceReplyDeliveryMode: undefined,
messageTool: { ..., requireExplicitTarget: announce, ... },
```

### 3.3 The actual hashes (verified from the live DB, `session_nodes.entry_json.cliSessionBindings["claude-cli"]`)

| Turn kind                                  | JSON hashed                                                                    | sha256 prefix      | Result vs chat binding                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| WhatsApp direct chat turn (stored binding) | `{"sourceReplyDeliveryMode":"automatic","requireExplicitMessageTarget":false}` | `3ae4a9801e78dd74` | — (stored value matched exactly)                                                                                          |
| cron, delivery `announce` (default)        | `{"requireExplicitMessageTarget":true}`                                        | `e0debc4b156e9ffd` | **mismatch → reset**, in fork AND upstream                                                                                |
| cron, delivery `none`                      | `{"requireExplicitMessageTarget":false}`                                       | `92a8de91722cbb4f` | fork: mismatch → reset. Upstream: normalized to default by `4ab382220e` → **reuse** (by accident of legacy normalization) |

### 3.4 Why it bites twice (the ping-pong)

1. Cron turn: chat binding hash `3ae4…` ≠ cron hash `e0de…` → `invalidate: message-policy` → new `claude -p` session.
2. When the cron run settles, it persists **its** binding (new sessionId + `e0de…` hash) onto the **chat's** session
   entry (`src/agents/cli-runner/cli-run-settlement.ts`, writes `messageToolPolicyHash` from context, fork :606-607).
3. Next human chat turn: stored `e0de…` ≠ chat `3ae4…` → invalidate again → another new session.

The cron path reads the target session's binding at upstream `run-executor.ts:481-483`
(`params.cronSession.isNewSession ? undefined : await getCliSessionBinding(...)`). For `session:<key>`
targets `forceNew` is false (upstream `run-prepare.ts:136,189`), so the chat binding _is_ considered and then rejected.

### 3.5 Aggravating factor: no history reseed after a reset

When a reset happens, OpenClaw normally can reseed the fresh CLI session with transcript history. Here it refuses:

```ts
// upstream src/agents/cli-runner/prepare.ts:1464-1470   (fork: :2024-2030)
const historyAllowed = params.sessionManager !== undefined || cliHistoryWriter !== undefined;
const rawTranscriptReseedReason = !historyAllowed ? "auth-unknown" : ...
// src/agents/cli-runner/session-history.ts:562 (fork :503) → logs "history refused across auth boundary" and returns []
```

In our logs `auth-unknown` appears on **every** claude-cli turn today, ordinary chat turns included. So any reset means
total amnesia (the agent can only recover by calling `sessions_history` itself). Upstream documents the refusal as
intentional for account changes (`docs/gateway/cli-backends.md:40`). It is a separate issue: fixing 3.2 removes the reset,
which makes 3.5 irrelevant for this scenario. Investigate separately only if resets still happen.

## 4. Fix

### 4.1 Primary fix (small): session-stable binding facts for persistent-session cron targets

File: `src/cron/isolated-agent/run-executor.ts` (upstream ~:523; fork ~:572).

When the job runs **in a persistent, non-cron session** (i.e. `sessionTarget` is `session:<key>` and the run is NOT a
detached run session), mirror `4ab382220e`: derive `sourceReplyDeliveryMode` from the session's stable policy and
**omit** `requireExplicitMessageTarget` from the binding facts. The per-turn values are still passed separately as top-level
params (upstream `run-executor.ts:435-436`: `sourceReplyDeliveryMode`, `requireExplicitMessageTarget`), so the run's real
delivery enforcement does not change. Only the reuse fingerprint changes.

Sketch (adapt names to the file; `usesDetachedRunSession` is already a param, see upstream :509):

```ts
import { resolveSessionStableReplyMode } from "../../auto-reply/reply/session-stable-reply-mode.js";

// before runCliAgent(...)
const bindsToPersistentSession =
  !params.usesDetachedRunSession && !isCronSessionKey(params.agentSessionKey /* or the resolved base key */);
const cliSessionBindingFacts = bindsToPersistentSession
  ? {
      // Same rule as #121485 / #164378: binding facts are session policy, not this run's delivery mode.
      sourceReplyDeliveryMode: await resolveSessionStableReplyMode({
        cfg: params.cfgWithAgentDefaults,
        ctx: { CommandAuthorized: false },
        sessionEntry: params.cronSession.sessionEntry,
        sessionAgentId: params.agentId,
        sessionKey: params.agentSessionKey,
      }),
      // requireExplicitMessageTarget intentionally omitted → prepare.ts falls back to
      // isSubagentSessionKey(sessionKey) (false for chats), matching chat turns.
      // extraSystemPromptStatic intentionally omitted → falls back to params.extraSystemPromptStatic
      // (cron's delivery prompt would otherwise only cause "reuse-with-drift", not a reset).
    }
  : {
      extraSystemPromptStatic: params.deliverySystemPrompt,
      sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
      requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget,
    };
...
runCliAgent({ ..., cliSessionBindingFacts, ... })
```

Expected hash for the WhatsApp chat after the fix: `{"sourceReplyDeliveryMode":"automatic","requireExplicitMessageTarget":false}`
→ `3ae4a9801e78dd74…` → `resolveCliSessionReuse` returns `reuse` (or `reuse-with-drift` if the extra system prompt differs,
which resumes the same session and only resends the system prompt).

Notes for the implementer:

- Check how `agentSessionKey` / `runSessionKey` / `baseSessionKey` are named in `run-executor.ts` params. In upstream
  `run-prepare.ts:133-140` the base key is `input.sessionKey` and `usesDetachedRunSession` covers `isolated` + `current`.
  `isCronSessionKey` is already imported in `run-prepare.ts`.
- `resolveSessionStableReplyMode` is async upstream (`Promise<SourceReplyDeliveryMode>`) and sync in the fork. Adapt.
- `run-prepare.ts:610-614` (fork :648-651) passes the same per-run facts to `createCronRunContinuationSession`. That path is
  only used when `usesExactRunSession` (detached run or `cron:` key), so it never binds to a chat. Leave it unless tests say otherwise.
- Do **not** weaken `resolveCliSessionReuse` itself. The guard is correct; the input facts are wrong.

### 4.2 Fork-only prerequisite (if fixing in our fork without rebasing)

Our fork predates `4ab382220e`. Also port the `normalizeCliMessageToolPolicyHash` hunk from that commit
(`git -C /root/.openclaw/workspace/upstream/openclaw show 4ab382220e -- src/agents/cli-session.ts`) so legacy/undefined hashes
on existing bindings are treated as the default policy. Without it, a binding stored with an undefined hash can still mismatch.

### 4.3 Tests to add

Model them on `src/agents/cli-runner/prepare.command-continuity.test.ts` (added in `4ab382220e`) and
`src/cron/isolated-agent/run.message-tool-policy.test.ts` / `run.session-lifecycle.test.ts`:

1. Cron job with `sessionTarget: "session:<direct chat key>"`, delivery announce, existing claude-cli binding stored with the
   chat hash → `runCliAgent` receives `cliSessionBindingFacts.sourceReplyDeliveryMode === "automatic"` and **no**
   `requireExplicitMessageTarget`. The top-level `requireExplicitMessageTarget` is still `true`.
2. `resolveCliSessionReuse` with those facts against the chat binding → `mode: "reuse"` (not `invalidate: message-policy`).
3. After the cron run settles, the stored binding hash is unchanged → the next chat turn reuses the same CLI sessionId (no ping-pong).
4. Regression: `isolated` and `current` jobs keep today's per-run facts (their run sessions are throwaway).

### 4.4 Live verification on this VPS (after deploying the fork build)

1. Note the chat's current binding: `cliSessionBindings["claude-cli"].sessionId` in `session_nodes.entry_json`
   (`/root/.openclaw/agents/main/agent/openclaw-agent.sqlite`; copy to /tmp first and use python `sqlite3`, per the
   `openclaw-state-inspection` skill).
2. Tell the chat a context-only fact. Create one `at` job with `sessionTarget: "session:agent:main:whatsapp:direct:+<owner-number>"`
   that asks about the fact, without tools.
3. Pass criteria: no `cli session reset … reason=message-policy` in `/tmp/openclaw/openclaw-YYYY-MM-DD.log` at run time,
   the cron transcript entries carry the **same** `cliSessionId` as the chat, the job answers from context,
   and the next human turn also keeps that `cliSessionId`.

## 5. Interim workaround (no code change)

- Upstream only: delivery `none` + the agent sends via the message tool with an explicit target avoids the reset
  (hash normalizes to the default, see table 3.3). In our fork (pre-`4ab382220e`) even `none` resets.
- Otherwise keep JarvisHub on its HTTP path, or use `isolated` jobs that only message Ariel and never touch the chat binding.

## 6. Quick reference

| What                       | Upstream (`76f4fdd41a`)                                                           | Fork (`5b6ed96eed6`)                                        |
| -------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Hash computation           | `src/agents/cli-runner/prepare.ts:485-516`                                        | `src/agents/cli-runner/prepare.ts:928-961`                  |
| Reuse guard                | `src/agents/cli-session.ts:281-286`                                               | `src/agents/cli-session.ts:268-271`                         |
| Legacy normalization       | `src/agents/cli-session.ts:217-231`                                               | missing                                                     |
| Cron binding facts (BUG)   | `src/cron/isolated-agent/run-executor.ts:523-527`                                 | `src/cron/isolated-agent/run-executor.ts:572-575`           |
| Cron per-run policy        | `src/cron/isolated-agent/run-executor.ts:435-436`, `source-delivery-plan.ts:8-34` | `run-executor.ts:481-482`, `source-delivery-plan.ts:~40-51` |
| Stable-mode helper         | `src/auto-reply/reply/session-stable-reply-mode.ts:30`                            | `session-stable-reply-mode.ts:41`                           |
| Pattern to copy            | `src/agents/command/prepare.ts:316-339` (`4ab382220e`)                            | —                                                           |
| Reseed refusal             | `src/agents/cli-runner/prepare.ts:1464-1470`, `session-history.ts:562`            | `prepare.ts:2024-2030`, `session-history.ts:497-505`        |
| Prior fixes for same class | #121485 (heartbeats), `4ab382220e` #164378 (direct/child completions)             | —                                                           |
