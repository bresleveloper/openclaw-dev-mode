import { o as normalizeDiscordSlug } from "./allow-list-CkqpzPvP.mjs";
import { r as fetchDiscord, t as DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS } from "./api-C4j_kC-2.mjs";
// extensions/discord/src/guilds.ts
function listDiscordGuildChannels(token, fetcher, guildId) {
	return fetchDiscord(`/guilds/${guildId}/channels`, token, fetcher, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
}
function searchDiscordGuildMembers(token, fetcher, guildId, query, limit) {
	const params = new URLSearchParams({
		query,
		limit: String(limit)
	});
	return fetchDiscord(`/guilds/${guildId}/members/search?${params.toString()}`, token, fetcher, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
}
async function listGuilds(token, fetcher, options) {
	return (await fetchDiscord("/users/@me/guilds", token, fetcher, options)).flatMap((guild) => typeof guild.id === "string" && typeof guild.name === "string" ? [{
		id: guild.id,
		name: guild.name,
		slug: normalizeDiscordSlug(guild.name)
	}] : []);
}
export { listGuilds as n, searchDiscordGuildMembers as r, listDiscordGuildChannels as t };
