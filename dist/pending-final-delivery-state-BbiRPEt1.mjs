import { l as trimTextPreservingCode } from "./text-projection-mdP9TY8k.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-DHFPcfdZ.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-C40cs1ec.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-DM667iyR.mjs";
import { t as stripMixedSilentReplyTokens } from "./mixed-silent-reply-tokens-ZMHcEo3k.mjs";
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
	stripped = stripMixedSilentReplyTokens(stripped) ?? stripped;
	return !stripped.trim() || isSilentReplyPayloadText(stripped, "NO_REPLY") ? "" : trimTextPreservingCode(stripped);
}
//#endregion
export { classifyHeartbeatPendingFinalDelivery as n, sanitizePendingFinalDeliveryText as r, PENDING_FINAL_DELIVERY_CLEAR_PATCH as t };
