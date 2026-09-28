import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { b as isUpdateRecoveryPending, v as readRecoveries, y as UpdateRecoveryRequiredError } from "./update-run-ledger-DE3m4CLB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-run-recovery.ts
/** Must run before general database open, admission writes, or runtime migration. */
function loadUpdateRecoveries(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readRecoveries(db), options) ?? [];
}
function loadUpdateRecovery(runId, options = {}) {
	return loadUpdateRecoveries(options).find((record) => record.runId === runId);
}
/** Detection only. This delivery never claims, rewrites, or retires retained recovery. */
function assertNoPendingUpdateRecovery(options = {}) {
	const pending = loadUpdateRecoveries(options).find(isUpdateRecoveryPending);
	if (pending) throw new UpdateRecoveryRequiredError(pending);
}
//#endregion
//#region src/infra/update-run-recovery-admission.ts
/** Read-only admission; neither a missing nor a replaced DB retires old recovery. */
async function assertUpdateRecoveryAdmission(options = {}) {
	const databasePath = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!await assertUpdateRecoveryDirectoryAdmission(databasePath)) return;
	assertNoPendingUpdateRecovery({
		...options,
		path: databasePath
	});
}
/** Check publication before an admitted row reader; false means the parent is absent. */
async function assertUpdateRecoveryDirectoryAdmission(databasePath) {
	const parent = path.dirname(databasePath);
	try {
		await fs.lstat(parent);
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		return false;
	}
	if ((await fs.readdir(parent)).some((name) => name.startsWith(".openclaw-restore-"))) throw new Error("Interrupted shared-database publication is read-only while full-state recovery is deferred");
	return true;
}
//#endregion
export { assertUpdateRecoveryDirectoryAdmission as n, loadUpdateRecovery as r, assertUpdateRecoveryAdmission as t };
