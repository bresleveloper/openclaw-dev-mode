import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/googlechat/src/approval-card-text.ts
const MAX_TEXT_PARAGRAPH_CHARS = 1800;
function escapeGoogleChatApprovalCardText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function buildGoogleChatApprovalTextWidget(text, format = "text") {
	const truncated = text.length <= MAX_TEXT_PARAGRAPH_CHARS ? text : `${truncateUtf16Safe(text, 1797)}...`;
	return { textParagraph: { text: format === "html" ? truncated : escapeGoogleChatApprovalCardText(truncated) } };
}
//#endregion
export { escapeGoogleChatApprovalCardText as n, buildGoogleChatApprovalTextWidget as t };
