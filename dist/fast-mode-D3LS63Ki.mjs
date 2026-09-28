import { a as normalizeFastMode } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./thinking.shared-BKzBCWpI.mjs";
import { r as resolveModelExtraParamSources } from "./model-extra-params-BJQs6MZV.mjs";
import { l as resolveFastModeModelAutoOnSeconds } from "./fast-mode-CF9HctjM.mjs";
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
		enabled: mode === "auto" || mode === true,
		source: mode === void 0 ? "default" : source,
		fastAutoOnSeconds
	};
}
//#endregion
export { resolveFastModeState as t };
