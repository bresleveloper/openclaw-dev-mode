import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-RR5snA6Y.mjs";
//#region src/channels/bundled-channel-ids.generated.ts
const GENERATED_BUNDLED_CHANNEL_IDS = [
	{
		channelId: "a2a",
		order: 75,
		label: "A2A"
	},
	{
		channelId: "buzz",
		order: 56,
		label: "Buzz"
	},
	{
		channelId: "clickclack",
		order: 85,
		label: "ClickClack"
	},
	{
		channelId: "discord",
		label: "Discord"
	},
	{
		channelId: "feishu",
		aliases: ["lark"],
		order: 35,
		label: "Feishu"
	},
	{
		channelId: "googlechat",
		aliases: ["gchat", "google-chat"],
		order: 55,
		label: "Google Chat"
	},
	{
		channelId: "imessage",
		aliases: ["imsg"],
		label: "iMessage"
	},
	{
		channelId: "irc",
		aliases: ["internet-relay-chat"],
		label: "IRC"
	},
	{
		channelId: "line",
		order: 75,
		label: "LINE"
	},
	{
		channelId: "matrix",
		order: 70,
		label: "Matrix"
	},
	{
		channelId: "mattermost",
		order: 65,
		label: "Mattermost"
	},
	{
		channelId: "msteams",
		aliases: ["teams"],
		order: 60,
		label: "Microsoft Teams"
	},
	{
		channelId: "nextcloud-talk",
		aliases: ["nc", "nc-talk"],
		order: 65,
		label: "Nextcloud Talk"
	},
	{
		channelId: "nostr",
		order: 55,
		label: "Nostr"
	},
	{
		channelId: "qa-channel",
		order: 999,
		configurable: false,
		label: "QA Channel"
	},
	{
		channelId: "raft",
		order: 72,
		label: "Raft"
	},
	{
		channelId: "reef",
		label: "Reef"
	},
	{
		channelId: "signal",
		label: "Signal"
	},
	{
		channelId: "slack",
		label: "Slack"
	},
	{
		channelId: "sms",
		order: 88,
		label: "SMS"
	},
	{
		channelId: "synology-chat",
		order: 90,
		label: "Synology Chat"
	},
	{
		channelId: "telegram",
		label: "Telegram"
	},
	{
		channelId: "tlon",
		order: 90,
		label: "Tlon"
	},
	{
		channelId: "twitch",
		aliases: ["twitch-chat"],
		label: "Twitch"
	},
	{
		channelId: "whatsapp",
		label: "WhatsApp"
	},
	{
		channelId: "zalo",
		aliases: ["zl"],
		order: 80,
		label: "Zalo"
	},
	{
		channelId: "zalouser",
		aliases: ["zlu"],
		order: 85,
		label: "Zalo Personal"
	}
];
//#endregion
//#region src/channels/ids.ts
/**
* Built-in chat channel ids and aliases.
*
* Derives canonical ids from generated bundled channel metadata with runtime catalog fallback.
*/
function listBundledChatChannelEntries() {
	return GENERATED_BUNDLED_CHANNEL_IDS.filter((entry) => entry.configurable !== false).map((entry) => ({
		id: normalizeOptionalLowercaseString(entry.channelId) ?? entry.channelId,
		aliases: entry.aliases ?? [],
		label: entry.label?.trim() || void 0,
		order: entry.order ?? Number.MAX_SAFE_INTEGER
	})).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id, "en", { sensitivity: "base" }));
}
const BUNDLED_CHAT_CHANNEL_ENTRIES = Object.freeze(listBundledChatChannelEntries());
const CHAT_CHANNEL_ID_SET = new Set(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
/**
* Stable built-in channel order derived from generated bundled channel metadata.
*/
const CHAT_CHANNEL_ORDER = Object.freeze(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
/**
* Alias retained for callers that still refer to chat channel ordering as channel ids.
*/
const CHANNEL_IDS = CHAT_CHANNEL_ORDER;
/**
* Maps configured built-in channel aliases to canonical chat channel ids.
*/
const CHAT_CHANNEL_ALIASES = Object.freeze(Object.fromEntries(BUNDLED_CHAT_CHANNEL_ENTRIES.flatMap((entry) => entry.aliases.map((alias) => [alias, entry.id]))));
/** Finds the generated operator-facing label for a built-in channel id or alias. */
function findChatChannelLabel(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return;
	const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
	return BUNDLED_CHAT_CHANNEL_ENTRIES.find((entry) => entry.id === resolved)?.label;
}
function normalizeRuntimeBundledChatChannelId(normalized) {
	for (const entry of listBundledChannelCatalogEntries()) if (entry.id === normalized || entry.aliases.includes(normalized)) return entry.id;
	return null;
}
/**
* Normalizes a raw chat channel id or alias to a known canonical built-in channel id.
*/
function normalizeChatChannelId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
	return CHAT_CHANNEL_ID_SET.has(resolved) ? resolved : normalizeRuntimeBundledChatChannelId(normalized);
}
//#endregion
export { normalizeChatChannelId as i, CHAT_CHANNEL_ORDER as n, findChatChannelLabel as r, CHANNEL_IDS as t };
