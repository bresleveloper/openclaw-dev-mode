import { resolveClaudeModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/amazon-bedrock/bedrock-options.ts
function resolveBedrockPromptCachePolicy(model) {
	const modelId = model.id.trim().toLowerCase().replace(/^arn:aws(?:-cn|-us-gov)?:bedrock:[^:]+:[^:]*:(?:foundation-model|inference-profile)\//, "").replace(/^(?:us|eu|apac|jp|global)\./, "");
	if (/^amazon\.nova-(?:micro|lite|pro|premier|2-lite)-v1:0$/.test(modelId)) return "nova";
	if (supportsBedrockClaudePromptCaching(model.id, model.name) || supportsBedrockClaudePromptCaching(resolveClaudeModelIdentity(model), model.name)) return "claude";
}
function resolveBedrockCachePoint(model, retention) {
	const policy = resolveBedrockPromptCachePolicy(model);
	if (!policy || retention === "none") return;
	return {
		type: "default",
		...policy === "claude" && retention === "long" ? { ttl: "1h" } : {}
	};
}
function getModelMatchCandidates(modelId, modelName) {
	return (modelName ? [modelId, modelName] : [modelId]).flatMap((value) => {
		const lower = value.toLowerCase();
		return [lower, lower.replace(/[\s_.:]+/g, "-")];
	});
}
/** Return whether a Bedrock model is known to support Anthropic prompt caching. */
function supportsBedrockClaudePromptCaching(modelId, modelName) {
	const candidates = getModelMatchCandidates(modelId, modelName);
	if (!candidates.some((s) => s.includes("claude"))) {
		if (typeof process !== "undefined" && process.env.AWS_BEDROCK_FORCE_CACHE === "1") return true;
		return false;
	}
	return candidates.some((candidate) => candidate.includes("-4-") || /claude-(?:fable-5|mythos-5|opus-5|sonnet-5|3-7-sonnet|3-5-haiku)/.test(candidate));
}
//#endregion
export { resolveBedrockCachePoint, resolveBedrockPromptCachePolicy, supportsBedrockClaudePromptCaching };
