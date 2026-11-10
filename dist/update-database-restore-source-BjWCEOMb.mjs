import { ut as quoteSqliteIdentifier } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { h as withPreparedSqliteSnapshot } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { f as copySqliteFile, i as prepareSqliteReadOnlyCopyInProcess } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { n as assertSqliteSchemaContains, s as createSqliteTableContractReader } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { c as sha256File } from "./directory-durability-B2RKADOj.mjs";
import { f as updateRunLedgerSchema } from "./update-run-write-Dd5ORe9V.mjs";
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
					const placeholders = Array.from({ length: columns.length + 1 }, () => "?").join(", ");
					const insert = target.prepare(`INSERT INTO update_runs (rowid, ${selected}) VALUES (${placeholders})`);
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
