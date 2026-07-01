import { type SafeRegexRejectReason } from "./safe-regex.js";
/** Reject reasons that should be surfaced for user-configured regex patterns. */
export type ConfigRegexRejectReason = Exclude<SafeRegexRejectReason, "empty">;
/**
 * Result for one config regex pattern.
 * Empty patterns return null from the compiler; invalid or unsafe patterns return a rejected shape.
 */
export type CompiledConfigRegex = {
    regex: RegExp;
    pattern: string;
    flags: string;
    reason: null;
} | {
    regex: null;
    pattern: string;
    flags: string;
    reason: ConfigRegexRejectReason;
};
/**
 * Compile a single user-configured regex with the shared safe-regex guardrails.
 * Returns null for blank patterns so optional config entries can be skipped silently.
 */
export declare function compileConfigRegex(pattern: string, flags?: string): CompiledConfigRegex | null;
/**
 * Compile a list of user-configured regex patterns, separating usable regexes from diagnostics.
 * Callers can keep operating with safe entries while reporting rejected unsafe patterns once.
 */
export declare function compileConfigRegexes(patterns: string[], flags?: string): {
    regexes: RegExp[];
    rejected: Array<{
        pattern: string;
        flags: string;
        reason: ConfigRegexRejectReason;
    }>;
};
