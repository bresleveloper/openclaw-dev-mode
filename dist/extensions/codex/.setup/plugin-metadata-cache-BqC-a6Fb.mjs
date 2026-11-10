//#region extensions/codex/src/app-server/plugin-metadata-cache.ts
const CODEX_PLUGIN_METADATA_CACHE_TTL_MS = 36e5;
var CodexPluginMetadataCache = class {
	constructor(nowMs = Date.now) {
		this.nowMs = nowMs;
		this.entries = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
	}
	read(appCacheKey, queryKind, requestParams, catalogScope) {
		const entryKey = buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope);
		const entry = this.entries.get(entryKey);
		if (!entry) return;
		if (entry.expiresAtMs <= this.nowMs()) {
			this.entries.delete(entryKey);
			return;
		}
		return entry.response;
	}
	/** Returns a fresh snapshot or coalesces one catalog or installed-plugin request. */
	async load(params) {
		const entryKey = buildMetadataCacheEntryKey(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		const cached = this.read(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		if (cached) return cached;
		const pending = this.inFlight.get(entryKey);
		if (pending) return await pending.promise;
		const promise = (async () => {
			const method = params.queryKind === "installed" ? "plugin/installed" : "plugin/list";
			const response = await params.request(method, params.requestParams);
			if (response.marketplaceLoadErrors.length === 0 && (params.cacheable?.(response) ?? true)) this.entries.set(entryKey, {
				appCacheKey: params.appCacheKey,
				response,
				expiresAtMs: this.nowMs() + CODEX_PLUGIN_METADATA_CACHE_TTL_MS
			});
			return response;
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
		for (const cache of [this.entries, this.inFlight]) for (const [entryKey, entry] of cache) if (entry.appCacheKey === appCacheKey) cache.delete(entryKey);
	}
	clear() {
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
