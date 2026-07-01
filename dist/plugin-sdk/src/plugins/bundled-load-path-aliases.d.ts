/** Alias class for current packaged paths and legacy bundled extension paths. */
export type BundledPluginLoadPathAliasKind = "current" | "legacy";
/** Load path alias used while resolving bundled plugins across package layouts. */
export type BundledPluginLoadPathAlias = {
    kind: BundledPluginLoadPathAliasKind;
    path: string;
};
/** Parsed path metadata for a bundled plugin in a packaged dist root. */
export type PackagedBundledPluginPath = {
    packageRoot: string;
    bundledRoot: string;
    bundledLeaf: string;
};
/** Parsed path metadata for a bundled plugin in the legacy extensions root. */
export type LegacyBundledPluginPath = {
    packageRoot: string;
    legacyRoot: string;
    bundledLeaf: string;
};
/** Normalizes bundled lookup paths without preserving trailing separators. */
export declare function normalizeBundledLookupPath(targetPath: string): string;
/** Parses a path under a packaged bundled plugin root. */
export declare function parsePackagedBundledPluginPath(localPath: string): PackagedBundledPluginPath | null;
/** Builds the legacy extensions-root alias for a packaged bundled plugin path. */
export declare function buildLegacyBundledPath(localPath: string): string | null;
/** Builds the legacy extensions root for a packaged bundled plugin root. */
export declare function buildLegacyBundledRootPath(localPath: string): string | null;
/** Parses a path under the legacy bundled extensions root. */
export declare function parseLegacyBundledPluginPath(localPath: string): LegacyBundledPluginPath | null;
/** Builds current and legacy aliases for a packaged bundled plugin path. */
export declare function buildBundledPluginLoadPathAliases(localPath: string): BundledPluginLoadPathAlias[];
/** Classifies a load path as current or legacy for a packaged bundled plugin root. */
export declare function resolvePackagedBundledLoadPathAlias(params: {
    bundledRoot?: string;
    loadPath: string;
}): BundledPluginLoadPathAlias | null;
