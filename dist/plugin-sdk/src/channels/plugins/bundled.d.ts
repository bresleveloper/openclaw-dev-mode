import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { BundledChannelLegacySessionSurface, BundledChannelLegacyStateMigrationDetector } from "../../plugin-sdk/channel-entry-contract.types.js";
import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";
type PluginRuntime = import("../../plugins/runtime/types.js").PluginRuntime;
type BundledChannelPackageSetupFeature = "configPromotion" | "legacyStateMigrations" | "legacySessionSurfaces";
export declare function describeBundledChannelLoadError(error: unknown, channelId: string): string;
export declare function listBundledChannelPluginIds(): readonly ChannelId[];
export declare function hasBundledChannelPackageSetupFeature(id: ChannelId, feature: BundledChannelPackageSetupFeature): boolean;
export declare function listBundledChannelPlugins(): readonly ChannelPlugin[];
export declare function listBundledChannelSetupPlugins(): readonly ChannelPlugin[];
export declare function listBundledChannelLegacySessionSurfaces(options?: {
    config?: OpenClawConfig;
}): readonly BundledChannelLegacySessionSurface[];
export declare function listBundledChannelLegacyStateMigrationDetectors(options?: {
    config?: OpenClawConfig;
}): readonly BundledChannelLegacyStateMigrationDetector[];
export declare function getBundledChannelAccountInspector(id: ChannelId): NonNullable<ChannelPlugin["config"]["inspectAccount"]> | undefined;
export declare function getBundledChannelPlugin(id: ChannelId): ChannelPlugin | undefined;
export declare function getBundledChannelSecrets(id: ChannelId): ChannelPlugin["secrets"] | undefined;
export declare function getBundledChannelSetupPlugin(id: ChannelId, env?: NodeJS.ProcessEnv): ChannelPlugin | undefined;
export declare function getBundledChannelSetupSecrets(id: ChannelId, env?: NodeJS.ProcessEnv): ChannelPlugin["secrets"] | undefined;
export declare function setBundledChannelRuntime(id: ChannelId, runtime: PluginRuntime): void;
export {};
