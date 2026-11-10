import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
//#region src/config/sessions/session-sharing-store.kernel.ts
/** Management authority and its disclosed evidence come from one current stored snapshot. */
function readSessionMembersInDatabase(database, sessionKey) {
	return runSqliteReadSnapshotSync(database.db, () => ({
		entry: readSessionEntryRow(database, sessionKey, "list")?.entry,
		members: listSessionMembersInDatabase(database, sessionKey)
	}));
}
function listSessionMembersInDatabase(database, sessionKey) {
	const actor = readSessionActorTransactionState(database, { sessionKey });
	if (actor && sessionKey === actor.hot.target.sessionKey) return structuredClone(actor.hot.members);
	return executeSqliteQuerySync(database.db, getSessionMemberKysely(database).selectFrom("session_members").select([
		"identity_id",
		"added_by",
		"added_at"
	]).where("session_key", "=", sessionKey).orderBy("identity_id")).rows.map((row) => ({
		identityId: row.identity_id,
		addedBy: row.added_by,
		addedAt: row.added_at
	}));
}
function getSessionMemberKysely(database) {
	return getNodeSqliteKysely(database.db);
}
//#endregion
export { listSessionMembersInDatabase as n, readSessionMembersInDatabase as r, getSessionMemberKysely as t };
