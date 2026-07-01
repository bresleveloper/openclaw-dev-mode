import type { ChannelIngressAdapter, ResolveChannelMessageIngressParams } from "./runtime-types.js";
import type { AccessGroupMembershipFact, ChannelIngressChannelId } from "./types.js";
/**
 * Lists every access-group name referenced by grouped allowFrom entry arrays.
 */
export declare function allReferencedAccessGroupNames(entries: Array<readonly (string | number)[]>): string[];
/**
 * Normalizes direct sender entries while preserving access-group references for runtime lookup.
 */
export declare function normalizeEffectiveEntries(params: {
    adapter: ChannelIngressAdapter;
    accountId: string;
    entries: readonly (string | number)[];
    context: "dm" | "group" | "route" | "command";
}): Promise<string[]>;
/**
 * Resolves dynamic access-group membership facts for referenced runtime access groups.
 */
export declare function resolveRuntimeAccessGroupMembershipFacts(params: {
    input: ResolveChannelMessageIngressParams;
    channelId: ChannelIngressChannelId;
    names: readonly string[];
}): Promise<AccessGroupMembershipFact[]>;
