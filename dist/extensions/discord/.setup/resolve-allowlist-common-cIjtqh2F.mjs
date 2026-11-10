import { h as normalizeDiscordToken } from "./accounts-ljrzXBJi.mjs";
import { o as normalizeDiscordSlug } from "./allow-list-BKqOldGy.mjs";
import { r as fetchDiscord } from "./api-DqmMUZau.mjs";
//#region extensions/discord/src/guilds.ts
async function listGuilds(token, fetcher, options) {
	return (await fetchDiscord("/users/@me/guilds", token, fetcher, options)).flatMap((guild) => typeof guild.id === "string" && typeof guild.name === "string" ? [{
		id: guild.id,
		name: guild.name,
		slug: normalizeDiscordSlug(guild.name)
	}] : []);
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
function parseDiscordAllowlistInput(raw, kind) {
	const trimmed = raw.trim();
	if (!trimmed) return {};
	const mention = trimmed.match(kind === "channel" ? /^<#(\d+)>$/ : /^<@!?(\d+)>$/);
	if (mention) return { id: mention[1] };
	const prefixed = trimmed.match(kind === "channel" ? /^(?:channel:|discord:)?(\d+)$/i : /^(?:user:|discord:)?(\d+)$/i);
	if (prefixed) return { id: prefixed[1] };
	if (kind === "channel") {
		const guildPrefix = trimmed.match(/^(?:guild:|server:)?(\d+)$/i);
		if (guildPrefix) return {
			guildId: guildPrefix[1],
			guildOnly: true
		};
	}
	const split = trimmed.includes("/") ? trimmed.split("/") : trimmed.split("#");
	if (split.length >= 2) {
		const guild = split[0]?.trim();
		const name = split.slice(1).join("#").trim();
		if (kind === "channel" && !name) return guild ? {
			guild,
			guildOnly: true
		} : {};
		if (guild && /^\d+$/.test(guild)) return kind === "channel" && /^\d+$/.test(name) ? {
			guildId: guild,
			id: name
		} : {
			guildId: guild,
			name
		};
		return {
			guild,
			name
		};
	}
	return kind === "channel" ? {
		guild: trimmed,
		guildOnly: true
	} : { name: trimmed.replace(/^@/, "") };
}
//#endregion
export { listGuilds as i, parseDiscordAllowlistInput as n, resolveDiscordAllowlistToken as r, filterDiscordGuilds as t };
