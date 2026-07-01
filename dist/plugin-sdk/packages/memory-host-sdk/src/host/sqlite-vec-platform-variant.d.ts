/** Resolve the installed sqlite-vec native extension for the current platform if present. */
export declare function resolveSqliteVecPlatformVariant(): {
    pkg: string;
    extensionPath: string;
} | undefined;
