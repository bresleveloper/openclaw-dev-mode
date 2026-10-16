import { n as resolveBrowserEngine } from "./registry-PTTKe2-a.mjs";
//#region extensions/browser/src/browser/profile-capabilities.ts
function getBrowserProfileCapabilities(profile) {
	return resolveBrowserEngine(profile.engine).capabilities(profile);
}
function resolveDefaultSnapshotFormat(params) {
	if (params.explicitFormat) return params.explicitFormat;
	if (params.mode === "efficient") return "ai";
	if (getBrowserProfileCapabilities(params.profile).mode === "local-existing-session") return "ai";
	return params.hasPlaywright ? "ai" : "aria";
}
function shouldUsePlaywrightForScreenshot(params) {
	return !params.wsUrl || Boolean(params.ref) || Boolean(params.element);
}
//#endregion
export { resolveDefaultSnapshotFormat as n, shouldUsePlaywrightForScreenshot as r, getBrowserProfileCapabilities as t };
