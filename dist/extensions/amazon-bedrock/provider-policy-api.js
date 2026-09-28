import { resolveBedrockClaudeThinkingProfile } from "./thinking-policy.js";
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
//#endregion
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
