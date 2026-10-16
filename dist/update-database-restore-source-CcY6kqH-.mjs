import { s as quoteSqliteIdentifier } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { f as copySqliteFile, i as prepareSqliteReadOnlyCopyInProcess } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { h as withPreparedSqliteSnapshot } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { o as createSqliteTableContractReader, t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { c as sha256File } from "./directory-durability-CqSvP1tc.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import { u as updateRunLedgerSchema } from "./update-run-write-DdGOnqyV.mjs";
import fs from "node:fs/promises";
//#region src/infra/update-database-restore-source.ts
/** Runs only in the inspection child; the parent keeps native exclusion until publication. */
async function prepareUpdateDatabaseRestoreSourceInProcess(params) {
	const snapshot = await prepareSqliteReadOnlyCopyInProcess(params.currentPath, params.stagingRoot);
	return await withPreparedSqliteSnapshot(snapshot, async (location) => {
		const current = openNodeSqliteDatabase(location, { readOnly: true });
		try {
			await copySqliteFile(params.baseline.snapshotPath, params.targetPath, await fs.lstat(params.baseline.snapshotPath, { bigint: true }));
			const copied = await sha256File(params.targetPath);
			if (copied.digest !== params.baseline.sha256 || copied.bytes !== params.baseline.sizeBytes) throw new Error(`Database snapshot changed: ${params.baseline.snapshotPath}`);
			await fs.chmod(params.targetPath, 384);
			const target = openNodeSqliteDatabase(params.targetPath);
			let userVersion;
			try {
				userVersion = readSqliteUserVersion(target);
				if (userVersion !== params.baseline.userVersion) throw new Error(`Database snapshot version changed: ${params.baseline.snapshotPath}`);
				target.exec("PRAGMA journal_mode=DELETE");
				const historyObject = "SELECT 1 FROM sqlite_schema WHERE name = 'update_runs'";
				if (current.prepare(historyObject).get() || target.prepare(historyObject).get()) {
					assertSqliteSchemaContains(current, params.currentPath, updateRunLedgerSchema);
					assertSqliteSchemaContains(target, params.targetPath, updateRunLedgerSchema);
					const contract = createSqliteTableContractReader(current)("update_runs");
					if (!contract?.definition) throw new Error("Update history has no admitted table contract.");
					const columns = [...contract.definition.columns.keys()];
					const selected = columns.map(quoteSqliteIdentifier).join(", ");
					const rows = current.prepare(`SELECT rowid AS restore_rowid, ${selected} FROM update_runs`);
					rows.setReadBigInts(true);
					const insert = target.prepare(`INSERT INTO update_runs (rowid, ${selected}) VALUES (${columns.map(() => "?").concat("?").join(", ")})`);
					target.exec("BEGIN IMMEDIATE");
					try {
						target.exec("DELETE FROM update_runs");
						for (const row of rows.iterate()) insert.run(row.restore_rowid, ...columns.map((column) => row[column]));
						target.exec("COMMIT");
					} catch (error) {
						target.exec("ROLLBACK");
						throw error;
					}
				}
				assertSqliteIntegrity(target, params.targetPath);
			} finally {
				target.close();
			}
			const output = await fs.open(params.targetPath, "r+");
			try {
				await output.sync();
				const content = await sha256File(output);
				return {
					sha256: content.digest,
					sizeBytes: content.bytes,
					userVersion
				};
			} finally {
				await output.close();
			}
		} finally {
			current.close();
		}
	});
}
//#endregion
export { prepareUpdateDatabaseRestoreSourceInProcess };
