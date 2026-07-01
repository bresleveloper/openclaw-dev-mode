/** Normalizes plugin id scope input into a sorted unique string list. */
export declare function normalizePluginIdScope(ids?: readonly unknown[]): string[] | undefined;
/** True when plugin scope was explicitly provided, including an empty scope. */
export declare function hasExplicitPluginIdScope(ids?: readonly string[]): boolean;
/** True when plugin scope was explicitly provided with at least one id. */
export declare function hasNonEmptyPluginIdScope(ids?: readonly string[]): boolean;
/** Creates a lookup set for explicit plugin scope, or null when unscoped. */
export declare function createPluginIdScopeSet(ids?: readonly string[]): ReadonlySet<string> | null;
/** Serializes plugin scope for cache keys. */
export declare function serializePluginIdScope(ids?: readonly string[]): string;
