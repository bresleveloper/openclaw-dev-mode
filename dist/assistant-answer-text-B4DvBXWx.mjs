import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as extractAssistantTextForPhase, o as parseAssistantTextSignature, s as readAssistantTextBlocksForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { o as sanitizeAssistantFinalAnswerText, s as sanitizeAssistantVisibleText } from "./assistant-visible-text-DZwixI8b.mjs";
//#region src/shared/assistant-answer-text.ts
/** Selects canonical final-answer bytes before channel reply directives are parsed. */
function resolveRawAssistantAnswerText(message) {
	const lastAssistant = asOptionalRecord(message);
	if (!lastAssistant) return "";
	const finalAnswerText = extractAssistantTextForPhase(lastAssistant, {
		phase: "final_answer",
		sanitizeText: sanitizeAssistantFinalAnswerText
	});
	if (finalAnswerText) return normalizeOptionalString(finalAnswerText) ?? "";
	const signedUnphasedParts = readAssistantTextBlocksForPhase({ content: lastAssistant.content }).filter((block) => parseAssistantTextSignature(block)?.id).map((block) => sanitizeAssistantFinalAnswerText(block.text)).filter((text) => text.trim());
	if (signedUnphasedParts.length) return normalizeOptionalString(signedUnphasedParts.join("\n")) ?? "";
	return normalizeOptionalString(extractAssistantTextForPhase(lastAssistant, { sanitizeText: sanitizeAssistantVisibleText })) ?? "";
}
//#endregion
export { resolveRawAssistantAnswerText as t };
