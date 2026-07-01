/** Token source used by scoped bearer-auth fetch retries. */
export type ScopeTokenProvider = {
    /** Return a bearer token for the requested OAuth/API scope. */
    getAccessToken: (scope: string) => Promise<string>;
};
/** Retry a fetch with bearer tokens from the provided scopes when the unauthenticated attempt fails. */
export declare function fetchWithBearerAuthScopeFallback(params: {
    /** Absolute URL to request. */
    url: string;
    /** Token scopes to try in order after the initial unauthenticated request fails. */
    scopes: readonly string[];
    /** Optional token source; when omitted, only the unauthenticated request is attempted. */
    tokenProvider?: ScopeTokenProvider;
    /** Fetch implementation override for tests or plugin runtimes. Defaults to global `fetch`. */
    fetchFn?: typeof fetch;
    /** Request options reused across unauthenticated and authenticated attempts. */
    requestInit?: RequestInit;
    /** Reject non-HTTPS URLs before any request is sent. */
    requireHttps?: boolean;
    /** Optional policy gate for whether this URL is allowed to receive bearer auth. */
    shouldAttachAuth?: (url: string) => boolean;
    /** Override which responses should trigger scoped-token retries. Defaults to 401/403. */
    shouldRetry?: (response: Response) => boolean;
}): Promise<Response>;
