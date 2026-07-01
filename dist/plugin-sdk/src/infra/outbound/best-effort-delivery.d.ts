/** Optional external destination for best-effort delivery from session-only flows. */
export type ExternalBestEffortDeliveryTarget = {
    deliver: boolean;
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string;
};
/** Normalizes an optional best-effort destination into a deliver/no-deliver decision. */
export declare function resolveExternalBestEffortDeliveryTarget(params: {
    channel?: string | null;
    to?: string | null;
    accountId?: string | null;
    threadId?: string | number | null;
}): ExternalBestEffortDeliveryTarget;
/** Detects best-effort sends that should stay session-only on the internal channel. */
export declare function shouldDowngradeDeliveryToSessionOnly(params: {
    wantsDelivery: boolean;
    bestEffortDeliver: boolean;
    resolvedChannel: string;
}): boolean;
