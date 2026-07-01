import { getRuntimeConfig } from "../config/io.js";
export type GatewayModelChoice = import("../agents/model-catalog.js").ModelCatalogEntry;
type GatewayModelCatalogConfig = ReturnType<typeof getRuntimeConfig>;
type LoadModelCatalog = (params: {
    config: GatewayModelCatalogConfig;
    readOnly?: boolean;
}) => Promise<GatewayModelChoice[]>;
type LoadGatewayModelCatalogParams = {
    getConfig?: () => GatewayModelCatalogConfig;
    loadModelCatalog?: LoadModelCatalog;
    readOnly?: boolean;
};
/** Mark cached model catalogs stale after config/plugin reload changes. */
export declare function markGatewayModelCatalogStaleForReload(): void;
export declare function resetModelCatalogCacheForTest(): Promise<void>;
/** Load the Gateway model catalog, returning cached data while stale refreshes run. */
export declare function loadGatewayModelCatalog(params?: LoadGatewayModelCatalogParams): Promise<GatewayModelChoice[]>;
export {};
