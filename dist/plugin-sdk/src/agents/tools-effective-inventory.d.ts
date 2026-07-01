import type { OpenClawConfig } from "../config/config.js";
import type { ProviderRuntimeModel } from "../plugins/provider-runtime-model.types.js";
import type { EffectiveToolInventoryResult, ResolveEffectiveToolInventoryParams } from "./tools-effective-inventory.types.js";
/** Resolves the runtime model metadata needed to filter model-compatible tools. */
export declare function resolveEffectiveToolInventoryRuntimeModelContext(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    agentDir?: string;
    workspaceDir?: string;
    modelProvider?: string;
    modelId?: string;
}): {
    modelApi?: string;
    runtimeModel?: ProviderRuntimeModel;
};
/** Resolves the grouped effective tool inventory and user-visible filtering notices. */
export declare function resolveEffectiveToolInventory(params: ResolveEffectiveToolInventoryParams): EffectiveToolInventoryResult;
