import type { EventStream } from "../../llm-core/src/index.js";
import { type AgentCoreStreamRuntimeDeps } from "./runtime-deps.js";
import type { AgentContext, AgentEvent, AgentLoopConfig, AgentMessage, StreamFn } from "./types.js";
/** Callback used by synchronous loop runners to publish agent lifecycle events. */
export type AgentEventSink = (event: AgentEvent) => Promise<void> | void;
/**
 * Start an agent loop with a new prompt message.
 * The prompt is added to the context and events are emitted for it.
 */
export declare function agentLoop(prompts: AgentMessage[], context: AgentContext, config: AgentLoopConfig, signal?: AbortSignal, streamFn?: StreamFn, runtime?: AgentCoreStreamRuntimeDeps): EventStream<AgentEvent, AgentMessage[]>;
/**
 * Continue an agent loop from the current context without adding a new message.
 * Used for retries - context already has user message or tool results.
 *
 * **Important:** The last message in context must convert to a `user` or `toolResult` message
 * via `convertToLlm`. If it doesn't, the LLM provider will reject the request.
 * This cannot be validated here since `convertToLlm` is only called once per turn.
 */
export declare function agentLoopContinue(context: AgentContext, config: AgentLoopConfig, signal?: AbortSignal, streamFn?: StreamFn, runtime?: AgentCoreStreamRuntimeDeps): EventStream<AgentEvent, AgentMessage[]>;
/** Run a prompt-started loop and emit events through a caller-owned sink. */
export declare function runAgentLoop(prompts: AgentMessage[], context: AgentContext, config: AgentLoopConfig, emit: AgentEventSink, signal?: AbortSignal, streamFn?: StreamFn, runtime?: AgentCoreStreamRuntimeDeps): Promise<AgentMessage[]>;
/** Continue an existing loop context and emit only newly produced messages. */
export declare function runAgentLoopContinue(context: AgentContext, config: AgentLoopConfig, emit: AgentEventSink, signal?: AbortSignal, streamFn?: StreamFn, runtime?: AgentCoreStreamRuntimeDeps): Promise<AgentMessage[]>;
