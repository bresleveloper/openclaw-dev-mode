import type { ImageContent, Message, SimpleStreamOptions, ThinkingBudgets, Transport } from "../../llm-core/src/index.js";
import { type AgentCoreStreamRuntimeDeps } from "./runtime-deps.js";
import type { AfterToolCallContext, AfterToolCallResult, AgentEvent, AgentLoopConfig, AgentLoopTurnUpdate, AgentMessage, AgentState, BeforeToolCallContext, BeforeToolCallResult, QueueMode, StreamFn, ToolExecutionMode } from "./types.js";
export type { QueueMode } from "./types.js";
/** Options for constructing an {@link Agent}. */
export interface AgentOptions {
    /** Initial transcript, tools, model, and prompt state. */
    initialState?: Partial<Omit<AgentState, "pendingToolCalls" | "isStreaming" | "streamingMessage" | "errorMessage">>;
    /** Convert agent-owned transcript messages into provider-facing messages. */
    convertToLlm?: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
    /** Optionally rewrite context before each provider request. */
    transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
    /** Injected stream runtime used when streamFn is not supplied. */
    runtime?: AgentCoreStreamRuntimeDeps;
    /** Explicit stream implementation, preferred over runtime.streamSimple. */
    streamFn?: StreamFn;
    /** Resolve provider API keys at request time. */
    getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
    /** Inspect the provider payload before it is sent. */
    onPayload?: SimpleStreamOptions["onPayload"];
    /** Inspect the provider response after it returns. */
    onResponse?: SimpleStreamOptions["onResponse"];
    /** Hook that may short-circuit or alter a tool call before execution. */
    beforeToolCall?: (context: BeforeToolCallContext, signal?: AbortSignal) => Promise<BeforeToolCallResult | undefined>;
    /** Hook that may hydrate a deferred authorized tool call into an executable tool. */
    resolveDeferredTool?: AgentLoopConfig["resolveDeferredTool"];
    /** Hook that may alter a tool result after execution. */
    afterToolCall?: (context: AfterToolCallContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
    /** Hook that may update model, reasoning, or context after a turn. */
    prepareNextTurn?: (signal?: AbortSignal) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
    /** Queue drain mode for steering messages injected before the next assistant response. */
    steeringMode?: QueueMode;
    /** Queue drain mode for follow-up messages injected after the agent would otherwise stop. */
    followUpMode?: QueueMode;
    /** Session identifier forwarded to cache-aware providers. */
    sessionId?: string;
    /** Optional per-thinking-level token budgets forwarded to providers. */
    thinkingBudgets?: ThinkingBudgets;
    /** Preferred provider transport. */
    transport?: Transport;
    /** Optional cap for provider-requested retry delays. */
    maxRetryDelayMs?: number;
    /** Default strategy for executing multiple tool calls in one assistant message. */
    toolExecution?: ToolExecutionMode;
}
/**
 * Stateful wrapper around the low-level agent loop.
 *
 * `Agent` owns the current transcript, emits lifecycle events, executes tools,
 * and exposes queueing APIs for steering and follow-up messages.
 */
export declare class Agent {
    private mutableState;
    private readonly listeners;
    private readonly steeringQueue;
    private readonly followUpQueue;
    convertToLlm: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
    transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
    runtime?: AgentCoreStreamRuntimeDeps;
    streamFn: StreamFn;
    getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
    onPayload?: SimpleStreamOptions["onPayload"];
    onResponse?: SimpleStreamOptions["onResponse"];
    beforeToolCall?: (context: BeforeToolCallContext, signal?: AbortSignal) => Promise<BeforeToolCallResult | undefined>;
    resolveDeferredTool?: AgentLoopConfig["resolveDeferredTool"];
    afterToolCall?: (context: AfterToolCallContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
    prepareNextTurn?: (signal?: AbortSignal) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
    private activeRun?;
    /** Session identifier forwarded to providers for cache-aware backends. */
    sessionId?: string;
    /** Optional per-level thinking token budgets forwarded to the stream function. */
    thinkingBudgets?: ThinkingBudgets;
    /** Preferred transport forwarded to the stream function. */
    transport: Transport;
    /** Optional cap for provider-requested retry delays. */
    maxRetryDelayMs?: number;
    /** Tool execution strategy for assistant messages that contain multiple tool calls. */
    toolExecution: ToolExecutionMode;
    constructor(options?: AgentOptions);
    /**
     * Subscribe to agent lifecycle events.
     *
     * Listener promises are awaited in subscription order and are included in
     * the current run's settlement. Listeners also receive the active abort
     * signal for the current run.
     *
     * `agent_end` is the final emitted event for a run, but the agent does not
     * become idle until all awaited listeners for that event have settled.
     */
    subscribe(listener: (event: AgentEvent, signal: AbortSignal) => Promise<void> | void): () => void;
    /**
     * Current agent state.
     *
     * Assigning `state.tools` or `state.messages` copies the provided top-level array.
     */
    get state(): AgentState;
    /** Controls how queued steering messages are drained. */
    set steeringMode(mode: QueueMode);
    get steeringMode(): QueueMode;
    /** Controls how queued follow-up messages are drained. */
    set followUpMode(mode: QueueMode);
    get followUpMode(): QueueMode;
    /** Queue a message to be injected after the current assistant turn finishes. */
    steer(message: AgentMessage): void;
    /** Queue a message to run only after the agent would otherwise stop. */
    followUp(message: AgentMessage): void;
    /** Remove all queued steering messages. */
    clearSteeringQueue(): void;
    /** Remove all queued follow-up messages. */
    clearFollowUpQueue(): void;
    /** Remove all queued steering and follow-up messages. */
    clearAllQueues(): void;
    /** Returns true when either queue still contains pending messages. */
    hasQueuedMessages(): boolean;
    /** Active abort signal for the current run, if any. */
    get signal(): AbortSignal | undefined;
    /** Abort the current run, if one is active. */
    abort(): void;
    /**
     * Resolve when the current run and all awaited event listeners have finished.
     *
     * This resolves after `agent_end` listeners settle.
     */
    waitForIdle(): Promise<void>;
    /** Clear transcript state, runtime state, and queued messages. */
    reset(): void;
    /** Start a new prompt from text, a single message, or a batch of messages. */
    prompt(message: AgentMessage | AgentMessage[]): Promise<void>;
    prompt(input: string, images?: ImageContent[]): Promise<void>;
    /** Continue from the current transcript. The last message must be a user or tool-result message. */
    continue(): Promise<void>;
    private normalizePromptInput;
    private runPromptMessages;
    private runContinuation;
    private createContextSnapshot;
    private createLoopConfig;
    private runWithLifecycle;
    private handleRunFailure;
    private finishRun;
    /**
     * Reduce internal state for a loop event, then await listeners.
     *
     * `agent_end` only means no further loop events will be emitted. The run is
     * considered idle later, after all awaited listeners for `agent_end` finish
     * and `finishRun()` clears runtime-owned state.
     */
    private processEvents;
}
