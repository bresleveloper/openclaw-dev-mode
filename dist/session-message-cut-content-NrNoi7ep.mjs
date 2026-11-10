import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { t as flattenMarkdownToPlainText } from "./markdown-plain-text-D0Mjik_o.mjs";
import { t as projectTranscriptNavigationFields } from "./transcript-navigation-fields-BLtx25WG.mjs";
//#region src/config/sessions/session-message-cut-content.ts
const BRANCH_HEADLINE_MAX_CHARS = 120;
function projectSessionBranchEntry(event, seq) {
	const record = asOptionalRecord(event);
	if (!record) return;
	const role = asOptionalRecord(record.message)?.role;
	const entry = {
		seq,
		headlineCandidate: record.type === "message" && (role === "user" || role === "assistant"),
		...projectTranscriptNavigationFields(record)
	};
	if (typeof record.timestamp === "string" && record.timestamp.trim()) entry.timestamp = record.timestamp;
	return entry;
}
function extractSessionBranchHeadline(event) {
	const record = asOptionalRecord(event);
	const headline = record?.type === "message" ? extractHeadlineText(record.message) : void 0;
	return headline === void 0 ? void 0 : truncateBranchHeadline(headline);
}
function extractHeadlineText(messageValue) {
	const message = asOptionalRecord(messageValue);
	if (message?.role !== "user" && message?.role !== "assistant") return;
	const text = message.role === "assistant" ? extractAssistantPhaseText(message) : extractEditorText(message.content ?? message.text);
	return (text ? flattenMarkdownToPlainText(text) : void 0) || void 0;
}
function truncateBranchHeadline(value) {
	const prefix = truncateCodePoints(value, BRANCH_HEADLINE_MAX_CHARS);
	return prefix.length === value.length ? prefix : `${truncateCodePoints(prefix, 119)}…`;
}
function extractEditorText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" ? [record.text] : [];
	}).join("") || void 0;
}
//#endregion
export { extractSessionBranchHeadline as n, projectSessionBranchEntry as r, extractEditorText as t };
