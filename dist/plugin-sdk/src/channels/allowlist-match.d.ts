export type AllowlistMatchSource = "wildcard" | "id" | "name" | "tag" | "username" | "prefixed-id" | "prefixed-user" | "prefixed-name" | "slug" | "localpart";
export type AllowlistMatch<TSource extends string = AllowlistMatchSource> = {
    allowed: boolean;
    matchKey?: string;
    matchSource?: TSource;
};
export type CompiledAllowlist = {
    set: ReadonlySet<string>;
    wildcard: boolean;
};
/** Formats match metadata for diagnostics without leaking channel-specific text. */
export declare function formatAllowlistMatchMeta(match?: {
    matchKey?: string;
    matchSource?: string;
} | null): string;
/** Compiles normalized allowlist entries and records wildcard presence. */
export declare function compileAllowlist(entries: ReadonlyArray<string>): CompiledAllowlist;
export declare function resolveAllowlistCandidates<TSource extends string>(params: {
    compiledAllowlist: CompiledAllowlist;
    candidates: Array<{
        value?: string;
        source: TSource;
    }>;
}): AllowlistMatch<TSource>;
/** Applies wildcard and empty-list semantics before candidate matching. */
export declare function resolveCompiledAllowlistMatch<TSource extends string>(params: {
    compiledAllowlist: CompiledAllowlist;
    candidates: Array<{
        value?: string;
        source: TSource;
    }>;
}): AllowlistMatch<TSource>;
/** Convenience wrapper for callers that do not need to reuse a compiled list. */
export declare function resolveAllowlistMatchByCandidates<TSource extends string>(params: {
    allowList: ReadonlyArray<string>;
    candidates: Array<{
        value?: string;
        source: TSource;
    }>;
}): AllowlistMatch<TSource>;
/** Matches simple sender id/name allowlists used by legacy channel config. */
export declare function resolveAllowlistMatchSimple(params: {
    allowFrom: ReadonlyArray<string | number>;
    senderId: string;
    senderName?: string | null;
    allowNameMatching?: boolean;
}): AllowlistMatch<"wildcard" | "id" | "name">;
