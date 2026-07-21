import { i as OpenClawConfig } from "../types.openclaw-B5gtuEn_.js";
import { a as SessionTranscriptUpdateMode, c as TranscriptMessageAppendOptions, i as SessionTranscriptDeliveryMirror, l as TranscriptMessageAppendResult, r as SessionTranscriptAppendResult, t as LatestAssistantTranscriptText, u as TranscriptUpdatePayload } from "../transcript-l0v6jqqh.js";
import { a as SessionTranscriptMemoryHitKeyParams, c as parseSessionTranscriptMemoryHitKey, i as SessionTranscriptMemoryHitKey, l as resolveSessionTranscriptMemoryHitKeyToSessionKeys, n as SessionTranscriptIdentity, o as SessionTranscriptReadParams, r as SessionTranscriptMemoryHitIdentity, s as formatSessionTranscriptMemoryHitKey, t as ResolveSessionTranscriptMemoryHitKeyParams } from "../session-transcript-memory-hit-2aTPySZ8.js";

//#region src/plugin-sdk/session-transcript-runtime.d.ts
type SessionTranscriptEvent = unknown;
type SessionTranscriptTargetParams = SessionTranscriptReadParams & {
  /**
   * @deprecated Prefer `{ agentId, sessionKey, sessionId }`. Pass this only
   * when adapting code that already receives an active transcript artifact and
   * needs each helper to operate on that same artifact.
   */
  sessionFile?: string;
};
type SessionTranscriptTarget = SessionTranscriptIdentity & {
  targetKind: "active-session-file" | "runtime-session";
};
/**
 * @deprecated Use SessionTranscriptTarget with `{ agentId, sessionKey,
 * sessionId }`. Active transcript file targets are transitional only and will
 * be removed with the SQLite session/transcript storage flip.
 */
type SessionTranscriptLegacyFileTarget = SessionTranscriptTarget & {
  /** Deprecated transitional file path for active transcript artifact callers. */sessionFile: string;
};
type SessionTranscriptAppendMessageParams<TMessage> = SessionTranscriptTargetParams & TranscriptMessageAppendOptions<TMessage>;
type SessionTranscriptAssistantMirrorAppendParams = SessionTranscriptReadParams & {
  config?: OpenClawConfig;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
  idempotencyKey?: string;
  mediaUrls?: string[];
  text?: string;
  updateMode?: SessionTranscriptUpdateMode;
};
type SessionTranscriptWriteLockParams = SessionTranscriptTargetParams & {
  config?: TranscriptMessageAppendOptions<unknown>["config"];
};
type SessionTranscriptWriteLockContext = {
  appendMessage: <TMessage>(options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">) => Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
  publishUpdate: (update?: TranscriptUpdatePayload) => Promise<void>;
  readEvents: () => Promise<SessionTranscriptEvent[]>;
  target: SessionTranscriptTarget;
};
/**
 * Resolves the public identity for a transcript without returning its file path.
 */
declare function resolveSessionTranscriptIdentity(params: SessionTranscriptReadParams): Promise<SessionTranscriptIdentity>;
/**
 * Resolves the public target for transcript operations without exposing the
 * current storage path as identity.
 */
declare function resolveSessionTranscriptTarget(params: SessionTranscriptTargetParams): Promise<SessionTranscriptTarget>;
/**
 * @deprecated Use resolveSessionTranscriptTarget with `{ agentId, sessionKey,
 * sessionId }`. This persists an active transcript file target only for legacy
 * plugin command calls that still require `sessionFile`.
 */
declare function resolveSessionTranscriptLegacyFileTarget(params: SessionTranscriptTargetParams): Promise<SessionTranscriptLegacyFileTarget>;
/**
 * Reads transcript events by public session identity instead of file path.
 */
declare function readSessionTranscriptEvents(params: SessionTranscriptTargetParams): Promise<SessionTranscriptEvent[]>;
/**
 * Reads the latest visible assistant text by scoped identity using the
 * bounded reverse transcript reader.
 */
declare function readLatestAssistantTextByIdentity(params: SessionTranscriptTargetParams): Promise<LatestAssistantTranscriptText | undefined>;
/**
 * Appends a delivery-mirror assistant message through the guarded session
 * append facade.
 */
declare function appendAssistantMirrorMessageByIdentity(params: SessionTranscriptAssistantMirrorAppendParams): Promise<SessionTranscriptAppendResult>;
/**
 * Appends a transcript message by scoped transcript target.
 */
declare function appendSessionTranscriptMessageByIdentity<TMessage>(params: SessionTranscriptAppendMessageParams<TMessage>): Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
/**
 * Publishes a transcript update by scoped transcript target.
 */
declare function publishSessionTranscriptUpdateByIdentity(params: SessionTranscriptTargetParams & {
  update?: TranscriptUpdatePayload;
}): Promise<void>;
/**
 * Runs transcript work under the write lock for the resolved scoped target.
 */
declare function withSessionTranscriptWriteLock<T>(params: SessionTranscriptWriteLockParams, run: (context: SessionTranscriptWriteLockContext) => Promise<T> | T): Promise<T>;
//#endregion
export { type ResolveSessionTranscriptMemoryHitKeyParams, SessionTranscriptAppendMessageParams, SessionTranscriptAssistantMirrorAppendParams, SessionTranscriptEvent, type SessionTranscriptIdentity, SessionTranscriptLegacyFileTarget, type SessionTranscriptMemoryHitIdentity, type SessionTranscriptMemoryHitKey, type SessionTranscriptMemoryHitKeyParams, type SessionTranscriptReadParams, SessionTranscriptTarget, SessionTranscriptTargetParams, SessionTranscriptWriteLockContext, SessionTranscriptWriteLockParams, appendAssistantMirrorMessageByIdentity, appendSessionTranscriptMessageByIdentity, formatSessionTranscriptMemoryHitKey, parseSessionTranscriptMemoryHitKey, publishSessionTranscriptUpdateByIdentity, readLatestAssistantTextByIdentity, readSessionTranscriptEvents, resolveSessionTranscriptIdentity, resolveSessionTranscriptLegacyFileTarget, resolveSessionTranscriptMemoryHitKeyToSessionKeys, resolveSessionTranscriptTarget, withSessionTranscriptWriteLock };