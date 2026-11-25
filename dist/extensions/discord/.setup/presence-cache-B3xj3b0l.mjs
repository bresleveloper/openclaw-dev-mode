import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
// extensions/discord/src/monitor/presence-cache.ts
/**
* In-memory cache of Discord user presence data.
* Populated by GUILD_CREATE snapshots and PRESENCE_UPDATE when GuildPresences is enabled.
* Per-account maps are capped to prevent unbounded growth (#4948).
*/
const MAX_PRESENCE_PER_ACCOUNT = 5e3;
const presenceCache = /* @__PURE__ */ new Map();
function setPresence(accountId, userId, data) {
	const accountKey = accountId ?? "default";
	let accountCache = presenceCache.get(accountKey);
	if (!accountCache) {
		accountCache = /* @__PURE__ */ new Map();
		presenceCache.set(accountKey, accountCache);
	}
	accountCache.set(userId, data);
	pruneMapToMaxSize(accountCache, MAX_PRESENCE_PER_ACCOUNT);
}
function getPresence(accountId, userId) {
	return presenceCache.get(accountId ?? "default")?.get(userId);
}
function clearPresences(accountId) {
	if (accountId) {
		presenceCache.delete(accountId);
		return;
	}
	presenceCache.clear();
}
export { getPresence as n, setPresence as r, clearPresences as t };
