/**
 * Dynamic bag of per-channel send functions, keyed by channel ID.
 * Each outbound adapter resolves its own function from this record and
 * falls back to a direct import when the key is absent.
 */
export type OutboundSendDeps = {
    [channelId: string]: unknown;
};
/**
 * Builds historical dependency keys for channel send functions.
 */
export declare function resolveLegacyOutboundSendDepKeys(channelId: string): string[];
/**
 * Extra historical keys to try after the normalized channel-derived keys.
 */
export type ResolveOutboundSendDepOptions = {
    legacyKeys?: readonly string[];
};
/**
 * Resolves a channel send dependency from modern channel IDs or legacy helper keys.
 */
export declare function resolveOutboundSendDep<T>(deps: OutboundSendDeps | null | undefined, channelId: string, options?: ResolveOutboundSendDepOptions): T | undefined;
