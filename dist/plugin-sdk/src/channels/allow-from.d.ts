/**
 * Prefix that marks an allowFrom entry as an access-group reference instead of a sender id.
 */
export declare const ACCESS_GROUP_ALLOW_FROM_PREFIX = "accessGroup:";
/**
 * Parses an access-group allowFrom entry and returns the referenced group name.
 */
export declare function parseAccessGroupAllowFromEntry(entry: string): string | null;
/**
 * Merges configured DM allowFrom entries with pairing-store sender ids when policy allows it.
 */
export declare function mergeDmAllowFromSources(params: {
    allowFrom?: Array<string | number>;
    storeAllowFrom?: Array<string | number>;
    dmPolicy?: string;
}): string[];
/**
 * Resolves the allowFrom entries used for group chats, optionally falling back to DM policy.
 */
export declare function resolveGroupAllowFromSources(params: {
    allowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    fallbackToAllowFrom?: boolean;
}): string[];
/**
 * Returns the first value that is present, preserving falsy values such as false, 0, and "".
 */
export declare function firstDefined<T>(...values: Array<T | undefined>): (T & ({} | null)) | undefined;
/**
 * Checks a normalized sender allowlist with wildcard and empty-list policy handling.
 */
export declare function isSenderIdAllowed(allow: {
    entries: string[];
    hasWildcard: boolean;
    hasEntries: boolean;
}, senderId: string | undefined, allowWhenEmpty: boolean): boolean;
