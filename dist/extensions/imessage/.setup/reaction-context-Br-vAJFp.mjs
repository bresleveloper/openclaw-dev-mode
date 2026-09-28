//#region extensions/imessage/src/message-guid.ts
/** Strip the `p:<n>/` part prefix Messages puts on some GUIDs so keys match. */
function normalizeIMessageGuid(value) {
	return value.trim().replace(/^p:\d+\//iu, "");
}
//#endregion
//#region extensions/imessage/src/monitor/reaction-context.ts
const TAPBACK_TEXT_PATTERNS = [
	{
		prefix: "loved",
		action: "added",
		emoji: "❤️"
	},
	{
		prefix: "liked",
		action: "added",
		emoji: "👍"
	},
	{
		prefix: "disliked",
		action: "added",
		emoji: "👎"
	},
	{
		prefix: "laughed at",
		action: "added",
		emoji: "😂"
	},
	{
		prefix: "emphasized",
		action: "added",
		emoji: "‼️"
	},
	{
		prefix: "questioned",
		action: "added",
		emoji: "❓"
	},
	{
		prefix: "removed a heart from",
		action: "removed",
		emoji: "❤️"
	},
	{
		prefix: "removed a like from",
		action: "removed",
		emoji: "👍"
	},
	{
		prefix: "removed a dislike from",
		action: "removed",
		emoji: "👎"
	},
	{
		prefix: "removed a laugh from",
		action: "removed",
		emoji: "😂"
	},
	{
		prefix: "removed an emphasis from",
		action: "removed",
		emoji: "‼️"
	},
	{
		prefix: "removed a question from",
		action: "removed",
		emoji: "❓"
	}
];
function normalizeReactionValue(value) {
	return typeof value === "string" ? normalizeIMessageGuid(value) || void 0 : void 0;
}
function resolveReactionTargetGuidCandidates(...values) {
	const candidates = [];
	for (const value of values) {
		if (typeof value !== "string") continue;
		const raw = value.trim();
		if (!raw) continue;
		const normalized = normalizeIMessageGuid(raw);
		for (const candidate of [normalized, raw]) if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
	}
	return candidates;
}
function resolveTapbackTextContext(bodyText) {
	const lower = bodyText.toLowerCase();
	for (const pattern of TAPBACK_TEXT_PATTERNS) {
		if (!lower.startsWith(pattern.prefix)) continue;
		const afterPrefix = bodyText.slice(pattern.prefix.length).trim();
		if (!/^(?:"[\s\S]*"|“[\s\S]*”)$/u.test(afterPrefix)) continue;
		return {
			action: pattern.action,
			emoji: pattern.emoji,
			targetText: afterPrefix.slice(1, -1).trim()
		};
	}
	return null;
}
function resolveIMessageReactionContext(message, bodyText) {
	if (message.is_reaction === true || message.is_tapback === true || typeof message.associated_message_type === "number" && Number.isFinite(message.associated_message_type) && message.associated_message_type >= 2e3 && message.associated_message_type < 4e3) {
		const targetGuids = resolveReactionTargetGuidCandidates(message.reacted_to_guid, message.associated_message_guid);
		return {
			action: message.is_reaction_add === false ? "removed" : "added",
			emoji: normalizeReactionValue(message.reaction_emoji) ?? normalizeReactionValue(message.reaction_type) ?? "reaction",
			targetGuid: targetGuids[0],
			targetGuids
		};
	}
	return resolveTapbackTextContext(bodyText);
}
//#endregion
export { normalizeIMessageGuid as n, resolveIMessageReactionContext as t };
