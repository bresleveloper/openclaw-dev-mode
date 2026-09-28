import { resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity, resolveClaudeThinkingProfile } from "openclaw/plugin-sdk/claude-model-runtime";
//#region extensions/amazon-bedrock/thinking-policy.ts
const BASE_CLAUDE_THINKING_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" }
];
function isOpus5BedrockModelRef(modelRef) {
	return /(?:^|[/.:])(?:(?:us|eu|ap|apac|au|jp|global)\.)?(?:anthropic\.)?claude-opus-5(?:$|[-.:/])/i.test(modelRef);
}
function isOpus47Or48BedrockModelRef(modelRef) {
	return /(?:^|[/.:])(?:(?:us|eu|ap|apac|au|jp|global)\.)?(?:anthropic\.)?claude-opus-4[.-][78](?:$|[-.:/])/i.test(modelRef);
}
function isOpus46BedrockModelRef(modelRef) {
	return /(?:^|[/.:])(?:(?:us|eu|ap|apac|au|jp|global)\.)?(?:anthropic\.)?claude-opus-4[.-]6(?:$|[-.:/])/i.test(modelRef);
}
/** Return whether a Bedrock model ref names Claude Opus 4.7 or newer. */
function isOpus47OrNewerBedrockModelRef(modelRef) {
	return isOpus5BedrockModelRef(modelRef) || isOpus47Or48BedrockModelRef(modelRef);
}
function isMythosPreviewBedrockModelRef(modelRef) {
	return /(?:^|[/.:])(?:(?:us|eu|ap|apac|au|jp|global)\.)?(?:anthropic\.)?claude-mythos-preview(?:$|[-.:/])/i.test(modelRef);
}
/** Return whether a Bedrock Claude ref needs latest adaptive-thinking request shaping. */
function isLatestAdaptiveBedrockModelRef(modelId, params) {
	const modelRef = {
		id: modelId,
		params
	};
	const canonicalModelId = resolveClaudeModelIdentity(modelRef);
	return resolveClaudeFable5ModelIdentity(modelRef) !== void 0 || resolveClaudeMythos5ModelIdentity(modelRef) !== void 0 || resolveClaudeOpus5ModelIdentity(modelRef) !== void 0 || resolveClaudeSonnet5ModelIdentity(modelRef) !== void 0 || [modelId, canonicalModelId].some((candidate) => isOpus47OrNewerBedrockModelRef(candidate) || isMythosPreviewBedrockModelRef(candidate));
}
/** Return whether a Bedrock Claude ref supports max effort. */
function supportsBedrockNativeMaxEffort(modelId, params) {
	if (resolveClaudeFable5ModelIdentity({
		id: modelId,
		params
	}) || resolveClaudeMythos5ModelIdentity({
		id: modelId,
		params
	}) || resolveClaudeOpus5ModelIdentity({
		id: modelId,
		params
	}) || resolveClaudeSonnet5ModelIdentity({
		id: modelId,
		params
	})) return true;
	return [modelId, resolveClaudeModelIdentity({
		id: modelId,
		params
	})].some((modelRef) => isOpus46BedrockModelRef(modelRef) || isOpus47OrNewerBedrockModelRef(modelRef));
}
/** Resolve route-specific native effort mappings for Bedrock Claude models. */
function resolveBedrockNativeThinkingLevelMap(modelId, params) {
	const modelRef = {
		id: modelId,
		params
	};
	if (resolveClaudeFable5ModelIdentity(modelRef) || resolveClaudeMythos5ModelIdentity(modelRef)) return {
		off: "low",
		minimal: "low",
		xhigh: "xhigh",
		max: "max"
	};
	if (resolveClaudeOpus5ModelIdentity(modelRef)) return {
		xhigh: "xhigh",
		max: "max"
	};
	if (resolveClaudeSonnet5ModelIdentity(modelRef)) return {
		off: "low",
		minimal: "low",
		xhigh: "xhigh",
		max: "max"
	};
	if (!supportsBedrockNativeMaxEffort(modelId, params)) return;
	return {
		xhigh: [modelId, resolveClaudeModelIdentity(modelRef)].some(isOpus47OrNewerBedrockModelRef) ? "xhigh" : null,
		max: "max"
	};
}
/** Resolve supported Claude thinking levels for a Bedrock model id. */
function resolveBedrockClaudeThinkingProfile(modelId, params) {
	const trimmed = modelId.trim();
	const modelRefs = [trimmed, resolveClaudeModelIdentity({
		id: trimmed,
		params
	})];
	const fableModelId = resolveClaudeFable5ModelIdentity({
		id: trimmed,
		params
	});
	if (fableModelId || resolveClaudeMythos5ModelIdentity({
		id: trimmed,
		params
	}) || resolveClaudeSonnet5ModelIdentity({
		id: trimmed,
		params
	})) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "xhigh" },
			{ id: "adaptive" },
			{ id: "max" }
		],
		defaultLevel: fableModelId ? resolveClaudeThinkingProfile(fableModelId).defaultLevel : "high",
		preserveWhenCatalogReasoningFalse: true
	};
	if (resolveClaudeOpus5ModelIdentity({
		id: trimmed,
		params
	})) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "xhigh" },
			{ id: "adaptive" },
			{ id: "max" }
		],
		defaultLevel: "high"
	};
	if (modelRefs.some(isOpus47Or48BedrockModelRef)) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "xhigh" },
			{ id: "adaptive" },
			{ id: "max" }
		],
		defaultLevel: "off"
	};
	if (modelRefs.some(isOpus46BedrockModelRef)) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "adaptive" },
			{ id: "max" }
		],
		defaultLevel: "adaptive"
	};
	if (modelRefs.some(isMythosPreviewBedrockModelRef)) return {
		levels: [...BASE_CLAUDE_THINKING_LEVELS, { id: "adaptive" }],
		defaultLevel: "adaptive"
	};
	if (modelRefs.some((modelRef) => /claude-sonnet-4(?:\.|-)6(?:$|[-.])/i.test(modelRef))) return {
		levels: [...BASE_CLAUDE_THINKING_LEVELS, { id: "adaptive" }],
		defaultLevel: "adaptive"
	};
	return { levels: BASE_CLAUDE_THINKING_LEVELS };
}
//#endregion
export { isLatestAdaptiveBedrockModelRef, isOpus47OrNewerBedrockModelRef, resolveBedrockClaudeThinkingProfile, resolveBedrockNativeThinkingLevelMap, supportsBedrockNativeMaxEffort };
