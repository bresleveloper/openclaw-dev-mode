/** Returns true when a role grant satisfies requested scopes, including operator implications. */
export declare function roleScopesAllow(params: {
    role: string;
    requestedScopes: readonly string[];
    allowedScopes: readonly string[];
}): boolean;
/** Returns the first requested scope not covered by the role's allowed scopes. */
export declare function resolveMissingRequestedScope(params: {
    role: string;
    requestedScopes: readonly string[];
    allowedScopes: readonly string[];
}): string | null;
/** Returns the first requested scope that does not belong to any requested role. */
export declare function resolveScopeOutsideRequestedRoles(params: {
    requestedRoles: readonly string[];
    requestedScopes: readonly string[];
}): string | null;
