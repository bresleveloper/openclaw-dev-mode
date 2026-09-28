import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { t as claimCurrentTokenStorageState } from "./storage-BXaFc0S4.mjs";
import { c as writeMatrixSyncCacheStateToStore, i as openMatrixSyncCacheStoreOptions, n as deleteMatrixSyncCacheStateFromStore, o as readPersistedStoreFromStore } from "./sync-cache-state-BMtGMxU1.mjs";
import { n as LogService } from "./logger-xBjiRIp1.mjs";
import { MemoryStore, SyncAccumulator } from "matrix-js-sdk/lib/matrix.js";
//#region extensions/matrix/src/matrix/async-lock.ts
function createAsyncLock() {
	let lock = Promise.resolve();
	return async function withLock(fn) {
		const previous = lock;
		let release;
		lock = new Promise((resolve) => {
			release = resolve;
		});
		await previous;
		try {
			return await fn();
		} finally {
			release?.();
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/client/file-sync-store.ts
const PERSIST_DEBOUNCE_MS = 250;
function cloneJson(value) {
	return structuredClone(value);
}
function syncDataToSyncResponse(syncData) {
	return {
		next_batch: syncData.nextBatch,
		rooms: syncData.roomsData,
		account_data: { events: syncData.accountData }
	};
}
var SqliteBackedMatrixSyncStore = class SqliteBackedMatrixSyncStore extends MemoryStore {
	static async create(storageRootDir) {
		let store;
		let persisted = null;
		let unavailableError;
		try {
			store = getMatrixRuntime().state.openKeyedStore(openMatrixSyncCacheStoreOptions(storageRootDir));
			persisted = await readPersistedStoreFromStore({
				storageRootDir,
				store
			});
		} catch (error) {
			unavailableError = error;
			LogService.warn("MatrixSyncCacheStore", "Failed to load Matrix sync cache:", error);
		}
		return new SqliteBackedMatrixSyncStore(storageRootDir, store, persisted, unavailableError);
	}
	constructor(storageRootDir, store, persisted, storeUnavailableError) {
		super();
		this.storageRootDir = storageRootDir;
		this.store = store;
		this.storeUnavailableError = storeUnavailableError;
		this.persistLock = createAsyncLock();
		this.accumulator = new SyncAccumulator();
		this.savedSync = null;
		this.cleanShutdown = false;
		this.dirty = false;
		this.frozen = false;
		this.persistTimer = null;
		this.persistPromise = null;
		const restoredSavedSync = persisted?.savedSync ?? null;
		const restoredClientOptions = persisted?.clientOptions;
		const restoredCleanShutdown = persisted?.cleanShutdown === true;
		this.savedSync = restoredSavedSync;
		this.savedClientOptions = restoredClientOptions;
		this.hadSavedSyncOnLoad = restoredSavedSync !== null;
		this.hadCleanShutdownOnLoad = this.hadSavedSyncOnLoad && restoredCleanShutdown;
		this.cleanShutdown = this.hadCleanShutdownOnLoad;
		if (this.savedSync) {
			this.accumulator.accumulate(syncDataToSyncResponse(this.savedSync), true);
			super.setSyncToken(this.savedSync.nextBatch);
		}
		if (this.savedClientOptions) super.storeClientOptions(this.savedClientOptions);
	}
	hasSavedSync() {
		return this.hadSavedSyncOnLoad;
	}
	hasSavedSyncFromCleanShutdown() {
		return this.hadCleanShutdownOnLoad;
	}
	getSavedSync() {
		return Promise.resolve(this.savedSync ? cloneJson(this.savedSync) : null);
	}
	getSavedSyncToken() {
		return Promise.resolve(this.savedSync?.nextBatch ?? null);
	}
	setSyncData(syncData) {
		if (this.frozen) return Promise.resolve();
		this.accumulator.accumulate(syncData);
		this.savedSync = this.accumulator.getJSON();
		this.markDirtyAndSchedulePersist();
		return Promise.resolve();
	}
	getClientOptions() {
		return Promise.resolve(this.savedClientOptions ? cloneJson(this.savedClientOptions) : void 0);
	}
	storeClientOptions(options) {
		if (this.frozen) return Promise.resolve();
		this.savedClientOptions = cloneJson(options);
		super.storeClientOptions(options);
		this.markDirtyAndSchedulePersist();
		return Promise.resolve();
	}
	save(force = false) {
		if (force) return this.flush();
		return Promise.resolve();
	}
	wantsSave() {
		return false;
	}
	async deleteAllData() {
		const store = this.requireStore();
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
			this.persistTimer = null;
		}
		this.dirty = false;
		await this.enqueuePersistence(async () => {
			await super.deleteAllData();
			this.savedSync = null;
			this.savedClientOptions = void 0;
			this.cleanShutdown = false;
			this.dirty = false;
			await deleteMatrixSyncCacheStateFromStore({
				storageRootDir: this.storageRootDir,
				store
			});
		});
	}
	markCleanShutdown() {
		this.cleanShutdown = true;
		this.dirty = true;
	}
	async freezeSyncCursorPersistence() {
		this.frozen = true;
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
			this.persistTimer = null;
		}
		while (this.persistPromise) await this.persistPromise;
	}
	discardPendingSyncCursorPersistence() {
		this.frozen = true;
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
			this.persistTimer = null;
		}
		this.cleanShutdown = false;
		this.dirty = false;
	}
	async flush() {
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
			this.persistTimer = null;
		}
		while (this.dirty || this.persistPromise) {
			if (this.dirty && !this.persistPromise) this.enqueuePersistence(() => this.persist());
			await this.persistPromise;
		}
	}
	markDirtyAndSchedulePersist() {
		if (this.frozen) return;
		this.cleanShutdown = false;
		this.dirty = true;
		if (this.persistTimer) return;
		this.persistTimer = setTimeout(() => {
			this.persistTimer = null;
			this.flush().catch((err) => {
				LogService.warn("MatrixSyncCacheStore", "Failed to persist Matrix sync store:", err);
			});
		}, PERSIST_DEBOUNCE_MS);
		this.persistTimer.unref?.();
	}
	async persist() {
		const store = this.requireStore();
		this.dirty = false;
		const payload = {
			version: 1,
			savedSync: this.savedSync ? cloneJson(this.savedSync) : null,
			cleanShutdown: this.cleanShutdown,
			...this.savedClientOptions ? { clientOptions: cloneJson(this.savedClientOptions) } : {}
		};
		try {
			await writeMatrixSyncCacheStateToStore({
				storageRootDir: this.storageRootDir,
				payload,
				store
			});
			await claimCurrentTokenStorageState({ rootDir: this.storageRootDir });
		} catch (err) {
			this.dirty = true;
			throw err;
		}
	}
	enqueuePersistence(operation) {
		const pending = this.persistLock(operation).finally(() => {
			if (this.persistPromise === pending) this.persistPromise = null;
		});
		this.persistPromise = pending;
		return pending;
	}
	requireStore() {
		if (this.store && this.storeUnavailableError == null) return this.store;
		throw new Error("Matrix sync cache SQLite store is unavailable; cannot persist sync state", { cause: this.storeUnavailableError });
	}
};
//#endregion
export { SqliteBackedMatrixSyncStore };
