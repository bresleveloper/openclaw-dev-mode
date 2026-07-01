import type { OpenClawPluginApi, UnifiedModelCatalogEntry, UnifiedModelCatalogKind, UnifiedModelCatalogProviderPlugin } from "../plugin-entry.js";
type RegistrablePlugin = {
    register(api: OpenClawPluginApi): void;
};
/** Verifies catalog rows are normalized and owned by the expected provider/kind. */
export declare function expectUnifiedModelCatalogEntries(rows: readonly UnifiedModelCatalogEntry[] | null | undefined, params: {
    provider: string;
    kind: UnifiedModelCatalogKind;
}): asserts rows is readonly UnifiedModelCatalogEntry[];
/** Registers a plugin and returns the matching unified model catalog provider. */
export declare function expectUnifiedModelCatalogProviderRegistration(params: {
    plugin: RegistrablePlugin;
    pluginId?: string;
    pluginName?: string;
    provider: string;
    kind: UnifiedModelCatalogKind;
}): UnifiedModelCatalogProviderPlugin;
export {};
