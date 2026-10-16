import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/config/sessions/session-sharing-store.kernel.ts
function listSessionMembersInDatabase(database, sessionKey) {
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
function hasSessionMemberInDatabase(database, sessionKey, normalizedIdentityId) {
	return Boolean(executeSqliteQueryTakeFirstSync(database.db, getSessionMemberKysely(database).selectFrom("session_members").select("identity_id").where("session_key", "=", sessionKey).where("identity_id", "=", normalizedIdentityId)));
}
//#endregion
export { hasSessionMemberInDatabase as n, listSessionMembersInDatabase as r, getSessionMemberKysely as t };
