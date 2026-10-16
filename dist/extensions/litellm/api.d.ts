import { i as ModelDefinitionConfig } from "../../types.openclaw-C-OasKBU.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-D9ID6ldl.js";
//#region extensions/litellm/onboard.d.ts
export declare const LITELLM_BASE_URL = "http://localhost:4000";
export declare const LITELLM_DEFAULT_MODEL_ID = "claude-opus-4-6";
export declare const LITELLM_DEFAULT_MODEL_REF = "litellm/claude-opus-4-6";
export declare function buildLitellmModelDefinition(): ModelDefinitionConfig;
declare const { applyConfig: applyLitellmConfig, applyProviderConfig: applyLitellmProviderConfig }: ProviderOnboardPresetAppliers<[]>;
//#endregion
export { applyLitellmConfig, applyLitellmProviderConfig };