import { getGlobalHookRunner } from "../../plugins/hook-runner-global.js";
import type { PluginHookAgentEndEvent, PluginHookBeforeAgentFinalizeEvent, PluginHookLlmInputEvent, PluginHookLlmOutputEvent } from "../../plugins/hook-types.js";
import { type AgentHarnessHookContext } from "./hook-context.js";
type AgentHarnessHookRunner = ReturnType<typeof getGlobalHookRunner>;
/** Returns the current global hook runner for harness lifecycle hooks. */
export declare function getAgentHarnessHookRunner(): AgentHarnessHookRunner;
/** Clears before-finalize retry budgets globally or for one run. */
export declare function clearAgentHarnessFinalizeRetryBudget(params?: {
    runId?: string;
}): void;
/** Dispatches best-effort LLM input hooks for a harness attempt. */
export declare function runAgentHarnessLlmInputHook(params: {
    event: PluginHookLlmInputEvent;
    ctx: AgentHarnessHookContext;
    hookRunner?: AgentHarnessHookRunner;
}): void;
/** Dispatches best-effort LLM output hooks for a harness attempt. */
export declare function runAgentHarnessLlmOutputHook(params: {
    event: PluginHookLlmOutputEvent;
    ctx: AgentHarnessHookContext;
    hookRunner?: AgentHarnessHookRunner;
}): void;
/** Starts agent_end hooks with unref timeout behavior. */
export declare function runAgentHarnessAgentEndHook(params: {
    event: PluginHookAgentEndEvent;
    ctx: AgentHarnessHookContext;
    hookRunner?: AgentHarnessHookRunner;
}): void;
/** Runs agent_end hooks and waits for completion. */
export declare function awaitAgentHarnessAgentEndHook(params: {
    event: PluginHookAgentEndEvent;
    ctx: AgentHarnessHookContext;
    hookRunner?: AgentHarnessHookRunner;
}): Promise<void>;
/** Normalized before-finalize hook decision consumed by harness loops. */
type AgentHarnessBeforeAgentFinalizeOutcome = {
    action: "continue";
} | {
    action: "revise";
    reason: string;
} | {
    action: "finalize";
    reason?: string;
};
/** Runs before-finalize hooks and normalizes finalize/revise/continue decisions. */
export declare function runAgentHarnessBeforeAgentFinalizeHook(params: {
    event: PluginHookBeforeAgentFinalizeEvent;
    ctx: AgentHarnessHookContext;
    hookRunner?: AgentHarnessHookRunner;
}): Promise<AgentHarnessBeforeAgentFinalizeOutcome>;
export {};
