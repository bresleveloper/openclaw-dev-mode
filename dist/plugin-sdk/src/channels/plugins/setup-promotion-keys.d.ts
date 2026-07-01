/**
 * Returns whether a config key is part of the channel-agnostic promotion set.
 */
export declare function isCommonSingleAccountPromotionKey(key: string): boolean;
/**
 * Returns whether a config key can be promoted by setup migration flows.
 */
export declare function isSetupSingleAccountPromotionKey(key: string): boolean;
/**
 * Lists root-level channel keys that could be promoted into account config.
 */
export declare function collectSingleAccountPromotionEntries(channel: Record<string, unknown>): {
    entries: string[];
    hasNamedAccounts: boolean;
};
