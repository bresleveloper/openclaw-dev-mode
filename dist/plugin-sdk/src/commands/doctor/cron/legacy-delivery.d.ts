/** Return true when a payload still carries legacy delivery hint fields. */
export declare function hasLegacyDeliveryHints(payload: Record<string, unknown>): boolean;
/** Build a new delivery object from legacy top-level payload delivery fields. */
export declare function buildDeliveryFromLegacyPayload(payload: Record<string, unknown>): Record<string, unknown>;
/** Build a partial delivery patch from legacy payload fields, or null when none exist. */
export declare function buildDeliveryPatchFromLegacyPayload(payload: Record<string, unknown>): Record<string, unknown> | null;
/** Merge legacy payload delivery hints into an existing delivery object. */
export declare function mergeLegacyDeliveryInto(delivery: Record<string, unknown>, payload: Record<string, unknown>): {
    delivery: Record<string, unknown>;
    mutated: boolean;
};
/** Normalize delivery and strip consumed legacy delivery fields from the payload. */
export declare function normalizeLegacyDeliveryInput(params: {
    delivery?: Record<string, unknown> | null;
    payload?: Record<string, unknown> | null;
}): {
    delivery: Record<string, unknown> | undefined;
    mutated: boolean;
};
