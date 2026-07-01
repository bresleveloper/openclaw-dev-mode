import type { ChannelPluginCatalogEntry } from "../../channels/plugins/catalog.js";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelMeta } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelChoice } from "../onboard-types.js";
type ChannelCatalogEntry = {
    id: ChannelChoice;
    meta: ChannelMeta;
};
/** Return true when channel metadata should appear in setup/onboarding choices. */
export declare function shouldShowChannelInSetup(meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">): boolean;
type ResolvedChannelSetupEntries = {
    entries: ChannelCatalogEntry[];
    installedCatalogEntries: ChannelPluginCatalogEntry[];
    installableCatalogEntries: ChannelPluginCatalogEntry[];
    installedCatalogById: Map<ChannelChoice, ChannelPluginCatalogEntry>;
    installableCatalogById: Map<ChannelChoice, ChannelPluginCatalogEntry>;
};
/** List channel ids contributed by currently installed manifest-backed plugins. */
export declare function listManifestInstalledChannelIds(params: {
    cfg: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Set<ChannelChoice>;
/** Return true when a trusted catalog channel is already installed through plugin manifests. */
export declare function isCatalogChannelInstalled(params: {
    cfg: OpenClawConfig;
    entry: ChannelPluginCatalogEntry;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
/** Merge configured channels and installable catalog channels into setup display buckets. */
export declare function resolveChannelSetupEntries(params: {
    cfg: OpenClawConfig;
    installedPlugins: ChannelPlugin[];
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ResolvedChannelSetupEntries;
export {};
