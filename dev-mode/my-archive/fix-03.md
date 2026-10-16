# `/status` reports `gpt-5.5` fallback even when `agents.defaults.model.primary` is set

**Affected:** `src/status/status-message.ts` (verified on V2026.5.4 and V2026.5.6)

## Summary

`/status` displays `🧠 Model: openai-codex/gpt-5.5` (the hardcoded `DEFAULT_MODEL` constant from `src/agents/defaults.ts:4`) for any agent that does not redundantly set `model` on its own per-agent record — even when a global default is properly configured at `agents.defaults.model.primary`.

The actual model the runtime uses for chat turns is unaffected; only the `/status` text display is wrong. But it is alarming and misleading.

## Reproduction

1. Configure a global default in `~/.openclaw/openclaw.json`:

   ```json
   "agents": {
     "defaults": { "model": { "primary": "ollama/kimi-k2.6:cloud" } },
     "list": [{ "id": "main", "reasoningDefault": "on" }]
   }
   ```

   The `main` agent has no `model`/`provider` of its own — it should inherit the global default.

2. Trigger a fresh session (e.g. send `/status` from a channel where no session exists yet).

3. Observe the reply:

   ```
   🧠 Model: openai-codex/gpt-5.5 · 🔑 oauth (openai-codex:...)
   ```

   Expected: `🧠 Model: ollama/kimi-k2.6:cloud · 🔑 ...`.

4. Send any real chat message — the runtime correctly uses `ollama/kimi-k2.6:cloud` (verifiable via session `model_change` events in the jsonl). Only the `/status` text was wrong.

## Root cause

`buildStatusMessage` builds a stripped-down config for its model resolver:

```ts
// src/status/status-message.ts (~line 547 in V2026.5.6)
const selectionConfig = {
  agents: {
    defaults: args.agent ?? {},
  },
} as OpenClawConfig;
```

`args.agent` is the **per-agent** record (e.g. `{id: "main", reasoningDefault: "on"}`). The global `args.config.agents.defaults` (which holds `model.primary`) is **not** merged. `resolveConfiguredModelRef` then sees no `model` and falls through to `DEFAULT_MODEL = "gpt-5.5"`.

The sibling `contextConfig` 5 lines below already merges correctly:

```ts
const contextConfig = args.config
  ? ({
      ...args.config,
      agents: {
        ...args.config.agents,
        defaults: {
          ...args.config.agents?.defaults,
          ...args.agent,
        },
      },
    } as OpenClawConfig)
  : ...;
```

The `selectionConfig` block looks like the merge was simply forgotten when this code was first written.

## Suggested fix (3 lines)

```diff
   const selectionConfig = {
     agents: {
-      defaults: args.agent ?? {},
+      defaults: { ...args.config?.agents?.defaults, ...args.agent },
     },
   } as OpenClawConfig;
```

Spread order matches the existing `contextConfig` pattern: per-agent override wins, global default is the fallback. No behavior change for users who already set `model` per-agent.

## Optional enhancement — render runtime alongside selected

To make config-vs-runtime drift visible (fallback engaged, fresh session resolution gaps, channel overrides) without tailing logs, render a second line below the existing model line:

```diff
   const modelLine = `🧠 Model: ${selectedModelLabel}${selectedAuthLabel}${modelNote}`;
+  const activeAuthLabel = activeAuthLabelValue ? ` · 🔑 ${activeAuthLabelValue}` : "";
+  const runtimeLine = `⚙️ Runtime: ${activeModelLabel}${activeAuthLabel}`;
```

Both `activeModelLabel` and `activeAuthLabelValue` are already computed in the same scope (lines ~691 and ~895). Just insert `runtimeLine` after `modelLine` in the return array.

When selected and runtime match, the two lines are reassuring; when they differ, the mismatch is immediately visible. The existing `↪️ Fallback:` line already shows runtime when fallback is active — the new line generalizes that visibility to all situations.

## Test impact

`src/auto-reply/status.test.ts` and the `expect(...).toContain("🧠 Model:")` assertions in `src/agents/openclaw-tools.session-status.test.ts` keep passing because the `🧠 Model:` label is unchanged. The runtime line addition adds one new line to the output but does not alter existing assertions; tests asserting exact line counts may need a small update.

## References

- File: `src/status/status-message.ts`
- Constant: `src/agents/defaults.ts:4` — `DEFAULT_MODEL = "gpt-5.5"` (correctly intentional as a final fallback; the bug is that it's reachable when it shouldn't be)
- Sibling correct merge: `contextConfig` block ~5 lines below `selectionConfig`
