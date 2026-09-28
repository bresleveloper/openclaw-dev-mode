import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { O as resolveMatrixSqliteStateEnv } from "./storage-metadata-fHN6Df2m.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
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
const MATRIX_SYNC_CACHE_VERSION = 1;
const SYNC_CACHE_NAMESPACE = "sync-cache";
const SYNC_CACHE_MAX_ENTRIES = 2e4;
const SYNC_CACHE_MAX_CHUNKS = Math.floor(19999 / 2);
const SYNC_CACHE_STATE_KEY = "current";
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
	if (typeof value.next_batch === "string" && value.next_batch.trim()) {
		const roomsData = normalizeRoomsData(value.rooms);
		if (!roomsData) return null;
		return {
			nextBatch: value.next_batch,
			accountData: isRecord(value.account_data) && Array.isArray(value.account_data.events) ? value.account_data.events : [],
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
	const stateKey = SYNC_CACHE_STATE_KEY;
	const meta = await store.lookup(metaKey(stateKey));
	if (!isSyncCacheMeta(meta)) return null;
	const records = await store.lookupMany?.(Array.from({ length: meta.chunkCount }, (_, index) => chunkKey(stateKey, meta.generation, index)));
	const chunks = [];
	for (let index = 0; index < meta.chunkCount; index += 1) {
		const result = records?.[index];
		if (result && !result.ok) throw result.error;
		const chunk = records ? result?.value : await store.lookup(chunkKey(stateKey, meta.generation, index));
		if (!isSyncCacheChunk(chunk) || chunk.index !== index) return normalizePersistedStore({
			version: 1,
			savedSync: null,
			clientOptions: meta.clientOptions,
			cleanShutdown: false
		});
		chunks.push(chunk.data);
	}
	let savedSync = null;
	if (chunks.length > 0) {
		const syncJson = chunks.join("");
		if (meta.syncDigest !== digestText(syncJson)) return normalizePersistedStore({
			version: 1,
			savedSync: null,
			clientOptions: meta.clientOptions,
			cleanShutdown: false
		});
		try {
			savedSync = toPersistedSyncData(JSON.parse(syncJson));
		} catch {
			savedSync = null;
		}
	}
	return normalizePersistedStore({
		version: 1,
		savedSync,
		clientOptions: meta.clientOptions,
		cleanShutdown: meta.cleanShutdown
	});
}
function metaKey(stateKey) {
	return `${stateKey}:meta`;
}
function chunkKeyPrefix(stateKey) {
	return `${stateKey}:sync:`;
}
function chunkKey(stateKey, generation, index) {
	return `${chunkKeyPrefix(stateKey)}${generation}:${index}`;
}
function resolveLegacySyncCachePath(storageRootDir) {
	return path.join(storageRootDir, "bot-storage.json");
}
function digestText(value) {
	return createHash("sha256").update(value, "utf8").digest("hex");
}
function isSyncCacheMeta(value) {
	return isRecord(value) && value.kind === "meta" && value.version === 1 && typeof value.generation === "string" && value.generation.trim() !== "" && typeof value.chunkCount === "number" && Number.isSafeInteger(value.chunkCount) && value.chunkCount >= 0 && value.chunkCount <= SYNC_CACHE_MAX_CHUNKS;
}
function isSyncCacheChunk(value) {
	return isRecord(value) && value.kind === "sync-chunk" && typeof value.index === "number" && Number.isSafeInteger(value.index) && value.index >= 0 && typeof value.data === "string";
}
function chunkSyncCacheJson(value) {
	const chunks = [];
	const pushChunk = (chunk) => {
		if (chunks.length >= SYNC_CACHE_MAX_CHUNKS) throw new Error("Matrix sync cache exceeds SQLite chunk limit");
		chunks.push(chunk);
	};
	let current = "";
	let currentBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (current && currentBytes + charBytes > SYNC_CACHE_CHUNK_BYTES) {
			pushChunk(current);
			current = "";
			currentBytes = 0;
		}
		current += char;
		currentBytes += charBytes;
	}
	if (current) pushChunk(current);
	return chunks;
}
function buildSyncCacheRows(stateKey, payload) {
	const generation = randomUUID().replaceAll("-", "");
	const syncJson = payload.savedSync ? JSON.stringify(payload.savedSync) : "";
	const chunks = (syncJson ? chunkSyncCacheJson(syncJson) : []).map((data, index) => ({
		key: chunkKey(stateKey, generation, index),
		value: {
			kind: "sync-chunk",
			index,
			data
		}
	}));
	return {
		chunks,
		nextChunkKeys: new Set(chunks.map((chunk) => chunk.key)),
		meta: {
			key: metaKey(stateKey),
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
	try {
		const raw = await fs.readFile(resolveLegacySyncCachePath(storageRootDir), "utf8");
		const persisted = normalizeLegacyPersistedStore(JSON.parse(raw));
		if (!persisted?.savedSync && !persisted?.clientOptions) return null;
		return persisted;
	} catch {
		return null;
	}
}
async function hasMatrixSyncCacheStateInStore(params) {
	return Boolean((await readPersistedStoreFromStore(params))?.savedSync);
}
async function writeMatrixSyncCacheStateToStore(params) {
	const { storageRootDir, store, payload } = params;
	const stateKey = SYNC_CACHE_STATE_KEY;
	const rows = buildSyncCacheRows(stateKey, payload);
	return syncCacheOperations.enqueue(path.resolve(storageRootDir), async () => {
		for (const row of rows.chunks) await store.register(row.key, row.value);
		await store.register(rows.meta.key, rows.meta.value);
		for (const row of await store.entries()) if (row.key.startsWith(chunkKeyPrefix(stateKey)) && !rows.nextChunkKeys.has(row.key)) await store.delete(row.key);
	});
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
		await store.delete(metaKey(SYNC_CACHE_STATE_KEY));
		for (const row of await store.entries()) if (row.key.startsWith(chunkKeyPrefix(SYNC_CACHE_STATE_KEY))) await store.delete(row.key);
		await fs.rm(resolveLegacySyncCachePath(storageRootDir), { force: true }).catch(() => void 0);
	});
}
//#endregion
export { readLegacyMatrixSyncCacheState as a, writeMatrixSyncCacheStateToStore as c, openMatrixSyncCacheStoreOptions as i, deleteMatrixSyncCacheStateFromStore as n, readPersistedStoreFromStore as o, hasMatrixSyncCacheStateInStore as r, sync_cache_state_exports as s, MATRIX_SYNC_CACHE_VERSION as t };
