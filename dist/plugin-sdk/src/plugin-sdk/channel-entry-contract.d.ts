import type { ChannelOutboundAdapter } from "../channels/plugins/types.adapters.js";
import type { ChannelConfigSchema } from "../channels/plugins/types.config.js";
import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { BundledChannelLegacySessionSurface, BundledChannelLegacyStateMigrationDetector, BundledEntryModuleLoadOptions } from "./channel-entry-contract.types.js";
export type AnyAgentTool = import("../plugins/types.js").AnyAgentTool;
export type OpenClawPluginApi = import("../plugins/types.js").OpenClawPluginApi;
export type OpenClawPluginCommandDefinition = import("../plugins/types.js").OpenClawPluginCommandDefinition;
export type PluginCommandContext = import("../plugins/types.js").PluginCommandContext;
export type { BundledChannelLegacySessionSurface, BundledChannelLegacyStateMigrationDetector, BundledEntryModuleLoadOptions, } from "./channel-entry-contract.types.js";
type BundledChannelRuntime = unknown;
type ChannelEntryConfigSchema<TPlugin> = TPlugin extends ChannelPlugin<unknown> ? NonNullable<TPlugin["configSchema"]> : ChannelConfigSchema;
type BundledEntryModuleRef = {
    specifier: string;
    exportName?: string;
};
type DefineBundledChannelEntryOptions<TPlugin = ChannelPlugin> = {
    id: string;
    name: string;
    description: string;
    importMetaUrl: string;
    plugin: BundledEntryModuleRef;
    outbound?: BundledEntryModuleRef;
    secrets?: BundledEntryModuleRef;
    configSchema?: ChannelEntryConfigSchema<TPlugin> | (() => ChannelEntryConfigSchema<TPlugin>);
    runtime?: BundledEntryModuleRef;
    accountInspect?: BundledEntryModuleRef;
    features?: BundledChannelEntryFeatures;
    registerCliMetadata?: (api: OpenClawPluginApi) => void;
    registerFull?: (api: OpenClawPluginApi) => void;
};
type DefineBundledChannelSetupEntryOptions = {
    importMetaUrl: string;
    plugin: BundledEntryModuleRef;
    secrets?: BundledEntryModuleRef;
    runtime?: BundledEntryModuleRef;
    legacyStateMigrations?: BundledEntryModuleRef;
    legacySessionSurface?: BundledEntryModuleRef;
    registerSetupRuntime?: (api: OpenClawPluginApi) => void;
    features?: BundledChannelSetupEntryFeatures;
};
/** Feature flags exposed by bundled setup entries for optional migration/session surfaces. */
export type BundledChannelSetupEntryFeatures = {
    legacyStateMigrations?: boolean;
    legacySessionSurfaces?: boolean;
};
/** Feature flags exposed by full bundled channel entries. */
export type BundledChannelEntryFeatures = {
    accountInspect?: boolean;
};
/** Runtime contract returned by a bundled channel's main entrypoint definition. */
export type BundledChannelEntryContract<TPlugin = ChannelPlugin> = {
    kind: "bundled-channel-entry";
    id: string;
    name: string;
    description: string;
    configSchema: ChannelEntryConfigSchema<TPlugin>;
    features?: BundledChannelEntryFeatures;
    register: (api: OpenClawPluginApi) => void;
    loadChannelPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
    loadChannelOutbound?: (options?: BundledEntryModuleLoadOptions) => ChannelOutboundAdapter | undefined;
    loadChannelSecrets?: (options?: BundledEntryModuleLoadOptions) => ChannelPlugin["secrets"] | undefined;
    loadChannelAccountInspector?: (options?: BundledEntryModuleLoadOptions) => NonNullable<ChannelPlugin["config"]["inspectAccount"]>;
    setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
};
/** Runtime contract returned by a bundled channel's setup-only entrypoint definition. */
export type BundledChannelSetupEntryContract<TPlugin = ChannelPlugin> = {
    kind: "bundled-channel-setup-entry";
    loadSetupPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
    loadSetupSecrets?: (options?: BundledEntryModuleLoadOptions) => ChannelPlugin["secrets"] | undefined;
    loadLegacyStateMigrationDetector?: (options?: BundledEntryModuleLoadOptions) => BundledChannelLegacyStateMigrationDetector;
    loadLegacySessionSurface?: (options?: BundledEntryModuleLoadOptions) => BundledChannelLegacySessionSurface;
    setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
    registerSetupRuntime?: (api: OpenClawPluginApi) => void;
    features?: BundledChannelSetupEntryFeatures;
};
/** Loads one export from a bundled channel sidecar module through the guarded entry boundary. */
export declare function loadBundledEntryExportSync<T>(importMetaUrl: string, reference: BundledEntryModuleRef, options?: BundledEntryModuleLoadOptions): T;
/** Defines the full bundled channel entry contract used by core plugin registration. */
export declare function defineBundledChannelEntry<TPlugin = ChannelPlugin>({ id, name, description, importMetaUrl, plugin, outbound, secrets, configSchema, runtime, accountInspect, features, registerCliMetadata, registerFull, }: DefineBundledChannelEntryOptions<TPlugin>): BundledChannelEntryContract<TPlugin>;
/** Defines the setup-only bundled channel entry contract for onboarding and migration surfaces. */
export declare function defineBundledChannelSetupEntry<TPlugin = ChannelPlugin>({ importMetaUrl, plugin, secrets, runtime, legacyStateMigrations, legacySessionSurface, registerSetupRuntime, features, }: DefineBundledChannelSetupEntryOptions): BundledChannelSetupEntryContract<TPlugin>;
