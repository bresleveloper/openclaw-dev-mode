import { wu as ProviderRuntimeModel } from "../../types-BVLQjFJF.js";
import { Kt as ProviderResolveDynamicModelContext } from "../../plugin-entry-DpILbQ7M.js";

//#region extensions/google/provider-models.d.ts
declare function resolveGoogleGeminiForwardCompatModel(params: {
  providerId: string;
  templateProviderId?: string;
  ctx: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function isModernGoogleModel(modelId: string): boolean;
//#endregion
export { isModernGoogleModel, resolveGoogleGeminiForwardCompatModel };