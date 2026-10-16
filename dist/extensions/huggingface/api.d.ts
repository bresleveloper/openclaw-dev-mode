import { i as ModelDefinitionConfig, n as OpenClawConfig, s as ModelProviderConfig } from "../../types.openclaw-DA3BMvaX.js";
import "../../provider-model-types-DmUyUlx5.js";
//#region extensions/huggingface/models.d.ts
export declare const HUGGINGFACE_BASE_URL: string;
export declare const HUGGINGFACE_POLICY_SUFFIXES: readonly ["cheapest", "fastest"];
export declare const HUGGINGFACE_MODEL_CATALOG: ModelDefinitionConfig[];
export declare function isHuggingfacePolicyLocked(modelRef: string): boolean;
export declare function discoverHuggingfaceModels(apiKey: string, timeoutMs?: number, options?: {
  discoveryMode?: "strict";
}): Promise<ModelDefinitionConfig[]>;
//#endregion
//#region extensions/huggingface/provider-catalog.d.ts
export declare function buildHuggingfaceProvider(discoveryApiKey?: string, options?: {
  discoveryMode?: "strict";
}): Promise<ModelProviderConfig>;
//#endregion
//#region src/plugin-sdk/provider-onboard.d.ts
/** Pair of preset appliers exposed by provider setup modules. */
type ProviderOnboardPresetAppliers<TArgs extends unknown[]> = {
  applyProviderConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
  applyConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
};
//#endregion
//#region extensions/huggingface/onboard.d.ts
export declare const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";
declare const { applyConfig: applyHuggingfaceConfig }: ProviderOnboardPresetAppliers<[]>;
declare const { applyConfig: applyHuggingfaceConnectionConfig }: ProviderOnboardPresetAppliers<[]>;
//#endregion
export { applyHuggingfaceConfig };