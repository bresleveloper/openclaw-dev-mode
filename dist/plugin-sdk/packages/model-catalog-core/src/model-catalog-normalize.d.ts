import { type ModelCatalog, type ModelCatalogProvider, type ModelCatalogSource, type NormalizedModelCatalogRow } from "./model-catalog-types.js";
/** Normalize a raw model catalog object for the set of providers owned by a plugin/manifest. */
export declare function normalizeModelCatalog(value: unknown, params: {
    ownedProviders: ReadonlySet<string>;
}): ModelCatalog | undefined;
/** Normalize one provider catalog into sorted runtime rows. */
export declare function normalizeModelCatalogProviderRows(params: {
    provider: string;
    providerCatalog: ModelCatalogProvider;
    source: ModelCatalogSource;
}): NormalizedModelCatalogRow[];
/** Normalize all provider catalogs into sorted runtime rows. */
export declare function normalizeModelCatalogRows(params: {
    providers: Record<string, ModelCatalogProvider>;
    source: ModelCatalogSource;
}): NormalizedModelCatalogRow[];
