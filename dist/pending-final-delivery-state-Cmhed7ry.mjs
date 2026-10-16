import { a as isSilentReplyPayloadText, c as startsWithSilentToken, l as stripLeadingSilentToken, r as SILENT_REPLY_TOKEN, s as isSilentReplyText, u as stripSilentToken } from "./tokens-D4ghQG_g.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-BjLIgeQc.mjs";
import { c as trimTextPreservingCode } from "./text-projection-BTFPDH-Z.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-BtEixrp8.mjs";
//#region src/auto-reply/reply/pending-final-delivery-state.ts
const PENDING_FINAL_DELIVERY_CLEAR_PATCH = { pendingFinalDelivery: void 0 };
function classifyHeartbeatPendingFinalDelivery(text, ackMaxChars) {
	const stripped = stripHeartbeatToken(text, {
		mode: "heartbeat",
		maxAckChars: ackMaxChars
	});
	return {
		shouldClear: stripped.shouldSkip,
		replayText: stripped.didStrip && stripped.text ? stripped.text : text
	};
}
/** Sanitizes pending final delivery text before channel-visible output. */
function sanitizePendingFinalDeliveryText(text) {
	let stripped = trimTextPreservingCode(stripInternalMetadataForDisplay(text));
	if (isSilentReplyPayloadText(stripped, "NO_REPLY")) return "";
	if (stripped && !isSilentReplyText(stripped, "NO_REPLY")) {
		const hasLeadingSilentToken = startsWithSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken) stripped = stripLeadingSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken || stripped.toLowerCase().includes("NO_REPLY".toLowerCase())) stripped = stripSilentToken(stripped, SILENT_REPLY_TOKEN);
	}
	if (!stripped.trim()) return "";
	return isSilentReplyPayloadText(stripped, "NO_REPLY") ? "" : trimTextPreservingCode(stripped);
}
//#endregion
export { classifyHeartbeatPendingFinalDelivery as n, sanitizePendingFinalDeliveryText as r, PENDING_FINAL_DELIVERY_CLEAR_PATCH as t };
