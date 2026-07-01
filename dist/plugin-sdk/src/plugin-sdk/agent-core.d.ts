import { Agent as CoreAgent, type AgentOptions as CoreAgentOptions } from "../../packages/agent-core/src/agent.js";
import type { CompleteSimpleFn, StreamFn } from "../../packages/llm-core/src/index.js";
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
export declare const openClawAgentCoreRuntime: {
    completeSimple: CompleteSimpleFn;
    streamSimple: StreamFn;
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
export declare class Agent extends CoreAgent {
    constructor(options?: CoreAgentOptions);
}
export * from "../../packages/agent-core/src/index.js";
export * from "../agents/runtime/proxy.js";
