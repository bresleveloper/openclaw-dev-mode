import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as normalizeConfigMachineStateKey } from "./config-machine-state-BfMkd608.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
//#region src/state/config-machine-state-write.ts
function serializeStateValue(value) {
	const serialized = JSON.stringify(value);
	if (serialized === void 0) throw new Error("config machine state value must be JSON-serializable");
	return serialized;
}
function writeConfigMachineState(key, value, options = {}) {
	const stateKey = normalizeConfigMachineStateKey(key);
	const valueJson = serializeStateValue(value);
	const now = Date.now();
	runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("config_machine_state").values({
			state_key: stateKey,
			value_json: valueJson,
			updated_at_ms: now
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			value_json: valueJson,
			updated_at_ms: now
		})));
	}, options, { operationLabel: "config-machine-state.write" });
}
function updateConfigMachineState(key, update, options = {}) {
	const stateKey = normalizeConfigMachineStateKey(key);
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => updateConfigMachineStateInDatabase(db, stateKey, update, now), options, { operationLabel: "config-machine-state.update" });
}
function updateConfigMachineStateInDatabase(database, stateKey, update, now) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey));
	const value = update(row ? JSON.parse(row.value_json) : void 0);
	if (value === void 0) {
		if (row) executeSqliteQuerySync(database, db.deleteFrom("config_machine_state").where("state_key", "=", stateKey));
		return;
	}
	const valueJson = serializeStateValue(value);
	executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
		state_key: stateKey,
		value_json: valueJson,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: now
	})));
	return value;
}
/** Delete one machine-state value, reporting whether a stored value existed. */
function deleteConfigMachineState(key, options = {}) {
	const stateKey = normalizeConfigMachineStateKey(key);
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		return (executeSqliteQuerySync(database.db, db.deleteFrom("config_machine_state").where("state_key", "=", stateKey)).numAffectedRows ?? 0n) > 0n;
	}, options, { operationLabel: "config-machine-state.delete" });
}
/** Import retired config values without replacing newer canonical database state. */
function importConfigMachineState(entries, options = {}) {
	if (entries.length === 0) return {
		imported: [],
		kept: []
	};
	const normalized = entries.map(([key, value]) => ({
		key: normalizeConfigMachineStateKey(key),
		valueJson: serializeStateValue(value)
	}));
	const now = Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const imported = [];
		const kept = [];
		for (const entry of normalized) {
			if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("config_machine_state").select("state_key").where("state_key", "=", entry.key))) {
				kept.push(entry.key);
				continue;
			}
			executeSqliteQuerySync(database.db, db.insertInto("config_machine_state").values({
				state_key: entry.key,
				value_json: entry.valueJson,
				updated_at_ms: now
			}));
			imported.push(entry.key);
		}
		return {
			imported,
			kept
		};
	}, options, { operationLabel: "config-machine-state.import" });
}
//#endregion
export { writeConfigMachineState as a, updateConfigMachineStateInDatabase as i, importConfigMachineState as n, updateConfigMachineState as r, deleteConfigMachineState as t };
