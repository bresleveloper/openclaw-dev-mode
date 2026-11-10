import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import { r as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { n as readNativeHookRelayBridgeRow, t as readNativeHookRelayBridgeRecordRow } from "./native-hook-relay-bridge-record-Dvw-xPUN.mjs";
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
