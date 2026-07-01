import type { PluginBundleFormat } from "./manifest-types.js";
import type { PluginManifestActivation } from "./manifest.js";
/** Relative manifest path for Codex-style plugin bundles. */
export declare const CODEX_BUNDLE_MANIFEST_RELATIVE_PATH = ".codex-plugin/plugin.json";
export declare const CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH = ".claude-plugin/plugin.json";
export declare const CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH = ".cursor-plugin/plugin.json";
/** Normalized bundle manifest shape consumed by plugin discovery. */
export type BundlePluginManifest = {
    id: string;
    name?: string;
    description?: string;
    version?: string;
    skills: string[];
    settingsFiles?: string[];
    hooks: string[];
    bundleFormat: PluginBundleFormat;
    activation?: PluginManifestActivation;
    capabilities: string[];
};
export type BundleManifestLoadResult = {
    ok: true;
    manifest: BundlePluginManifest;
    manifestPath: string;
} | {
    ok: false;
    error: string;
    manifestPath: string;
};
/** Normalizes string-or-list path fields from bundle manifests. */
export declare function normalizeBundlePathList(value: unknown): string[];
export declare function mergeBundlePathLists(...groups: string[][]): string[];
export declare function loadBundleManifest(params: {
    rootDir: string;
    rootRealPath?: string;
    bundleFormat: PluginBundleFormat;
    rejectHardlinks?: boolean;
}): BundleManifestLoadResult;
export declare function detectBundleManifestFormat(rootDir: string): PluginBundleFormat | null;
