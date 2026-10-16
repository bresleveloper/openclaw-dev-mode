//#region extensions/codex/src/app-server/plugin-metadata-cache.ts
const CODEX_PLUGIN_METADATA_CACHE_TTL_MS = 36e5;
var CodexPluginMetadataCache = class {
	constructor(nowMs = Date.now) {
		this.nowMs = nowMs;
		this.entries = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
		this.generations = /* @__PURE__ */ new Map();
		this.clearGeneration = 0;
	}
	read(appCacheKey, queryKind, requestParams, catalogScope) {
		const entryKey = buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope);
		const entry = this.entries.get(entryKey);
		if (!entry) return;
		if (entry.expiresAtMs <= this.nowMs()) {
			this.entries.delete(entryKey);
			return;
		}
		return entry.snapshot;
	}
	/** Returns a fresh snapshot or coalesces one catalog or installed-plugin request. */
	async load(params) {
		const entryKey = buildMetadataCacheEntryKey(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		const cached = this.read(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		if (cached) return cached;
		const pending = this.inFlight.get(entryKey);
		if (pending) try {
			return await pending.promise;
		} catch {
			if (this.inFlight.get(entryKey) === pending) this.inFlight.delete(entryKey);
			return await this.load(params);
		}
		const generation = this.generations.get(params.appCacheKey) ?? 0;
		const clearGeneration = this.clearGeneration;
		const promise = (async () => {
			const method = params.queryKind === "installed" ? "plugin/installed" : "plugin/list";
			const response = await params.request(method, params.requestParams);
			const snapshot = {
				appCacheKey: params.appCacheKey,
				queryKind: params.queryKind,
				response
			};
			if (generation === (this.generations.get(params.appCacheKey) ?? 0) && clearGeneration === this.clearGeneration && response.marketplaceLoadErrors.length === 0 && (params.cacheable?.(response) ?? true)) this.entries.set(entryKey, {
				snapshot,
				expiresAtMs: this.nowMs() + CODEX_PLUGIN_METADATA_CACHE_TTL_MS
			});
			return snapshot;
		})();
		this.inFlight.set(entryKey, {
			appCacheKey: params.appCacheKey,
			promise
		});
		try {
			return await promise;
		} finally {
			if (this.inFlight.get(entryKey)?.promise === promise) this.inFlight.delete(entryKey);
		}
	}
	invalidate(appCacheKey) {
		this.generations.set(appCacheKey, (this.generations.get(appCacheKey) ?? 0) + 1);
		for (const [entryKey, entry] of this.entries) if (entry.snapshot.appCacheKey === appCacheKey) this.entries.delete(entryKey);
		for (const [entryKey, pending] of this.inFlight) if (pending.appCacheKey === appCacheKey) this.inFlight.delete(entryKey);
	}
	/** Clears snapshots and prevents late in-flight loads from repopulating them. */
	clear() {
		this.clearGeneration += 1;
		this.generations.clear();
		this.entries.clear();
		this.inFlight.clear();
	}
};
const defaultCodexPluginMetadataCache = new CodexPluginMetadataCache();
function buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope) {
	const names = queryKind === "installed" ? requestParams?.installSuggestionPluginNames : requestParams?.marketplaceKinds;
	return JSON.stringify([
		appCacheKey,
		queryKind,
		requestParams?.cwds ?? [],
		Array.from(new Set(names ?? [])).toSorted(),
		...queryKind !== "installed" && catalogScope ? [catalogScope] : []
	]);
}
//#endregion
export { defaultCodexPluginMetadataCache as t };
