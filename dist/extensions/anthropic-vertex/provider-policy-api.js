import { resolveClaudeThinkingProfile } from "openclaw/plugin-sdk/claude-model-runtime";
//#region extensions/anthropic-vertex/provider-policy-api.ts
/**
* Provider-policy API for Anthropic Vertex. Core asks for thinking profiles
* without importing the provider entry or stream runtime.
*/
/** Resolve Anthropic Vertex thinking profile for a provider/model pair. */
function resolveThinkingProfile(params) {
	if (params.provider.trim().toLowerCase() !== "anthropic-vertex") return null;
	return resolveClaudeThinkingProfile(params.modelId, params.params, { includeNativeMax: true });
}
//#endregion
export { resolveThinkingProfile };
