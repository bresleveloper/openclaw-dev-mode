import { d as ModelProviderConfig, l as ModelDefinitionConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../provider-model-types-DGw4ZQp7.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BitR1dNE.js";
export declare const HUGGINGFACE_BASE_URL: string;
export declare const HUGGINGFACE_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function discoverHuggingfaceModels(apiKey: string, timeoutMs?: number, options?: {
  discoveryMode?: "strict";
}): Promise<ModelDefinitionConfig[]>;
export declare function buildHuggingfaceProvider(discoveryApiKey?: string, options?: {
  discoveryMode?: "strict";
}): Promise<ModelProviderConfig>;
export declare const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";
declare const { applyConfig: applyHuggingfaceConfig }: ProviderOnboardPresetAppliers<[]>;
declare const { applyConfig: applyHuggingfaceConnectionConfig }: ProviderOnboardPresetAppliers<[]>;
export { applyHuggingfaceConfig };