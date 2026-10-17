import { t as movePathToTrash } from "../../trash-BZs4-v1R.mjs";
import { n as closeTrackedBrowserTabsForSessions$1 } from "../../session-tab-registry-2huxYiIa.mjs";
//#region extensions/browser/browser-maintenance.ts
const supportsSessionEntryCurrent = true;
/** Route lifecycle cleanup through the currently running Browser runtime when available. */
async function closeTrackedBrowserTabsForSessions(params) {
	return await closeTrackedBrowserTabsForSessions$1({
		...params,
		getResolvedBrowserConfig: async () => {
			const { getBrowserControlState } = await import("../../browser-control-state-BcYPh-Fr.mjs");
			return getBrowserControlState()?.resolved ?? null;
		}
	});
}
//#endregion
export { closeTrackedBrowserTabsForSessions, movePathToTrash, supportsSessionEntryCurrent };
