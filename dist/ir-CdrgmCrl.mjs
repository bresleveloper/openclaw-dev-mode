import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
import { c as visibleWidth, d as eastAsianWidthType } from "./ansi-CWsy0bu4.mjs";
import { r as skipWhitespaceGraphemes, t as findGraphemeChunkEnd } from "./grapheme-CS7DlGGi.mjs";
import { t as MarkdownItCallable } from "./markdown-it-DHkpg-if.mjs";
//#region node_modules/.pnpm/markdown-it-cjk-friendly@3.0.0_@types+markdown-it@14.2.0_markdown-it@15.0.2/node_modules/markdown-it-cjk-friendly/dist/index.js
function isEmoji(uc) {
	return /^\p{Emoji_Presentation}/u.test(String.fromCodePoint(uc));
}
/**
* Check if `uc` is CJK. Deferred (returns `null`) if IVS.
*
* @param uc code point
* @returns `true` if `uc` is CJK, `false` if not, `null` if IVS
*/
function isCjkBase(uc) {
	if (uc < 4352) return false;
	switch (eastAsianWidthType(uc)) {
		case "fullwidth":
		case "halfwidth": return true;
		case "wide": return !isEmoji(uc);
		case "narrow": return false;
		case "ambiguous": return null;
		case "neutral": return /^\p{sc=Hangul}/u.test(String.fromCodePoint(uc));
	}
}
function is2PreviousCjk(uc, prev) {
	return isCjkBase(uc) ?? (prev === 65025 && isQuotationMark(uc));
	function isQuotationMark(uc) {
		return uc === 8216 || uc === 8217 || uc === 8220 || uc === 8221;
	}
}
function isPreviousCjk(uc) {
	return isCjkBase(uc) ?? (917760 <= uc && uc <= 917999);
}
function isNextCjk(uc) {
	return isCjkBase(uc) ?? false;
}
function nonEmojiGeneralUseVS(uc) {
	return uc >= 65024 && uc <= 65038;
}
function markdownItCjkFriendlyPlugin(md) {
	const PreviousState = md.inline.State;
	class CjkFriendlyState extends PreviousState {
		scanDelims(start, canSplitWord) {
			const max = this.posMax;
			const marker = this.src.charCodeAt(start);
			const [lastChar, lastCharPos] = getLastCharCode(this.src, start);
			let lastMainChar = lastChar;
			let twoPrevChar = null;
			if (nonEmojiGeneralUseVS(lastChar)) {
				twoPrevChar = getLastCharCode(this.src, lastCharPos)[0];
				if (!/^\p{Zs}/u.test(String.fromCodePoint(twoPrevChar))) lastMainChar = twoPrevChar;
			}
			let pos = start;
			while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
			const count = pos - start;
			const nextChar = pos < max ? this.src.codePointAt(pos) : 32;
			const isLastWhiteSpace = md.utils.isWhiteSpace(lastMainChar);
			const isNextWhiteSpace = md.utils.isWhiteSpace(nextChar);
			if (isLastWhiteSpace || isNextWhiteSpace) return {
				can_open: !isNextWhiteSpace,
				can_close: !isLastWhiteSpace,
				length: count
			};
			const isLastPunctChar = md.utils.isMdAsciiPunct(lastMainChar) || md.utils.isPunctChar(String.fromCodePoint(lastMainChar));
			const isNextPunctChar = md.utils.isMdAsciiPunct(nextChar) || md.utils.isPunctChar(String.fromCodePoint(nextChar));
			let left_flanking = isLastPunctChar;
			let right_flanking = isNextPunctChar;
			if (canSplitWord) {
				const isEitherCJKChar = isNextCjk(nextChar) || (twoPrevChar !== null ? is2PreviousCjk(twoPrevChar, lastChar) : isPreviousCjk(lastChar));
				left_flanking ||= isEitherCJKChar || !isNextPunctChar;
				right_flanking ||= isEitherCJKChar || !isLastPunctChar;
			}
			return {
				can_open: left_flanking,
				can_close: right_flanking,
				length: count
			};
			function getLastCharCode(str, pos) {
				if (pos <= 0) return [32, -1];
				const charCode = str.charCodeAt(pos - 1);
				if ((charCode & 64512) !== 56320) return [charCode, pos - 1];
				const codePoint = str.codePointAt(pos - 2);
				return codePoint > 65535 ? [codePoint, pos - 2] : [charCode, pos - 1];
			}
		}
	}
	md.inline.State = CjkFriendlyState;
}
//#endregion
//#region packages/markdown-core/src/assistant-transcript-headers.ts
const TRANSCRIPT_ROLES = [
	"assistant",
	"developer",
	"system",
	"user"
];
function isHorizontalWhitespace(char) {
	return char === " " || char === "	";
}
function isLineTrailingWhitespace(char) {
	return isHorizontalWhitespace(char) || char === "\r";
}
function skipHorizontalWhitespace(text, start, end) {
	let cursor = start;
	while (cursor < end && isHorizontalWhitespace(text[cursor])) cursor += 1;
	return cursor;
}
function matchRoleAt(text, start, end) {
	for (const role of TRANSCRIPT_ROLES) {
		const roleEnd = start + role.length;
		if (roleEnd <= end && text.slice(start, roleEnd).toLowerCase() === role) return {
			role,
			end: roleEnd
		};
	}
	return null;
}
function findDelimitedEnd(params) {
	const searchEnd = Math.min(params.lineEnd, params.contentStart + params.maxContentLength + 1);
	let closeAt = -1;
	for (let index = params.contentStart; index < searchEnd; index += 1) {
		const char = params.text[index];
		if (char === "`") return null;
		if (char === params.close) {
			closeAt = index;
			break;
		}
	}
	if (closeAt === -1) return null;
	const contentLength = closeAt - params.contentStart;
	if (contentLength < params.minContentLength || contentLength > params.maxContentLength) return null;
	return closeAt + 1;
}
function isHeaderBoundary(char) {
	return char === void 0 || isLineTrailingWhitespace(char) || char === ":" || char === "：";
}
function matchRoleTimestampHeader(text, start, lineEnd) {
	const role = matchRoleAt(text, start, lineEnd);
	if (!role) return null;
	const bracketStart = skipHorizontalWhitespace(text, role.end, lineEnd);
	if (text[bracketStart] !== "[") return null;
	const headerEnd = findDelimitedEnd({
		text,
		contentStart: bracketStart + 1,
		lineEnd,
		close: "]",
		minContentLength: 1,
		maxContentLength: 160
	});
	if (!headerEnd || !isHeaderBoundary(text[headerEnd])) return null;
	return {
		start,
		end: headerEnd,
		kind: "role_timestamp_bracket",
		role: role.role
	};
}
function matchTimestampRoleHeader(text, start, lineEnd) {
	if (text[start] !== "[") return null;
	const bracketEnd = findDelimitedEnd({
		text,
		contentStart: start + 1,
		lineEnd,
		close: "]",
		minContentLength: 4,
		maxContentLength: 160
	});
	if (!bracketEnd) return null;
	const role = matchRoleAt(text, skipHorizontalWhitespace(text, bracketEnd, lineEnd), lineEnd);
	if (!role) return null;
	const colonAt = skipHorizontalWhitespace(text, role.end, lineEnd);
	if (text[colonAt] !== ":" && text[colonAt] !== "：") return null;
	return {
		start,
		end: colonAt + 1,
		kind: "timestamp_role_colon",
		role: role.role
	};
}
function matchAngleRoleHeader(text, start, lineEnd) {
	if (text[start] !== "<") return null;
	const role = matchRoleAt(text, skipHorizontalWhitespace(text, start + 1, lineEnd), lineEnd);
	const roleBoundary = role ? text[role.end] : void 0;
	if (!role || roleBoundary !== ">" && !isHorizontalWhitespace(roleBoundary)) return null;
	const headerEnd = findDelimitedEnd({
		text,
		contentStart: role.end,
		lineEnd,
		close: ">",
		minContentLength: 0,
		maxContentLength: 160
	});
	if (!headerEnd || !isHeaderBoundary(text[headerEnd])) return null;
	return {
		start,
		end: headerEnd,
		kind: "angle_role_header",
		role: role.role
	};
}
function rangesOverlap$1(left, right) {
	return left.start < right.end && left.end > right.start;
}
/** Finds supported transcript-role headers in parser-visible text. */
function findAssistantTranscriptRoleHeaderSpans(text, excludedRanges = []) {
	if (!text.includes("[") && !text.includes("<")) return [];
	const spans = [];
	const sortedExcludedRanges = [...excludedRanges].toSorted((left, right) => left.start - right.start || left.end - right.end);
	let excludedRangeIndex = 0;
	let lineStart = 0;
	while (lineStart < text.length) {
		const newlineAt = text.indexOf("\n", lineStart);
		const lineEnd = newlineAt === -1 ? text.length : newlineAt;
		const contentStart = skipHorizontalWhitespace(text, lineStart, lineEnd);
		const span = matchTimestampRoleHeader(text, contentStart, lineEnd) ?? matchAngleRoleHeader(text, contentStart, lineEnd) ?? matchRoleTimestampHeader(text, contentStart, lineEnd);
		if (span) {
			for (;;) {
				const excludedRange = sortedExcludedRanges[excludedRangeIndex];
				if (!excludedRange || excludedRange.end > span.start) break;
				excludedRangeIndex += 1;
			}
			const excludedRange = sortedExcludedRanges[excludedRangeIndex];
			if (!excludedRange || !rangesOverlap$1(span, excludedRange)) spans.push(span);
		}
		if (newlineAt === -1) break;
		lineStart = newlineAt + 1;
	}
	return spans;
}
//#endregion
//#region packages/markdown-core/src/html-tags.ts
const MARKDOWN_HTML_TAG_RE = /^(?:<[A-Za-z][A-Za-z0-9-]*(?:\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\s*=\s*(?:[^"'=<>`\x00-\x20]+|'[^']*'|"[^"]*"))?)*\s*\/?>|<\/[A-Za-z][A-Za-z0-9-]*\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<\?[\s\S]*?\?>|<![A-Za-z][^>]*>|<!\[CDATA\[[\s\S]*?\]\]>)/;
function matchMarkdownHtmlTag(source) {
	return MARKDOWN_HTML_TAG_RE.exec(source)?.[0];
}
function htmlTagName(rawTag, closing) {
	let end = closing ? 2 : 1;
	while (end < rawTag.length) {
		const code = rawTag.charCodeAt(end);
		if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122) && !(code >= 48 && code <= 57) && code !== 45) break;
		end += 1;
	}
	return rawTag.slice(closing ? 2 : 1, end).toLowerCase();
}
/** Tokenizes valid open/close HTML tags with Markdown-It's quote-aware grammar. */
function* tokenizeHtmlTags(html) {
	let cursor = 0;
	while (cursor < html.length) {
		const start = html.indexOf("<", cursor);
		if (start < 0) return;
		const raw = matchMarkdownHtmlTag(html.slice(start));
		if (!raw) {
			cursor = start + 1;
			continue;
		}
		const closing = raw.startsWith("</");
		const end = start + raw.length;
		const name = htmlTagName(raw, closing);
		if (!name) {
			cursor = end;
			continue;
		}
		yield {
			raw,
			start,
			end,
			name,
			closing,
			selfClosing: !closing && raw.trimEnd().endsWith("/>")
		};
		cursor = end;
	}
}
//#endregion
//#region packages/markdown-core/src/ir-metadata.ts
const RAW_HTML_TOKEN_TYPE = "markdown_core_html";
function defineMetadata(target, key, value) {
	if (value !== void 0) Object.defineProperty(target, key, {
		configurable: true,
		enumerable: false,
		value,
		writable: true
	});
}
function htmlTags(source) {
	return source?.htmlTags;
}
/** A fragment cannot inherit a whole tag's meaning; spreads omit these parser-owned facts. */
function copyHtmlTags(source, target, start = 0, end = Number.POSITIVE_INFINITY) {
	const tags = [];
	for (const tag of htmlTags(source) ?? []) if (tag.start >= start && tag.end <= end) tags.push({
		...tag,
		start: tag.start - start,
		end: tag.end - start
	});
	if (tags.length) defineMetadata(target, "htmlTags", tags);
	return target;
}
/** Keep separate tag facts and fresh offsets so appending cannot mutate the source. */
function appendHtmlTags(target, source, offset) {
	const incoming = htmlTags(source);
	if (!incoming?.length) return;
	const tags = htmlTags(target) ?? [];
	for (const tag of incoming) tags.push({
		...tag,
		start: offset + tag.start,
		end: offset + tag.end
	});
	defineMetadata(target, "htmlTags", tags);
}
function attachListItemMetadata(item, metadata) {
	const itemWithMetadata = item;
	for (const key of [
		"contentStart",
		"contentEnd",
		"markerOnly",
		"sourceMarker",
		"sourceContent",
		"sourceIndent",
		"sourceStartLine",
		"sourceEndLine"
	]) defineMetadata(itemWithMetadata, key, metadata[key]);
	return itemWithMetadata;
}
function attachBlockMetadata(ir, blocks) {
	if (blocks.length > 0) defineMetadata(ir, "blocks", blocks);
	return ir;
}
function sliceListMarker(marker, start, end) {
	const sliceStart = Math.max(marker.start, start);
	const sliceEnd = Math.min(marker.end, end);
	return sliceEnd > sliceStart ? {
		start: sliceStart - start,
		end: sliceEnd - start
	} : void 0;
}
//#endregion
//#region packages/markdown-core/src/assistant-transcript.ts
const ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE = "assistant_transcript_role_text";
const RAW_CODE_CONTAINER_TAGS = /* @__PURE__ */ new Set([
	"code",
	"pre",
	"script",
	"style",
	"textarea"
]);
function findRawCodeContainerRanges(text) {
	const ranges = [];
	const openTags = [];
	let rangeStart = -1;
	for (const tag of tokenizeHtmlTags(text)) {
		if (!RAW_CODE_CONTAINER_TAGS.has(tag.name)) continue;
		if (tag.closing) {
			const openIndex = openTags.lastIndexOf(tag.name);
			if (openIndex !== -1) {
				openTags.splice(openIndex);
				if (openTags.length === 0 && rangeStart !== -1) {
					ranges.push({
						start: rangeStart,
						end: tag.end
					});
					rangeStart = -1;
				}
			}
		} else if (!tag.selfClosing) {
			if (openTags.length === 0) rangeStart = tag.start;
			openTags.push(tag.name);
		}
	}
	if (openTags.length > 0 && rangeStart !== -1) ranges.push({
		start: rangeStart,
		end: text.length
	});
	return ranges;
}
function visibleTokenProjection(token, options) {
	if (token.type === "softbreak" || token.type === "hardbreak") return {
		text: "\n",
		excludedRanges: []
	};
	if (token.type === "html_inline" && options.isStructuralHtmlInline?.(token) === true) return null;
	if (token.type === "text" || token.type === "html_inline") return {
		text: token.content,
		excludedRanges: []
	};
	if (token.type === "code_inline" || token.type === "markdown_core_html") return {
		text: token.content,
		excludedRanges: [{
			start: 0,
			end: token.content.length
		}]
	};
	if (token.type === "image") return token.children && token.children.length > 0 ? visibleTokensProjection(token.children, options) : {
		text: token.content,
		excludedRanges: []
	};
	return null;
}
function visibleTokensProjection(tokens, options) {
	let text = "";
	const excludedRanges = [];
	for (const token of tokens) {
		const projection = visibleTokenProjection(token, options);
		if (!projection) continue;
		const offset = text.length;
		text += projection.text;
		for (const range of projection.excludedRanges) excludedRanges.push({
			start: offset + range.start,
			end: offset + range.end
		});
	}
	excludedRanges.push(...findRawCodeContainerRanges(text));
	return {
		text,
		excludedRanges
	};
}
function cloneToken(TokenType, source, start, end, type = source.type) {
	const token = new TokenType(type, type === "assistant_transcript_role_text" ? "" : source.tag, 0);
	Object.assign(token, source);
	token.type = type;
	token.content = source.content.slice(start, end);
	token.children = null;
	return copyHtmlTags(source, token, start, end);
}
function annotatedToken(TokenType, source, start, end, span) {
	const token = cloneToken(TokenType, source, start, end, ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE);
	token.meta = {
		...source.meta && typeof source.meta === "object" ? source.meta : {},
		assistantTranscriptRoleHeader: {
			kind: span.kind,
			role: span.role
		}
	};
	return token;
}
function splitVisibleToken(params) {
	const { token, visibleStart } = params;
	const visibleEnd = visibleStart + token.content.length;
	const firstSpan = params.spans[params.spanStartIndex];
	if (!firstSpan || firstSpan.start >= visibleEnd) return [token];
	const result = [];
	let localCursor = 0;
	for (let spanIndex = params.spanStartIndex; spanIndex < params.spans.length; spanIndex += 1) {
		const span = params.spans[spanIndex];
		if (!span || span.start >= visibleEnd) break;
		if (span.end <= visibleStart) continue;
		const overlapStart = Math.max(span.start, visibleStart) - visibleStart;
		const overlapEnd = Math.min(span.end, visibleEnd) - visibleStart;
		if (overlapStart > localCursor) result.push(cloneToken(params.TokenType, token, localCursor, overlapStart));
		if (overlapEnd > overlapStart) result.push(annotatedToken(params.TokenType, token, overlapStart, overlapEnd, span));
		localCursor = overlapEnd;
	}
	if (localCursor < token.content.length) result.push(cloneToken(params.TokenType, token, localCursor, token.content.length));
	return result;
}
function annotateInlineChildren(TokenType, children, preserveLinks, options) {
	const projection = visibleTokensProjection(children, options);
	const spans = findAssistantTranscriptRoleHeaderSpans(projection.text, projection.excludedRanges);
	if (spans.length === 0) return children;
	const result = [];
	let visibleCursor = 0;
	let spanCursor = 0;
	for (const token of children) {
		const tokenProjection = visibleTokenProjection(token, options);
		if (!tokenProjection) {
			result.push(token);
			continue;
		}
		const content = tokenProjection.text;
		for (;;) {
			const span = spans[spanCursor];
			if (!span || span.end > visibleCursor) break;
			spanCursor += 1;
		}
		if (token.type === "text" || token.type === "html_inline") result.push(...splitVisibleToken({
			TokenType,
			token,
			visibleStart: visibleCursor,
			spanStartIndex: spanCursor,
			spans
		}));
		else if (token.type === "image") {
			const visibleEnd = visibleCursor + content.length;
			const imageSpans = [];
			for (let spanIndex = spanCursor; spanIndex < spans.length; spanIndex += 1) {
				const span = spans[spanIndex];
				if (!span || span.start >= visibleEnd) break;
				if (span.end <= visibleCursor) continue;
				imageSpans.push({
					...span,
					start: Math.max(span.start, visibleCursor) - visibleCursor,
					end: Math.min(span.end, visibleEnd) - visibleCursor
				});
			}
			if (imageSpans.length > 0) token.meta = {
				...token.meta && typeof token.meta === "object" ? token.meta : {},
				assistantTranscriptRoleImage: {
					text: content,
					spans: imageSpans
				}
			};
			result.push(token);
		} else result.push(token);
		visibleCursor += content.length;
	}
	return preserveLinks ? result : removeLinksContainingAssistantTranscriptRoles(result);
}
function removeLinksContainingAssistantTranscriptRoles(tokens) {
	const openLinks = [];
	const suppressedLinks = /* @__PURE__ */ new Set();
	for (const token of tokens) {
		if (token.type === "link_open") {
			openLinks.push({
				token,
				containsRole: false
			});
			continue;
		}
		const imageMeta = token.meta?.assistantTranscriptRoleImage;
		if (token.type === "assistant_transcript_role_text" || imageMeta?.spans.length) {
			for (const link of openLinks) link.containsRole = true;
			continue;
		}
		if (token.type !== "link_close") continue;
		const openLink = openLinks.pop();
		if (!openLink?.containsRole) continue;
		suppressedLinks.add(openLink.token);
		suppressedLinks.add(token);
	}
	const result = [];
	for (const token of tokens) {
		if (suppressedLinks.has(token)) continue;
		const previous = result.at(-1);
		if (previous?.type === "assistant_transcript_role_text" && token.type === "assistant_transcript_role_text") {
			appendHtmlTags(previous, token, previous.content.length);
			previous.content += token.content;
			continue;
		}
		result.push(token);
	}
	return result;
}
function annotateHtmlBlock(TokenType, token) {
	const spans = findAssistantTranscriptRoleHeaderSpans(token.content, findRawCodeContainerRanges(token.content));
	if (spans.length === 0) return [token];
	return splitVisibleToken({
		TokenType,
		token,
		visibleStart: 0,
		spanStartIndex: 0,
		spans
	});
}
/** Adds semantic transcript-role tokens to assistant-authored Markdown only. */
function markdownItAssistantTranscriptRoles(md, options = {}) {
	md.core.ruler.after("text_join", "assistant_transcript_roles", (state) => {
		if (state.env?.assistantTranscriptRoleHeaders !== true) return;
		const tokens = [];
		const preserveLinks = state.env?.assistantTranscriptRolePreserveLinks === true;
		for (const token of state.tokens) {
			if (token.type === "inline" && token.children) {
				token.children = annotateInlineChildren(state.Token, token.children, preserveLinks, options);
				tokens.push(token);
				continue;
			}
			if (token.type === "html_block") {
				tokens.push(...annotateHtmlBlock(state.Token, token));
				continue;
			}
			tokens.push(token);
		}
		state.tokens = tokens;
	});
}
//#endregion
//#region packages/markdown-core/src/chunk-text.ts
function normalizeChunkLimit(limit) {
	return Number.isFinite(limit) && limit > 0 ? resolveIntegerOption(limit, 1, { min: 1 }) : limit;
}
function scanParenAwareBreakpoints(text) {
	let lastNewline = -1;
	let lastWhitespace = -1;
	let depth = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);
		if (char === "(") {
			depth += 1;
			continue;
		}
		if (char === ")" && depth > 0) {
			depth -= 1;
			continue;
		}
		if (depth !== 0) continue;
		if (char === "\n") lastNewline = i;
		else if (/\s/.test(char)) lastWhitespace = i;
	}
	return {
		lastNewline,
		lastWhitespace
	};
}
function findPreferredRangeEnd(text, start, end) {
	const slice = text.slice(start, end);
	let paragraphEnd;
	for (const match of slice.matchAll(/\n[\t ]*\n+/g)) if (match.index !== void 0) paragraphEnd = start + match.index + match[0].length;
	if (paragraphEnd !== void 0) return paragraphEnd;
	const newlineIndex = slice.lastIndexOf("\n");
	if (newlineIndex >= 0) return start + newlineIndex + 1;
	for (let index = end - 1; index > start; index -= 1) if (/\s/.test(text.charAt(index))) return index + 1;
}
/**
* Splits text into contiguous UTF-16 ranges without dropping separator whitespace.
* Preferred mode selects paragraph, newline, then whitespace boundaries.
*/
function chunkTextRanges(text, options) {
	if (!text) return [];
	const normalizedLimit = normalizeChunkLimit(options.limit);
	if (normalizedLimit <= 0 || text.length <= normalizedLimit) return [{
		start: 0,
		end: text.length
	}];
	const ranges = [];
	let start = 0;
	while (start < text.length) {
		const maxEnd = Math.min(text.length, start + normalizedLimit);
		const preferredEnd = options.mode === "preferred" && maxEnd < text.length ? findPreferredRangeEnd(text, start, maxEnd) : void 0;
		const end = findGraphemeChunkEnd(text, start, maxEnd, preferredEnd);
		ranges.push({
			start,
			end
		});
		start = end;
	}
	return ranges;
}
/**
* Splits plain text into size-bounded chunks at readable boundaries.
*
* Returns the original text as one chunk when the limit is non-positive.
*/
function chunkText(text, limit) {
	const normalizedLimit = normalizeChunkLimit(limit);
	if (!text) return [];
	if (normalizedLimit <= 0 || text.length <= normalizedLimit) return [text];
	const chunks = [];
	let cursor = 0;
	while (cursor < text.length) {
		if (text.length - cursor <= normalizedLimit) {
			chunks.push(text.slice(cursor));
			break;
		}
		const windowEnd = Math.min(text.length, cursor + normalizedLimit);
		const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(text.slice(cursor, windowEnd));
		const end = findGraphemeChunkEnd(text, cursor, windowEnd, cursor + (lastNewline > 0 ? lastNewline : lastWhitespace));
		chunks.push(text.slice(cursor, end));
		cursor = skipWhitespaceGraphemes(text, end);
	}
	return chunks;
}
//#endregion
//#region packages/markdown-core/src/ir-spans.ts
const autoLinkedMarkdownLinks = /* @__PURE__ */ new WeakSet();
/** Callers supply a fresh span; transforms copy before attaching provenance. */
function createMarkdownLinkSpan(span, autoLinked) {
	if (autoLinked) autoLinkedMarkdownLinks.add(span);
	return span;
}
function copyMarkdownLinkSpan(span, overrides) {
	return createMarkdownLinkSpan({
		...span,
		...overrides
	}, autoLinkedMarkdownLinks.has(span));
}
function isAutoLinkedMarkdownLink(span) {
	return autoLinkedMarkdownLinks.has(span);
}
function createStyleSpan(params) {
	const span = {
		start: params.start,
		end: params.end,
		style: params.style
	};
	if (params.language) span.language = params.language;
	return span;
}
function clipSpans(spans, start, end, copySpan) {
	const clipped = [];
	for (const span of spans) {
		const sliceStart = Math.max(span.start, start);
		const sliceEnd = Math.min(span.end, end);
		if (sliceEnd > sliceStart) {
			const copy = copySpan(span);
			copy.start = sliceStart - start;
			copy.end = sliceEnd - start;
			clipped.push(copy);
		}
	}
	return clipped;
}
function clampStyleSpans(spans, maxLength) {
	return clipSpans(spans, 0, maxLength, createStyleSpan);
}
function clampLinkSpans(spans, maxLength) {
	return clipSpans(spans, 0, maxLength, copyMarkdownLinkSpan);
}
function clampAnnotationSpans(spans, maxLength) {
	return clipSpans(spans, 0, maxLength, (span) => ({ ...span }));
}
function mergeAnnotationSpans(spans) {
	const sorted = [...spans].toSorted((a, b) => a.start - b.start || a.end - b.end);
	const merged = [];
	for (const span of sorted) {
		const previous = merged.at(-1);
		if (previous && previous.end === span.start && previous.type === span.type && previous.kind === span.kind && previous.role === span.role) {
			previous.end = span.end;
			continue;
		}
		merged.push({ ...span });
	}
	return merged;
}
function mergeStyleSpans(spans) {
	const sorted = [...spans].toSorted((a, b) => {
		if (a.start !== b.start) return a.start - b.start;
		if (a.end !== b.end) return a.end - b.end;
		return a.style.localeCompare(b.style);
	});
	const merged = [];
	for (const span of sorted) {
		const previous = merged.at(-1);
		if (previous && previous.style === span.style && previous.language === span.language && (span.start < previous.end || span.start === previous.end && span.style !== "blockquote")) {
			previous.end = Math.max(previous.end, span.end);
			continue;
		}
		merged.push({ ...span });
	}
	return merged;
}
function sliceStyleSpans(spans, start, end) {
	return mergeStyleSpans(clipSpans(spans, start, end, createStyleSpan));
}
function sliceLinkSpans(spans, start, end) {
	return clipSpans(spans, start, end, copyMarkdownLinkSpan);
}
function sliceAnnotationSpans(spans, start, end) {
	return mergeAnnotationSpans(clipSpans(spans, start, end, (span) => ({ ...span })));
}
//#endregion
//#region packages/markdown-core/src/ir-annotations.ts
function rangesOverlap(left, right) {
	return left.start < right.end && left.end > right.start;
}
/** Re-evaluate the first visible line after a transport creates a new message boundary. */
function annotateAssistantTranscriptRoleMessageBoundary(ir) {
	const firstLineEnd = ir.text.indexOf("\n");
	const boundaryText = firstLineEnd === -1 ? ir.text : ir.text.slice(0, firstLineEnd);
	const boundarySpan = findAssistantTranscriptRoleHeaderSpans(boundaryText, ir.styles.filter((span) => span.style === "code" || span.style === "code_block").filter((span) => span.start < boundaryText.length).map(({ start, end }) => ({
		start,
		end: Math.min(end, boundaryText.length)
	})))[0];
	if (!boundarySpan || (ir.annotations ?? []).some((span) => rangesOverlap(span, boundarySpan))) return ir;
	const annotation = {
		...boundarySpan,
		type: "assistant_transcript_role"
	};
	return copyHtmlTags(ir, {
		...ir,
		links: ir.links.filter((link) => !rangesOverlap(link, annotation)),
		annotations: mergeAnnotationSpans([...ir.annotations ?? [], annotation])
	});
}
function appendAssistantTranscriptRoleText(target, value, meta) {
	if (!value) return;
	const start = target.text.length;
	target.text += value;
	target.annotations.push({
		start,
		end: target.text.length,
		type: "assistant_transcript_role",
		kind: meta.kind,
		role: meta.role
	});
}
/** Image alternatives are plain text, including labels projected for annotations. */
function appendImageAlternative(target, meta) {
	if (!meta.text) return;
	const offset = target.text.length;
	target.text += meta.text;
	for (const span of meta.spans) target.annotations.push({
		...span,
		start: offset + span.start,
		end: offset + span.end,
		type: "assistant_transcript_role"
	});
}
//#endregion
//#region packages/markdown-core/src/ir-slice.ts
function normalizeSliceRange(ir, start, end) {
	const textLength = ir.text.length;
	const integerStart = Math.trunc(start) || 0;
	const integerEnd = Math.trunc(end) || 0;
	let normalizedStart = integerStart < 0 ? Math.max(textLength + integerStart, 0) : Math.min(integerStart, textLength);
	let normalizedEnd = integerEnd < 0 ? Math.max(textLength + integerEnd, 0) : Math.min(integerEnd, textLength);
	if (normalizedStart < normalizedEnd) {
		const safeStart = avoidTrailingHighSurrogateBreak(ir.text, 0, normalizedStart);
		if (safeStart !== normalizedStart) normalizedStart = safeStart < normalizedStart ? safeStart : normalizedStart - 1;
		const safeEnd = avoidTrailingHighSurrogateBreak(ir.text, 0, normalizedEnd);
		if (safeEnd !== normalizedEnd) normalizedEnd = safeEnd > normalizedEnd ? safeEnd : normalizedEnd + 1;
	}
	return {
		start: normalizedStart,
		end: normalizedEnd
	};
}
function sliceMarkdownIR(ir, start, end) {
	return sliceNormalizedMarkdownIR(ir, normalizeSliceRange(ir, start, end));
}
function sliceNormalizedMarkdownIR(ir, { start: normalizedStart, end: normalizedEnd }) {
	const metadataIR = ir;
	const annotations = sliceAnnotationSpans(ir.annotations ?? [], normalizedStart, normalizedEnd);
	const listItems = (ir.listItems ?? []).flatMap((item) => {
		const listMarker = item.listMarker ? sliceListMarker(item.listMarker, normalizedStart, normalizedEnd) : void 0;
		const taskMarker = item.taskMarker ? sliceListMarker(item.taskMarker, normalizedStart, normalizedEnd) : void 0;
		const content = item.contentStart !== void 0 && item.contentEnd !== void 0 ? sliceListMarker({
			start: item.contentStart,
			end: item.contentEnd
		}, normalizedStart, normalizedEnd) : void 0;
		return listMarker || taskMarker ? [attachListItemMetadata({
			kind: item.kind,
			...listMarker ? { listMarker } : {},
			...item.task ? { task: true } : {},
			...taskMarker ? { taskMarker } : {},
			...item.listId !== void 0 ? { listId: item.listId } : {},
			...item.parentListId !== void 0 ? { parentListId: item.parentListId } : {},
			...item.depth !== void 0 ? { depth: item.depth } : {},
			...item.start !== void 0 ? { start: Math.max(item.start, normalizedStart) - normalizedStart } : {},
			...item.end !== void 0 ? { end: Math.min(item.end, normalizedEnd) - normalizedStart } : {}
		}, {
			...content ? {
				contentStart: content.start,
				contentEnd: content.end
			} : {},
			...item.markerOnly ? { markerOnly: true } : {},
			sourceMarker: item.sourceMarker,
			sourceContent: item.sourceContent,
			sourceIndent: item.sourceIndent,
			sourceStartLine: item.sourceStartLine,
			sourceEndLine: item.sourceEndLine
		})] : [];
	});
	const blocks = (metadataIR.blocks ?? []).flatMap((block) => {
		if (block.start === block.end) return (normalizedStart === normalizedEnd ? block.start === normalizedStart : block.start >= normalizedStart && block.start < normalizedEnd) ? [{
			...block,
			start: block.start - normalizedStart,
			end: block.end - normalizedStart
		}] : [];
		const sliced = sliceListMarker(block, normalizedStart, normalizedEnd);
		return sliced ? [{
			...block,
			...sliced
		}] : [];
	});
	return copyHtmlTags(ir, attachBlockMetadata({
		text: ir.text.slice(normalizedStart, normalizedEnd),
		styles: sliceStyleSpans(ir.styles, normalizedStart, normalizedEnd),
		links: sliceLinkSpans(ir.links, normalizedStart, normalizedEnd),
		...annotations.length > 0 ? { annotations } : {},
		...listItems.length > 0 ? { listItems } : {}
	}, blocks), normalizedStart, normalizedEnd);
}
/** Chunkers supply ordered, disjoint ranges; metadata itself need not be sorted. */
function sliceMarkdownIRRanges(ir, ranges) {
	const partitions = ranges.map(({ start, end }) => ({
		range: normalizeSliceRange(ir, start, end),
		metadata: {
			text: ir.text,
			styles: [],
			links: []
		}
	}));
	function visitRanges(start, end, visit) {
		let low = 0;
		let high = partitions.length;
		while (low < high) {
			const middle = Math.floor((low + high) / 2);
			const partition = partitions[middle];
			if (partition && partition.range.end < start) low = middle + 1;
			else high = middle;
		}
		for (let index = low; index < partitions.length; index += 1) {
			const partition = partitions[index];
			if (!partition || partition.range.start > end) break;
			visit(partition.metadata, index);
		}
	}
	for (const span of ir.styles) visitRanges(span.start, span.end, (metadata) => metadata.styles.push(span));
	for (const span of ir.links) visitRanges(span.start, span.end, (metadata) => metadata.links.push(span));
	for (const span of ir.annotations ?? []) visitRanges(span.start, span.end, (metadata) => (metadata.annotations ??= []).push(span));
	for (const item of ir.listItems ?? []) {
		const visited = /* @__PURE__ */ new Set();
		for (const marker of [item.listMarker, item.taskMarker]) {
			if (!marker) continue;
			visitRanges(marker.start, marker.end, (metadata, index) => {
				if (!visited.has(index)) {
					visited.add(index);
					(metadata.listItems ??= []).push(item);
				}
			});
		}
	}
	const metadataIR = ir;
	for (const block of metadataIR.blocks ?? []) visitRanges(block.start, block.end, (metadata) => (metadata.blocks ??= []).push(block));
	for (const tag of ir.htmlTags ?? []) {
		let low = 0;
		let high = partitions.length;
		while (low < high) {
			const middle = Math.floor((low + high) / 2);
			const partition = partitions[middle];
			if (partition && partition.range.end < tag.end) low = middle + 1;
			else high = middle;
		}
		for (let index = low; index < partitions.length; index += 1) {
			const partition = partitions[index];
			if (!partition || partition.range.start > tag.start) break;
			(partition.metadata.htmlTags ??= []).push(tag);
		}
	}
	return partitions.map(({ metadata, range }) => sliceNormalizedMarkdownIR(metadata, range));
}
//#endregion
//#region packages/markdown-core/src/ir-source-spacing.ts
/** Prepare the next mapped block start for each token in one reverse pass. */
function computeNextMappedBlockStarts(tokens) {
	const nextStarts = [];
	let nextStart;
	for (let index = tokens.length - 1; index >= 0; index -= 1) {
		nextStarts[index] = nextStart;
		const currentStart = tokens[index]?.map?.[0];
		if (currentStart !== void 0) nextStart = currentStart;
	}
	return nextStarts;
}
function sourceBlockNewlineCount(preserveSourceBlockSpacing, nextBlockStart, blockLineEnd) {
	if (!preserveSourceBlockSpacing || blockLineEnd === void 0) return;
	return nextBlockStart === void 0 ? 0 : Math.max(1, nextBlockStart - blockLineEnd + 1);
}
//#endregion
//#region packages/markdown-core/src/table-layout.ts
/** Shared bullet layout, including the newline contributed by empty rows. */
function renderMarkdownTableBullets(headers, rows, writeText, writeCell) {
	const labeled = headers.length > 1;
	for (const row of rows) {
		if (labeled && row[0]?.text) {
			writeCell(row[0], true);
			writeText("\n");
		}
		for (let index = labeled ? 1 : 0; index < row.length; index += 1) {
			const value = row[index];
			if (!value?.text) continue;
			writeText("• ");
			const header = headers[index];
			if (header?.text) {
				writeCell(header, false);
				writeText(": ");
			} else if (labeled) writeText(`Column ${index}: `);
			writeCell(value, false);
			writeText("\n");
		}
		writeText("\n");
	}
}
/** Render the existing aligned, plain-text representation without a Markdown fence. */
function renderMarkdownCodeTable(headers, rows) {
	const measured = [headers, ...rows].map((row) => row.map((text) => ({
		text,
		width: visibleWidth(text)
	})));
	const widths = [];
	for (const row of measured) for (const [index, cell] of row.entries()) widths[index] = Math.max(widths[index] ?? 3, cell.width);
	if (widths.length === 0) return "";
	const renderRow = (row) => `|${widths.map((width, index) => ` ${row[index]?.text ?? ""}${" ".repeat(width - (row[index]?.width ?? 0))} |`).join("")}`;
	const divider = widths.map((width) => ({
		text: "-".repeat(width),
		width
	}));
	measured.splice(1, 0, divider);
	return [...measured.map(renderRow), ""].join("\n");
}
//#endregion
//#region packages/markdown-core/src/ir.ts
const INLINE_STYLE_BY_TOKEN = /* @__PURE__ */ new Map([
	["underline_open", "underline"],
	["underline_close", "underline"],
	["em_open", "italic"],
	["em_close", "italic"],
	["strong_open", "bold"],
	["strong_close", "bold"],
	["s_open", "strikethrough"],
	["s_close", "strikethrough"],
	["spoiler_open", "spoiler"],
	["spoiler_close", "spoiler"]
]);
const HEADING_STYLE_BY_TAG = /* @__PURE__ */ new Map([
	["h1", "heading_1"],
	["h2", "heading_2"],
	["h3", "heading_3"],
	["h4", "heading_4"],
	["h5", "heading_5"],
	["h6", "heading_6"]
]);
/** Private source coordinates do not change the serialized native-table payload. */
function getMarkdownTableSource(table) {
	return table.source;
}
function appendHeadingSeparator(state, nextBlockStart) {
	const newlineCount = sourceBlockNewlineCount(state.preserveSourceBlockSpacing, nextBlockStart, state.headingLineEnd);
	if (newlineCount === void 0) {
		appendParagraphSeparator(state, void 0, nextBlockStart);
		return;
	}
	if (newlineCount > 0) state.text += "\n".repeat(newlineCount);
	state.headingLineEnd = void 0;
}
const markdownParsers = /* @__PURE__ */ new Map();
function createMarkdownIt(options) {
	const key = (options.linkify ?? true ? 1 : 0) | (options.preserveDunderIdentifiers ? 2 : 0) | (options.enableTaskLists ? 4 : 0) | (options.enableHtmlUnderline ? 8 : 0) | (options.enableSpoilers ? 16 : 0) | (options.tableMode && options.tableMode !== "off" ? 32 : 0) | (options.autolink === false ? 64 : 0);
	const prepared = markdownParsers.get(key);
	if (prepared) return prepared;
	const md = new MarkdownItCallable({
		html: false,
		linkify: options.linkify ?? true,
		breaks: false,
		typographer: false
	});
	md.linkify.set({ fuzzyLink: true });
	md.use(markdownItCjkFriendlyPlugin);
	md.use(markdownItAssistantTranscriptRoles);
	if (options.preserveDunderIdentifiers) md.inline.ruler.before("emphasis", "markdown_core_dunder_identifiers", preserveDunderIdentifier);
	if (options.enableTaskLists) md.core.ruler.before("inline", "markdown_core_task_lists", protectTaskListMarkers);
	const enableHtmlUnderline = options.enableHtmlUnderline === true;
	md.inline.ruler.before("html_inline", RAW_HTML_TOKEN_TYPE, (state, silent) => parseHtmlLexeme(state, silent, enableHtmlUnderline));
	if (options.enableSpoilers) md.core.ruler.before("assistant_transcript_roles", "markdown_core_spoilers", (state) => {
		applySpoilerTokens(state.tokens);
	});
	md.enable("strikethrough");
	if (options.tableMode && options.tableMode !== "off") {
		md.enable("table");
		md.block.ruler.before("table", "markdown_core_table_source", (state, line, _end, silent) => {
			const env = state.env;
			if (!silent && env.tableSourceColumns) {
				const start = (state.bMarks[line] ?? 0) + (state.tShift[line] ?? 0);
				env.tableSourceColumns.set(line, start - state.src.lastIndexOf("\n", start - 1) - 1);
			}
			return false;
		});
	} else md.disable("table");
	if (options.autolink === false) md.disable("autolink");
	markdownParsers.set(key, md);
	return md;
}
/** Count fenced code body characters using the same block grammar as rendering. */
function countMarkdownFencedCodeChars(markdown) {
	if (!markdown.includes("```") && !markdown.includes("~~~")) return 0;
	const parser = createMarkdownIt({
		linkify: false,
		autolink: false,
		tableMode: "bullets"
	});
	let count = 0;
	for (const token of parser.parse(markdown, {})) if (token.type === "fence") count += token.content.length - (token.content.endsWith("\n") ? 1 : 0);
	return count;
}
function preserveDunderIdentifier(state, silent) {
	const match = /^__[\p{L}_][\p{L}\p{N}_]*__/u.exec(state.src.slice(state.pos, state.posMax));
	if (!match) return false;
	const identifier = match[0];
	const end = state.pos + identifier.length;
	const before = state.src[state.pos - 1];
	const beforeBefore = state.src[state.pos - 2];
	const after = end < state.posMax ? state.src[end] : void 0;
	const member = before === ".";
	const call = after === "(";
	const functionArgument = before === "(" && /[\p{L}\p{N}_]/u.test(beforeBefore ?? "");
	if (!member && !call && !functionArgument && !(after === "[")) return false;
	if (!silent) state.push("text", "", 0).content = identifier;
	state.pos = end;
	return true;
}
function protectTaskListMarkers(state) {
	const stack = [];
	for (const token of state.tokens) {
		if (token.type === "list_item_open") {
			stack.push({ contentStarted: false });
			continue;
		}
		if (token.type === "list_item_close") {
			stack.pop();
			continue;
		}
		const item = stack.at(-1);
		if (!item || item.contentStarted) continue;
		if (token.type === "inline") {
			item.contentStarted = true;
			if (/^\[[ xX]\](?:[ \t]|\n|$)/u.test(token.content ?? "")) {
				token.taskListMarker = true;
				token.content = `\\${token.content}`;
			}
			continue;
		}
		if (token.type !== "paragraph_open") item.contentStarted = true;
	}
}
function parseHtmlLexeme(state, silent, enableUnderline) {
	if (state.src.charCodeAt(state.pos) !== 60) return false;
	const raw = matchMarkdownHtmlTag(state.src.slice(state.pos));
	if (!raw) return false;
	const tag = tokenizeHtmlTags(raw).next().value;
	const underlineTag = enableUnderline && tag && (tag.name === "u" || tag.name === "ins") ? tag : void 0;
	if (!silent) {
		const token = state.push(!underlineTag || underlineTag.selfClosing ? RAW_HTML_TOKEN_TYPE : underlineTag.closing ? "underline_close" : "underline_open", "", 0);
		if (!underlineTag || underlineTag.selfClosing) {
			token.content = raw;
			if (tag) defineMetadata(token, "htmlTags", [tag]);
		}
	}
	state.pos += raw.length;
	return true;
}
function getAttr(token, name) {
	if (token.attrGet) return token.attrGet(name);
	if (token.attrs) {
		for (const [key, value] of token.attrs) if (key === name) return value;
	}
	return null;
}
function markdownTableAlignmentFromToken(token) {
	const value = getAttr(token, "style") ?? "";
	if (/text-align\s*:\s*left/i.test(value)) return "left";
	if (/text-align\s*:\s*center/i.test(value)) return "center";
	if (/text-align\s*:\s*right/i.test(value)) return "right";
}
function createTextToken(base, content) {
	return {
		...base,
		type: "text",
		content,
		children: void 0
	};
}
function applySpoilerTokens(tokens) {
	for (const token of tokens) if (token.children && token.children.length > 0) token.children = injectSpoilersIntoInline(token.children);
}
function injectSpoilersIntoInline(tokens) {
	let totalDelims = 0;
	for (const token of tokens) {
		if (token.type !== "text") continue;
		const content = token.content ?? "";
		let i = 0;
		while (i < content.length) {
			const next = content.indexOf("||", i);
			if (next === -1) break;
			totalDelims += 1;
			i = next + 2;
		}
	}
	if (totalDelims < 2) return tokens;
	const usableDelims = totalDelims - totalDelims % 2;
	const result = [];
	const state = { spoilerOpen: false };
	let consumedDelims = 0;
	for (const token of tokens) {
		if (token.type !== "text") {
			result.push(token);
			continue;
		}
		const content = token.content ?? "";
		if (!content.includes("||")) {
			result.push(token);
			continue;
		}
		let index = 0;
		while (index < content.length) {
			const next = content.indexOf("||", index);
			if (next === -1) {
				if (index < content.length) result.push(createTextToken(token, content.slice(index)));
				break;
			}
			if (consumedDelims >= usableDelims) {
				result.push(createTextToken(token, content.slice(index)));
				break;
			}
			if (next > index) result.push(createTextToken(token, content.slice(index, next)));
			consumedDelims += 1;
			state.spoilerOpen = !state.spoilerOpen;
			result.push({ type: state.spoilerOpen ? "spoiler_open" : "spoiler_close" });
			index = next + 2;
		}
	}
	return result;
}
function initRenderTarget() {
	return {
		text: "",
		styles: [],
		openStyles: [],
		links: [],
		linkStack: [],
		annotations: []
	};
}
function resolveRenderTarget(state) {
	return state.table?.currentCell ?? state;
}
function appendText(state, value, provenance) {
	if (!value) return;
	const target = resolveRenderTarget(state);
	appendHtmlTags(target, provenance, target.text.length);
	target.text += value;
}
function openStyle(state, style) {
	const target = resolveRenderTarget(state);
	target.openStyles.push({
		style,
		start: target.text.length
	});
}
function closeStyle(state, style, options) {
	const target = resolveRenderTarget(state);
	for (let i = target.openStyles.length - 1; i >= 0; i -= 1) {
		const open = target.openStyles.at(i);
		if (open?.style === style) {
			const start = open.start;
			target.openStyles.splice(i, 1);
			const end = options?.trimTrailingParagraphSeparator && target.text.endsWith("\n\n") ? target.text.length - 2 : target.text.length;
			if (end > start) target.styles.push({
				start,
				end,
				style
			});
			return;
		}
	}
}
function appendParagraphSeparator(state, token, nextBlockStart) {
	if (state.table) return;
	if (state.env.listStack.length > 0) {
		const directListParagraphLevel = (state.env.listStack[state.env.listStack.length - 1]?.openLevel ?? 0) + 2;
		const itemEnd = state.openListItems.at(-1)?.sourceEndLine;
		if (!(nextBlockStart !== void 0 && itemEnd !== void 0 && nextBlockStart < itemEnd) && (token?.type !== "paragraph_close" || token.hidden || token.level !== directListParagraphLevel)) return;
	}
	state.text += token?.hidden ? "\n" : "\n\n";
}
function appendTopLevelListSeparator(state) {
	if (!state.text.endsWith("\n\n")) state.text += "\n";
}
function appendNestedListSeparator(state) {
	if (!state.text.endsWith("\n")) state.text += "\n";
}
function appendListPrefix(state, isTask) {
	const stack = state.env.listStack;
	const top = stack[stack.length - 1];
	if (!top) return;
	top.index += 1;
	const itemStart = state.text.length;
	const indent = "  ".repeat(Math.max(0, stack.length - 1));
	const prefix = top.type === "ordered" ? `${top.index}. ` : "• ";
	state.text += indent;
	const markerStart = state.text.length;
	state.text += prefix;
	return {
		kind: top.type,
		listMarker: {
			start: markerStart,
			end: state.text.length
		},
		listId: top.id,
		...top.parentId !== void 0 ? { parentListId: top.parentId } : {},
		depth: stack.length - 1,
		start: itemStart,
		...isTask ? { task: true } : {}
	};
}
function recordTaskMarker(state, content) {
	const item = state.openListItems.at(-1);
	if (!item?.task || item.taskMarker) return;
	const marker = /^\[[ xX]\][ \t]?/u.exec(content)?.[0];
	if (marker) {
		const start = resolveRenderTarget(state).text.length;
		item.taskMarker = {
			start,
			end: start + marker.length
		};
	}
}
function recordListSourceMetadata(state, item, token) {
	if (!token.map) return;
	const { lines, starts, openedByLine } = state.sourceIndex ??= indexSourceLines(state.source);
	const [startLine, endLine] = token.map;
	item.sourceStartLine = startLine;
	item.sourceEndLine = endLine;
	const line = lines[startLine] ?? "";
	const candidates = [...line.matchAll(/(?:^|[\t >])([-*+]|\d{1,9}[.)])(?=[\t ]|$)/gu)];
	const markerIndex = openedByLine.get(startLine) ?? 0;
	openedByLine.set(startLine, markerIndex + 1);
	const candidate = candidates[Math.min(markerIndex, candidates.length - 1)];
	const marker = candidate?.[1];
	if (!candidate || !marker) return;
	const markerOffset = candidate.index + candidate[0].lastIndexOf(marker);
	const markerEnd = markerOffset + marker.length;
	let paddingEnd = markerEnd;
	while (paddingEnd < line.length && /[\t ]/u.test(line[paddingEnd] ?? "")) paddingEnd += 1;
	const markerColumn = markdownSourceColumn(line.slice(0, markerEnd));
	const paddingColumns = markdownSourceColumn(line.slice(0, paddingEnd)) - markerColumn;
	item.sourceIndent = markerColumn + (paddingColumns === 0 || paddingColumns > 4 ? 1 : paddingColumns);
	const contentOffset = paddingColumns > 4 ? Math.min(markerEnd + 1, paddingEnd) : paddingEnd;
	const lineStart = starts[startLine] ?? 0;
	item.sourceMarker = {
		start: lineStart + markerOffset,
		end: lineStart + markerOffset + marker.length
	};
	item.sourceContent = {
		start: lineStart + contentOffset,
		end: starts[endLine] ?? state.source.length
	};
	if (!line.slice(contentOffset).replace(/[ \t\r\n]/gu, "")) item.markerOnly = true;
}
function renderInlineCode(state, content) {
	if (!content) return;
	const target = resolveRenderTarget(state);
	const start = target.text.length;
	target.text += content;
	target.styles.push({
		start,
		end: start + content.length,
		style: "code"
	});
}
function resolveFenceLanguage(info) {
	return info?.trim().split(/\s+/, 1)[0]?.trim() || void 0;
}
function renderCodeBlock(state, content, info, sourceNewlineCount, origin, sourceMap, codeClosed) {
	let code = content ?? "";
	if (!code.endsWith("\n")) code = `${code}\n`;
	const target = resolveRenderTarget(state);
	const start = target.text.length;
	const language = resolveFenceLanguage(info);
	target.text += code;
	target.styles.push(createStyleSpan({
		start,
		end: start + code.length,
		style: "code_block",
		language
	}));
	state.blocks.push({
		kind: "code_block",
		start,
		end: start + code.length,
		depth: state.env.listStack.length + state.blockquoteStack.length + 1,
		blockquoteDepth: state.blockquoteStack.length,
		codeOrigin: origin,
		...codeClosed !== void 0 ? { codeClosed } : {},
		...language ? { language } : {},
		...sourceMap ? {
			sourceStartLine: sourceMap[0],
			sourceEndLine: sourceMap[1]
		} : {}
	});
	if (state.env.listStack.length === 0) {
		const extraNewlines = sourceNewlineCount === void 0 ? 1 : Math.max(0, sourceNewlineCount - 1);
		target.text += "\n".repeat(extraNewlines);
	}
}
function isFenceClosed(token) {
	const sourceLines = (token.map?.[1] ?? 0) - (token.map?.[0] ?? 0);
	const content = token.content ?? "";
	return sourceLines >= (content.match(/\n/gu)?.length ?? 0) + (content && !content.endsWith("\n") ? 1 : 0) + 2;
}
function markdownSourceColumn(text) {
	let column = 0;
	for (const character of text) column += character === "	" ? 4 - column % 4 : 1;
	return column;
}
function handleLinkClose(state) {
	const target = resolveRenderTarget(state);
	const link = target.linkStack.pop();
	if (!link?.href) return;
	const href = link.href.trim();
	if (!href) return;
	const start = link.labelStart;
	const end = target.text.length;
	const span = createMarkdownLinkSpan({
		start,
		end,
		href
	}, link.autoLinked);
	target.links.push(span);
}
function initTableState() {
	return {
		sourceHeaders: [],
		sourceRows: [],
		currentSourceRow: [],
		headers: [],
		rows: [],
		aligns: [],
		currentRow: [],
		currentCell: null,
		inHeader: false
	};
}
function finishTableCell(cell) {
	closeRemainingStyles(cell);
	return copyHtmlTags(cell, {
		text: cell.text,
		styles: cell.styles,
		links: cell.links,
		...cell.annotations.length > 0 ? { annotations: cell.annotations } : {}
	});
}
function trimCell(cell) {
	const text = cell.text;
	let start = text.length - text.trimStart().length;
	let end = text.trimEnd().length;
	for (const span of cell.styles) if (span.style === "code") {
		start = Math.min(start, span.start);
		end = Math.max(end, span.end);
	}
	return start === 0 && end === text.length ? cell : sliceMarkdownIR(cell, start, end);
}
function appendCell(state, cell) {
	if (!cell.text) return;
	const start = state.text.length;
	appendHtmlTags(state, cell, start);
	state.text += cell.text;
	for (const span of cell.styles) state.styles.push({
		start: start + span.start,
		end: start + span.end,
		style: span.style
	});
	for (const link of cell.links) state.links.push(copyMarkdownLinkSpan(link, {
		start: start + link.start,
		end: start + link.end
	}));
	for (const annotation of cell.annotations ?? []) state.annotations.push({
		...annotation,
		start: start + annotation.start,
		end: start + annotation.end
	});
}
function collectTableBlock(state) {
	if (!state.table) return;
	const headerCells = state.table.headers.map(trimCell);
	const rowCells = state.table.rows.map((row) => row.map(trimCell));
	const table = {
		headers: headerCells.map((cell) => cell.text),
		rows: rowCells.map((row) => row.map((cell) => cell.text)),
		headerCells,
		rowCells,
		placeholderOffset: state.text.length,
		...state.table.aligns.some(Boolean) ? { aligns: [...state.table.aligns] } : {}
	};
	state.collectedTables.push(table);
	if (state.table.sourceLines) {
		const [first, after] = state.table.sourceLines;
		const { lines, starts } = state.sourceIndex ??= indexSourceLines(state.source);
		const column = state.env.tableSourceColumns?.get(first) ?? 0;
		defineMetadata(table, "source", {
			start: (starts[first] ?? 0) + column,
			end: (starts[after - 1] ?? 0) + (lines[after - 1]?.length ?? 0),
			prefix: (lines[first] ?? "").slice(0, column).replace(/[^\t >]/gu, " "),
			headers: state.table.sourceHeaders,
			rows: state.table.sourceRows
		});
	}
}
function renderTableAsBullets(state) {
	if (!state.table) return;
	renderMarkdownTableBullets(state.table.headers.map(trimCell), state.table.rows.map((row) => row.map(trimCell)), (text) => {
		state.text += text;
	}, (cell, rowLabel) => {
		const start = state.text.length;
		appendCell(state, cell);
		if (rowLabel) state.styles.push({
			start,
			end: state.text.length,
			style: "bold"
		});
	});
}
function renderTableAsCode(state) {
	if (!state.table) return;
	const code = renderMarkdownCodeTable(state.table.headers.map((cell) => trimCell(cell).text), state.table.rows.map((row) => row.map((cell) => trimCell(cell).text)));
	if (!code) return;
	const start = state.text.length;
	state.text += code;
	state.styles.push({
		start,
		end: state.text.length,
		style: "code_block"
	});
	if (state.env.listStack.length === 0) state.text += "\n";
}
function renderTokens(tokens, state) {
	const nextMappedBlockStarts = computeNextMappedBlockStarts(tokens);
	for (const [tokenIndex, token] of tokens.entries()) {
		const inlineStyle = INLINE_STYLE_BY_TOKEN.get(token.type);
		if (inlineStyle) {
			if (inlineStyle !== "spoiler" || state.enableSpoilers) {
				if (token.type.endsWith("_open")) openStyle(state, inlineStyle);
				else closeStyle(state, inlineStyle);
			}
			continue;
		}
		switch (token.type) {
			case "inline":
				if (state.table?.currentCell) state.table.currentSourceRow.push(token.content ?? "");
				if (token.children) renderTokens(token.children, state);
				break;
			case "text":
				recordTaskMarker(state, token.content ?? "");
				appendText(state, token.content ?? "", token);
				break;
			case ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE: {
				const meta = token.meta?.assistantTranscriptRoleHeader;
				if (meta) {
					const target = resolveRenderTarget(state);
					appendHtmlTags(target, token, target.text.length);
					appendAssistantTranscriptRoleText(target, token.content ?? "", meta);
				} else appendText(state, token.content ?? "", token);
				break;
			}
			case "code_inline":
				renderInlineCode(state, token.content ?? "");
				break;
			case "link_open": {
				const target = resolveRenderTarget(state);
				const href = getAttr(token, "href") ?? "";
				target.linkStack.push({
					href,
					labelStart: target.text.length,
					autoLinked: token.markup === "linkify"
				});
				break;
			}
			case "link_close":
				handleLinkClose(state);
				break;
			case "image": {
				const meta = token.meta?.assistantTranscriptRoleImage;
				appendImageAlternative(resolveRenderTarget(state), meta ?? {
					text: token.content ?? "",
					spans: []
				});
				break;
			}
			case "softbreak":
			case "hardbreak":
				appendText(state, "\n");
				break;
			case "paragraph_close":
				appendParagraphSeparator(state, token, nextMappedBlockStarts[tokenIndex]);
				break;
			case "heading_open":
				state.headingLineEnd = token.map?.[1];
				state.headingBlock = {
					kind: "heading",
					start: state.text.length,
					end: state.text.length,
					depth: state.env.listStack.length + state.blockquoteStack.length + 1,
					blockquoteDepth: state.blockquoteStack.length,
					headingLevel: Number.parseInt(token.tag?.slice(1) ?? "", 10),
					headingOrigin: token.markup?.startsWith("#") ? "atx" : "setext",
					...token.map ? {
						sourceStartLine: token.map[0],
						sourceEndLine: token.map[1]
					} : {}
				};
				if (state.headingStyle === "bold") openStyle(state, "bold");
				else if (state.headingStyle === "rich") {
					const style = HEADING_STYLE_BY_TAG.get(token.tag ?? "");
					if (style) openStyle(state, style);
				}
				break;
			case "heading_close":
				if (state.headingStyle === "bold") closeStyle(state, "bold");
				else if (state.headingStyle === "rich") {
					const style = HEADING_STYLE_BY_TAG.get(token.tag ?? "");
					if (style) closeStyle(state, style);
				}
				if (state.headingBlock) state.blocks.push({
					...state.headingBlock,
					end: state.text.length
				});
				state.headingBlock = void 0;
				appendHeadingSeparator(state, nextMappedBlockStarts[tokenIndex]);
				break;
			case "blockquote_open":
				if (state.blockquotePrefix) state.text += state.blockquotePrefix;
				state.blockquoteStack.push({
					start: state.text.length,
					depth: state.env.listStack.length + state.blockquoteStack.length + 1,
					blockquoteDepth: state.blockquoteStack.length + 1,
					...token.map ? {
						sourceStartLine: token.map[0],
						sourceEndLine: token.map[1]
					} : {}
				});
				openStyle(state, "blockquote");
				break;
			case "blockquote_close": {
				closeStyle(state, "blockquote", { trimTrailingParagraphSeparator: true });
				const blockquote = state.blockquoteStack.pop();
				const end = Math.max(blockquote?.start ?? 0, state.text.endsWith("\n\n") ? state.text.length - 2 : state.text.length);
				if (blockquote) state.blocks.push({
					kind: "blockquote",
					...blockquote,
					end
				});
				break;
			}
			case "bullet_list_open":
			case "ordered_list_open": {
				if (state.env.listStack.length > 0) appendNestedListSeparator(state);
				const ordered = token.type === "ordered_list_open";
				state.env.listStack.push({
					type: ordered ? "ordered" : "bullet",
					index: ordered ? Number(getAttr(token, "start") ?? "1") - 1 : 0,
					openLevel: token.level ?? 0,
					id: state.nextListId++,
					...state.env.listStack.at(-1)?.id !== void 0 ? { parentId: state.env.listStack.at(-1)?.id } : {}
				});
				break;
			}
			case "bullet_list_close":
			case "ordered_list_close":
				state.env.listStack.pop();
				if (state.env.listStack.length === 0) appendTopLevelListSeparator(state);
				break;
			case "list_item_open": {
				const leadingInline = tokens[tokenIndex + 1]?.type === "paragraph_open" ? tokens[tokenIndex + 2] : void 0;
				const item = appendListPrefix(state, leadingInline?.type === "inline" && leadingInline.taskListMarker === true);
				if (item) {
					recordListSourceMetadata(state, item, token);
					state.openListItems.push(item);
				}
				break;
			}
			case "list_item_close": {
				const item = state.openListItems.pop();
				if (item) {
					const end = state.text.length;
					const markerEnd = item.listMarker?.end ?? item.start ?? end;
					let contentStart = markerEnd;
					while (contentStart < end && /[ \t\r\n]/u.test(state.text[contentStart] ?? "")) contentStart += 1;
					let contentEnd = end;
					while (contentEnd > contentStart && /[ \t\r\n]/u.test(state.text[contentEnd - 1] ?? "")) contentEnd -= 1;
					const markerLineEnd = state.text.indexOf("\n", markerEnd);
					const markerContentEnd = markerLineEnd === -1 ? end : Math.min(markerLineEnd, end);
					const markerOnly = !state.text.slice(markerEnd, markerContentEnd).replace(/[ \t\r\n]/gu, "");
					const listItem = {
						kind: item.kind,
						...item.listMarker ? { listMarker: item.listMarker } : {},
						...item.task ? { task: true } : {},
						...item.taskMarker ? { taskMarker: item.taskMarker } : {},
						...item.listId !== void 0 ? { listId: item.listId } : {},
						...item.parentListId !== void 0 ? { parentListId: item.parentListId } : {},
						...item.depth !== void 0 ? { depth: item.depth } : {},
						...item.start !== void 0 ? { start: item.start } : {},
						end
					};
					state.listItems.push(attachListItemMetadata(listItem, {
						...contentEnd > contentStart ? {
							contentStart,
							contentEnd
						} : {},
						...(item.sourceMarker ? item.markerOnly : markerOnly) ? { markerOnly: true } : {},
						sourceMarker: item.sourceMarker,
						sourceContent: item.sourceContent,
						sourceIndent: item.sourceIndent,
						sourceStartLine: item.sourceStartLine,
						sourceEndLine: item.sourceEndLine
					}));
				}
				if (!state.text.endsWith("\n")) state.text += "\n";
				break;
			}
			case "code_block":
			case "fence":
				renderCodeBlock(state, token.content ?? "", token.info, sourceBlockNewlineCount(state.preserveSourceBlockSpacing, nextMappedBlockStarts[tokenIndex], token.map?.[1]), token.type === "fence" ? "fenced" : "indented", token.map, token.type === "fence" ? isFenceClosed(token) : void 0);
				break;
			case "html_block":
			case "html_inline":
			case RAW_HTML_TOKEN_TYPE:
				appendText(state, token.content ?? "", token);
				break;
			case "table_open":
				if (state.tableMode !== "off") {
					state.table = initTableState();
					state.table.sourceLines = token.map ?? void 0;
					state.hasTables = true;
				}
				break;
			case "table_close":
				if (state.table) {
					if (state.tableMode === "bullets") renderTableAsBullets(state);
					else if (state.tableMode === "code") renderTableAsCode(state);
					else if (state.tableMode === "block") collectTableBlock(state);
				}
				state.table = null;
				break;
			case "thead_open":
				if (state.table) state.table.inHeader = true;
				break;
			case "thead_close":
				if (state.table) state.table.inHeader = false;
				break;
			case "tbody_open":
			case "tbody_close": break;
			case "tr_open":
				if (state.table) {
					state.table.currentRow = [];
					state.table.currentSourceRow = [];
				}
				break;
			case "tr_close":
				if (state.table) {
					if (state.table.inHeader) {
						state.table.headers = state.table.currentRow;
						state.table.sourceHeaders = state.table.currentSourceRow;
					} else {
						state.table.rows.push(state.table.currentRow);
						state.table.sourceRows.push(state.table.currentSourceRow);
					}
					state.table.currentRow = [];
				}
				break;
			case "th_open":
			case "td_open":
				if (state.table) {
					state.table.currentCell = initRenderTarget();
					if (token.type === "th_open" && state.table.inHeader) state.table.aligns[state.table.currentRow.length] = markdownTableAlignmentFromToken(token);
				}
				break;
			case "th_close":
			case "td_close":
				if (state.table?.currentCell) {
					state.table.currentRow.push(finishTableCell(state.table.currentCell));
					state.table.currentCell = null;
				}
				break;
			case "hr":
				{
					const start = state.text.length;
					if (state.horizontalRuleText) state.text += `${state.horizontalRuleText}\n\n`;
					state.blocks.push({
						kind: "thematic_break",
						start,
						end: start + state.horizontalRuleText.length,
						depth: state.env.listStack.length + state.blockquoteStack.length + 1,
						blockquoteDepth: state.blockquoteStack.length,
						...token.map ? {
							sourceStartLine: token.map[0],
							sourceEndLine: token.map[1]
						} : {}
					});
				}
				break;
			default: if (token.children) renderTokens(token.children, state);
		}
	}
}
function closeRemainingStyles(target) {
	for (const open of target.openStyles.toReversed()) {
		const end = target.text.length;
		if (end > open.start) target.styles.push({
			start: open.start,
			end,
			style: open.style
		});
	}
	target.openStyles = [];
}
function appendSpans(into, spans, offset) {
	for (const span of spans) {
		span.start += offset;
		span.end += offset;
		into.push(span);
	}
}
/** Transfers a separately owned IR slice, including its metadata, into an accumulator. */
function appendMarkdownIR(target, source) {
	const offset = target.text.length;
	appendHtmlTags(target, source, offset);
	target.text += source.text;
	appendSpans(target.styles, source.styles, offset);
	appendSpans(target.links, source.links, offset);
	if (source.annotations?.length) appendSpans(target.annotations ??= [], source.annotations, offset);
	const listItems = source.listItems ?? [];
	for (const item of listItems) {
		for (const marker of [item.listMarker, item.taskMarker]) if (marker) {
			marker.start += offset;
			marker.end += offset;
		}
		for (const key of [
			"start",
			"end",
			"contentStart",
			"contentEnd"
		]) {
			const value = item[key];
			if (value !== void 0) item[key] = value + offset;
		}
		(target.listItems ??= []).push(item);
	}
	const sourceWithMetadata = source;
	if (sourceWithMetadata.blocks?.length) {
		const blocks = target.blocks ?? [];
		appendSpans(blocks, sourceWithMetadata.blocks, offset);
		attachBlockMetadata(target, blocks);
	}
}
function markdownToIR(markdown, options = {}) {
	return markdownToIRWithMeta(markdown, options).ir;
}
function indexSourceLines(source) {
	const lines = [];
	const starts = [];
	let start = 0;
	for (let index = 0; index < source.length; index += 1) {
		const character = source[index];
		if (character !== "\r" && character !== "\n") continue;
		starts.push(start);
		lines.push(source.slice(start, index));
		if (character === "\r" && source[index + 1] === "\n") index += 1;
		start = index + 1;
	}
	starts.push(start);
	lines.push(source.slice(start));
	return {
		lines,
		starts,
		openedByLine: /* @__PURE__ */ new Map()
	};
}
function markdownToIRWithMeta(markdown, options = {}) {
	const source = markdown ?? "";
	const env = {
		listStack: [],
		...options.tableMode === "block" ? { tableSourceColumns: /* @__PURE__ */ new Map() } : {},
		assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders === true,
		assistantTranscriptRolePreserveLinks: options.assistantTranscriptRoleHeaders === true
	};
	const tokens = createMarkdownIt(options).parse(source, env);
	const tableMode = options.tableMode ?? "off";
	const state = {
		text: "",
		styles: [],
		openStyles: [],
		links: [],
		linkStack: [],
		annotations: [],
		env,
		headingStyle: options.headingStyle ?? "none",
		blockquotePrefix: options.blockquotePrefix ?? "",
		enableSpoilers: options.enableSpoilers ?? false,
		tableMode,
		table: null,
		hasTables: false,
		collectedTables: [],
		horizontalRuleText: options.horizontalRuleText ?? "───",
		preserveSourceBlockSpacing: options.preserveSourceBlockSpacing ?? false,
		headingLineEnd: void 0,
		listItems: [],
		openListItems: [],
		nextListId: 0,
		blocks: [],
		headingBlock: void 0,
		blockquoteStack: [],
		source,
		sourceIndex: void 0
	};
	renderTokens(tokens, state);
	closeRemainingStyles(state);
	const trimmedLength = state.text.trimEnd().length;
	let codeEnd = 0;
	for (const span of state.styles) {
		if (span.style !== "code" && span.style !== "code_block") continue;
		codeEnd = Math.max(codeEnd, span.end);
	}
	const finalLength = Math.max(trimmedLength, codeEnd);
	const finalText = finalLength === state.text.length ? state.text : state.text.slice(0, finalLength);
	const annotations = mergeAnnotationSpans(clampAnnotationSpans(state.annotations, finalLength));
	const listItems = state.listItems.flatMap((item) => {
		const listMarker = item.listMarker ? sliceListMarker(item.listMarker, 0, finalLength) : void 0;
		const taskMarker = item.taskMarker ? sliceListMarker(item.taskMarker, 0, finalLength) : void 0;
		return listMarker || taskMarker ? [attachListItemMetadata({
			kind: item.kind,
			...listMarker ? { listMarker } : {},
			...item.task ? { task: true } : {},
			...taskMarker ? { taskMarker } : {},
			...item.listId !== void 0 ? { listId: item.listId } : {},
			...item.parentListId !== void 0 ? { parentListId: item.parentListId } : {},
			...item.depth !== void 0 ? { depth: item.depth } : {},
			...item.start !== void 0 ? { start: Math.min(item.start, finalLength) } : {},
			...item.end !== void 0 ? { end: Math.min(item.end, finalLength) } : {}
		}, {
			...item.contentStart !== void 0 ? { contentStart: Math.min(item.contentStart, finalLength) } : {},
			...item.contentEnd !== void 0 ? { contentEnd: Math.min(item.contentEnd, finalLength) } : {},
			...item.markerOnly ? { markerOnly: true } : {},
			sourceMarker: item.sourceMarker,
			sourceContent: item.sourceContent,
			sourceIndent: item.sourceIndent,
			sourceStartLine: item.sourceStartLine,
			sourceEndLine: item.sourceEndLine
		})] : [];
	});
	const blocks = state.blocks.map((block) => {
		const start = Math.min(block.start, finalLength);
		const end = Math.min(block.end, finalLength);
		return {
			...block,
			start,
			end
		};
	}).toSorted((left, right) => left.start - right.start || left.end - right.end || left.depth - right.depth || left.kind.localeCompare(right.kind));
	const ir = {
		text: finalText,
		styles: mergeStyleSpans(clampStyleSpans(state.styles, finalLength)),
		links: clampLinkSpans(state.links, finalLength),
		...annotations.length > 0 ? { annotations } : {},
		...listItems.length > 0 ? { listItems } : {}
	};
	attachBlockMetadata(ir, blocks);
	copyHtmlTags(state, ir, 0, finalLength);
	return {
		ir,
		hasTables: state.hasTables,
		tables: state.collectedTables.map((table) => Object.assign(table, { placeholderOffset: Math.min(table.placeholderOffset, finalLength) }))
	};
}
function chunkMarkdownIR(ir, limit) {
	if (!ir.text) return [];
	if (limit <= 0 || ir.text.length <= limit) return [ir];
	const chunks = chunkText(ir.text, limit);
	const ranges = [];
	const texts = [];
	let cursor = 0;
	chunks.forEach((chunk, index) => {
		if (!chunk) return;
		if (index > 0) while (cursor < ir.text.length && /\s/.test(ir.text[cursor] ?? "")) cursor += 1;
		const start = cursor;
		const end = Math.min(ir.text.length, start + chunk.length);
		ranges.push({
			start,
			end
		});
		texts.push(chunk);
		cursor = end;
	});
	return sliceMarkdownIRRanges(ir, ranges).map((slice, index) => {
		slice.text = texts[index] ?? slice.text;
		return slice;
	});
}
//#endregion
export { chunkTextRanges as _, markdownToIR as a, tokenizeHtmlTags as b, renderMarkdownTableBullets as c, annotateAssistantTranscriptRoleMessageBoundary as d, copyMarkdownLinkSpan as f, mergeStyleSpans as g, mergeAnnotationSpans as h, getMarkdownTableSource as i, sliceMarkdownIR as l, isAutoLinkedMarkdownLink as m, chunkMarkdownIR as n, markdownToIRWithMeta as o, createStyleSpan as p, countMarkdownFencedCodeChars as r, renderMarkdownCodeTable as s, appendMarkdownIR as t, sliceMarkdownIRRanges as u, copyHtmlTags as v, findAssistantTranscriptRoleHeaderSpans as x, matchMarkdownHtmlTag as y };
