import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
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
function readLegacyMigrationRunFromDatabase(database, runId) {
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("migration_runs").select(["status", "report_json"]).where("id", "=", runId));
	return row ? {
		status: row.status,
		reportJson: row.report_json
	} : null;
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
/** The caller owns the transaction and its live mutation admission. */
function markLegacyMigrationSourceRemovedInDatabase(database, sourceKey) {
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", sourceKey));
}
function markLegacyMigrationSourceRemoved(sourceKey, env, operationLabel, assertCurrent) {
	assertCurrent?.();
	runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent?.();
		markLegacyMigrationSourceRemovedInDatabase(db, sourceKey);
		assertCurrent?.();
	}, { env }, operationLabel ? { operationLabel } : {});
}
//#endregion
export { readLegacyMigrationRunFromDatabase as a, recordLegacyMigrationSource as c, readLegacyMigrationReceiptFromDatabase as i, resolveLegacyMigrationSourceKey as l, markLegacyMigrationSourceRemovedInDatabase as n, recordLegacyMigrationReceipt as o, readLegacyMigrationReceipt as r, recordLegacyMigrationRun as s, markLegacyMigrationSourceRemoved as t };
