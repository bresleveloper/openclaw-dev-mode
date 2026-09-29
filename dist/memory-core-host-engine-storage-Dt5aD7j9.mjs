import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import "./engine-storage-CRVVcf2V.mjs";
//#region packages/memory-host-sdk/src/memory-entry-origins.ts
function ensureMemoryEntryOriginsSchema(db) {
	db.exec(`CREATE TABLE IF NOT EXISTS memory_entry_origins (
    entry_key TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    session_key TEXT,
    origin_class TEXT NOT NULL CHECK (origin_class IN ('owner', 'agent', 'untrusted', 'system')),
    observed_at INTEGER NOT NULL,
    PRIMARY KEY (entry_key, agent_id, session_id)
  ) STRICT`);
}
function readOrigin(row) {
	return {
		entryKey: row.entry_key,
		agentId: row.agent_id,
		sessionId: row.session_id,
		sessionKey: row.session_key,
		originClass: row.origin_class,
		observedAt: row.observed_at
	};
}
function readMemoryEntryOriginsInDatabase(db, params) {
	let query = getNodeSqliteKysely(db).selectFrom("memory_entry_origins").selectAll().where("agent_id", "=", params.agentId);
	if (params.sessionIds) query = query.where("session_id", "in", params.sessionIds);
	if (params.entryKeys) query = query.where("entry_key", "in", params.entryKeys);
	return executeSqliteQuerySync(db, query.orderBy("entry_key", "asc").orderBy("session_id", "asc")).rows.map(readOrigin);
}
/** The caller owns schema admission and the synchronous transaction. */
function recordMemoryEntryOriginsInDatabase(db, params) {
	const kysely = getNodeSqliteKysely(db);
	let insert;
	return params.origins.flatMap((origin) => {
		if (origin.agentId !== params.agentId) throw new Error("memory entry origin belongs to another agent");
		insert ??= prepareSqliteQuerySync(db, (parameter) => kysely.insertInto("memory_entry_origins").values({
			entry_key: parameter((value) => params.entryKey ?? value.entryKey),
			agent_id: parameter((value) => value.agentId),
			session_id: parameter((value) => value.sessionId),
			session_key: parameter((value) => value.sessionKey),
			origin_class: parameter((value) => value.originClass),
			observed_at: parameter((value) => value.observedAt)
		}).onConflict((conflict) => conflict.columns([
			"entry_key",
			"agent_id",
			"session_id"
		]).doNothing()).returningAll());
		return insert(origin).rows.map(readOrigin);
	});
}
//#endregion
export { readMemoryEntryOriginsInDatabase as n, recordMemoryEntryOriginsInDatabase as r, ensureMemoryEntryOriginsSchema as t };
