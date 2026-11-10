import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { t as flattenMarkdownToPlainText } from "./markdown-plain-text-D0Mjik_o.mjs";
import { n as projectAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { t as stripEnvelope } from "./chat-envelope-J_kChd5G.mjs";
import { S as isSuppressedControlReplyText, g as stripAssistantMediaDirectivesForDisplay, v as takeAssistantManagedMediaUrlsForDisplay } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
//#region src/gateway/session-display-projection.ts
const SESSION_LAST_MESSAGE_PREVIEW_DEFAULT_CHARS = 240;
const SESSION_DISPLAY_PROJECTION_MAX_CHARS = 800;
function extractUserText(message) {
	if (typeof message.content === "string") return message.content;
	if (Array.isArray(message.content)) {
		const parts = message.content.flatMap((block) => {
			const entry = asOptionalRecord(block);
			if (!entry) return [];
			return (entry.type === "text" || entry.type === "input_text") && typeof entry.text === "string" ? [entry.text] : [];
		});
		if (parts.length > 0) return parts.join("\n");
	}
	return typeof message.text === "string" ? message.text : void 0;
}
/** Projects text after model-context selection, or applies ordinary display visibility. */
function projectSessionDisplayMessage(message, options = {}) {
	const entry = asOptionalRecord(message);
	if (!entry || options.view !== "model-context" && entry.display === false) return null;
	const role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
	if (role !== "user" && role !== "assistant") return null;
	const projectedEntry = role === "assistant" && options.view !== "model-context" ? projectAssistantDisplayContent({
		...entry,
		role
	}) : entry;
	let text = role === "assistant" ? extractAssistantPhaseText(projectedEntry) : extractUserText(entry);
	if (text && role === "assistant" && options.view !== "model-context") text = stripAssistantMediaDirectivesForDisplay(text, takeAssistantManagedMediaUrlsForDisplay(projectedEntry, role).urls);
	text = text?.trim();
	if (!text || role === "assistant" && isSuppressedControlReplyText(text)) return null;
	if (role === "user") text = stripEnvelope(text).trim();
	if (options.flattenMarkdown) text = flattenMarkdownToPlainText(text);
	if (!text) return null;
	const requestedMaxChars = options.maxChars ?? SESSION_LAST_MESSAGE_PREVIEW_DEFAULT_CHARS;
	const limit = Math.min(SESSION_DISPLAY_PROJECTION_MAX_CHARS, Math.max(20, Math.floor(requestedMaxChars)));
	return {
		role,
		text: text.length <= limit ? text : `${truncateUtf16Safe(text, limit - 3)}...`
	};
}
function buildSessionPreviewItems(messages, maxItems, maxChars, view = "display") {
	const items = [];
	for (let index = messages.length - 1; index >= 0 && items.length < maxItems; index -= 1) {
		const projected = projectSessionDisplayMessage(messages[index], {
			maxChars,
			view
		});
		if (!projected) continue;
		items.push(projected);
	}
	return items.toReversed();
}
//#endregion
export { projectSessionDisplayMessage as n, buildSessionPreviewItems as t };
