import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
//#region src/sessions/transcript-events.d.ts
/** Storage-neutral identity for the session transcript that changed. */
type SessionTranscriptUpdateTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
};
type SessionTranscriptUpdateFields = {
  sessionFile?: string;
  target?: SessionTranscriptUpdateTarget;
  sessionKey?: string;
  agentId?: string; /** @deprecated Pre-SQLite compatibility mirror. Prefer `target.sessionId`. */
  sessionId?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
};
/** Normalized transcript update emitted after a session transcript changes. */
type SessionTranscriptUpdate = SessionTranscriptUpdateFields & {
  /** @deprecated File-backed compatibility hint. Prefer `target` for identity. */sessionFile: string;
};
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Emits a normalized transcript update to all registered listeners. */
declare function emitSessionTranscriptUpdate(update: string | SessionTranscriptUpdate): void;
//#endregion
//#region src/config/sessions/session-accessor.d.ts
type TranscriptMessageAppendOptions<TMessage> = {
  /** Runtime config used for message redaction and transcript header metadata. */config?: OpenClawConfig; /** Working directory recorded in a newly created transcript header. */
  cwd?: string; /** How duplicate message idempotency keys are detected before append. */
  idempotencyLookup?: "scan" | "caller-checked"; /** Provider/channel message payload to persist. */
  message: TMessage; /** Testable timestamp override for the generated transcript entry. */
  now?: number; /** Optional finalizer that runs after duplicate detection but before persistence. */
  prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined; /** Allow append without parent-link migration for large legacy linear transcripts. */
  useRawWhenLinear?: boolean;
};
type TranscriptMessageAppendResult<TMessage> = {
  /** False when idempotency lookup found an existing transcript message. */appended: boolean; /** Redacted message payload as persisted or replayed from the transcript. */
  message: TMessage; /** Existing or newly generated transcript message id. */
  messageId: string;
};
/** Transcript update fields supplied by callers; sessionFile is resolved here. */
type TranscriptUpdatePayload = Omit<SessionTranscriptUpdate, "sessionFile">;
//#endregion
//#region src/config/sessions/transcript.d.ts
type SessionTranscriptAppendResult = {
  ok: true;
  sessionFile: string;
  messageId: string;
} | {
  ok: false;
  reason: string;
  code?: "blocked" | "session-rebound";
};
type SessionTranscriptUpdateMode = "inline" | "file-only" | "none";
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
};
type AssistantTranscriptText = {
  id?: string;
  text: string;
  timestamp?: number;
};
type SessionRecentConversationText = {
  id?: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
  sourceChannel?: string;
};
type ReadRecentSessionConversationTextOptions = {
  beforeTimestampMs?: number;
  limit?: number;
  minTimestampMs?: number;
};
type ReadRecentSessionConversationTextParams = ReadRecentSessionConversationTextOptions & {
  agentId?: string;
  sessionKey: string;
  storePath?: string;
};
type LatestAssistantTranscriptText = AssistantTranscriptText;
declare function readRecentUserAssistantTextForSession(params: ReadRecentSessionConversationTextParams): Promise<SessionRecentConversationText[]>;
declare function readLatestAssistantTextFromSessionTranscript(sessionFile: string | undefined): Promise<LatestAssistantTranscriptText | undefined>;
//#endregion
export { SessionTranscriptUpdateMode as a, TranscriptMessageAppendOptions as c, emitSessionTranscriptUpdate as d, onSessionTranscriptUpdate as f, SessionTranscriptDeliveryMirror as i, TranscriptMessageAppendResult as l, SessionRecentConversationText as n, readLatestAssistantTextFromSessionTranscript as o, SessionTranscriptAppendResult as r, readRecentUserAssistantTextForSession as s, LatestAssistantTranscriptText as t, TranscriptUpdatePayload as u };