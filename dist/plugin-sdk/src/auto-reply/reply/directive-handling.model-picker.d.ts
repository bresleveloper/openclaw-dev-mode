import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Catalog entry shown by the model picker directive UI. */
export type ModelPickerCatalogEntry = {
    provider: string;
    id: string;
    name?: string;
};
/** Resolves optional endpoint/API labels for a provider in picker details. */
export declare function resolveProviderEndpointLabel(provider: string, cfg: OpenClawConfig): {
    endpoint?: string;
    api?: string;
};
