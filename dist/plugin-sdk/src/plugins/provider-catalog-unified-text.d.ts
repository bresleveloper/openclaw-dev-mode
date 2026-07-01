/** Builds unified text-inference provider catalog metadata from plugin providers. */
import type { UnifiedModelCatalogEntry } from "@openclaw/model-catalog-core/model-catalog-types";
import type { ProviderCatalogResult } from "./types.js";
/** Projects plugin provider catalog results into unified text-model catalog rows. */
export declare function projectProviderCatalogResultToUnifiedTextRows(params: {
    providerId: string;
    result: ProviderCatalogResult;
    source: UnifiedModelCatalogEntry["source"];
}): UnifiedModelCatalogEntry[];
