import { H as ModelProviderConfig, z as ModelDefinitionConfig } from "../../types-D7I_F5Ux.js";
import "../../provider-model-types-CgVL4xyM.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BNuhTHon.js";
//#region extensions/huggingface/models.d.ts
export declare const HUGGINGFACE_BASE_URL: string;
export declare const HUGGINGFACE_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function discoverHuggingfaceModels(apiKey: string, timeoutMs?: number, options?: {
  discoveryMode?: "strict";
}): Promise<ModelDefinitionConfig[]>;
//#endregion
//#region extensions/huggingface/provider-catalog.d.ts
export declare function buildHuggingfaceProvider(discoveryApiKey?: string, options?: {
  discoveryMode?: "strict";
}): Promise<ModelProviderConfig>;
//#endregion
//#region extensions/huggingface/onboard.d.ts
export declare const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";
declare const { applyConfig: applyHuggingfaceConfig }: ProviderOnboardPresetAppliers<[]>;
declare const { applyConfig: applyHuggingfaceConnectionConfig }: ProviderOnboardPresetAppliers<[]>;
//#endregion
export { applyHuggingfaceConfig };