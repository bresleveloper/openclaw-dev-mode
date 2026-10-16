import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as parseSessionPendingInputMessage } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
//#region src/config/sessions/session-pending-input-withdrawal.worker.ts
/** Retain the accepted receipt while withdrawing only an input the agent has not consumed. */
function discardSessionPendingInputInWorker(database, options, input, admit) {
	return runOpenClawAgentWriteTransaction((current) => {
		if (current.db !== database.db) throw new Error("Pending input withdrawal lost its canonical database owner");
		admit("transaction");
		const commitResult = (withdrawn) => {
			const receipt = {
				kind: "session-pending-input-withdrawal",
				...input,
				withdrawn
			};
			deferSqliteWorkerCommitReceipt(current.db, receipt);
			admit("commit", receipt);
			return withdrawn;
		};
		const schema = getAdmittedSqliteSchemaFacts(current.db);
		if (!schema) throw new Error("Pending input withdrawal requires admitted schema facts");
		if (!schema.tables.has("session_pending_inputs")) return commitResult(false);
		const db = getSessionKysely(current.db);
		if (executeSqliteQueryTakeFirstSync(current.db, db.selectFrom("session_nodes").select("current_session_id").where("session_key", "=", input.sessionKey))?.current_session_id !== input.sessionId) return commitResult(false);
		const rows = executeSqliteQuerySync(current.db, db.selectFrom("session_pending_inputs").select(["input_id", "message_json"]).where("session_key", "=", input.sessionKey).where("session_id", "=", input.sessionId).where("run_id", "=", input.runId).where("consumed_event_id", "is", null).limit(2)).rows;
		const row = rows.length === 1 ? rows[0] : void 0;
		if (!row) return commitResult(false);
		const message = parseSessionPendingInputMessage(row.message_json);
		return commitResult(executeSqliteQuerySync(current.db, db.updateTable("session_pending_inputs").set({
			state: "cancelled",
			message_json: JSON.stringify({
				...message,
				display: false
			})
		}).where("input_id", "=", row.input_id).where("session_key", "=", input.sessionKey).where("session_id", "=", input.sessionId).where("run_id", "=", input.runId).where("consumed_event_id", "is", null)).numAffectedRows === 1n);
	}, options, { operationLabel: "session.pending-input.withdraw" });
}
//#endregion
export { discardSessionPendingInputInWorker };
