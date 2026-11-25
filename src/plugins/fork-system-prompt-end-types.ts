/**
 * FIX-11 (openclaw-dev-mode fork): event, result and handler types of the `onSystemPromptEnd`
 * plugin hook. Types only. The runner, both call sites and the regression checklist live in
 * `src/agents/fork-system-prompt-end.ts`; the operator and plugin-author notes in
 * `dev-mode/fix-11-system-prompt-end.md`.
 *
 * Hooked from `src/plugins/hook-types.ts` (one `import type`, the metadata entry and the
 * handler-map entry), so this file must stay a leaf: type imports of leaf modules only, never
 * `hook-types.ts` itself.
 */
import type { PluginHookAgentContext } from "./hook-agent-context.types.js";
import type { AsyncPluginHook } from "./hook-handler.types.js";

/** The runtime that is about to send the system prompt. */
export type PluginHookSystemPromptEndRuntime = "embedded" | "claude-cli";

export type PluginHookSystemPromptEndEvent = {
  /** The final system prompt as the runtime built it, cache-boundary markers included. */
  systemPrompt: string;
  runtime: PluginHookSystemPromptEndRuntime;
  /** Provider of the request: the model provider when embedded, the backend id on claude-cli. */
  provider: string;
  model: string;
  /** The per-model-call id, present only when the caller had already assigned one. */
  requestId?: string;
};

/**
 * A string, `""` included, or `{ systemPrompt: string }` replaces the prompt. Anything else
 * (undefined, `{}`, a missing or non-string `systemPrompt`) keeps it.
 */
export type PluginHookSystemPromptEndResult = string | { systemPrompt?: string } | void;

export type PluginHookSystemPromptEndHandler = AsyncPluginHook<
  PluginHookSystemPromptEndEvent,
  PluginHookAgentContext,
  PluginHookSystemPromptEndResult
>;
