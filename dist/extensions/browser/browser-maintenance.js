import { t as movePathToTrash } from "../../trash-XRuoxUVl.mjs";
import { n as closeTrackedBrowserTabsForSessions$1 } from "../../session-tab-registry-B9UbV5gA.mjs";
//#region extensions/browser/browser-maintenance.ts
const supportsSessionEntryCurrent = true;
/** Route lifecycle cleanup through the currently running Browser runtime when available. */
async function closeTrackedBrowserTabsForSessions(params) {
	return await closeTrackedBrowserTabsForSessions$1({
		...params,
		getResolvedBrowserConfig: async () => {
			const { getBrowserControlState } = await import("../../browser-control-state-Dr2vXv8u.mjs");
			return getBrowserControlState()?.resolved ?? null;
		}
	});
}
//#endregion
export { closeTrackedBrowserTabsForSessions, movePathToTrash, supportsSessionEntryCurrent };
