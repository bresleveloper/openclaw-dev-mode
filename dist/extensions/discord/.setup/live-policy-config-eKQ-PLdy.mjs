import { i as normalizeDiscordAllowList } from "./channel-type-DKnjV1XW.mjs";
import { defineStableChannelIngressIdentity } from "openclaw/plugin-sdk/channel-ingress-runtime";
//#region extensions/discord/src/monitor/ingress-identity.ts
const DISCORD_ALLOW_LIST_PREFIXES = [
	"discord:",
	"user:",
	"pk:"
];
const DISCORD_USER_ID_KIND = "stable-id";
const DISCORD_USER_NAME_KIND = "username";
function normalizeDiscordIdEntry(entry) {
	const text = entry.trim();
	if (!text) return null;
	const maybeId = text.replace(/^<@!?/, "").replace(/>$/, "");
	if (/^\d+$/.test(maybeId)) return maybeId;
	const prefix = DISCORD_ALLOW_LIST_PREFIXES.find((entryPrefix) => text.startsWith(entryPrefix));
	if (prefix) return text.slice(prefix.length).trim() || null;
	return null;
}
function normalizeDiscordNameEntry(entry) {
	const text = entry.trim();
	if (!text || text === "*" || normalizeDiscordIdEntry(text) || /#\d{4}$/.test(text)) return null;
	const nameSlug = normalizeDiscordAllowList([text], DISCORD_ALLOW_LIST_PREFIXES)?.names.values().next().value;
	return typeof nameSlug === "string" && nameSlug ? nameSlug : null;
}
function normalizeDiscordTagEntry(entry) {
	const text = entry.trim();
	return /#\d{4}$/.test(text) ? normalizeDiscordNameSubject(text) : null;
}
function normalizeDiscordNameSubject(value) {
	const nameSlug = normalizeDiscordAllowList([value], DISCORD_ALLOW_LIST_PREFIXES)?.names.values().next().value;
	return typeof nameSlug === "string" && nameSlug ? nameSlug : null;
}
const discordIngressIdentity = defineStableChannelIngressIdentity({
	resolveParticipant: (subject) => {
		const kind = subject.aliases?.participantKind;
		const id = subject.stableId;
		return typeof id === "string" && id && (kind === "user" || kind === "bot" || kind === "pluralkit-member") ? {
			domain: kind === "pluralkit-member" ? "pluralkit" : "discord",
			idKind: kind,
			id
		} : void 0;
	},
	key: "discordUserId",
	kind: DISCORD_USER_ID_KIND,
	authentication: "verified",
	normalizeEntry: normalizeDiscordIdEntry,
	normalizeSubject: (value) => value.trim() || null,
	sensitivity: "pii",
	aliases: [["discordUserName", normalizeDiscordNameEntry], ["discordUserTag", normalizeDiscordTagEntry]].map(([key, normalizeEntry]) => ({
		key,
		kind: DISCORD_USER_NAME_KIND,
		normalizeEntry,
		normalizeSubject: normalizeDiscordNameSubject,
		authentication: "mutable",
		sensitivity: "pii"
	}))
});
//#endregion
//#region extensions/discord/src/live-policy-config.ts
/** Account policy consumed at inbound admission, without replacing the transport. */
function selectDiscordLivePolicyConfig(config) {
	return {
		groupPolicy: config.groupPolicy,
		dmPolicy: config.dmPolicy,
		allowFrom: config.allowFrom,
		dm: config.dm,
		guilds: config.guilds,
		allowBots: config.allowBots,
		dangerouslyAllowNameMatching: config.dangerouslyAllowNameMatching
	};
}
//#endregion
export { discordIngressIdentity as n, selectDiscordLivePolicyConfig as t };
