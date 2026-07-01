import type { ModelDefinitionConfig } from "../../../config/types.models.js";
/** Return true when a model entry matches the legacy Codex `/models add` default shape. */
export declare function isLegacyModelsAddCodexMetadataModel(params: {
    provider: string;
    model: Partial<ModelDefinitionConfig> | undefined;
}): boolean;
