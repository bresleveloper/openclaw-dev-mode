/** Shared argument splitter for service command lines rendered by platform adapters. */
type ArgSplitEscapeMode = "none" | "backslash" | "backslash-quote-only";
type ArgSplitQuoteChar = '"' | "'";
type ArgSplitQuoteStart = "anywhere" | "item-start";
/** Splits service command strings while preserving quoted arguments across platform parsers. */
export declare function splitArgsPreservingQuotes(value: string, options?: {
    escapeMode?: ArgSplitEscapeMode;
    quoteChars?: readonly ArgSplitQuoteChar[];
    quoteStart?: ArgSplitQuoteStart;
}): string[];
export {};
