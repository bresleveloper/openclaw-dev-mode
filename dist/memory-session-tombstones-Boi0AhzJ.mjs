import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import "./sqlite-worker-runtime-BFi6Nryt.mjs";
//#region extensions/memory-core/src/memory-session-tombstones.ts
function ensureMemorySessionTombstones(db) {
	if (tableExists(db, "memory_session_tombstones")) return;
	db.exec(`CREATE TABLE IF NOT EXISTS memory_session_tombstones (
      session_id TEXT NOT NULL PRIMARY KEY,
      agent_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER NOT NULL
    ) STRICT`);
}
function hasMemorySessionTombstone(db, agentId, sessionId) {
	if (!tableExists(db, "memory_session_tombstones")) return false;
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_session_tombstones").select("session_id").where("agent_id", "=", agentId).where("session_id", "=", sessionId)).rows.length > 0;
}
const TOMBSTONE_INSERT_BATCH_SIZE = 128;
/** The caller owns schema admission; preserve the supplied connection and write boundary. */
function recordMemorySessionTombstonesInDatabase(db, params) {
	const sessionIds = [...new Set(params.sessionIds)];
	if (sessionIds.length === 0) return 0;
	const reason = params.reason ?? "forgotten";
	const createdAt = params.createdAt ?? Date.now();
	return runSqliteImmediateTransactionSync(db, () => {
		const kysely = getNodeSqliteKysely(db);
		let recorded = 0;
		for (let start = 0; start < sessionIds.length; start += TOMBSTONE_INSERT_BATCH_SIZE) {
			const result = executeSqliteQuerySync(db, kysely.insertInto("memory_session_tombstones").values(sessionIds.slice(start, start + TOMBSTONE_INSERT_BATCH_SIZE).map((sessionId) => ({
				session_id: sessionId,
				agent_id: params.agentId,
				reason,
				created_at: createdAt
			}))).onConflict((conflict) => conflict.column("session_id").doNothing()));
			recorded += Number(result.numAffectedRows ?? 0n);
		}
		if (recorded > 0) executeSqliteQuerySync(db, kysely.updateTable("memory_index_state").set((expression) => ({ revision: expression("revision", "+", 1) })).where("id", "=", 1));
		return recorded;
	});
}
//#endregion
export { hasMemorySessionTombstone as n, recordMemorySessionTombstonesInDatabase as r, ensureMemorySessionTombstones as t };
