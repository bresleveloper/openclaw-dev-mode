/**
 * Merge configured direct, group, and pairing-store allowlists into the
 * effective lists consumed by sender and context-visibility checks.
 */
export declare function resolveChannelIngressEffectiveAllowFromLists(params: {
    allowFrom?: Array<string | number> | null;
    groupAllowFrom?: Array<string | number> | null;
    storeAllowFrom?: Array<string | number> | null;
    dmPolicy?: string | null;
    groupAllowFromFallbackToAllowFrom?: boolean | null;
}): {
    effectiveAllowFrom: string[];
    effectiveGroupAllowFrom: string[];
};
