import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/infra/stale-while-revalidate-cache.ts
function createStaleWhileRevalidateCache(options) {
	let values = /* @__PURE__ */ new Map();
	let pending = /* @__PURE__ */ new Map();
	let active = 0;
	return {
		async read(key, load, readOptions = {}) {
			const entries = values;
			const loads = pending;
			const cached = entries.get(key);
			if (!readOptions.refresh && cached && cached.expiresAt > Date.now()) {
				if (cached.kind === "error") throw cached.error;
				return {
					value: cached.value,
					stale: false
				};
			}
			const stale = !readOptions.refresh && readOptions.allowStale !== false && cached?.kind === "value" ? cached : void 0;
			if ((!loads.has(key) || readOptions.refresh) && active >= (options.maxPending ?? options.maxEntries)) {
				if (stale) return {
					value: stale.value,
					stale: true
				};
				throw new Error("Read cache is busy; retry shortly.");
			}
			if (readOptions.refresh) loads.delete(key);
			const refresh = getOrCreatePromise(loads, key, () => {
				active += 1;
				return (async () => load(cached?.kind === "value" ? cached.value : void 0))().then((value) => {
					if (loads.get(key) !== refresh) return value;
					if (options.cacheable?.(value) !== false) {
						entries.set(key, {
							kind: "value",
							value,
							expiresAt: Date.now() + options.ttlMs
						});
						pruneMapToMaxSize(entries, options.maxEntries);
					} else entries.delete(key);
					return value;
				}).catch((error) => {
					if (loads.get(key) === refresh) {
						entries.delete(key);
						const ttl = options.errorTtlMs?.(error) ?? 0;
						if (ttl > 0) {
							entries.set(key, {
								kind: "error",
								error,
								expiresAt: Date.now() + ttl
							});
							pruneMapToMaxSize(entries, options.maxEntries);
						}
						if (stale) options.onBackgroundError?.(error);
					}
					throw error;
				}).finally(() => {
					active -= 1;
				});
			}, { evictOnSettled: true });
			if (stale) {
				refresh.catch(() => {});
				return {
					value: stale.value,
					stale: true
				};
			}
			return {
				value: await refresh,
				stale: false
			};
		},
		deleteValue(value) {
			for (const [key, entry] of values) if (entry.kind === "value" && entry.value === value) values.delete(key);
		},
		clear() {
			values = /* @__PURE__ */ new Map();
			pending = /* @__PURE__ */ new Map();
		}
	};
}
//#endregion
export { createStaleWhileRevalidateCache as t };
