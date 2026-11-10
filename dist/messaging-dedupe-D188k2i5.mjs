import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/agents/embedded-agent-helpers/messaging-dedupe.ts
const MIN_DUPLICATE_TEXT_LENGTH = 10;
const MIN_SUBSTRING_DUPLICATE_RATIO = .5;
function normalizeTextForComparison(text) {
	return normalizeLowercaseStringOrEmpty(text).replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, "").replace(/\s+/g, " ").trim();
}
function hasTextBeyondSentTexts(tail, normalizedSentTexts) {
	let remainder = tail;
	for (const normalizedSent of normalizedSentTexts.toSorted((a, b) => b.length - a.length)) if (normalizedSent.length >= MIN_DUPLICATE_TEXT_LENGTH) remainder = remainder.replaceAll(normalizedSent, " ");
	return /[\p{L}\p{N}]/u.test(remainder);
}
function isMessagingToolDuplicateNormalized(normalized, normalizedSentTexts) {
	if (normalizedSentTexts.length === 0) return false;
	if (!normalized || normalized.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
	return normalizedSentTexts.some((normalizedSent) => {
		if (!normalizedSent || normalizedSent.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
		if (normalized.includes(normalizedSent)) {
			if (normalized.startsWith(normalizedSent) && hasTextBeyondSentTexts(normalized.slice(normalizedSent.length), normalizedSentTexts)) return false;
			return normalizedSent.length >= normalized.length * MIN_SUBSTRING_DUPLICATE_RATIO;
		}
		return normalizedSent.includes(normalized) && normalized.length >= normalizedSent.length * MIN_SUBSTRING_DUPLICATE_RATIO;
	});
}
function isMessagingToolDuplicate(text, sentTexts) {
	if (sentTexts.length === 0) return false;
	const normalized = normalizeTextForComparison(text);
	if (!normalized || normalized.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
	return isMessagingToolDuplicateNormalized(normalized, sentTexts.map(normalizeTextForComparison));
}
function resolveCurrentSourceMessagingToolPartial(state, params) {
	const held = state.currentSourceMessagingToolHeldPartial;
	const text = held && params.evtType === "text_delta" && !params.text.startsWith(held) ? `${held}${params.visibleDelta || params.text}` : params.text;
	const normalized = state.currentSourceMessagingToolSentTextsNormalized.length ? normalizeTextForComparison(text) : "";
	const hold = Boolean(normalized) && state.currentSourceMessagingToolSentTextsNormalized.some((sentText) => sentText === normalized || sentText.startsWith(normalized));
	state.currentSourceMessagingToolHeldPartial = hold ? text : void 0;
	return {
		hold,
		text
	};
}
//#endregion
export { resolveCurrentSourceMessagingToolPartial as i, isMessagingToolDuplicateNormalized as n, normalizeTextForComparison as r, isMessagingToolDuplicate as t };
