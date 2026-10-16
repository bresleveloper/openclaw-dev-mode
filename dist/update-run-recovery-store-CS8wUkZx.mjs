import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as UPDATE_RECOVERY_KEY_PREFIX, t as UPDATE_RECOVERY_KEY_END } from "./update-run-recovery-keys-CWZoJNcI.mjs";
import { n as decodeUpdateRecovery, r as inspectUpdateRecovery } from "./update-run-recovery-schema-e6yHe0bS.mjs";
//#region src/infra/update-run-recovery-store.ts
function readRecoveryRows(db) {
	if (!tableExists(db, "config_machine_state")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", ">=", UPDATE_RECOVERY_KEY_PREFIX).where("state_key", "<", UPDATE_RECOVERY_KEY_END).orderBy("state_key", "asc")).rows;
}
/** Execution reads only its named operation; unrelated history is not execution input. */
function readRecovery(db, runId) {
	const row = readRecoveryRows(db).find((entry) => entry.state_key === UPDATE_RECOVERY_KEY_PREFIX + runId);
	return row ? decodeUpdateRecovery(row.value_json, runId) : void 0;
}
function inspectRecoveryRows(db) {
	return readRecoveryRows(db).map(({ value_json, state_key }) => inspectUpdateRecovery(value_json, state_key.slice(UPDATE_RECOVERY_KEY_PREFIX.length)));
}
/** Private read-only compatibility surface for diagnostics and retained-pair
* inspection. Legacy receipts remain exact historical evidence, never authority.
* Execution loaders below deliberately reject them instead of upgrading them. */
function inspectUpdateRecoveries(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => inspectRecoveryRows(db), options) ?? [];
}
//#endregion
export { inspectUpdateRecoveries as n, readRecovery as r, inspectRecoveryRows as t };
