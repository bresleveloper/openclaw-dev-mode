/** Applies manifest owner policy for plugin availability and activation decisions. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizePluginsConfig } from "./config-state.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
type OwnerPlugin = Pick<PluginManifestRecord, "id" | "origin" | "enabledByDefault" | "enabledByDefaultOnPlatforms">;
type NormalizedPluginsConfig = ReturnType<typeof normalizePluginsConfig>;
/** Reasons a manifest owner plugin can fail the base activation policy. */
export type ManifestOwnerBasePolicyBlockReason = "plugins-disabled" | "blocked-by-denylist" | "plugin-disabled" | "not-in-allowlist";
/** True when a manifest owner comes from a bundled plugin. */
export declare function isBundledManifestOwner(plugin: Pick<PluginManifestRecord, "origin">): boolean;
/** True when config explicitly trusts a plugin as a manifest owner. */
export declare function hasExplicitManifestOwnerTrust(params: {
    plugin: Pick<PluginManifestRecord, "id">;
    normalizedConfig: NormalizedPluginsConfig;
}): boolean;
/** True when a plugin passes global enablement, allowlist, denylist, and disabled checks. */
export declare function passesManifestOwnerBasePolicy(params: {
    plugin: Pick<PluginManifestRecord, "id">;
    normalizedConfig: NormalizedPluginsConfig;
    allowExplicitlyDisabled?: boolean;
    allowRestrictiveAllowlistBypass?: boolean;
}): boolean;
/** Resolves the base policy block reason for a manifest owner plugin. */
export declare function resolveManifestOwnerBasePolicyBlock(params: {
    plugin: Pick<PluginManifestRecord, "id">;
    normalizedConfig: NormalizedPluginsConfig;
    allowExplicitlyDisabled?: boolean;
    allowRestrictiveAllowlistBypass?: boolean;
}): ManifestOwnerBasePolicyBlockReason | null;
/** Resolves whether a manifest owner plugin is effectively activated. */
export declare function isActivatedManifestOwner(params: {
    plugin: OwnerPlugin;
    normalizedConfig: NormalizedPluginsConfig;
    rootConfig?: OpenClawConfig;
}): boolean;
export {};
