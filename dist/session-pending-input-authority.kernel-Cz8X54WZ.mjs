import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as listSessionMembersInDatabase } from "./session-sharing-store.kernel-DHH7VvHM.mjs";
//#region src/config/sessions/session-pending-input-authority.kernel.ts
function readSessionPendingInputAuthorityFacts(database, sessionKey, agentId = database.agentId, postimage) {
	return runSqliteReadSnapshotSync(database.db, () => readSessionPendingInputAuthorityFactsInTransaction(database, sessionKey, agentId, postimage?.sessionKey === sessionKey && getSqliteReadScopeRevision(database.db) === postimage.revision ? /* @__PURE__ */ new Map([[sessionKey, structuredClone(postimage.entry)]]) : void 0));
}
/** The caller already owns the coherent SQLite transaction. */
function readSessionPendingInputAuthorityFactsInTransaction(database, sessionKey, agentId = database.agentId, entries) {
	const identity = readOpenClawAgentDatabaseIdentity(database);
	const entry = entries?.has(sessionKey) ? entries.get(sessionKey) : readSessionEntryRow(database, sessionKey, "list")?.entry;
	return {
		agentId,
		storePath: database.path,
		sessionKey: toAgentStoreSessionKey({
			agentId,
			requestKey: sessionKey
		}),
		entry: entry ? attachSessionEntrySnapshots({ ...entry }, {}, "list") : void 0,
		readSource: typeof identity.identity === "string" ? {
			agentId: database.agentId,
			path: database.path,
			databaseIdentity: identity.identity,
			databaseBirthtime: identity.birthtime
		} : void 0,
		members: listSessionMembersInDatabase(database, sessionKey)
	};
}
//#endregion
export { readSessionPendingInputAuthorityFactsInTransaction as n, readSessionPendingInputAuthorityFacts as t };
