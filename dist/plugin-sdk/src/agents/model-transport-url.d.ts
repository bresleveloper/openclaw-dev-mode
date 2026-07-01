/**
 * Debug formatting helpers for model transport endpoints.
 * Keeps logs useful without exposing credentials, request params, or fragments.
 */
/** Return a sanitized URL suitable for logs and diagnostics. */
export declare function formatModelTransportDebugUrl(rawUrl: string): string;
/** Format a configured base URL for debug output, or the implicit default. */
export declare function formatModelTransportDebugBaseUrl(rawUrl: string | undefined): string;
