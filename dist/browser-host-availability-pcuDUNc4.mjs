import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import { o as isChromeReachable } from "./chrome-BYoc4jk9.mjs";
import { t as resolveBrowserExecutableForPlatform } from "./chrome.executables-Cv2wahLt.mjs";
import "./config-Cs3fQhZS.mjs";
import { r as getBrowserControlState } from "./browser-control-state-CUAhFG1B.mjs";
//#region extensions/browser/src/browser-host-availability.ts
/** Inspect local capability before routing, without launching or replaying a browser action. */
async function isBrowserHostAvailable(config, profileName) {
	const source = getRuntimeConfigSourceSnapshot() ?? config;
	const resolved = resolveBrowserConfig(source.browser, source);
	if (!resolved.enabled) return false;
	const profile = resolveProfile(resolved, profileName ?? resolved.defaultProfile);
	if (!profile) return false;
	if (getBrowserProfileCapabilities(profile).mode !== "local-managed" || profile.attachOnly) return true;
	if (getBrowserControlState()?.profiles.get(profile.name)?.running) return true;
	try {
		if (resolveBrowserExecutableForPlatform({
			...resolved,
			executablePath: profile.executablePath
		}, process.platform)) return true;
	} catch {
		return true;
	}
	return await isChromeReachable(profile.cdpUrl);
}
//#endregion
export { isBrowserHostAvailable };
