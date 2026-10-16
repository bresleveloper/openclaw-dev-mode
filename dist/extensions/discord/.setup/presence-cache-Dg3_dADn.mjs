import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
//#region extensions/discord/src/monitor/presence-cache.ts
/**
* In-memory cache of Discord user presence data.
* Populated by GUILD_CREATE snapshots and PRESENCE_UPDATE when GuildPresences is enabled.
* Per-account maps are capped to prevent unbounded growth (#4948).
*/
const MAX_PRESENCE_PER_ACCOUNT = 5e3;
const presenceCache = /* @__PURE__ */ new Map();
function resolveAccountKey(accountId) {
	return accountId ?? "default";
}
function setPresence(accountId, userId, data) {
	const accountKey = resolveAccountKey(accountId);
	let accountCache = presenceCache.get(accountKey);
	if (!accountCache) {
		accountCache = /* @__PURE__ */ new Map();
		presenceCache.set(accountKey, accountCache);
	}
	accountCache.set(userId, data);
	pruneMapToMaxSize(accountCache, MAX_PRESENCE_PER_ACCOUNT);
}
function getPresence(accountId, userId) {
	return presenceCache.get(resolveAccountKey(accountId))?.get(userId);
}
function clearPresences(accountId) {
	if (accountId) {
		presenceCache.delete(resolveAccountKey(accountId));
		return;
	}
	presenceCache.clear();
}
function presenceCacheSize() {
	let total = 0;
	for (const accountCache of presenceCache.values()) total += accountCache.size;
	return total;
}
//#endregion
export { setPresence as i, getPresence as n, presenceCacheSize as r, clearPresences as t };
