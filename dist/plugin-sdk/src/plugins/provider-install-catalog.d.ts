import { type PluginInstallSourceInfo } from "./install-source-info.js";
import type { PluginPackageInstall } from "./manifest.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
import { type ProviderAuthChoiceMetadata } from "./provider-auth-choices.js";
/** Provider setup choice paired with install metadata for the owning plugin. */
export type ProviderInstallCatalogEntry = ProviderAuthChoiceMetadata & {
    providerAliases?: string[];
    label: string;
    origin: PluginOrigin;
    install: PluginPackageInstall;
    installSource?: PluginInstallSourceInfo;
};
type ProviderInstallCatalogParams = {
    config?: import("../config/types.openclaw.js").OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includeUntrustedWorkspacePlugins?: boolean;
};
/** Lists install catalog entries for provider setup choices. */
export declare function resolveProviderInstallCatalogEntries(params?: ProviderInstallCatalogParams): ProviderInstallCatalogEntry[];
/** Resolves one provider install catalog entry by setup choice id. */
export declare function resolveProviderInstallCatalogEntry(choiceId: string, params?: ProviderInstallCatalogParams): ProviderInstallCatalogEntry | undefined;
/** Resolves an uninstalled provider's deprecated setup choice to its replacement entry. */
export declare function resolveDeprecatedProviderInstallCatalogEntry(choiceId: string, params?: ProviderInstallCatalogParams): ProviderInstallCatalogEntry | undefined;
export {};
