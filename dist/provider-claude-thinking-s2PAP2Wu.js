import { c as resolveClaudeModelIdentity, f as supportsClaudeNativeXhighEffort, o as CLAUDE_FABLE_5_THINKING_PROFILE, s as resolveClaudeFable5ModelIdentity, u as supportsClaudeAdaptiveThinking } from "./src-M7TBQdDX.js";
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
	if (resolveClaudeFable5ModelIdentity(ref)) return CLAUDE_FABLE_5_THINKING_PROFILE;
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
