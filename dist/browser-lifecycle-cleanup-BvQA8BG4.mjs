import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { t as closeTrackedBrowserTabsForSessions } from "./browser-maintenance-BbSDNJPM.mjs";
//#region src/browser-lifecycle-cleanup.ts
function isBrowserCleanupDisabled(cfg) {
	return cfg?.browser?.enabled === false || cfg?.plugins?.entries?.browser?.enabled === false;
}
async function cleanupBrowserSessionsForLifecycleEnd(params) {
	const { cfg, onError, ...cleanupParams } = params;
	if (isBrowserCleanupDisabled(cfg)) return;
	const sessionKeys = normalizeUniqueStringEntries(params.sessionKeys);
	if (sessionKeys.length === 0) return;
	await runBestEffortCleanup({
		cleanup: async () => {
			await closeTrackedBrowserTabsForSessions({
				...cleanupParams,
				sessionKeys
			});
		},
		onError
	});
}
//#endregion
export { cleanupBrowserSessionsForLifecycleEnd as t };
