import { normalizeLegacyDmAliases, type CompatMutationResult } from "../channels/plugins/dm-access.js";
export { normalizeLegacyDmAliases };
export type { CompatMutationResult };
/** Resolved streaming values a channel doctor supplies while migrating legacy aliases. */
export type LegacyStreamingAliasOptions = {
    resolvedMode: string;
    includePreviewChunk?: boolean;
    resolvedNativeTransport?: unknown;
    offModeLegacyNotice?: (pathPrefix: string) => string;
};
/** Account-level channel config passed to channel-specific doctor migrations. */
export type NormalizeLegacyChannelAccountParams = {
    account: Record<string, unknown>;
    accountId: string;
    pathPrefix: string;
    changes: string[];
};
/** Narrows unknown config JSON values to mutable object records. */
export declare function asObjectRecord(value: unknown): Record<string, unknown> | null;
/** Checks whether any account entry still carries a channel-specific legacy alias. */
export declare function hasLegacyAccountStreamingAliases(value: unknown, match: (entry: unknown) => boolean): boolean;
/**
 * Moves legacy flat streaming aliases into the nested `streaming` config shape.
 *
 * Existing nested values win over legacy aliases, matching doctor migration rules
 * that preserve explicit modern config while removing stale compatibility keys.
 */
export declare function normalizeLegacyStreamingAliases(params: {
    entry: Record<string, unknown>;
    pathPrefix: string;
    changes: string[];
} & LegacyStreamingAliasOptions): CompatMutationResult;
/**
 * Runs generic channel doctor alias migration for the root entry and accounts.
 *
 * Channel plugins provide streaming resolution and optional account-specific
 * migrations so core can keep one compatibility path for all channel shapes.
 */
export declare function normalizeLegacyChannelAliases(params: {
    entry: Record<string, unknown>;
    pathPrefix: string;
    changes: string[];
    normalizeDm?: boolean;
    rootDmPromoteAllowFrom?: boolean;
    normalizeAccountDm?: boolean;
    resolveStreamingOptions: (entry: Record<string, unknown>) => LegacyStreamingAliasOptions;
    normalizeAccountExtra?: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
}): CompatMutationResult;
/** Detects legacy streaming aliases on one channel or account config entry. */
export declare function hasLegacyStreamingAliases(value: unknown, options?: {
    includePreviewChunk?: boolean;
    includeNativeTransport?: boolean;
}): boolean;
