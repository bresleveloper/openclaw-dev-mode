/**
 * FIX-11 (openclaw-dev-mode fork): the `onSystemPromptEnd` plugin hook.
 *
 * A plugin registers `api.on("onSystemPromptEnd", async (event, ctx) => ({ systemPrompt }))` and
 * rewrites the FINAL system prompt of a model request, after everything upstream composes
 * (config, bootstrap files, skills, `before_prompt_build` results, runtime facts). Upstream only
 * lets a plugin prepend or append around its own prompt. Plugin-author and operator notes, with a
 * complete example plugin: dev-mode/fix-11-system-prompt-end.md.
 *
 * Semantics:
 * - Event `{ systemPrompt, runtime: "embedded" | "claude-cli", provider, model, requestId? }`,
 *   result `string | { systemPrompt?: string } | void`
 *   (types: src/plugins/fork-system-prompt-end-types.ts).
 * - Handlers run sequentially in upstream's priority order (higher first), each receiving the
 *   prompt as the previous one left it. A string result (`""` included) or
 *   `{ systemPrompt: string }` replaces the prompt; anything else keeps it.
 * - Fail-open. A throwing or timed-out handler is skipped and the next one still runs: that is
 *   upstream's `runModifyingHook` (per-handler timeout, reload retry and error handling are
 *   reused as is). It logs `[hooks] onSystemPromptEnd handler from <plugin> failed: ...` at ERROR
 *   level. A failure of the runner itself keeps the prompt too (warn).
 * - NOT dev-mode gated and inert unless a plugin registers the hook. The operator switch is
 *   `plugins.entries.<id>.hooks.allowPromptModification: false`, which blocks the registration
 *   like it does for `before_prompt_build` (`promptInjection: true` in `PLUGIN_HOOK_METADATA`).
 *   It is not a conversation-access hook. The per-handler timeout is 15 s (`modifyingTimeoutMs`),
 *   overridable with `plugins.entries.<id>.hooks.timeouts.onSystemPromptEnd`.
 * - No handlers, or an empty system prompt: the same call with the same context object, no work.
 *   A handler that returns the same text changes nothing. The input is never mutated: a
 *   replacement goes down as `{ ...context, systemPrompt, preparedSystemPrompt }`.
 * - One debug log per replacement (plugin id, runtime, old to new length).
 *
 * Hooks, each marked `// openclaw-dev-mode FIX-11` in the upstream-owned file:
 * - src/plugins/hook-types.ts: the `import type` of the handler type, the `PLUGIN_HOOK_METADATA`
 *   entry and the `PluginHookHandlerMap` entry.
 * - src/plugins/hooks.ts: `runModifyingHook` added to the object `createHookRunner` returns (it
 *   was closure-private). `runSystemPromptEnd()` calls it with an `eventForHandler` and a
 *   `mergeResults` policy, so the per-handler machinery stays upstream's.
 * - src/agents/embedded-agent-runner/run/attempt-prompt-submit.ts: `installSystemPromptEnd()`
 *   right after `activeSession.agent.streamFn = providerPromptStreamFn`, undone FIRST in the
 *   cleanup closure, plus the optional `systemPromptEnd` input field.
 * - src/agents/embedded-agent-runner/run/attempt-prompt-phase.ts: passes `{ hookRunner, hookCtx }`
 *   (the runner and context `before_prompt_build` gets) as `systemPromptEnd`.
 * - src/agents/cli-runner/prepare.ts: `applyClaudeCliSystemPromptEnd()` right after
 *   `finalizeCliSystemPrompt()`, before the prompt is stored in the prepared run context, with the
 *   `promptBuildHookContext` and `promptBuildHookRunner` already in scope.
 *
 * The two sites:
 * - Embedded: the wrapper is the outermost layer around the stream function, so
 *   `persistThenStream`, the token-pressure and prompt-cache observers and the provider
 *   transport all see the replaced prompt on EVERY model request of the run, tool loop included.
 *   `StreamFn` may return a promise (packages/llm-core/src/types.ts; agent-core awaits it in
 *   agent-stream-response.ts), so the slow path is async while the fast path is the plain inner
 *   call. `preparedSystemPrompt` is re-derived with `prepareSystemPrompt()`: agent-core sets it
 *   for the ORIGINAL text before calling the stream function, so passing it on would be stale.
 * - claude-cli (provider `claude-cli` only): once per turn. A changed prompt changes the live
 *   session fingerprint (`systemPromptHash`, cli-live-session-registry.ts), so the warm `claude`
 *   process restarts with `--resume`: expected, and every turn if a handler is not deterministic.
 *   Side questions and control operations skip it like `before_prompt_build` (no runner). Manual
 *   `/compact` still sends the replaced prompt: a control operation resends the prompt the
 *   session's turns last sent (`recallNativeSessionSystemPrompt`, process memory), and after a
 *   gateway restart it sends the unhooked prompt once.
 *
 * Out of scope: compaction summaries, utility completions, the codex harness, ACP, and the
 * embedded `llm_input` hook (it sees the pre-hook prompt). Text added BELOW the hook is not
 * visible to a plugin: the Anthropic cache-boundary split plus the OAuth identity blocks,
 * Ollama's "## Tool wire names", Google's prompt cache, and on claude-cli the context engine's
 * system-prompt addition (it rides in the turn prompt). The prompt a plugin sees still contains
 * the cache-boundary marker `SYSTEM_PROMPT_CACHE_BOUNDARY`
 * ("\n<!-- OPENCLAW_CACHE_BOUNDARY -->\n", packages/ai/src/utils/system-prompt-cache-boundary.ts,
 * next to the relocatable pair): it is stripped further down, and Google's prompt cache needs it,
 * so a handler should keep it.
 *
 * Regression checklist (every upstream upgrade):
 * - `git grep -n "openclaw-dev-mode FIX-11" -- ':!dev-mode' ':!src/agents/fork-*'` lists the five
 *   hook files above (hook-types.ts 3 sites, hooks.ts 1, attempt-prompt-submit.ts 4,
 *   attempt-prompt-phase.ts 1, prepare.ts 2);
 * - `installProviderPromptHistoryTransform()` in attempt-prompt-submit.ts still assigns
 *   `agent.streamFn = providerPromptStreamFn` and its cleanup still restores `baseStreamFn` by an
 *   identity check: `uninstallPromptEnd()` must stay the first statement of that cleanup;
 * - `runModifyingHook` keeps the `(hookName, event, ctx, policy)` shape, skips `undefined` and
 *   `null` results, merges `""`, and `registerTypedHook` still gates by
 *   `isPromptInjectionHookName` and warns `unknown typed hook "..." ignored` for an unknown name;
 * - `StreamFn` still allows a promise result, and `prepareSystemPrompt` / `PreparedSystemPrompt`
 *   still exist (otherwise drop `preparedSystemPrompt` and re-check every transport that reads
 *   `context.systemPrompt`);
 * - prepare.ts still runs the hook after `finalizeCliSystemPrompt()` and before
 *   `buildSystemPromptReport()`, and the live-session fingerprint still hashes
 *   `context.systemPrompt`;
 * - the five files still pass `pnpm exec oxlint <file>` (hook-types.ts, hooks.ts and prepare.ts
 *   carry a max-lines pragma);
 * - src/agents/fork-system-prompt-end.test.ts passes (playbook checklist item 9 keep-list).
 */
import { prepareSystemPrompt } from "@openclaw/ai/internal/shared";
import { formatErrorMessage } from "../infra/errors.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import type { PluginHookSystemPromptEndEvent } from "../plugins/fork-system-prompt-end-types.js";
import type { PluginHookAgentContext } from "../plugins/hook-agent-context.types.js";
import type { HookRunner } from "../plugins/hooks.js";
import type { StreamFn } from "./runtime/index.js";

const HOOK_NAME = "onSystemPromptEnd";

const log = createSubsystemLogger("agents/system-prompt-end");

/** The slice of the hook runner this module needs; the global runner satisfies it. */
export type SystemPromptEndRunner = Pick<HookRunner, "hasHooks" | "runModifyingHook">;

export type SystemPromptEndInstall = {
  hookRunner: SystemPromptEndRunner | null | undefined;
  hookCtx: PluginHookAgentContext;
};

type SystemPromptEndLogger = { debug?: (message: string) => void };

/** The replacement a handler result carries, or undefined when the result keeps the prompt. */
function readReplacement(result: unknown): string | undefined {
  if (typeof result === "string") {
    return result;
  }
  if (typeof result === "object" && result !== null && "systemPrompt" in result) {
    return typeof result.systemPrompt === "string" ? result.systemPrompt : undefined;
  }
  return undefined;
}

/** Runs the handlers over `event.systemPrompt`; resolves to the same string if none replaces it. */
export async function runSystemPromptEnd(
  hookRunner: SystemPromptEndRunner | null | undefined,
  params: {
    event: PluginHookSystemPromptEndEvent;
    ctx: PluginHookAgentContext;
    logger?: SystemPromptEndLogger;
  },
): Promise<string> {
  const { event, ctx } = params;
  if (!event.systemPrompt || !hookRunner?.hasHooks(HOOK_NAME)) {
    return event.systemPrompt;
  }
  const logger = params.logger ?? log;
  const result = await hookRunner.runModifyingHook(HOOK_NAME, event, ctx, {
    // A fresh copy per handler that already carries the prompt the previous handler left.
    eventForHandler: (current, previous) => ({
      ...current,
      systemPrompt: readReplacement(previous) ?? current.systemPrompt,
    }),
    mergeResults: (previous, next, registration, current) => {
      const before = readReplacement(previous) ?? current.systemPrompt;
      const replacement = readReplacement(next);
      if (replacement === undefined) {
        return previous ?? {};
      }
      if (replacement !== before) {
        logger.debug?.(
          `[hooks] ${HOOK_NAME} handler from ${registration.pluginId} replaced the ` +
            `${current.runtime} system prompt (${before.length} -> ${replacement.length} chars)`,
        );
      }
      return replacement;
    },
  });
  return readReplacement(result) ?? event.systemPrompt;
}

/**
 * Wraps `agent.streamFn` so every model request of the run passes through the hook, and returns
 * the undo. Install it after the provider-side wrappers; run the undo before the cleanup that
 * restores the stream fn it wrapped (that cleanup compares identities).
 */
export function installSystemPromptEnd(
  agent: { streamFn: StreamFn },
  install?: SystemPromptEndInstall,
): () => void {
  const hookRunner = install?.hookRunner;
  const hookCtx = install?.hookCtx;
  if (!hookRunner || !hookCtx) {
    return () => {};
  }
  const inner = agent.streamFn;
  let prepared: ReturnType<typeof prepareSystemPrompt> | undefined;

  const streamWithFinalPrompt = async (
    model: Parameters<StreamFn>[0],
    context: Parameters<StreamFn>[1],
    options: Parameters<StreamFn>[2],
    original: string,
  ) => {
    // A request that was already cancelled never starts handlers.
    options?.signal?.throwIfAborted();
    const finalPrompt = await runSystemPromptEnd(hookRunner, {
      event: {
        systemPrompt: original,
        runtime: "embedded",
        provider: model.provider,
        model: model.id,
        ...(options?.requestId ? { requestId: options.requestId } : {}),
      },
      ctx: hookCtx,
    }).catch((err: unknown) => {
      // Fail open: a broken hook layer must never block a model request.
      log.warn(`${HOOK_NAME} skipped for this request: ${formatErrorMessage(err)}`);
      return original;
    });
    if (finalPrompt === original) {
      return inner(model, context, options);
    }
    prepared = prepareSystemPrompt(finalPrompt, prepared);
    return inner(
      model,
      { ...context, systemPrompt: finalPrompt, preparedSystemPrompt: prepared },
      options,
    );
  };

  const wrapped: StreamFn = (model, context, options) => {
    const original = context.systemPrompt;
    if (!original || !hookRunner.hasHooks(HOOK_NAME)) {
      return inner(model, context, options);
    }
    return streamWithFinalPrompt(model, context, options, original);
  };
  agent.streamFn = wrapped;
  return () => {
    if (agent.streamFn === wrapped) {
      agent.streamFn = inner;
    }
  };
}

/** The claude-cli turn's system prompt after the handlers; the original one on any failure. */
export function applyClaudeCliSystemPromptEnd(
  systemPrompt: string,
  params: {
    hookRunner: SystemPromptEndRunner | null | undefined;
    hookCtx: PluginHookAgentContext;
    provider: string;
    model: string;
  },
): Promise<string> {
  return runSystemPromptEnd(params.hookRunner, {
    event: {
      systemPrompt,
      runtime: "claude-cli",
      provider: params.provider,
      model: params.model,
    },
    ctx: params.hookCtx,
  }).catch((err: unknown) => {
    log.warn(`${HOOK_NAME} skipped for this claude-cli turn: ${formatErrorMessage(err)}`);
    return systemPrompt;
  });
}
