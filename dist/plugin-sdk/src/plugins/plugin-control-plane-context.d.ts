/** Tracks control-plane plugin metadata context during registry and status operations. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { InstalledPluginIndex } from "./installed-plugin-index.js";
import { type PluginSourceRoots } from "./roots.js";
/** Discovery inputs that affect plugin source resolution. */
export type PluginDiscoveryContext = {
    roots: PluginSourceRoots;
    loadPaths: readonly string[];
};
/** Control-plane fingerprint inputs that affect installed plugin activation. */
export type PluginControlPlaneContext = {
    discovery: PluginDiscoveryContext;
    policyFingerprint: string;
    inventoryFingerprint?: string;
    activationFingerprint?: string;
};
/** Parameters used to resolve plugin discovery roots and load paths. */
export type ResolvePluginDiscoveryContextParams = {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
    loadPaths?: readonly string[];
};
/** Parameters used to resolve the plugin control-plane fingerprint. */
export type ResolvePluginControlPlaneContextParams = ResolvePluginDiscoveryContextParams & {
    activationFingerprint?: string;
    index?: InstalledPluginIndex;
    inventoryFingerprint?: string;
    policyHash?: string;
};
/** Resolves plugin discovery roots and load paths for cache/fingerprint callers. */
export declare function resolvePluginDiscoveryContext(params?: ResolvePluginDiscoveryContextParams): PluginDiscoveryContext;
/** Resolves a stable fingerprint for plugin discovery inputs. */
export declare function resolvePluginDiscoveryFingerprint(params?: ResolvePluginDiscoveryContextParams): string;
/** Hashes an already resolved plugin discovery context. */
export declare function fingerprintPluginDiscoveryContext(context: PluginDiscoveryContext): string;
/** Resolves all inputs that determine plugin control-plane activation state. */
export declare function resolvePluginControlPlaneContext(params?: ResolvePluginControlPlaneContextParams): PluginControlPlaneContext;
/** Resolves a stable fingerprint for plugin control-plane activation state. */
export declare function resolvePluginControlPlaneFingerprint(params?: ResolvePluginControlPlaneContextParams): string;
