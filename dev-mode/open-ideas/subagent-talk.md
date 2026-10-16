# Open idea: let subagents talk (dev-mode)

**Status: OPEN — parked 2026-09-28 by Ariel** ("set it as an open idea … if i have 5 depths i'm ok").
Nothing below is implemented. Base: V2026.9.6 (branch `upgrade-2026.9.6`).

## TL;DR

- **Teams of teams already work on 9.6 without any patch.** Subagents below depth 5 can spawn
  their own children; nobody has to be pre-defined in config.
- **What subagents cannot do is talk.** They cannot message you (`message`), send to other
  sessions or steer their own workers (`sessions_send`), or use the `conversations_*` tools.
  Every result flows up the "announce chain": worker → lead → … → main agent → you.
- Upstream made this list non-overridable on 2026-08-07. On ≤ 7.1, `sessions_send` could be
  re-enabled via config; on 9.6 no config can.
- The dev-mode change would be small (two hooks + one fork file). Parked because depth-5
  spawning already covers the main need.

## How teams work today (9.6, no patch)

| Knob                                            | Default | Range                     | Notes                                                                                                                                                                                                     |
| ----------------------------------------------- | ------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agents.defaults.subagents.maxSpawnDepth`       | **5**   | 1–5                       | Depth < max = "orchestrator" (can spawn), depth = max = "leaf". Was **1** on ≤ 7.1.                                                                                                                       |
| `agents.defaults.subagents.maxChildrenPerAgent` | 5       | 1–20                      | Active children per session.                                                                                                                                                                              |
| `agents.defaults.subagents.maxConcurrent`       | 8       | ≥ 1                       | Concurrent subagent runs.                                                                                                                                                                                 |
| `agents.defaults.subagents.allowAgents`         | unset   | ids or `"*"`              | Only needed to spawn _different_ configured agents (own model/workspace/persona). Unset = a session may spawn children of its own agent only (`src/agents/subagents/spawn/subagent-target-policy.ts:59`). |
| `tools.sessions.visibility`                     | `"all"` | self / tree / agent / all | Which sessions session tools can target.                                                                                                                                                                  |

- `sessions_spawn` without `agentId` creates a child of the same agent; the role comes from the
  task text — **no pre-defined roster is needed**.
- Orchestrators (depth 1–4) get `sessions_spawn`, `subagents` (list / wait / cancel only),
  `sessions_list`, `sessions_history` for their own children.
- Children report back when they finish (announce); the parent synthesizes and relays. A lead
  can list, wait for, or cancel a worker — it **cannot send it a follow-up** mid-task.
- Upstream docs: `docs/tools/subagents.md`, `docs/tools/subagents/{nesting,tool-policy,announce}.md`.

## The gap: what subagents lose

Hard-coded in `src/agents/agent-tools.policy.ts:52-83`:

| List                    | Tools                                                                                 | Upstream reason                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Always (every subagent) | `gateway`, `agents_list`, `openclaw`                                                  | system admin — dangerous from a child (a gateway restart kills the whole run tree) |
|                         | `session_status`, `progress_card`, `automations` (cron)                               | status/scheduling owned by the main agent; child-created cron outlives the child   |
|                         | **`message`**, **`sessions_send`**, **`conversations_list/send/turn`**                | "Direct user/session sends — subagents communicate through announce chain"         |
| Leaf only (depth = max) | `subagents`, `sessions_list`, `sessions_history`, `sessions_search`, `sessions_spawn` | leaves do not orchestrate                                                          |

Second lock on `message`: every subagent launch sets `disableMessageTool: true`
(`src/agents/subagents/spawn/subagent-spawn-launch-request.ts:74`), so the tool is not even
constructed for normal (hidden) children.

Config cannot remove any of it: `tools.subagents.tools.{allow,alsoAllow,deny}` only add denies
or narrow the allow set, and deny wins over allow (`src/agents/tool-policy-match.ts:58`).

## History

|                               | ≤ 7.1                                                                      | 9.6                                    |
| ----------------------------- | -------------------------------------------------------------------------- | -------------------------------------- |
| Default spawn depth           | 1 (every child a leaf)                                                     | 5                                      |
| `sessions_send` for subagents | denied; `tools.subagents.tools.alsoAllow: ["sessions_send"]` re-enabled it | hard-denied, not overridable           |
| `message` for subagents       | disabled at launch (`src/agents/subagent-spawn.ts:1570` on 7.1)            | disabled at launch **and** hard-denied |
| `conversations_*`             | did not exist                                                              | hard-denied                            |

The lock-down is upstream commit `8994c7799ba` (2026-08-07, #120025, "subagent hard-deny list
cannot be overridden by allow config"):

> The always-deny list for subagent sessions (gateway, cron, message, sessions_send,
> conversations_*) could be overridden by ordinary allow/alsoAllow config entries, letting a
> configured subagent profile re-enable direct user delivery outside the announce chain. The
> hard-deny layer now applies unconditionally; message joins the list so resumed/visible
> subagent sessions cannot send directly either (hidden launches already disabled it at spawn
> time).

## Options (if revived)

- **A — talk tools only (recommended when revived):** in dev-mode drop `message`,
  `sessions_send`, `conversations_*` from the always-deny list and stop disabling `message` at
  launch. Keep `gateway`, `openclaw`, `automations`, `agents_list`, `session_status`,
  `progress_card` denied for children.
- **B — team-internal talk only:** allow just `sessions_send` (leads steer workers, workers
  ping siblings/parent); you still hear only from the main agent.
- **C — everything:** empty the subagent deny lists in dev-mode (children also get gateway,
  openclaw, cron).

## Implementation sketch (minimal upstream touch)

1. Fork-owned `src/agents/subagents/dev-mode-talk.ts`:
   `DEV_MODE_SUBAGENT_TALK_TOOLS = new Set(["message", "sessions_send", "conversations_list",
"conversations_send", "conversations_turn"])` and
   `withDevModeSubagentTalk(deny: string[]): string[]` (filters them when `isDevMode()`).
2. Hook: `resolveSubagentDenyListForRole()` in `src/agents/agent-tools.policy.ts` returns
   `withDevModeSubagentTalk(...)`.
3. Hook (options A/C only): `disableMessageTool: !isDevMode()` in
   `src/agents/subagents/spawn/subagent-spawn-launch-request.ts`.
4. Nothing else: `sessions_send` already supports subagent callers (tags them
   `sourceRole: "subagent"`, `src/agents/tools/sessions-send-tool.ts:647/917`); session
   visibility defaults to `"all"`; cross-agent sends follow `tools.agentToAgent`.

## Risks

- Noisier chats / duplicates: children messaging you while parents also relay. The system
  prompt already says "Do not send acknowledgments or duplicate completion reports."
- Agents ping-ponging via `sessions_send`. Bounded by run timeouts, depth 5 × 5 children,
  `tools.loopDetection`; still watch token spend.
- WhatsApp self-chat echo: `message` sends go through the socket-session wrapper, so upstream's
  message-id echo dedupe covers them (see `extensions/whatsapp/src/dev-mode/echo-guard.ts`).

## Test plan (if revived)

- Unit: `agent-tools.policy` test — dev-mode subagent policy no longer denies the talk tools,
  still denies `gateway`/`openclaw`/`automations`.
- Live (VPS, self-chat): main spawns a lead; lead spawns 2 workers; lead steers one worker via
  `sessions_send`; a worker posts a progress `message`; verify no duplicate completion reports,
  no echo loop, no `Dropped self-chat reasoning echo` log line.

## Re-check on every upstream upgrade

- The deny-list constants and `resolveSubagentDenyListForRole` (moved/renamed?).
- Where `disableMessageTool: true` is set for subagent launches.
- `DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH` in `src/config/agent-limits.ts` (the "5 depths" Ariel
  relies on) and the schema max for `maxSpawnDepth`.
