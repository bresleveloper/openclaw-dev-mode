import "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { c as literal, f as object, g as string, i as array } from "./openclaw-state-read-schemas-D2seJkFD.mjs";
import { a as tableExists } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import "./openclaw-state-read-sqlite-busy-timeout-BW3lmGFD.mjs";
import "./openclaw-state-read-openclaw-state-db-handle-BSLzO3AU.mjs";
import "./openclaw-state-read.worker.js";
import "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-state-migrations.receipts-WcT5myxH.mjs";
import "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
import "node:fs";
import "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/deferred-plugin-migrations.contract.ts
const deferredPluginMigrationSchema = object({
	pluginId: string().min(1),
	reason: string().min(1),
	command: string().min(1),
	requiresStateMigration: literal(true).optional(),
	requiresDoctorInspection: literal(true).optional(),
	configPaths: array(array(string().min(1)).min(1)).optional(),
	validationExcludedPaths: array(array(string().min(1)).min(1)).optional()
});
//#endregion
//#region src/infra/deferred-plugin-migrations.ts
const RUN_PREFIX = "deferred-plugin-migration:";
new AsyncLocalStorage();
function readPendingMigrationRows(database) {
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("migration_runs").select(["id", "report_json"]).where("id", "like", `${RUN_PREFIX}%`).where("status", "=", "pending").orderBy("id")).rows;
}
function pendingMigrationRecords(rows) {
	return rows.map((row) => deferredPluginMigrationSchema.parse(JSON.parse(row.report_json)));
}
function readPendingMigrationRecords(database) {
	return tableExists(database, "migration_runs") ? pendingMigrationRecords(readPendingMigrationRows(database)) : [];
}
const deferredPluginMigrationReadOperations = { "plugins.deferredMigrations.read": (_input, db) => ({
	type: "plugins.deferredMigrations.read",
	pending: readPendingMigrationRecords(db)
}) };
//#endregion
export { deferredPluginMigrationReadOperations };
