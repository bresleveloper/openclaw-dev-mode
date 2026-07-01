import type { SecretTargetRegistryEntry } from "./target-registry-types.js";
/** Tokenized segment in a secret target path pattern. */
export type PathPatternToken = {
    kind: "literal";
    value: string;
} | {
    kind: "wildcard";
} | {
    kind: "array";
    field: string;
};
/** Registry entry with compiled path/ref pattern tokens. */
export type CompiledTargetRegistryEntry = SecretTargetRegistryEntry & {
    pathTokens: PathPatternToken[];
    pathDynamicTokenCount: number;
    refPathTokens?: PathPatternToken[];
    refPathDynamicTokenCount: number;
};
/** Concrete config value matched by expanding a path pattern. */
export type ExpandedPathMatch = {
    segments: string[];
    captures: string[];
    value: unknown;
};
/**
 * Parses a dotted target pattern into literal, wildcard, and array traversal tokens.
 */
export declare function parsePathPattern(pathPattern: string): PathPatternToken[];
/**
 * Compiles a registry entry and verifies its value path/ref path wildcard shape matches.
 */
export declare function compileTargetRegistryEntry(entry: SecretTargetRegistryEntry): CompiledTargetRegistryEntry;
/**
 * Matches concrete path segments against compiled pattern tokens and returns dynamic captures.
 */
export declare function matchPathTokens(segments: string[], tokens: PathPatternToken[]): {
    captures: string[];
} | null;
/**
 * Rebuilds a concrete path from tokens and captures produced by matchPathTokens/expandPathTokens.
 */
export declare function materializePathTokens(tokens: PathPatternToken[], captures: string[]): string[] | null;
/**
 * Expands a pattern across a config object and returns every matching value with captures.
 */
export declare function expandPathTokens(root: unknown, tokens: PathPatternToken[]): ExpandedPathMatch[];
