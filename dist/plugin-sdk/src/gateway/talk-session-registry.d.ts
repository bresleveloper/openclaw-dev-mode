/**
 * Process-local registry that lets Talk protocol methods resolve opaque
 * `sessionId` values to the concrete relay or managed-room backend.
 */
export type UnifiedTalkSessionRecord = {
    kind: "realtime-relay";
    connId: string;
    relaySessionId: string;
} | {
    kind: "transcription-relay";
    connId: string;
    transcriptionSessionId: string;
} | {
    kind: "managed-room";
    handoffId: string;
    token: string;
    roomId: string;
};
/** Associates a public Talk session id with its concrete gateway backend. */
export declare function rememberUnifiedTalkSession(sessionId: string, session: UnifiedTalkSessionRecord): void;
/** Resolves a Talk session id or throws the protocol-facing unknown-session error. */
export declare function getUnifiedTalkSession(sessionId: string): UnifiedTalkSessionRecord;
/** Removes a Talk session id after the concrete backend closes. */
export declare function forgetUnifiedTalkSession(sessionId: string): void;
/** Enforces that a relay-backed Talk session is controlled by its owner socket. */
export declare function requireUnifiedTalkSessionConn(session: Extract<UnifiedTalkSessionRecord, {
    connId: string;
}>, connId: string | undefined): string;
