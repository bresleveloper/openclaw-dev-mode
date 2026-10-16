import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { t as claimCurrentTokenStorageState } from "./storage-D7agewjH.mjs";
import { a as readPersistedStoreFromStore, r as openMatrixSyncCacheStoreOptions, s as writeMatrixSyncCacheStateToStore, t as deleteMatrixSyncCacheStateFromStore } from "./sync-cache-state-C2z64uyk.mjs";
import { t as LogService } from "./logger-CXQnpXCt.mjs";
import { MemoryStore, SyncAccumulator } from "matrix-js-sdk/lib/matrix.js";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
//#region extensions/matrix/src/matrix/client/file-sync-store.ts
const PERSIST_DEBOUNCE_MS = 250;
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
		return Promise.resolve(this.savedSync ? structuredClone(this.savedSync) : null);
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
		return Promise.resolve(this.savedClientOptions ? structuredClone(this.savedClientOptions) : void 0);
	}
	storeClientOptions(options) {
		if (this.frozen) return Promise.resolve();
		this.savedClientOptions = structuredClone(options);
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
		this.clearPersistTimer();
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
		this.clearPersistTimer();
		while (this.persistPromise) await this.persistPromise;
	}
	discardPendingSyncCursorPersistence() {
		this.frozen = true;
		this.clearPersistTimer();
		this.cleanShutdown = false;
		this.dirty = false;
	}
	async flush() {
		this.clearPersistTimer();
		while (this.dirty || this.persistPromise) {
			if (this.dirty && !this.persistPromise) this.enqueuePersistence(() => this.persist());
			await this.persistPromise;
		}
	}
	clearPersistTimer() {
		if (this.persistTimer) {
			clearTimeout(this.persistTimer);
			this.persistTimer = null;
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
			savedSync: this.savedSync ? structuredClone(this.savedSync) : null,
			cleanShutdown: this.cleanShutdown,
			...this.savedClientOptions ? { clientOptions: structuredClone(this.savedClientOptions) } : {}
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
