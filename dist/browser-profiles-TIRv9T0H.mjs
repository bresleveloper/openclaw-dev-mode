import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-CcsJkVh8.mjs";
//#region src/plugin-sdk/browser-profiles.ts
/** Default global browser plugin enabled state. */
const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default browser profile accent color shown in UI surfaces. */
const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default OpenClaw-managed browser profile name. */
const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when config omits a profile name. */
const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser actions issued through the browser plugin. */
const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 6e4;
function loadBrowserProfilesSurface() {
	return loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "browser-profiles.js"
	});
}
/** Resolves browser config through the activated bundled browser profile facade. */
function resolveBrowserConfig(cfg, rootConfig) {
	return loadBrowserProfilesSurface().resolveBrowserConfig(cfg, rootConfig);
}
/** Resolves one named browser profile from an already resolved browser config. */
function resolveProfile(resolved, profileName) {
	return loadBrowserProfilesSurface().resolveProfile(resolved, profileName);
}
//#endregion
export { DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME as a, DEFAULT_OPENCLAW_BROWSER_ENABLED as i, DEFAULT_BROWSER_DEFAULT_PROFILE_NAME as n, resolveBrowserConfig as o, DEFAULT_OPENCLAW_BROWSER_COLOR as r, resolveProfile as s, DEFAULT_BROWSER_ACTION_TIMEOUT_MS as t };
