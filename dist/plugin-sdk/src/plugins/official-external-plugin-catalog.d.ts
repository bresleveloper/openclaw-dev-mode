import { MANIFEST_KEY } from "../compat/legacy-names.js";
import type { PluginManifestChannelConfig, PluginManifestContracts, PluginPackageInstall } from "./manifest.js";
type ManifestKey = typeof MANIFEST_KEY;
export type OfficialExternalProviderAuthChoice = {
    method?: string;
    choiceId?: string;
    deprecatedChoiceIds?: readonly string[];
    choiceLabel?: string;
    choiceHint?: string;
    assistantPriority?: number;
    assistantVisibility?: "visible" | "manual-only";
    groupId?: string;
    groupLabel?: string;
    groupHint?: string;
    optionKey?: string;
    cliFlag?: string;
    cliOption?: string;
    cliDescription?: string;
    onboardingScopes?: readonly ("text-inference" | "image-generation" | "music-generation")[];
};
export type OfficialExternalProviderCatalogProvider = {
    id?: string;
    aliases?: readonly string[];
    name?: string;
    docs?: string;
    categories?: readonly string[];
    envVars?: readonly string[];
    authChoices?: readonly OfficialExternalProviderAuthChoice[];
};
export type OfficialExternalWebSearchProvider = {
    id?: string;
    label?: string;
    hint?: string;
    onboardingScopes?: readonly "text-inference"[];
    requiresCredential?: boolean;
    credentialLabel?: string;
    envVars?: readonly string[];
    placeholder?: string;
    signupUrl?: string;
    docsUrl?: string;
    credentialPath?: string;
    autoDetectOrder?: number;
};
/** Manifest-like metadata stored in official external catalog entries. */
export type OfficialExternalPluginCatalogManifest = {
    plugin?: {
        id?: string;
        label?: string;
    };
    channel?: {
        id?: string;
        label?: string;
        envVars?: readonly string[];
    };
    providers?: readonly OfficialExternalProviderCatalogProvider[];
    webSearchProviders?: readonly OfficialExternalWebSearchProvider[];
    install?: PluginPackageInstall;
    contracts?: PluginManifestContracts;
    channelConfigs?: Record<string, PluginManifestChannelConfig>;
};
/** Raw official external catalog entry loaded from generated catalog JSON. */
export type OfficialExternalPluginCatalogEntry = {
    name?: string;
    version?: string;
    description?: string;
    source?: string;
    kind?: string;
} & Partial<Record<ManifestKey, OfficialExternalPluginCatalogManifest>>;
type OfficialExternalProviderContract = "embeddingProviders" | "mediaUnderstandingProviders" | "memoryEmbeddingProviders" | "speechProviders" | "webFetchProviders";
/** Returns manifest metadata from an official external catalog entry when present. */
export declare function getOfficialExternalPluginCatalogManifest(entry: OfficialExternalPluginCatalogEntry): OfficialExternalPluginCatalogManifest | undefined;
export declare function resolveOfficialExternalPluginId(entry: OfficialExternalPluginCatalogEntry): string | undefined;
export declare function resolveOfficialExternalPluginLabel(entry: OfficialExternalPluginCatalogEntry): string;
export declare function resolveOfficialExternalPluginInstall(entry: OfficialExternalPluginCatalogEntry): PluginPackageInstall | null;
export declare function listOfficialExternalPluginCatalogEntries(): OfficialExternalPluginCatalogEntry[];
/** Resolves official external plugin owners for configured capability provider ids. */
export declare function resolveOfficialExternalProviderContractPluginIds(params: {
    contract: OfficialExternalProviderContract;
    providerIds: ReadonlySet<string>;
}): string[];
/** Resolves official web provider owners from matching documented environment credentials. */
export declare function resolveOfficialExternalWebProviderContractPluginIdsForEnv(params: {
    contract: OfficialExternalProviderContract;
    env: NodeJS.ProcessEnv;
}): string[];
/** Resolves official external plugin owners for configured model provider ids. */
export declare function resolveOfficialExternalProviderPluginIds(params: {
    providerIds: ReadonlySet<string>;
}): string[];
/** Resolves official external provider owners with configured environment credentials. */
export declare function resolveOfficialExternalProviderPluginIdsForEnv(env: NodeJS.ProcessEnv): string[];
export declare function listOfficialExternalChannelCatalogEntries(): OfficialExternalPluginCatalogEntry[];
export declare function listOfficialExternalChannelEnvVars(): Array<{
    channelId: string;
    envVars: readonly string[];
}>;
export declare function listOfficialExternalProviderCatalogEntries(): OfficialExternalPluginCatalogEntry[];
export declare function getOfficialExternalPluginCatalogEntry(pluginId: string): OfficialExternalPluginCatalogEntry | undefined;
export declare function getOfficialExternalPluginCatalogEntryForPackage(packageName: string | undefined): OfficialExternalPluginCatalogEntry | undefined;
export {};
