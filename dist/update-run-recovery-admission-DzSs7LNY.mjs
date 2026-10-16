import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as assertNoPendingUpdateRecovery } from "./update-run-recovery-iGTrAbe1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
export { assertUpdateRecoveryDirectoryAdmission as n, assertUpdateRecoveryAdmission as t };
