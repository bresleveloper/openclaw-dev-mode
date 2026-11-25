import { resolveFireworksThinkingProfile } from "./thinking-policy.js";
// extensions/fireworks/provider-policy-api.ts
function resolveThinkingProfile(params) {
	return resolveFireworksThinkingProfile(params.modelId);
}
export { resolveThinkingProfile };
