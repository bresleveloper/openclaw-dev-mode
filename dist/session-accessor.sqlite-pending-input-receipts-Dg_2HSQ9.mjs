import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { u as parseSqliteTableDefinition } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
//#region src/config/sessions/session-accessor.sqlite-pending-input-receipts.ts
const receiptSchemas = /* @__PURE__ */ new WeakMap();
/** Bounded display reconciliation; these durable correlations never authorize replay. */
function listSessionPendingInputReceipts(scope, options) {
	if (options.runIds.length > 50) throw new Error("Pending input receipt lookup accepts at most 50 run IDs");
	const runIds = [...new Set(options.runIds)];
	if (!runIds.length) return [];
	const resolved = resolveSqliteTranscriptScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const schema = getAdmittedSqliteSchemaFacts(database.db);
		if (!schema) throw new Error("Pending input receipt reads require admitted schema facts");
		let hasReceipts = receiptSchemas.get(schema);
		if (hasReceipts === void 0) {
			const table = schema.tableSql.get("session_pending_inputs");
			hasReceipts = table !== void 0 && parseSqliteTableDefinition(table, "session_pending_inputs").columns.has("consumed_event_id");
			receiptSchemas.set(schema, hasReceipts);
		}
		if (!hasReceipts) return [];
		const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").select([
			"run_id",
			"consumed_event_id",
			"state"
		]).where("session_key", "=", resolved.sessionKey).where("session_id", "=", scope.sessionId).where("run_id", "in", runIds).orderBy("seq", "asc").limit(51)).rows;
		if (rows.length > 50 || new Set(rows.map((row) => row.run_id)).size !== rows.length) throw new Error("Pending input receipt lookup has ambiguous source run IDs");
		return rows.map((row) => row.consumed_event_id == null ? row.state === "cancelled" ? {
			runId: row.run_id,
			state: "pending",
			cancelled: true
		} : {
			runId: row.run_id,
			state: "pending"
		} : {
			runId: row.run_id,
			state: "consumed",
			consumedByEventId: row.consumed_event_id
		});
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
//#endregion
export { listSessionPendingInputReceipts as t };
