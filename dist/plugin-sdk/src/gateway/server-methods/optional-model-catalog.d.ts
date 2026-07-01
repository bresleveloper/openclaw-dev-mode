import type { ModelCatalogEntry } from "../../agents/model-catalog.js";
import type { GatewayRequestContext } from "./types.js";
export type OptionalServerMethodModelCatalogLoad = {
    promise: Promise<ModelCatalogEntry[] | undefined>;
};
type LoadOptionalServerMethodModelCatalogOptions = {
    logOnceKey?: string;
    startedLoad?: OptionalServerMethodModelCatalogLoad;
    timeoutMs?: number;
};
export declare function startOptionalServerMethodModelCatalogLoad(context: GatewayRequestContext): OptionalServerMethodModelCatalogLoad;
/** Loads the gateway model catalog with a short timeout and one-time slow logs. */
export declare function loadOptionalServerMethodModelCatalog(context: GatewayRequestContext, surface: string, options?: LoadOptionalServerMethodModelCatalogOptions): Promise<ModelCatalogEntry[] | undefined>;
export {};
