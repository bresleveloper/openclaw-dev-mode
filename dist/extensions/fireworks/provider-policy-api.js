import { resolveFireworksThinkingProfile } from "./thinking-policy.js";
//#region extensions/fireworks/provider-policy-api.ts
function resolveThinkingProfile(params) {
	return resolveFireworksThinkingProfile(params.modelId);
}
//#endregion
export { resolveThinkingProfile };
