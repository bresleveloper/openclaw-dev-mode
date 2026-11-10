import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { r as fetchDiscord, t as DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS } from "./api-DqmMUZau.mjs";
import { i as listGuilds, n as parseDiscordAllowlistInput, r as resolveDiscordAllowlistToken, t as filterDiscordGuilds } from "./resolve-allowlist-common-cIjtqh2F.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/resolve-users.ts
var resolve_users_exports = /* @__PURE__ */ __exportAll({ resolveDiscordUserAllowlist: () => resolveDiscordUserAllowlist });
function scoreDiscordMember(member, query) {
	const q = query.toLowerCase();
	const user = member.user;
	const candidates = [
		user.username,
		user.global_name,
		member.nick
	].map(normalizeOptionalLowercaseString).filter((value) => value !== void 0);
	return (candidates.includes(q) ? 3 : 0) + (candidates.some((value) => value.includes(q)) ? 1 : 0) + (user.bot ? 0 : 1);
}
async function resolveDiscordUserAllowlist(params) {
	const token = resolveDiscordAllowlistToken(params.token);
	if (!token) return params.entries.map((input) => ({
		input,
		resolved: false
	}));
	const fetcher = params.fetcher ?? fetch;
	let guilds;
	const getGuilds = () => guilds ??= listGuilds(token, fetcher, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
	const results = [];
	for (const input of params.entries) {
		const parsed = parseDiscordAllowlistInput(input, "user");
		if (parsed.id) {
			results.push({
				input,
				resolved: true,
				id: parsed.id
			});
			continue;
		}
		const query = parsed.name?.trim();
		if (!query) {
			results.push({
				input,
				resolved: false
			});
			continue;
		}
		const allGuilds = await getGuilds();
		const guildList = filterDiscordGuilds(allGuilds, {
			guildId: parsed.guildId,
			guildName: parsed.guild
		});
		let best = null;
		let matches = 0;
		for (const guild of guildList) {
			const paramsObj = new URLSearchParams({
				query,
				limit: "25"
			});
			const members = await fetchDiscord(`/guilds/${guild.id}/members/search?${paramsObj.toString()}`, token, fetcher, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
			for (const member of members) {
				const score = scoreDiscordMember(member, query);
				if (score === 0) continue;
				matches += 1;
				if (!best || score > best.score) best = {
					member,
					guild,
					score
				};
			}
		}
		if (best) {
			const user = best.member.user;
			const name = normalizeOptionalString(best.member.nick) ?? normalizeOptionalString(user.global_name) ?? normalizeOptionalString(user.username);
			results.push({
				input,
				resolved: true,
				id: user.id,
				name,
				guildId: best.guild.id,
				guildName: best.guild.name,
				note: matches > 1 ? "multiple matches; chose best" : void 0
			});
		} else results.push({
			input,
			resolved: false
		});
	}
	return results;
}
//#endregion
export { resolve_users_exports as n, resolveDiscordUserAllowlist as t };
