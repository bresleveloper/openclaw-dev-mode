//#region packages/llm-core/src/model-contracts/anthropic.ts
function normalizeClaudeModelId(modelId) {
	const normalized = modelId?.trim().toLowerCase() ?? "";
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
const CLAUDE_FABLE_5_THINKING_PROFILE = {
	levels: [
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "max" }
	],
	defaultLevel: "medium",
	preserveWhenCatalogReasoningFalse: true
};
const CLAUDE_SONNET_5_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "minimal" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "adaptive" },
		{ id: "max" }
	],
	defaultLevel: "high"
};
const CLAUDE_OPUS_5_THINKING_PROFILE = CLAUDE_SONNET_5_THINKING_PROFILE;
const CLAUDE_OPUS_55_THINKING_PROFILE = CLAUDE_FABLE_5_THINKING_PROFILE;
const CLAUDE_SONNET_55_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "xhigh" },
		{ id: "max" }
	],
	defaultLevel: "high"
};
const CLAUDE_HAIKU_55_THINKING_PROFILE = {
	...CLAUDE_SONNET_55_THINKING_PROFILE,
	defaultLevel: "medium"
};
/** Resolve Haiku 5.5 through direct ids, cloud ids, aliases, or deployment metadata. */
function resolveClaudeHaiku55ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	if (normalized === "haiku" || normalized === "haiku-5-5") return "claude-haiku-5-5";
	return /^claude-haiku-5-5(?=$|[^a-z0-9])/.test(normalized) ? normalized : void 0;
}
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
function resolveClaudeModelIdentity(ref) {
	const normalized = normalizeClaudeModelId((typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0) ?? ref.id);
	return /(?:^|[-/])(claude-[^/]+)$/.exec(normalized)?.[1] ?? normalized;
}
function matchClaudeModelIdentity(normalized, pattern) {
	const match = pattern.exec(normalized);
	return match ? normalized.slice(match.index + (match[0].startsWith("-") ? 1 : 0)) : void 0;
}
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeFable5ModelIdentity(ref) {
	return matchClaudeModelIdentity(resolveClaudeModelIdentity(ref), /(?:^|-)claude-fable-5(?=$|[^a-z0-9])/);
}
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
function resolveClaudeMythos5ModelIdentity(ref) {
	return matchClaudeModelIdentity(resolveClaudeModelIdentity(ref), /(?:^|-)claude-mythos-5(?=$|[^a-z0-9])/);
}
/**
* Opus 5.5, Sonnet 5.5, Haiku 5.5, and Fable 5.1 require append-only runtime context.
* Extend only with live replay proof (Mythos 5.1 remains unproven).
*/
function bindsClaudeThinkingPrefix(ref) {
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus55ModelIdentity(ref) !== void 0 || resolveClaudeSonnet55ModelIdentity(ref) !== void 0 || /^claude-fable-5-1(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity(ref));
}
/** Return whether Claude accepts operator instructions within conversation history. */
function supportsClaudeInHistorySystemMessages(ref) {
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /^claude-opus-4-8(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity(ref));
}
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
function requiresClaudeMandatoryAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus55ModelIdentity(ref) !== void 0 || resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/** Resolve Claude Sonnet 5 through aliases, direct ids, cloud ids, or deployment metadata. */
function resolveClaudeSonnet5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const sonnet55Identity = resolveClaudeSonnet55ModelIdentity(ref);
	if (sonnet55Identity) return sonnet55Identity;
	if (normalized === "sonnet-5") return "claude-sonnet-5";
	return matchClaudeModelIdentity(normalized, /(?:^|-)claude-sonnet-5(?=$|[^a-z0-9])/);
}
/** Resolve the Sonnet 5.5 contract without matching other Sonnet 5 generations. */
function resolveClaudeSonnet55ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	if (normalized === "sonnet" || normalized === "sonnet-5-5") return "claude-sonnet-5-5";
	return /^claude-sonnet-5-5(?=$|[^a-z0-9])/.test(normalized) ? normalized : void 0;
}
/** Resolve Claude Opus 5 through aliases, direct ids, cloud ids, or deployment metadata. */
function resolveClaudeOpus5ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	const opus55Identity = resolveClaudeOpus55ModelIdentity(ref);
	if (opus55Identity) return opus55Identity;
	if (normalized === "opus" || normalized === "opus-5") return "claude-opus-5";
	return matchClaudeModelIdentity(normalized, /(?:^|-)claude-opus-5(?=$|[^a-z0-9])/);
}
/** Resolve the Opus 5.5 contract without matching other Opus 5 generations. */
function resolveClaudeOpus55ModelIdentity(ref) {
	const normalized = resolveClaudeModelIdentity(ref);
	if (normalized === "opus" || normalized === "opus-5-5") return "claude-opus-5-5";
	return /^claude-opus-5-5(?=$|[^a-z0-9])/.test(normalized) ? normalized : void 0;
}
/** Return whether a Claude model supports adaptive thinking. */
function supportsClaudeAdaptiveThinking(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-4-6)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model has a native 1M-token context window. */
function supportsClaude1MContext(ref) {
	return supportsClaudeAdaptiveThinking(ref);
}
/** Return whether a Claude model supports Anthropic's native fast mode. */
function supportsClaudeFastMode(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-opus-4-8(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native max effort. */
function supportsClaudeNativeMaxEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:6|7|8)|sonnet-4-6)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native xhigh effort. */
function supportsClaudeNativeXhighEffort(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model rejects caller-selected sampling parameters. */
function requiresClaudeDefaultSampling(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return supportsClaudeNativeXhighEffort(ref) || /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(modelId);
}
/**
* Fill native Claude effort mappings only when the provider did not publish a
* narrower route-specific contract.
*/
function resolveClaudeNativeThinkingLevelMap(ref) {
	if (ref.thinkingLevelMap !== void 0) return ref.thinkingLevelMap;
	if (!supportsClaudeNativeMaxEffort(ref)) return;
	return {
		xhigh: supportsClaudeNativeXhighEffort(ref) ? "xhigh" : null,
		max: "max"
	};
}
//#endregion
export { supportsClaudeNativeMaxEffort as C, supportsClaudeInHistorySystemMessages as S, resolveClaudeSonnet55ModelIdentity as _, CLAUDE_SONNET_55_THINKING_PROFILE as a, supportsClaudeAdaptiveThinking as b, requiresClaudeDefaultSampling as c, resolveClaudeHaiku55ModelIdentity as d, resolveClaudeModelIdentity as f, resolveClaudeOpus5ModelIdentity as g, resolveClaudeOpus55ModelIdentity as h, CLAUDE_OPUS_5_THINKING_PROFILE as i, requiresClaudeMandatoryAdaptiveThinking as l, resolveClaudeNativeThinkingLevelMap as m, CLAUDE_HAIKU_55_THINKING_PROFILE as n, CLAUDE_SONNET_5_THINKING_PROFILE as o, resolveClaudeMythos5ModelIdentity as p, CLAUDE_OPUS_55_THINKING_PROFILE as r, bindsClaudeThinkingPrefix as s, CLAUDE_FABLE_5_THINKING_PROFILE as t, resolveClaudeFable5ModelIdentity as u, resolveClaudeSonnet5ModelIdentity as v, supportsClaudeNativeXhighEffort as w, supportsClaudeFastMode as x, supportsClaude1MContext as y };
