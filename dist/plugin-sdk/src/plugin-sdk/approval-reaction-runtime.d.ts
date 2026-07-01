import type { ApprovalRequest, PendingApprovalView } from "../infra/approval-view-model.types.js";
import { type ExecApprovalReplyDecision } from "../infra/exec-approval-reply.js";
export { shouldSuppressLocalNativeExecApprovalPrompt } from "./approval-native-helpers.js";
import type { ReplyPayload } from "./reply-payload.js";
type ApprovalKind = "exec" | "plugin";
type KeyedStore<TValue> = {
    register(key: string, value: TValue, opts?: {
        ttlMs?: number;
    }): Promise<void>;
    lookup(key: string): Promise<TValue | undefined>;
    delete(key: string): Promise<boolean>;
};
type PersistedApprovalReactionTarget<TTarget> = {
    version: 1;
    target: TTarget;
};
/** In-memory or backed store for approval targets awaiting reaction decisions. */
export type ApprovalReactionTargetStore<TTarget> = {
    register(key: string, target: TTarget, opts?: {
        ttlMs?: number;
    }): void;
    lookup(key: string): Promise<TTarget | null>;
    delete(key: string): void;
    clearForTest(): void;
};
/** Product-ordered emoji binding for one approval decision. */
export type ApprovalReactionDecisionBinding = {
    decision: ExecApprovalReplyDecision;
    emoji: string;
    label: string;
};
/** Normalized reaction decision resolved from a channel reaction key. */
export type ApprovalReactionDecisionResolution = {
    decision: ExecApprovalReplyDecision;
    normalizedEmoji: string;
};
/** Stored target metadata needed to convert a reaction into an approval decision. */
export type ApprovalReactionTargetRecord<TRoute = unknown> = {
    approvalId: string;
    approvalKind?: ApprovalKind;
    allowedDecisions: readonly ExecApprovalReplyDecision[];
    route?: TRoute;
    expiresAtMs?: number;
};
/** Resolved approval target and decision produced from a reaction event. */
export type ApprovalReactionTargetResolution<TRoute = unknown> = ApprovalReactionDecisionResolution & {
    approvalId: string;
    approvalKind: ApprovalKind;
    route?: TRoute;
};
/** Reply payload enriched with reaction decision metadata. */
export type ApprovalReactionPromptPayload = ReplyPayload & {
    allowedDecisions: readonly ExecApprovalReplyDecision[];
    reactionBindings: readonly ApprovalReactionDecisionBinding[];
};
/** Pair of reaction-enabled and manual-fallback approval prompt payloads. */
export type ApprovalReactionPendingContent = {
    reactionPayload: ApprovalReactionPromptPayload;
    manualFallbackPayload: ReplyPayload;
};
/** Canonical reaction controls shown for approval prompts, in product display order. */
export declare const APPROVAL_REACTION_BINDINGS: readonly [{
    readonly decision: "allow-once";
    readonly emoji: "👍";
    readonly label: "Allow Once";
}, {
    readonly decision: "allow-always";
    readonly emoji: "♾️";
    readonly label: "Allow Always";
}, {
    readonly decision: "deny";
    readonly emoji: "👎";
    readonly label: "Deny";
}];
/** List the canonical reaction bindings allowed for a specific approval request. */
export declare function listApprovalReactionBindings(params: {
    allowedDecisions: readonly ExecApprovalReplyDecision[];
}): ApprovalReactionDecisionBinding[];
/** Build user-facing reaction instructions, or null when no reaction decisions are allowed. */
export declare function buildApprovalReactionHint(params: {
    allowedDecisions: readonly ExecApprovalReplyDecision[];
}): string | null;
/** Normalize reaction emoji so skin-tone and text/presentation variants match canonical bindings. */
export declare function normalizeApprovalReactionEmoji(reactionKey: string): string;
/** Resolve a reaction key to an allowed approval decision. */
export declare function resolveApprovalReactionDecision(params: {
    reactionKey: string;
    allowedDecisions: readonly ExecApprovalReplyDecision[];
}): ApprovalReactionDecisionResolution | null;
/** Resolve a stored target plus reaction key into an approval decision payload. */
export declare function resolveApprovalReactionTarget<TRoute = unknown>(params: {
    target: ApprovalReactionTargetRecord<TRoute> | null | undefined;
    reactionKey: string;
}): ApprovalReactionTargetResolution<TRoute> | null;
/** Build an approval prompt payload with reaction bindings for a prepared view. */
export declare function buildApprovalPendingPromptPayload(params: {
    request: ApprovalRequest;
    view: PendingApprovalView;
    nowMs: number;
}): ApprovalReactionPromptPayload;
/** Build an approval prompt payload with reaction bindings directly from a request. */
export declare function buildApprovalReactionPromptPayloadForRequest(params: {
    request: ApprovalRequest;
    nowMs: number;
}): ApprovalReactionPromptPayload;
/** Build reaction and manual-fallback pending approval content for a prepared view. */
export declare function buildApprovalReactionPendingContent(params: {
    request: ApprovalRequest;
    view: PendingApprovalView;
    nowMs: number;
}): ApprovalReactionPendingContent;
/** Build reaction and manual-fallback pending approval content directly from a request. */
export declare function buildApprovalReactionPendingContentForRequest(params: {
    request: ApprovalRequest;
    nowMs: number;
}): ApprovalReactionPendingContent;
/** Create an approval target store backed by memory with optional persistent storage. */
export declare function createApprovalReactionTargetStore<TTarget>(params: {
    namespace: string;
    maxEntries: number;
    defaultTtlMs: number;
    openStore?: (params: {
        namespace: string;
        maxEntries: number;
        defaultTtlMs: number;
    }) => KeyedStore<PersistedApprovalReactionTarget<TTarget>> | undefined;
    logPersistentError?: (error: unknown) => void;
    readPersistedTarget?: (target: unknown) => TTarget | null;
    nowMs?: () => number;
}): ApprovalReactionTargetStore<TTarget>;
