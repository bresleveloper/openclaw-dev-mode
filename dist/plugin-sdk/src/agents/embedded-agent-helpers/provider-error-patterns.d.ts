/**
 * Provider-owned error-pattern dispatch plus legacy fallback patterns.
 *
 * Most provider-specific failover classification now lives on provider-plugin
 * hooks. This module keeps only fallback patterns for providers that do not
 * yet ship a dedicated provider plugin hook surface.
 */
import type { FailoverReason } from "./types.js";
type ProviderSpecificErrorContext = {
    provider?: string;
    modelId?: string;
    errorMessage: string;
    status?: number;
    code?: string;
    errorType?: string;
};
type ProviderSpecificErrorOptions = {
    includePluginHooks?: boolean;
};
/**
 * Check if an error message matches any provider-specific context overflow pattern.
 * Called from `isContextOverflowError()` to catch provider-specific wording.
 */
export declare function matchesProviderContextOverflow(errorMessage: string): boolean;
export declare function classifyProviderPluginError(input: string | ProviderSpecificErrorContext): FailoverReason | null;
/**
 * Try to classify an error using provider-specific patterns.
 * Returns null if no provider-specific pattern matches (fall through to generic classification).
 */
export declare function classifyProviderSpecificError(input: string | ProviderSpecificErrorContext, opts?: ProviderSpecificErrorOptions): FailoverReason | null;
export {};
