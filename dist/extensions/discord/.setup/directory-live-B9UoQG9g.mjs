import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { h as normalizeDiscordToken, l as resolveDiscordAccount } from "./accounts-DtjvhJUj.mjs";
import { a as normalizeDiscordDisplaySlug } from "./allow-list-CkqpzPvP.mjs";
import { f as rememberDiscordDirectoryUser } from "./send.receipt-CZ7ks6g7.mjs";
import { t as DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS } from "./api-C4j_kC-2.mjs";
import { n as listGuilds, r as searchDiscordGuildMembers, t as listDiscordGuildChannels } from "./guilds-DYBhgnfq.mjs";
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/discord/src/directory-live.ts
var directory_live_exports = /* @__PURE__ */ __exportAll({
	listDiscordDirectoryGroupsLive: () => listDiscordDirectoryGroupsLive,
	listDiscordDirectoryPeersLive: () => listDiscordDirectoryPeersLive
});
function resolveDiscordDirectoryAccess(params) {
	const account = resolveDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const token = normalizeDiscordToken(account.token, "channels.discord.token");
	if (!token) return null;
	return {
		token,
		query: normalizeOptionalLowercaseString(params.query) ?? "",
		accountId: account.accountId
	};
}
async function listDiscordDirectoryLive(params, kind) {
	const access = resolveDiscordDirectoryAccess(params);
	if (!access || kind === "user" && !access.query) return [];
	const { token, query, accountId } = access;
	const channelQuery = normalizeDiscordDisplaySlug(query);
	const guilds = await listGuilds(token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
	const rows = [];
	const seenUserIds = /* @__PURE__ */ new Set();
	const limit = kind === "user" && typeof params.limit === "number" && params.limit > 0 ? params.limit : 25;
	for (const guild of guilds) {
		if (!guild.id || !guild.name) continue;
		if (kind === "group") {
			const channels = await listDiscordGuildChannels(token, fetch, guild.id);
			for (const channel of channels) {
				const name = channel.name?.trim();
				if (!name) continue;
				if (channelQuery && !normalizeDiscordDisplaySlug(name).includes(channelQuery)) continue;
				rows.push({
					kind: "group",
					id: `channel:${channel.id}`,
					name,
					handle: `#${name}`,
					raw: channel
				});
				if (typeof params.limit === "number" && params.limit > 0 && rows.length >= params.limit) return rows;
			}
		} else {
			const members = await searchDiscordGuildMembers(token, fetch, guild.id, query, Math.min(limit, 100));
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
					rank: user.bot ? 0 : 1,
					raw: member
				});
				if (rows.length >= limit) return rows;
			}
		}
	}
	return rows;
}
function listDiscordDirectoryGroupsLive(params) {
	return listDiscordDirectoryLive(params, "group");
}
function listDiscordDirectoryPeersLive(params) {
	return listDiscordDirectoryLive(params, "user");
}
export { listDiscordDirectoryGroupsLive as n, listDiscordDirectoryPeersLive as r, directory_live_exports as t };
