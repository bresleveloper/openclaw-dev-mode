import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/agents/harness/native-hook-relay-bridge-query.ts
function readNativeHookRelayBridgeRow(database, relayId) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("native_hook_relay_bridges").selectAll().where("relay_id", "=", relayId));
}
//#endregion
//#region src/agents/harness/native-hook-relay-bridge-record.ts
/** Validate and convert a persisted native relay locator row. */
function readNativeHookRelayBridgeRecordRow(row) {
	if (!row || typeof row.relay_id !== "string" || row.relay_id.length === 0 || !Number.isSafeInteger(row.pid) || row.hostname !== "127.0.0.1" || !Number.isSafeInteger(row.port) || Number(row.port) <= 0 || Number(row.port) > 65535 || typeof row.token !== "string" || row.token.length === 0 || !Number.isSafeInteger(row.expires_at_ms)) return;
	return {
		relayId: row.relay_id,
		pid: Number(row.pid),
		hostname: row.hostname,
		port: Number(row.port),
		token: row.token,
		expiresAtMs: Number(row.expires_at_ms)
	};
}
//#endregion
export { readNativeHookRelayBridgeRow as n, readNativeHookRelayBridgeRecordRow as t };
