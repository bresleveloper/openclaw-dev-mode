import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { h as skipWhitespace, p as skipHorizontalWhitespace } from "./grammar-CaCTkX_b.mjs";
import { a as isInsideCode, i as indexTextParts, n as findCodeOwnership, r as findCodeRegions, t as createTextPartCodeRegionResolver } from "./code-regions-CvUeKYli.mjs";
import { c as trimTextPreservingCode, r as createConditionalTextProjector } from "./text-projection-BTFPDH-Z.mjs";
//#region src/utils/inline-reply-tags.ts
const REPLY_HEAD = /\[\[\s*(reply_to_current|reply_to\s*:)/iy;
function isWhitespace(character) {
	return /\s/u.test(character);
}
/** Reads increasing marker offsets without rescanning nested candidates' shared suffixes. */
function createInlineReplyTagReader(text) {
	let close = -1;
	let contentEnd = -1;
	let lineFeed = -1;
	const leadingStart = skipHorizontalWhitespace(text, 0);
	const closingBracket = (from) => {
		if (close < from) {
			const found = text.indexOf("]", from);
			close = found < 0 ? text.length : found;
			contentEnd = close;
			while (contentEnd > 0 && isWhitespace(text.charAt(contentEnd - 1))) contentEnd -= 1;
		}
		return close;
	};
	const firstLineFeed = (from) => {
		if (lineFeed < from) {
			const found = text.indexOf("\n", from);
			lineFeed = found < 0 ? text.length : found;
		}
		return lineFeed;
	};
	return (start, allowLeadingMalformed = false) => {
		REPLY_HEAD.lastIndex = start;
		const head = REPLY_HEAD.exec(text);
		if (!head) return null;
		const headEnd = REPLY_HEAD.lastIndex;
		const explicit = head[1]?.endsWith(":") === true;
		const valueStart = skipWhitespace(text, headEnd);
		if (!explicit) {
			if (text.startsWith("]]", valueStart)) return {
				start,
				end: valueStart + 2,
				complete: true
			};
		} else {
			const end = closingBracket(valueStart);
			if (text.startsWith("]]", end)) {
				if (valueStart < end && firstLineFeed(valueStart) >= contentEnd) return {
					start,
					end: end + 2,
					id: text.slice(valueStart, contentEnd),
					complete: true
				};
				if (valueStart === end) {
					for (let cursor = headEnd; cursor < end; cursor += 1) if (text.charAt(cursor) !== "\n") return {
						start,
						end: end + 2,
						id: "",
						complete: true
					};
				}
			}
		}
		if (!allowLeadingMalformed || start !== leadingStart) return null;
		if (explicit) {
			if (valueStart === text.length) return {
				start,
				end: text.length,
				complete: false
			};
			const end = closingBracket(valueStart);
			if (end === text.length || text.charAt(end + 1) === "]") return null;
			for (let cursor = valueStart; cursor < end; cursor += 1) if (text.charAt(cursor) === "\r" || text.charAt(cursor) === "\n") return null;
			return {
				start,
				end: skipHorizontalWhitespace(text, end + 1),
				complete: false
			};
		}
		const end = skipHorizontalWhitespace(text, headEnd);
		if (text.charAt(end) === "]" && text.charAt(end + 1) !== "]") return {
			start,
			end: skipHorizontalWhitespace(text, end + 1),
			complete: false
		};
		if (end === text.length || end > headEnd && !isWhitespace(text.charAt(end))) return {
			start,
			end,
			complete: false
		};
		return null;
	};
}
//#endregion
//#region src/utils/directive-tags.ts
const AUDIO_TAG_RE = /\[\[\s*audio_as_voice\s*\]\]/gi;
const DELIVERY_AUDIO_TAG_RE = /\[\[\s*audio_as_voice\s*\]\]/iuy;
const MAX_REPLY_DIRECTIVE_ID_LENGTH = 256;
const UNSAFE_REPLY_DIRECTIVE_CHARS_RE = /[\p{Cc}[\]]/gu;
const NO_INLINE_DIRECTIVES = {
	audioAsVoice: false,
	replyToCurrent: false,
	hasAudioTag: false,
	hasReplyTag: false
};
const REMOVED_DIRECTIVE_MARKER_SEED = "";
function createRemovedDirectiveMarker(parts) {
	let marker = REMOVED_DIRECTIVE_MARKER_SEED;
	while (parts.some((part) => part.includes(marker))) marker += REMOVED_DIRECTIVE_MARKER_SEED;
	return marker;
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
function replaceReplyTagsOutsideCodeRegions(text, replacement) {
	const readReply = createInlineReplyTagReader(text);
	let codeRegions;
	let cursor = 0;
	let searchFrom = 0;
	let result = "";
	while (searchFrom < text.length) {
		const marker = text.indexOf("[[", searchFrom);
		if (marker < 0) break;
		const tag = readReply(marker);
		searchFrom = tag ? tag.end : marker + 1;
		if (!tag || isInsideCode(marker, codeRegions ??= findCodeRegions(text))) continue;
		result += text.slice(cursor, marker);
		result += replacement(text.slice(marker, tag.end), [tag.id], marker, text);
		cursor = tag.end;
	}
	return result + text.slice(cursor);
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
	return replaceTextParts(parts, (text, replace) => replaceOutsideCodeRegions(text, regex, replace), replacement);
}
function replaceTextParts(parts, replace, replacement) {
	const source = indexTextParts(parts);
	const edits = [];
	let part = 0;
	replace(source.text, (match, captures, offset, text) => {
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
function isLineBreak(char) {
	return char === "\n" || char === "\r";
}
function isBlank(char) {
	return char === " " || char === "	";
}
/**
* Joins the text around each removed directive without touching other whitespace.
* Output is built from pieces with incremental tail facts so many directives stay linear.
*/
function closeRemovedDirectiveGaps(text, marker) {
	if (!text.includes(marker)) return text;
	const contentEnd = text.trimEnd().length;
	const out = [];
	let lastContentChar;
	const push = (piece) => {
		out.push(piece);
		for (let i = piece.length - 1; i >= 0; i -= 1) if (!isBlank(piece[i])) {
			lastContentChar = piece[i];
			return;
		}
	};
	const trimTrailingBlanks = () => {
		while (out.length > 0) {
			const last = out[out.length - 1] ?? "";
			let end = last.length;
			while (end > 0 && isBlank(last[end - 1])) end -= 1;
			if (end > 0) {
				out[out.length - 1] = last.slice(0, end);
				return;
			}
			out.pop();
		}
	};
	const trailingBreaks = () => {
		let breaks = 0;
		for (let p = out.length - 1; p >= 0; p -= 1) {
			const piece = out[p] ?? "";
			for (let i = piece.length - 1; i >= 0; i -= 1) if (piece[i] === "\n") {
				breaks += 1;
				if (breaks >= 2) return breaks;
			} else if (piece[i] !== "\r") return breaks;
		}
		return breaks;
	};
	let cursor = 0;
	for (;;) {
		const markerStart = text.indexOf(marker, cursor);
		if (markerStart < 0) {
			push(text.slice(cursor));
			return out.join("");
		}
		let markerEnd = markerStart + marker.length;
		while (text.startsWith(marker, markerEnd)) markerEnd += marker.length;
		push(text.slice(cursor, markerStart));
		let next = markerEnd;
		while (isBlank(text[next])) next += 1;
		const atLineStart = lastContentChar === void 0 || isLineBreak(lastContentChar);
		const atLineEnd = next >= text.length || isLineBreak(text[next]);
		if (atLineStart && atLineEnd) {
			trimTrailingBlanks();
			let breaks = trailingBreaks();
			while (isLineBreak(text[next])) {
				const width = text.startsWith("\r\n", next) ? 2 : 1;
				if (breaks < 2) {
					push(text.slice(next, next + width));
					breaks += 1;
				}
				next += width;
			}
		} else if (atLineStart || next >= contentEnd) next = markerEnd;
		else {
			trimTrailingBlanks();
			if (!atLineEnd) push(" ");
		}
		cursor = next;
	}
}
function trimDirectiveMessageBoundaries(text, tailMode, preparedRegions) {
	let regions = preparedRegions;
	const inCode = (offset) => (regions ??= findCodeRegions(text)).some((region) => region.start <= offset && offset < region.end);
	let start = /^(?:\r?\n)*/u.exec(text)?.[0].length ?? 0;
	if (/^[ \t]\S/u.test(text.slice(start, start + 2)) && !inCode(start)) start += 1;
	let end = text.length;
	if (tailMode === "trim") {
		const contentEnd = text.trimEnd().length;
		end = contentEnd < end && (regions ??= findCodeRegions(text)).some((region) => region.start <= contentEnd && region.end === text.length) ? end : Math.max(contentEnd, start);
	}
	return text.slice(start, end);
}
function stripInlineDirectiveTagsForDisplay(text) {
	if (!text) return {
		text,
		changed: false
	};
	const stripped = replaceReplyTagsOutsideCodeRegions(replaceOutsideCodeRegions(text, AUDIO_TAG_RE, () => ""), () => "");
	return {
		text: stripped,
		changed: stripped !== text
	};
}
function hasDirectiveCodePrefixOpportunity(source, delta) {
	if (!delta) return false;
	const deltaStart = source.length - delta.length;
	const start = Math.max(0, deltaStart - 4);
	let separator = -1;
	for (const match of source.slice(start).matchAll(/(?:\r\n|\n|\r)[^\S\r\n]*\S/g)) if (start + match.index + match[0].length > deltaStart) separator = start + match.index;
	if (separator === -1) return false;
	const lastMarker = source.lastIndexOf("[[");
	return lastMarker !== -1 && separator > lastMarker;
}
function findDirectiveCodePrefix(source, delta) {
	if (!hasDirectiveCodePrefixOpportunity(source, delta)) return;
	const { regions, retainStart, completedParagraphs } = findCodeOwnership(source);
	let regionIndex = 0;
	let paragraphIndex = 0;
	let end = 0;
	for (let marker = source.indexOf("[["); marker !== -1; marker = source.indexOf("[[", marker + 1)) {
		let region = regions[regionIndex];
		while (region && region.end <= marker) region = regions[++regionIndex];
		let paragraph = completedParagraphs[paragraphIndex];
		while (paragraph && paragraph.end <= marker) paragraph = completedParagraphs[++paragraphIndex];
		if (!region || region.start > marker || region.end < marker + 2) return;
		if (region.block) {
			if (region.end > retainStart) return;
			end = region.end;
			continue;
		}
		if (!paragraph || paragraph.hasReferenceCandidate || paragraph.start > region.start || paragraph.end < region.end) return;
		end = paragraph.end;
	}
	return end ? {
		end,
		checkedRawLength: source.length
	} : void 0;
}
/** Retain only literal directives whose Markdown ownership cannot change on append. */
const inlineDirectiveDisplayTextFilter = {
	transform: (text) => stripInlineDirectiveTagsForDisplay(text).text,
	create: () => {
		let prefix;
		let hasMarker = false;
		let previousChar = "";
		let delta = "";
		return createConditionalTextProjector((text) => {
			const projected = stripInlineDirectiveTagsForDisplay(text).text;
			prefix = projected === text ? findDirectiveCodePrefix(text, delta) : void 0;
			return projected;
		}, (input) => {
			delta = input.delta ?? input.text;
			if ((previousChar + delta).includes("[[")) {
				hasMarker = true;
				prefix = void 0;
			}
			if (delta) previousChar = delta.slice(-1);
			if (prefix) prefix.checkedRawLength = input.text.length;
			return hasMarker && !prefix;
		});
	}
};
function sanitizeReplyDirectiveId(rawReplyToId) {
	const trimmed = rawReplyToId?.trim();
	if (!trimmed) return;
	const sanitized = trimmed.replace(UNSAFE_REPLY_DIRECTIVE_CHARS_RE, "").trim();
	if (!sanitized) return;
	return sanitized.length <= MAX_REPLY_DIRECTIVE_ID_LENGTH ? sanitized : truncateCodePoints(sanitized, MAX_REPLY_DIRECTIVE_ID_LENGTH);
}
function collectDeliveryDirectiveEdits(text) {
	if (!text.includes("[[")) return [];
	const readReply = createInlineReplyTagReader(text);
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
		DELIVERY_AUDIO_TAG_RE.lastIndex = marker;
		const audio = DELIVERY_AUDIO_TAG_RE.exec(text);
		const reply = audio ? null : readReply(marker, true);
		if (!audio && !reply) {
			searchFrom = marker + 1;
			continue;
		}
		const complete = Boolean(audio) || reply?.complete;
		searchFrom = audio ? DELIVERY_AUDIO_TAG_RE.lastIndex : expectDefined(reply, "reply tag").end;
		if (complete) while (searchFrom < text.length && /\s/u.test(text.charAt(searchFrom))) searchFrom += 1;
		previousMatchEnd = searchFrom;
		if (isInsideCode(marker, codeRegions ??= findCodeRegions(text))) continue;
		const preserveCodePadding = codeRegions.some((region) => region.block && region.start > marker && region.start <= searchFrom);
		cursor = preserveCodePadding ? start + text.slice(start, searchFrom).trimEnd().length : searchFrom;
		edits.push({
			start,
			end: cursor,
			text: !preserveCodePadding && complete ? " " : ""
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
		text: trimDirectiveMessageBoundaries(text, options.preserveTrailingWhitespace ? "preserve" : "trim"),
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
		sawCurrent: false
	}));
	const marker = createRemovedDirectiveMarker(parts);
	const closedText = replaceTextParts(replaceOutsideCodeRegionParts(parts, AUDIO_TAG_RE, (match, _captures, _offset, _source, partIndex) => {
		const state = expectDefined(states[partIndex], "audio directive part");
		state.audioAsVoice = state.hasAudioTag = true;
		onAudioDirective?.();
		return stripAudioTag ? marker : match;
	}).map((text) => closeRemovedDirectiveGaps(text, marker)), replaceReplyTagsOutsideCodeRegions, (match, captures, _offset, _source, partIndex) => {
		const state = expectDefined(states[partIndex], "reply directive part");
		const idRaw = typeof captures[0] === "string" ? captures[0] : void 0;
		state.hasReplyTag = true;
		if (idRaw === void 0) state.sawCurrent = true;
		else {
			const id = sanitizeReplyDirectiveId(idRaw);
			if (id) state.lastExplicitId = id;
		}
		return stripReplyTags ? marker : match;
	}).map((text) => closeRemovedDirectiveGaps(text, marker));
	const regions = parts.length > 1 ? createTextPartCodeRegionResolver(closedText) : void 0;
	return states.map((state, index) => {
		const text = expectDefined(closedText[index], "parsed native text");
		const normalizedText = state.hasAudioTag || state.hasReplyTag || text !== parts[index] ? trimDirectiveMessageBoundaries(text, preserveTrailingWhitespace ? "preserve" : "trim", regions?.(index)) : text;
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
export { replaceOutsideCodeRegionParts as a, stripInlineDirectivePartsForDelivery as c, parseInlineDirectives as i, stripInlineDirectiveTagsForDelivery as l, inlineDirectiveDisplayTextFilter as n, replaceOutsideCodeRegions as o, parseInlineDirectiveParts as r, sanitizeReplyDirectiveId as s, findDirectiveCodePrefix as t, stripInlineDirectiveTagsForDisplay as u };
