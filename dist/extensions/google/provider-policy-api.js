import { s as normalizeGoogleProviderConfig, u as resolveGoogleThinkingProfile } from "../../provider-policy-8nVd77O2.js";
//#region extensions/google/provider-policy-api.ts
function normalizeConfig(params) {
	return normalizeGoogleProviderConfig(params.provider, params.providerConfig);
}
function resolveThinkingProfile(context) {
	return resolveGoogleThinkingProfile(context);
}
//#endregion
export { normalizeConfig, resolveThinkingProfile };
