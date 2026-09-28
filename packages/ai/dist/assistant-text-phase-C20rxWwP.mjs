import { randomUUID } from "node:crypto";
//#region packages/ai/src/utils/assistant-text-phase.ts
const EMPTY_ASSISTANT_TEXT_BLOCK_SET = /* @__PURE__ */ new Set();
function isAssistantTextPhaseBlock(block) {
	if (!block || typeof block !== "object") return false;
	const record = block;
	return record.type === "text" && typeof record.text === "string";
}
function encodeAssistantTextSignatureV1(id, phase) {
	return JSON.stringify({
		v: 1,
		id,
		...phase ? { phase } : {}
	});
}
function tagUnphasedText(content, phase, idPrefix) {
	const textBlocks = content.filter(isAssistantTextPhaseBlock);
	let phaseIndex = textBlocks.filter((block) => block.textSignature !== void 0).length;
	const tagged = /* @__PURE__ */ new Map();
	for (const block of textBlocks) {
		if (block.text.trim().length === 0 || block.textSignature !== void 0) continue;
		const signature = encodeAssistantTextSignatureV1(`${idPrefix}-${phaseIndex}-${randomUUID().replaceAll("-", "").slice(0, 24)}`, phase);
		block.textSignature = signature;
		tagged.set(block, signature);
		phaseIndex += 1;
	}
	return tagged;
}
/** Tags unphased narration before a tool-call event becomes consumer-visible. */
function tagPendingCommentaryText(content) {
	return tagUnphasedText(content, "commentary", "commentary");
}
/** Records the confirmed final-answer boundary after reasoning resumes. */
function tagInterruptedTextPhases(content, interruptedText, preservedVisibleText = EMPTY_ASSISTANT_TEXT_BLOCK_SET) {
	const interruptedTextIndex = content.indexOf(interruptedText);
	if (interruptedTextIndex === -1) return;
	const finalAnswerIndex = content.findIndex((block, index) => index > interruptedTextIndex && isAssistantTextPhaseBlock(block) && block.text.trim().length > 0);
	if (finalAnswerIndex === -1) return;
	tagUnphasedText(content.slice(0, finalAnswerIndex).filter((block) => !preservedVisibleText.has(block)), "commentary", "commentary");
	tagUnphasedText(content.filter((block, index) => index >= finalAnswerIndex || preservedVisibleText.has(block)), "final_answer", "final-answer");
}
/** Prevents unresolved completion text from becoming a fallback answer after stream failure. */
function tagUnresolvedTextAsCommentary(message) {
	if (message.openclawDelivery?.textPhaseRequiresTerminal) tagUnphasedText(message.content, "commentary", "commentary");
}
/** Rolls back only the exact provisional signatures created by this transport turn. */
function clearPendingCommentaryText(tags) {
	for (const [block, signature] of tags) if (block.textSignature === signature) delete block.textSignature;
	tags.clear();
}
function rememberPendingCommentaryTags(target, tagged) {
	for (const [block, signature] of tagged) target.set(block, signature);
}
//#endregion
export { tagUnresolvedTextAsCommentary as a, tagPendingCommentaryText as i, rememberPendingCommentaryTags as n, tagInterruptedTextPhases as r, clearPendingCommentaryText as t };
