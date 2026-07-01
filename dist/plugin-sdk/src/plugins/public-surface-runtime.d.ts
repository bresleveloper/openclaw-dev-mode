export declare const PUBLIC_SURFACE_SOURCE_EXTENSIONS: readonly [".ts", ".mts", ".js", ".mjs", ".cts", ".cjs"];
/** Normalizes a bundled public artifact subpath and rejects traversal/absolute paths. */
export declare function normalizeBundledPluginArtifactSubpath(artifactBasename: string): string;
/** Normalizes a bundled plugin directory name and rejects path-like values. */
export declare function normalizeBundledPluginDirName(dirName: string): string;
/** Resolves a source-tree public surface artifact path for bundled plugin development. */
export declare function resolveBundledPluginSourcePublicSurfacePath(params: {
    sourceRoot: string;
    dirName: string;
    artifactBasename: string;
}): string | null;
/** Resolves a bundled plugin public surface artifact across source, dist, and package layouts. */
export declare function resolveBundledPluginPublicSurfacePath(params: {
    rootDir: string;
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
    bundledPluginsDir?: string;
    bundledPluginsDirMode?: "explicit" | "auto";
}): string | null;
