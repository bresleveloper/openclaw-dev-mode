import { type ChannelRouteRef } from "../plugin-sdk/channel-route.js";
import type { DeliveryContext, DeliveryContextSessionSource } from "./delivery-context.types.js";
export type { DeliveryContext, DeliveryContextSessionSource } from "./delivery-context.types.js";
/**
 * Delivery-context normalization and projection helpers.
 *
 * Sessions still carry route metadata plus older `last*` fields; this module
 * keeps those shapes converged on the canonical SDK channel-route contract.
 */
/** Normalizes a delivery context into canonical channel route fields, dropping invalid routes. */
export declare function normalizeDeliveryContext(context?: DeliveryContext): DeliveryContext | undefined;
/** Normalizes an unknown channel route payload from persisted session/plugin metadata. */
export declare function normalizeDeliveryChannelRoute(route?: unknown): ChannelRouteRef | undefined;
/** Converts a normalized channel route reference into a delivery context. */
export declare function deliveryContextFromChannelRoute(route?: ChannelRouteRef): DeliveryContext | undefined;
/** Converts delivery context fields into the SDK channel route reference shape. */
export declare function channelRouteFromDeliveryContext(context?: DeliveryContext): ChannelRouteRef | undefined;
/** Reconciles legacy session delivery fields, route metadata, and explicit delivery context. */
export declare function normalizeSessionDeliveryFields(source?: DeliveryContextSessionSource): {
    route?: ChannelRouteRef;
    deliveryContext?: DeliveryContext;
    lastChannel?: string;
    lastTo?: string;
    lastAccountId?: string;
    lastThreadId?: string | number;
};
/** Derives the best delivery context from current and legacy session fields. */
export declare function deliveryContextFromSession(entry?: DeliveryContextSessionSource): DeliveryContext | undefined;
/** Merges delivery contexts without mixing target/account/thread fields across channels. */
export declare function mergeDeliveryContext(primary?: DeliveryContext, fallback?: DeliveryContext): DeliveryContext | undefined;
/** Builds a compact stable key for a routable delivery context. */
export declare function deliveryContextKey(context?: DeliveryContext): string | undefined;
