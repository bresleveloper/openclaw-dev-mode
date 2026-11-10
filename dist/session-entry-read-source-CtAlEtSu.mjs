import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent, t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
//#region src/config/sessions/session-entry-read-source.ts
function captureSessionEntryReadSource(database, expectedIdentity, unavailableMessage = "Session entry read requires its current durable owner") {
	if (expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, expectedIdentity);
	const identity = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity.identity !== "string" || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error(unavailableMessage);
	return {
		agentId: database.agentId,
		path: database.path,
		databaseIdentity: identity.identity,
		databaseBirthtime: identity.birthtime
	};
}
function assertCapturedSessionEntryReadSource(source, database) {
	if (typeof source.databaseIdentity === "string" && (!database || database.path !== source.path)) assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
	if (!database) {
		if (typeof source.databaseIdentity === "symbol") throw new Error("Captured session database is no longer open");
		return;
	}
	const physical = readOpenClawAgentDatabaseIdentity(database);
	if (database.agentId !== source.agentId || physical.identity !== source.databaseIdentity || physical.birthtime !== source.databaseBirthtime || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Captured session database changed before read");
}
//#endregion
export { captureSessionEntryReadSource as n, assertCapturedSessionEntryReadSource as t };
