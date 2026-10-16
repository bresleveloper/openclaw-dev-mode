import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-pMcF7uIi.mjs";
//#region src/infra/telemetry-store.kernel.ts
const TELEMETRY_STATE_KEY = "telemetry.updateCheck";
function readTelemetryStateInWorker(options) {
	const state = readConfigMachineState(TELEMETRY_STATE_KEY, options);
	return state && isRecord(state) ? state : {};
}
function countRecentTelemetrySessionsInDatabase(database, sinceMs) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_state_events").select((builder) => builder.fn.countAll().as("count")).where("kind", "=", "created").where("occurred_at", ">=", sinceMs))?.count ?? 0;
}
function persistTelemetrySuccessInDatabase(database, state, updatedAtMs) {
	return updateConfigMachineStateInDatabase(database, TELEMETRY_STATE_KEY, (current) => current?.lastPingAt !== void 0 && current.lastPingAt >= state.lastPingAt ? current : state, updatedAtMs);
}
//#endregion
//#region src/infra/telemetry-store.worker.ts
const telemetryOperations = {
	"telemetry.readState": (_input, { stateOptions }) => readTelemetryStateInWorker(stateOptions()),
	"telemetry.countRecentSessions": (input, { stateOptions }) => withExistingOpenClawStateDatabaseReadOnly(({ db }) => countRecentTelemetrySessionsInDatabase(db, input.sinceMs), stateOptions()) ?? 0,
	"telemetry.persistSuccess": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => persistTelemetrySuccessInDatabase(db, input.state, input.updatedAtMs), {
		database: open(),
		...stateOptions()
	}, { operationLabel: "config-machine-state.update" })
};
//#endregion
export { telemetryOperations };
