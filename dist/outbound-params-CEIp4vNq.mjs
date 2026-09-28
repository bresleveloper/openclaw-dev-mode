import { C as parseStrictNonNegativeInteger, S as parseStrictInteger } from "./number-coercion-CLj0HTDM.mjs";
import "./number-runtime-CGwowceO.mjs";
//#region extensions/telegram/src/outbound-params.ts
function parseIntegerId(value) {
	return parseStrictInteger(value);
}
function parseTelegramMessageThreadId(value) {
	return parseStrictNonNegativeInteger(value);
}
function normalizeTelegramReplyToMessageId(value) {
	if (typeof value !== "string") return parseIntegerId(value);
	const trimmed = value.trim();
	return trimmed ? parseIntegerId(trimmed) : void 0;
}
function parseTelegramReplyToMessageId(replyToId) {
	return normalizeTelegramReplyToMessageId(replyToId);
}
function parseTelegramThreadId(threadId) {
	if (threadId == null) return;
	if (typeof threadId === "number") return parseIntegerId(threadId);
	const trimmed = threadId.trim();
	if (!trimmed) return;
	const topicMatch = /^-?\d+:topic:(\d+)$/.exec(trimmed);
	if (topicMatch) return parseIntegerId(topicMatch[1]);
	const scopedMatch = /^-?\d+:(-?\d+)$/.exec(trimmed);
	return parseIntegerId(scopedMatch ? scopedMatch[1] : trimmed);
}
//#endregion
export { parseTelegramThreadId as i, parseTelegramMessageThreadId as n, parseTelegramReplyToMessageId as r, normalizeTelegramReplyToMessageId as t };
