import { gt as ReplyDispatchKind } from "./hook-runner-global-D5VgWbSn.js";
//#region src/channels/turn/dispatch-result.d.ts
/** Minimal dispatch result shape needed to count visible channel deliveries. */
type ChannelTurnDispatchResultLike = {
  queuedFinal?: boolean;
  counts?: Partial<Record<ReplyDispatchKind, number>>;
  settledReceipt?: {
    anyVisibleDelivered: boolean;
    counts: Partial<Record<ReplyDispatchKind, {
      delivered: number;
      failedAfterSend: number;
    }>>;
  };
  observedReplyDelivery?: boolean;
  deferredToActiveRun?: "steer" | "followup";
} | null | undefined;
/** Extra delivery signals observed outside the normal dispatch count payload. */
type ChannelTurnVisibleDeliverySignals = {
  observedReplyDelivery?: boolean;
  fallbackDelivered?: boolean;
  deliverySummaryDelivered?: boolean;
};
type FinalDeliverySignals = Pick<ChannelTurnVisibleDeliverySignals, "fallbackDelivered" | "deliverySummaryDelivered">;
declare function resolveChannelTurnDispatchCounts(result: ChannelTurnDispatchResultLike): {
  tool: number;
  block: number;
  final: number;
};
declare function hasVisibleChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: ChannelTurnVisibleDeliverySignals): boolean;
declare function hasFinalChannelTurnDispatch(result: ChannelTurnDispatchResultLike, signals?: FinalDeliverySignals): boolean;
//#endregion
export { hasVisibleChannelTurnDispatch as n, resolveChannelTurnDispatchCounts as r, hasFinalChannelTurnDispatch as t };