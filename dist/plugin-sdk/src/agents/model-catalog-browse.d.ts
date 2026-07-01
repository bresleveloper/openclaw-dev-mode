import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
/** Visible model subset requested by model browse callers. */
export type ModelCatalogBrowseView = "default" | "configured" | "all";
/** True when a browse view cannot be answered from read-only cached catalog entries. */
export declare function modelCatalogBrowseRequiresFullDiscovery(params: {
    cfg: OpenClawConfig;
    view?: ModelCatalogBrowseView;
}): boolean;
/** Loads catalog entries for browse views, using read-only discovery unless full catalog is required. */
export declare function loadModelCatalogForBrowse(params: {
    cfg: OpenClawConfig;
    view?: ModelCatalogBrowseView;
    loadCatalog: (params: {
        readOnly: boolean;
    }) => Promise<ModelCatalogEntry[]>;
    timeoutMs?: number;
    onTimeout?: (timeoutMs: number) => void;
}): Promise<ModelCatalogEntry[]>;
