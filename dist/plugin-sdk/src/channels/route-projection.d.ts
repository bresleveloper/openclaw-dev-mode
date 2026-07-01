import type { ConversationRef, SessionBindingRecord } from "../infra/outbound/session-binding-service.js";
import { type ChannelRouteRef } from "../plugin-sdk/channel-route.js";
import { type ConversationTargetParams } from "../utils/conversation-target.js";
import { type DeliveryContext } from "../utils/delivery-context.shared.js";
/** Formats a conversation id into a deliverable target, using channel hooks before generic fallback. */
export declare function formatConversationTarget(params: ConversationTargetParams): string | undefined;
/** Resolves a channel conversation into target/thread fields for delivery routing. */
export declare function resolveConversationDeliveryTarget(params: ConversationTargetParams): {
    to?: string;
    threadId?: string;
};
/** Converts a persisted conversation reference into a channel route. */
export declare function routeFromConversationRef(conversation?: ConversationRef | null): ChannelRouteRef | undefined;
/** Extracts a channel route from a session binding record. */
export declare function routeFromBindingRecord(binding?: SessionBindingRecord | null): ChannelRouteRef | undefined;
/** Projects route fields used by older session and delivery callers. */
export declare function routeToDeliveryFields(route?: ChannelRouteRef): {
    deliveryContext?: DeliveryContext;
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
};
