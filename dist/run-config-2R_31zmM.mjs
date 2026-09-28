import { E as selectApplicableRuntimeConfig, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./config-DryArA1l.mjs";
//#region src/cron/isolated-agent/run-config.ts
/** Selects the active reloadable config when it descends from the cron caller's snapshot. */
function resolveCronActiveRuntimeConfig(cfg) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return cfg;
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) ?? cfg;
}
function extractCronAgentDefaultsOverride(agentConfigOverride) {
	const { model: overrideModel, sandbox: _agentSandboxOverride, memory: _agentMemoryOverride, models: _agentModelsOverride, params: _agentParamsOverride, ...agentOverrideRest } = agentConfigOverride ?? {};
	return {
		overrideModel,
		definedOverrides: Object.fromEntries(Object.entries(agentOverrideRest).filter(([, value]) => value !== void 0))
	};
}
/** Derives isolated cron agent defaults from one immutable config snapshot. */
function resolveCronAgentConfigFromSnapshot(params) {
	const runtimeConfig = params.config;
	const { overrideModel, definedOverrides } = extractCronAgentDefaultsOverride(params.agentConfigOverride);
	const agentDefaults = { ...Object.assign({}, runtimeConfig.agents?.defaults, definedOverrides) };
	const existingModel = agentDefaults.model && typeof agentDefaults.model === "object" ? agentDefaults.model : {};
	if (typeof overrideModel === "string") agentDefaults.model = {
		...existingModel,
		primary: overrideModel
	};
	else if (overrideModel) agentDefaults.model = {
		...existingModel,
		...overrideModel
	};
	return {
		runtimeConfig,
		agentDefaults,
		cfgWithAgentDefaults: {
			...runtimeConfig,
			agents: Object.assign({}, runtimeConfig.agents, { defaults: agentDefaults })
		}
	};
}
/** Selects the active runtime snapshot before deriving isolated cron agent defaults. */
function resolveCronAgentConfig(params) {
	return resolveCronAgentConfigFromSnapshot({
		...params,
		config: resolveCronActiveRuntimeConfig(params.config)
	});
}
//#endregion
export { resolveCronAgentConfig as n, resolveCronAgentConfigFromSnapshot as r, resolveCronActiveRuntimeConfig as t };
