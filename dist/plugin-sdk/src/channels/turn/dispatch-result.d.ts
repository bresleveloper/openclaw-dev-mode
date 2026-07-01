import type { ReplyDispatchKind } from "../../auto-reply/reply/reply-dispatcher.types.js";
/** Minimal dispatch result shape needed to count visible channel deliveries. */
export type ChannelTurnDispatchResultLike = {
    queuedFinal?: boolean;
    counts?: Partial<Record<ReplyDispatchKind, number>>;
    observedReplyDelivery?: boolean;
} | null | undefined;
/** Extra delivery signals observed outside the normal dispatch count payload. */
export type ChannelTurnVisibleDeliverySignals = {
    observedReplyDelivery?: boolean;
    fallbackDelivered?: boolean;
    deliverySummaryDelivered?: boolean;
};
/** Zero-filled reply dispatch count map used before merging optional provider counts. */
export declare const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS: Record<ReplyDispatchKind, number>;
/** Resolves dispatch counts with missing reply kinds filled as zero. */
export declare function resolveChannelTurnDispatchCounts(result: ChannelTurnDispatchResultLike): Record<ReplyDispatchKind, number>;
/** Returns whether a turn produced any visible reply delivery signal. */
export declare function hasVisibleChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: ChannelTurnVisibleDeliverySignals): boolean;
/** Returns whether a turn produced a final reply, fallback, summary, or queued final payload. */
export declare function hasFinalChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: Pick<ChannelTurnVisibleDeliverySignals, "fallbackDelivered" | "deliverySummaryDelivered">): boolean;
