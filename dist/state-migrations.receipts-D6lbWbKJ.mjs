import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/infra/state-migrations.receipts.ts
/** Source keys are persisted contracts; scoped owners hash their scope before the path. */
function resolveLegacyMigrationSourceKey(prefix, sourcePath, scope) {
	const hash = createHash("sha256");
	if (scope !== void 0) hash.update(scope).update("\0");
	return `${prefix}:${hash.update(path.resolve(sourcePath)).digest("hex")}`;
}
function readLegacyMigrationReceiptFromDatabase(database, sourceKey) {
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("migration_sources").select([
		"source_sha256",
		"removed_source",
		"report_json"
	]).where("source_key", "=", sourceKey));
	return row ? {
		sourceKey,
		sourceSha256: row.source_sha256,
		removedSource: row.removed_source === 1,
		reportJson: row.report_json
	} : null;
}
function readLegacyMigrationReceipt(sourceKey, env) {
	return readLegacyMigrationReceiptFromDatabase(openOpenClawStateDatabase({ env }).db, sourceKey);
}
function recordLegacyMigrationRun(database, run) {
	const query = getNodeSqliteKysely(database).insertInto("migration_runs").values({
		id: run.runId,
		started_at: run.startedAt,
		finished_at: run.finishedAt,
		status: run.status,
		report_json: run.reportJson
	});
	executeSqliteQuerySync(database, run.upsert ? query.onConflict((conflict) => conflict.column("id").doUpdateSet({
		finished_at: run.finishedAt,
		status: run.status,
		report_json: run.reportJson
	})) : query);
}
function recordLegacyMigrationSource(database, source) {
	const query = getNodeSqliteKysely(database).insertInto("migration_sources").values({
		source_key: source.sourceKey,
		migration_kind: source.migrationKind,
		source_path: source.sourcePath,
		target_table: source.targetTable,
		source_sha256: source.sourceSha256,
		source_size_bytes: source.sourceSizeBytes,
		source_record_count: source.sourceRecordCount,
		last_run_id: source.runId,
		status: source.status,
		imported_at: source.importedAt,
		removed_source: 0,
		report_json: source.reportJson
	});
	executeSqliteQuerySync(database, source.upsert ? query.onConflict((conflict) => conflict.column("source_key").doUpdateSet({
		source_sha256: source.sourceSha256,
		source_size_bytes: source.sourceSizeBytes,
		source_record_count: source.sourceRecordCount,
		last_run_id: source.runId,
		status: source.status,
		imported_at: source.importedAt,
		removed_source: 0,
		...source.updateReportOnConflict === false ? {} : { report_json: source.reportJson }
	})) : query);
}
/** Insert run and source together inside the caller's existing synchronous transaction. */
function recordLegacyMigrationReceipt(database, receipt) {
	recordLegacyMigrationRun(database, {
		runId: receipt.runId,
		startedAt: receipt.now,
		finishedAt: receipt.now,
		status: "completed",
		reportJson: receipt.reportJson,
		upsert: receipt.upsert
	});
	recordLegacyMigrationSource(database, {
		...receipt,
		status: "completed",
		importedAt: receipt.now
	});
}
function markLegacyMigrationSourceRemoved(sourceKey, env, operationLabel) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
	}, { env }, operationLabel ? { operationLabel } : {});
}
//#endregion
export { recordLegacyMigrationRun as a, recordLegacyMigrationReceipt as i, readLegacyMigrationReceipt as n, recordLegacyMigrationSource as o, readLegacyMigrationReceiptFromDatabase as r, resolveLegacyMigrationSourceKey as s, markLegacyMigrationSourceRemoved as t };
