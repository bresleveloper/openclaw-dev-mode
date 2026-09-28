import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import "./sqlite-worker-runtime-BV5P9OQ4.mjs";
//#region extensions/memory-core/src/memory-session-tombstones.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
function memorySessionTombstonesExist(db) {
	return ensuredDatabases.has(db) || tableExists(db, "memory_session_tombstones");
}
function ensureMemorySessionTombstones(db) {
	if (ensuredDatabases.has(db)) return;
	db.exec(`CREATE TABLE IF NOT EXISTS memory_session_tombstones (
      session_id TEXT NOT NULL PRIMARY KEY,
      agent_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER NOT NULL
    ) STRICT`);
	ensuredDatabases.add(db);
}
function hasMemorySessionTombstone(db, agentId, sessionId) {
	if (!memorySessionTombstonesExist(db)) return false;
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_session_tombstones").select("session_id").where("agent_id", "=", agentId).where("session_id", "=", sessionId)).rows.length > 0;
}
//#endregion
export { hasMemorySessionTombstone as n, memorySessionTombstonesExist as r, ensureMemorySessionTombstones as t };
