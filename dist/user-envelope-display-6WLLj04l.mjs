import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-CredJWX1.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
//#region src/shared/chat-envelope.ts
const ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
const ENVELOPE_CHANNELS = [
	"WebChat",
	"WhatsApp",
	"Telegram",
	"Signal",
	"Slack",
	"Discord",
	"Google Chat",
	"iMessage",
	"Teams",
	"Matrix",
	"Zalo",
	"Zalo Personal"
];
function looksLikeEnvelopeHeader(header) {
	if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) return true;
	if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) return true;
	return ENVELOPE_CHANNELS.some((label) => header.startsWith(`${label} `));
}
/** Removes recognized channel/timestamp prefixes while preserving user-authored bracket text. */
function stripEnvelope(text) {
	const match = text.match(ENVELOPE_PREFIX);
	if (!match) return text;
	if (!looksLikeEnvelopeHeader(match[1] ?? "")) return text;
	return text.slice(match[0].length);
}
//#endregion
//#region src/shared/text/message-id-hints.ts
const MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
/** Removes standalone message-id hint lines without touching inline user mentions. */
function stripMessageIdHints(text) {
	if (!/\[message_id:/i.test(text)) return text;
	const normalized = text.replace(/\r\n/g, "\n");
	const lines = normalized.split("\n");
	let offset = 0;
	let regions;
	const filtered = lines.filter((line) => {
		const markerOffset = line.search(/\[message_id:/i);
		const shouldRemove = markerOffset >= 0 && MESSAGE_ID_LINE.test(line) && !isInsideCode(offset + markerOffset, regions ??= findCodeRegions(normalized));
		offset += line.length + 1;
		return !shouldRemove;
	});
	return filtered.length === lines.length ? text : filtered.join("\n");
}
//#endregion
//#region src/auto-reply/reply/user-envelope-display.ts
/** Removes user-envelope and message-id hints from display text. */
function stripUserEnvelopeForDisplay(text) {
	return stripMessageIdHints(stripEnvelope(stripInternalMetadataForDisplay(text)));
}
//#endregion
export { stripEnvelope as n, stripUserEnvelopeForDisplay as t };
