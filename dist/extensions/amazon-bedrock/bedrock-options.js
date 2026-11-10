import { resolveClaudeModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/amazon-bedrock/bedrock-options.ts
/** Nova requires explicit opt-in; other models retain the existing env/default policy. */
function resolveBedrockCacheRetention(policy, cacheRetention) {
	if (cacheRetention) return cacheRetention;
	if (policy === "nova") return "none";
	if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") return "long";
	return "short";
}
function resolveBedrockPromptCachePolicy(model) {
	const modelId = model.id.trim().toLowerCase().replace(/^arn:aws(?:-cn|-us-gov)?:bedrock:[^:]+:[^:]*:(?:foundation-model|inference-profile)\//, "").replace(/^(?:us|eu|apac|jp|global)\./, "");
	if (/^amazon\.nova-(?:micro|lite|pro|premier|2-lite)-v1:0$/.test(modelId)) return "nova";
	return resolveBedrockClaudeCachePolicy(resolveClaudeModelIdentity(model), model.name);
}
function resolveBedrockCachePoint(policy, retention) {
	if (!policy || retention === "none") return;
	return {
		type: "default",
		...policy === "claude" && retention === "long" ? { ttl: "1h" } : {}
	};
}
function resolveBedrockClaudeCachePolicy(modelId, modelName) {
	const candidates = [modelId, modelName].map((id) => resolveClaudeModelIdentity({ id }));
	if (!candidates.some((s) => s.includes("claude"))) return typeof process !== "undefined" && process.env.AWS_BEDROCK_FORCE_CACHE === "1" ? "claude-short" : void 0;
	if (candidates.some((candidate) => /^claude-(?:haiku-(?:4-5|5-5)|sonnet-(?:4-[56]|5(?:-5)?)|opus-(?:4-[5-8]|5(?:-5)?)|(?:fable|mythos)-5(?:-1)?)(?:$|-v\d|-\d{8}(?:-|$))/.test(candidate))) return "claude";
	return candidates.some((candidate) => candidate.includes("-4-") || /^claude-(?:fable-5|mythos-5|opus-5|sonnet-5|haiku-5|3-7-sonnet|3-5-haiku)/.test(candidate)) ? "claude-short" : void 0;
}
//#endregion
export { resolveBedrockCachePoint, resolveBedrockCacheRetention, resolveBedrockPromptCachePolicy };
