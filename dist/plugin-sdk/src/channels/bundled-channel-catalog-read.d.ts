import type { PluginPackageChannel } from "../plugins/manifest.js";
type BundledChannelCatalogEntry = {
    id: string;
    channel: PluginPackageChannel;
    aliases: readonly string[];
    order: number;
};
/**
 * Lists bundled channel catalog entries from package manifests and generated catalog files.
 */
export declare function listBundledChannelCatalogEntries(): BundledChannelCatalogEntry[];
export {};
