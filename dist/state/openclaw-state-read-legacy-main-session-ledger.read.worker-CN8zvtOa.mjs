import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
//#region src/config/sessions/legacy-main-session-ledger.read.worker.ts
const legacySessionMigrationReadOperations = { "legacySessionMigration.readLedger": (_input, database) => ({
	type: "legacySessionMigration.readLedger",
	row: executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("migration_sources").select(["report_json", "status"]).where("source_key", "=", "legacy-main-session-keys"))
}) };
//#endregion
export { legacySessionMigrationReadOperations };
