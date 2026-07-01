/**
 * Builds the operator-facing effective inventory for bundle MCP tools. Runtime
 * schema policy quarantines incompatible tools and emits notices instead of
 * silently hiding them.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../plugins/provider-runtime-model.types.js";
import type { EffectiveToolInventoryEntry, EffectiveToolInventoryNotice } from "./tools-effective-inventory.types.js";
import type { AnyAgentTool } from "./tools/common.js";
/** Builds the runtime-compatible MCP tool inventory and quarantine notices. */
export declare function buildRuntimeCompatibleMcpToolInventory(params: {
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
