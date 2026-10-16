import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, n as createSqliteQueryCache, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as PluginStateStoreError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
//#region src/plugin-state/plugin-state-store.kernel.ts
const MAX_PLUGIN_STATE_VALUE_BYTES = 1048576;
const RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX = "@retained.";
function isRetainedPluginStateNamespace(namespace) {
	return namespace.startsWith(RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX);
}
const PLUGIN_STATE_EXPIRY_BATCH_ROWS = 1024;
function createPluginStateError(params) {
	return new PluginStateStoreError(params.message, {
		code: params.code,
		operation: params.operation,
		...params.path ? { path: params.path } : {},
		cause: params.cause
	});
}
function resolvePluginStateExpiresAtMs(params) {
	if (params.ttlMs == null) return null;
	if (params.namespace && isRetainedPluginStateNamespace(params.namespace)) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: params.operation,
		message: "Retained plugin state does not accept a TTL.",
		path: params.path
	});
	const expiresAt = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: params.now });
	if (expiresAt === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: params.operation,
		message: "Plugin state ttlMs cannot produce a valid expiry timestamp.",
		...params.path ? { path: params.path } : {}
	});
	return expiresAt;
}
function parseStoredJson(raw, operation, databasePath) {
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw createPluginStateError({
			code: "PLUGIN_STATE_CORRUPT",
			operation,
			message: "Plugin state entry contains corrupt JSON.",
			path: databasePath,
			cause: error
		});
	}
}
function rowToEntry(row, operation, databasePath) {
	const expiresAt = normalizeSqliteNumber(row.expires_at);
	return {
		key: row.entry_key,
		value: parseStoredJson(row.value_json, operation, databasePath),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		...expiresAt != null ? { expiresAt } : {}
	};
}
function getPluginStateKysely(db) {
	return getNodeSqliteKysely(db);
}
function bindPluginStateEntry(params) {
	return {
		plugin_id: params.pluginId,
		namespace: params.namespace,
		entry_key: params.key,
		value_json: params.valueJson,
		created_at: params.createdAt,
		expires_at: params.expiresAt
	};
}
const pluginStateUpsertQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).insertInto("plugin_state_entries").values({
	plugin_id: parameter((value) => value.plugin_id),
	namespace: parameter((value) => value.namespace),
	entry_key: parameter((value) => value.entry_key),
	value_json: parameter((value) => value.value_json),
	created_at: parameter((value) => value.created_at),
	expires_at: parameter((value) => value.expires_at)
}).onConflict((conflict) => conflict.columns([
	"plugin_id",
	"namespace",
	"entry_key"
]).doUpdateSet({
	value_json: (eb) => eb.ref("excluded.value_json"),
	created_at: (eb) => eb.ref("excluded.created_at"),
	expires_at: (eb) => eb.ref("excluded.expires_at")
}))));
function upsertPluginStateEntry(db, row) {
	pluginStateUpsertQuery(db)(row);
}
const pluginStateInsertIfAbsentQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).insertInto("plugin_state_entries").orIgnore().values({
	plugin_id: parameter((value) => value.plugin_id),
	namespace: parameter((value) => value.namespace),
	entry_key: parameter((value) => value.entry_key),
	value_json: parameter((value) => value.value_json),
	created_at: parameter((value) => value.created_at),
	expires_at: parameter((value) => value.expires_at)
})));
function insertPluginStateEntryIfAbsent(db, row) {
	const result = pluginStateInsertIfAbsentQuery(db)(row);
	return Number(result.numAffectedRows ?? 0) > 0;
}
const pluginStateEntryExistsQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => {
	const pluginId = parameter((value) => value.pluginId);
	const namespace = parameter((value) => value.namespace);
	const key = parameter((value) => value.key);
	const now = parameter((value) => value.now);
	return getPluginStateKysely(db).selectFrom("plugin_state_entries").select("entry_key").where("plugin_id", "=", pluginId).where("namespace", "=", namespace).where("entry_key", "=", key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]));
}));
function hasPluginStateEntry(db, params) {
	return pluginStateEntryExistsQuery(db)(params).rows.length !== 0;
}
const pluginStateEntryQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => {
	const pluginId = parameter((value) => value.pluginId);
	const namespace = parameter((value) => value.namespace);
	const key = parameter((value) => value.key);
	const now = parameter((value) => value.now);
	return getPluginStateKysely(db).selectFrom("plugin_state_entries").select([
		"entry_key",
		"value_json",
		"created_at",
		"expires_at"
	]).where("plugin_id", "=", pluginId).where("namespace", "=", namespace).where("entry_key", "=", key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]));
}));
function selectPluginStateEntry(db, params) {
	return pluginStateEntryQuery(db)(params).rows[0];
}
function iteratePluginStateEntries(db, params) {
	return iterateSqliteQuerySync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select([
		"entry_key",
		"value_json",
		"created_at",
		"expires_at"
	]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc"));
}
function selectPluginStateEntriesInKeyRange(db, params) {
	return executeSqliteQuerySync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select([
		"entry_key",
		"value_json",
		"created_at",
		"expires_at"
	]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", ">=", params.keyStartInclusive).where("entry_key", "<", params.keyEndExclusive).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("entry_key", params.order).limit(params.limit)).rows;
}
function deletePluginStateEntry(db, params) {
	const result = executeSqliteQuerySync(db, getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
	return Number(result.numAffectedRows ?? 0);
}
const pluginStateExpiryQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select("expires_at").where("expires_at", "is not", null).where("expires_at", "<=", parameter((value) => value)).limit(1)));
function deleteExpiredPluginStateEntries(db, now, scope) {
	if (scope && isRetainedPluginStateNamespace(scope.namespace)) return 0;
	const kysely = getPluginStateKysely(db);
	if (scope) {
		if (pluginStateExpiryQuery(db)(now).rows.length === 0) return 0;
	}
	let expiredEntries = kysely.selectFrom("plugin_state_entries").select([
		"plugin_id",
		"namespace",
		"entry_key"
	]).where("expires_at", "is not", null).where("expires_at", "<=", now);
	expiredEntries = scope ? expiredEntries.where("plugin_id", "=", scope.pluginId).where("namespace", "=", scope.namespace) : expiredEntries.orderBy("expires_at", "asc");
	const result = executeSqliteQuerySync(db, kysely.deleteFrom("plugin_state_entries").where((expression) => expression(expression.refTuple("plugin_id", "namespace", "entry_key"), "in", expiredEntries.limit(PLUGIN_STATE_EXPIRY_BATCH_ROWS).$asTuple("plugin_id", "namespace", "entry_key"))));
	return Number(result.numAffectedRows ?? 0);
}
const pluginStateNamespaceCountQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where("namespace", "=", parameter((value) => value.namespace)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))]))));
function countLivePluginStateNamespaceEntries(db, params) {
	const row = pluginStateNamespaceCountQuery(db)(params).rows[0];
	return coerceRequiredSqliteNumber(row?.count ?? 0);
}
function allocatePluginStateNamespaceCreatedAt(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.max("created_at").as("max_created_at")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace));
	const previous = normalizeSqliteNumber(row?.max_created_at ?? null);
	const next = previous === void 0 ? params.now : Math.max(params.now, previous + 1);
	if (!Number.isSafeInteger(next)) throw new RangeError("Plugin state namespace append order exhausted safe integer range");
	return next;
}
function lookupPluginStateEntry(store, params) {
	const row = selectPluginStateEntry(store.db, {
		...params,
		now: Date.now()
	});
	return row ? parseStoredJson(row.value_json, "lookup", store.path) : void 0;
}
//#endregion
export { resolvePluginStateExpiresAtMs as _, bindPluginStateEntry as a, selectPluginStateEntry as b, deleteExpiredPluginStateEntries as c, hasPluginStateEntry as d, insertPluginStateEntryIfAbsent as f, parseStoredJson as g, lookupPluginStateEntry as h, allocatePluginStateNamespaceCreatedAt as i, deletePluginStateEntry as l, iteratePluginStateEntries as m, PLUGIN_STATE_EXPIRY_BATCH_ROWS as n, countLivePluginStateNamespaceEntries as o, isRetainedPluginStateNamespace as p, RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX as r, createPluginStateError as s, MAX_PLUGIN_STATE_VALUE_BYTES as t, getPluginStateKysely as u, rowToEntry as v, upsertPluginStateEntry as x, selectPluginStateEntriesInKeyRange as y };
