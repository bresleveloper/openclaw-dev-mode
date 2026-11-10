import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-l6CS6yvq.mjs";
import { i as isUpdateRecoveryPending, n as decodeUpdateRecovery, t as UpdateRecoveryRequiredError } from "./update-run-recovery-schema-DparDBZU.mjs";
import { r as readRecovery, t as inspectRecoveryRows } from "./update-run-recovery-store-DWInjVEC.mjs";
//#region src/infra/update-run-recovery.ts
function loadUpdateRecovery(runId, options = {}) {
	return (options.allowNativeRead ? withExistingOpenClawStateDatabaseCurrentReadOnly : withExistingOpenClawStateDatabaseArtifactPreservingReadOnly)(({ db }) => readRecovery(db, runId), options);
}
/** Detection only. This delivery never claims, rewrites, or retires retained recovery. */
function assertNoPendingUpdateRecovery(options = {}) {
	const pending = withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => inspectRecoveryRows(db).find((entry) => isUpdateRecoveryPending(entry.record)), options, openDoctorStateSchemaReadAdmission);
	if (pending) throw new UpdateRecoveryRequiredError(decodeUpdateRecovery(pending.raw, pending.record.runId));
}
//#endregion
export { loadUpdateRecovery as n, assertNoPendingUpdateRecovery as t };
