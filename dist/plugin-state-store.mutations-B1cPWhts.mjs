import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { n as createPluginStateError, r as parseStoredJson } from "./plugin-state-error-Wxkh7e3f.mjs";
import { a as pluginStatePublication } from "./plugin-state-publication-CI0IKkN0.mjs";
import { _ as resolvePluginStateExpiresAtMs, b as selectPluginStateEntry, c as deleteExpiredPluginStateEntries, d as getPluginStateKysely, f as hasPluginStateEntry, l as deletePluginStateEntry, m as isRetainedPluginStateNamespace, n as PLUGIN_STATE_EXPIRY_BATCH_ROWS, o as bindPluginStateEntry, p as insertPluginStateEntryIfAbsent, s as countLivePluginStateNamespaceEntries, u as deletePluginStateEntryRow, x as upsertPluginStateEntry } from "./plugin-state-store.types-CLUTlkgE.mjs";
import { a as prepareRegisterParams } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/plugin-state/plugin-state-store.retention.ts
const pluginStateCountQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))]))));
function countLivePluginStateEntries(db, params) {
	const row = pluginStateCountQuery(db)(params).rows[0];
	return coerceRequiredSqliteNumber(row?.count ?? 0);
}
const pluginStateRetentionQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => {
	const now = parameter((value) => value.now);
	return getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => [
		eb.fn.sum(eb.case().when(eb.or([eb("expires_at", "is", null), eb("expires_at", ">", now)])).then(1).else(0).end()).as("namespace_count"),
		eb.fn.min(eb.case().when("expires_at", ">", now).then(eb.ref("expires_at")).else(null).end()).as("next_expiry"),
		eb.fn.min("expires_at").as("first_expiry")
	]).where("plugin_id", "=", parameter((value) => value.pluginId)).where("namespace", "=", parameter((value) => value.namespace));
}));
function readPluginStateRetention(db, params) {
	const row = pluginStateRetentionQuery(db)(params).rows[0];
	return {
		namespaceCount: coerceRequiredSqliteNumber(row?.namespace_count ?? 0),
		nextExpiry: normalizeSqliteNumber(row?.next_expiry ?? null) ?? Infinity,
		now: params.now,
		sweepPending: (normalizeSqliteNumber(row?.first_expiry ?? null) ?? Infinity) <= params.now
	};
}
function enforcePostRegisterLimits(params) {
	if (isRetainedPluginStateNamespace(params.namespace)) return [];
	if (params.maxEntries === void 0) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation: "register",
		message: "Bounded plugin state requires maxEntries."
	});
	if (params.overflowPolicy === "reject-new") return [];
	const namespaceCount = params.retention?.namespaceCount ?? countLivePluginStateNamespaceEntries(params.store.db, {
		pluginId: params.pluginId,
		namespace: params.namespace,
		now: params.now
	});
	if (namespaceCount <= params.maxEntries) return [];
	const kysely = getPluginStateKysely(params.store.db);
	const keys = kysely.selectFrom("plugin_state_entries").select("entry_key").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "!=", params.protectedKey).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc").limit(namespaceCount - params.maxEntries);
	const result = executeSqliteQuerySync(params.store.db, kysely.deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", keys).returning([
		"plugin_id",
		"namespace",
		"entry_key"
	]));
	pluginStatePublication.stageDeletions(params.store.db, result.rows);
	const deleted = result.rows.length;
	if (params.retention) params.retention.namespaceCount -= deleted;
	return result.rows.map((row) => row.entry_key);
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
	})) + (params.additionalEntries ?? 1) > params.maxEntries) throw createPluginStateError({
		code: "PLUGIN_STATE_LIMIT_EXCEEDED",
		operation: "register",
		message: `Plugin state namespace ${params.namespace} for ${params.pluginId} reached its ${params.maxEntries}-row limit.`,
		path: params.store.path
	});
}
/** The caller owns the write transaction, including expiry cleanup and quota eviction. */
function registerPluginStateEntry(store, params, retention, existingEntry, onEviction, now = Date.now()) {
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
	const existing = existingEntry ?? (retention || params.overflowPolicy === "reject-new" ? hasPluginStateEntry(store.db, {
		...params,
		now
	}) : false);
	if (!existing) assertCanInsertPluginStateEntry({
		store,
		...params,
		now,
		retention
	});
	upsertPluginStateEntry(store.db, bindPluginStateEntry({
		...params,
		createdAt: params.createdAtMs ?? now,
		expiresAt
	}));
	if (retention) {
		if (!existing) retention.namespaceCount += 1;
		retention.nextExpiry = Math.min(retention.nextExpiry, expiresAt ?? Infinity);
		retention.now = now;
	}
	const evicted = enforcePostRegisterLimits({
		store,
		...params,
		now,
		protectedKey: params.key,
		retention
	});
	onEviction?.(evicted);
}
//#endregion
//#region src/plugin-state/plugin-state-native-binding-codec.ts
const codecs = /* @__PURE__ */ new Map();
function codecKey({ codec, codecSource }) {
	return [
		codec,
		codecSource?.origin,
		codecSource?.rootDir,
		codecSource?.source
	].join("\0");
}
/** Load the plugin's canonical codec before the executor takes either database write lock. */
async function preparePluginStateNativeBindingCodec(plan, env) {
	const key = codecKey(plan);
	if (codecs.has(key)) return;
	const { loadBundledPluginPublicArtifactModuleFromCandidatesSync } = await import("./public-surface-loader-B3z3wMSn.mjs");
	const artifact = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: plan.codec,
		artifactCandidates: ["native-session-binding-api.js"],
		env,
		...plan.codecSource ? { owner: {
			id: plan.codec,
			...plan.codecSource
		} } : {}
	});
	if (typeof artifact?.readNativeSessionBindingRecord !== "function") throw new Error(`Native session binding codec is unavailable: ${plan.codec}`);
	codecs.set(key, artifact);
}
function readPreparedPluginStateNativeBinding(plan, value) {
	const artifact = codecs.get(codecKey(plan));
	if (!artifact) throw new Error(`Native session binding codec was not prepared: ${plan.codec}`);
	return artifact.readNativeSessionBindingRecord(value);
}
//#endregion
//#region src/plugin-state/plugin-state-store.mutations.ts
/** The executing worker owns the transaction containing this exact native binding predicate. */
function deletePluginStateNativeBinding(store, plan) {
	const row = selectPluginStateEntry(store.db, {
		...plan,
		now: Date.now()
	});
	if (plan.predicate.kind === "absent") return { status: row ? "conflict" : "absent" };
	const raw = row ? asOptionalRecord(parseStoredJson(row.value_json, "delete", store.path)) : void 0;
	const { lease, ...value } = readPreparedPluginStateNativeBinding(plan, raw) ?? {};
	if (!raw || lease?.token !== plan.predicate.token || lease.expiresAt <= Date.now() || !isDeepStrictEqual(value, plan.predicate.value)) return { status: "conflict" };
	if (deletePluginStateEntry(store.db, plan) === 0) return { status: "conflict" };
	return {
		status: "deleted",
		value: raw
	};
}
/** Restore the removed payload only while its key remains absent; a successor always wins. */
function restorePluginStateNativeBinding(store, plan, removedValue) {
	if (plan.predicate.kind !== "leased") return false;
	const restored = {
		...removedValue,
		lease: {
			token: plan.predicate.token,
			expiresAt: Date.now() + plan.staleMs
		}
	};
	return registerPluginStateEntryIfAbsent(store, {
		...plan,
		...prepareRegisterParams(plan.key, restored, plan.ttlMs)
	});
}
function clearPluginStateNamespace(db, params) {
	const result = executeSqliteQuerySync(db, getPluginStateKysely(db).deleteFrom("plugin_state_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).returning([
		"plugin_id",
		"namespace",
		"entry_key"
	]));
	pluginStatePublication.stageDeletions(db, result.rows);
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
	if (!insertPluginStateEntryIfAbsent(store.db, bindPluginStateEntry({
		...params,
		createdAt: now,
		expiresAt
	}), now)) return false;
	assertCanInsertPluginStateEntry({
		store,
		...params,
		now,
		additionalEntries: 0
	});
	enforcePostRegisterLimits({
		store,
		...params,
		now,
		protectedKey: params.key
	});
	return true;
}
/** Apply a prepared update after the caller has read and checked the current row. */
function updatePluginStateEntry(store, params, now, exists) {
	if (!exists) assertCanInsertPluginStateEntry({
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
	const row = deletePluginStateEntryRow(store.db, {
		...params,
		now: Date.now()
	});
	if (!row) return;
	return parseStoredJson(row.value_json, "consume", store.path);
}
/** The worker owns the transaction; no payload decoding or plugin callback occurs here. */
function movePluginStateEntries(store, params) {
	if (!isRetainedPluginStateNamespace(params.namespace) || isRetainedPluginStateNamespace(params.sourceNamespace)) throw createPluginStateError({
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
		}, now);
		moved += deletePluginStateEntry(store.db, source);
	}
	return moved;
}
//#endregion
export { movePluginStateEntries as a, updatePluginStateEntry as c, countLivePluginStateEntries as d, enforcePostRegisterLimits as f, deletePluginStateNativeBinding as i, preparePluginStateNativeBindingCodec as l, registerPluginStateEntry as m, consumePluginStateEntry as n, registerPluginStateEntryIfAbsent as o, readPluginStateRetention as p, deletePluginStateEntryIfEqual as r, restorePluginStateNativeBinding as s, clearPluginStateNamespace as t, readPreparedPluginStateNativeBinding as u };
