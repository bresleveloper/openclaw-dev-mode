import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-CSNstsFk.mjs";
import "./browser-trash-BMT-0B2d.mjs";
//#region src/plugin-sdk/browser-maintenance.ts
/**
* Public SDK facade for browser cleanup and trash operations.
*/
function hasRequestedSessionKeys(sessionKeys) {
	return sessionKeys.some((key) => Boolean(key?.trim()));
}
/** Closes tracked browser tabs for requested session keys when the browser plugin is active. */
async function closeTrackedBrowserTabsForSessions(params) {
	if (params.isCurrent?.() === false || !hasRequestedSessionKeys(params.sessionKeys)) return 0;
	let surface;
	try {
		surface = await tryLoadActivatedBundledPluginPublicSurfaceModule({
			dirName: "browser",
			artifactBasename: "browser-maintenance.js"
		});
	} catch (error) {
		params.onWarn?.(`browser cleanup unavailable: ${String(error)}`);
		return 0;
	}
	if (!surface || params.isCurrent?.() === false) return 0;
	return await surface.closeTrackedBrowserTabsForSessions(params);
}
//#endregion
export { closeTrackedBrowserTabsForSessions as t };
