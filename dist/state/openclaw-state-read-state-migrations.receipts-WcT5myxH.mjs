import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "node:path";
import "node:crypto";
//#region src/infra/state-migrations.receipts.ts
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
//#endregion
export { readLegacyMigrationReceiptFromDatabase as t };
