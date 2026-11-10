import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as readDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { f as runSqliteReadOnlyOperation } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { f as resolvePackageActivationJournalPath, l as resolvePackageActivationAnchor, u as resolvePackageActivationControl } from "./package-update-activation-paths-CZ6aheGK.mjs";
import { n as ImmutableInstallRecordSchema } from "./update-immutable-install-schema-n_1U7goK.mjs";
import fs from "node:fs/promises";
//#region src/infra/update-immutable-install-record.ts
async function readImmutableInstallRecord(root) {
	const anchor = resolvePackageActivationAnchor(root);
	try {
		await fs.lstat(resolvePackageActivationControl(anchor));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
	const journal = resolvePackageActivationJournalPath(anchor);
	const identity = await readDatabasePathIdentity(journal);
	const record = await runSqliteReadOnlyOperation(journal, {
		type: "immutableInstall.read",
		input: { root }
	}, {
		source: "canonical",
		expectedIdentity: identity.key,
		env: process.env
	});
	return ImmutableInstallRecordSchema.parse(record);
}
//#endregion
export { readImmutableInstallRecord as t };
