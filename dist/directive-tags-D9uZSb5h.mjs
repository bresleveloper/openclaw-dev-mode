import "./src-CZ2wJvNB.mjs";
import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as isInsideCode, i as indexTextParts, r as findCodeRegions, t as createTextPartCodeRegionResolver } from "./code-regions-NxEObIZm.mjs";
import { o as trimTextPreservingCode } from "./text-projection-DLGaFuGQ.mjs";
//#region src/utils/directive-tags.ts
const AUDIO_TAG_RE = /\[\[\s*audio_as_voice\s*\]\]/gi;
const REPLY_TAG_RE = /\[\[\s*(?:reply_to_current|reply_to\s*:\s*([^\]\n]+))\s*\]\]/gi;
const INLINE_DIRECTIVE_TAG_WITH_PADDING_RE = /(?:\s*(?:\[\[\s*audio_as_voice\s*\]\]|\[\[\s*(?:reply_to_current|reply_to\s*:\s*[^\]\n]+)\s*\]\])\s*|^[\t ]*\[\[\s*(?:reply_to_current(?:[\t ]*\](?!\])|(?=[\t ]+\S)|[\t ]*$)|reply_to\s*:\s*(?:[^\]\r\n]*\](?!\])|[\t ]*$))[\t ]*)/iuy;
const MAX_REPLY_DIRECTIVE_ID_LENGTH = 256;
const UNSAFE_REPLY_DIRECTIVE_CHARS_RE = /[\p{Cc}[\]]/gu;
const NO_INLINE_DIRECTIVES = {
	audioAsVoice: false,
	replyToCurrent: false,
	hasAudioTag: false,
	hasReplyTag: false
};
function replacementPreservesWordBoundary(source, offset, length) {
	const before = source[offset - 1];
	const after = source[offset + length];
	return before && after && !/\s/u.test(before) && !/\s/u.test(after) ? " " : "";
}
const BLOCK_SENTINEL_SEED = "";
function createBlockSentinel(text) {
	let sentinel = BLOCK_SENTINEL_SEED;
	while (text.includes(sentinel)) sentinel += BLOCK_SENTINEL_SEED;
	return sentinel;
}
function replaceOutsideCodeRegions(text, regex, replacement) {
	let codeRegions;
	return text.replace(regex, (...args) => {
		codeRegions ??= text.includes("[[") ? findCodeRegions(text) : [];
		const match = String(args[0]);
		const offset = args.at(-2);
		return typeof offset === "number" && isInsideCode(offset + match.indexOf("[["), codeRegions) ? match : replacement(match, args.slice(1, -2), Number(offset), text);
	});
}
function applyNativeTextEdits(parts, edits) {
	const source = indexTextParts(parts);
	const result = [...parts];
	let editIndex = 0;
	for (const span of source.spans) {
		let cursor = span.start;
		let text = "";
		while (editIndex < edits.length) {
			const edit = expectDefined(edits[editIndex], "native text edit");
			if (edit.end <= span.start) {
				editIndex++;
				continue;
			}
			if (edit.start > span.end) break;
			text += source.text.slice(cursor, Math.max(cursor, Math.min(edit.start, span.end)));
			if (edit.start >= span.start) text += edit.text;
			cursor = Math.min(span.end, Math.max(cursor, edit.end));
			if (edit.end <= span.end) editIndex++;
			else break;
		}
		result[span.index] = text + source.text.slice(cursor, span.end);
	}
	let owner = source.spans[0]?.index;
	editIndex = 0;
	for (let index = 1; index < source.spans.length; index++) {
		const before = expectDefined(source.spans[index - 1], "preceding native part");
		const next = expectDefined(source.spans[index], "following native part");
		while (edits[editIndex] && expectDefined(edits[editIndex], "boundary text edit").end <= before.end) editIndex++;
		const edit = edits[editIndex];
		if (owner !== void 0 && edit && edit.start <= before.end && edit.end > before.end) {
			result[owner] = expectDefined(result[owner], "native edit owner") + expectDefined(result[next.index], "native edit continuation");
			result[next.index] = "";
		} else owner = next.index;
	}
	return result;
}
/** Replace one syntax stage with full-message code ownership and native edit positions. */
function replaceOutsideCodeRegionParts(parts, regex, replacement) {
	const source = indexTextParts(parts);
	const edits = [];
	let part = 0;
	replaceOutsideCodeRegions(source.text, regex, (match, captures, offset, text) => {
		while (source.spans[part + 1] && expectDefined(source.spans[part + 1], "next text part").start <= offset) part++;
		const value = replacement(match, captures, offset, text, expectDefined(source.spans[part], "directive start part").index);
		if (value !== match) edits.push({
			start: offset,
			end: offset + match.length,
			text: value
		});
		return value;
	});
	return edits.length ? applyNativeTextEdits(parts, edits) : [...parts];
}
function normalizeDirectiveWhitespace(text, tailMode = "trim", preparedRegions) {
	const blockSentinel = createBlockSentinel(text);
	const blockPlaceholderRe = new RegExp(`${blockSentinel}(\\d+)${blockSentinel}`, "g");
	const blocks = [];
	const codeRegions = preparedRegions ?? findCodeRegions(text);
	let masked = "";
	let cursor = 0;
	for (const span of codeRegions) {
		blocks.push(text.slice(span.start, span.end));
		masked += `${text.slice(cursor, span.start)}${blockSentinel}${blocks.length - 1}${blockSentinel}`;
		cursor = span.end;
	}
	masked += text.slice(cursor);
	const suffixStart = tailMode === "preserve" ? masked.trimEnd().length : masked.length;
	const suffix = masked.slice(suffixStart);
	const normalized = masked.slice(0, suffixStart).replace(/\r\n/g, "\n").replace(/([^\s])[ \t]{2,}([^\s])/g, "$1 $2").replace(/^\n+/, "").replace(/^[ \t](?=\S)/, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
	return (tailMode === "trim" ? normalized.trimEnd() : normalized + suffix).replace(blockPlaceholderRe, (_, i) => expectDefined(blocks[Number(i)], "blocks entry at number(i)"));
}
function stripInlineDirectiveTagsForDisplay(text) {
	if (!text) return {
		text,
		changed: false
	};
	const stripped = replaceOutsideCodeRegions(replaceOutsideCodeRegions(text, AUDIO_TAG_RE, () => ""), REPLY_TAG_RE, () => "");
	return {
		text: stripped,
		changed: stripped !== text
	};
}
function sanitizeReplyDirectiveId(rawReplyToId) {
	const trimmed = rawReplyToId?.trim();
	if (!trimmed) return;
	const sanitized = trimmed.replace(UNSAFE_REPLY_DIRECTIVE_CHARS_RE, "").trim();
	if (!sanitized) return;
	return sanitized.length <= MAX_REPLY_DIRECTIVE_ID_LENGTH ? sanitized : truncateCodePoints(sanitized, MAX_REPLY_DIRECTIVE_ID_LENGTH);
}
function collectDeliveryDirectiveEdits(text) {
	if (!text.includes("[[")) return [];
	let codeRegions;
	const edits = [];
	let cursor = 0;
	let searchFrom = 0;
	let previousMatchEnd = 0;
	while (searchFrom < text.length) {
		const marker = text.indexOf("[[", searchFrom);
		if (marker < 0) break;
		let start = marker;
		while (start > previousMatchEnd && /\s/u.test(text.charAt(start - 1))) start -= 1;
		INLINE_DIRECTIVE_TAG_WITH_PADDING_RE.lastIndex = start;
		const match = INLINE_DIRECTIVE_TAG_WITH_PADDING_RE.exec(text);
		searchFrom = match ? INLINE_DIRECTIVE_TAG_WITH_PADDING_RE.lastIndex : marker + 1;
		if (!match) continue;
		previousMatchEnd = searchFrom;
		if (isInsideCode(marker, codeRegions ??= findCodeRegions(text))) continue;
		const preserveCodePadding = codeRegions.some((region) => region.block && region.start > marker && region.start <= searchFrom);
		cursor = preserveCodePadding ? start + match[0].trimEnd().length : searchFrom;
		edits.push({
			start,
			end: cursor,
			text: !preserveCodePadding && match[0].includes("]]") ? " " : ""
		});
	}
	if (cursor === 0) return [];
	return edits;
}
function stripInlineDirectivePartsForDelivery(parts, options) {
	const edits = collectDeliveryDirectiveEdits(indexTextParts(parts).text);
	if (!edits.length) return parts.map((text) => ({
		text,
		changed: false
	}));
	const stripped = applyNativeTextEdits(parts, edits);
	const regions = stripped.length > 1 ? createTextPartCodeRegionResolver(stripped) : void 0;
	return stripped.map((text, index) => ({
		text: text === parts[index] ? text : trimTextPreservingCode(text, options?.preserveTrailingWhitespace ? "start" : "both", regions?.(index)),
		changed: text !== parts[index]
	}));
}
function stripInlineDirectiveTagsForDelivery(text, options) {
	return expectDefined(stripInlineDirectivePartsForDelivery([text], options)[0], "single delivery directive part");
}
function parseInlineDirectives(text, options = {}) {
	if (!text) return {
		text: "",
		...NO_INLINE_DIRECTIVES
	};
	if (!text.includes("[[")) return {
		text: normalizeDirectiveWhitespace(text, options.preserveTrailingWhitespace ? "preserve" : "trim"),
		...NO_INLINE_DIRECTIVES
	};
	return expectDefined(parseInlineDirectiveParts([text], options)[0], "single inline directive part");
}
function parseInlineDirectiveParts(parts, options = {}) {
	const { currentMessageId, stripAudioTag = true, stripReplyTags = true, preserveTrailingWhitespace = false, onAudioDirective } = options;
	const states = parts.map(() => ({
		audioAsVoice: false,
		hasAudioTag: false,
		hasReplyTag: false,
		sawCurrent: false,
		removedTrailingDirectiveLine: false
	}));
	const stripDirective = (match, offset, source, partIndex) => {
		const state = expectDefined(states[partIndex], "directive part state");
		if (preserveTrailingWhitespace && !state.removedTrailingDirectiveLine && offset + match.length === source.trimEnd().length) {
			const lineStart = Math.max(source.lastIndexOf("\n", offset - 1), source.lastIndexOf("\r", offset - 1)) + 1;
			state.removedTrailingDirectiveLine = /^[\t ]*$/.test(source.slice(lineStart, offset));
		}
		return replacementPreservesWordBoundary(source, offset, match.length);
	};
	const replyText = replaceOutsideCodeRegionParts(replaceOutsideCodeRegionParts(parts, AUDIO_TAG_RE, (match, _captures, offset, source, partIndex) => {
		const state = expectDefined(states[partIndex], "audio directive part");
		state.audioAsVoice = state.hasAudioTag = true;
		onAudioDirective?.();
		return stripAudioTag ? stripDirective(match, offset, source, partIndex) : match;
	}), REPLY_TAG_RE, (match, captures, offset, source, partIndex) => {
		const state = expectDefined(states[partIndex], "reply directive part");
		const idRaw = typeof captures[0] === "string" ? captures[0] : void 0;
		state.hasReplyTag = true;
		if (idRaw === void 0) state.sawCurrent = true;
		else {
			const id = sanitizeReplyDirectiveId(idRaw);
			if (id) state.lastExplicitId = id;
		}
		return stripReplyTags ? stripDirective(match, offset, source, partIndex) : match;
	});
	const regions = parts.length > 1 ? createTextPartCodeRegionResolver(replyText) : void 0;
	return states.map((state, index) => {
		const text = expectDefined(replyText[index], "parsed native text");
		const tailMode = preserveTrailingWhitespace ? state.removedTrailingDirectiveLine ? "normalize" : "preserve" : "trim";
		const normalizedText = state.hasAudioTag || state.hasReplyTag || text !== parts[index] ? normalizeDirectiveWhitespace(text, tailMode, regions?.(index)) : text;
		if (!state.hasAudioTag && !state.hasReplyTag) return Object.assign({ text: normalizedText }, NO_INLINE_DIRECTIVES);
		return {
			text: normalizedText,
			audioAsVoice: state.audioAsVoice,
			replyToId: state.lastExplicitId ?? (state.sawCurrent ? normalizeOptionalString(currentMessageId) : void 0),
			replyToExplicitId: state.lastExplicitId,
			replyToCurrent: state.sawCurrent,
			hasAudioTag: state.hasAudioTag,
			hasReplyTag: state.hasReplyTag
		};
	});
}
//#endregion
export { sanitizeReplyDirectiveId as a, stripInlineDirectiveTagsForDisplay as c, replaceOutsideCodeRegions as i, parseInlineDirectives as n, stripInlineDirectivePartsForDelivery as o, replaceOutsideCodeRegionParts as r, stripInlineDirectiveTagsForDelivery as s, parseInlineDirectiveParts as t };
