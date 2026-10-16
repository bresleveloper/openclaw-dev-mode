import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
//#region src/config/sessions/session-pending-input-history-reconcile.ts
/** Reconciliation shares the canonical writer; no planned ownership survives a host grant. */
function interruptPendingInputHistoryInDatabase(database, options, input, admit, publish) {
	if (input.ids.length > 20) throw new Error("Pending input reconciliation exceeds its page bound");
	return runOpenClawAgentWriteTransaction((current) => {
		if (current.db !== database.db) throw new Error("Pending input history lost its database owner");
		const db = getSessionKysely(current.db);
		const candidates = executeSqliteQuerySync(current.db, db.selectFrom("session_pending_inputs").select([
			"input_id",
			"session_key",
			"session_id",
			"lifecycle_generation",
			db.selectFrom("session_nodes").select("current_session_id").where("session_key", "=", input.sessionKey).as("current_session_id")
		]).where("session_key", "=", input.sessionKey).where("session_id", "=", input.sessionId).where("input_id", "in", input.ids).where("state", "=", "queued").where("consumed_event_id", "is", null)).rows;
		const currentSessionId = candidates[0]?.current_session_id ?? void 0;
		const protectedRows = new Int32Array(new SharedArrayBuffer(candidates.length * Int32Array.BYTES_PER_ELEMENT));
		admit("transaction", {
			kind: "pending-input-history-custody",
			candidates,
			currentSessionId,
			protected: protectedRows.buffer
		});
		const interrupted = candidates.filter((_, index) => Atomics.load(protectedRows, index) === 0);
		const ids = interrupted.map((row) => row.input_id);
		if (ids.length) executeSqliteQuerySync(current.db, db.updateTable("session_pending_inputs").set({ state: "interrupted" }).where("input_id", "in", ids).where("state", "=", "queued").where("consumed_event_id", "is", null));
		const receipt = {
			kind: "pending-input-history-interrupted",
			ids
		};
		publish(receipt);
		admit("commit", {
			kind: "pending-input-history-custody",
			candidates: interrupted,
			currentSessionId
		});
		return receipt;
	}, options, { operationLabel: "session.pending-input.interrupt-stale" });
}
//#endregion
export { interruptPendingInputHistoryInDatabase };
