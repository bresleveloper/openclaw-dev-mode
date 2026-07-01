import { type OpenClawPackageManifest, type PluginManifest } from "./manifest.js";
type BundledPluginPathPair = {
    source: string;
    built: string;
};
/** Metadata collected from a bundled plugin package and manifest. */
export type BundledPluginMetadata = {
    dirName: string;
    idHint: string;
    source: BundledPluginPathPair;
    setupSource?: BundledPluginPathPair;
    publicSurfaceArtifacts?: readonly string[];
    runtimeSidecarArtifacts?: readonly string[];
    packageName?: string;
    packageVersion?: string;
    packageDescription?: string;
    packageManifest?: OpenClawPackageManifest;
    manifest: PluginManifest;
};
/** Lists bundled plugin metadata from source or built package layouts. */
export declare function listBundledPluginMetadata(params?: {
    rootDir?: string;
    scanDir?: string;
    includeChannelConfigs?: boolean;
    includeSyntheticChannelConfigs?: boolean;
}): readonly BundledPluginMetadata[];
/** Finds bundled plugin metadata by manifest id. */
export declare function findBundledPluginMetadataById(pluginId: string, params?: {
    rootDir?: string;
    scanDir?: string;
    includeChannelConfigs?: boolean;
    includeSyntheticChannelConfigs?: boolean;
}): BundledPluginMetadata | undefined;
/** Resolves the source directory for a bundled plugin in the current workspace. */
export declare function resolveBundledPluginWorkspaceSourcePath(params: {
    rootDir: string;
    scanDir?: string;
    pluginId: string;
}): string | null;
/** Resolves a generated runtime path for a bundled plugin entry. */
export declare function resolveBundledPluginGeneratedPath(rootDir: string, entry: BundledPluginPathPair | undefined, pluginDirName?: string, scanDir?: string): string | null;
/** Resolves the repo entry path for a bundled plugin, preferring source unless requested. */
export declare function resolveBundledPluginRepoEntryPath(params: {
    rootDir: string;
    pluginId: string;
    preferBuilt?: boolean;
    scanDir?: string;
}): string | null;
export {};
