import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginBundleFormat } from "./manifest-types.js";
/** LSP server config block loaded from plugin bundle metadata. */
export type BundleLspServerConfig = Record<string, unknown>;
/** Merged LSP config contributed by enabled plugin bundles. */
export type BundleLspConfig = {
    lspServers: Record<string, BundleLspServerConfig>;
};
/** Runtime support summary for bundle-declared LSP servers. */
export type BundleLspRuntimeSupport = {
    hasStdioServer: boolean;
    supportedServerNames: string[];
    unsupportedServerNames: string[];
    diagnostics: string[];
};
/** Inspects whether one plugin bundle has supported LSP runtime servers. */
export declare function inspectBundleLspRuntimeSupport(params: {
    pluginId: string;
    rootDir: string;
    bundleFormat: PluginBundleFormat;
}): BundleLspRuntimeSupport;
/** Loads and merges enabled bundle LSP config across plugin manifests. */
export declare function loadEnabledBundleLspConfig(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
}): {
    config: BundleLspConfig;
    diagnostics: Array<{
        pluginId: string;
        message: string;
    }>;
};
