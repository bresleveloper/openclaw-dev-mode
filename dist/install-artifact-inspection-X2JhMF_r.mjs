import { t as isBundleCapabilitySupported } from "./bundle-capability-support-B86S0fqh.mjs";
//#region src/plugins/install-artifact-inspection.ts
const PLUGIN_ARTIFACT_ADAPTER_IDENTITY = "openclaw/v1";
function inspectNativePluginArtifact() {
	return {
		format: "openclaw",
		mapped: ["plugin"],
		unavailable: []
	};
}
function inspectBundlePluginArtifact(params) {
	const capabilities = [...new Set(params.capabilities)].toSorted();
	return {
		format: params.format,
		mapped: capabilities.filter((capability) => isBundleCapabilitySupported(params.format, capability)),
		unavailable: capabilities.filter((capability) => !isBundleCapabilitySupported(params.format, capability))
	};
}
//#endregion
export { inspectBundlePluginArtifact as n, inspectNativePluginArtifact as r, PLUGIN_ARTIFACT_ADAPTER_IDENTITY as t };
