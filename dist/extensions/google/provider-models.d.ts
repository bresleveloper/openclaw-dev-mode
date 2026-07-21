import { Hf as ProviderRuntimeModel } from "../../types-BpDhk2ev.js";
import { Kt as ProviderResolveDynamicModelContext } from "../../plugin-entry-L7QTXRH5.js";

//#region extensions/google/provider-models.d.ts
declare function resolveGoogleGeminiForwardCompatModel(params: {
  providerId: string;
  templateProviderId?: string;
  ctx: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function isModernGoogleModel(modelId: string): boolean;
//#endregion
export { isModernGoogleModel, resolveGoogleGeminiForwardCompatModel };