import type { PluginPackageChannel } from "./manifest.js";
/** Lists channel metadata contributed by bundled package manifests. */
export declare function listBundledPackageChannelMetadata(): readonly PluginPackageChannel[];
/** Finds bundled package channel metadata by id or alias. */
export declare function findBundledPackageChannelMetadata(channelId: string): PluginPackageChannel | undefined;
