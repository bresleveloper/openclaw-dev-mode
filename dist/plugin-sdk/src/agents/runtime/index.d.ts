/**
 * OpenClaw-owned agent runtime facade.
 *
 * Wires agent-core to the plugin SDK LLM runtime and re-exports reusable runtime helpers.
 */
import { Agent as CoreAgent, type AgentOptions as CoreAgentOptions } from "../../../packages/agent-core/src/agent.js";
import type { CompleteSimpleFn, StreamFn } from "../../../packages/llm-core/src/index.js";
export declare const openClawAgentCoreRuntime: {
    completeSimple: CompleteSimpleFn;
    streamSimple: StreamFn;
};
export declare class Agent extends CoreAgent {
    constructor(options?: CoreAgentOptions);
}
export * from "../../../packages/agent-core/src/index.js";
export * from "./proxy.js";
