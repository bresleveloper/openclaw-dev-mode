/** Machine-readable reasons local media path validation can fail. */
export type LocalMediaAccessErrorCode = "path-not-allowed" | "invalid-root" | "invalid-file-url" | "network-path-not-allowed" | "unsafe-bypass" | "not-found" | "invalid-path" | "not-file";
/** Error raised when a local media path escapes the configured allowlist. */
export declare class LocalMediaAccessError extends Error {
    code: LocalMediaAccessErrorCode;
    constructor(code: LocalMediaAccessErrorCode, message: string, options?: ErrorOptions);
}
/** Returns the default root allowlist for local media reads. */
export declare function getDefaultLocalRoots(): readonly string[];
/** Resolves an allowlist once for callers that validate several media paths. */
export declare function resolveLocalMediaRoots(localRoots?: readonly string[]): Promise<readonly string[]>;
/** Verifies that a local media path is managed inbound media or lives under allowed roots. */
export declare function assertLocalMediaAllowed(mediaPath: string, localRoots: readonly string[] | "any" | undefined, options?: {
    inboundRoots?: readonly string[];
    resolvedRoots?: readonly string[];
    resolveRoots?: () => Promise<readonly string[]>;
}): Promise<void>;
