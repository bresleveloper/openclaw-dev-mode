# FIX-11: `onSystemPromptEnd`, a plugin hook for the final system prompt

**Date:** 2026-11-25 · **Base:** upstream tag `v2026.11.10` · **Status:** written in a separate worktree without `node_modules`, so nothing here has been type-checked, linted or run yet. The real branch still has to pass `pnpm tsgo:core`, `oxfmt`, `oxlint` and `src/agents/fork-system-prompt-end.test.ts`.

The code, its semantics and the per-upgrade regression checklist live in the header comment of `src/agents/fork-system-prompt-end.ts`. This page is for plugin authors and operators.

## 1. What it is

Upstream lets a plugin prepend or append text around the prompt it builds (`before_prompt_build`). It cannot rewrite the system prompt that is finally sent. `onSystemPromptEnd` can: it runs after everything upstream composes (config, bootstrap files, skills, `before_prompt_build` results, runtime facts) and hands the plugin that final text.

It is not dev-mode gated and does nothing unless a plugin registers it.

## 2. Contract

```ts
api.on("onSystemPromptEnd", async (event, ctx) => ({ systemPrompt: "..." }), { priority: 10 });
```

| Part    | Value                                                                                                                                                                                                                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event` | `{ systemPrompt: string; runtime: "embedded" \| "claude-cli"; provider: string; model: string; requestId?: string }`. `provider` and `model` are the ones of the request (embedded) or of the CLI turn (`claude-cli`, the configured model id). `requestId` appears only when an outer layer already stamped one, so do not rely on it |
| `ctx`   | The agent hook context `before_prompt_build` gets: `runId`, `agentId`, `sessionKey`, `sessionId`, `workspaceDir`, `modelProviderId`, `modelId`, `trigger`, channel fields                                                                                                                                                              |
| result  | `string`, `{ systemPrompt: string }` or nothing. A string result (the empty string included) or `{ systemPrompt: string }` REPLACES the prompt. Anything else (`undefined`, `null`, `{}`, a non-string `systemPrompt`) keeps it                                                                                                        |

- Handlers run one after another in priority order (higher first, registration order for equal priority). Each handler gets its own copy of the event, already carrying the prompt the previous handler left. A handler never sees or mutates another handler's object.
- Fail-open. A throwing handler or one that exceeds its budget is skipped, the next one still runs, and the prompt stays as the last good handler left it. Upstream's runner logs `[hooks] onSystemPromptEnd handler from <plugin> failed: <message>` at error level. A failure of the hook layer itself logs `onSystemPromptEnd skipped for this ...` at warn level and sends the original prompt.
- One debug line per replacement: `[hooks] onSystemPromptEnd handler from <plugin> replaced the <runtime> system prompt (<old> -> <new> chars)`.
- No handler registered, or an empty system prompt: no work at all. A handler that returns the same text changes nothing.
- The input is never mutated. A replacement travels on as a copy of the request context.
- It is a prompt-injection hook (`promptInjection: true`), not a conversation-access hook: `plugins.entries.<id>.hooks.allowConversationAccess` is not needed.

## 3. Where it runs

| Runtime      | When                                                          | Notes                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `embedded`   | Every model request of a run, tool loop included              | The wrapper is the outermost layer around the agent's stream function, so request persistence, token-pressure and prompt-cache observers and the provider transport all see the replaced prompt |
| `claude-cli` | Once per turn, before the prompt is stored in the run context | Provider `claude-cli` only; other CLI backends are not hooked                                                                                                                                   |

claude-cli details:

- The warm `claude` process is keyed by a hash of the system prompt. A prompt that changes between turns restarts the process (with `--resume`). A deterministic handler costs one restart when it is first enabled; a handler that adds a timestamp, a counter or a random id restarts it on every turn. Keep the edit stable.
- Side questions and control operations skip the hook, like `before_prompt_build`. A manual `/compact` still sends the replaced prompt, because a control operation resends the prompt the session's turns last sent (held in process memory). After a gateway restart it sends the unhooked prompt once.

## 4. What it does not cover

- Compaction summaries and utility completions (titles, classifiers and the like).
- The codex harness and ACP.
- The embedded `llm_input` hook: it sees the prompt from before this hook.
- Text added below the hook: the Anthropic cache-boundary split and the OAuth identity blocks, Ollama's "## Tool wire names" section, Google's prompt cache, and on claude-cli the context engine's system-prompt addition (it rides in the turn prompt).

## 5. The cache-boundary marker

The prompt a handler receives still contains `SYSTEM_PROMPT_CACHE_BOUNDARY` (`"\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n"`, defined in `packages/ai/src/utils/system-prompt-cache-boundary.ts`). It separates the part of the prompt that stays stable from the part that changes per turn. Providers with prompt caching use it, and it is stripped further down, so a handler should keep it. Append after it, or edit text on either side without removing it. Dropping it does not break a request, but Google's prompt cache stops working for that prompt.

## 6. Operator switches

```json
{
  "plugins": {
    "entries": {
      "prompt-end-demo": {
        "enabled": true,
        "hooks": {
          "allowPromptModification": false,
          "timeouts": { "onSystemPromptEnd": 30000 }
        }
      }
    }
  }
}
```

- `hooks.allowPromptModification: false` blocks the registration, exactly like it does for `before_prompt_build`. The plugin loads, `registry.diagnostics` carries `typed hook "onSystemPromptEnd" blocked by plugins.entries.<id>.hooks.allowPromptModification=false`, and the handler never runs.
- Budget per handler: 15 s by default. `hooks.timeouts.onSystemPromptEnd` overrides `hooks.timeoutMs`, which overrides `api.on(..., { timeoutMs })`. Values are 1 to 600000 ms. A timeout ends the host's wait, not the plugin's work.
- `plugins.enabled`, `plugins.allow` and `plugins.deny` still apply. When `plugins.allow` is set (it is on the VPS), the plugin id must be in it. `openclaw plugins install` appends it.

## 7. Example plugin

A complete plugin that appends one instruction to every final system prompt and makes the effect visible: the reply ends with `PE-OK`. Create a directory `prompt-end-demo` with three files.

`package.json`

```json
{
  "name": "prompt-end-demo",
  "version": "1.0.0",
  "type": "module",
  "openclaw": { "extensions": ["./index.ts"] }
}
```

`openclaw.plugin.json`

```json
{
  "id": "prompt-end-demo",
  "name": "Prompt End Demo",
  "activation": { "onStartup": true },
  "configSchema": { "type": "object", "additionalProperties": false }
}
```

`index.ts`

```ts
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "prompt-end-demo",
  name: "Prompt End Demo",
  description: "Appends one instruction to the final system prompt.",
  register(api) {
    api.on(
      "onSystemPromptEnd",
      (event) => ({
        systemPrompt: `${event.systemPrompt}\n\nEnd every reply with the token PE-OK.`,
      }),
      { priority: 10 },
    );
  },
});
```

The event and result types come from `api.on` by inference; the plugin SDK has no named export for them.

A dependency-free variant needs no SDK import (`package.json` without `"type": "module"`, entry `./index.cjs`; the manifest stays the same):

```js
module.exports = {
  id: "prompt-end-demo",
  register(api) {
    api.on(
      "onSystemPromptEnd",
      (event) => `${event.systemPrompt}\n\nEnd every reply with the token PE-OK.`,
    );
  },
};
```

Load it (review local plugin code first: native plugins run inside the gateway process):

```bash
openclaw plugins install --link ./prompt-end-demo --force < /dev/null
openclaw plugins enable prompt-end-demo < /dev/null
```

or put the directory under `plugins.load.paths`, or into `~/.openclaw/extensions/prompt-end-demo`, and add the id to `plugins.allow`. Then restart or reload (`openclaw plugins reload prompt-end-demo`) and verify:

1. `openclaw plugins inspect prompt-end-demo --runtime --json < /dev/null`: the hook list contains `onSystemPromptEnd` and the diagnostics have no "ignored" or "blocked" entry for it.
2. Send a chat message on an embedded model, then on a claude-cli model. The reply ends with `PE-OK`. With debug logging on, `/tmp/openclaw/openclaw-YYYY-MM-DD.log` has the `replaced the embedded system prompt` / `replaced the claude-cli system prompt` line.
3. Set `hooks.allowPromptModification: false` for the plugin: the reply no longer ends with `PE-OK`, and the inspect diagnostics show the blocked registration.

## 8. Fork bookkeeping

New files: `src/plugins/fork-system-prompt-end-types.ts` (the handler, event and result types), `src/agents/fork-system-prompt-end.ts` (logic, header = semantics + regression checklist), `src/agents/fork-system-prompt-end.test.ts` (goes through the real registry and runner via `api.on`; on code without the `hook-types.ts` metadata entry it fails with `unknown typed hook "onSystemPromptEnd" ignored`). Add the test to the fork's keep-list (playbook checklist item 9).

Hooks in upstream-owned files, each marked `// openclaw-dev-mode FIX-11`:

| File                                                            | Added lines | What                                                                                                                                                                               |
| --------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/plugins/hook-types.ts`                                     | 6           | handler type import, `PLUGIN_HOOK_METADATA` entry, `PluginHookHandlerMap` entry                                                                                                    |
| `src/plugins/hooks.ts`                                          | 2           | `runModifyingHook` added to the object `createHookRunner` returns (it was closure-private)                                                                                         |
| `src/agents/embedded-agent-runner/run/attempt-prompt-submit.ts` | 8           | import, optional `systemPromptEnd` input, `installSystemPromptEnd()` right after `agent.streamFn = providerPromptStreamFn`, its undo as the first statement of the cleanup closure |
| `src/agents/embedded-agent-runner/run/attempt-prompt-phase.ts`  | 2           | passes `{ hookRunner, hookCtx }`                                                                                                                                                   |
| `src/agents/cli-runner/prepare.ts`                              | 9           | import, `applyClaudeCliSystemPromptEnd()` after `finalizeCliSystemPrompt()`                                                                                                        |

After an upgrade, `git grep -n "openclaw-dev-mode FIX-11" -- ':!dev-mode' ':!src/agents/fork-*'` must list those 11 marked lines (3 + 1 + 4 + 1 + 2), and the regression checklist in the header of `src/agents/fork-system-prompt-end.ts` has the rest. `README.md` is untouched.
