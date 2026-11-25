import { w as isDiscordThreadChannelType } from "./allow-list-CkqpzPvP.mjs";
import { D as resolveDiscordMessageStickers } from "./transcripts-source-C3F_ErM1.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { findCodeRegions, isInsideCode } from "openclaw/plugin-sdk/text-chunking";
import { filterSupplementalContextItems } from "openclaw/plugin-sdk/security-runtime";
import { implicitMentionKindWhen, matchesMentionWithExplicit, normalizeMentionText } from "openclaw/plugin-sdk/channel-inbound";
// extensions/discord/src/monitor/message-handler.preflight-helpers.ts
const DISCORD_BOUND_THREAD_SYSTEM_PREFIXES = [
	"⚙️",
	"🤖",
	"🧰"
];
function isBoundThreadBotSystemMessage(params) {
	if (!params.isBoundThreadSession || !params.isBotAuthor) return false;
	const text = params.text?.trim();
	if (!text) return false;
	return DISCORD_BOUND_THREAD_SYSTEM_PREFIXES.some((prefix) => text.startsWith(prefix));
}
function isDiscordThreadChannelMessage(params) {
	return params.isGuildMessage && isDiscordThreadChannelType(params.channelInfo?.type);
}
function resolveDiscordMentionState(params) {
	if (params.isDirectMessage) return {
		implicitMentionKinds: [],
		wasMentioned: false
	};
	const wasMentioned = params.mentionedEveryone && (!params.authorIsBot || params.senderIsPluralKit) || matchesMentionWithExplicit({
		text: params.mentionText,
		mentionRegexes: params.mentionRegexes,
		explicit: {
			hasAnyMention: params.hasAnyMention,
			isExplicitlyMentioned: params.isExplicitlyMentioned,
			canResolveExplicit: Boolean(params.botId)
		},
		transcript: params.transcript
	});
	return {
		implicitMentionKinds: implicitMentionKindWhen("reply_to_bot", Boolean(params.botId) && Boolean(params.referencedAuthorId) && params.referencedAuthorId === params.botId),
		wasMentioned
	};
}
function hasRawDiscordUserMention(text, userId) {
	if (!userId) return false;
	const codeRegions = findCodeRegions(text);
	for (const mention of [`<@${userId}>`, `<@!${userId}>`]) {
		let index = text.indexOf(mention);
		while (index >= 0) {
			let precedingBackslashes = 0;
			for (let offset = index - 1; offset >= 0 && text[offset] === "\\"; offset -= 1) precedingBackslashes += 1;
			if (precedingBackslashes % 2 === 0 && !isInsideCode(index, codeRegions)) return true;
			index = text.indexOf(mention, index + mention.length);
		}
	}
	return false;
}
function matchesActiveDiscordMentionPatterns(text, mentionRegexes) {
	if (mentionRegexes.length === 0) return false;
	const cleaned = normalizeMentionText(text);
	const normalizedOffset = (offset) => Math.min(cleaned.length, normalizeMentionText(`${text.slice(0, offset)}\0`).length - 1);
	const codeRegions = findCodeRegions(text).map(({ start, end }) => ({
		start: normalizedOffset(start),
		end: normalizedOffset(end)
	}));
	for (const regex of mentionRegexes) for (const match of cleaned.matchAll(new RegExp(regex.source, `${regex.flags}g`))) if (!codeRegions.some(({ start, end }) => match.index < end && (match.index >= start || match.index + match[0].length > start))) return true;
	return false;
}
function shouldIgnoreBoundThreadWebhookMessage(params) {
	const webhookId = normalizeOptionalString(params.webhookId) ?? "";
	if (!webhookId) return false;
	const boundWebhookId = normalizeOptionalString(params.threadBinding?.webhookId) ?? normalizeOptionalString(params.threadBinding?.metadata?.webhookId) ?? "";
	if (boundWebhookId && webhookId === boundWebhookId) return true;
	const threadId = normalizeOptionalString(params.threadId) ?? "";
	return Boolean(threadId && params.threadBinding);
}
// extensions/discord/src/monitor/message-handler.history.ts
function createDiscordHistorySenderProvenance(params) {
	return Object.freeze({
		id: params.sender.id,
		name: params.sender.name,
		tag: params.sender.tag,
		memberRoleIds: Object.freeze([...params.memberRoleIds])
	});
}
function filterDiscordHistoryEntriesForContext(params) {
	if (params.mode === "all") return [...params.entries];
	return filterSupplementalContextItems({
		items: params.entries,
		mode: params.mode,
		kind: "history",
		isSenderAllowed: (entry) => Boolean(entry.senderProvenance) && params.isSenderAllowed(entry.senderProvenance)
	}).items;
}
function resolveDiscordHistoryMediaIds(message) {
	return [...(message.attachments ?? []).map((attachment) => `attachment:${attachment.id}`), ...resolveDiscordMessageStickers(message).map((sticker) => `sticker:${sticker.id}`)];
}
// extensions/discord/src/monitor/message-handler.preflight-runtime.ts
const loadPluralKitRuntime = createLazyRuntimeModule(() => import("./pluralkit-DcXbHTpQ.mjs").then((n) => n.n));
const loadPreflightAudioRuntime = createLazyRuntimeModule(() => import("./preflight-audio-r4BbaJxh.mjs"));
const loadSystemEventsRuntime = createLazyRuntimeModule(() => import("./system-events-DB6p2H4l.mjs"));
const loadDiscordThreadingRuntime = createLazyRuntimeModule(() => import("./threading-PC3IIaHd.mjs").then((n) => n.t));
// extensions/discord/src/monitor/message-handler.preflight-pluralkit.ts
async function resolveDiscordPreflightPluralKitInfo(params) {
	if (!params.config?.enabled || !params.webhookId) return null;
	try {
		const { fetchPluralKitMessageInfo } = await loadPluralKitRuntime();
		const info = await fetchPluralKitMessageInfo({
			messageId: params.message.id,
			config: params.config,
			signal: params.abortSignal
		});
		return params.abortSignal?.aborted ? null : info;
	} catch (err) {
		logVerbose(`discord: pluralkit lookup failed for ${params.message.id}: ${String(err)}`);
		return null;
	}
}
export { createDiscordHistorySenderProvenance as a, hasRawDiscordUserMention as c, matchesActiveDiscordMentionPatterns as d, resolveDiscordMentionState as f, loadSystemEventsRuntime as i, isBoundThreadBotSystemMessage as l, loadDiscordThreadingRuntime as n, filterDiscordHistoryEntriesForContext as o, shouldIgnoreBoundThreadWebhookMessage as p, loadPreflightAudioRuntime as r, resolveDiscordHistoryMediaIds as s, resolveDiscordPreflightPluralKitInfo as t, isDiscordThreadChannelMessage as u };
