import { resolveBedrockClaudeThinkingProfile } from "./thinking-policy.js";
import { normalizeProviderId } from "openclaw/plugin-sdk/model-ref-parse";
//#region extensions/amazon-bedrock/provider-policy-api.ts
/**
* Provider-policy API for Amazon Bedrock. Core asks this plugin for thinking
* profiles without importing provider registration or streaming code.
*/
/** Resolve the Bedrock thinking profile for a provider/model pair. */
function resolveThinkingProfile(params) {
	if (normalizeProviderId(params.provider) !== "amazon-bedrock") return null;
	return resolveBedrockClaudeThinkingProfile(params.modelId, params.params);
}
//#endregion
export { resolveThinkingProfile };
