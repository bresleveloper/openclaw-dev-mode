import { f as ModelProviderConfig } from "../../types.models-Nc1Z-tAz.js";
import { Cu as ProviderThinkingProfile } from "../../types-BVLQjFJF.js";
//#region extensions/openai/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(params: {
  provider: string;
  modelId: string;
}): ProviderThinkingProfile | null;
//#endregion
export { normalizeConfig, resolveThinkingProfile };