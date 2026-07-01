/**
 * Converts plugin manifest metadata into deterministic config UI metadata for docs, validation, and runtime schema.
 * When multiple plugin origins expose the same id/channel, the closest origin owns the surfaced schema.
 */
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import type { ChannelUiMetadata, PluginUiMetadata } from "./schema.js";
export type ChannelSchemaMetadataWithOwnership = ChannelUiMetadata & {
    schemaPluginId?: string;
    schemaPluginOrigin?: PluginOrigin;
};
type ChannelDmAllowFromMode = "topOnly" | "topOrNested" | "nestedOnly";
export type ChannelDmPolicyMetadata = {
    id: string;
    dmAllowFromMode?: ChannelDmAllowFromMode;
};
/** Collects plugin config UI metadata with deterministic origin precedence and output ordering. */
export declare function collectPluginSchemaMetadata(registry: PluginManifestRegistry): PluginUiMetadata[];
/** Collects per-channel config metadata with the plugin that supplied the selected schema. */
export declare function collectChannelSchemaMetadataWithOwnership(registry: PluginManifestRegistry): ChannelSchemaMetadataWithOwnership[];
/** Collects public per-channel config UI metadata without internal schema ownership. */
export declare function collectChannelSchemaMetadata(registry: PluginManifestRegistry): ChannelUiMetadata[];
/** Collects channel DM policy metadata without importing doctor/runtime command modules. */
export declare function collectChannelDmPolicyMetadata(registry: PluginManifestRegistry): ChannelDmPolicyMetadata[];
export {};
