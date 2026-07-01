import type { RuntimeEnv } from "../../runtime.js";
export type AllowlistUserResolutionLike = {
    input: string;
    resolved: boolean;
    id?: string;
};
export declare function mergeAllowlist(params: {
    existing?: Array<string | number>;
    additions: string[];
}): string[];
/** Splits lookup results into resolved mappings, unresolved display text, and id additions. */
export declare function buildAllowlistResolutionSummary<T extends AllowlistUserResolutionLike>(resolvedUsers: T[], opts?: {
    formatResolved?: (entry: T) => string;
    formatUnresolved?: (entry: T) => string;
}): {
    resolvedMap: Map<string, T>;
    mapping: string[];
    unresolved: string[];
    additions: string[];
};
/** Replaces resolvable user entries with canonical ids while preserving unresolved entries and `*`. */
export declare function canonicalizeAllowlistWithResolvedIds<T extends AllowlistUserResolutionLike>(params: {
    existing?: Array<string | number>;
    resolvedMap: Map<string, T>;
}): string[];
/** Updates nested `{ users }` allowlist entries using merge or canonicalize semantics. */
export declare function patchAllowlistUsersInConfigEntries<T extends AllowlistUserResolutionLike, TEntries extends Record<string, unknown>>(params: {
    entries: TEntries;
    resolvedMap: Map<string, T>;
    strategy?: "merge" | "canonicalize";
}): TEntries;
/** Collects concrete user lookup targets from one config entry, excluding wildcard policy entries. */
export declare function addAllowlistUserEntriesFromConfigEntry(target: Set<string>, entry: unknown): void;
/** Logs a compact resolved/unresolved allowlist lookup summary when there is anything to report. */
export declare function summarizeMapping(label: string, mapping: string[], unresolved: string[], runtime: RuntimeEnv): void;
