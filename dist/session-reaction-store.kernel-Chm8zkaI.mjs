import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { t as readSessionEntryInstanceId } from "./session-accessor.sqlite-entry-identity-P-nzw0e8.mjs";
import "./lifecycle-BH2MRg79.mjs";
import { i as summarizeReactions, n as reactionDb, r as reactionRows } from "./session-reaction-store.read-T2ans2sm.mjs";
//#region src/config/sessions/session-reaction-store.kernel.ts
var SessionReactionLimitError = class extends Error {
	constructor() {
		super("reaction limit reached");
		this.name = "SessionReactionLimitError";
	}
};
/** The message was deleted between the caller's asynchronous read and this transaction. */
var SessionReactionMessageMissingError = class extends Error {
	constructor() {
		super("unknown message");
		this.name = "SessionReactionMessageMissingError";
	}
};
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
	if (params.remove) executeSqliteQuerySync(database.db, db.deleteFrom("session_reactions").where("session_key", "=", sessionKey).where("session_id", "=", params.expectedSessionId).where("message_id", "=", params.messageId).where("emoji", "=", params.emoji).where("identity_id", "=", params.identityId));
	else {
		if ((executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_reactions").select((eb) => eb.fn.countAll().as("count")).where("session_key", "=", sessionKey).where("session_id", "=", params.expectedSessionId))?.count ?? 0) >= 5e3 || rows.filter((row) => row.identity_id === params.identityId).length >= 20) throw new SessionReactionLimitError();
		if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("event_id").where("session_id", "=", params.expectedSessionId).where("event_id", "=", params.messageId))) throw new SessionReactionMessageMissingError();
		executeSqliteQuerySync(database.db, db.insertInto("session_reactions").values({
			session_key: sessionKey,
			session_id: params.expectedSessionId,
			message_id: params.messageId,
			emoji: params.emoji,
			identity_id: params.identityId,
			identity_label: params.identityLabel ?? null,
			created_at: Date.now()
		}));
	}
	const remainingRows = executeSqliteQuerySync(database.db, reactionRows(database, sessionKey, params.expectedSessionId).where("message_id", "=", params.messageId)).rows;
	return {
		reactions: summarizeReactions(remainingRows),
		newestRemainingEmoji: remainingRows.at(-1)?.emoji,
		changed: true
	};
}
//#endregion
export { SessionReactionMessageMissingError as n, setSessionReactionInDatabase as r, SessionReactionLimitError as t };
