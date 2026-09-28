import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { f as tryParsePersistedExecApprovals } from "./exec-approvals-config-C7iYNiP7.mjs";
import { o as projectionValues } from "./exec-approvals-sqlite-B0xu2OwW.mjs";
//#region src/state/openclaw-state-snapshot-sanitizer.ts
const FAIL_CLOSED_EXEC_APPROVALS = {
	version: 1,
	defaults: {
		security: "deny",
		ask: "off",
		askFallback: "deny",
		autoAllowSkills: false
	},
	agents: {}
};
function tableExists(database, tableName) {
	return database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)?.ok === 1;
}
/** Remove coordination rows that must never survive restore. */
function sanitizeOpenClawStateLeaseRows(database) {
	for (const table of ["state_leases", "agent_database_leases"]) if (tableExists(database, table)) database.prepare(`DELETE FROM ${table}`).run();
}
/** Remove transient rows whose restoration would replay work or extend private-data retention. */
function sanitizeOpenClawGlobalStateSnapshot(database) {
	sanitizeOpenClawStateLeaseRows(database);
	if (tableExists(database, "delivery_queue_entries")) database.prepare("DELETE FROM delivery_queue_entries").run();
	if (tableExists(database, "plugin_blob_entries")) database.prepare("DELETE FROM plugin_blob_entries WHERE expires_at IS NOT NULL").run();
	if (tableExists(database, "exec_approvals_config")) {
		const stateDb = getNodeSqliteKysely(database);
		const rows = executeSqliteQuerySync(database, stateDb.selectFrom("exec_approvals_config").select(["config_key", "raw_json"])).rows;
		for (const row of rows) {
			let sanitized = FAIL_CLOSED_EXEC_APPROVALS;
			const parsed = tryParsePersistedExecApprovals(row.raw_json);
			if (parsed) {
				sanitized = structuredClone(parsed);
				if (sanitized.socket) delete sanitized.socket.token;
			}
			executeSqliteQuerySync(database, stateDb.updateTable("exec_approvals_config").set({
				raw_json: `${JSON.stringify(sanitized, null, 2)}\n`,
				...projectionValues(sanitized)
			}).where("config_key", "=", row.config_key));
		}
	}
}
//#endregion
export { sanitizeOpenClawStateLeaseRows as n, sanitizeOpenClawGlobalStateSnapshot as t };
