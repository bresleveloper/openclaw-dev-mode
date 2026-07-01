import type { ModelCatalogEntry, ModelInputType } from "./model-catalog.types.js";
/** Returns whether a catalog entry declares support for an input modality. */
export declare function modelSupportsInput(entry: ModelCatalogEntry | undefined, input: ModelInputType): boolean;
/** Finds a provider-qualified model entry in a catalog. */
export declare function findModelInCatalog(catalog: ModelCatalogEntry[], provider: string, modelId: string): ModelCatalogEntry | undefined;
/** Finds a model entry, requiring uniqueness when provider is omitted. */
export declare function findModelCatalogEntry(catalog: ModelCatalogEntry[], params: {
    provider?: string;
    modelId: string;
}): ModelCatalogEntry | undefined;
