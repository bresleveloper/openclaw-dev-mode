import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
//#region extensions/memory-core/src/memory-session-tombstones.ts
const tombstoneAdmission = {
	name: "memory.session-tombstones",
	schemaDependent: true,
	read: (value) => value instanceof Map ? value : void 0
};
function readMemorySessionTombstones(db) {
	const admitted = getSqliteDatabaseAdmission(db, tombstoneAdmission);
	if (admitted) return admitted;
	const sessions = /* @__PURE__ */ new Map();
	if (tableExists(db, "memory_session_tombstones")) {
		const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_session_tombstones").select(["session_id", "agent_id"])).rows;
		for (const row of rows) sessions.set(row.session_id, row.agent_id);
	}
	publishSqliteDatabaseAdmission(db, tombstoneAdmission, sessions);
	return sessions;
}
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
	return readMemorySessionTombstones(db).get(sessionId) === agentId;
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
		const sessions = new Map(readMemorySessionTombstones(db));
		let recorded = 0;
		for (let start = 0; start < sessionIds.length; start += TOMBSTONE_INSERT_BATCH_SIZE) {
			const result = executeSqliteQuerySync(db, kysely.insertInto("memory_session_tombstones").values(sessionIds.slice(start, start + TOMBSTONE_INSERT_BATCH_SIZE).map((sessionId) => ({
				session_id: sessionId,
				agent_id: params.agentId,
				reason,
				created_at: createdAt
			}))).onConflict((conflict) => conflict.column("session_id").doNothing()));
			recorded += Number(result.numAffectedRows ?? 0n);
			for (const sessionId of sessionIds.slice(start, start + TOMBSTONE_INSERT_BATCH_SIZE)) if (!sessions.has(sessionId)) sessions.set(sessionId, params.agentId);
		}
		if (recorded > 0) executeSqliteQuerySync(db, kysely.updateTable("memory_index_state").set((expression) => ({ revision: expression("revision", "+", 1) })).where("id", "=", 1));
		publishSqliteDatabaseAdmission(db, tombstoneAdmission, sessions);
		return recorded;
	});
}
//#endregion
export { hasMemorySessionTombstone as n, recordMemorySessionTombstonesInDatabase as r, ensureMemorySessionTombstones as t };
