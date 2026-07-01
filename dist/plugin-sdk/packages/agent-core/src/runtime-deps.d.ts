import type { CompleteSimpleFn, StreamFn } from "../../llm-core/src/index.js";
/** Runtime functions injected by host packages so agent-core stays provider-agnostic. */
export interface AgentCoreRuntimeDeps {
    /** Streaming completion implementation used for normal agent turns. */
    streamSimple: StreamFn;
    /** Non-streaming completion implementation used by summarization helpers. */
    completeSimple: CompleteSimpleFn;
}
/** Runtime dependency subset required by streaming agent loops. */
export type AgentCoreStreamRuntimeDeps = Pick<AgentCoreRuntimeDeps, "streamSimple">;
/** Runtime dependency subset required by summarization helpers. */
export type AgentCoreCompletionRuntimeDeps = Pick<AgentCoreRuntimeDeps, "completeSimple">;
/** Resolve the stream function, preferring an explicit override over injected runtime deps. */
export declare function resolveAgentCoreStreamFn(runtime: AgentCoreStreamRuntimeDeps | undefined, streamFn?: StreamFn): StreamFn;
/** Resolve the completion function used by non-streaming helper flows. */
export declare function resolveAgentCoreCompleteFn(runtime: AgentCoreCompletionRuntimeDeps | undefined): CompleteSimpleFn;
