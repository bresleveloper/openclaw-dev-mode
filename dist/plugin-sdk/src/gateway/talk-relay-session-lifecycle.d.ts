/**
 * Shared TTL and connection-ownership checks for Talk relay session maps.
 */
type TalkRelayLifecycleSession = {
    connId: string;
    expiresAtMs: number;
};
type CloseTalkRelaySession<TSession extends TalkRelayLifecycleSession> = (session: TSession) => void;
/** Closes every expired relay session in the provided process-local map. */
export declare function closeExpiredTalkRelaySessions<TSession extends TalkRelayLifecycleSession>(params: {
    sessions: Iterable<TSession>;
    closeSession: CloseTalkRelaySession<TSession>;
    nowMs?: number;
}): void;
/** Returns the active session only when it belongs to the current connection. */
export declare function requireActiveTalkRelaySession<TSession extends TalkRelayLifecycleSession>(params: {
    sessions: ReadonlyMap<string, TSession>;
    sessionId: string;
    connId: string;
    closeSession: CloseTalkRelaySession<TSession>;
    unknownSessionMessage: string;
}): TSession;
export {};
