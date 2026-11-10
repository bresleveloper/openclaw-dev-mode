import { o as clearNodeSqliteKyselyCacheForDatabase } from "./sqlite-user-version-Cr9fhNQ-.mjs";
import { D as getNodeSqliteKysely, E as executeSqliteQueryTakeFirstSync, l as openNodeSqliteDatabase, o as setSqliteBusyTimeout } from "./openclaw-state-db-schema-migration-required-DX3ZK7SD.mjs";
import { r as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-PFalGklL.mjs";
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
//#region src/agents/harness/native-hook-relay-client-read.ts
/** One-shot locator admission never initializes or migrates shared state. */
function readNativeHookRelayClientRecord(params, busyTimeoutMs) {
	const db = openNodeSqliteDatabase(params.stateDbPath, { readOnly: true });
	try {
		setSqliteBusyTimeout(db, busyTimeoutMs);
		assertSupportedStateSchemaVersion(db, params.stateDbPath);
		return readNativeHookRelayBridgeRecordRow(readNativeHookRelayBridgeRow(db, params.relayId));
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
//#endregion
export { readNativeHookRelayClientRecord };
