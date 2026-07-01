import type { OpenClawPackageManifest } from "./manifest.js";
type BundledChannelEntryPathPair = {
    source: string;
    built: string;
};
/** Bundled channel plugin metadata used by generators and runtime path resolvers. */
export type BundledChannelPluginMetadata = {
    dirName: string;
    source: BundledChannelEntryPathPair;
    setupSource?: BundledChannelEntryPathPair;
    manifest: {
        id: string;
        channels?: readonly string[];
    };
    packageManifest?: OpenClawPackageManifest;
    rootDir: string;
};
/** Lists bundled channel plugin metadata from default or caller-provided scan roots. */
export declare function listBundledChannelPluginMetadata(params?: {
    rootDir?: string;
    scanDir?: string;
    includeChannelConfigs?: boolean;
    includeSyntheticChannelConfigs?: boolean;
}): readonly BundledChannelPluginMetadata[];
/** Resolves a generated runtime path for a bundled channel entry. */
export declare function resolveBundledChannelGeneratedPath(rootDir: string, entry: BundledChannelPluginMetadata["source"] | BundledChannelPluginMetadata["setupSource"], pluginDirName?: string, scanDir?: string): string | null;
/** Resolves the source workspace path for a bundled channel plugin id. */
export declare function resolveBundledChannelWorkspacePath(params: {
    rootDir: string;
    scanDir?: string;
    pluginId: string;
}): string | null;
export {};
