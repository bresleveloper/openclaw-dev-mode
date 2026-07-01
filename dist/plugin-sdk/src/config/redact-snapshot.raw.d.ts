/** Replaces known sensitive values in raw config text while preserving parseable structure. */
export declare function replaceSensitiveValuesInRaw(params: {
    raw: string;
    sensitiveValues: string[];
    redactedSentinel: string;
}): string;
/** Returns whether raw string redaction changed semantics and structured redaction is needed. */
export declare function shouldFallbackToStructuredRawRedaction(params: {
    redactedRaw: string;
    originalConfig: unknown;
    restoreParsed: (parsed: unknown) => {
        ok: boolean;
        result?: unknown;
    };
}): boolean;
