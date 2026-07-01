import type { PluginPackageInstall } from "./manifest.js";
import type { PluginWebSearchProviderEntry } from "./web-provider-types.js";
/** Install catalog entry for an official external web-search provider plugin. */
export type WebSearchInstallCatalogEntry = {
    pluginId: string;
    label: string;
    install: PluginPackageInstall;
    provider: PluginWebSearchProviderEntry;
    trustedSourceLinkedOfficialInstall?: boolean;
};
/** Lists web-search provider install catalog entries from official external plugins. */
export declare function resolveWebSearchInstallCatalogEntries(): WebSearchInstallCatalogEntry[];
/** Lists credential-backed web provider plugins selected by documented environment variables. */
export declare function resolveWebSearchInstallCatalogEntriesForEnv(env: NodeJS.ProcessEnv): WebSearchInstallCatalogEntry[];
/** Resolves one web-search install catalog entry by provider id or plugin id. */
export declare function resolveWebSearchInstallCatalogEntry(params: {
    providerId?: string;
    pluginId?: string;
}): WebSearchInstallCatalogEntry | undefined;
