import type { ReplyDispatchKind } from "../../auto-reply/reply/reply-dispatcher.types.js";
import type { ReplyPayload } from "../../auto-reply/types.js";
import type { RenderedMessageBatchPlanItem } from "../../channels/message/types.js";
import type { ReplyToMode } from "../../config/types.js";
import type { PluginHookReplyPayloadSendingContext } from "../../plugins/hook-types.js";
import type { OutboundDeliveryFormattingOptions } from "./formatting.js";
import type { OutboundIdentity } from "./identity.js";
import type { OutboundMirror } from "./mirror.js";
import type { OutboundSessionContext } from "./session-context.js";
import type { OutboundChannel } from "./targets.js";
export type QueuedRenderedMessageBatchPlan = {
    payloadCount: number;
    textCount: number;
    mediaCount: number;
    voiceCount: number;
    presentationCount: number;
    interactiveCount: number;
    channelDataCount: number;
    items: readonly RenderedMessageBatchPlanItem[];
};
export type QueuedReplyPayloadSendingHook = {
    kind: ReplyDispatchKind;
    channel?: string;
    sessionKey?: string;
    runId?: string;
    context: PluginHookReplyPayloadSendingContext;
};
export type QueuedDeliveryPayload = {
    channel: Exclude<OutboundChannel, "none">;
    to: string;
    accountId?: string;
    /**
     * Original payloads before plugin hooks. On recovery, hooks re-run on these
     * payloads — this is intentional since hooks are stateless transforms and
     * should produce the same result on replay.
     */
    payloads: ReplyPayload[];
    /** Replayable projection summary captured when the durable send intent is created. */
    renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
    threadId?: string | number | null;
    replyToId?: string | null;
    replyToMode?: ReplyToMode;
    formatting?: OutboundDeliveryFormattingOptions;
    identity?: OutboundIdentity;
    bestEffort?: boolean;
    gifPlayback?: boolean;
    forceDocument?: boolean;
    /** Replayable reply payload hook context for recovery and live delivery. */
    replyPayloadSendingHook?: QueuedReplyPayloadSendingHook;
    silent?: boolean;
    mirror?: OutboundMirror;
    /** Session context needed to preserve outbound media policy on recovery. */
    session?: OutboundSessionContext;
    /** Gateway caller scopes at enqueue time, preserved for recovery replay. */
    gatewayClientScopes?: readonly string[];
};
export interface QueuedDelivery extends QueuedDeliveryPayload {
    id: string;
    enqueuedAt: number;
    retryCount: number;
    lastAttemptAt?: number;
    lastError?: string;
    platformSendStartedAt?: number;
    recoveryState?: "send_attempt_started" | "unknown_after_send";
}
/** Persist a delivery entry before attempting send. Returns the entry ID. */
export declare function enqueueDelivery(params: QueuedDeliveryPayload, stateDir?: string): Promise<string>;
/** Remove a successfully delivered entry from the queue. */
export declare function ackDelivery(id: string, stateDir?: string): Promise<void>;
/** Update a queue entry after a failed delivery attempt. */
export declare function failDelivery(id: string, error: string, stateDir?: string): Promise<void>;
export declare function markDeliveryPlatformSendAttemptStarted(id: string, stateDir?: string): Promise<void>;
export declare function markDeliveryPlatformOutcomeUnknown(id: string, stateDir?: string): Promise<void>;
/** Load a single pending delivery entry by ID from the queue directory. */
export declare function loadPendingDelivery(id: string, stateDir?: string): Promise<QueuedDelivery | null>;
/** Load all pending delivery entries from the queue. */
export declare function loadPendingDeliveries(stateDir?: string): Promise<QueuedDelivery[]>;
/** Move a queue entry out of the pending retry set. */
export declare function moveToFailed(id: string, stateDir?: string): Promise<void>;
