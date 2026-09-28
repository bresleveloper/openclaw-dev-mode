import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
//#region src/plugins/installed-plugin-index-row.ts
const INSTALLED_PLUGIN_INDEX_STATE_KEY = "plugins.installedIndex";
/** Shared inspection commands use the same existing-only, artifact-preserving reader. */
function readPluginMetadataStateRowSync(selector, databaseOptions, artifactPreservingReadOnly = false) {
	const row = readPluginMetadataStateRowsSync([selector === "installed-index" ? INSTALLED_PLUGIN_INDEX_STATE_KEY : "plugins.bundledDiscovery"], databaseOptions, artifactPreservingReadOnly)[0];
	return row ? { value_json: row.value_json } : void 0;
}
/** Acquire related metadata facts from the same prepared database bytes. */
function readPluginMetadataStateRowsSync(stateKeys, databaseOptions, artifactPreservingReadOnly = false) {
	const read = ({ db }) => {
		if (!tableExists(db, "config_machine_state")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "in", stateKeys)).rows;
	};
	return (artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, databaseOptions) : withExistingOpenClawStateDatabaseReadOnly(read, databaseOptions)) ?? [];
}
//#endregion
export { readPluginMetadataStateRowSync as n, readPluginMetadataStateRowsSync as r, INSTALLED_PLUGIN_INDEX_STATE_KEY as t };
