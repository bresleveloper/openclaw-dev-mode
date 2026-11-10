import { a as normalizeFastMode } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./thinking.shared-Be8dhC75.mjs";
import { i as resolveModelExtraParamSources, r as resolveAliasedParamValue } from "./model-extra-params-HwiZgNCH.mjs";
import { n as normalizeOpenAIServiceTier } from "./openai-fast-mode-B_jae6aY.mjs";
import { u as resolveFastModeModelAutoOnSeconds } from "./fast-mode-smSVCJXN.mjs";
//#region src/agents/fast-mode.ts
/** Resolve the effective fast-mode setting and its source. */
function resolveFastModeState(params) {
	const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider: params.provider,
		modelId: params.model,
		agentId: params.agentId
	});
	const fastAutoOnSeconds = resolveFastModeModelAutoOnSeconds({
		...params,
		modelParamSources: [agentModelParams, modelParams]
	});
	let mode = normalizeFastMode(params.sessionEntry?.fastMode);
	let source = "session";
	if (mode === void 0) {
		mode = normalizeFastMode(params.agentId && params.cfg ? resolveAgentConfig(params.cfg, params.agentId)?.fastModeDefault : params.cfg?.agents?.defaults?.fastModeDefault);
		source = "agent";
	}
	if (mode === void 0) {
		const configuredRaw = resolveAliasedParamValue([
			defaultParams,
			modelParams,
			agentModelParams,
			agentParams
		], ["fastMode", "fast_mode"]);
		mode = normalizeFastMode(configuredRaw);
		source = "config";
	}
	const tier = params.provider === "openai" ? normalizeOpenAIServiceTier(resolveAliasedParamValue([
		defaultParams,
		modelParams,
		agentModelParams,
		agentParams
	], ["serviceTier", "service_tier"])) : void 0;
	const requestMode = mode ?? (tier ? void 0 : false);
	if (mode === void 0 && tier) {
		mode = tier === "ultrafast" ? "ultrafast" : tier === "priority";
		source = "config";
	}
	return {
		mode: mode ?? false,
		requestMode,
		enabled: mode === "auto" || mode === true || mode === "ultrafast",
		source: mode === void 0 ? "default" : source,
		fastAutoOnSeconds
	};
}
//#endregion
export { resolveFastModeState as t };
