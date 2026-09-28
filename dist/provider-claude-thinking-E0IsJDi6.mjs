import { c as resolveClaudeFable5ModelIdentity, f as resolveClaudeOpus55ModelIdentity, g as supportsClaudeAdaptiveThinking, i as CLAUDE_SONNET_5_THINKING_PROFILE, l as resolveClaudeModelIdentity, m as resolveClaudeSonnet5ModelIdentity, n as CLAUDE_OPUS_55_THINKING_PROFILE, p as resolveClaudeOpus5ModelIdentity, r as CLAUDE_OPUS_5_THINKING_PROFILE, s as requiresClaudeMandatoryAdaptiveThinking, t as CLAUDE_FABLE_5_THINKING_PROFILE, u as resolveClaudeMythos5ModelIdentity, y as supportsClaudeNativeXhighEffort } from "./anthropic-Cy4mTngV.mjs";
//#region src/plugins/provider-claude-thinking.ts
const BASE_CLAUDE_THINKING_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" }
];
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
function isClaudeAdaptiveThinkingDefaultModelId(modelId) {
	const ref = { id: modelId };
	return supportsClaudeAdaptiveThinking(ref) && !supportsClaudeNativeXhighEffort(ref);
}
/** @deprecated Anthropic provider-owned model helper; do not use from third-party plugins. */
function resolveClaudeThinkingProfile(modelId, params, options) {
	const ref = {
		id: modelId,
		params
	};
	const canonicalModelId = resolveClaudeModelIdentity(ref);
	if (resolveClaudeOpus55ModelIdentity(ref)) return CLAUDE_OPUS_55_THINKING_PROFILE;
	if (resolveClaudeFable5ModelIdentity(ref)) return CLAUDE_FABLE_5_THINKING_PROFILE;
	if (resolveClaudeMythos5ModelIdentity(ref)) return {
		...CLAUDE_FABLE_5_THINKING_PROFILE,
		defaultLevel: "high"
	};
	if (resolveClaudeOpus5ModelIdentity(ref)) return CLAUDE_OPUS_5_THINKING_PROFILE;
	if (resolveClaudeSonnet5ModelIdentity(ref)) return CLAUDE_SONNET_5_THINKING_PROFILE;
	if (requiresClaudeMandatoryAdaptiveThinking(ref)) return {
		levels: [...BASE_CLAUDE_THINKING_LEVELS.slice(1), { id: "adaptive" }],
		defaultLevel: "adaptive",
		preserveWhenCatalogReasoningFalse: true
	};
	if (supportsClaudeNativeXhighEffort(ref)) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "xhigh" },
			{ id: "adaptive" },
			{ id: "max" }
		],
		defaultLevel: "off"
	};
	if (isClaudeAdaptiveThinkingDefaultModelId(canonicalModelId)) return {
		levels: [
			...BASE_CLAUDE_THINKING_LEVELS,
			{ id: "adaptive" },
			...options?.includeNativeMax ? [{ id: "max" }] : []
		],
		defaultLevel: "adaptive"
	};
	return { levels: BASE_CLAUDE_THINKING_LEVELS };
}
//#endregion
export { resolveClaudeThinkingProfile as n, isClaudeAdaptiveThinkingDefaultModelId as t };
