import { m as normalizeDiscordToken } from "./accounts-HE9-mj1L.mjs";
import { o as normalizeDiscordSlug } from "./allow-list-vxkG9_JD.mjs";
import { r as fetchDiscord } from "./api-DlNUkDqj.mjs";
//#region extensions/discord/src/guilds.ts
async function listGuilds(token, fetcher, options) {
	return (await fetchDiscord("/users/@me/guilds", token, fetcher, options)).filter((guild) => typeof guild.id === "string" && typeof guild.name === "string").map((guild) => ({
		id: guild.id,
		name: guild.name,
		slug: normalizeDiscordSlug(guild.name)
	}));
}
//#endregion
//#region extensions/discord/src/resolve-allowlist-common.ts
function resolveDiscordAllowlistToken(token) {
	return normalizeDiscordToken(token, "channels.discord.token");
}
function filterDiscordGuilds(guilds, params) {
	if (params.guildId) return guilds.filter((guild) => guild.id === params.guildId);
	if (params.guildName) {
		const slug = normalizeDiscordSlug(params.guildName);
		const match = slug ? guilds.find((guild) => guild.slug === slug) : void 0;
		return match ? [match] : [];
	}
	return guilds;
}
//#endregion
export { resolveDiscordAllowlistToken as n, listGuilds as r, filterDiscordGuilds as t };
