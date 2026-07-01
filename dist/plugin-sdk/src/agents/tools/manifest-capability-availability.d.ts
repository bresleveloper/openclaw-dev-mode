/**
 * Manifest capability availability checks.
 *
 * Combines plugin contracts, availability, config signals, auth profiles, env candidates, and base URL guards.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../../plugins/plugin-metadata-snapshot.types.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
/** Manifest contract keys that represent provider-backed tool capabilities. */
type CapabilityContractKey = "imageGenerationProviders" | "videoGenerationProviders" | "musicGenerationProviders" | "mediaUnderstandingProviders";
type CapabilityMetadataSnapshot = Pick<PluginMetadataSnapshot, "index" | "plugins">;
/** Returns the active capability metadata snapshot when one is already loaded. */
export declare function getCurrentCapabilityMetadataSnapshot(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
}): PluginMetadataSnapshot | undefined;
/** Loads capability metadata from current config/workspace plugin state. */
export declare function loadCapabilityMetadataSnapshot(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Pick<PluginMetadataSnapshot, "index" | "plugins">;
/** Checks whether any available plugin has a configured provider for a capability contract. */
export declare function hasSnapshotCapabilityAvailability(params: {
    snapshot: CapabilityMetadataSnapshot;
    key: CapabilityContractKey;
    config?: OpenClawConfig;
    authStore?: AuthProfileStore;
}): boolean;
/** Checks whether any available plugin exposes env-backed auth for a provider id. */
export declare function hasSnapshotProviderEnvAvailability(params: {
    snapshot: CapabilityMetadataSnapshot;
    providerId: string;
    config?: OpenClawConfig;
}): boolean;
/** Checks whether a specific provider id is available for a capability contract. */
export declare function hasSnapshotCapabilityProviderAvailability(params: {
    snapshot: CapabilityMetadataSnapshot;
    key: CapabilityContractKey;
    providerId: string;
    config?: OpenClawConfig;
    authStore?: AuthProfileStore;
}): boolean;
export {};
