import { n as resolveProviderEndpoint } from "./provider-attribution-DUtJJsHV.mjs";
import { l as resolveConfiguredContextTokenLimits } from "./context-resolution-D64R_bgD.mjs";
//#region src/agents/context-window-guard.ts
const CONTEXT_WINDOW_HARD_MIN_TOKENS = 4e3;
const CONTEXT_WINDOW_WARN_BELOW_TOKENS = 8e3;
const CONTEXT_WINDOW_HARD_MIN_RATIO = .1;
const CONTEXT_WINDOW_WARN_BELOW_RATIO = .2;
function normalizePositiveInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	const int = Math.floor(value);
	return int > 0 ? int : null;
}
/** Resolve the effective context window and source for one provider/model. */
function resolveContextWindowInfo(params) {
	const configured = resolveConfiguredContextTokenLimits({
		cfg: params.cfg,
		provider: params.provider,
		model: params.modelId
	}, normalizePositiveInt);
	const fromModelsConfig = configured.effectiveConfiguredTokens ?? configured.configuredContextWindow;
	const fromModel = normalizePositiveInt(params.modelContextTokens) ?? normalizePositiveInt(params.modelContextWindow);
	const defaultTokens = normalizePositiveInt(params.defaultTokens) ?? CONTEXT_WINDOW_WARN_BELOW_TOKENS;
	return fromModelsConfig ? {
		tokens: fromModelsConfig,
		source: "modelsConfig"
	} : fromModel ? {
		tokens: fromModel,
		source: "model"
	} : {
		tokens: defaultTokens,
		source: "default"
	};
}
function resolveContextWindowGuardHint(params) {
	const endpoint = resolveProviderEndpoint(params.runtimeBaseUrl ?? void 0);
	return {
		endpointClass: endpoint.endpointClass,
		likelySelfHosted: endpoint.endpointClass === "local"
	};
}
/** Derive warning/block floors from the resolved model context window. */
function resolveContextWindowGuardThresholds(contextWindowTokens) {
	const tokens = normalizePositiveInt(contextWindowTokens) ?? 0;
	return {
		hardMinTokens: Math.max(CONTEXT_WINDOW_HARD_MIN_TOKENS, Math.floor(tokens * CONTEXT_WINDOW_HARD_MIN_RATIO)),
		warnBelowTokens: Math.max(CONTEXT_WINDOW_WARN_BELOW_TOKENS, Math.floor(tokens * CONTEXT_WINDOW_WARN_BELOW_RATIO))
	};
}
/** Format a non-blocking low-context warning message. */
function formatContextWindowWarningMessage(params) {
	const base = `low context window: ${params.provider}/${params.modelId} ctx=${params.guard.tokens} (warn<${params.guard.warnBelowTokens}) source=${params.guard.source}`;
	if (!resolveContextWindowGuardHint({ runtimeBaseUrl: params.runtimeBaseUrl }).likelySelfHosted) return base;
	if (params.guard.source === "modelsConfig") return `${base}; OpenClaw is using the configured model context limit for this model, so raise contextWindow/contextTokens if it is set too low`;
	return `${base}; local/self-hosted runs work best at ${params.guard.warnBelowTokens}+ tokens and may show weaker tool use or more compaction until the server/model context limit is raised`;
}
/** Format a blocking context-window guard message. */
function formatContextWindowBlockMessage(params) {
	const base = `Model context window too small (${params.guard.tokens} tokens; source=${params.guard.source}). Minimum is ${params.guard.hardMinTokens}.`;
	if (!resolveContextWindowGuardHint({ runtimeBaseUrl: params.runtimeBaseUrl }).likelySelfHosted) return base;
	if (params.guard.source === "modelsConfig") return `${base} OpenClaw is using the configured model context limit for this model. Raise contextWindow/contextTokens or choose a larger model.`;
	return `${base} This looks like a local model endpoint. Raise the server/model context limit or choose a larger model. OpenClaw local/self-hosted runs work best at ${params.guard.warnBelowTokens}+ tokens.`;
}
/** Evaluate whether the resolved context window should warn or block. */
function evaluateContextWindowGuard(params) {
	const normalizedTokens = normalizePositiveInt(params.info.tokens);
	const tokens = normalizedTokens ?? 0;
	const resolvedThresholds = resolveContextWindowGuardThresholds(normalizePositiveInt(params.info.referenceTokens) ?? tokens);
	const warnBelow = Math.max(1, Math.floor(params.warnBelowTokens ?? resolvedThresholds.warnBelowTokens));
	const defaultHardMin = Math.min(resolvedThresholds.hardMinTokens, Math.max(tokens, CONTEXT_WINDOW_HARD_MIN_TOKENS));
	const hardMin = Math.max(1, Math.floor(params.hardMinTokens ?? defaultHardMin));
	return {
		...params.info,
		tokens,
		hardMinTokens: hardMin,
		warnBelowTokens: warnBelow,
		shouldWarn: !normalizedTokens || tokens < warnBelow,
		shouldBlock: !normalizedTokens || tokens < hardMin
	};
}
//#endregion
export { resolveContextWindowInfo as a, formatContextWindowWarningMessage as i, evaluateContextWindowGuard as n, formatContextWindowBlockMessage as r, CONTEXT_WINDOW_HARD_MIN_TOKENS as t };
