import type { PluginInstallRecord } from "../../config/types.plugins.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
import { type PluginInstallSourceInfo } from "../../plugins/install-source-info.js";
import type { PluginPackageInstall } from "../../plugins/manifest.js";
import type { PluginOrigin } from "../../plugins/plugin-origin.types.js";
import type { ChannelMeta } from "./types.public.js";
export type ChannelUiMetaEntry = {
    id: string;
    label: string;
    detailLabel: string;
    systemImage?: string;
};
export type ChannelUiCatalog = {
    entries: ChannelUiMetaEntry[];
    order: string[];
    labels: Record<string, string>;
    detailLabels: Record<string, string>;
    systemImages: Record<string, string>;
    byId: Record<string, ChannelUiMetaEntry>;
};
export type ChannelPluginCatalogInstall = PluginPackageInstall & ({
    clawhubSpec: string;
} | {
    npmSpec: string;
});
export type ChannelPluginCatalogEntry = {
    id: string;
    pluginId?: string;
    origin?: PluginOrigin;
    trustedSourceLinkedOfficialInstall?: boolean;
    meta: ChannelMeta;
    install: ChannelPluginCatalogInstall;
    installSource?: PluginInstallSourceInfo;
};
type CatalogOptions = {
    workspaceDir?: string;
    catalogPaths?: string[];
    officialCatalogPaths?: string[];
    env?: NodeJS.ProcessEnv;
    extraPaths?: string[];
    excludeWorkspace?: boolean;
    excludeOrigins?: PluginOrigin[];
    excludePluginRefs?: Array<{
        pluginId: string;
        origin?: PluginOrigin;
    }>;
    installRecords?: Record<string, PluginInstallRecord>;
    discovery?: PluginDiscoveryResult;
};
export declare function buildChannelUiCatalog(plugins: Array<{
    id: string;
    meta: ChannelMeta;
}>): ChannelUiCatalog;
/**
 * Raw catalog primitive. This may include untrusted workspace entries and
 * workspace shadows. Security-sensitive or execution-facing callers should
 * prefer `listTrustedChannelPluginCatalogEntries`; use this primitive only when
 * the caller immediately applies trust filtering or explicitly excludes
 * workspace entries.
 *
 * @internal
 */
export declare function listRawChannelPluginCatalogEntries(options?: CatalogOptions): ChannelPluginCatalogEntry[];
/**
 * @deprecated Use `listTrustedChannelPluginCatalogEntries` for execution-facing
 * paths, or `listRawChannelPluginCatalogEntries` for internal plumbing
 * that applies its own trust filtering.
 */
export declare function listChannelPluginCatalogEntries(options?: CatalogOptions): ChannelPluginCatalogEntry[];
export declare function getChannelPluginCatalogEntry(id: string, options?: CatalogOptions): ChannelPluginCatalogEntry | undefined;
export {};
