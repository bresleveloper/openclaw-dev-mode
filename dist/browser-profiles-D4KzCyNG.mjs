import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-BWw5NpKt.mjs";
//#region src/plugin-sdk/browser-control-auth.ts
function loadBrowserControlAuthSurface() {
	return loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "browser-control-auth.js"
	});
}
/** Resolves browser control auth from config/env without generating new credentials. */
function resolveBrowserControlAuth(cfg, env = process.env) {
	return loadBrowserControlAuthSurface().resolveBrowserControlAuth(cfg, env);
}
/** Ensures browser control auth exists, returning any token generated during the call. */
async function ensureBrowserControlAuth(params) {
	return await loadBrowserControlAuthSurface().ensureBrowserControlAuth(params);
}
//#endregion
//#region src/plugin-sdk/browser-profiles.ts
/** Default global browser plugin enabled state. */
const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default setting for model/tool browser page evaluation. */
const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Default browser profile accent color shown in UI surfaces. */
const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default OpenClaw-managed browser profile name. */
const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when config omits a profile name. */
const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser actions issued through the browser plugin. */
const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 6e4;
/** Default maximum AI snapshot text captured from browser pages. */
const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 8e4;
/**
* Portable SDK compatibility default; the browser plugin owns platform-aware runtime paths.
*/
const DEFAULT_UPLOAD_DIR = "/tmp/openclaw/uploads";
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
export { DEFAULT_OPENCLAW_BROWSER_COLOR as a, DEFAULT_UPLOAD_DIR as c, ensureBrowserControlAuth as d, resolveBrowserControlAuth as f, DEFAULT_BROWSER_EVALUATE_ENABLED as i, resolveBrowserConfig as l, DEFAULT_BROWSER_ACTION_TIMEOUT_MS as n, DEFAULT_OPENCLAW_BROWSER_ENABLED as o, DEFAULT_BROWSER_DEFAULT_PROFILE_NAME as r, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME as s, DEFAULT_AI_SNAPSHOT_MAX_CHARS as t, resolveProfile as u };
