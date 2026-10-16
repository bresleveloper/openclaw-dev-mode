import { n as resolveHookEnableState, t as resolveHookConfig } from "./policy-DntIYegk.mjs";
import { n as hasBinary, r as isConfigPathTruthyWithDefaults, t as evaluateRuntimeEligibility } from "./config-eval-DAVG8wM7.mjs";
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
/** Return true when a hook passes enable policy and runtime requirements. */
function shouldIncludeHook(params) {
	const { entry, config, eligibility } = params;
	const hookConfig = resolveHookConfig(config, entry.metadata?.hookKey ?? entry.hook.name);
	if (!resolveHookEnableState({
		entry,
		config,
		hookConfig
	}).enabled) return false;
	const remote = eligibility?.remote;
	return evaluateRuntimeEligibility({
		os: entry.metadata?.os,
		remotePlatforms: remote?.platforms,
		always: entry.metadata?.always,
		requires: entry.metadata?.requires,
		hasRemoteBin: remote?.hasBin,
		hasAnyRemoteBin: remote?.hasAnyBin,
		hasBin: hasBinary,
		hasEnv: (envName) => isHookEnvSatisfied(envName, hookConfig),
		isConfigPathTruthy: (configPath) => isHookConfigPathTruthy(config, configPath)
	});
}
//#endregion
export { isHookEnvSatisfied as n, shouldIncludeHook as r, isHookConfigPathTruthy as t };
