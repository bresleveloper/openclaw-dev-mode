import { runAgentHarnessAgentEndHook } from "./lifecycle-hook-helpers.js";
type AgentEndSideEffectsParams = Parameters<typeof runAgentHarnessAgentEndHook>[0];
/** Starts agent-end side effects without waiting for completion. */
export declare function runAgentEndSideEffects(params: AgentEndSideEffectsParams): void;
/** Runs agent-end side effects and waits for plugin/core completion. */
export declare function awaitAgentEndSideEffects(params: AgentEndSideEffectsParams): Promise<void>;
export {};
