import "./nested-tool-activity-CFIuxE4G.mjs";
import { n as extractAssistantTextForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-Bv6mP5pg.mjs";
import { A as sanitizeUserFacingText, n as renderUserFacingText } from "./user-facing-text-DC1sCo4O.mjs";
//#region src/agents/tools/chat-history-text.ts
function stripToolMessages(messages) {
	return messages.filter((msg) => {
		if (!msg || typeof msg !== "object") return true;
		const { role, customType } = msg;
		return role !== "toolResult" && role !== "tool" && !(role === "custom" && customType === "openclaw.nested-tool.v1");
	});
}
function sanitizeTextContent(text) {
	return sanitizeAssistantVisibleTextWithProfile(text, "history");
}
function extractStoredAssistantText(message) {
	if (!message || typeof message !== "object") return;
	if (message.role !== "assistant") return;
	const joined = extractAssistantTextForPhase(message, {
		phase: "final_answer",
		sanitizeText: sanitizeTextContent,
		joinWith: ""
	}) ?? extractAssistantTextForPhase(message, {
		sanitizeText: sanitizeTextContent,
		joinWith: ""
	});
	const errorContext = message.stopReason === "error";
	return joined ? errorContext ? renderUserFacingText(joined, { errorContext: true }) : sanitizeUserFacingText(joined) : void 0;
}
//#endregion
export { stripToolMessages as n, extractStoredAssistantText as t };
