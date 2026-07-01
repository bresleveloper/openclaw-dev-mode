import { type ChannelPluginCatalogEntry } from "../../channels/plugins/catalog.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Resolve a catalog entry, falling back to non-workspace metadata when workspace entry is untrusted. */
export declare function getTrustedChannelPluginCatalogEntry(channelId: string, params: {
    cfg: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ChannelPluginCatalogEntry | undefined;
/** List trusted catalog entries, dropping untrusted workspace-only shadows. */
export declare function listTrustedChannelPluginCatalogEntries(params: {
    cfg: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ChannelPluginCatalogEntry[];
/** List setup discovery entries, preserving untrusted workspace-only entries for install prompts. */
export declare function listSetupDiscoveryChannelPluginCatalogEntries(params: {
    cfg: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ChannelPluginCatalogEntry[];
