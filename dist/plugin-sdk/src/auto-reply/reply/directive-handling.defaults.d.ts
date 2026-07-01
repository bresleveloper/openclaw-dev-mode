import { type ModelAliasIndex } from "../../agents/model-selection.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Resolve default provider/model plus alias index for directive parsing. */
export declare function resolveDefaultModel(params: {
    cfg: OpenClawConfig;
    agentId?: string;
}): {
    defaultProvider: string;
    defaultModel: string;
    aliasIndex: ModelAliasIndex;
};
