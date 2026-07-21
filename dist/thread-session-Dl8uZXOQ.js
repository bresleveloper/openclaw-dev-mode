import { h as resolveThreadSessionKeys } from "./session-key-VWT_xzM9.js";
import "./routing-D2F-kIi9.js";
//#region extensions/msteams/src/inbound.ts
/**
* Decode common HTML entities to plain text.
*/
function decodeHtmlEntities(html) {
	return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}
/**
* Strip HTML tags, preserving text content.
*/
function htmlToPlainText(html) {
	return decodeHtmlEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}
/**
* Extract quote info from MS Teams HTML reply attachments.
* Teams wraps quoted content in a blockquote with itemtype="http://schema.skype.com/Reply".
*/
function extractMSTeamsQuoteInfo(attachments) {
	for (const att of attachments) {
		let content = "";
		if (typeof att.content === "string") content = att.content;
		else if (typeof att.content === "object" && att.content !== null) {
			const record = att.content;
			content = typeof record.text === "string" ? record.text : typeof record.body === "string" ? record.body : "";
		}
		if (!content) continue;
		if (!content.includes("http://schema.skype.com/Reply")) continue;
		const senderMatch = /<strong[^>]*itemprop=["']mri["'][^>]*>(.*?)<\/strong>/i.exec(content);
		const sender = senderMatch?.[1] ? htmlToPlainText(senderMatch[1]) : void 0;
		const bodyMatch = /<p[^>]*itemprop=["']copy["'][^>]*>(.*?)<\/p>/is.exec(content);
		const body = bodyMatch?.[1] ? htmlToPlainText(bodyMatch[1]) : void 0;
		if (body) return {
			sender: sender ?? "unknown",
			body
		};
	}
}
function normalizeMSTeamsConversationId(raw) {
	return raw.split(";")[0] ?? raw;
}
function extractMSTeamsConversationMessageId(raw) {
	if (!raw) return;
	return (/(?:^|;)messageid=([^;]+)/i.exec(raw)?.[1]?.trim() ?? "") || void 0;
}
function parseMSTeamsActivityTimestamp(value) {
	if (!value) return;
	if (value instanceof Date) return value;
	if (typeof value !== "string") return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date;
}
function stripMSTeamsMentionTags(text) {
	return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}
/**
* Bot Framework uses 'a:xxx' conversation IDs for personal chats, but Graph API
* requires the '19:{userId}_{botAppId}@unq.gbl.spaces' format.
*
* This is the documented Graph API format for 1:1 chat thread IDs between a user
* and a bot/app. See Microsoft docs "Get chat between user and app":
* https://learn.microsoft.com/en-us/graph/api/userscopeteamsappinstallation-get-chat
*
* The format is only synthesized when the Bot Framework conversation ID starts with
* 'a:' (the opaque format used by BF but not recognized by Graph). If the ID already
* has the '19:...' Graph format, it is passed through unchanged.
*/
function translateMSTeamsDmConversationIdForGraph(params) {
	const { isDirectMessage, conversationId, aadObjectId, appId } = params;
	return isDirectMessage && conversationId.startsWith("a:") && aadObjectId && appId ? `19:${aadObjectId}_${appId}@unq.gbl.spaces` : conversationId;
}
function wasMSTeamsBotMentioned(activity) {
	const botId = activity.recipient?.id;
	if (!botId) return false;
	return (activity.entities ?? []).some((e) => e.type === "mention" && e.mentioned?.id === botId);
}
//#endregion
//#region extensions/msteams/src/monitor-handler/thread-session.ts
const TRAILING_THREAD_SUFFIX = /(?::thread:[^:]+)+$/;
function resolveMSTeamsRouteSessionKey(params) {
	const channelThreadId = params.isChannel ? params.conversationMessageId ?? params.replyToId ?? void 0 : void 0;
	const cleanBase = params.baseSessionKey.replace(TRAILING_THREAD_SUFFIX, "");
	return resolveThreadSessionKeys({
		baseSessionKey: cleanBase,
		threadId: channelThreadId,
		parentSessionKey: channelThreadId ? cleanBase : void 0
	}).sessionKey;
}
//#endregion
export { parseMSTeamsActivityTimestamp as a, wasMSTeamsBotMentioned as c, normalizeMSTeamsConversationId as i, extractMSTeamsConversationMessageId as n, stripMSTeamsMentionTags as o, extractMSTeamsQuoteInfo as r, translateMSTeamsDmConversationIdForGraph as s, resolveMSTeamsRouteSessionKey as t };
