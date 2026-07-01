import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/**
 * Normalizes raw user/channel target input before provider-specific parsing.
 */
export declare function normalizeChannelTargetInput(raw: string): string;
declare function resetTargetNormalizerCacheForTests(): void;
export declare const testing: {
    readonly resetTargetNormalizerCacheForTests: typeof resetTargetNormalizerCacheForTests;
};
/**
 * Applies a channel plugin normalizer and falls back to trimmed input.
 */
export declare function normalizeTargetForProvider(provider: string, raw?: string, plugin?: ChannelPlugin): string | undefined;
/**
 * Directory target kinds accepted by plugin-backed target resolution.
 */
export type TargetResolveKindLike = ChannelDirectoryEntryKind | "channel";
/**
 * Resolved outbound target returned by a channel plugin target resolver.
 */
export type ResolvedPluginMessagingTarget = {
    to: string;
    kind: TargetResolveKindLike;
    display?: string;
    source: "normalized" | "directory";
    resolutionSource: "plugin";
};
/**
 * Produces raw and provider-normalized forms of a nonblank target input.
 */
export declare function resolveNormalizedTargetInput(provider: string, raw?: string, plugin?: ChannelPlugin): {
    raw: string;
    normalized: string;
} | undefined;
/**
 * Detects whether input is specific enough to invoke plugin target resolution.
 */
export declare function looksLikeTargetId(params: {
    channel: ChannelId;
    raw: string;
    normalized?: string;
    plugin?: ChannelPlugin;
}): boolean;
/**
 * Resolves a normalized target through the channel plugin when a resolver is available.
 */
export declare function maybeResolvePluginMessagingTarget(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    input: string;
    accountId?: string | null;
    preferredKind?: TargetResolveKindLike;
    requireIdLike?: boolean;
    plugin?: ChannelPlugin;
}): Promise<ResolvedPluginMessagingTarget | undefined>;
/**
 * Builds a cache signature for target-resolution behavior exposed by a channel plugin.
 */
export declare function buildTargetResolverSignature(channel: ChannelId, preparedPlugin?: ChannelPlugin): string;
export { testing as __testing };
