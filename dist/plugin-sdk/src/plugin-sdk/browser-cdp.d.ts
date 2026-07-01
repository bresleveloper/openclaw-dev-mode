/** Parsed browser/CDP endpoint details with display-safe normalized URL variants. */
export type BrowserHttpUrlParseResult = {
    /** Parsed URL object retained for callers that need protocol, host, path, or credentials. */
    parsed: URL;
    /** Effective TCP port, including inferred 80/443 defaults. */
    port: number;
    /** Whether the raw URL text included a port, even if URL normalization drops it. */
    hasExplicitPort: boolean;
    /** URL string normalized by WHATWG URL rules with a trailing slash removed. */
    normalized: string;
    /** Normalized URL string that preserves an explicitly supplied default port. */
    normalizedWithPort: string;
};
/**
 * Parses a browser/CDP endpoint and returns both URL semantics and display-safe normalized forms.
 */
export declare function parseBrowserHttpUrl(raw: string, label: string): BrowserHttpUrlParseResult;
/**
 * Redacts credentials and known sensitive tokens from CDP URLs before logs or diagnostics.
 */
export declare function redactCdpUrl(cdpUrl: string | null | undefined): string | null | undefined;
