//#region packages/ai/src/providers/cache-retention.ts
/**
* Resolve cache retention preference.
* Defaults to "short" and uses OPENCLAW_CACHE_RETENTION for backward compatibility.
*/
function resolveCacheRetention(cacheRetention) {
	if (cacheRetention === "short" || cacheRetention === "long" || cacheRetention === "none") return cacheRetention;
	if (typeof process !== "undefined" && process.env.OPENCLAW_CACHE_RETENTION === "long") return "long";
	return "short";
}
//#endregion
export { resolveCacheRetention as t };
