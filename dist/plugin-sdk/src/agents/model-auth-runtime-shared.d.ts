/** Resolved credential material and provenance for one provider request. */
export type ResolvedProviderAuth = {
    apiKey?: string;
    profileId?: string;
    source: string;
    mode: "api-key" | "oauth" | "token" | "aws-sdk";
};
/** Stable provider auth error code used by fallback/retry paths. */
type ProviderAuthErrorCode = "missing-api-key" | "missing-provider-auth";
/** Base provider auth error with a stable code for retry/fallback logic. */
export declare class ProviderAuthError extends Error {
    readonly code: ProviderAuthErrorCode;
    readonly provider: string;
    constructor(code: ProviderAuthErrorCode, provider: string, message: string);
}
/** Auth error raised when a resolved provider auth source lacks usable material. */
export declare class MissingProviderAuthError extends ProviderAuthError {
    readonly mode: ResolvedProviderAuth["mode"];
    readonly source: string;
    constructor(provider: string, auth: ResolvedProviderAuth);
}
/** Narrow unknown errors to provider auth errors, optionally by code. */
export declare function isProviderAuthError(err: unknown, code?: ProviderAuthErrorCode): err is ProviderAuthError;
/** Narrow unknown errors to missing-provider-auth failures. */
export declare function isMissingProviderAuthError(err: unknown): err is MissingProviderAuthError;
/** Return the AWS credential env var that proves SDK auth is configured. */
export declare function resolveAwsSdkEnvVarName(env?: NodeJS.ProcessEnv): string | undefined;
/** Format the user-facing missing-auth error from auth provenance. */
export declare function formatMissingAuthError(auth: ResolvedProviderAuth, provider: string): string;
/** Require a normalized API key or throw a provider-auth error. */
export declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
export {};
