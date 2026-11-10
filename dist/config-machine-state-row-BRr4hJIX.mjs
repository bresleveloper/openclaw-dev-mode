import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/state/config-machine-state-row.ts
const ttsPathAdmission = {
	name: "state.tts-prefs-path",
	read(value) {
		if (!isRecord(value)) return;
		const row = value.row;
		if (row === void 0) return { row: void 0 };
		if (isRecord(row) && typeof row.value_json === "string" && typeof row.updated_at_ms === "number") return { row: {
			value_json: row.value_json,
			updated_at_ms: row.updated_at_ms
		} };
	}
};
/** Only this named key has complete writer coverage; other machine-state owners keep their reads. */
function publishConfigMachineStateRow(database, key, row) {
	if (key === "tts.prefsPath") publishSqliteDatabaseAdmission(database, ttsPathAdmission, { row });
}
/** Host installation is serialized with the synchronous path writer, including absent values. */
function getTtsMachinePathAdmission(databasePath, load) {
	return getOrLoadSqliteDatabaseAdmissionForPath(databasePath, ttsPathAdmission, () => load ? { row: load() } : void 0);
}
function normalizeConfigMachineStateKey(key) {
	const normalized = key.trim();
	if (!normalized) throw new Error("config machine state key must not be empty");
	return normalized;
}
function readConfigMachineStateRowInDatabase(database, key) {
	const stateKey = normalizeConfigMachineStateKey(key);
	const admitted = stateKey === "tts.prefsPath" ? getSqliteDatabaseAdmission(database, ttsPathAdmission) : void 0;
	if (admitted) return admitted.row;
	if (!tableExists(database, "config_machine_state")) return;
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", stateKey));
	if (isMainThread) publishConfigMachineStateRow(database, stateKey, row);
	return row;
}
//#endregion
export { readConfigMachineStateRowInDatabase as i, normalizeConfigMachineStateKey as n, publishConfigMachineStateRow as r, getTtsMachinePathAdmission as t };
