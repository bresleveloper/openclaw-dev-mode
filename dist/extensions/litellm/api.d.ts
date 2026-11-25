import { l as ModelDefinitionConfig } from "../../types.openclaw-D8uW-XQA.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BitR1dNE.js";
export declare const LITELLM_BASE_URL = "http://localhost:4000";
export declare const LITELLM_DEFAULT_MODEL_ID = "claude-opus-4-6";
export declare const LITELLM_DEFAULT_MODEL_REF = "litellm/claude-opus-4-6";
export declare function buildLitellmModelDefinition(): ModelDefinitionConfig;
declare const { applyConfig: applyLitellmConfig, applyProviderConfig: applyLitellmProviderConfig }: ProviderOnboardPresetAppliers<[]>;
export { applyLitellmConfig, applyLitellmProviderConfig };