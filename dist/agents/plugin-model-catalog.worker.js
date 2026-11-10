import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "../kysely-sync-9fPQaMlh.mjs";
import { l as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly } from "../openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as normalizePluginProviderBaseUrl } from "../plugin-metadata-provider-facts-dTlHNixc.mjs";
import { r as loadPersistedAuthProfileStoreAtDatabasePath } from "../persisted-DbIYEoQ3.mjs";
import { l as readAuthProfileRows } from "../sqlite-json-Dyr7VLoH.mjs";
import { t as loadPersistedAuthProfileStoreFromRows } from "../sqlite-read-BnaiPHv1.mjs";
import { i as stripPluginModelCatalogCredentials, n as isGeneratedPluginModelCatalog } from "../plugin-model-catalog-repair-gbFum2dR.mjs";
import { i as replacePluginModelCatalogEntriesInDatabase, n as PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE, t as PLUGIN_MODEL_CATALOG_CACHE_SCOPE } from "../plugin-model-catalog.kernel-DiB0isaN.mjs";
import { n as pluginModelCatalogCredentialValues } from "../plugin-model-catalog-auth-eUzBqJUU.mjs";
//#region src/agents/plugin-model-catalog.worker.ts
/** Apply removal-time endpoint facts to the current rows inside the writer transaction. */
function pruneRemovedProviderCatalogEntriesInDatabase(params) {
	const removedProviders = Object.entries(params.removedProviderBaseUrls).flatMap(([providerId, baseUrl]) => {
		const normalized = normalizePluginProviderBaseUrl(baseUrl);
		return normalized ? [[providerId, normalized]] : [];
	});
	const kysely = getNodeSqliteKysely(params.database);
	const rows = executeSqliteQuerySync(params.database, kysely.selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE)).rows;
	let changed = false;
	for (const row of rows) {
		if (row.value_json === null) continue;
		let catalog;
		try {
			catalog = JSON.parse(row.value_json);
		} catch {
			continue;
		}
		if (!isGeneratedPluginModelCatalog(catalog) || !isRecord(catalog.providers)) continue;
		let removed = false;
		for (const [providerId, normalizedBaseUrl] of removedProviders) {
			const provider = catalog.providers[providerId];
			if (isRecord(provider) && typeof provider.baseUrl === "string" && normalizePluginProviderBaseUrl(provider.baseUrl) === normalizedBaseUrl) {
				delete catalog.providers[providerId];
				removed = true;
			}
		}
		if (removed) {
			executeSqliteQuerySync(params.database, kysely.updateTable("cache_entries").set({
				value_json: JSON.stringify(catalog),
				updated_at: params.updatedAt
			}).where("scope", "=", PLUGIN_MODEL_CATALOG_CACHE_SCOPE).where("key", "=", row.key));
			changed = true;
		}
	}
	return changed;
}
/** Reread authorization inside the admitted publication, including outside discovery snapshots. */
function findRemovedPluginModelCatalogCredentials(snapshot, database, databasePath, env) {
	const captured = /* @__PURE__ */ new Set();
	const authorized = /* @__PURE__ */ new Set();
	for (const owner of snapshot) {
		const read = (db) => loadPersistedAuthProfileStoreFromRows(readAuthProfileRows(db, owner.databasePath, owner.kind), owner.databasePath);
		const current = owner.kind === "shared-state" ? withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => read(db), {
			path: owner.databasePath,
			env
		}) : owner.databasePath === databasePath ? read(database) : loadPersistedAuthProfileStoreAtDatabasePath(owner.databasePath, owner.kind);
		for (const [id, values] of Object.entries(owner.credentials)) {
			for (const value of values) captured.add(value);
			for (const value of pluginModelCatalogCredentialValues(current?.profiles[id])) authorized.add(value);
		}
	}
	for (const value of authorized) captured.delete(value);
	return captured;
}
/** The canonical executor lends the connection and owns transaction admission. */
function bindSqliteWorkerBackend(_input, context) {
	return {
		execute(command) {
			return runSqliteWorkerTransactionSync(context, () => {
				if (command.type === "catalog.pruneRemovedProviders") return pruneRemovedProviderCatalogEntriesInDatabase({
					database: context.database,
					removedProviderBaseUrls: command.input.removedProviderBaseUrls,
					updatedAt: Date.now()
				});
				if (command.type === "catalog.replace") {
					const { planned, authSnapshot, env } = command.input;
					const removedCredentials = authSnapshot && findRemovedPluginModelCatalogCredentials(authSnapshot, context.database, context.databasePath, env);
					return replacePluginModelCatalogEntriesInDatabase({
						database: context.database,
						planned: new Map(planned),
						removedCredentials,
						updatedAt: Date.now()
					});
				}
				const credentials = new Set(command.input.credentials);
				const kysely = getNodeSqliteKysely(context.database);
				const rows = executeSqliteQuerySync(context.database, kysely.selectFrom("cache_entries").select([
					"scope",
					"key",
					"value_json"
				]).where("scope", "in", [PLUGIN_MODEL_CATALOG_CACHE_SCOPE, PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE])).rows;
				for (const row of rows) {
					if (row.value_json === null) continue;
					const contents = stripPluginModelCatalogCredentials(row.value_json, credentials);
					if (contents === row.value_json) continue;
					if (contents === null) executeSqliteQuerySync(context.database, kysely.deleteFrom("cache_entries").where("scope", "=", row.scope).where("key", "=", row.key));
					else executeSqliteQuerySync(context.database, kysely.updateTable("cache_entries").set({
						value_json: contents,
						updated_at: Date.now()
					}).where("scope", "=", row.scope).where("key", "=", row.key));
				}
			});
		},
		assertSettled() {
			assertTransactionUsable(context.database);
			if (!context.database.isOpen || context.database.isTransaction) throw new Error("Catalog cleanup left an unsettled agent transaction");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
