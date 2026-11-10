import { a as normalizeFastMode } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { o as resolveAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
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
	const paramsForModel = (models) => canonicalKey ? models?.[canonicalKey]?.params ?? (legacyKey ? models?.[legacyKey]?.params : void 0) : void 0;
	const modelParams = paramsForModel(configuredModels);
	const agent = params.agentId && params.config ? resolveAgentEntry(params.config, params.agentId) : void 0;
	return {
		defaultParams,
		modelParams,
		agentModelParams: paramsForModel(agent?.models),
		agentParams: agent?.params
	};
}
/** Returns whether embedded OpenClaw would apply authored provider request parameters. */
function hasAuthoredProviderRequestParams(params, options) {
	const sources = resolveModelExtraParamSources(params);
	const usesHostCompaction = (key, value) => options?.nativeContextManagement === true && (key === "responsesServerCompaction" && typeof value === "boolean" || key === "responsesCompactThreshold" && (typeof value === "number" && Number.isFinite(value) && value > 0 || typeof value === "string" && parseStrictPositiveInteger(value) !== void 0));
	if ([sources.defaultParams, sources.agentParams].some((source) => Object.entries(source ?? {}).some(([key, value]) => !usesHostCompaction(key, value)))) return true;
	return [sources.modelParams, sources.agentModelParams].some((modelParams) => Object.entries(modelParams ?? {}).some(([key, value]) => !usesHostCompaction(key, value) && !isAgentRuntimeModelParam(key, value)));
}
function sanitizeExtraParamsRecord(value) {
	if (!value) return;
	return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "__proto__" && key !== "prototype" && key !== "constructor"));
}
/** Later sources win; each source's first own alias wins, including null and undefined. */
function resolveAliasedParamValue(sources, keys) {
	let resolved = void 0;
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			if (!Object.hasOwn(source, key)) continue;
			resolved = source[key];
			break;
		}
	}
	return resolved;
}
//#endregion
export { sanitizeExtraParamsRecord as a, resolveModelExtraParamSources as i, isAgentRuntimeModelParam as n, resolveAliasedParamValue as r, hasAuthoredProviderRequestParams as t };
