import type { NormalizedModelCatalogRow } from "@openclaw/model-catalog-core/model-catalog-types";
import type { OpenClawProviderIndex } from "./provider-index/index.js";
type ProviderIndexModelCatalogPlanEntry = {
    provider: string;
    pluginId: string;
    rows: readonly NormalizedModelCatalogRow[];
};
type ProviderIndexModelCatalogPlan = {
    rows: readonly NormalizedModelCatalogRow[];
    entries: readonly ProviderIndexModelCatalogPlanEntry[];
};
export declare function planProviderIndexModelCatalogRows(params: {
    index: OpenClawProviderIndex;
    providerFilter?: string;
}): ProviderIndexModelCatalogPlan;
export {};
