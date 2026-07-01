/** Normalize provider ids for catalog refs. */
export declare function normalizeModelCatalogProviderId(provider: string): string;
/** Build a provider/model catalog reference. */
export declare function buildModelCatalogRef(provider: string, modelId: string): string;
/** Build a case-insensitive merge key for provider/model rows. */
export declare function buildModelCatalogMergeKey(provider: string, modelId: string): string;
