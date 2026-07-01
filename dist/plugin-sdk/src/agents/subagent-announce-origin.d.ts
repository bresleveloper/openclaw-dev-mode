import type { DeliveryContext, DeliveryContextSessionSource } from "../utils/delivery-context.types.js";
export type { DeliveryContext } from "../utils/delivery-context.types.js";
/** Resolve the delivery origin for a subagent completion announcement. */
export declare function resolveAnnounceOrigin(entry?: DeliveryContextSessionSource, requesterOrigin?: DeliveryContext): DeliveryContext | undefined;
