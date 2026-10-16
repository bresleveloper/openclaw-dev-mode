import { i as resolveGoogleThinkingProfile, t as normalizeGoogleProviderConfig } from "../../provider-policy-4Ba5tPL0.mjs";
//#region extensions/google/provider-policy-api.ts
function normalizeConfig(params) {
	return normalizeGoogleProviderConfig(params.provider, params.providerConfig);
}
//#endregion
export { normalizeConfig, resolveGoogleThinkingProfile as resolveThinkingProfile };
