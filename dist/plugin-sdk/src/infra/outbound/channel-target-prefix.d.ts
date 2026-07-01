/** Removes a selected channel/provider prefix from an outbound target string. */
export declare function stripTargetProviderPrefix(raw: string, ...providers: string[]): string;
/** Removes generic target-kind prefixes such as room:, thread:, or user:. */
export declare function stripTargetKindPrefix(raw: string, kinds?: readonly string[]): string;
/** Strips plugin topic suffixes while preserving ordinary colon-containing targets. */
export declare function stripTargetTopicSuffix(raw: string, options?: {
    allowNumericShorthand?: boolean;
}): string;
/** Parsed provider prefix and the channel that owns it. */
export type ChannelTargetProviderPrefix = {
    prefix: string;
    channel: string;
};
/** Resolves the channel implied by a plugin-owned target prefix, if any. */
export declare function resolveTargetPrefixedChannel(raw?: string | null): string | undefined;
/** Rejects targets whose plugin-owned prefix belongs to a different selected channel. */
export declare function validateTargetProviderPrefix(params: {
    channel: string;
    to?: string | null;
}): Error | undefined;
