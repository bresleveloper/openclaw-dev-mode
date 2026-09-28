import { a as normalizeFastMode } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveAgentEntry } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
//#region src/agents/model-extra-params.ts
const FAST_MODE_CUTOFF_MODEL_PARAM_KEYS = /* @__PURE__ */ new Set([
	"fastAutoOnSeconds",
	"fastSeconds",
	"fast_auto_on_seconds",
	"fast_seconds"
]);
function isAgentRuntimeModelParam(key, value) {
	if (key === "thinking") return value === false || value === "disabled" || value === "none" || typeof value === "string" && normalizeThinkLevel(value) !== void 0;
	if (key === "fastMode" || key === "fast_mode") return normalizeFastMode(value) !== void 0;
	return FAST_MODE_CUTOFF_MODEL_PARAM_KEYS.has(key) && typeof value === "number" && Number.isInteger(value) && value > 0;
}
function legacyModelKey(provider, modelId) {
	const rawKey = `${provider.trim()}/${modelId.trim()}`;
	return rawKey === modelKey(provider, modelId) ? void 0 : rawKey;
}
/** Resolves the config records merged into one model request. */
function resolveModelExtraParamSources(params) {
	const defaultParams = params.config?.agents?.defaults?.params;
	const configuredModels = params.config?.agents?.defaults?.models;
	const canonicalKey = params.modelId ? modelKey(params.provider, params.modelId) : void 0;
	const legacyKey = params.modelId ? legacyModelKey(params.provider, params.modelId) : void 0;
	const modelParams = canonicalKey ? configuredModels?.[canonicalKey]?.params ?? (legacyKey ? configuredModels?.[legacyKey]?.params : void 0) : void 0;
	const agent = params.agentId && params.config ? resolveAgentEntry(params.config, params.agentId) : void 0;
	return {
		defaultParams,
		modelParams,
		agentModelParams: canonicalKey ? agent?.models?.[canonicalKey]?.params ?? (legacyKey ? agent?.models?.[legacyKey]?.params : void 0) : void 0,
		agentParams: agent?.params
	};
}
/** Returns whether embedded OpenClaw would apply authored provider request parameters. */
function hasAuthoredProviderRequestParams(params) {
	const sources = resolveModelExtraParamSources(params);
	if ([sources.defaultParams, sources.agentParams].some((source) => source !== void 0 && Object.keys(source).length > 0)) return true;
	return [sources.modelParams, sources.agentModelParams].some((modelParams) => Object.entries(modelParams ?? {}).some(([key, value]) => !isAgentRuntimeModelParam(key, value)));
}
//#endregion
export { isAgentRuntimeModelParam as n, resolveModelExtraParamSources as r, hasAuthoredProviderRequestParams as t };
