import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as hasOpenClawStateTablesBeyondStartupCheckpoint } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { a as isTerminalSqliteIntegrityError } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { f as isOpenClawStateDatabaseOpen } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { M as resolveDatabasePath } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { toUSVString } from "node:util";
import { createHash } from "node:crypto";
//#region src/plugin-state/plugin-state-store.types.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
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
const pluginStateUpsertQueries = /* @__PURE__ */ new WeakMap();
const pluginStateInsertIfAbsentQueries = /* @__PURE__ */ new WeakMap();
function upsertPluginStateEntry(db, row) {
	let query = pluginStateUpsertQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).insertInto("plugin_state_entries").values({
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
		})));
		pluginStateUpsertQueries.set(db, query);
	}
	query(row);
}
function insertPluginStateEntryIfAbsent(db, row) {
	let query = pluginStateInsertIfAbsentQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).insertInto("plugin_state_entries").orIgnore().values({
			plugin_id: parameter((value) => value.plugin_id),
			namespace: parameter((value) => value.namespace),
			entry_key: parameter((value) => value.entry_key),
			value_json: parameter((value) => value.value_json),
			created_at: parameter((value) => value.created_at),
			expires_at: parameter((value) => value.expires_at)
		}));
		pluginStateInsertIfAbsentQueries.set(db, query);
	}
	const result = query(row);
	return Number(result.numAffectedRows ?? 0) > 0;
}
const pluginStateEntryQueries = /* @__PURE__ */ new WeakMap();
const pluginStateEntryExistsQueries = /* @__PURE__ */ new WeakMap();
function hasPluginStateEntry(db, params) {
	let query = pluginStateEntryExistsQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => {
			const pluginId = parameter((value) => value.pluginId);
			const namespace = parameter((value) => value.namespace);
			const key = parameter((value) => value.key);
			const now = parameter((value) => value.now);
			return getPluginStateKysely(db).selectFrom("plugin_state_entries").select("entry_key").where("plugin_id", "=", pluginId).where("namespace", "=", namespace).where("entry_key", "=", key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]));
		});
		pluginStateEntryExistsQueries.set(db, query);
	}
	return query(params).rows.length !== 0;
}
function selectPluginStateEntry(db, params) {
	let query = pluginStateEntryQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => {
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
		});
		pluginStateEntryQueries.set(db, query);
	}
	return query(params).rows[0];
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
const pluginStateExpiryQueries = /* @__PURE__ */ new WeakMap();
function deleteExpiredPluginStateEntries(db, now, scope) {
	if (scope && isRetainedPluginStateNamespace(scope.namespace)) return 0;
	const kysely = getPluginStateKysely(db);
	if (scope) {
		let query = pluginStateExpiryQueries.get(db);
		if (!query) {
			query = prepareSqliteQuerySync(db, (parameter) => kysely.selectFrom("plugin_state_entries").select("expires_at").where("expires_at", "is not", null).where("expires_at", "<=", parameter((value) => value)).limit(1));
			pluginStateExpiryQueries.set(db, query);
		}
		if (query(now).rows.length === 0) return 0;
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
const pluginStateNamespaceCountQueries = /* @__PURE__ */ new WeakMap();
function countLivePluginStateNamespaceEntries(db, params) {
	let query = pluginStateNamespaceCountQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where("namespace", "=", parameter((value) => value.namespace)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))])));
		pluginStateNamespaceCountQueries.set(db, query);
	}
	const row = query(params).rows[0];
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
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		now: Date.now()
	});
	return row ? parseStoredJson(row.value_json, "lookup", store.path) : void 0;
}
//#endregion
//#region src/plugin-state/plugin-state-store.retention.ts
const pluginStateCountQueries = /* @__PURE__ */ new WeakMap();
function countLivePluginStateEntries(db, params) {
	let query = pluginStateCountQueries.get(db);
	if (!query) {
		query = prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))])));
		pluginStateCountQueries.set(db, query);
	}
	const row = query(params).rows[0];
	return coerceRequiredSqliteNumber(row?.count ?? 0);
}
function deleteOldestPluginStateNamespaceEntries(db, params) {
	const kysely = getPluginStateKysely(db);
	const keys = kysely.selectFrom("plugin_state_entries").select("entry_key").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "!=", params.protectedKey).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc").limit(params.limit);
	const result = executeSqliteQuerySync(db, kysely.deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", keys));
	return Number(result.numAffectedRows ?? 0);
}
function readPluginStateRetention(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => [eb.fn.countAll().as("namespace_count"), eb.fn.min("expires_at").as("next_expiry")]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])));
	return {
		namespaceCount: coerceRequiredSqliteNumber(row?.namespace_count ?? 0),
		nextExpiry: normalizeSqliteNumber(row?.next_expiry ?? null) ?? Infinity,
		now: params.now,
		sweepPending: true
	};
}
function enforcePostRegisterLimits(params) {
	if (isRetainedPluginStateNamespace(params.namespace)) return;
	if (params.maxEntries === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Bounded plugin state requires maxEntries."
	});
	if (params.overflowPolicy === "reject-new") return;
	const namespaceCount = params.retention?.namespaceCount ?? countLivePluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: params.now
	});
	if (namespaceCount <= params.maxEntries) return;
	const deleted = deleteOldestPluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		protectedKey: params.protectedKey,
		now: params.now,
		limit: namespaceCount - params.maxEntries
	});
	if (params.retention) params.retention.namespaceCount -= deleted;
}
function assertCanInsertPluginStateEntry(params) {
	if (isRetainedPluginStateNamespace(params.namespace)) return;
	if (params.maxEntries === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Bounded plugin state requires maxEntries."
	});
	if (params.overflowPolicy !== "reject-new") return;
	if ((params.retention?.namespaceCount ?? countLivePluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: params.now
	})) >= params.maxEntries) throw createPluginStateError({
		code: "PLUGIN_STATE_LIMIT_EXCEEDED",
		operation: "register",
		message: `Plugin state namespace ${params.namespace} for ${params.pluginId} reached its ${params.maxEntries}-row limit.`,
		path: params.store.path
	});
}
/** The caller owns the write transaction, including expiry cleanup and quota eviction. */
function registerPluginStateEntry(store, params, retention) {
	const now = Date.now();
	const expiresAt = resolvePluginStateExpiresAtMs({
		ttlMs: params.ttlMs,
		namespace: params.namespace,
		now,
		operation: "register",
		path: store.path
	});
	if (retention && (now < retention.now || now >= retention.nextExpiry)) Object.assign(retention, readPluginStateRetention(store.db, {
		...params,
		now
	}));
	if (!retention || retention.sweepPending) {
		const deleted = deleteExpiredPluginStateEntries(store.db, now, params);
		if (retention) retention.sweepPending = deleted === PLUGIN_STATE_EXPIRY_BATCH_ROWS;
	}
	const existing = retention || params.overflowPolicy === "reject-new" ? hasPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		now
	}) : false;
	if (!existing) assertCanInsertPluginStateEntry({
		store,
		pluginId: params.pluginId,
		namespace: params.namespace,
		maxEntries: params.maxEntries,
		overflowPolicy: params.overflowPolicy,
		now,
		retention
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		valueJson: params.valueJson,
		createdAt: params.createdAtMs ?? now,
		expiresAt
	}));
	if (retention) {
		if (!existing) retention.namespaceCount += 1;
		retention.nextExpiry = Math.min(retention.nextExpiry, expiresAt ?? Infinity);
		retention.now = now;
	}
	enforcePostRegisterLimits({
		store,
		pluginId: params.pluginId,
		namespace: params.namespace,
		maxEntries: params.maxEntries,
		overflowPolicy: params.overflowPolicy,
		now,
		protectedKey: params.key,
		retention
	});
}
//#endregion
//#region src/plugin-state/plugin-state-store.comparison.ts
const COMPARISON_PATTERN = /^1:([a-f0-9]{64}):([a-f0-9]{64}|-)$/u;
function validatePluginStateComparison(value, operation) {
	const scope = (typeof value === "string" ? COMPARISON_PATTERN.exec(value) : null)?.[1];
	if (!scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		message: "Plugin state comparison must be an observation returned by this store."
	});
	return scope;
}
function digest(value) {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function comparisonScope(storeIdentity, key) {
	return digest([
		storeIdentity,
		key.pluginId,
		key.namespace,
		key.key
	]);
}
function observation(store, scope, row, operation) {
	const image = row ? digest([
		row.value_json,
		row.created_at,
		row.expires_at
	]) : "-";
	return {
		value: row ? parseStoredJson(row.value_json, operation, store.path) : void 0,
		comparison: `1:${scope}:${image}`
	};
}
/** Called after canonical writable admission, with the native owner's recorded database identity. */
function observePluginStateEntry(store, params, storeIdentity) {
	return observation(store, comparisonScope(storeIdentity, params), selectPluginStateEntry(store.db, {
		...params,
		now: Date.now()
	}), "lookup");
}
/** The caller owns the IMMEDIATE transaction containing comparison, expiry, quotas and mutation. */
function compareAndApplyPluginStateEntry(store, params, storeIdentity) {
	const operation = params.operation === "update" ? "register" : "delete";
	const expected = validatePluginStateComparison(params.comparison, operation);
	const scope = comparisonScope(storeIdentity, params);
	if (expected !== scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		path: store.path,
		message: "Plugin state observation belongs to another database, namespace or key."
	});
	const now = Date.now();
	const row = selectPluginStateEntry(store.db, {
		...params,
		now
	});
	const current = observation(store, scope, row, params.operation === "update" ? "lookup" : "delete");
	if (current.comparison !== params.comparison) return {
		status: "conflict",
		current
	};
	if (params.operation === "delete") return { status: params.action === "delete" && row && deletePluginStateEntry(store.db, params) > 0 ? "applied" : "unchanged" };
	deleteExpiredPluginStateEntries(store.db, now, params);
	if (params.action === "keep") return { status: "unchanged" };
	if (!row) assertCanInsertPluginStateEntry({
		...params,
		store,
		now
	});
	const expiresAt = resolvePluginStateExpiresAtMs({
		ttlMs: params.ttlMs,
		namespace: params.namespace,
		now,
		operation: "register",
		path: store.path
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		...params,
		createdAt: now,
		expiresAt
	}));
	enforcePostRegisterLimits({
		...params,
		store,
		now,
		protectedKey: params.key
	});
	return { status: "applied" };
}
//#endregion
//#region src/plugin-state/plugin-store-validation.ts
const MAX_PLUGIN_STORE_NAMESPACE_BYTES = 128;
const MAX_PLUGIN_STORE_KEY_BYTES = 512;
const MAX_PLUGIN_STORE_JSON_BYTES = 65536;
const MAX_PLUGIN_STORE_JSON_DEPTH = 64;
const NAMESPACE_PATTERN = /^[a-z0-9][a-z0-9._-]*$/iu;
const textEncoder = new TextEncoder();
function createPluginStoreOptionPolicy(params) {
	const signatures = /* @__PURE__ */ new Map();
	return {
		resolveOverflowPolicy(value) {
			if (value === void 0 || value === "evict-oldest") return "evict-oldest";
			if (value === "reject-new") return value;
			throw params.invalid(`${params.label} overflowPolicy must be evict-oldest or reject-new`);
		},
		assertConsistent(pluginId, namespace, signature) {
			const key = `${pluginId}\0${namespace}`;
			const existing = signatures.get(key);
			if (!existing) {
				signatures.set(key, signature);
				return;
			}
			if (!(Object.entries(existing).every(([name, value]) => signature[name] === value) && Object.entries(signature).every(([name, value]) => existing[name] === value))) throw params.invalid(`${params.label} namespace ${namespace} for ${pluginId} was reopened with incompatible options`);
		},
		clear() {
			signatures.clear();
		}
	};
}
function assertMaxUtf8Bytes(params) {
	if (textEncoder.encode(params.value).byteLength > params.maxBytes) throw params.errors.invalid(`${params.label} must be <= ${params.maxBytes} bytes`);
}
function validatePluginStoreNamespace(params) {
	const trimmed = params.value.trim();
	if (!NAMESPACE_PATTERN.test(trimmed)) throw params.errors.invalid(`${params.label} namespace must be a safe path segment: ${params.value}`);
	assertMaxUtf8Bytes({
		label: `${params.label} namespace`,
		value: trimmed,
		maxBytes: MAX_PLUGIN_STORE_NAMESPACE_BYTES,
		errors: params.errors
	});
	return trimmed;
}
function validatePluginStoreKey(params) {
	const trimmed = params.value.trim();
	if (!trimmed) throw params.errors.invalid(`${params.label} entry key must not be empty`);
	assertMaxUtf8Bytes({
		label: `${params.label} entry key`,
		value: trimmed,
		maxBytes: MAX_PLUGIN_STORE_KEY_BYTES,
		errors: params.errors
	});
	return trimmed;
}
function validatePluginStorePositiveInteger(params) {
	if (!Number.isSafeInteger(params.value) || params.value < 1) throw params.errors.invalid(`${params.label} must be a positive safe integer`);
	return params.value;
}
function validateOptionalPluginStoreTtlMs(params) {
	const value = params.value;
	if (value == null) return;
	return validatePluginStorePositiveInteger({
		...params,
		value
	});
}
function assertPlainJsonValue(value, params) {
	if (params.depth > MAX_PLUGIN_STORE_JSON_DEPTH) throw params.errors.limit(`${params.label} nesting exceeds maximum depth of ${MAX_PLUGIN_STORE_JSON_DEPTH}`);
	if (value === null) return;
	const valueType = typeof value;
	if (valueType === "string" || valueType === "boolean") return;
	if (valueType === "number") {
		if (!Number.isFinite(value)) throw params.errors.invalid(`${params.label} at ${params.path} must be a finite number`);
		return;
	}
	if (valueType !== "object") throw params.errors.invalid(`${params.label} at ${params.path} must be JSON-serializable`);
	const objectValue = value;
	if (params.seen.has(objectValue)) throw params.errors.invalid(`${params.label} at ${params.path} must not contain circular references`);
	params.seen.add(objectValue);
	try {
		if (Array.isArray(value)) {
			for (let index = 0; index < value.length; index += 1) {
				if (!(index in value)) throw params.errors.invalid(`${params.label} array at ${params.path} must not be sparse`);
				assertPlainJsonValue(value[index], {
					...params,
					path: `${params.path}[${index}]`,
					depth: params.depth + 1
				});
			}
			return;
		}
		const prototype = Object.getPrototypeOf(objectValue);
		const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
		if (!prototype || Object.getPrototypeOf(prototype) !== null || typeof constructor !== "function" || Object.getOwnPropertyDescriptor(constructor, "prototype")?.value !== prototype || Function.prototype.toString.call(constructor) !== Function.prototype.toString.call(Object)) throw params.errors.invalid(`${params.label} object at ${params.path} must be a plain object`);
		const descriptorEntries = Object.entries(Object.getOwnPropertyDescriptors(objectValue));
		if (Object.getOwnPropertySymbols(objectValue).length > 0) throw params.errors.invalid(`${params.label} object at ${params.path} must not use symbol keys`);
		if (descriptorEntries.length !== Object.keys(objectValue).length) throw params.errors.invalid(`${params.label} object at ${params.path} must not use non-enumerable properties`);
		for (const [key, descriptor] of descriptorEntries) {
			if (descriptor.get || descriptor.set || !("value" in descriptor)) throw params.errors.invalid(`${params.label} object at ${params.path}.${key} must use data properties`);
			assertPlainJsonValue(descriptor.value, {
				...params,
				path: `${params.path}.${key}`,
				depth: params.depth + 1
			});
		}
	} finally {
		params.seen.delete(objectValue);
	}
}
function serializePluginStoreJson(params) {
	assertPlainJsonValue(params.value, {
		label: params.label,
		errors: params.errors,
		seen: /* @__PURE__ */ new WeakSet(),
		path: "value",
		depth: 0
	});
	const json = JSON.stringify(params.value);
	if (json === void 0) throw params.errors.invalid(`${params.label} must be JSON-serializable`);
	const maxBytes = params.maxBytes ?? MAX_PLUGIN_STORE_JSON_BYTES;
	if (textEncoder.encode(json).byteLength > maxBytes) throw params.errors.limit(`${params.label} exceeds ${maxBytes} byte limit`);
	return json;
}
//#endregion
//#region src/plugin-state/plugin-state-store.journal.ts
const journalValueErrors = {
	invalid: (message) => createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message
	}),
	limit: (message) => createPluginStateError({
		code: "PLUGIN_STATE_LIMIT_EXCEEDED",
		operation: "register",
		message
	})
};
function serializeJournalValue(value) {
	return serializePluginStoreJson({
		value,
		label: "plugin state value",
		maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
		errors: journalValueErrors
	});
}
/** Capture caller data before worker admission; allocation owns the sequence field. */
function preparePluginStateJournalValue(value) {
	if (!isRecord(value) || Object.hasOwn(value, "sequence")) throw journalValueErrors.invalid("Plugin state journal value must be an object without a sequence field.");
	return serializeJournalValue(value);
}
function readCursorSequence(valueJson) {
	try {
		const value = JSON.parse(valueJson);
		return isRecord(value) && value.kind === "cursor" && typeof value.lastSequence === "number" && Number.isSafeInteger(value.lastSequence) ? value.lastSequence : void 0;
	} catch {
		return;
	}
}
function prepareSequencedEntry(params, sequence) {
	const fields = JSON.parse(params.journalValueJson);
	if (!isRecord(fields)) throw journalValueErrors.invalid("Plugin state journal value must be an object without a sequence field.");
	const journalKey = validatePluginStoreKey({
		value: `${params.journalKeyPrefix}${sequence.toString().padStart(16, "0")}`,
		label: "plugin state",
		errors: {
			invalid: journalValueErrors.invalid,
			limit: journalValueErrors.invalid
		}
	});
	return {
		cursorValueJson: serializeJournalValue({
			kind: "cursor",
			lastSequence: sequence
		}),
		journalKey,
		journalValueJson: serializeJournalValue({
			...fields,
			sequence
		})
	};
}
/** The worker owns the transaction containing allocation, both writes, and retention. */
function registerPluginStateSequencedJournalEntryInDatabase(store, params) {
	const now = Date.now();
	deleteExpiredPluginStateEntries(store.db, now, {
		pluginId: params.pluginId,
		namespace: params.cursorNamespace
	});
	deleteExpiredPluginStateEntries(store.db, now, {
		pluginId: params.pluginId,
		namespace: params.journalNamespace
	});
	const cursor = selectPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.cursorNamespace,
		key: params.cursorKey,
		now
	});
	const cursorSequence = cursor ? readCursorSequence(cursor.value_json) : void 0;
	const tail = selectPluginStateEntriesInKeyRange(store.db, {
		pluginId: params.pluginId,
		namespace: params.journalNamespace,
		...params.journalKeyRange,
		limit: 1,
		order: "desc",
		now
	})[0];
	let retainedSequence = 0;
	if (tail) {
		const value = parseStoredJson(tail.value_json, "entries", store.path);
		if (value === null) throw new TypeError("Plugin state journal tail must not be null.");
		if (typeof value === "object" && (params.journalKeyRange.valueKind === void 0 || "kind" in value && value.kind === params.journalKeyRange.valueKind)) {
			retainedSequence = Math.max(0, Number("sequence" in value ? value.sequence ?? 0 : 0));
			if (!Number.isSafeInteger(retainedSequence)) throw createPluginStateError({
				code: "PLUGIN_STATE_INVALID_INPUT",
				operation: "register",
				message: "Plugin state journal sequence must be a safe non-negative integer."
			});
		}
	}
	const sequence = Math.max(retainedSequence, cursorSequence ?? 0) + 1;
	if (!Number.isSafeInteger(sequence)) throw new RangeError("Plugin state journal sequence exhausted safe integer range");
	const prepared = prepareSequencedEntry(params, sequence);
	if (prepared.journalKey < params.journalKeyRange.keyStartInclusive || prepared.journalKey >= params.journalKeyRange.keyEndExclusive) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Plugin state journal key must be inside its retained key range."
	});
	if (hasPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.journalNamespace,
		key: prepared.journalKey,
		now
	})) throw createPluginStateError({
		code: "PLUGIN_STATE_WRITE_FAILED",
		operation: "register",
		message: "Plugin state journal sequence already exists.",
		path: store.path
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		pluginId: params.pluginId,
		namespace: params.cursorNamespace,
		key: params.cursorKey,
		valueJson: prepared.cursorValueJson,
		createdAt: now,
		expiresAt: null
	}));
	enforcePostRegisterLimits({
		store,
		pluginId: params.pluginId,
		namespace: params.cursorNamespace,
		maxEntries: params.cursorMaxEntries,
		overflowPolicy: "evict-oldest",
		now,
		protectedKey: params.cursorKey
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		pluginId: params.pluginId,
		namespace: params.journalNamespace,
		key: prepared.journalKey,
		valueJson: prepared.journalValueJson,
		createdAt: allocatePluginStateNamespaceCreatedAt(store.db, {
			pluginId: params.pluginId,
			namespace: params.journalNamespace,
			now
		}),
		expiresAt: null
	}));
	enforcePostRegisterLimits({
		store,
		pluginId: params.pluginId,
		namespace: params.journalNamespace,
		maxEntries: params.journalMaxEntries,
		overflowPolicy: "evict-oldest",
		now,
		protectedKey: prepared.journalKey
	});
	return sequence;
}
//#endregion
//#region src/plugin-state/plugin-state-store.reads.ts
function lookupPluginStateEntries(store, params) {
	const now = Date.now();
	const rows = executeSqliteQuerySync(store.db, getPluginStateKysely(store.db).selectFrom("plugin_state_entries").select(["entry_key", "value_json"]).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", sqliteStringSet(params.keys)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)]))).rows;
	const values = new Map(rows.map((row) => [row.entry_key, row.value_json]));
	return params.keys.map((key) => {
		const raw = values.get(toUSVString(key));
		try {
			return ok(raw === void 0 ? void 0 : parseStoredJson(raw, "lookup", store.path));
		} catch (error) {
			if (error instanceof PluginStateStoreError && error.code === "PLUGIN_STATE_CORRUPT") return err(error);
			throw error;
		}
	});
}
function listPluginStateEntries(store, params) {
	const rows = iteratePluginStateEntries(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: Date.now()
	});
	const entries = [];
	let decodeFailure;
	for (const row of rows) {
		if (decodeFailure) continue;
		try {
			entries.push(rowToEntry(row, "entries", store.path));
		} catch (error) {
			decodeFailure = { error };
		}
	}
	if (decodeFailure) throw decodeFailure.error;
	return entries;
}
function validatePluginStateKeyRange(params) {
	if (!Number.isSafeInteger(params.limit) || params.limit < 1) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key-range limit must be a positive safe integer."
	});
	if (typeof params.keyStartInclusive !== "string" || typeof params.keyEndExclusive !== "string" || Buffer.compare(Buffer.from(params.keyStartInclusive), Buffer.from(params.keyEndExclusive)) >= 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key range must have an increasing exclusive upper bound."
	});
	if (params.order !== void 0 && params.order !== "asc" && params.order !== "desc") throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "entries",
		message: "Plugin state key-range order must be asc or desc."
	});
}
function listPluginStateEntriesInKeyRange(store, params) {
	return selectPluginStateEntriesInKeyRange(store.db, {
		...params,
		order: params.order ?? "asc",
		now: Date.now()
	}).map((row) => rowToEntry(row, "entries", store.path));
}
//#endregion
//#region src/plugin-state/plugin-state-store.database.ts
function wrapPluginStateError(error, operation, fallbackCode, message, pathname = resolveOpenClawStateSqlitePath(process.env)) {
	if (error instanceof PluginStateStoreError) return error;
	let publicMessage = message;
	if (fallbackCode === "PLUGIN_STATE_OPEN_FAILED") {
		if (isSqliteSchemaVersionError(error)) publicMessage += "\nThe state database uses a newer schema. Run an OpenClaw build that supports it.";
		else if (error instanceof Error && isTerminalSqliteIntegrityError(error)) publicMessage += "\nDatabase integrity verification failed. Restore or repair the state database, then run openclaw doctor --fix.";
	}
	return createPluginStateError({
		code: fallbackCode,
		operation,
		message: publicMessage,
		path: pathname,
		cause: error
	});
}
function openPluginStateDatabase(operation = "open", options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveOpenClawStateSqlitePath(env);
	try {
		return openOpenClawStateDatabase(options);
	} catch (error) {
		throw wrapPluginStateError(error, operation, "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", pathname);
	}
}
function isMissingPluginStateTableError(error) {
	return error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: plugin_state_entries";
}
/** Read plugin state without joining the shared writable database lifecycle. */
function withPluginStateDatabaseReadOnly(operationName, operation, options = {}) {
	const pathname = resolveDatabasePath(options);
	let operationStarted = false;
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db, path }) => {
			operationStarted = true;
			try {
				return operation({
					db,
					path
				});
			} catch (error) {
				if (isMissingPluginStateTableError(error)) {
					if (!hasOpenClawStateTablesBeyondStartupCheckpoint(db)) return;
				}
				throw error;
			}
		}, options);
	} catch (error) {
		if (!operationStarted) throw wrapPluginStateError(error, operationName, "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", pathname);
		throw error;
	}
}
function runWriteTransaction(operation, write, options = {}) {
	if (!isOpenClawStateDatabaseOpen(resolveOpenClawStateSqlitePath(options.env ?? process.env))) openPluginStateDatabase(operation, options);
	return runOpenClawStateWriteTransaction(write, options);
}
//#endregion
//#region src/plugin-state/plugin-state-store.mutations.ts
function clearPluginStateNamespace(db, params) {
	executeSqliteQuerySync(db, getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace));
}
/** The caller owns the transaction containing admission, expiry cleanup, and insertion. */
function registerPluginStateEntryIfAbsent(store, params) {
	const now = Date.now();
	const expiresAt = resolvePluginStateExpiresAtMs({
		ttlMs: params.ttlMs,
		namespace: params.namespace,
		now,
		operation: "register",
		path: store.path
	});
	deleteExpiredPluginStateEntries(store.db, now, params);
	if (hasPluginStateEntry(store.db, {
		...params,
		now
	})) return false;
	deletePluginStateEntry(store.db, params);
	assertCanInsertPluginStateEntry({
		store,
		...params,
		now
	});
	if (!insertPluginStateEntryIfAbsent(store.db, bindPluginStateEntry({
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		valueJson: params.valueJson,
		createdAt: now,
		expiresAt
	}))) return false;
	enforcePostRegisterLimits({
		store,
		...params,
		now,
		protectedKey: params.key
	});
	return true;
}
/** The caller owns the transaction containing the authoritative comparison and deletion. */
function deletePluginStateEntryIfEqual(store, params) {
	const row = selectPluginStateEntry(store.db, {
		...params,
		now: Date.now()
	});
	if (!row || parseStoredJson(row.value_json, "delete", store.path) !== params.expected) return false;
	return deletePluginStateEntry(store.db, params) > 0;
}
/** Decode inside the caller's write transaction so corrupt JSON rolls back deletion. */
function consumePluginStateEntry(store, params) {
	const row = selectPluginStateEntry(store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		key: params.key,
		now: Date.now()
	});
	if (!row) return;
	deletePluginStateEntry(store.db, params);
	return parseStoredJson(row.value_json, "consume", store.path);
}
/** The worker owns the transaction; no payload decoding or plugin callback occurs here. */
function movePluginStateEntries(store, params) {
	if (!isRetainedPluginStateNamespace(params.namespace) || isRetainedPluginStateNamespace(params.sourceNamespace) || params.sourceNamespace === params.namespace) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Plugin state moves require a bounded source and a retained destination."
	});
	const now = Date.now();
	let moved = 0;
	for (const entry of params.entries) {
		const source = {
			pluginId: params.pluginId,
			namespace: params.sourceNamespace,
			key: entry.sourceKey
		};
		const row = selectPluginStateEntry(store.db, {
			...source,
			now
		});
		if (!row) continue;
		if (row.expires_at !== null) throw createPluginStateError({
			code: "PLUGIN_STATE_INVALID_INPUT",
			operation: "register",
			message: "Cannot move live expiring plugin state into a retained store.",
			path: store.path
		});
		insertPluginStateEntryIfAbsent(store.db, {
			plugin_id: params.pluginId,
			namespace: params.namespace,
			entry_key: entry.targetKey,
			value_json: row.value_json,
			created_at: row.created_at,
			expires_at: row.expires_at
		});
		moved += deletePluginStateEntry(store.db, source);
	}
	return moved;
}
//#endregion
//#region src/plugin-state/plugin-state-worker-contract.ts
const pluginStateWorkerOperations = {
	"pluginState.appendJournal": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register sequenced plugin state journal entry."
	},
	"pluginState.entriesInKeyRange": {
		operation: "entries",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to list plugin state entries by key range."
	},
	"pluginState.moveEntries": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to move plugin state entries."
	},
	"pluginState.observe": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to observe plugin state entry."
	},
	"pluginState.compareUpdate": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to update plugin state entry."
	},
	"pluginState.compareDelete": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to conditionally delete plugin state entry."
	},
	"pluginState.register": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register plugin state entry."
	},
	"pluginState.registerIfAbsent": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register plugin state entry."
	},
	"pluginState.deleteIfEqual": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to conditionally delete plugin state entry."
	},
	"pluginState.lookup": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to read plugin state entry."
	},
	"pluginState.lookupMany": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to read plugin state entries."
	},
	"pluginState.consume": {
		operation: "consume",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to consume plugin state entry."
	},
	"pluginState.delete": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to delete plugin state entry."
	},
	"pluginState.entries": {
		operation: "entries",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to list plugin state entries."
	},
	"pluginState.count": {
		operation: "count",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to count plugin state entries."
	},
	"pluginState.clear": {
		operation: "clear",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to clear plugin state namespace."
	},
	"pluginState.sweep": {
		operation: "sweep",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to sweep expired plugin state entries."
	}
};
/** Selects the plugin-state branch of the shared actor's typed command union. */
function isPluginStateWorkerCommand(command) {
	return Object.hasOwn(pluginStateWorkerOperations, command.type);
}
//#endregion
//#region src/plugin-state/plugin-state-worker-errors.ts
function captureCause(value, seen = /* @__PURE__ */ new Set()) {
	if (value === void 0) return;
	const canonical = encodeOpenClawStateWorkerError(value);
	if (canonical) return { canonical };
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return {
		name: "Error",
		message: String(value)
	};
	if (typeof value !== "object") return {
		name: "Error",
		message: "Unknown SQLite error cause"
	};
	if (seen.has(value) || seen.size >= 8) return {
		name: "Error",
		message: "Additional SQLite error cause omitted"
	};
	seen.add(value);
	const name = "name" in value && typeof value.name === "string" ? value.name : "Error";
	const message = "message" in value && typeof value.message === "string" ? value.message : name;
	const code = "code" in value ? value.code : void 0;
	const errcode = "errcode" in value ? value.errcode : void 0;
	const cause = "cause" in value ? captureCause(value.cause, seen) : void 0;
	return {
		name,
		message,
		...typeof code === "string" || typeof code === "number" ? { code } : {},
		...typeof errcode === "number" ? { errcode } : {},
		...cause ? { cause } : {}
	};
}
const errorConstructors = /* @__PURE__ */ new Map([
	["Error", Error],
	["TypeError", TypeError],
	["SyntaxError", SyntaxError],
	["RangeError", RangeError],
	["ReferenceError", ReferenceError],
	["URIError", URIError],
	["EvalError", EvalError]
]);
function restoreCause(value) {
	if (value && "canonical" in value) {
		const retained = /* @__PURE__ */ new Error("SQLite worker error cause");
		retainOpenClawStateWorkerErrorPayload(retained, value.canonical);
		return hydrateOpenClawStateWorkerError(retained);
	}
	const Constructor = value ? errorConstructors.get(value.name) ?? Error : Error;
	return value ? Object.assign(new Constructor(value.message, { cause: restoreCause(value.cause) }), {
		name: value.name,
		...value.code === void 0 ? {} : { code: value.code },
		...value.errcode === void 0 ? {} : { errcode: value.errcode }
	}) : void 0;
}
function capturePluginStateWorkerFailure(error) {
	const cause = captureCause(error.cause);
	return {
		message: error.message,
		code: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path },
		...cause ? { cause } : {}
	};
}
function restorePluginStateWorkerFailure(error) {
	return new PluginStateStoreError(error.message, {
		code: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path },
		cause: restoreCause(error.cause)
	});
}
//#endregion
export { enforcePostRegisterLimits as A, isRetainedPluginStateNamespace as B, validatePluginStoreNamespace as C, validatePluginStateComparison as D, observePluginStateEntry as E, bindPluginStateEntry as F, selectPluginStateEntry as G, parseStoredJson as H, countLivePluginStateNamespaceEntries as I, upsertPluginStateEntry as K, deleteExpiredPluginStateEntries as L, registerPluginStateEntry as M, MAX_PLUGIN_STATE_VALUE_BYTES as N, assertCanInsertPluginStateEntry as O, RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX as P, deletePluginStateEntry as R, validatePluginStoreKey as S, compareAndApplyPluginStateEntry as T, resolvePluginStateExpiresAtMs as U, lookupPluginStateEntry as V, selectPluginStateEntriesInKeyRange as W, preparePluginStateJournalValue as _, clearPluginStateNamespace as a, serializePluginStoreJson as b, movePluginStateEntries as c, withPluginStateDatabaseReadOnly as d, wrapPluginStateError as f, validatePluginStateKeyRange as g, lookupPluginStateEntries as h, pluginStateWorkerOperations as i, readPluginStateRetention as j, countLivePluginStateEntries as k, registerPluginStateEntryIfAbsent as l, listPluginStateEntriesInKeyRange as m, restorePluginStateWorkerFailure as n, consumePluginStateEntry as o, listPluginStateEntries as p, PluginStateStoreError as q, isPluginStateWorkerCommand as r, deletePluginStateEntryIfEqual as s, capturePluginStateWorkerFailure as t, runWriteTransaction as u, registerPluginStateSequencedJournalEntryInDatabase as v, validatePluginStorePositiveInteger as w, validateOptionalPluginStoreTtlMs as x, createPluginStoreOptionPolicy as y, getPluginStateKysely as z };
