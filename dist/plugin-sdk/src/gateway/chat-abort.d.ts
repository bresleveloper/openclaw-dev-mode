import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ChatAbortMarker } from "./server-chat-state.js";
export type ChatAbortControllerEntry = {
    controller: AbortController;
    sessionId: string;
    sessionKey: string;
    lifecycleGeneration?: string;
    agentId?: string;
    startedAtMs: number;
    expiresAtMs: number;
    ownerConnId?: string;
    ownerDeviceId?: string;
    providerId?: string;
    authProviderId?: string;
    abortStopReason?: string;
    /**
     * False for backend/internal agent runs that may share a session key but must
     * not be projected into operator chat surfaces.
     */
    controlUiVisible?: boolean;
    /**
     * Controls only the sessions.list active-run projection. Terminal lifecycle
     * clears this before chat.send settles, while the entry stays as the retry
     * idempotency guard until normal cleanup removes it.
     */
    projectSessionActive?: boolean;
    /** True after the terminal session-store update has completed. */
    projectSessionTerminalPersisted?: boolean;
    /** A terminal lifecycle event was observed and is awaiting persistence. */
    projectSessionTerminalPending?: boolean;
    /** Store timestamp expected from the observed terminal lifecycle event. */
    projectSessionTerminalObservedAt?: number;
    /** In-flight terminal session-store update used by restart shutdown. */
    projectSessionTerminalPersistence?: Promise<void>;
    /** Caller completion requested cleanup before terminal lifecycle persistence settled. */
    registrationCleanupRequested?: boolean;
    /**
     * Which RPC owns this registration. Absent (undefined) is treated as
     * `"chat-send"` so pre-existing callers that constructed entries without
     * a kind keep their behavior. Consumers that need "chat.send specifically
     * is active" must check `kind !== "agent"`, not just `.has(runId)`.
     */
    kind?: "chat-send" | "agent";
};
export type RestartRecoveryCandidate = {
    runId: string;
    lifecycleGeneration: string;
    sessionKey: string;
    sessionId: string;
    observedAt?: number;
};
type RegisteredChatAbortController = {
    controller: AbortController;
    registered: boolean;
    entry?: ChatAbortControllerEntry;
    cleanup: (opts?: {
        force?: boolean;
    }) => void;
};
export declare function isChatStopCommandText(text: string): boolean;
export declare function resolveChatRunExpiresAtMs(params: {
    now: number;
    timeoutMs: number;
    graceMs?: number;
    minMs?: number;
    maxMs?: number;
}): number;
export declare function resolveAgentRunExpiresAtMs(params: {
    now: number;
    timeoutMs: number;
    graceMs?: number;
}): number;
export declare function registerChatAbortController(params: {
    chatAbortControllers: Map<string, ChatAbortControllerEntry>;
    runId: string;
    sessionId: string;
    sessionKey?: string | null;
    agentId?: string;
    timeoutMs: number;
    ownerConnId?: string;
    ownerDeviceId?: string;
    providerId?: string;
    authProviderId?: string;
    controlUiVisible?: boolean;
    kind?: ChatAbortControllerEntry["kind"];
    lifecycleGeneration?: string;
    now?: number;
    expiresAtMs?: number;
}): RegisteredChatAbortController;
/**
 * Snapshot the live assistant text of any in-flight run for a session+agent. Used
 * by chat.history so a run that kept streaming while the client was switched away
 * — whose deltas the gateway delivered to a delivery key this client is no longer
 * subscribed to — is restored on switch-back.
 *
 * Matches a run the same way sessions.list's active-run projection does: an abort
 * entry can hold the requested key while chat run state holds the canonical store
 * key, so accept a match on EITHER `requestedSessionKey` or `canonicalSessionKey`,
 * scoping the shared "global" session by agent. Only runs still projected active
 * (`projectSessionActive !== false`, matching sessions.list; the terminal lifecycle
 * flips it to false), not aborted, and visible chat-send runs are returned, so a
 * finalized run — already in persisted history — is not duplicated and hidden
 * agent runs cannot be adopted by chat clients that will not receive their final
 * events.
 */
export declare function resolveInFlightRunSnapshot(params: {
    chatAbortControllers: Map<string, ChatAbortControllerEntry>;
    chatRunBuffers: Map<string, string>;
    requestedSessionKey: string;
    canonicalSessionKey: string;
    agentId?: string;
    defaultAgentId?: string;
}): {
    runId: string;
    text: string;
} | undefined;
export declare function boundInFlightRunSnapshotForChatHistory(params: {
    snapshot: {
        runId: string;
        text: string;
    } | undefined;
    messages: unknown[];
    maxBytes: number;
}): {
    runId: string;
    text: string;
} | undefined;
export type ChatAbortOps = {
    chatAbortControllers: Map<string, ChatAbortControllerEntry>;
    chatRunBuffers: Map<string, string>;
    chatAbortedRuns: Map<string, ChatAbortMarker>;
    clearChatRunState: (runId: string) => void;
    removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => {
        sessionKey: string;
        agentId?: string;
        clientRunId: string;
    } | undefined;
    agentRunSeq: Map<string, number>;
    getRuntimeConfig?: () => OpenClawConfig;
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
    }) => void;
    nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
};
type TrackedChatRunAbortOps = {
    chatAbortControllers: ChatAbortOps["chatAbortControllers"];
    chatRunBuffers: ChatAbortOps["chatRunBuffers"];
    chatRunState: {
        abortedRuns: ChatAbortOps["chatAbortedRuns"];
        clearRun: ChatAbortOps["clearChatRunState"];
    };
    removeChatRun: ChatAbortOps["removeChatRun"];
    agentRunSeq: ChatAbortOps["agentRunSeq"];
    broadcast: ChatAbortOps["broadcast"];
    nodeSendToSession: ChatAbortOps["nodeSendToSession"];
};
export declare function abortTrackedChatRunById(ops: TrackedChatRunAbortOps, params: Parameters<typeof abortChatRunById>[1]): {
    aborted: boolean;
};
export declare function abortChatRunById(ops: ChatAbortOps, params: {
    runId: string;
    sessionKey: string;
    stopReason?: string;
}): {
    aborted: boolean;
};
export declare function updateChatRunProvider(chatAbortControllers: Map<string, ChatAbortControllerEntry>, params: {
    runId: string;
    providerId?: string;
    authProviderId?: string;
}): boolean;
export declare function abortChatRunsForProvider(ops: ChatAbortOps, params: {
    providerId: string;
    stopReason?: string;
}): {
    runIds: string[];
};
export {};
