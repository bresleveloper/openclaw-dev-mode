import { n as closeTrackedBrowserTabsForSessions$1 } from "../../session-tab-registry-Bl0lE-XG.mjs";
import { t as movePathToTrash } from "../../trash-CAu63IBo.mjs";
//#region extensions/browser/browser-maintenance.ts
/**
* Browser maintenance API barrel. It exposes tab cleanup and trash helpers for
* runtime and doctor flows.
*/
/** Route lifecycle cleanup through the currently running Browser runtime when available. */
async function closeTrackedBrowserTabsForSessions(params) {
	return await closeTrackedBrowserTabsForSessions$1({
		...params,
		getResolvedBrowserConfig: async () => {
			const { getBrowserControlState } = await import("../../browser-control-state-DNhn_3YX.mjs");
			return getBrowserControlState()?.resolved ?? null;
		}
	});
}
//#endregion
export { closeTrackedBrowserTabsForSessions, movePathToTrash };
