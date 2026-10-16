import { l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { i as isUpdateRecoveryPending, n as decodeUpdateRecovery, t as UpdateRecoveryRequiredError } from "./update-run-recovery-schema-e6yHe0bS.mjs";
import { n as inspectUpdateRecoveries, r as readRecovery } from "./update-run-recovery-store-CS8wUkZx.mjs";
//#region src/infra/update-run-recovery.ts
function loadUpdateRecovery(runId, options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readRecovery(db, runId), options);
}
/** Detection only. This delivery never claims, rewrites, or retires retained recovery. */
function assertNoPendingUpdateRecovery(options = {}) {
	const pending = inspectUpdateRecoveries(options).find((entry) => isUpdateRecoveryPending(entry.record));
	if (pending) throw new UpdateRecoveryRequiredError(decodeUpdateRecovery(pending.raw, pending.record.runId));
}
//#endregion
export { loadUpdateRecovery as n, assertNoPendingUpdateRecovery as t };
