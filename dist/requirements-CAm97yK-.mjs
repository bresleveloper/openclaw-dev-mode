//#region src/shared/requirements.ts
function normalizeOsRequirementPlatform(platform) {
	const normalized = platform.trim().toLowerCase();
	return normalized === "macos" ? "darwin" : normalized;
}
function isOsRequirementSatisfied(required, platforms) {
	if (required.length === 0) return true;
	const normalizedRequired = new Set(required.map(normalizeOsRequirementPlatform));
	return platforms.some((platform) => normalizedRequired.has(normalizeOsRequirementPlatform(platform)));
}
/** Evaluates entry requirements against the current host and optional remote capabilities. */
function evaluateRequirementsFromMetadataWithRemote(params) {
	const required = {
		bins: params.metadata?.requires?.bins ?? [],
		anyBins: params.metadata?.requires?.anyBins ?? [],
		env: params.metadata?.requires?.env ?? [],
		config: params.metadata?.requires?.config ?? [],
		os: params.metadata?.os ?? []
	};
	const hasRemoteBin = params.remote?.hasBin;
	const hasRemoteAnyBin = params.remote?.hasAnyBin;
	const missingBins = required.bins.filter((bin) => !params.hasLocalBin(bin) && !hasRemoteBin?.(bin));
	const missingAnyBins = required.anyBins.length === 0 || required.anyBins.some((bin) => params.hasLocalBin(bin)) || hasRemoteAnyBin?.(required.anyBins) ? [] : required.anyBins;
	const missingOs = isOsRequirementSatisfied(required.os, [params.localPlatform, ...params.remote?.platforms ?? []]) ? [] : required.os;
	const missingEnv = required.env.filter((envName) => !params.isEnvSatisfied(envName));
	const configChecks = required.config.map((path) => ({
		path,
		satisfied: params.isConfigSatisfied(path)
	}));
	const missingConfig = configChecks.filter((check) => !check.satisfied).map((check) => check.path);
	const missing = {
		bins: params.always ? [] : missingBins,
		anyBins: params.always ? [] : missingAnyBins,
		env: params.always ? [] : missingEnv,
		config: params.always ? [] : missingConfig,
		os: missingOs
	};
	return {
		required,
		missing,
		eligible: Object.values(missing).every((requirements) => requirements.length === 0),
		configChecks
	};
}
//#endregion
export { isOsRequirementSatisfied as n, evaluateRequirementsFromMetadataWithRemote as t };
