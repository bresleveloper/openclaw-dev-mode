import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText, t as HEARTBEAT_TOKEN } from "./tokens-BTKQYTUd.mjs";
//#region src/agents/tools/sessions-send-tokens.ts
/**
* sessions_send sentinel tokens.
*
* Defines non-deliverable reply markers used by sessions_send and subagent completion delivery.
*/
/** Suppresses a subagent completion announcement. */
const ANNOUNCE_SKIP_TOKEN = "ANNOUNCE_SKIP";
/** Suppresses a direct reply delivery. */
const REPLY_SKIP_TOKEN = "REPLY_SKIP";
const NON_DELIVERABLE_REPLY_TOKENS = [
	ANNOUNCE_SKIP_TOKEN,
	REPLY_SKIP_TOKEN,
	SILENT_REPLY_TOKEN,
	HEARTBEAT_TOKEN
];
/** Returns true when text is exactly the announce-skip sentinel. */
function isAnnounceSkip(text) {
	return (text ?? "").trim() === ANNOUNCE_SKIP_TOKEN;
}
/** Returns true when text is any non-deliverable sessions reply sentinel. */
function isNonDeliverableSessionsReply(text) {
	return NON_DELIVERABLE_REPLY_TOKENS.some((token) => isSilentReplyText(text, token));
}
/** Selects a deliverable reply while allowing NO_REPLY to use captured fallback output. */
function selectDeliverableSessionsReply(primary, fallback) {
	const primaryReply = primary?.trim();
	if (primaryReply && !isNonDeliverableSessionsReply(primaryReply)) return primaryReply;
	if (primaryReply && !isSilentReplyText(primaryReply, "NO_REPLY")) return;
	const fallbackReply = fallback?.trim();
	return fallbackReply && !isNonDeliverableSessionsReply(fallbackReply) ? fallbackReply : void 0;
}
//#endregion
export { selectDeliverableSessionsReply as a, isNonDeliverableSessionsReply as i, REPLY_SKIP_TOKEN as n, isAnnounceSkip as r, ANNOUNCE_SKIP_TOKEN as t };
