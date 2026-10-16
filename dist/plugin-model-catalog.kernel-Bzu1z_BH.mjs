import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import "./agent-id-D1-Q6vR4.mjs";
import "./openclaw-agent-db-readonly-scope-CLlkTUQB.mjs";
import { i as stripPluginModelCatalogCredentials } from "./plugin-model-catalog-repair-gbFum2dR.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
//#endregion
//#region src/agents/plugin-model-catalog.kernel.ts
const PLUGIN_MODEL_CATALOG_CACHE_SCOPE = "plugin-model-catalog-v1";
const PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE = "plugin-model-catalog-migration-v1";
function readPluginModelCatalogEntries(options, scope, pluginIds) {
	if (pluginIds?.length === 0) return [];
	const allowed = pluginIds && new Set(pluginIds);
	const result = withOpenClawAgentDatabaseReadOnly(({ db }) => {
		const query = getNodeSqliteKysely(db).selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", scope).orderBy("key");
		return executeSqliteQuerySync(db, query).rows.flatMap((row) => row.value_json === null || allowed && !allowed.has(row.key) ? [] : [{
			pluginId: row.key,
			contents: row.value_json
		}]);
	}, options);
	return result.found ? result.value : [];
}
/** The admitted worker or Doctor transaction owns the connection and commit. */
function replacePluginModelCatalogEntriesInDatabase(params) {
	const kysely = getNodeSqliteKysely(params.database);
	const existing = executeSqliteQuerySync(params.database, kysely.selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE)).rows;
	const existingByPluginId = new Map(existing.map((row) => [row.key, row.value_json]));
	const existingMigrationPayloads = params.migrationPayloads ? new Map(executeSqliteQuerySync(params.database, kysely.selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE)).rows.map((row) => [row.key, row.value_json])) : void 0;
	const upsertCacheEntry = (scope, pluginId, contents) => {
		executeSqliteQuerySync(params.database, kysely.insertInto("cache_entries").values({
			scope,
			key: pluginId,
			value_json: contents,
			blob: null,
			expires_at: null,
			updated_at: params.updatedAt
		}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet({
			value_json: contents,
			blob: null,
			expires_at: null,
			updated_at: params.updatedAt
		})));
	};
	let changed = false;
	for (const [pluginId, plannedContents] of params.planned) {
		const contents = params.removedCredentials?.size ? stripPluginModelCatalogCredentials(plannedContents, params.removedCredentials) : plannedContents;
		if (contents === null) continue;
		const migrationPayload = params.migrationPayloads?.get(pluginId);
		if (migrationPayload && existingMigrationPayloads?.get(pluginId) === migrationPayload) continue;
		if (existingByPluginId.get(pluginId) !== contents) {
			upsertCacheEntry(PLUGIN_MODEL_CATALOG_CACHE_SCOPE, pluginId, contents);
			changed = true;
		}
		if (migrationPayload) {
			upsertCacheEntry(PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE, pluginId, migrationPayload);
			changed = true;
		}
	}
	if (params.deleteMissing !== false) for (const pluginId of existingByPluginId.keys()) {
		if (params.planned.has(pluginId)) continue;
		executeSqliteQuerySync(params.database, kysely.deleteFrom("cache_entries").where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE).where("key", "=", pluginId));
		changed = true;
	}
	return changed;
}
//#endregion
export { replacePluginModelCatalogEntriesInDatabase as i, PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE as n, readPluginModelCatalogEntries as r, PLUGIN_MODEL_CATALOG_CACHE_SCOPE as t };
