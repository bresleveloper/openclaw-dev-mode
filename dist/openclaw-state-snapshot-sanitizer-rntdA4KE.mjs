import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { c as parseLegacyExecApprovals, p as tryParsePersistedExecApprovals } from "./exec-approvals-config-JiuCEgOc.mjs";
import { a as projectionValues } from "./exec-approvals-sqlite-BKYjiJeV.mjs";
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
			const sanitized = readSnapshotExecApprovals(row.raw_json);
			executeSqliteQuerySync(database, stateDb.updateTable("exec_approvals_config").set({
				raw_json: `${JSON.stringify(sanitized, null, 2)}\n`,
				...projectionValues(sanitized)
			}).where("config_key", "=", row.config_key));
		}
	}
}
/** Keep a policy Doctor can still migrate instead of substituting fail-closed defaults. */
function readSnapshotExecApprovals(rawJson) {
	const parsed = tryParsePersistedExecApprovals(rawJson) ?? readLegacyExecApprovals(rawJson);
	const sanitized = structuredClone(parsed ?? FAIL_CLOSED_EXEC_APPROVALS);
	if (sanitized.socket) delete sanitized.socket.token;
	return sanitized;
}
function readLegacyExecApprovals(rawJson) {
	const legacy = parseLegacyExecApprovals(rawJson);
	return legacy.ok ? legacy.value : null;
}
//#endregion
export { sanitizeOpenClawStateLeaseRows as n, sanitizeOpenClawGlobalStateSnapshot as t };
