import { type TranscriptMessageAppendOptions, type TranscriptMessageAppendResult, type TranscriptUpdatePayload } from "../config/sessions/session-accessor.js";
import { type LatestAssistantTranscriptText, type SessionTranscriptAppendResult, type SessionTranscriptDeliveryMirror, type SessionTranscriptUpdateMode } from "../config/sessions/transcript.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { formatSessionTranscriptMemoryHitKey, parseSessionTranscriptMemoryHitKey, resolveSessionTranscriptMemoryHitKeyToSessionKeys, type ResolveSessionTranscriptMemoryHitKeyParams, type SessionTranscriptIdentity, type SessionTranscriptMemoryHitIdentity, type SessionTranscriptMemoryHitKey, type SessionTranscriptMemoryHitKeyParams, type SessionTranscriptReadParams } from "./session-transcript-memory-hit.js";
export { formatSessionTranscriptMemoryHitKey, parseSessionTranscriptMemoryHitKey, resolveSessionTranscriptMemoryHitKeyToSessionKeys, };
export type { ResolveSessionTranscriptMemoryHitKeyParams, SessionTranscriptIdentity, SessionTranscriptMemoryHitIdentity, SessionTranscriptMemoryHitKey, SessionTranscriptMemoryHitKeyParams, SessionTranscriptReadParams, };
export type SessionTranscriptEvent = unknown;
export type SessionTranscriptTargetParams = SessionTranscriptReadParams & {
    /**
     * @deprecated Prefer `{ agentId, sessionKey, sessionId }`. Pass this only
     * when adapting code that already receives an active transcript artifact and
     * needs each helper to operate on that same artifact.
     */
    sessionFile?: string;
};
export type SessionTranscriptTarget = SessionTranscriptIdentity & {
    targetKind: "active-session-file" | "runtime-session";
};
export type SessionTranscriptLegacyFileTarget = SessionTranscriptTarget & {
    /**
     * Deprecated transitional file target for callers that still pass active
     * transcript files to plugin command handlers.
     */
    sessionFile: string;
};
export type SessionTranscriptAppendMessageParams<TMessage> = SessionTranscriptTargetParams & TranscriptMessageAppendOptions<TMessage>;
export type SessionTranscriptAssistantMirrorAppendParams = SessionTranscriptReadParams & {
    config?: OpenClawConfig;
    deliveryMirror?: SessionTranscriptDeliveryMirror;
    idempotencyKey?: string;
    mediaUrls?: string[];
    text?: string;
    updateMode?: SessionTranscriptUpdateMode;
};
export type SessionTranscriptWriteLockParams = SessionTranscriptTargetParams & {
    config?: TranscriptMessageAppendOptions<unknown>["config"];
};
export type SessionTranscriptWriteLockContext = {
    appendMessage: <TMessage>(options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">) => Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
    publishUpdate: (update?: TranscriptUpdatePayload) => Promise<void>;
    readEvents: () => Promise<SessionTranscriptEvent[]>;
    target: SessionTranscriptTarget;
};
/**
 * Resolves the public identity for a transcript without returning its file path.
 */
export declare function resolveSessionTranscriptIdentity(params: SessionTranscriptReadParams): Promise<SessionTranscriptIdentity>;
/**
 * Resolves the public target for transcript operations without exposing the
 * current storage path as identity.
 */
export declare function resolveSessionTranscriptTarget(params: SessionTranscriptTargetParams): Promise<SessionTranscriptTarget>;
/**
 * Resolves and persists the current file-backed target for legacy plugin
 * command calls that still require `sessionFile`.
 */
export declare function resolveSessionTranscriptLegacyFileTarget(params: SessionTranscriptTargetParams): Promise<SessionTranscriptLegacyFileTarget>;
/**
 * Reads transcript events by public session identity instead of file path.
 */
export declare function readSessionTranscriptEvents(params: SessionTranscriptTargetParams): Promise<SessionTranscriptEvent[]>;
/**
 * Reads the latest visible assistant text by scoped identity using the
 * bounded reverse transcript reader.
 */
export declare function readLatestAssistantTextByIdentity(params: SessionTranscriptTargetParams): Promise<LatestAssistantTranscriptText | undefined>;
/**
 * Appends a delivery-mirror assistant message through the guarded session
 * append facade.
 */
export declare function appendAssistantMirrorMessageByIdentity(params: SessionTranscriptAssistantMirrorAppendParams): Promise<SessionTranscriptAppendResult>;
/**
 * Appends a transcript message by scoped transcript target.
 */
export declare function appendSessionTranscriptMessageByIdentity<TMessage>(params: SessionTranscriptAppendMessageParams<TMessage>): Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
/**
 * Publishes a transcript update by scoped transcript target.
 */
export declare function publishSessionTranscriptUpdateByIdentity(params: SessionTranscriptTargetParams & {
    update?: TranscriptUpdatePayload;
}): Promise<void>;
/**
 * Runs transcript work under the write lock for the resolved scoped target.
 */
export declare function withSessionTranscriptWriteLock<T>(params: SessionTranscriptWriteLockParams, run: (context: SessionTranscriptWriteLockContext) => Promise<T> | T): Promise<T>;
