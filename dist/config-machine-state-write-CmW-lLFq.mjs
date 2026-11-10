import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeConfigMachineStateKey, r as publishConfigMachineStateRow } from "./config-machine-state-row-BRr4hJIX.mjs";
import { c as withAuthProfileCredentialWrite } from "./user-model-account-authority-DFFjC5J5.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
//#region src/state/config-machine-state-write.ts
function serializeStateValue(value) {
	const serialized = JSON.stringify(value);
	if (serialized === void 0) throw new Error("config machine state value must be JSON-serializable");
	return serialized;
}
function publishMachineStateWrite(database, stateKey, valueJson, write, didWrite) {
	return stateKey === "authProfiles.store" ? withAuthProfileCredentialWrite(database, valueJson === void 0 ? void 0 : JSON.parse(valueJson), write, didWrite) : write();
}
function upsertConfigMachineState(database, stateKey, valueJson, now) {
	publishMachineStateWrite(database, stateKey, valueJson, () => executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("config_machine_state").values({
		state_key: stateKey,
		value_json: valueJson,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: now
	}))));
	publishConfigMachineStateRow(database, stateKey, {
		value_json: valueJson,
		updated_at_ms: now
	});
}
function writeConfigMachineState(key, value, options = {}) {
	const stateKey = normalizeConfigMachineStateKey(key);
	const valueJson = serializeStateValue(value);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => upsertConfigMachineState(db, stateKey, valueJson, now), options, { operationLabel: "config-machine-state.write" });
}
/** Write an owner-held value on its existing admitted transaction connection. */
function writeConfigMachineStateInDatabase(database, key, value) {
	const now = Date.now();
	upsertConfigMachineState(database, normalizeConfigMachineStateKey(key), serializeStateValue(value), now);
	return now;
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
		if (row) publishMachineStateWrite(database, stateKey, void 0, () => executeSqliteQuerySync(database, db.deleteFrom("config_machine_state").where("state_key", "=", stateKey)));
		publishConfigMachineStateRow(database, stateKey, void 0);
		return;
	}
	upsertConfigMachineState(database, stateKey, serializeStateValue(value), now);
	return value;
}
/** Delete one machine-state value, reporting whether a stored value existed. */
function deleteConfigMachineState(key, options = {}) {
	const stateKey = normalizeConfigMachineStateKey(key);
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const result = publishMachineStateWrite(database.db, stateKey, void 0, () => executeSqliteQuerySync(database.db, db.deleteFrom("config_machine_state").where("state_key", "=", stateKey)));
		publishConfigMachineStateRow(database.db, stateKey, void 0);
		return (result.numAffectedRows ?? 0n) > 0n;
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
			if (!publishMachineStateWrite(database.db, entry.key, entry.valueJson, () => executeSqliteQueryTakeFirstSync(database.db, db.insertInto("config_machine_state").values({
				state_key: entry.key,
				value_json: entry.valueJson,
				updated_at_ms: now
			}).onConflict((conflict) => conflict.column("state_key").doNothing()).returning("state_key")), (result) => result !== void 0)) {
				kept.push(entry.key);
				continue;
			}
			publishConfigMachineStateRow(database.db, entry.key, {
				value_json: entry.valueJson,
				updated_at_ms: now
			});
			imported.push(entry.key);
		}
		return {
			imported,
			kept
		};
	}, options, { operationLabel: "config-machine-state.import" });
}
//#endregion
export { writeConfigMachineState as a, updateConfigMachineStateInDatabase as i, importConfigMachineState as n, writeConfigMachineStateInDatabase as o, updateConfigMachineState as r, deleteConfigMachineState as t };
