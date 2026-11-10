import { n as __exportAll } from "./runtime-doctor-migrations-hxP-CXX7.mjs";
import { c as writeMatrixStateChunks, o as chunkMatrixStateJson, s as readMatrixStateChunks } from "./retired-state-C4UnLIg4.mjs";
import { t as resolveMatrixSqliteStateEnv } from "./sqlite-state-LByPx4Yp.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { asSafeIntegerInRange } from "openclaw/plugin-sdk/number-runtime";
import fs from "node:fs/promises";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
//#region extensions/matrix/src/matrix/client/sync-cache-state.ts
var sync_cache_state_exports = /* @__PURE__ */ __exportAll({
	MATRIX_SYNC_CACHE_VERSION: () => 1,
	deleteMatrixSyncCacheStateFromStore: () => deleteMatrixSyncCacheStateFromStore,
	hasMatrixSyncCacheStateInStore: () => hasMatrixSyncCacheStateInStore,
	openMatrixSyncCacheStoreOptions: () => openMatrixSyncCacheStoreOptions,
	readLegacyMatrixSyncCacheState: () => readLegacyMatrixSyncCacheState,
	readPersistedStoreFromStore: () => readPersistedStoreFromStore,
	writeMatrixSyncCacheStateToStore: () => writeMatrixSyncCacheStateToStore
});
const SYNC_CACHE_NAMESPACE = "sync-cache";
const SYNC_CACHE_MAX_ENTRIES = 2e4;
const SYNC_CACHE_MAX_CHUNKS = Math.floor(19999 / 2);
const SYNC_CACHE_META_KEY = "current:meta";
const SYNC_CACHE_CHUNK_PREFIX = "current:sync:";
const SYNC_CACHE_CHUNK_BYTES = 24e3;
const syncCacheOperations = new KeyedAsyncQueue();
function normalizeRoomsData(value) {
	if (!isRecord(value)) return null;
	return {
		join: isRecord(value.join) ? value.join : {},
		invite: isRecord(value.invite) ? value.invite : {},
		leave: isRecord(value.leave) ? value.leave : {},
		knock: isRecord(value.knock) ? value.knock : {}
	};
}
function toPersistedSyncData(value) {
	if (!isRecord(value)) return null;
	if (typeof value.nextBatch === "string" && value.nextBatch.trim()) {
		const roomsData = normalizeRoomsData(value.roomsData);
		if (!Array.isArray(value.accountData) || !roomsData) return null;
		return {
			nextBatch: value.nextBatch,
			accountData: value.accountData,
			roomsData
		};
	}
	return null;
}
function normalizePersistedStore(value) {
	if (!isRecord(value) || value.version !== 1) return null;
	return {
		version: 1,
		savedSync: toPersistedSyncData(value.savedSync),
		clientOptions: isRecord(value.clientOptions) ? value.clientOptions : void 0,
		cleanShutdown: value.cleanShutdown === true
	};
}
function normalizeLegacyPersistedStore(value) {
	const persisted = normalizePersistedStore(value);
	if (persisted) return persisted;
	return {
		version: 1,
		savedSync: toPersistedSyncData(value),
		cleanShutdown: false
	};
}
async function readPersistedStoreFromStore(params) {
	const { storageRootDir, store } = params;
	return syncCacheOperations.enqueue(path.resolve(storageRootDir), () => readPersistedStore(store));
}
async function readPersistedStore(store) {
	const meta = await store.lookup(SYNC_CACHE_META_KEY);
	if (!isSyncCacheMeta(meta)) return null;
	const chunks = await readMatrixStateChunks(store, Array.from({ length: meta.chunkCount }, (_, index) => chunkKey(meta.generation, index)), "sync-chunk");
	const syncJson = chunks?.join("") ?? "";
	const intact = chunks !== null && (chunks.length === 0 || meta.syncDigest === digestText(syncJson));
	let savedSync = null;
	if (intact && chunks.length > 0) try {
		savedSync = JSON.parse(syncJson);
	} catch {
		savedSync = null;
	}
	return normalizePersistedStore({
		version: 1,
		savedSync,
		clientOptions: meta.clientOptions,
		cleanShutdown: intact && meta.cleanShutdown
	});
}
function chunkKey(generation, index) {
	return `${SYNC_CACHE_CHUNK_PREFIX}${generation}:${index}`;
}
function resolveLegacySyncCachePath(storageRootDir) {
	return path.join(storageRootDir, "bot-storage.json");
}
function digestText(value) {
	return createHash("sha256").update(value, "utf8").digest("hex");
}
function isSyncCacheMeta(value) {
	return isRecord(value) && value.kind === "meta" && value.version === 1 && typeof value.generation === "string" && value.generation.trim() !== "" && asSafeIntegerInRange(value.chunkCount, {
		min: 0,
		max: SYNC_CACHE_MAX_CHUNKS
	}) !== void 0;
}
function buildSyncCacheRows(payload) {
	const generation = randomUUID().replaceAll("-", "");
	const syncJson = payload.savedSync ? JSON.stringify(payload.savedSync) : "";
	const chunks = chunkMatrixStateJson(syncJson, SYNC_CACHE_CHUNK_BYTES, SYNC_CACHE_MAX_CHUNKS, "Matrix sync cache exceeds SQLite chunk limit").map((data, index) => ({
		key: chunkKey(generation, index),
		value: {
			kind: "sync-chunk",
			index,
			data
		}
	}));
	return {
		chunks,
		meta: {
			key: SYNC_CACHE_META_KEY,
			value: {
				kind: "meta",
				version: 1,
				generation,
				chunkCount: chunks.length,
				...syncJson ? { syncDigest: digestText(syncJson) } : {},
				...payload.clientOptions ? { clientOptions: payload.clientOptions } : {},
				cleanShutdown: payload.cleanShutdown === true
			}
		}
	};
}
async function readLegacyMatrixSyncCacheState(storageRootDir) {
	const { decodeUtf8Input, Utf8InputError } = await import("./runtime-doctor-migrations-hxP-CXX7.mjs").then((n) => n.t);
	try {
		const raw = decodeUtf8Input(await fs.readFile(resolveLegacySyncCachePath(storageRootDir)), "Legacy Matrix sync cache");
		const persisted = normalizeLegacyPersistedStore(JSON.parse(raw));
		if (!persisted?.savedSync && !persisted?.clientOptions) return null;
		return persisted;
	} catch (error) {
		if (error instanceof Utf8InputError) throw error;
		return null;
	}
}
async function hasMatrixSyncCacheStateInStore(params) {
	return Boolean((await readPersistedStoreFromStore(params))?.savedSync);
}
async function writeMatrixSyncCacheStateToStore(params) {
	const { storageRootDir, store, payload } = params;
	const rows = buildSyncCacheRows(payload);
	return syncCacheOperations.enqueue(path.resolve(storageRootDir), () => writeMatrixStateChunks(store, rows, SYNC_CACHE_CHUNK_PREFIX));
}
function openMatrixSyncCacheStoreOptions(storageRootDir) {
	return {
		namespace: SYNC_CACHE_NAMESPACE,
		maxEntries: SYNC_CACHE_MAX_ENTRIES,
		env: resolveMatrixSqliteStateEnv({ stateDir: storageRootDir })
	};
}
async function deleteMatrixSyncCacheStateFromStore(params) {
	const { storageRootDir, store } = params;
	return syncCacheOperations.enqueue(path.resolve(storageRootDir), async () => {
		await store.delete(SYNC_CACHE_META_KEY);
		for (const row of await store.entries()) if (row.key.startsWith(SYNC_CACHE_CHUNK_PREFIX)) await store.delete(row.key);
		await fs.rm(resolveLegacySyncCachePath(storageRootDir), { force: true }).catch(() => void 0);
	});
}
//#endregion
export { readPersistedStoreFromStore as a, readLegacyMatrixSyncCacheState as i, hasMatrixSyncCacheStateInStore as n, sync_cache_state_exports as o, openMatrixSyncCacheStoreOptions as r, writeMatrixSyncCacheStateToStore as s, deleteMatrixSyncCacheStateFromStore as t };
