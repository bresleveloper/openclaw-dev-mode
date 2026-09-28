import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/infra/heartbeat-outcome-store.kernel.ts
/** The caller owns the synchronous transaction and its current admission. */
function persistHeartbeatOutcomeInDatabase(db, values) {
	const agentDb = getNodeSqliteKysely(db);
	if (!executeSqliteQueryTakeFirstSync(db, agentDb.selectFrom("session_nodes").select("session_key").where("session_key", "=", values.session_key))) return;
	executeSqliteQuerySync(db, agentDb.insertInto("heartbeat_outcomes").values(values).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		run_session_key: values.run_session_key,
		outcome: values.outcome,
		summary: values.summary,
		response_reason: values.response_reason,
		priority: values.priority,
		next_check: values.next_check,
		task_names_json: values.task_names_json,
		wake_source: values.wake_source,
		wake_reason: values.wake_reason,
		occurred_at: values.occurred_at,
		context_run_id: null,
		context_claimed_at: null,
		updated_at: values.updated_at
	})));
}
function claimHeartbeatOutcomeRowInDatabase(db, params) {
	const agentDb = getNodeSqliteKysely(db);
	const row = executeSqliteQuerySync(db, agentDb.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "=", params.sessionKey)).rows[0];
	if (!row || row.context_run_id !== null && row.context_run_id !== params.runId) return;
	if (row.context_run_id === null) {
		if (executeSqliteQuerySync(db, agentDb.updateTable("heartbeat_outcomes").set({
			context_run_id: params.runId,
			context_claimed_at: Date.now()
		}).where("session_key", "=", params.sessionKey).where("context_run_id", "is", null)).numAffectedRows !== 1n) return;
	}
	return row;
}
//#endregion
export { persistHeartbeatOutcomeInDatabase as n, claimHeartbeatOutcomeRowInDatabase as t };
