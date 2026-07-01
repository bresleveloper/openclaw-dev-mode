/** Quotes integer literals above Number.MAX_SAFE_INTEGER before JSON.parse. */
export declare function quoteUnsafeIntegerLiterals(input: string): string;
/** Parses JSON while preserving unsafe integer literals as strings. */
export declare function parseJsonPreservingUnsafeIntegers(input: string): unknown;
/** Parses or accepts an object while preserving unsafe integer literals in string input. */
export declare function parseJsonObjectPreservingUnsafeIntegers(value: unknown): Record<string, unknown> | null;
