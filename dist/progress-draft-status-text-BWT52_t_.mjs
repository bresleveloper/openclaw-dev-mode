import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { a as isInsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import { t as compactProgressText } from "./text-truncate-DrDnz8rI.mjs";
import { u as formatReasoningMessage } from "./embedded-agent-utils-C9EyRsVl.mjs";
//#region src/channels/progress-draft-status-text.ts
const REASONING_PROGRESS_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/giu;
const REASONING_PROGRESS_TAG_PREFIXES = [
	"think",
	"thinking",
	"thought",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"mm:think",
	"mm:thinking",
	"mm:thought"
].flatMap((name) => [`<${name}`, `</${name}`]);
function normalizeReasoningProgressLine(text) {
	const reasoningText = readReasoningProgressTextOutsideCode(text);
	if (reasoningText === void 0) return "";
	return stripReasoningProgressTagsOutsideCode(reasoningText).replace(/^\s*(?:>\s*)?(?:Reasoning:\s*(?:\r?\n|\r)\s*|Thinking\.{0,3}\s*(?:\r?\n|\r)\s*(?:\r?\n|\r)\s*)/i, "").replace(/\s{2,}|[^\S ]/g, " ").trim();
}
function readReasoningProgressTextOutsideCode(text) {
	if (isPartialReasoningProgressTagPrefix(text)) return;
	let codeRegions;
	let hasTags = false;
	let inReasoning = false;
	let cursor = 0;
	const chunks = [];
	for (const match of text.matchAll(REASONING_PROGRESS_TAG_RE)) {
		const offset = match.index ?? 0;
		if (isInsideCode(offset, codeRegions ??= findCodeRegions(text))) continue;
		hasTags = true;
		if (match[1]) {
			if (inReasoning) chunks.push(text.slice(cursor, offset));
			inReasoning = false;
			cursor = offset + match[0].length;
			continue;
		}
		if (inReasoning) chunks.push(text.slice(cursor, offset));
		inReasoning = true;
		cursor = offset + match[0].length;
	}
	if (!hasTags) return text;
	if (inReasoning) chunks.push(text.slice(cursor));
	return chunks.join("").trim();
}
function isPartialReasoningProgressTagPrefix(text) {
	const trimmed = text.trimStart();
	if (!trimmed.startsWith("<") || trimmed.includes(">")) return false;
	const normalized = trimmed.toLowerCase();
	return REASONING_PROGRESS_TAG_PREFIXES.some((prefix) => prefix.startsWith(normalized) || normalized.startsWith(prefix));
}
function stripReasoningProgressTagsOutsideCode(text) {
	let codeRegions;
	return text.replace(REASONING_PROGRESS_TAG_RE, (match, _closing, offset) => isInsideCode(offset, codeRegions ??= findCodeRegions(text)) ? match : "");
}
function normalizeReasoningProgressInput(text) {
	const normalized = normalizeReasoningProgressLine(text);
	return (normalized.match(/^_(.*)_$/u)?.[1] ?? normalized).trim();
}
function formatReasoningProgressDisplayLine(text, maxChars) {
	const normalizedText = normalizeReasoningProgressInput(text);
	const formatted = normalizeReasoningProgressLine(formatReasoningMessage(normalizedText));
	if (!formatted) return "";
	if (Array.from(sliceUtf16Safe(formatted, 0, (Math.max(0, maxChars) + 1) * 2)).length <= maxChars) return formatted;
	const italic = formatted.match(/^_(.*)_$/u);
	if (!italic) return compactProgressText(formatted, maxChars);
	const body = compactProgressText((italic[1] ?? "").trim(), Math.max(1, maxChars - 2));
	return body ? `_${body}_` : "";
}
function sanitizeProgressStatusText(text) {
	const cleaned = stripInlineDirectiveTagsForDelivery(text).text.trim();
	if (!cleaned || isSilentCommentaryProgressText(cleaned)) return "";
	return redactToolPayloadText(cleaned);
}
function normalizeCommentaryProgressText(text) {
	const cleaned = sanitizeProgressStatusText(text);
	if (!cleaned) return "";
	return cleaned.split(/\r?\n/u).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).map((line) => `_${line}_`).join("\n");
}
function isSilentCommentaryProgressText(text) {
	const normalized = text.replace(/^[\s*_`~]+|[\s*_`~]+$/gu, "").trim();
	return /^NO_REPLY$/iu.test(normalized);
}
function mergeReasoningProgressText(current, incoming, options) {
	if (!current) return incoming;
	const normalizedCurrent = normalizeReasoningProgressInput(current);
	const normalizedIncoming = normalizeReasoningProgressInput(incoming);
	if (!normalizedIncoming) return shouldAppendEmptyReasoningProgressDelta(current, incoming) ? `${current}${incoming}` : current;
	if (normalizedIncoming === normalizedCurrent) return current;
	if (options?.snapshot === true || isReasoningSnapshotText(incoming) || normalizedCurrent && normalizedIncoming.startsWith(normalizedCurrent)) return incoming;
	return `${current}${incoming}`;
}
function isReasoningSnapshotText(text) {
	return /^\s*(?:>\s*)?(?:Reasoning:\s*(?:\r?\n|\r)\s*|Thinking\.{0,3}\s*(?:\r?\n|\r)\s*(?:\r?\n|\r)\s*)/i.test(text);
}
function shouldAppendEmptyReasoningProgressDelta(current, incoming) {
	return isPartialReasoningProgressTagPrefix(current) || isPartialReasoningProgressTagPrefix(incoming) || hasReasoningProgressTagOutsideCode(incoming);
}
function hasReasoningProgressTagOutsideCode(text) {
	let codeRegions;
	for (const match of text.matchAll(REASONING_PROGRESS_TAG_RE)) if (!isInsideCode(match.index ?? 0, codeRegions ??= findCodeRegions(text))) return true;
	return false;
}
/**
* Commentary line identity. An explicit item id owns its line. Without one,
* providers stream cumulative snapshots ("Checking" → "Checking the
* workspace"), so a snapshot that continues the open line reuses its id and
* updates in place; anything else starts a new line.
*/
function resolveCommentaryLineId(commentary) {
	if (commentary.itemId) return `commentary:${commentary.itemId}`;
	if (!commentary.normalized) return "";
	if (Boolean(commentary.lastIdLessCommentaryBare) && (commentary.bareNormalized.startsWith(commentary.lastIdLessCommentaryBare) || commentary.lastIdLessCommentaryBare.startsWith(commentary.bareNormalized)) && commentary.lastIdLessCommentaryId) return commentary.lastIdLessCommentaryId;
	return `commentary:${commentary.normalized}`;
}
function createReasoningProgressAccumulator() {
	let rawText = "";
	return {
		reset() {
			rawText = "";
		},
		merge(text, options) {
			if (!text) return "";
			rawText = mergeReasoningProgressText(rawText, text, options);
			return redactToolPayloadText(normalizeReasoningProgressLine(rawText));
		}
	};
}
//#endregion
export { sanitizeProgressStatusText as a, resolveCommentaryLineId as i, formatReasoningProgressDisplayLine as n, normalizeCommentaryProgressText as r, createReasoningProgressAccumulator as t };
