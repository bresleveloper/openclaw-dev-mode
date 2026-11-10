import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "../kysely-sync-9fPQaMlh.mjs";
import { t as INCOGNITO_AGENT_SQLITE_BASENAME } from "../openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as runSqliteSingleStatementSync, t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import path from "node:path";
//#region src/infra/heartbeat-outcome-store.kernel.ts
/** The caller admits this single atomic statement before execution. */
function persistHeartbeatOutcomeInDatabase(db, values) {
	const agentDb = getNodeSqliteKysely(db);
	const { session_key: _sessionKey, ...replacement } = values;
	executeSqliteQuerySync(db, agentDb.insertInto("heartbeat_outcomes").columns([
		"session_key",
		"run_session_key",
		"outcome",
		"summary",
		"response_reason",
		"priority",
		"next_check",
		"task_names_json",
		"wake_source",
		"wake_reason",
		"occurred_at",
		"context_run_id",
		"context_claimed_at",
		"updated_at"
	]).expression(agentDb.selectFrom("session_nodes").select((eb) => [
		"session_key",
		eb.val(values.run_session_key).as("run_session_key"),
		eb.val(values.outcome).as("outcome"),
		eb.val(values.summary).as("summary"),
		eb.val(values.response_reason).as("response_reason"),
		eb.val(values.priority).as("priority"),
		eb.val(values.next_check).as("next_check"),
		eb.val(values.task_names_json).as("task_names_json"),
		eb.val(values.wake_source).as("wake_source"),
		eb.val(values.wake_reason).as("wake_reason"),
		eb.val(values.occurred_at).as("occurred_at"),
		eb.val(values.context_run_id).as("context_run_id"),
		eb.val(values.context_claimed_at).as("context_claimed_at"),
		eb.val(values.updated_at).as("updated_at")
	]).where("session_key", "=", values.session_key)).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		...replacement,
		context_run_id: null,
		context_claimed_at: null
	})));
}
function claimHeartbeatOutcomeRowInDatabase(db, params) {
	const agentDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, agentDb.updateTable("heartbeat_outcomes").set((eb) => ({
		context_run_id: params.runId,
		context_claimed_at: eb.fn.coalesce("context_claimed_at", eb.val(Date.now()))
	})).where("session_key", "=", params.sessionKey).where((eb) => eb.or([eb("context_run_id", "is", null), eb("context_run_id", "=", params.runId)])).returningAll()).rows[0];
}
//#endregion
//#region src/infra/heartbeat-outcome-store.worker.ts
/** Borrows the canonical agent connection for one admitted outcome operation. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	const requiresMutationReceipt = path.basename(context.databasePath) === INCOGNITO_AGENT_SQLITE_BASENAME;
	return {
		execute(command) {
			context.admit("transaction");
			if (command.type === "claim" && !requiresMutationReceipt) {
				const row = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("heartbeat_outcomes").selectAll().where("session_key", "=", command.input.sessionKey).where((eb) => eb.or([eb("context_run_id", "is", null), eb("context_run_id", "=", command.input.runId)]))).rows[0];
				if (!row || row.context_run_id === command.input.runId && row.context_claimed_at !== null) return row;
			}
			context.admit("commit");
			return runSqliteSingleStatementSync(db, () => command.type === "persist" ? persistHeartbeatOutcomeInDatabase(db, command.input) : claimHeartbeatOutcomeRowInDatabase(db, command.input));
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Heartbeat outcome transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
