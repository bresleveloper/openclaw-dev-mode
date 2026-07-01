import { c as stripLeadingSilentToken, i as isSilentReplyPayloadText, l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-Zsy11rTo.js";
import { S as stripInternalMetadataForDisplay } from "./session-utils.fs-CuEupzWa.js";
//#region src/auto-reply/reply/pending-final-delivery.ts
/** Sanitizes pending final delivery text before channel-visible output. */
/** Sanitizes final pending-delivery text and removes silent control tokens. */
function sanitizePendingFinalDeliveryText(text) {
	let stripped = stripInternalMetadataForDisplay(text).trim();
	if (isSilentReplyPayloadText(stripped, "NO_REPLY")) return "";
	if (stripped && !isSilentReplyText(stripped, "NO_REPLY")) {
		const hasLeadingSilentToken = startsWithSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken) stripped = stripLeadingSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken || stripped.toLowerCase().includes("NO_REPLY".toLowerCase())) stripped = stripSilentToken(stripped, SILENT_REPLY_TOKEN);
	}
	if (!stripped.trim()) return "";
	return isSilentReplyPayloadText(stripped, "NO_REPLY") ? "" : stripped.trim();
}
//#endregion
export { sanitizePendingFinalDeliveryText as t };
