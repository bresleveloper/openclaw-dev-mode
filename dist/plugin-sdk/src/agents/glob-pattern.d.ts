/**
 * Compiles and matches lightweight glob patterns used by agent policies.
 */
type CompiledGlobPattern = {
    kind: "all";
} | {
    kind: "exact";
    value: string;
} | {
    kind: "regex";
    value: RegExp;
};
export declare function compileGlobPatterns(params: {
    raw?: string[] | undefined;
    normalize: (value: string) => string;
}): CompiledGlobPattern[];
export declare function matchesAnyGlobPattern(value: string, patterns: CompiledGlobPattern[]): boolean;
export {};
