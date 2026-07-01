import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../plugins/provider-runtime-model.types.js";
import type { EffectiveToolInventoryEntry, EffectiveToolInventoryNotice } from "./tools-effective-inventory.types.js";
import type { AnyAgentTool } from "./tools/common.js";
/** Builds effective inventory entries from already runtime-compatible tools. */
export declare function buildEffectiveToolInventoryEntries(tools: readonly AnyAgentTool[], rawToolsByName?: ReadonlyMap<string, AnyAgentTool>): EffectiveToolInventoryEntry[];
/** Normalizes tools, quarantines incompatible schemas, and returns inventory output. */
export declare function buildRuntimeCompatibleToolInventory(params: {
    tools: readonly AnyAgentTool[];
    cfg: OpenClawConfig;
    workspaceDir?: string;
    modelProvider?: string;
    modelId?: string;
    modelApi?: string | null;
    runtimeModel?: ProviderRuntimeModel;
}): {
    entries: EffectiveToolInventoryEntry[];
    notices: EffectiveToolInventoryNotice[];
};
