import { S as MessageReceipt } from "./types-DOAIO5Ze.js";
import { a as OutboundPayloadDeliverySuppressionReason, n as OutboundDeliveryQueuePolicy } from "./deliver-types-CDKM8xJ_.js";
//#region src/channels/turn/delivery-outcome.d.ts
/** Provider-visible delivery facts shared by channel turns and outbound entrypoints. */
type ChannelDeliveryOutcome = {
  messageIds?: string[];
  receipt?: MessageReceipt;
  threadId?: string;
  replyToId?: string;
  visibleReplySent?: boolean;
  /** Final provider-visible text used for this logical payload's terminal observation. */
  content?: string;
};
/** Durable delivery queue intent recorded when a reply is deferred. */
type ChannelDeliveryIntent = {
  id: string;
  kind: "outbound_queue";
  queuePolicy: OutboundDeliveryQueuePolicy;
};
/** Result returned after delivering one channel reply payload. */
type ChannelDeliveryResult = ChannelDeliveryOutcome & {
  deliveryIntent?: ChannelDeliveryIntent;
  /** Intentional no-send outcome after payload policy or modifying hooks settle. */
  suppression?: {
    reason: OutboundPayloadDeliverySuppressionReason | "channel_transform" | "no_visible_result";
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
  /** Same-payload native settlement; resolved fields override this result before observation. */
  finalization?: Promise<ChannelDeliveryOutcome>;
};
//#endregion
export { ChannelDeliveryResult as n, ChannelDeliveryOutcome as t };