import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
//#region src/plugins/plugin-lru-cache.ts
/** Small process-local LRU cache for runtime registries and compiled validators. */
var PluginLruCache = class {
	#maxEntries;
	#entries = /* @__PURE__ */ new Map();
	constructor(maxEntries) {
		this.#maxEntries = Number.isFinite(maxEntries) && maxEntries > 0 ? Math.max(1, Math.floor(maxEntries)) : 1;
	}
	get size() {
		return this.#entries.size;
	}
	clear() {
		this.#entries.clear();
	}
	deleteValue(value) {
		for (const [key, entry] of this.#entries) if (entry === value) this.#entries.delete(key);
	}
	/** Returns a cached value and refreshes its recency when present. */
	get(cacheKey) {
		if (!this.#entries.has(cacheKey)) return;
		const cached = this.#entries.get(cacheKey);
		this.#entries.delete(cacheKey);
		this.#entries.set(cacheKey, cached);
		return cached;
	}
	/** Stores a value as the newest entry and evicts oldest entries past capacity. */
	set(cacheKey, value) {
		this.#entries.delete(cacheKey);
		this.#entries.set(cacheKey, value);
		pruneMapToMaxSize(this.#entries, this.#maxEntries);
	}
};
//#endregion
export { PluginLruCache as t };
