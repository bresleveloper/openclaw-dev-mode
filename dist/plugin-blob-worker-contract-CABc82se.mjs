import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as PluginBlobStoreError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
//#region src/plugin-state/plugin-blob-store.sqlite.ts
const MAX_PLUGIN_BLOB_BYTES_PER_ENTRY = 104857600;
const MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN = 536870912;
const MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN = 5e4;
function createError(params) {
	return new PluginBlobStoreError(params.message, {
		code: params.code,
		operation: params.operation,
		path: params.path ?? resolveOpenClawStateSqlitePath(params.env ?? process.env),
		cause: params.cause
	});
}
function wrapPluginBlobError(error, operation, fallbackCode, message, env, databasePath = resolveOpenClawStateSqlitePath(env ?? process.env)) {
	return error instanceof PluginBlobStoreError ? error : createError({
		code: fallbackCode,
		operation,
		message,
		env,
		path: databasePath,
		cause: error
	});
}
function kysely(db) {
	return getNodeSqliteKysely(db);
}
function decodeBlobInfo(row, operation, env, pathname) {
	let metadata;
	try {
		metadata = JSON.parse(row.metadata_json);
	} catch (error) {
		throw createError({
			code: "PLUGIN_BLOB_CORRUPT",
			operation,
			message: "Plugin blob entry contains corrupt metadata JSON.",
			env,
			path: pathname,
			cause: error
		});
	}
	const expiresAt = normalizeSqliteNumber(row.expires_at);
	return {
		key: row.entry_key,
		metadata,
		sizeBytes: coerceRequiredSqliteNumber(row.size_bytes),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		...expiresAt != null ? { expiresAt } : {}
	};
}
function blobKeyExists(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select("entry_key").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key)) !== void 0;
}
function selectExpiredKeyInfo(db, params) {
	return executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key).where("expires_at", "is not", null).where("expires_at", "<=", params.now));
}
function selectEvictionCandidates(db, params) {
	return iterateSqliteQuerySync(db, kysely(db).selectFrom("plugin_blob_entries").select("entry_key").select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "!=", params.key).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])).orderBy("created_at", "asc").orderBy("entry_key", "asc"));
}
function readStoredUsage(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select((eb) => [
		eb.fn.countAll().as("plugin_count"),
		eb.fn.countAll().filterWhere("namespace", "=", params.namespace).as("namespace_count"),
		eb.fn.sum(eb.fn("length", ["blob"])).as("plugin_bytes"),
		eb.fn.sum(eb.fn("length", ["blob"])).filterWhere("namespace", "=", params.namespace).as("namespace_bytes")
	]).where("plugin_id", "=", params.pluginId));
	return {
		namespaceCount: coerceRequiredSqliteNumber(row?.namespace_count ?? 0),
		namespaceBytes: coerceRequiredSqliteNumber(row?.namespace_bytes ?? 0),
		pluginCount: coerceRequiredSqliteNumber(row?.plugin_count ?? 0),
		pluginBytes: coerceRequiredSqliteNumber(row?.plugin_bytes ?? 0)
	};
}
function readStoredKeySize(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, kysely(db).selectFrom("plugin_blob_entries").select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
	return row ? coerceRequiredSqliteNumber(row.size_bytes) : void 0;
}
function deleteKey(db, params) {
	const result = executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "=", params.key));
	return Number(result.numAffectedRows ?? 0);
}
function deleteKeys(db, params) {
	const batchSize = 500;
	for (let offset = 0; offset < params.keys.length; offset += batchSize) {
		const keys = params.keys.slice(offset, offset + batchSize);
		executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("entry_key", "in", keys));
	}
}
function deleteExpiredNamespace(db, params) {
	const result = executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", params.now));
	return Number(result.numAffectedRows ?? 0);
}
function limitError(message, env) {
	return createError({
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register",
		message,
		env
	});
}
function assertProjectedLimits(params) {
	const usage = readStoredUsage(params.db, params.write);
	const previousBytes = params.existingBytes ?? 0;
	const rowDelta = params.existingBytes === void 0 ? 1 : 0;
	if (usage.namespaceCount + rowDelta > params.write.maxEntries) throw limitError("Plugin blob namespace reached its stored row limit.", params.write.env);
	if (usage.namespaceBytes - previousBytes + params.write.bytes.byteLength > params.write.maxBytesPerNamespace) throw limitError("Plugin blob namespace reached its stored byte limit.", params.write.env);
	if (usage.pluginCount + rowDelta > 5e4) throw limitError("Plugin blob store reached its per-plugin row limit.", params.write.env);
	if (usage.pluginBytes - previousBytes + params.write.bytes.byteLength > 536870912) throw limitError("Plugin blob store reached its per-plugin byte limit.", params.write.env);
}
function deleteOldestUntilWithinLimits(params) {
	const usage = readStoredUsage(params.db, params.write);
	const withinLimits = () => usage.namespaceCount <= params.write.maxEntries && usage.namespaceBytes <= params.write.maxBytesPerNamespace && usage.pluginCount <= 5e4 && usage.pluginBytes <= 536870912;
	if (withinLimits()) return;
	const candidates = selectEvictionCandidates(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		now: params.now,
		key: params.write.key
	});
	const keysToDelete = [];
	for (const row of candidates) {
		keysToDelete.push(row.entry_key);
		const sizeBytes = coerceRequiredSqliteNumber(row.size_bytes);
		usage.namespaceCount -= 1;
		usage.namespaceBytes -= sizeBytes;
		usage.pluginCount -= 1;
		usage.pluginBytes -= sizeBytes;
		if (withinLimits()) break;
	}
	if (usage.namespaceCount > params.write.maxEntries || usage.namespaceBytes > params.write.maxBytesPerNamespace) throw limitError("Plugin blob namespace cannot satisfy its configured limits.", params.write.env);
	if (usage.pluginCount > 5e4 || usage.pluginBytes > 536870912) throw limitError("Plugin blob store cannot satisfy its per-plugin limits.", params.write.env);
	deleteKeys(params.db, {
		pluginId: params.write.pluginId,
		namespace: params.write.namespace,
		keys: keysToDelete
	});
}
function upsertBlob(db, params, now) {
	const expiresAt = (() => {
		if (params.ttlMs === void 0) return null;
		const resolved = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: now });
		if (resolved === void 0) throw createError({
			code: "PLUGIN_BLOB_INVALID_INPUT",
			operation: "register",
			message: "Plugin blob ttlMs cannot produce a valid expiry timestamp.",
			env: params.env
		});
		return resolved;
	})();
	const row = {
		plugin_id: params.pluginId,
		namespace: params.namespace,
		entry_key: params.key,
		metadata_json: params.metadataJson,
		blob: params.bytes,
		created_at: now,
		expires_at: expiresAt
	};
	executeSqliteQuerySync(db, kysely(db).insertInto("plugin_blob_entries").values(row).onConflict((conflict) => conflict.columns([
		"plugin_id",
		"namespace",
		"entry_key"
	]).doUpdateSet({
		metadata_json: (eb) => eb.ref("excluded.metadata_json"),
		blob: (eb) => eb.ref("excluded.blob"),
		created_at: (eb) => eb.ref("excluded.created_at"),
		expires_at: (eb) => eb.ref("excluded.expires_at")
	})));
}
function writeBlob(db, params, ifAbsent) {
	const now = Date.now();
	if (ifAbsent && blobKeyExists(db, params)) return false;
	if (params.overflowPolicy === "reject-new") assertProjectedLimits({
		db,
		write: params,
		existingBytes: ifAbsent ? void 0 : readStoredKeySize(db, params)
	});
	upsertBlob(db, params, now);
	if (params.overflowPolicy === "evict-oldest") deleteOldestUntilWithinLimits({
		db,
		write: params,
		now
	});
	return true;
}
function pluginBlobRegisterInDatabase(db, params) {
	writeBlob(db, params, false);
}
function pluginBlobRegisterIfAbsentInDatabase(db, params) {
	return writeBlob(db, params, true);
}
function pluginBlobDeleteInDatabase(db, params) {
	return deleteKey(db, params) > 0;
}
function pluginBlobDeleteExpiredKeyInDatabase(db, params) {
	const row = selectExpiredKeyInfo(db, {
		...params,
		now: Date.now()
	});
	if (!row) return;
	const entry = decodeBlobInfo(row, "sweep", params.env);
	deleteKey(db, params);
	return entry;
}
function pluginBlobDeleteExpiredInDatabase(db, params) {
	const now = Date.now();
	const entries = executeSqliteQuerySync(db, kysely(db).selectFrom("plugin_blob_entries").select([
		"entry_key",
		"metadata_json",
		"created_at",
		"expires_at"
	]).select((eb) => eb.fn("length", ["blob"]).as("size_bytes")).where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace).where("expires_at", "is not", null).where("expires_at", "<=", now).orderBy("created_at", "asc").orderBy("entry_key", "asc")).rows.map((row) => decodeBlobInfo(row, "sweep", params.env));
	deleteExpiredNamespace(db, {
		...params,
		now
	});
	return entries;
}
function pluginBlobClearInDatabase(db, params) {
	executeSqliteQuerySync(db, kysely(db).deleteFrom("plugin_blob_entries").where("plugin_id", "=", params.pluginId).where("namespace", "=", params.namespace));
}
//#endregion
//#region src/plugin-state/plugin-blob-worker-contract.ts
const pluginBlobWorkerOperations = {
	"pluginBlob.register": {
		operation: "register",
		message: "Failed to register plugin blob entry."
	},
	"pluginBlob.registerIfAbsent": {
		operation: "register",
		message: "Failed to register plugin blob entry."
	},
	"pluginBlob.delete": {
		operation: "delete",
		message: "Failed to delete plugin blob entry."
	},
	"pluginBlob.deleteExpiredKey": {
		operation: "sweep",
		message: "Failed to delete expired plugin blob."
	},
	"pluginBlob.deleteExpired": {
		operation: "sweep",
		message: "Failed to delete expired plugin blobs."
	},
	"pluginBlob.clear": {
		operation: "clear",
		message: "Failed to clear plugin blob entries."
	}
};
function isPluginBlobWorkerCommand(command) {
	return Object.hasOwn(pluginBlobWorkerOperations, command.type);
}
//#endregion
export { MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN as a, pluginBlobDeleteExpiredKeyInDatabase as c, pluginBlobRegisterInDatabase as d, wrapPluginBlobError as f, MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN as i, pluginBlobDeleteInDatabase as l, pluginBlobWorkerOperations as n, pluginBlobClearInDatabase as o, MAX_PLUGIN_BLOB_BYTES_PER_ENTRY as r, pluginBlobDeleteExpiredInDatabase as s, isPluginBlobWorkerCommand as t, pluginBlobRegisterIfAbsentInDatabase as u };
