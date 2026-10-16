import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { i as stripPluginModelCatalogCredentials } from "./plugin-model-catalog-repair-gbFum2dR.mjs";
import { n as PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE, t as PLUGIN_MODEL_CATALOG_CACHE_SCOPE } from "./plugin-model-catalog.kernel-Bzu1z_BH.mjs";
//#region src/agents/plugin-model-catalog-read.worker.ts
const pluginModelCatalogCredentialReadOperations = { "pluginModelCatalogCredentials.candidates": (input, { stateOptions }) => {
	const { env } = stateOptions();
	const credentials = new Set(input.credentials);
	return input.candidates.filter((candidate) => {
		const result = withFreshOpenClawAgentDatabaseReadOnly(({ db }) => executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("cache_entries").select("value_json").where("scope", "in", [PLUGIN_MODEL_CATALOG_CACHE_SCOPE, PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE])).rows.some((row) => row.value_json !== null && stripPluginModelCatalogCredentials(row.value_json, credentials) !== row.value_json), {
			agentId: candidate.agentId,
			path: candidate.databasePath,
			env
		});
		return result.found ? result.value : result.reason === "schema-missing";
	});
} };
//#endregion
export { pluginModelCatalogCredentialReadOperations };
