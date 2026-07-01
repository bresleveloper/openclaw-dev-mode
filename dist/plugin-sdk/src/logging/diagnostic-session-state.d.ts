export type SessionStateValue = "idle" | "processing" | "waiting";
/** Mutable diagnostic state for one session key or id. */
export type SessionState = {
    sessionId?: string;
    sessionKey?: string;
    sessionFile?: string;
    lastActivity: number;
    generation?: number;
    lastStuckWarnAgeMs?: number;
    lastLongRunningWarnAgeMs?: number;
    state: SessionStateValue;
    queueDepth: number;
    activeQueuedTurn?: boolean;
    toolCallHistory?: ToolCallRecord[];
    toolLoopWarningBuckets?: Map<string, number>;
    commandPollCounts?: Map<string, {
        count: number;
        lastPollAt: number;
    }>;
};
/** Compact record of a recent tool call used for loop diagnostics. */
export type ToolCallRecord = {
    toolName: string;
    argsHash: string;
    toolCallId?: string;
    runId?: string;
    resultHash?: string;
    unknownToolName?: string;
    timestamp: number;
};
/** Partial session identity accepted by diagnostic helpers. */
export type SessionRef = {
    sessionId?: string;
    sessionKey?: string;
    sessionFile?: string;
};
/** Shared in-memory diagnostic session state map. */
export declare const diagnosticSessionStates: Map<string, SessionState>;
/** Prunes stale idle session states and caps the process-local state map. */
export declare function pruneDiagnosticSessionStates(now?: number, force?: boolean): void;
/** Gets or creates diagnostic state, merging aliases that share a session id. */
export declare function getDiagnosticSessionState(ref: SessionRef): SessionState;
/** Looks up diagnostic state without creating a new entry. */
export declare function peekDiagnosticSessionState(ref: SessionRef): SessionState | undefined;
/** Returns the current state count for pruning tests. */
export declare function getDiagnosticSessionStateCountForTest(): number;
/** Clears all process-local diagnostic session state for tests. */
export declare function resetDiagnosticSessionStateForTest(): void;
/** Checks whether a generation/state snapshot still matches current diagnostic state. */
export declare function isDiagnosticSessionStateCurrent(params: {
    sessionId?: string;
    sessionKey?: string;
    generation?: number;
    state?: SessionStateValue;
}): boolean;
