import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
//#region src/config/sessions/session-accessor.sqlite-branches.ts
const SESSION_BRANCH_CACHE_MAX_ENTRIES = 64;
const sessionBranchCache = /* @__PURE__ */ new Map();
function sessionBranchCacheKey(databasePath, sessionKey) {
	return `${databasePath}\0${sessionKey}`;
}
function cloneSessionBranchSummaries(branches) {
	return branches.map((branch) => ({ ...branch }));
}
function readCachedSessionBranchSummaries(databasePath, sessionKey) {
	const cacheKey = sessionBranchCacheKey(databasePath, sessionKey);
	const cached = sessionBranchCache.get(cacheKey);
	if (!cached) return;
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, cached);
	return cached;
}
function cacheSessionBranchSummaries(databasePath, sessionKey, writeToken, snapshot) {
	if (writeToken === void 0) return;
	const cacheKey = sessionBranchCacheKey(databasePath, sessionKey);
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, {
		...snapshot,
		writeToken
	});
	pruneMapToMaxSize(sessionBranchCache, SESSION_BRANCH_CACHE_MAX_ENTRIES);
}
function invalidateSessionBranchCache(databasePath, sessionIds) {
	const selected = new Set(uniqueStrings(sessionIds));
	for (const [key, snapshot] of sessionBranchCache) if (key.startsWith(`${databasePath}\0`) && snapshot.source && selected.has(snapshot.source.sessionId)) sessionBranchCache.delete(key);
}
//#endregion
export { readCachedSessionBranchSummaries as i, cloneSessionBranchSummaries as n, invalidateSessionBranchCache as r, cacheSessionBranchSummaries as t };
