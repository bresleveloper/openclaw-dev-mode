/**
 * Live channel message state and preview finalization helpers.
 *
 * Tracks draft previews and converts them into finalized message receipts when possible.
 */
import type { LiveMessageState, MessageReceipt, RenderedMessageBatch } from "./types.js";
export type { LiveMessagePhase, LiveMessageState } from "./types.js";
/** Mutable draft preview handle used before a live message is finalized or discarded. */
export type LivePreviewFinalizerDraft<TId> = {
    flush: () => Promise<void>;
    id: () => TId | undefined;
    seal?: () => Promise<void>;
    discardPending?: () => Promise<void>;
    clear: () => Promise<void>;
};
/** Outcome kind returned after attempting to finalize or fall back from a live preview. */
export type LivePreviewFinalizerResultKind = "normal-delivered" | "normal-skipped" | "preview-finalized" | "preview-retained";
/** Result of a live preview finalization attempt plus the latest live state. */
export type LivePreviewFinalizerResult<TPayload> = {
    kind: LivePreviewFinalizerResultKind;
    liveState?: LiveMessageState<TPayload>;
};
/** Adapter contract for channels that can edit a draft preview into the final message. */
export type FinalizableLivePreviewAdapter<TPayload, TId, TEdit> = {
    draft?: LivePreviewFinalizerDraft<TId>;
    buildFinalEdit: (payload: TPayload) => TEdit | undefined;
    editFinal: (id: TId, edit: TEdit) => Promise<void>;
    resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
    createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
    onPreviewFinalized?: (id: TId, receipt: MessageReceipt, liveState: LiveMessageState<TPayload>) => Promise<void> | void;
    buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
    deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
    handlePreviewEditError?: (params: {
        error: unknown;
        id: TId;
        edit: TEdit;
        payload: TPayload;
        liveState: LiveMessageState<TPayload>;
    }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
    logPreviewEditFailure?: (error: unknown) => void;
};
/** Defines a finalizable live-preview adapter while preserving its generic payload/id/edit types. */
export declare function defineFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(adapter: FinalizableLivePreviewAdapter<TPayload, TId, TEdit>): FinalizableLivePreviewAdapter<TPayload, TId, TEdit>;
/** Creates the initial live-message state, optionally seeded with an existing preview receipt. */
export declare function createLiveMessageState<TPayload = unknown>(params?: {
    receipt?: MessageReceipt;
    lastRendered?: RenderedMessageBatch<TPayload>;
    canFinalizeInPlace?: boolean;
}): LiveMessageState<TPayload>;
/** Marks a live message as finalized and disables further in-place preview edits. */
export declare function markLiveMessageFinalized<TPayload>(state: LiveMessageState<TPayload>, receipt: MessageReceipt): LiveMessageState<TPayload>;
/** Creates a receipt for a draft/preview platform message. */
export declare function createPreviewMessageReceipt(params: {
    id: unknown;
    threadId?: string;
    replyToId?: string;
    sentAt?: number;
    raw?: unknown;
}): MessageReceipt;
/** Finalizes a live preview in place when possible, otherwise falls back to normal delivery. */
export declare function deliverFinalizableLivePreview<TPayload, TId, TEdit>(params: {
    kind: "tool" | "block" | "final";
    payload: TPayload;
    liveState?: LiveMessageState<TPayload>;
    draft?: LivePreviewFinalizerDraft<TId>;
    buildFinalEdit: (payload: TPayload) => TEdit | undefined;
    editFinal: (id: TId, edit: TEdit) => Promise<void>;
    resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
    deliverNormally: (payload: TPayload) => Promise<boolean | void>;
    createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
    onPreviewFinalized?: (id: TId, receipt: MessageReceipt, liveState: LiveMessageState<TPayload>) => Promise<void> | void;
    buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
    deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
    handlePreviewEditError?: (params: {
        error: unknown;
        id: TId;
        edit: TEdit;
        payload: TPayload;
        liveState: LiveMessageState<TPayload>;
    }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
    onNormalDelivered?: () => Promise<void> | void;
    logPreviewEditFailure?: (error: unknown) => void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
/** Runs live-preview finalization through an optional adapter, falling back to normal delivery. */
export declare function deliverWithFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(params: {
    kind: "tool" | "block" | "final";
    payload: TPayload;
    liveState?: LiveMessageState<TPayload>;
    adapter?: FinalizableLivePreviewAdapter<TPayload, TId, TEdit>;
    deliverNormally: (payload: TPayload) => Promise<boolean | void>;
    onNormalDelivered?: () => Promise<void> | void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
/** Records the latest rendered preview batch and moves the live message into previewing state. */
export declare function markLiveMessagePreviewUpdated<TPayload>(state: LiveMessageState<TPayload>, rendered: RenderedMessageBatch<TPayload>): LiveMessageState<TPayload>;
/** Marks a live message cancelled and prevents later in-place finalization. */
export declare function markLiveMessageCancelled<TPayload>(state: LiveMessageState<TPayload>): LiveMessageState<TPayload>;
