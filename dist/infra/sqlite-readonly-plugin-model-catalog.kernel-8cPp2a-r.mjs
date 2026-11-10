import { pt as resolveGlobalSingleton } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { J as isIncognitoOpenClawAgentSqlitePath, Q as resolveOpenClawAgentSqlitePath, et as normalizeAgentId } from "./sqlite-readonly-sqlite-snapshot-staging-owner-DzwQ_rDP.mjs";
import { a as readOpenClawAgentDatabase, f as assertCanonicalAgentPersistenceVersion, i as withScopedOpenClawAgentDatabaseReadOnly, k as assertCanonicalSessionValidationSchema, n as getOpenClawAgentDatabaseIfOpen, o as readOpenClawAgentDatabaseSnapshot, p as assertSupportedAgentSchemaVersion, r as OpenClawAgentDatabaseReadOnlyScope, s as withFreshOpenClawAgentDatabaseReadOnly } from "./sqlite-readonly-openclaw-agent-db-DnbjFHbu.mjs";
import { $ as registerNodeSqliteDisposeCallback, D as getNodeSqliteKysely, S as runSqliteReadOperationSync, T as executeSqliteQuerySync, j as sqliteStringSet } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { zn as isArtifactPreservingStateRead } from "./sqlite-readonly-location.worker.js";
//#region src/state/openclaw-agent-db-readonly-companion.ts
const companions = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReadOnlyCompanions"), () => /* @__PURE__ */ new WeakMap());
/** Keep committed reads separate from the writer using the ordinary reader lifecycle. */
function withCommittedOpenClawAgentDatabaseReadOnly(writer, operation, options, behavior = {}) {
	let scope = companions.get(writer.db);
	if (!scope) {
		scope = new OpenClawAgentDatabaseReadOnlyScope(true);
		const owned = scope;
		registerNodeSqliteDisposeCallback(writer.db, () => owned.close());
		companions.set(writer.db, scope);
	}
	const owned = scope;
	return owned.run({
		agentId: writer.agentId,
		path: writer.path
	}, () => owned.read(operation, options, behavior));
}
//#endregion
//#region src/state/openclaw-agent-db-readonly.ts
/**
* Look up a process-held handle without adopting writer-side failures.
*
* Read-only reads are meant to survive a latched open failure or an ownership
* mismatch that only the writable lifecycle cares about; those callers fall
* back to a fresh connection, which reports the precise reason.
*/
function findOpenAgentDatabase(options) {
	try {
		return getOpenClawAgentDatabaseIfOpen(options);
	} catch {
		return;
	}
}
/** Read agent state without creating, registering, migrating, or joining its writable lifecycle. */
function withOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isArtifactPreservingStateRead("agent", pathname)) return withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior);
	if (isIncognitoOpenClawAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) return {
		found: false,
		reason: "database-missing"
	};
	const processOpened = behavior.allowExtension ? void 0 : findOpenAgentDatabase({
		...options,
		agentId
	});
	if (processOpened?.db.isTransaction) return withCommittedOpenClawAgentDatabaseReadOnly(processOpened, operation, {
		...options,
		agentId
	}, behavior);
	if (!processOpened) return withScopedOpenClawAgentDatabaseReadOnly(operation, {
		...options,
		agentId,
		path: pathname
	}, behavior);
	if (behavior.snapshot) return readOpenClawAgentDatabaseSnapshot(processOpened, operation);
	return runSqliteReadOperationSync(processOpened.db, () => {
		const userVersion = assertSupportedAgentSchemaVersion(processOpened.db, pathname);
		assertCanonicalAgentPersistenceVersion(processOpened.db, pathname, userVersion);
		assertCanonicalSessionValidationSchema(processOpened.db);
		return readOpenClawAgentDatabase(processOpened, operation);
	});
}
//#endregion
//#region src/agents/plugin-model-catalog.read-operation.ts
function createPluginModelCatalogReadOperations(read) {
	return { "pluginCatalog.read": read };
}
//#endregion
//#region src/agents/plugin-model-catalog.kernel.ts
const PLUGIN_MODEL_CATALOG_CACHE_SCOPE = "plugin-model-catalog-v1";
function readPluginModelCatalogEntries(options, scope, pluginIds) {
	if (pluginIds?.length === 0) return [];
	const allowed = pluginIds && new Set(pluginIds);
	const result = withOpenClawAgentDatabaseReadOnly(({ db }) => {
		let query = getNodeSqliteKysely(db).selectFrom("cache_entries").select(["key", "value_json"]).where("scope", "=", scope).orderBy("key");
		if (pluginIds) query = query.where("key", "in", sqliteStringSet(pluginIds));
		return executeSqliteQuerySync(db, query).rows.flatMap((row) => row.value_json === null || allowed && !allowed.has(row.key) ? [] : [{
			pluginId: row.key,
			contents: row.value_json
		}]);
	}, options);
	return result.found ? result.value : [];
}
const pluginModelCatalogReadOperations = createPluginModelCatalogReadOperations((input, context) => {
	const scope = new OpenClawAgentDatabaseReadOnlyScope();
	const options = {
		...context,
		agentId: normalizeAgentId(input.agentId)
	};
	try {
		return scope.run(options, () => readPluginModelCatalogEntries(options, PLUGIN_MODEL_CATALOG_CACHE_SCOPE, input.pluginIds));
	} finally {
		scope.close();
	}
});
//#endregion
export { pluginModelCatalogReadOperations };
