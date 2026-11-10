import { l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-xjgIR3E-.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-D3zWgGUS.mjs";
import { o as isChromeReachable } from "./chrome-CRfGod9x.mjs";
import { t as resolveBrowserExecutableForPlatform } from "./chrome.executables-DnlyVi3E.mjs";
import { r as getBrowserControlState } from "./browser-control-state-bUudnqjR.mjs";
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
