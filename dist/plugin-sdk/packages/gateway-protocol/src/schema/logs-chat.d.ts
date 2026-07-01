import type { Static } from "typebox";
import { Type } from "typebox";
/** Cursor-based request for the gateway log tail endpoint. */
export declare const LogsTailParamsSchema: Type.TObject<{
    cursor: Type.TOptional<Type.TInteger>;
    limit: Type.TOptional<Type.TInteger>;
    maxBytes: Type.TOptional<Type.TInteger>;
}>;
/** Gateway log tail payload returned to dashboard clients. */
export declare const LogsTailResultSchema: Type.TObject<{
    file: Type.TString;
    cursor: Type.TInteger;
    size: Type.TInteger;
    lines: Type.TArray<Type.TString>;
    truncated: Type.TOptional<Type.TBoolean>;
    reset: Type.TOptional<Type.TBoolean>;
}>;
/** Session-scoped history request used by WebChat and native WebSocket clients. */
export declare const ChatHistoryParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    limit: Type.TOptional<Type.TInteger>;
    maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
export declare const ChatMetadataParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
}>;
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
export declare const ChatMessageGetParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    messageId: Type.TString;
    maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Result envelope for single-message lookup, including the stable miss/visibility reason. */
export declare const ChatMessageGetResultSchema: Type.TObject<{
    ok: Type.TBoolean;
    message: Type.TOptional<Type.TUnknown>;
    unavailableReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"not_found">, Type.TLiteral<"oversized">, Type.TLiteral<"not_visible">]>>;
}>;
/** Typed result shape for callers that branch on message availability. */
export type ChatMessageGetResult = Static<typeof ChatMessageGetResultSchema>;
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
export declare const ChatSendParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    sessionId: Type.TOptional<Type.TString>;
    message: Type.TString;
    thinking: Type.TOptional<Type.TString>;
    fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
    fastAutoOnSeconds: Type.TOptional<Type.TInteger>;
    deliver: Type.TOptional<Type.TBoolean>;
    originatingChannel: Type.TOptional<Type.TString>;
    originatingTo: Type.TOptional<Type.TString>;
    originatingAccountId: Type.TOptional<Type.TString>;
    originatingThreadId: Type.TOptional<Type.TString>;
    attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    systemInputProvenance: Type.TOptional<Type.TObject<{
        kind: Type.TString;
        originSessionId: Type.TOptional<Type.TString>;
        sourceSessionKey: Type.TOptional<Type.TString>;
        sourceChannel: Type.TOptional<Type.TString>;
        sourceTool: Type.TOptional<Type.TString>;
    }>>;
    systemProvenanceReceipt: Type.TOptional<Type.TString>;
    suppressCommandInterpretation: Type.TOptional<Type.TBoolean>;
    idempotencyKey: Type.TString;
}>;
/** Cancels the active or named run for a chat session. */
export declare const ChatAbortParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
}>;
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
export declare const ChatInjectParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    message: Type.TString;
    label: Type.TOptional<Type.TString>;
}>;
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
export declare const ChatDeltaEventSchema: Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"delta">;
    message: Type.TOptional<Type.TUnknown>;
    deltaText: Type.TString;
    replace: Type.TOptional<Type.TBoolean>;
    usage: Type.TOptional<Type.TUnknown>;
}>;
/** Successful terminal event for a completed chat run. */
export declare const ChatFinalEventSchema: Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"final">;
    message: Type.TOptional<Type.TUnknown>;
    usage: Type.TOptional<Type.TUnknown>;
    stopReason: Type.TOptional<Type.TString>;
}>;
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
export declare const ChatAbortedEventSchema: Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"aborted">;
    message: Type.TOptional<Type.TUnknown>;
    stopReason: Type.TOptional<Type.TString>;
}>;
/** Terminal event for failed chat runs with an optional normalized failure kind. */
export declare const ChatErrorEventSchema: Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"error">;
    message: Type.TOptional<Type.TUnknown>;
    errorMessage: Type.TOptional<Type.TString>;
    errorKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"refusal">, Type.TLiteral<"timeout">, Type.TLiteral<"rate_limit">, Type.TLiteral<"context_length">, Type.TLiteral<"unknown">]>>;
    usage: Type.TOptional<Type.TUnknown>;
    stopReason: Type.TOptional<Type.TString>;
}>;
/** Public chat stream event union consumed by gateway protocol validators. */
export declare const ChatEventSchema: Type.TUnion<[Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"delta">;
    message: Type.TOptional<Type.TUnknown>;
    deltaText: Type.TString;
    replace: Type.TOptional<Type.TBoolean>;
    usage: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"final">;
    message: Type.TOptional<Type.TUnknown>;
    usage: Type.TOptional<Type.TUnknown>;
    stopReason: Type.TOptional<Type.TString>;
}>, Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"aborted">;
    message: Type.TOptional<Type.TUnknown>;
    stopReason: Type.TOptional<Type.TString>;
}>, Type.TObject<{
    runId: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    seq: Type.TInteger;
    state: Type.TLiteral<"error">;
    message: Type.TOptional<Type.TUnknown>;
    errorMessage: Type.TOptional<Type.TString>;
    errorKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"refusal">, Type.TLiteral<"timeout">, Type.TLiteral<"rate_limit">, Type.TLiteral<"context_length">, Type.TLiteral<"unknown">]>>;
    usage: Type.TOptional<Type.TUnknown>;
    stopReason: Type.TOptional<Type.TString>;
}>]>;
