import "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { n as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { n as readNativeHookRelayBridgeRow, t as readNativeHookRelayBridgeRecordRow } from "./native-hook-relay-bridge-record-DEqslTZw.mjs";
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
