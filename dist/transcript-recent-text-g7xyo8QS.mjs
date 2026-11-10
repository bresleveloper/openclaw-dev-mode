import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as extractFirstTextBlock, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { c as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
//#region src/config/sessions/transcript-recent-window.ts
const normalizeTranscriptTimestamp = asFiniteNumber;
function isWithinTranscriptWindow(timestamp, options) {
	return (options.beforeTimestampMs === void 0 || timestamp === void 0 || timestamp < options.beforeTimestampMs) && (options.minTimestampMs === void 0 || timestamp === void 0 || timestamp >= options.minTimestampMs);
}
function normalizeRecentTranscriptLimit(limit) {
	return Math.max(1, Math.floor(limit ?? 10));
}
function readPreferredUpstreamUserText(message) {
	const meta = asOptionalObjectRecord(message["__openclaw"]);
	if (typeof meta?.upstreamUserText === "string") return meta.upstreamUserText.trim();
	return meta?.mirrorOrigin ? null : void 0;
}
//#endregion
//#region src/config/sessions/transcript-recent-text.ts
function extractRecentConversationText(event, options = {}) {
	const parsed = asOptionalRecord(event);
	const message = asOptionalRecord(parsed?.message);
	if (!message || message.role !== "user" && message.role !== "assistant" || options.role && message.role !== options.role) return;
	const deliveryMirror = message.openclawDeliveryMirror;
	const includeCronDirectDeliveryContext = options.includeCronDirectDeliveryContext === true && deliveryMirror !== null && typeof deliveryMirror === "object" && !Array.isArray(deliveryMirror) && "kind" in deliveryMirror && deliveryMirror.kind === "cron-direct-delivery-context";
	const sourceReply = asOptionalRecord(deliveryMirror);
	const includeTerminalSourceReply = options.includeMessageToolSourceReplies === true && sourceReply?.kind === "message-tool-source-reply" && sourceReply.final === true && typeof sourceReply.sourceTurnId === "string" && sourceReply.sourceTurnId.trim().length > 0;
	if (message.role === "assistant" && isTranscriptOnlyOpenClawAssistantMessage(message) && !includeCronDirectDeliveryContext && !includeTerminalSourceReply) return;
	const upstreamUserText = options.preferUpstreamUserText && message.role === "user" ? readPreferredUpstreamUserText(message) : void 0;
	if (upstreamUserText === null) return;
	const text = message.role === "assistant" ? extractAssistantPhaseText(message) : upstreamUserText ?? extractFirstTextBlock(message)?.trim();
	if (!text) return;
	const provenance = asOptionalRecord(message.provenance);
	const timestamp = normalizeTranscriptTimestamp(message.timestamp);
	return {
		...typeof parsed?.id === "string" && parsed.id ? { id: parsed.id } : {},
		role: message.role,
		text,
		...timestamp !== void 0 ? { timestamp } : {},
		...typeof provenance?.sourceChannel === "string" && provenance.sourceChannel.trim() ? { sourceChannel: provenance.sourceChannel.trim() } : {}
	};
}
/** Select recent text inside the caller's single transcript snapshot. */
function readRecentTranscriptConversationText(readPage, options = {}) {
	const limit = normalizeRecentTranscriptLimit(options.limit);
	const pageSize = 250;
	const recent = [];
	for (let offset = 0; recent.length < limit; offset += pageSize) {
		const page = readPage({
			maxMessages: pageSize,
			maxBytes: Number.MAX_SAFE_INTEGER,
			offset
		});
		for (const event of page.events.toReversed()) {
			const entry = extractRecentConversationText(event.event, options);
			if (entry && isWithinTranscriptWindow(entry.timestamp, options)) {
				recent.push(entry);
				if (recent.length >= limit) break;
			}
		}
		if (offset + page.scannedMessages >= page.totalMessages) break;
	}
	return recent.toReversed();
}
//#endregion
export { readRecentTranscriptConversationText as t };
