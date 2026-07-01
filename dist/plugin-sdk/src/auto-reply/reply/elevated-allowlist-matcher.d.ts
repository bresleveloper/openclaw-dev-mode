/** Explicit allowFrom fields supported by elevated sender matching. */
export type ExplicitElevatedAllowField = "id" | "from" | "e164" | "name" | "username" | "tag";
/** Channel-specific formatter for allowFrom identity values. */
export type AllowFromFormatter = (values: string[]) => string[];
/** Removes known channel/user prefixes before identity comparisons. */
export declare function stripSenderPrefix(value?: string): string;
/** Parses explicit elevated allowlist entries such as `id:telegram:123`. */
export declare function parseExplicitElevatedAllowEntry(entry: string): {
    field: ExplicitElevatedAllowField;
    value: string;
} | null;
/** Adds formatted identity token variants into a matcher set. */
export declare function addFormattedTokens(params: {
    formatAllowFrom: AllowFromFormatter;
    values: string[];
    tokens: Set<string>;
}): void;
/** Checks a value against formatted identity tokens. */
export declare function matchesFormattedTokens(params: {
    formatAllowFrom: AllowFromFormatter;
    value: string;
    includeStripped?: boolean;
    tokens: Set<string>;
}): boolean;
/** Builds normalized variants for mutable labels such as names and tags. */
export declare function buildMutableTokens(value?: string): Set<string>;
/** Checks mutable label text against normalized token variants. */
export declare function matchesMutableTokens(value: string, tokens: Set<string>): boolean;
