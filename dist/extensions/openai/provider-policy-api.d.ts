import { f as ModelProviderConfig } from "../../types.models-BvJnk7Su.js";
import { Vf as ProviderThinkingProfile } from "../../types-BpDhk2ev.js";
import { wt as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-L7QTXRH5.js";
//#region extensions/openai/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(params: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | null;
//#endregion
export { normalizeConfig, resolveThinkingProfile };