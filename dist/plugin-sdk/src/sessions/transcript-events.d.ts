/** Storage-neutral identity for the session transcript that changed. */
export type SessionTranscriptUpdateTarget = {
    agentId: string;
    sessionId: string;
    sessionKey: string;
};
type SessionTranscriptUpdateFields = {
    sessionFile?: string;
    target?: SessionTranscriptUpdateTarget;
    sessionKey?: string;
    agentId?: string;
    /** @deprecated Pre-SQLite compatibility mirror. Prefer `target.sessionId`. */
    sessionId?: string;
    message?: unknown;
    messageId?: string;
    messageSeq?: number;
};
/** Normalized transcript update emitted after a session transcript changes. */
export type SessionTranscriptUpdate = SessionTranscriptUpdateFields & {
    /** @deprecated File-backed compatibility hint. Prefer `target` for identity. */
    sessionFile: string;
};
/** Internal transcript update that may identify a transcript without a file path. */
export type InternalSessionTranscriptUpdate = SessionTranscriptUpdateFields;
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
type InternalSessionTranscriptListener = (update: InternalSessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
export declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Registers an internal listener for identity-only or file-backed transcript updates. */
export declare function onInternalSessionTranscriptUpdate(listener: InternalSessionTranscriptListener): () => void;
/** Emits a normalized transcript update to all registered listeners. */
export declare function emitSessionTranscriptUpdate(update: string | SessionTranscriptUpdate): void;
/** Emits an internal transcript update, including identity-only updates. */
export declare function emitInternalSessionTranscriptUpdate(update: InternalSessionTranscriptUpdate): void;
export {};
