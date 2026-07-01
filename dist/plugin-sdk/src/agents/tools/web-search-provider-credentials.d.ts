/**
 * Resolves web-search provider credentials from config values, secret refs, or
 * provider-specific environment variables.
 */
/** Returns the first usable credential for a web-search provider. */
export declare function resolveWebSearchProviderCredential(params: {
    credentialValue: unknown;
    path: string;
    envVars: string[];
}): string | undefined;
