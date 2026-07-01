/**
 * Shared truncation notice text for context payloads capped by provider or tool limits.
 */
export declare const CONTEXT_LIMIT_TRUNCATION_NOTICE = "more characters truncated";
/** Formats a compact notice that preserves the approximate number of omitted characters. */
export declare function formatContextLimitTruncationNotice(truncatedChars: number): string;
