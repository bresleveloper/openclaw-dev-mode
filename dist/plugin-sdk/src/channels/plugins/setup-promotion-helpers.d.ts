type ChannelSectionBase = {
    defaultAccount?: string;
    accounts?: Record<string, Record<string, unknown>>;
};
/**
 * Resolves all root-level keys eligible for single-account promotion.
 */
export declare function resolveSingleAccountKeysToMove(params: {
    channelKey: string;
    channel: Record<string, unknown>;
}): string[];
/**
 * Resolves the account id that should receive promoted single-account config.
 */
export declare function resolveSingleAccountPromotionTarget(params: {
    channelKey: string;
    channel: ChannelSectionBase;
}): string;
export {};
