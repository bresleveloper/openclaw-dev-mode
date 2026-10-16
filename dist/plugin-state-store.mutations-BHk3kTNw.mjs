import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { _ as resolvePluginStateExpiresAtMs, a as bindPluginStateEntry, b as selectPluginStateEntry, c as deleteExpiredPluginStateEntries, d as hasPluginStateEntry, f as insertPluginStateEntryIfAbsent, g as parseStoredJson, l as deletePluginStateEntry, n as PLUGIN_STATE_EXPIRY_BATCH_ROWS, o as countLivePluginStateNamespaceEntries, p as isRetainedPluginStateNamespace, s as createPluginStateError, u as getPluginStateKysely, x as upsertPluginStateEntry } from "./plugin-state-store.kernel-DUORZ5yM.mjs";
import { a as prepareRegisterParams } from "./plugin-state-store.validation-BnCg_tof.mjs";
import { isDeepStrictEqual } from "node:util";
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
	const { loadBundledPluginPublicArtifactModuleFromCandidatesSync } = await import("./public-surface-loader-DvffICdw.mjs");
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
//#region src/plugin-state/plugin-state-store.retention.ts
const pluginStateCountQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => getPluginStateKysely(db).selectFrom("plugin_state_entries").select((eb) => eb.fn.countAll().as("count")).where("plugin_id", "=", parameter((value) => value.pluginId)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", parameter((value) => value.now))]))));
function countLivePluginStateEntries(db, params) {
	const row = pluginStateCountQuery(db)(params).rows[0];
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
		...params,
		now
	}) : false;
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
	enforcePostRegisterLimits({
		store,
		...params,
		now,
		protectedKey: params.key,
		retention
	});
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
		...params,
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
	const row = selectPluginStateEntry(store.db, {
		...params,
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
export { movePluginStateEntries as a, updatePluginStateEntry as c, readPluginStateRetention as d, registerPluginStateEntry as f, deletePluginStateNativeBinding as i, countLivePluginStateEntries as l, readPreparedPluginStateNativeBinding as m, consumePluginStateEntry as n, registerPluginStateEntryIfAbsent as o, preparePluginStateNativeBindingCodec as p, deletePluginStateEntryIfEqual as r, restorePluginStateNativeBinding as s, clearPluginStateNamespace as t, enforcePostRegisterLimits as u };
