import { a as normalizeFastMode } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./thinking.shared-Jy32Vp-O.mjs";
import { i as resolveModelExtraParamSources } from "./model-extra-params-C1g6s41K.mjs";
import { u as resolveFastModeModelAutoOnSeconds } from "./fast-mode-smSVCJXN.mjs";
//#region src/agents/fast-mode.ts
/** Resolve the effective fast-mode setting and its source. */
function resolveFastModeState(params) {
	const { modelParams, agentModelParams } = resolveModelExtraParamSources({
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
		mode = normalizeFastMode(params.agentId && params.cfg ? resolveAgentConfig(params.cfg, params.agentId)?.fastModeDefault : void 0);
		source = "agent";
	}
	if (mode === void 0) {
		const configuredRaw = agentModelParams?.fastMode ?? agentModelParams?.fast_mode ?? modelParams?.fastMode ?? modelParams?.fast_mode;
		mode = normalizeFastMode(configuredRaw);
		source = "config";
	}
	return {
		mode: mode ?? false,
		enabled: mode === "auto" || mode === true || mode === "ultrafast",
		source: mode === void 0 ? "default" : source,
		fastAutoOnSeconds
	};
}
//#endregion
export { resolveFastModeState as t };
