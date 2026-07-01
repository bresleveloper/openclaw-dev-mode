import type { OpenClawConfig } from "../types.openclaw.js";
/**
 * Extracts the routable delivery context and thread id for a persisted session key.
 *
 * Thread/topic keys first try their exact store entry, then fall back to the base session when
 * the thread entry has no delivery route of its own.
 */
export declare function extractDeliveryInfo(sessionKey: string | undefined, options?: {
    cfg?: OpenClawConfig;
}): {
    deliveryContext: {
        channel?: string;
        to?: string;
        accountId?: string;
        threadId?: string | number;
    } | undefined;
    threadId: string | undefined;
};
