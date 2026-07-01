import type { AgentEventPayload } from "../infra/agent-events.js";
export type ChatRunTiming = {
    ackedAtMs: number;
    connId: string;
    dispatchStartedAtMs?: number;
    firstAssistantEventSent?: boolean;
    receivedAtMs: number;
};
export type ChatRunRegistration = {
    sessionKey: string;
    agentId?: string;
    clientRunId: string;
    chatSendTiming?: ChatRunTiming;
};
export type ChatRunEntry = ChatRunRegistration & {
    registeredAtMs: number;
    registeredSequence: number;
};
export type ChatAbortMarker = number | {
    abortedAtMs: number;
    sequence: number;
};
/** Stamp a chat run registration with the process-local ordering metadata used for abort freshness checks. */
export declare function createChatRunEntry(entry: ChatRunRegistration): ChatRunEntry;
/** Create an abort marker ordered against chat run registrations, using a shared monotonic sequence. */
export declare function createChatAbortMarker(now?: number): ChatAbortMarker;
/** Return the wall-clock timestamp used by maintenance TTL pruning for both legacy and structured markers. */
export declare function chatAbortMarkerTimestampMs(marker: ChatAbortMarker): number;
/**
 * Return whether an abort marker should suppress events for the given chat run registration.
 * Structured markers compare the monotonic sequence first so same-millisecond aborts stay ordered;
 * legacy numeric markers fall back to timestamp comparison, and a missing entry preserves old suppress-on-presence behavior.
 */
export declare function isChatAbortMarkerCurrent(marker: ChatAbortMarker | undefined, entry?: Pick<ChatRunEntry, "registeredAtMs" | "registeredSequence">): boolean;
export type BufferedAgentEvent = {
    sessionKey?: string;
    agentId?: string;
    payload: AgentEventPayload & {
        spawnedBy?: string;
    };
};
export type ChatRunRegistry = {
    add: (sessionId: string, entry: ChatRunRegistration) => void;
    peek: (sessionId: string) => ChatRunEntry | undefined;
    shift: (sessionId: string) => ChatRunEntry | undefined;
    remove: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
    clear: () => void;
};
/** Create the FIFO registry that maps session IDs to active chat runs. */
export declare function createChatRunRegistry(): ChatRunRegistry;
export type ChatRunState = {
    registry: ChatRunRegistry;
    rawBuffers: Map<string, string>;
    buffers: Map<string, string>;
    /** Last time any buffered assistant text changed, including suppressed raw buffers. */
    bufferUpdatedAt: Map<string, number>;
    deltaSentAt: Map<string, number>;
    /** Length of text at the time of the last broadcast, used to avoid duplicate flushes. */
    deltaLastBroadcastLen: Map<string, number>;
    deltaLastBroadcastText: Map<string, string>;
    agentDeltaSentAt: Map<string, number>;
    bufferedAgentEvents: Map<string, BufferedAgentEvent>;
    abortedRuns: Map<string, ChatAbortMarker>;
    clearRun: (runId: string) => void;
    clear: () => void;
};
/** Create all mutable chat-run maps used by Gateway runtime state. */
export declare function createChatRunState(): ChatRunState;
export type ToolEventRecipientRegistry = {
    add: (runId: string, connId: string) => void;
    get: (runId: string) => ReadonlySet<string> | undefined;
    markFinal: (runId: string) => void;
};
export type SessionEventSubscriberRegistry = {
    subscribe: (connId: string) => void;
    unsubscribe: (connId: string) => void;
    getAll: () => ReadonlySet<string>;
    clear: () => void;
};
export type SessionMessageSubscriberRegistry = {
    subscribe: (connId: string, sessionKey: string) => void;
    unsubscribe: (connId: string, sessionKey: string) => void;
    unsubscribeAll: (connId: string) => void;
    get: (sessionKey: string) => ReadonlySet<string>;
    clear: () => void;
};
/** Create the broad sessions.changed subscriber registry. */
export declare function createSessionEventSubscriberRegistry(): SessionEventSubscriberRegistry;
/** Create the per-session message subscriber registry. */
export declare function createSessionMessageSubscriberRegistry(): SessionMessageSubscriberRegistry;
/** Create the run-id recipient registry used for streaming tool events. */
export declare function createToolEventRecipientRegistry(): ToolEventRecipientRegistry;
