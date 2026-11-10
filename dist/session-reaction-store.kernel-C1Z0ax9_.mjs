import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { a as SessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as SessionReactionMessageMissingError, t as SessionReactionLimitError } from "./session-reaction-errors-857xqNjc.mjs";
import { t as readSessionEntryInstanceId } from "./session-accessor.sqlite-entry-identity-DNiqiZkm.mjs";
import { i as summarizeReactions, n as reactionDb, r as reactionRows } from "./session-reaction-store.read-Bic2z8IQ.mjs";
//#region src/config/sessions/session-reaction-store.kernel.ts
function setSessionReactionInDatabase(database, sessionKey, params) {
	if (readSessionEntryInstanceId(database, sessionKey) !== params.expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before reaction mutation");
	const db = reactionDb(database);
	const rows = executeSqliteQuerySync(database.db, reactionRows(database, sessionKey, params.expectedSessionId).where("message_id", "=", params.messageId)).rows;
	const existing = rows.some((row) => row.emoji === params.emoji && row.identity_id === params.identityId);
	if (params.remove ? !existing : existing) return {
		reactions: summarizeReactions(rows),
		newestRemainingEmoji: rows.at(-1)?.emoji,
		changed: false
	};
	if (params.remove) {
		executeSqliteQuerySync(database.db, db.deleteFrom("session_reactions").where("session_key", "=", sessionKey).where("session_id", "=", params.expectedSessionId).where("message_id", "=", params.messageId).where("emoji", "=", params.emoji).where("identity_id", "=", params.identityId));
		const index = rows.findIndex((row) => row.emoji === params.emoji && row.identity_id === params.identityId);
		rows.splice(index, 1);
	} else {
		if ((executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_reactions").select((eb) => eb.fn.countAll().as("count")).where("session_key", "=", sessionKey).where("session_id", "=", params.expectedSessionId))?.count ?? 0) >= 5e3 || rows.filter((row) => row.identity_id === params.identityId).length >= 20) throw new SessionReactionLimitError();
		if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("event_id").where("session_id", "=", params.expectedSessionId).where("event_id", "=", params.messageId))) throw new SessionReactionMessageMissingError();
		const inserted = executeSqliteQueryTakeFirstSync(database.db, db.insertInto("session_reactions").values({
			session_key: sessionKey,
			session_id: params.expectedSessionId,
			message_id: params.messageId,
			emoji: params.emoji,
			identity_id: params.identityId,
			identity_label: params.identityLabel ?? null,
			created_at: Date.now()
		}).returningAll());
		if (!inserted) throw new Error("Reaction insert did not return its stored row");
		rows.push(inserted);
		rows.sort((left, right) => left.created_at - right.created_at || Buffer.compare(Buffer.from(left.emoji), Buffer.from(right.emoji)) || Buffer.compare(Buffer.from(left.identity_id), Buffer.from(right.identity_id)));
	}
	return {
		reactions: summarizeReactions(rows),
		newestRemainingEmoji: rows.at(-1)?.emoji,
		changed: true
	};
}
//#endregion
export { setSessionReactionInDatabase };
