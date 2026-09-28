import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as extractAssistantTextForPhase, o as parseAssistantTextSignature } from "./chat-message-content-D14VlZZc.mjs";
import { o as sanitizeAssistantFinalAnswerText, s as sanitizeAssistantVisibleText } from "./assistant-visible-text-CVgfl6Gk.mjs";
//#region src/shared/assistant-answer-text.ts
function isAssistantTextContentBlockType(value) {
	return value === "text" || value === "input_text" || value === "output_text";
}
/** Selects canonical final-answer bytes before channel reply directives are parsed. */
function resolveRawAssistantAnswerText(message) {
	const lastAssistant = asOptionalRecord(message);
	if (!lastAssistant) return "";
	const finalAnswerText = extractAssistantTextForPhase(lastAssistant, {
		phase: "final_answer",
		sanitizeText: sanitizeAssistantFinalAnswerText
	});
	if (finalAnswerText) return normalizeOptionalString(finalAnswerText) ?? "";
	if (Array.isArray(lastAssistant.content)) {
		if (!lastAssistant.content.some((block) => {
			const record = asOptionalRecord(block);
			return record !== void 0 && isAssistantTextContentBlockType(record.type) && Boolean(parseAssistantTextSignature(record)?.phase);
		})) {
			const signedUnphasedParts = lastAssistant.content.map((block) => {
				const record = asOptionalRecord(block);
				if (!record) return null;
				const signature = parseAssistantTextSignature(record);
				if (!isAssistantTextContentBlockType(record.type) || typeof record.text !== "string" || !signature?.id || signature.phase) return null;
				const text = sanitizeAssistantFinalAnswerText(record.text);
				return text.trim() ? text : null;
			}).filter((value) => typeof value === "string");
			if (signedUnphasedParts.length) return normalizeOptionalString(signedUnphasedParts.join("\n")) ?? "";
		}
	}
	return normalizeOptionalString(extractAssistantTextForPhase(lastAssistant, { sanitizeText: sanitizeAssistantVisibleText })) ?? "";
}
//#endregion
export { resolveRawAssistantAnswerText as t };
