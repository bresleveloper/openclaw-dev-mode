import { Ut as __exportAll } from "./discord-BXpHW-cu.mjs";
import { o as normalizeDiscordSlug } from "./channel-type-DKnjV1XW.mjs";
import { c as resolveDiscordAccount, m as normalizeDiscordToken } from "./accounts-CwJQoLjM.mjs";
import { r as fetchDiscord, t as DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS } from "./api-CBK9zcq5.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/directory-cache-state.ts
const discordDirectoryCacheState = { handlesByAccount: /* @__PURE__ */ new Map() };
//#endregion
//#region extensions/discord/src/directory-cache.ts
const DISCORD_DIRECTORY_CACHE_MAX_ENTRIES = 4e3;
const DISCORD_DISCRIMINATOR_SUFFIX = /#\d{4}$/;
function normalizeAccountCacheKey(accountId) {
	return normalizeAccountId(accountId ?? DEFAULT_ACCOUNT_ID) || DEFAULT_ACCOUNT_ID;
}
function normalizeSnowflake(value) {
	const text = normalizeOptionalStringifiedId(value) ?? "";
	if (!/^\d+$/.test(text)) return null;
	return text;
}
function normalizeDiscordHandleKey(raw) {
	let handle = normalizeOptionalString(raw) ?? "";
	if (!handle) return null;
	if (handle.startsWith("@")) handle = normalizeOptionalString(handle.slice(1)) ?? "";
	if (!handle || /\s/.test(handle)) return null;
	return normalizeLowercaseStringOrEmpty(handle);
}
function ensureAccountCache(accountId) {
	const cacheKey = normalizeAccountCacheKey(accountId);
	const existing = discordDirectoryCacheState.handlesByAccount.get(cacheKey);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	discordDirectoryCacheState.handlesByAccount.set(cacheKey, created);
	return created;
}
function setCacheEntry(cache, key, userId) {
	if (cache.has(key)) cache.delete(key);
	cache.set(key, userId);
	if (cache.size <= DISCORD_DIRECTORY_CACHE_MAX_ENTRIES) return;
	const oldest = cache.keys().next();
	if (!oldest.done) cache.delete(oldest.value);
}
function rememberDiscordDirectoryUser(params) {
	const userId = normalizeSnowflake(params.userId);
	if (!userId) return;
	const cache = ensureAccountCache(params.accountId);
	for (const candidate of params.handles) {
		if (typeof candidate !== "string") continue;
		const handle = normalizeDiscordHandleKey(candidate);
		if (!handle) continue;
		setCacheEntry(cache, handle, userId);
		const withoutDiscriminator = handle.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
		if (withoutDiscriminator && withoutDiscriminator !== handle) setCacheEntry(cache, withoutDiscriminator, userId);
	}
}
function resolveDiscordDirectoryUserId(params) {
	const cache = discordDirectoryCacheState.handlesByAccount.get(normalizeAccountCacheKey(params.accountId));
	if (!cache) return;
	const handle = normalizeDiscordHandleKey(params.handle);
	if (!handle) return;
	const direct = cache.get(handle);
	if (direct) return direct;
	const withoutDiscriminator = handle.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
	if (!withoutDiscriminator || withoutDiscriminator === handle) return;
	return cache.get(withoutDiscriminator);
}
//#endregion
//#region extensions/discord/src/directory-live.ts
var directory_live_exports = /* @__PURE__ */ __exportAll({
	listDiscordDirectoryGroupsLive: () => listDiscordDirectoryGroupsLive,
	listDiscordDirectoryPeersLive: () => listDiscordDirectoryPeersLive
});
function normalizeQuery(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
function buildUserRank(user) {
	return user.bot ? 0 : 1;
}
function resolveDiscordDirectoryAccess(params) {
	const account = resolveDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const token = normalizeDiscordToken(account.token, "channels.discord.token");
	if (!token) return null;
	return {
		token,
		query: normalizeQuery(params.query),
		accountId: account.accountId
	};
}
async function listDiscordGuilds(token) {
	return (await fetchDiscord("/users/@me/guilds", token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS })).filter((guild) => guild.id && guild.name);
}
async function listDiscordDirectoryGroupsLive(params) {
	const access = resolveDiscordDirectoryAccess(params);
	if (!access) return [];
	const { token, query } = access;
	const guilds = await listDiscordGuilds(token);
	const rows = [];
	for (const guild of guilds) {
		const channels = await fetchDiscord(`/guilds/${guild.id}/channels`, token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
		for (const channel of channels) {
			const name = channel.name?.trim();
			if (!name) continue;
			if (query && !normalizeDiscordSlug(name).includes(normalizeDiscordSlug(query))) continue;
			rows.push({
				kind: "group",
				id: `channel:${channel.id}`,
				name,
				handle: `#${name}`,
				raw: channel
			});
			if (typeof params.limit === "number" && params.limit > 0 && rows.length >= params.limit) return rows;
		}
	}
	return rows;
}
async function listDiscordDirectoryPeersLive(params) {
	const access = resolveDiscordDirectoryAccess(params);
	if (!access) return [];
	const { token, query, accountId } = access;
	if (!query) return [];
	const guilds = await listDiscordGuilds(token);
	const rows = [];
	const seenUserIds = /* @__PURE__ */ new Set();
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 25;
	for (const guild of guilds) {
		const paramsObj = new URLSearchParams({
			query,
			limit: String(Math.min(limit, 100))
		});
		const members = await fetchDiscord(`/guilds/${guild.id}/members/search?${paramsObj.toString()}`, token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
		for (const member of members) {
			const user = member.user;
			if (!user?.id) continue;
			rememberDiscordDirectoryUser({
				accountId,
				userId: user.id,
				handles: [
					user.username,
					user.global_name,
					member.nick,
					user.username ? `@${user.username}` : null
				]
			});
			if (seenUserIds.has(user.id)) continue;
			seenUserIds.add(user.id);
			const name = member.nick?.trim() || user.global_name?.trim() || user.username?.trim();
			rows.push({
				kind: "user",
				id: `user:${user.id}`,
				name: name || void 0,
				handle: user.username ? `@${user.username}` : void 0,
				rank: buildUserRank(user),
				raw: member
			});
			if (rows.length >= limit) return rows;
		}
	}
	return rows;
}
//#endregion
export { rememberDiscordDirectoryUser as a, normalizeDiscordHandleKey as i, listDiscordDirectoryGroupsLive as n, resolveDiscordDirectoryUserId as o, listDiscordDirectoryPeersLive as r, directory_live_exports as t };
