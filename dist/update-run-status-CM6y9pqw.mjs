import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as LEGACY_UPDATE_RUN_EXPIRED_REASON, t as LEGACY_UPDATE_RUN_ADVISORY } from "./update-run-legacy-expiry-BU1v4N5g.mjs";
import { o as toPublicUpdateRun, r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import { i as inspectUpdateRunAbandonment, l as staleUpdateRunGuidance } from "./update-run-activity-CykyDahG.mjs";
import { h as reconcileAbandonedUpdateRunsAsync } from "./update-run-ledger-jBhhLo0P.mjs";
import { s as getUpdateRunHistoryStatusAsync } from "./update-run-reader-B7x8dkVs.mjs";
//#region src/infra/update-run-status.ts
/** Status heals the bounded legacy defect while other recovery keeps its existing owner. */
async function readUpdateRunStatus() {
	let runReconciliationError;
	try {
		await reconcileAbandonedUpdateRunsAsync({ legacyOnly: true });
	} catch (error) {
		runReconciliationError = formatErrorMessage(error);
	}
	try {
		const { activeRun, lastRun, expiredRun: expired } = await getUpdateRunHistoryStatusAsync();
		const abandonment = activeRun ? inspectUpdateRunAbandonment(activeRun) : void 0;
		const staleGuidance = activeRun ? staleUpdateRunGuidance(activeRun) : void 0;
		return {
			...runReconciliationError ? { runReconciliationError } : {},
			...activeRun ? { activeRun: toPublicUpdateRun(activeRun) } : {},
			...lastRun ? { lastRun: toPublicUpdateRun(lastRun) } : {},
			...staleGuidance && activeRun ? { staleRun: {
				runId: activeRun.runId,
				guidance: staleGuidance
			} } : {},
			...abandonment && abandonment !== "legacy-driver-expired" && activeRun ? { abandonedRun: {
				runId: activeRun.runId,
				rule: abandonment
			} } : {},
			...expired && !isAcknowledgedAbandonedUpdateRun(expired) ? { advisories: [{
				runId: expired.runId,
				reason: LEGACY_UPDATE_RUN_EXPIRED_REASON,
				message: expired.runId === (activeRun ?? lastRun)?.runId ? LEGACY_UPDATE_RUN_ADVISORY : "Historical update: a 2026.9.2-era update never progressed past admission and was treated as abandoned after 24 h."
			}] } : {}
		};
	} catch (error) {
		return { runStatusError: formatErrorMessage(error) };
	}
}
//#endregion
export { readUpdateRunStatus as t };
