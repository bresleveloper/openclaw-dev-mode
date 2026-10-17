import { i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { f as sessionTranscriptIndexNeedsReconcile } from "./session-transcript-index-FbEuN6S5.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-Ugk-kDyr.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { s as parseSessionPendingInputMessage } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { c as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import "./server-constants-BH_EolwD.mjs";
//#region src/config/sessions/session-pending-input-source.kernel.ts
/** Read comparison evidence only; recovered custody is claimed by the current host owner. */
function readPendingInputSourceInDatabase(database, input) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		const snapshot = {
			kind: "source",
			current: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").innerJoin("session_windows", "session_windows.session_id", "session_nodes.current_session_id").select("current_session_id").where("session_nodes.session_key", "=", input.sessionKey).where("session_windows.session_key", "=", input.sessionKey))?.current_session_id === input.sessionId
		};
		if (!snapshot.current) return snapshot;
		const pendingQuery = db.selectFrom("session_pending_inputs").where("session_key", "=", input.sessionKey).where("session_id", "=", input.sessionId).where("idempotency_key", "=", input.idempotencyKey);
		const pending = getAdmittedSqliteSchemaFacts(database.db)?.tables.has("session_pending_inputs") ? executeSqliteQueryTakeFirstSync(database.db, pendingQuery.select((eb) => eb.fn("octet_length", ["message_json"]).as("bytes"))) : void 0;
		if (pending) {
			if (pending.bytes > 26214400) throw new Error("Submitted input exceeds the Gateway payload limit");
			snapshot.pending = executeSqliteQueryTakeFirstSync(database.db, pendingQuery.selectAll());
		} else if (!input.pendingOnly) {
			if (sessionTranscriptIndexNeedsReconcile(database.db, input.sessionId)) throw new SessionTranscriptProjectionUnavailableError(input.sessionId);
			const transcript = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select(transcriptEventReadBytesSql("event").as("bytes")).where("identity.session_id", "=", input.sessionId).where("identity.message_idempotency_key", "=", input.idempotencyKey).orderBy("identity.seq", "desc").limit(1));
			if (transcript && transcript.bytes > 26214400) throw new Error("Submitted input exceeds the Gateway payload limit");
			if (transcript) {
				const committed = readTranscriptMessageByScopedIdempotencyKey(database, {
					...input,
					agentId: database.agentId,
					path: database.path
				}, input.idempotencyKey, "scan");
				snapshot.committed = committed ? parseSessionPendingInputMessage(JSON.stringify(committed.message)) : void 0;
			}
		}
		return snapshot;
	});
}
//#endregion
export { readPendingInputSourceInDatabase as t };
