import { S as formatDiscordUserTag } from "./allow-list-vxkG9_JD.mjs";
import { t as discord_exports } from "./discord-9gysrhzp.mjs";
//#region extensions/discord/src/monitor/system-events.ts
const SYSTEM_EVENT_ACTIONS = /* @__PURE__ */ new Map([
	[discord_exports.MessageType.ChannelPinnedMessage, "pinned a message"],
	[discord_exports.MessageType.RecipientAdd, "added a recipient"],
	[discord_exports.MessageType.RecipientRemove, "removed a recipient"],
	[discord_exports.MessageType.UserJoin, "user joined"],
	[discord_exports.MessageType.GuildBoost, "boosted the server"],
	[discord_exports.MessageType.GuildBoostTier1, "boosted the server (Tier 1 reached)"],
	[discord_exports.MessageType.GuildBoostTier2, "boosted the server (Tier 2 reached)"],
	[discord_exports.MessageType.GuildBoostTier3, "boosted the server (Tier 3 reached)"],
	[discord_exports.MessageType.ThreadCreated, "created a thread"],
	[discord_exports.MessageType.AutoModerationAction, "auto moderation action"],
	[discord_exports.MessageType.GuildIncidentAlertModeEnabled, "raid protection enabled"],
	[discord_exports.MessageType.GuildIncidentAlertModeDisabled, "raid protection disabled"],
	[discord_exports.MessageType.GuildIncidentReportRaid, "raid reported"],
	[discord_exports.MessageType.GuildIncidentReportFalseAlarm, "raid report marked false alarm"],
	[discord_exports.MessageType.StageStart, "stage started"],
	[discord_exports.MessageType.StageEnd, "stage ended"],
	[discord_exports.MessageType.StageSpeaker, "stage speaker updated"],
	[discord_exports.MessageType.StageTopic, "stage topic updated"],
	[discord_exports.MessageType.PollResult, "poll results posted"],
	[discord_exports.MessageType.PurchaseNotification, "purchase notification"]
]);
function resolveDiscordSystemEvent(message, location) {
	const action = message.type === void 0 ? void 0 : SYSTEM_EVENT_ACTIONS.get(message.type);
	if (!action) return null;
	const authorLabel = message.author ? formatDiscordUserTag(message.author) : "";
	return `Discord system: ${authorLabel ? `${authorLabel} ` : ""}${action} in ${location}`;
}
//#endregion
export { resolveDiscordSystemEvent };
