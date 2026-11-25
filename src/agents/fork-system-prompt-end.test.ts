// FIX-11 (openclaw-dev-mode fork): the `onSystemPromptEnd` plugin hook, driven through the real
// plugin registry (`api.on` -> `registerTypedHook`) and the real hook runner. Before the hook
// existed, `registerTypedHook` dropped it with `unknown typed hook "onSystemPromptEnd" ignored`.
import { SYSTEM_PROMPT_CACHE_BOUNDARY } from "@openclaw/ai/internal/shared";
import { describe, expect, it, onTestFinished, vi } from "vitest";
import { createDeferred } from "../../test/helpers/promise.js";
import type {
  PluginHookSystemPromptEndEvent,
  PluginHookSystemPromptEndHandler,
  PluginHookSystemPromptEndResult,
} from "../plugins/fork-system-prompt-end-types.js";
import { createHookRunner } from "../plugins/hooks.js";
import { TEST_PLUGIN_AGENT_CTX } from "../plugins/hooks.test-fixtures.js";
import { getPluginInstance } from "../plugins/plugin-instance-scope.js";
import { createTestPluginRegistry } from "../plugins/registry-runtime.test-helpers.js";
import type { PluginTypedHookPolicy } from "../plugins/registry-state.js";
import { createPluginRecord } from "../plugins/status.test-helpers.js";
import {
  applyClaudeCliSystemPromptEnd,
  installSystemPromptEnd,
  runSystemPromptEnd,
  type SystemPromptEndRunner,
} from "./fork-system-prompt-end.js";
import type { StreamFn } from "./runtime/index.js";

const HOOK = "onSystemPromptEnd";

const MODEL = { id: "claude-test", provider: "anthropic" } as Parameters<StreamFn>[0];
const STREAM = { kind: "inner-stream" } as unknown as Awaited<ReturnType<StreamFn>>;

/** A runner that claims handlers exist and then fails: the hook layer itself is broken. */
const FAILING_RUNNER: SystemPromptEndRunner = {
  hasHooks: () => true,
  runModifyingHook: () => Promise.reject(new Error("runner down")),
};

/** A runner without handlers: asking it to run is a bug. */
const IDLE_RUNNER: SystemPromptEndRunner = {
  hasHooks: () => false,
  runModifyingHook: () => Promise.reject(new Error("an idle runner must not be asked to run")),
};

const REPLACING_RESULTS: Array<[string, PluginHookSystemPromptEndResult, string]> = [
  ["a string", "replaced", "replaced"],
  ["an object with a systemPrompt", { systemPrompt: "replaced" }, "replaced"],
  ["an empty string", "", ""],
  ["an object with an empty systemPrompt", { systemPrompt: "" }, ""],
];

const KEEPING_RESULTS: Array<[string, unknown]> = [
  ["undefined", undefined],
  ["null", null],
  ["an empty object", {}],
  ["an object with an undefined systemPrompt", { systemPrompt: undefined }],
  ["an object with a non-string systemPrompt", { systemPrompt: 42 }],
  ["a number", 42],
];

function createHarness() {
  const builder = createTestPluginRegistry();
  const addPlugin = (id: string, hookPolicy?: PluginTypedHookPolicy) => {
    const record = createPluginRecord({ id, origin: "global" });
    builder.registry.plugins.push(record);
    const api = builder.createApi(record, { config: {}, hookPolicy });
    onTestFinished(async () => {
      await getPluginInstance(record)?.dispose();
    });
    return api;
  };
  return { registry: builder.registry, addPlugin };
}

type Harness = ReturnType<typeof createHarness>;

function hookDiagnostics(harness: Harness): string[] {
  return harness.registry.diagnostics
    .map((entry) => entry.message)
    .filter((message) => message.includes(HOOK));
}

function promptEvent(systemPrompt: string): PluginHookSystemPromptEndEvent {
  return { systemPrompt, runtime: "embedded", provider: "anthropic", model: "claude-test" };
}

function request(systemPrompt: string) {
  return { event: promptEvent(systemPrompt), ctx: TEST_PLUGIN_AGENT_CTX };
}

function runOn(
  harness: Harness,
  event: PluginHookSystemPromptEndEvent,
  extra: {
    runner?: Parameters<typeof createHookRunner>[1];
    logger?: Parameters<typeof runSystemPromptEnd>[1]["logger"];
  } = {},
) {
  return runSystemPromptEnd(createHookRunner(harness.registry, extra.runner), {
    event,
    ctx: TEST_PLUGIN_AGENT_CTX,
    logger: extra.logger,
  });
}

function createLoggerSpies() {
  return {
    debug: vi.fn<(message: string) => void>(),
    warn: vi.fn<(message: string) => void>(),
    error: vi.fn<(message: string) => void>(),
  };
}

/** A fake agent whose current stream function is a spy that returns `STREAM`. */
function createAgent() {
  const inner = vi.fn<StreamFn>().mockReturnValue(STREAM);
  const agent: { streamFn: StreamFn } = { streamFn: inner };
  return { agent, inner };
}

function install(harness: Harness, agent: { streamFn: StreamFn }) {
  return installSystemPromptEnd(agent, {
    hookRunner: createHookRunner(harness.registry),
    hookCtx: TEST_PLUGIN_AGENT_CTX,
  });
}

function firstCall<TArgs extends unknown[]>(spy: { mock: { calls: TArgs[] } }): TArgs {
  const call = spy.mock.calls[0];
  if (!call) {
    throw new Error("expected the spy to have been called");
  }
  return call;
}

describe("onSystemPromptEnd registration", () => {
  it("registers through api.on without a diagnostic", () => {
    const harness = createHarness();

    harness.addPlugin("rewriter").on(HOOK, () => undefined);

    expect(hookDiagnostics(harness)).toStrictEqual([]);
    expect(harness.registry.typedHooks.map((entry) => entry.hookName)).toStrictEqual([HOOK]);
  });

  it("is blocked by hooks.allowPromptModification=false and its handler never runs", async () => {
    const harness = createHarness();
    const handler = vi.fn<PluginHookSystemPromptEndHandler>(() => "replaced");
    harness.addPlugin("locked", { allowPromptModification: false }).on(HOOK, handler);
    const runner = createHookRunner(harness.registry);

    const result = await runSystemPromptEnd(runner, request("base"));

    expect(result).toBe("base");
    expect(hookDiagnostics(harness)).toStrictEqual([
      `typed hook "${HOOK}" blocked by plugins.entries.locked.hooks.allowPromptModification=false`,
    ]);
    expect(harness.registry.typedHooks).toStrictEqual([]);
    expect(runner.hasHooks(HOOK)).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("runSystemPromptEnd", () => {
  it("keeps the prompt without asking an idle runner to run", async () => {
    const result = await runSystemPromptEnd(IDLE_RUNNER, request("base"));

    expect(result).toBe("base");
  });

  it("keeps the prompt when the real registry has no handler", async () => {
    const harness = createHarness();

    const result = await runOn(harness, promptEvent("base"));

    expect(result).toBe("base");
  });

  it("does not call the handlers for an empty system prompt", async () => {
    const harness = createHarness();
    const handler = vi.fn<PluginHookSystemPromptEndHandler>(() => "replaced");
    harness.addPlugin("rewriter").on(HOOK, handler);

    const result = await runOn(harness, promptEvent(""));

    expect(result).toBe("");
    expect(handler).not.toHaveBeenCalled();
  });

  it("runs handlers in priority order, each seeing the prompt the previous one left", async () => {
    const harness = createHarness();
    const seen: string[] = [];
    harness.addPlugin("low").on(
      HOOK,
      (event) => {
        seen.push(`low:${event.systemPrompt}`);
        return { systemPrompt: `${event.systemPrompt}|low` };
      },
      { priority: 1 },
    );
    harness.addPlugin("high").on(
      HOOK,
      (event) => {
        seen.push(`high:${event.systemPrompt}`);
        return `${event.systemPrompt}|high`;
      },
      { priority: 10 },
    );
    harness.addPlugin("mid").on(
      HOOK,
      (event) => {
        seen.push(`mid:${event.systemPrompt}`);
      },
      { priority: 5 },
    );

    const result = await runOn(harness, promptEvent("base"));

    expect(result).toBe("base|high|low");
    expect(seen).toStrictEqual(["high:base", "mid:base|high", "low:base|high"]);
  });

  it.each(REPLACING_RESULTS)(
    "%s as a result replaces the prompt",
    async (label, value, expected) => {
      const harness = createHarness();
      harness.addPlugin("rewriter").on(HOOK, () => value);

      const result = await runOn(harness, promptEvent("base"));

      expect(result).toBe(expected);
    },
  );

  it.each(KEEPING_RESULTS)("%s as a result keeps the prompt", async (label, value) => {
    const harness = createHarness();
    harness.addPlugin("observer").on(HOOK, () => value as PluginHookSystemPromptEndResult);

    const result = await runOn(harness, promptEvent("base"));

    expect(result).toBe("base");
  });

  it("hands each handler its own copy of the event and never mutates the input", async () => {
    const harness = createHarness();
    const seenEvents: PluginHookSystemPromptEndEvent[] = [];
    const seenContexts: unknown[] = [];
    harness.addPlugin("first").on(
      HOOK,
      (event, ctx) => {
        seenEvents.push(event);
        seenContexts.push(ctx);
        return "one";
      },
      { priority: 2 },
    );
    harness.addPlugin("second").on(
      HOOK,
      (event, ctx) => {
        seenEvents.push(event);
        seenContexts.push(ctx);
      },
      { priority: 1 },
    );
    const input = Object.freeze({ ...promptEvent("base"), requestId: "req-1" });

    const result = await runOn(harness, input);

    expect(result).toBe("one");
    expect(seenEvents).toStrictEqual([
      { ...input, systemPrompt: "base" },
      { ...input, systemPrompt: "one" },
    ]);
    expect(seenEvents[0]).not.toBe(input);
    expect(seenEvents[1]).not.toBe(seenEvents[0]);
    expect(seenContexts).toStrictEqual([TEST_PLUGIN_AGENT_CTX, TEST_PLUGIN_AGENT_CTX]);
    expect(input.systemPrompt).toBe("base");
  });

  it("skips a throwing handler, logs it by plugin id and still runs the next one", async () => {
    const harness = createHarness();
    const logger = createLoggerSpies();
    harness.addPlugin("broken").on(
      HOOK,
      () => {
        throw new Error("boom");
      },
      { priority: 2 },
    );
    harness.addPlugin("healthy").on(HOOK, (event) => `${event.systemPrompt}|healthy`, {
      priority: 1,
    });

    const result = await runOn(harness, promptEvent("base"), { runner: { logger } });

    expect(result).toBe("base|healthy");
    expect(logger.error).toHaveBeenCalledWith(`[hooks] ${HOOK} handler from broken failed: boom`);
  });

  it("skips a handler that exceeds its timeout and still runs the next one", async () => {
    const harness = createHarness();
    const logger = createLoggerSpies();
    const release = createDeferred();
    harness.addPlugin("slow", { timeouts: { [HOOK]: 30 } }).on(
      HOOK,
      async () => {
        await release.promise;
        return "late";
      },
      { priority: 2 },
    );
    harness.addPlugin("fast").on(HOOK, (event) => `${event.systemPrompt}|fast`, { priority: 1 });

    const result = await runOn(harness, promptEvent("base"), { runner: { logger } });
    // Plugin disposal waits for in-flight handlers, so let the timed-out one finish.
    release.resolve();

    expect(result).toBe("base|fast");
    expect(logger.error).toHaveBeenCalledWith(
      `[hooks] ${HOOK} handler from slow failed: timed out after 30ms`,
    );
  });

  it("logs one debug line per replacement and none when a handler keeps the text", async () => {
    const harness = createHarness();
    const debug = vi.fn<(message: string) => void>();
    harness.addPlugin("grower").on(HOOK, (event) => `${event.systemPrompt}!`, { priority: 2 });
    harness.addPlugin("same").on(HOOK, (event) => event.systemPrompt, { priority: 1 });

    const result = await runOn(
      harness,
      { ...promptEvent("base"), runtime: "claude-cli" },
      { logger: { debug } },
    );

    expect(result).toBe("base!");
    expect(debug).toHaveBeenCalledOnce();
    expect(debug).toHaveBeenCalledWith(
      `[hooks] ${HOOK} handler from grower replaced the claude-cli system prompt (4 -> 5 chars)`,
    );
  });
});

describe("installSystemPromptEnd", () => {
  it("hands the inner stream function a replaced copy of the context", async () => {
    const harness = createHarness();
    const seenEvents: PluginHookSystemPromptEndEvent[] = [];
    harness.addPlugin("rewriter").on(HOOK, (event) => {
      seenEvents.push(event);
      return `${event.systemPrompt}\nextra`;
    });
    const { agent, inner } = createAgent();
    install(harness, agent);
    const original = `Be brief.${SYSTEM_PROMPT_CACHE_BOUNDARY}Runtime: test`;
    const context: Parameters<StreamFn>[1] = { systemPrompt: original, messages: [] };
    Object.freeze(context);
    const options = { requestId: "req-7" };

    const stream = await agent.streamFn(MODEL, context, options);

    const [model, passed, passedOptions] = firstCall(inner);
    expect(stream).toBe(STREAM);
    expect(model).toBe(MODEL);
    expect(passedOptions).toBe(options);
    expect(passed).not.toBe(context);
    expect(passed.systemPrompt).toBe(`${original}\nextra`);
    expect(passed.messages).toBe(context.messages);
    expect(passed.preparedSystemPrompt?.text).toBe(`${original}\nextra`);
    expect(passed.preparedSystemPrompt?.stripped).toBe("Be brief.\nRuntime: test\nextra");
    expect(context.systemPrompt).toBe(original);
    expect(context.preparedSystemPrompt).toBeUndefined();
    expect(seenEvents).toStrictEqual([
      {
        systemPrompt: original,
        runtime: "embedded",
        provider: "anthropic",
        model: "claude-test",
        requestId: "req-7",
      },
    ]);
  });

  it("runs the handlers for every model request and reuses the prepared prompt", async () => {
    const harness = createHarness();
    const seenEvents: PluginHookSystemPromptEndEvent[] = [];
    harness.addPlugin("rewriter").on(HOOK, (event) => {
      seenEvents.push(event);
      return "fixed prompt";
    });
    const { agent, inner } = createAgent();
    install(harness, agent);

    await agent.streamFn(MODEL, { systemPrompt: "first", messages: [] }, undefined);
    await agent.streamFn(MODEL, { systemPrompt: "second", messages: [] }, undefined);

    const sent = inner.mock.calls.map((call) => call[1]);
    expect(seenEvents.map((event) => event.systemPrompt)).toStrictEqual(["first", "second"]);
    expect(seenEvents[0]).toStrictEqual({
      systemPrompt: "first",
      runtime: "embedded",
      provider: "anthropic",
      model: "claude-test",
    });
    expect(sent.map((context) => context.systemPrompt)).toStrictEqual([
      "fixed prompt",
      "fixed prompt",
    ]);
    expect(sent[0]?.preparedSystemPrompt?.text).toBe("fixed prompt");
    expect(sent[1]?.preparedSystemPrompt).toBe(sent[0]?.preparedSystemPrompt);
  });

  it("returns the inner result synchronously when no handler is registered", () => {
    const harness = createHarness();
    const { agent, inner } = createAgent();
    install(harness, agent);
    const context: Parameters<StreamFn>[1] = { systemPrompt: "base", messages: [] };
    const options = { requestId: "req-1" };

    const result = agent.streamFn(MODEL, context, options);

    const [model, passed, passedOptions] = firstCall(inner);
    expect(result).toBe(STREAM);
    expect(model).toBe(MODEL);
    expect(passed).toBe(context);
    expect(passedOptions).toBe(options);
  });

  it("keeps the context object when a handler returns the same prompt", async () => {
    const harness = createHarness();
    harness.addPlugin("observer").on(HOOK, (event) => event.systemPrompt);
    const { agent, inner } = createAgent();
    install(harness, agent);
    const context: Parameters<StreamFn>[1] = { systemPrompt: "base", messages: [] };

    await agent.streamFn(MODEL, context, undefined);

    expect(firstCall(inner)[1]).toBe(context);
  });

  it("passes a request without a system prompt straight through", () => {
    const harness = createHarness();
    const handler = vi.fn<PluginHookSystemPromptEndHandler>(() => "replaced");
    harness.addPlugin("rewriter").on(HOOK, handler);
    const { agent, inner } = createAgent();
    install(harness, agent);
    const context: Parameters<StreamFn>[1] = { messages: [] };

    const result = agent.streamFn(MODEL, context, undefined);

    expect(result).toBe(STREAM);
    expect(firstCall(inner)[1]).toBe(context);
    expect(handler).not.toHaveBeenCalled();
  });

  it("fails open when the hook layer itself fails", async () => {
    const { agent, inner } = createAgent();
    installSystemPromptEnd(agent, { hookRunner: FAILING_RUNNER, hookCtx: TEST_PLUGIN_AGENT_CTX });
    const context: Parameters<StreamFn>[1] = { systemPrompt: "base", messages: [] };

    const stream = await agent.streamFn(MODEL, context, undefined);

    expect(stream).toBe(STREAM);
    expect(firstCall(inner)[1]).toBe(context);
  });

  it("rejects an already aborted request before any handler runs", async () => {
    const harness = createHarness();
    const handler = vi.fn<PluginHookSystemPromptEndHandler>(() => "replaced");
    harness.addPlugin("rewriter").on(HOOK, handler);
    const { agent, inner } = createAgent();
    install(harness, agent);
    const controller = new AbortController();
    controller.abort(new Error("cancelled"));
    const context: Parameters<StreamFn>[1] = { systemPrompt: "base", messages: [] };

    const pending = agent.streamFn(MODEL, context, { signal: controller.signal });

    await expect(pending).rejects.toThrow("cancelled");
    expect(handler).not.toHaveBeenCalled();
    expect(inner).not.toHaveBeenCalled();
  });

  it("restores the stream function it wrapped only while its wrapper is still installed", () => {
    const harness = createHarness();
    const { agent, inner } = createAgent();

    const uninstall = install(harness, agent);
    const wrapper = agent.streamFn;
    uninstall();

    expect(wrapper).not.toBe(inner);
    expect(agent.streamFn).toBe(inner);

    const uninstallSecond = install(harness, agent);
    const outer = vi.fn<StreamFn>();
    agent.streamFn = outer;
    uninstallSecond();

    expect(agent.streamFn).toBe(outer);
  });

  it("leaves the stream function alone without a hook runner", () => {
    const { agent, inner } = createAgent();

    const uninstallWithoutRunner = installSystemPromptEnd(agent, {
      hookRunner: undefined,
      hookCtx: TEST_PLUGIN_AGENT_CTX,
    });
    const uninstallWithoutInstall = installSystemPromptEnd(agent);
    uninstallWithoutRunner();
    uninstallWithoutInstall();

    expect(agent.streamFn).toBe(inner);
  });
});

describe("applyClaudeCliSystemPromptEnd", () => {
  it("runs the handlers with the claude-cli runtime and the turn's hook context", async () => {
    const harness = createHarness();
    const seenEvents: PluginHookSystemPromptEndEvent[] = [];
    const seenContexts: unknown[] = [];
    harness.addPlugin("cli-rewriter").on(HOOK, (event, ctx) => {
      seenEvents.push(event);
      seenContexts.push(ctx);
      return { systemPrompt: `${event.systemPrompt}\ncli` };
    });

    const result = await applyClaudeCliSystemPromptEnd("base", {
      hookRunner: createHookRunner(harness.registry),
      hookCtx: TEST_PLUGIN_AGENT_CTX,
      provider: "claude-cli",
      model: "claude-opus-5-5",
    });

    expect(result).toBe("base\ncli");
    expect(seenEvents).toStrictEqual([
      {
        systemPrompt: "base",
        runtime: "claude-cli",
        provider: "claude-cli",
        model: "claude-opus-5-5",
      },
    ]);
    expect(seenContexts).toStrictEqual([TEST_PLUGIN_AGENT_CTX]);
  });

  it("keeps the prompt when there is no hook runner", async () => {
    const result = await applyClaudeCliSystemPromptEnd("base", {
      hookRunner: undefined,
      hookCtx: TEST_PLUGIN_AGENT_CTX,
      provider: "claude-cli",
      model: "claude-opus-5-5",
    });

    expect(result).toBe("base");
  });

  it("fails open when the hook layer itself fails", async () => {
    const result = await applyClaudeCliSystemPromptEnd("base", {
      hookRunner: FAILING_RUNNER,
      hookCtx: TEST_PLUGIN_AGENT_CTX,
      provider: "claude-cli",
      model: "claude-opus-5-5",
    });

    expect(result).toBe("base");
  });
});
