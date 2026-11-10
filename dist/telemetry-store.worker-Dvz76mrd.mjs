import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-CmW-lLFq.mjs";
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
