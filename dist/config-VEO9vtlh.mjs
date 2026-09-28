import { n as resolveHookEnableState, t as resolveHookConfig } from "./policy-D4HXkRoG.mjs";
import { n as hasBinary, r as isConfigPathTruthyWithDefaults, t as evaluateRuntimeEligibility } from "./config-eval-BOec6g4L.mjs";
//#region src/hooks/config.ts
const DEFAULT_CONFIG_VALUES = {
	"browser.enabled": true,
	"browser.evaluateEnabled": true,
	"workspace.dir": true
};
/** Evaluate a config path with hook-specific defaults for legacy runtime requirements. */
function isHookConfigPathTruthy(config, pathStr) {
	return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}
function isHookEnvSatisfied(envName, hookConfig) {
	return Boolean(process.env[envName]?.trim() || hookConfig?.env?.[envName]?.trim());
}
function evaluateHookRuntimeEligibility(params) {
	const { entry, config, hookConfig, eligibility } = params;
	const remote = eligibility?.remote;
	const base = {
		os: entry.metadata?.os,
		remotePlatforms: remote?.platforms,
		always: entry.metadata?.always,
		requires: entry.metadata?.requires,
		hasRemoteBin: remote?.hasBin,
		hasAnyRemoteBin: remote?.hasAnyBin
	};
	return evaluateRuntimeEligibility({
		...base,
		hasBin: hasBinary,
		hasEnv: (envName) => isHookEnvSatisfied(envName, hookConfig),
		isConfigPathTruthy: (configPath) => isHookConfigPathTruthy(config, configPath)
	});
}
/** Return true when a hook passes enable policy and runtime requirements. */
function shouldIncludeHook(params) {
	const { entry, config, eligibility } = params;
	const hookConfig = resolveHookConfig(config, params.entry.metadata?.hookKey ?? params.entry.hook.name);
	if (!resolveHookEnableState({
		entry,
		config,
		hookConfig
	}).enabled) return false;
	return evaluateHookRuntimeEligibility({
		entry,
		config,
		hookConfig,
		eligibility
	});
}
//#endregion
export { isHookEnvSatisfied as n, shouldIncludeHook as r, isHookConfigPathTruthy as t };
