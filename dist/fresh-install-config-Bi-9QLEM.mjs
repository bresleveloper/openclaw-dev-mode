//#region src/cli/fresh-install-config.ts
const UNCONFIGURED_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["$schema", "meta"]);
function isIncompleteWizardConfig(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.keys(value).every((key) => key === "securityAcknowledgedAt" || key === "accessMode");
}
function isUnconfiguredConfigSource(sourceConfig) {
	return Object.entries(sourceConfig).every(([key, value]) => UNCONFIGURED_CONFIG_IGNORED_KEYS.has(key) || key === "wizard" && isIncompleteWizardConfig(value));
}
async function shouldStartLocalOnboarding(snapshot) {
	if (!snapshot.exists) return true;
	if (!snapshot.valid || snapshot.sourceConfig.gateway?.mode === "remote") return false;
	if (isUnconfiguredConfigSource(snapshot.sourceConfig)) return true;
	const { readLocalOnboardingStateForConfig } = await import("./state/local-onboarding-state.js");
	return readLocalOnboardingStateForConfig(snapshot.path, snapshot.sourceConfig)?.status === "pending";
}
//#endregion
export { shouldStartLocalOnboarding as n, isUnconfiguredConfigSource as t };
