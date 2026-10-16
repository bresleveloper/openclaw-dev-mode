import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "../kysely-sync-K7ftY-g4.mjs";
import { o as runSqliteWorkerTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "../openclaw-state-db-readonly-CC57AD_q.mjs";
import { o as readAuthProfileRows } from "../sqlite-json-P6pbG3re.mjs";
import { i as loadPersistedAuthProfileStoreAtDatabasePath } from "../persisted-BVyWmvfF.mjs";
import { t as loadPersistedAuthProfileStoreFromRows } from "../sqlite-read-Ct0XVCT8.mjs";
import { i as stripPluginModelCatalogCredentials } from "../plugin-model-catalog-repair-gbFum2dR.mjs";
import { i as replacePluginModelCatalogEntriesInDatabase, n as PLUGIN_MODEL_CATALOG_MIGRATION_SCOPE, t as PLUGIN_MODEL_CATALOG_CACHE_SCOPE } from "../plugin-model-catalog.kernel-Bzu1z_BH.mjs";
import { n as pluginModelCatalogCredentialValues } from "../plugin-model-catalog-auth-DirsNkGk.mjs";
//#region src/agents/plugin-model-catalog.worker.ts
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
