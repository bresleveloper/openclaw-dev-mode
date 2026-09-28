import { n as resolveGlobalDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
//#region src/plugin-sdk/dedupe-runtime.ts
/**
* Creates a channel-family presence cache backed by a global in-memory dedupe layer
* plus a lazily opened plugin keyed store. Persistence is best effort: the first
* open/read/write failure disables the persistent layer for the process so message
* handling never breaks on state errors, matching the shipped channel-cache contract.
*/
function createPersistentDedupeCache(params) {
	const memory = resolveGlobalDedupeCache(params.globalKey, {
		ttlMs: params.ttlMs,
		maxSize: params.maxSize
	});
	let persistentStore;
	let persistentStoreDisabled = false;
	const disablePersistentStore = (error) => {
		persistentStoreDisabled = true;
		persistentStore = void 0;
		params.persistent.logError?.(error);
	};
	const getPersistentStore = () => {
		if (persistentStoreDisabled) return;
		if (persistentStore) return persistentStore;
		try {
			persistentStore = params.persistent.openStore({
				namespace: params.persistent.namespace,
				maxEntries: params.persistent.maxEntries,
				...params.ttlMs > 0 ? { defaultTtlMs: params.ttlMs } : {}
			});
			return persistentStore;
		} catch (error) {
			disablePersistentStore(error);
			return;
		}
	};
	return {
		peek: (key) => memory.peek(key),
		lookup: async (key) => {
			if (memory.peek(key)) return true;
			const store = getPersistentStore();
			if (!store) return false;
			let record;
			try {
				record = await store.lookup(key);
				if (record === void 0) return false;
				if (params.ttlMs <= 0) {
					const metadataStore = store;
					if (typeof metadataStore.entries === "function") {
						const entries = await metadataStore.entries();
						if (Array.isArray(entries)) {
							const entry = entries.find((candidate) => candidate.key === key);
							if (!entry) return false;
							if (entry.expiresAt !== void 0) return entry.expiresAt > Date.now();
						}
					}
				}
			} catch (error) {
				disablePersistentStore(error);
				return false;
			}
			const recordedAt = params.persistent.readTimestamp?.(record);
			if (recordedAt !== void 0 && params.ttlMs > 0 && Date.now() - recordedAt >= params.ttlMs) return false;
			memory.check(key, recordedAt);
			return true;
		},
		register: async (key, record, opts) => {
			memory.check(key, opts?.at);
			const store = getPersistentStore();
			if (!store) return;
			try {
				await store.register(key, record);
			} catch (error) {
				disablePersistentStore(error);
			}
		},
		clearForTest: () => {
			memory.clear();
			persistentStore = void 0;
			persistentStoreDisabled = false;
		}
	};
}
//#endregion
export { createPersistentDedupeCache as t };
