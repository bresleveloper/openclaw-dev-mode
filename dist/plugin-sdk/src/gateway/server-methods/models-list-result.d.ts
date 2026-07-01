import type { ModelCatalogEntry } from "../../agents/model-catalog.types.js";
import type { GatewayRequestContext } from "./types.js";
type ModelsListEntry = ModelCatalogEntry & {
    available?: boolean;
};
export declare function buildModelsListResult(params: {
    context: GatewayRequestContext;
    agentId?: string;
    params: Record<string, unknown>;
    preloadedCatalog?: ModelCatalogEntry[];
}): Promise<{
    models: ModelsListEntry[];
}>;
export {};
