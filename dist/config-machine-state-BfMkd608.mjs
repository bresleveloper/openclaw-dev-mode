import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
//#region src/state/config-machine-state.ts
function normalizeConfigMachineStateKey(key) {
	const normalized = key.trim();
	if (!normalized) throw new Error("config machine state key must not be empty");
	return normalized;
}
function readConfigMachineStateRowInDatabase(database, key) {
	if (!tableExists(database, "config_machine_state")) return;
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", normalizeConfigMachineStateKey(key)));
}
function readConfigMachineStateWithMetadata(key, options = {}, behavior = {}) {
	const read = ({ db: database }) => {
		const row = readConfigMachineStateRowInDatabase(database, key);
		return row ? {
			value: JSON.parse(row.value_json),
			updatedAtMs: row.updated_at_ms
		} : void 0;
	};
	return behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, options) : withExistingOpenClawStateDatabaseReadOnly(read, options);
}
function readConfigMachineState(key, options = {}, behavior = {}) {
	return readConfigMachineStateWithMetadata(key, options, behavior)?.value;
}
//#endregion
export { readConfigMachineStateWithMetadata as i, readConfigMachineState as n, readConfigMachineStateRowInDatabase as r, normalizeConfigMachineStateKey as t };
