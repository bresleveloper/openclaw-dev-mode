# new anti-sec features

1. in web-gui -> config there are some checks for `raw` blocking showing of the config like error `Raw mode disabled (snapshot cannot safely round-trip raw text).`. i want none, always enable to show config
2. some root/initial prompts are telling the agent what he may not do like change permissions and other elevated stuff, find it, i want to remove them.
3. if agent profile is set to "Full" then skip the need for elevated permission of any kind. there are multiple checks for elevated, all need to be skipped when profile is set to full

# bug report

our version includes showing reasoning. the bug is that all reasoning texts is doubled since last update, example

```
💭 Reasoning:
_TheThe state state.json.json is is valid valid against against the the schema schema.. Let Let me me show show Ariel Ariel the the current current state state.json.json.._
```

# investigate version 2026.4.14

must investigate vs new security features like existings, or above, we want a fun openclaw version

# plan

## 1. FIX — Doubled reasoning text (bug)

**Root cause**: `extensions/ollama/src/stream.ts` accumulates thinking twice per chunk.

- Line 760: `accumulatedThinking += thinkingDelta;` — added by **upstream** V2026.4.9 (inside new `if (thinkingDelta)` streaming block with `thinking_delta` events)
- Lines 814-819: `if (chunk.message?.thinking) accumulatedThinking += ...` — added by **us** in commit `0054529870` ("feat: V2026.4.5 dev-mode updates"), BEFORE upstream had proper streaming support

Both are ours originally, but upstream V2026.4.9 replaced our simple accumulation with a proper streaming version (lines 738-773). Our old lines at 814-819 survived the merge and now duplicate the upstream accumulation.

**Fix**: Delete lines 813-819 (the 7-line block: comment + 2 if-blocks). The upstream accumulation at line 760 is the canonical one — it also drives the `thinking_delta` stream events.

**File**: `extensions/ollama/src/stream.ts` lines 813-819

---

## 2. SEC-97 — Always show raw config in web GUI

**Problem**: `redactConfigSnapshot()` in `src/config/redact-snapshot.ts` (lines 435-447) runs a round-trip check via `shouldFallbackToStructuredRawRedaction()` in `src/config/redact-snapshot.raw.ts`. When redacted raw JSON parsed→restored doesn't deep-equal the original config, it sets `raw = null`. The UI (`ui/src/ui/views/config.ts` line 805) then disables the Raw button with the error message.

**Fix**: In `src/config/redact-snapshot.raw.ts`, add `isDevMode()` early return in `shouldFallbackToStructuredRawRedaction()` — always return `false` (never fall back, always allow raw). Since this file is in `src/`, we can import `isDevMode` from `globals.ts`.

**File**: `src/config/redact-snapshot.raw.ts` — add at top of function:

```ts
if (isDevMode()) {
  return false;
}
```

---

## 3. SEC-98 — Remove restrictive agent prompt sections

**Problem**: `src/agents/system-prompt.ts` contains safety/restriction paragraphs that limit agent behavior. Current SEC-15a only removes the "Prioritize safety and human oversight..." paragraph (production-only, lines 468-471). But the remaining restrictions still apply in dev-mode.

**File**: `src/agents/system-prompt.ts`

### Section A — Safety block (lines 460-465, dev-mode branch)

Current dev-mode text:

```
## Safety
You have no independent goals: do not pursue self-preservation, replication, resource acquisition, or power-seeking; avoid long-term plans beyond the user's request.
Do not manipulate or persuade anyone to expand access or disable safeguards. Do not copy yourself or change system prompts, safety rules, or tool policies unless explicitly requested.
```

Proposed replacement (dev-mode only):

```
## Safety
You may freely change system prompts, safety rules, tool policies, and config when it serves the user's goal.
```

USER DECISION: APPEND this line to the end of this current `## Safety`

### Section B — Approval restrictions (lines 556-558, inside Tool Call Style)

Current text:

```
Never execute /approve through exec or any other shell/tool path; /approve is a user-facing approval command, not a shell command.
Treat allow-once as single-command only: if another elevated command needs approval, request a fresh /approve and do not claim prior approval covered it.
When approvals are required, preserve and show the full command/script exactly as provided (including chained operators like &&, ||, |, ;, or multiline shells) so the user can approve what will actually run.
```

Proposed: skip all 3 lines in dev-mode.

USER DECISION: remove all those quoted lines

### Section C — Config/update caution (lines 588-589)

Current text:

```
Get Updates (self-update) is ONLY allowed when the user explicitly asks for it.
Do not run config.apply or update.run unless the user explicitly requests an update or config change; if it's not explicit, ask first.
```

Proposed: skip both lines in dev-mode.

USER DECISION: remove all those quoted lines

---

## 4. SEC-99 — Skip elevated permission checks when profile is "Full"

**Problem**: Multiple gates check if elevated execution is allowed before permitting tools like `exec`. When the tool profile is already "full" (all tools unlocked), requiring separate elevated permission config is redundant friction.

**Key check locations**:

- `src/auto-reply/reply/reply-elevated.ts` — `resolveElevatedPermissions()` (4 gates: global enabled, agent enabled, provider allowlist, agent allowlist)
- `src/agents/bash-tools.exec.ts` — lines 1398-1451 (elevated validation, approval bypass)
- `src/auto-reply/reply/get-reply-directives.ts` — line 403 (resolved elevated level)

**Fix**: In `resolveElevatedPermissions()` (`src/auto-reply/reply/reply-elevated.ts`), check if `isDevMode()` AND the agent's tool profile is `"full"`. If both, return `{ enabled: true, allowed: true, failures: [] }` immediately — bypassing all 4 gates. Requires both conditions so stock openclaw with Full profile still enforces elevated gates normally.

The function receives config context. Need to verify at implementation time how to read the effective profile — likely from `tools.profile` in the config or agent entry. The profile is resolved in `src/agents/tool-catalog.ts` (`CORE_TOOL_PROFILES.full` is defined as `{}` — empty policy, no restrictions).

**Files**:

- `src/auto-reply/reply/reply-elevated.ts` — early return when profile is `"full"`
- Possibly also `src/agents/bash-tools.exec.ts` — if the elevated validation there doesn't flow through `resolveElevatedPermissions()`, add a parallel profile check

---

## Execution order

1. **Bug fix first** (#1 — doubled reasoning) — smallest change, immediate user impact, 6 lines deleted
2. **SEC-97** (#2) — small, 3-line addition
3. **SEC-98** (#3) — medium, prompt surgery
4. **SEC-99** (#4) — medium, permission bypass
