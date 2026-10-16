import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-B-yS8AQL.mjs";
import "./browser-trash-BBLAyaRb.mjs";
//#region src/plugin-sdk/browser-maintenance.ts
/** Closes tracked browser tabs for requested session keys when the browser plugin is active. */
async function closeTrackedBrowserTabsForSessions(params) {
	if (params.sessionEntryCurrent && typeof params.prepareCurrent !== "function") {
		params.onWarn?.("browser cleanup unavailable: sessionEntryCurrent requires prepareCurrent");
		return 0;
	}
	if (params.isCurrent?.() === false || !params.sessionKeys.some((key) => Boolean(key?.trim()))) return 0;
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
	if ((params.prepareCurrent || params.sessionEntryCurrent) && surface.supportsSessionEntryCurrent !== true) {
		params.onWarn?.("browser cleanup unavailable: update the Browser plugin to support session-current cleanup");
		return 0;
	}
	if (params.prepareCurrent) {
		if (!await params.prepareCurrent() || params.isCurrent?.() === false) return 0;
	}
	return await surface.closeTrackedBrowserTabsForSessions(params);
}
//#endregion
export { closeTrackedBrowserTabsForSessions as t };
