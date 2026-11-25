import { i as asOptionalRecord } from "./record-coerce-BgUo6bj4.mjs";
import "./diagnostics-DP1SXgAW.mjs";
import "./validation-BbkEkv9b.mjs";
// packages/llm-core/src/model-contracts/anthropic.ts
function readListedClaudeCapability(ref, capability) {
	const listed = ref.params?.claudeCapabilities;
	if (typeof listed !== "object" || listed === null) return;
	const value = Reflect.get(listed, capability);
	return typeof value === "boolean" ? value : void 0;
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
	const modelId = ((typeof ref.params?.canonicalModelId === "string" ? ref.params.canonicalModelId : void 0) ?? ref.id)?.trim().toLowerCase() ?? "";
	const normalized = (modelId.startsWith("anthropic/") ? modelId.slice(10) : modelId).replace(/[._\s]+/g, "-");
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
* Canonical Claude id for contract checks, with bare family aliases expanded.
* Undefined for ids that do not name a Claude model.
*/
function resolveClaudeContractId(ref) {
	const identity = resolveClaudeModelIdentity(ref);
	if (identity.startsWith("claude-")) return identity;
	return resolveClaudeOpus5ModelIdentity(ref) ?? resolveClaudeSonnet5ModelIdentity(ref) ?? resolveClaudeHaiku55ModelIdentity(ref);
}
function release(...ids) {
	return String.raw`(?:${ids.join("|")})(?!-\d(?!\d))`;
}
function releases(...patterns) {
	return new RegExp(String.raw`(?:^|-)(?:${patterns.join("|")})(?=$|[^a-z0-9])`);
}
const PRE_CLAUDE_5 = String.raw`claude-(?:3|(?:opus|sonnet|haiku)-4)`;
/** Generations whose thinking survives edits to earlier turns (no prefix check). */
const CLAUDE_UNBOUND_THINKING = releases(PRE_CLAUDE_5, release("claude-opus-5", "claude-sonnet-5", "claude-fable-5", "claude-mythos-5"), release("claude-mythos-preview"));
/** Generations that can run with thinking off (disabled or between-tools). */
const CLAUDE_OPTIONAL_THINKING = releases(PRE_CLAUDE_5, release("claude-opus-5", "claude-sonnet-5", "claude-sonnet-5-5", "claude-haiku-5-5"));
/** Generations that predate adaptive thinking. */
const CLAUDE_WITHOUT_ADAPTIVE_THINKING = releases(String.raw`claude-(?:3|(?:opus|sonnet|haiku)-4(?:-[0-5](?!\d))?(?!-\d(?!\d)))`);
/** Generations that predate the Claude 5 request contract (refusal stop reasons, adaptive default). */
const CLAUDE_BEFORE_5_CONTRACT = releases(PRE_CLAUDE_5, release("claude-mythos-preview"));
/** Generations whose requests keep a trailing assistant prefill. */
const CLAUDE_ASSISTANT_PREFILL = releases(PRE_CLAUDE_5, release("claude-mythos-preview", "claude-fable-5", "claude-fable-5-1"), release("claude-mythos-5", "claude-mythos-5-1"));
/**
* Released generations without native fast mode (`speed: "fast"`), verified live on
* 2026-11-10: the API answers "does not support the `speed` parameter". Opus 4.6 accepts
* the field but serves standard speed. Later models are offered fast mode; a rejection
* falls back to standard speed and is remembered (see readUnsupportedClaudeFastModeModel).
*/
const CLAUDE_WITHOUT_FAST_MODE = releases(String.raw`claude-(?:3|haiku-4|sonnet-4|opus-4(?!-8(?!\d)))`, release("claude-sonnet-5", "claude-sonnet-5-5", "claude-haiku-5-5"), release("claude-fable-5", "claude-fable-5-1"), release("claude-mythos-5", "claude-mythos-5-1", "claude-mythos-preview"));
/** Generations that still accept caller-selected temperature, top_p, and top_k. */
const CLAUDE_SAMPLING_PARAMETERS = releases(String.raw`claude-(?:3|haiku-4|sonnet-4|opus-4(?!-[78](?!\d)))`);
/**
* Whether thinking blocks are valid only after the exact request prefix that
* produced them, so runtime context must be appended instead of re-rendered.
* Every Claude model is prefix-bound except the closed list of older generations.
*/
function bindsClaudeThinkingPrefix(ref) {
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_UNBOUND_THINKING.test(id);
}
/** Whether a Claude model follows the Claude 5 request contract (streamed refusals, adaptive by default). */
function usesClaude5RequestContract(ref) {
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_BEFORE_5_CONTRACT.test(id);
}
/** Whether a Claude model rejects a trailing assistant prefill. */
function rejectsClaudeAssistantPrefill(ref) {
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_ASSISTANT_PREFILL.test(id);
}
/** Return whether Claude accepts operator instructions within conversation history. */
function supportsClaudeInHistorySystemMessages(ref) {
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || resolveClaudeFable5ModelIdentity(ref) !== void 0 || resolveClaudeMythos5ModelIdentity(ref) !== void 0 || /^claude-opus-4-8(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity(ref));
}
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
function requiresClaudeMandatoryAdaptiveThinking(ref) {
	const disabledThinking = readListedClaudeCapability(ref, "disabledThinking");
	if (disabledThinking !== void 0) return !disabledThinking && !requiresClaudeBetweenToolsThinking(ref) && supportsClaudeAdaptiveThinking(ref);
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_OPTIONAL_THINKING.test(id);
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
/** Sonnet 5.5 replaces disabled thinking with between-tool progress updates. */
function requiresClaudeBetweenToolsThinking(ref) {
	return resolveClaudeSonnet55ModelIdentity(ref) !== void 0;
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
/**
* Whether the id names a released Claude generation with adaptive thinking.
* Unlike {@link supportsClaudeAdaptiveThinking}, unknown Claude ids answer false,
* so providers can tell a released model from one they must map onto a template.
*/
function isReleasedAdaptiveClaudeGeneration(ref) {
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:6|7|8)|sonnet-4-6)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports adaptive thinking. */
function supportsClaudeAdaptiveThinking(ref) {
	const listed = readListedClaudeCapability(ref, "adaptiveThinking");
	if (listed !== void 0) return listed;
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_WITHOUT_ADAPTIVE_THINKING.test(id);
}
/** Return whether a Claude model has a native 1M-token context window. */
function supportsClaude1MContext(ref) {
	return isReleasedAdaptiveClaudeGeneration(ref);
}
/** Return whether Anthropic documents threshold compaction (`compact_20260112`) for a Claude model. */
function supportsClaudeServerCompaction(ref) {
	return readListedClaudeCapability(ref, "serverCompaction") ?? isReleasedAdaptiveClaudeGeneration(ref);
}
/** Return whether a Claude model supports Anthropic's native fast mode. */
function supportsClaudeFastMode(ref) {
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_WITHOUT_FAST_MODE.test(id);
}
/** Return whether a Claude model supports native max effort. */
function supportsClaudeNativeMaxEffort(ref) {
	const listed = readListedClaudeCapability(ref, "maxEffort");
	if (listed !== void 0) return listed;
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:6|7|8)|sonnet-4-6)(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model supports native xhigh effort. */
function supportsClaudeNativeXhighEffort(ref) {
	const listed = readListedClaudeCapability(ref, "xhighEffort");
	if (listed !== void 0) return listed;
	const modelId = resolveClaudeModelIdentity(ref);
	return resolveClaudeHaiku55ModelIdentity(ref) !== void 0 || resolveClaudeOpus5ModelIdentity(ref) !== void 0 || resolveClaudeSonnet5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-5|opus-4-(?:7|8))(?=$|[^a-z0-9])/.test(modelId);
}
/** Return whether a Claude model rejects caller-selected sampling parameters. */
function requiresClaudeDefaultSampling(ref) {
	const id = resolveClaudeContractId(ref);
	return id !== void 0 && !CLAUDE_SAMPLING_PARAMETERS.test(id);
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
// packages/llm-core/src/usage-cost.ts
const sortedPricingTiers = /* @__PURE__ */ new WeakMap();
const finiteOrZero = (value) => typeof value === "number" && Number.isFinite(value) ? value : 0;
function normalizeTieredPricing(raw) {
	if (!raw || raw.length === 0) return;
	const result = [];
	for (const tier of raw) {
		const range = tier.range;
		const start = Array.isArray(range) && typeof range[0] === "number" ? range[0] : NaN;
		if (!Number.isFinite(start)) continue;
		const rawEnd = range.length >= 2 ? range[1] : null;
		const end = typeof rawEnd === "number" && Number.isFinite(rawEnd) && rawEnd > start ? rawEnd : Infinity;
		if (!Number.isFinite(tier.input) || !Number.isFinite(tier.output) || !Number.isFinite(tier.cacheRead) || !Number.isFinite(tier.cacheWrite)) continue;
		result.push({
			input: tier.input,
			output: tier.output,
			cacheRead: tier.cacheRead,
			cacheWrite: tier.cacheWrite,
			range: [start, end]
		});
	}
	return result.length > 0 ? result.toSorted((a, b) => a.range[0] - b.range[0]) : void 0;
}
function normalizeModelCostConfig(cost) {
	const normalizedTiers = normalizeTieredPricing(cost.tieredPricing);
	return {
		input: cost.input,
		output: cost.output,
		cacheRead: cost.cacheRead,
		cacheWrite: cost.cacheWrite,
		...normalizedTiers ? { tieredPricing: normalizedTiers } : {}
	};
}
function normalizeResolvedPricing(cost) {
	return normalizeModelCostConfig({
		input: finiteOrZero(cost.input),
		output: finiteOrZero(cost.output),
		cacheRead: finiteOrZero(cost.cacheRead),
		cacheWrite: finiteOrZero(cost.cacheWrite),
		...cost.tieredPricing ? { tieredPricing: cost.tieredPricing } : {}
	});
}
function selectPricingRates(cost, promptTokens) {
	const tiers = cost.tieredPricing;
	if (!tiers?.length) return cost;
	let sorted = sortedPricingTiers.get(tiers);
	if (!sorted) {
		sorted = normalizeTieredPricing(tiers) ?? [];
		sortedPricingTiers.set(tiers, sorted);
	}
	if (promptTokens <= 0) return sorted[0] ?? cost;
	return sorted.find((tier) => promptTokens >= tier.range[0] && promptTokens < tier.range[1]) ?? sorted.findLast((tier) => promptTokens >= tier.range[0]) ?? sorted[0] ?? cost;
}
/** Price one model call, selecting its tier before billing the separate token buckets. */
function calculateUsageCost(usage, pricing) {
	const input = finiteOrZero(usage.input);
	const output = finiteOrZero(usage.output);
	const cacheRead = finiteOrZero(usage.cacheRead);
	const cacheWrite = finiteOrZero(usage.cacheWrite);
	const rates = selectPricingRates(pricing, input + cacheRead + cacheWrite);
	const cacheWrite1h = Math.min(cacheWrite, Math.max(0, finiteOrZero(usage.cacheWrite1h)));
	const cacheWrite5m = cacheWrite - cacheWrite1h;
	const cost = {
		input: input * rates.input / 1e6,
		output: output * rates.output / 1e6,
		cacheRead: cacheRead * rates.cacheRead / 1e6,
		cacheWrite: (cacheWrite5m * rates.cacheWrite + cacheWrite1h * rates.input * 2) / 1e6,
		total: 0
	};
	cost.total = cost.input + cost.output + cost.cacheRead + cost.cacheWrite;
	return cost;
}
function extractEmbeddingUsage(payload) {
	const usage = asOptionalRecord(asOptionalRecord(payload)?.usage);
	const promptTokens = normalizeUsageCount(usage?.prompt_tokens);
	const totalTokens = normalizeUsageCount(usage?.total_tokens);
	if (promptTokens === void 0 && totalTokens === void 0) return;
	return {
		promptTokens: promptTokens ?? totalTokens ?? 0,
		totalTokens: totalTokens ?? promptTokens ?? 0
	};
}
function normalizeUsageCount(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
}
export { supportsClaudeNativeMaxEffort as A, resolveClaudeOpus5ModelIdentity as C, supportsClaudeAdaptiveThinking as D, supportsClaude1MContext as E, supportsClaudeServerCompaction as M, usesClaude5RequestContract as N, supportsClaudeFastMode as O, resolveClaudeOpus55ModelIdentity as S, resolveClaudeSonnet5ModelIdentity as T, resolveClaudeFable5ModelIdentity as _, CLAUDE_FABLE_5_THINKING_PROFILE as a, resolveClaudeMythos5ModelIdentity as b, CLAUDE_OPUS_5_THINKING_PROFILE as c, bindsClaudeThinkingPrefix as d, isReleasedAdaptiveClaudeGeneration as f, requiresClaudeMandatoryAdaptiveThinking as g, requiresClaudeDefaultSampling as h, normalizeResolvedPricing as i, supportsClaudeNativeXhighEffort as j, supportsClaudeInHistorySystemMessages as k, CLAUDE_SONNET_55_THINKING_PROFILE as l, requiresClaudeBetweenToolsThinking as m, extractEmbeddingUsage as n, CLAUDE_HAIKU_55_THINKING_PROFILE as o, rejectsClaudeAssistantPrefill as p, normalizeModelCostConfig as r, CLAUDE_OPUS_55_THINKING_PROFILE as s, calculateUsageCost as t, CLAUDE_SONNET_5_THINKING_PROFILE as u, resolveClaudeHaiku55ModelIdentity as v, resolveClaudeSonnet55ModelIdentity as w, resolveClaudeNativeThinkingLevelMap as x, resolveClaudeModelIdentity as y };
