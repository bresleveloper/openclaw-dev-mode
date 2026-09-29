import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as LEGACY_UPDATE_RUN_EXPIRED_REASON, r as isAcknowledgedAbandonedUpdateRun, s as LEGACY_UPDATE_RUN_ADVISORY } from "./update-run-record-B5xSBZMw.mjs";
import { n as inspectUpdateRunAbandonment, o as staleUpdateRunGuidance } from "./update-run-activity-C0Hu53Kb.mjs";
import { c as reconcileAbandonedUpdateRuns } from "./update-run-ledger-CwAEg-5V.mjs";
import { s as listUpdateRuns, t as findActiveUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
//#region src/infra/update-run-status.ts
/** Status heals the bounded legacy defect while other recovery keeps its existing owner. */
function readUpdateRunStatus() {
	let runReconciliationError;
	try {
		reconcileAbandonedUpdateRuns({ legacyOnly: true });
	} catch (error) {
		runReconciliationError = formatErrorMessage(error);
	}
	try {
		const activeRun = findActiveUpdateRun();
		const lastRun = listUpdateRuns({
			limit: 1,
			excludeReason: "dry-run"
		})[0];
		const abandonment = activeRun ? inspectUpdateRunAbandonment(activeRun) : void 0;
		const staleGuidance = activeRun ? staleUpdateRunGuidance(activeRun) : void 0;
		const expired = listUpdateRuns({
			limit: 1,
			reason: LEGACY_UPDATE_RUN_EXPIRED_REASON
		})[0];
		return {
			...runReconciliationError ? { runReconciliationError } : {},
			...activeRun ? { activeRun } : {},
			...lastRun ? { lastRun } : {},
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
