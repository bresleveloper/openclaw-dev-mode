import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves provider/model refs used to scope model catalog discovery. */
export declare function resolveModelCatalogScope(params: {
    cfg?: OpenClawConfig;
    provider: string;
    model: string;
}): {
    providerRefs: string[];
    modelRefs: string[];
};
/** Extracts provider ids from resolved catalog scope refs for discovery calls. */
export declare function resolveProviderDiscoveryProviderIdsForCatalogScope(params: {
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
}): string[] | undefined;
