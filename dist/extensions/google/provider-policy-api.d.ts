import { f as ModelProviderConfig } from "../../types.models-BvJnk7Su.js";
import { Vf as ProviderThinkingProfile } from "../../types-BpDhk2ev.js";
import { wt as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-L7QTXRH5.js";
//#region extensions/google/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeConfig, resolveThinkingProfile };