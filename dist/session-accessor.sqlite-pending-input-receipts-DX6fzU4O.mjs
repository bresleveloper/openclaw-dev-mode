import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { F as hasPendingInputConsumptionColumn } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as projectPendingInputReceipts, n as normalizePendingInputReceiptRunIds } from "./session-pending-input-value-CPY0B7Hg.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
//#region src/config/sessions/session-accessor.sqlite-pending-input-receipts.ts
const receiptSchemas = /* @__PURE__ */ new WeakMap();
/** History-worker display reconciliation; these durable correlations never authorize replay. */
function listSessionPendingInputReceipts(scope, options) {
	const runIds = normalizePendingInputReceiptRunIds(options.runIds);
	if (!runIds.length) return [];
	const resolved = resolveSqliteTranscriptScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const schema = getAdmittedSqliteSchemaFacts(database.db);
		if (!schema) throw new Error("Pending input receipt reads require admitted schema facts");
		let hasReceipts = receiptSchemas.get(schema);
		if (hasReceipts === void 0) {
			hasReceipts = hasPendingInputConsumptionColumn(database.db);
			receiptSchemas.set(schema, hasReceipts);
		}
		if (!hasReceipts) return [];
		const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_pending_inputs").select([
			"run_id",
			"consumed_event_id",
			"state"
		]).where("session_key", "=", resolved.sessionKey).where("session_id", "=", scope.sessionId).where("run_id", "in", runIds).orderBy("seq", "asc").limit(51)).rows;
		return projectPendingInputReceipts(rows);
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
//#endregion
export { listSessionPendingInputReceipts };
