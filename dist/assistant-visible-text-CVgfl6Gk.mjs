import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as stripReasoningTagsFromMarkdown, i as scanReasoningTags } from "./reasoning-tags-Du_476pm.mjs";
import { a as isInsideCode, o as stripLinesOutsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { a as trimTextFilter, i as leadingEmptyLinesTextFilter, o as trimTextPreservingCode, t as applyTextFilters } from "./text-projection-DLGaFuGQ.mjs";
import { c as consumeLineBreak, l as skipHorizontalWhitespace, s as stripPlainTextToolCallBlocks, u as skipWhitespace } from "./src-D2JRn00t.mjs";
//#region src/shared/text/downgraded-tool-call-text.ts
function consumeJsonish(input, start) {
	let index = start;
	while (index < input.length && /[ \t\r\n]/.test(input[index] ?? "")) index += 1;
	const opening = input[index];
	if (opening === void 0) return null;
	if (opening !== "{" && opening !== "[" && opening !== "\"") {
		while (index < input.length && input[index] !== "\n" && input[index] !== "\r") index += 1;
		return index;
	}
	let depth = opening === "\"" ? 0 : 1;
	let inString = opening === "\"";
	let escaped = false;
	for (index += 1; index < input.length; index += 1) {
		const char = input[index];
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
		} else if (char === "\"") inString = true;
		else if (char === "{" || char === "[") depth += 1;
		else if (char === "}" || char === "]") depth -= 1;
		if (!inString && depth === 0) return index + 1;
	}
	return null;
}
function stripDowngradedToolCalls(input) {
	let codeRegions;
	let result = "";
	let cursor = 0;
	for (const match of input.matchAll(/\[Tool Call:[^\]]*\]/gi)) {
		const start = match.index;
		if (start < cursor || isInsideCode(start, codeRegions ??= findCodeRegions(input))) continue;
		result += input.slice(cursor, start);
		let index = skipHorizontalWhitespace(input, start + match[0].length);
		index = skipHorizontalWhitespace(input, consumeLineBreak(input, index) ?? index);
		if (normalizeLowercaseStringOrEmpty(input.slice(index, index + 9)) === "arguments") {
			index += 9;
			if (input[index] === ":") index += 1;
			if (input[index] === " ") index += 1;
			index = consumeJsonish(input, index) ?? index;
		}
		if (!result || result.endsWith("\n") || result.endsWith("\r")) index = consumeLineBreak(input, index) ?? index;
		cursor = index;
	}
	return result + input.slice(cursor);
}
/**
* Strip downgraded tool call text representations that leak into user-visible
* text content when replaying history across providers.
*/
function stripDowngradedToolCallText(text, options) {
	if (!text || !/\[Tool (?:Call|Result)/i.test(text) && !/\[Historical context/i.test(text)) return text;
	let cleaned = stripDowngradedToolCalls(text);
	for (const pattern of [/\[Tool Result for ID[^\]]*\]\n?[\s\S]*?(?=\n*\[Tool |\n*$)/gi, /\[Historical context:[^\]]*\]\n?/gi]) {
		const input = cleaned;
		let codeRegions;
		cleaned = input.replace(pattern, (match, offset) => isInsideCode(offset, codeRegions ??= findCodeRegions(input)) ? match : "");
	}
	return trimTextPreservingCode(cleaned, options?.preserveTrailingWhitespace ? "start" : "both");
}
function downgradedToolCallTextFilter(options) {
	return {
		transform: (text) => stripDowngradedToolCallText(text, options),
		activationTokens: [
			"[Tool Call",
			"[Tool Result",
			"[Historical context"
		]
	};
}
//#endregion
//#region src/shared/text/model-special-tokens.ts
const MODEL_SPECIAL_TOKEN_RE = /<[|｜][^|｜]*[|｜]>/g;
/**
* Strips leaked model control tokens like `<|assistant|>` or full-width pipe variants.
* Code examples are preserved; remove this when providers stop emitting these tokens.
*
* @see https://github.com/openclaw/openclaw/issues/40020
*/
function stripModelSpecialTokens(text) {
	if (!text) return text;
	MODEL_SPECIAL_TOKEN_RE.lastIndex = 0;
	if (!MODEL_SPECIAL_TOKEN_RE.test(text)) return text;
	MODEL_SPECIAL_TOKEN_RE.lastIndex = 0;
	const codeRegions = findCodeRegions(text);
	let out = "";
	let cursor = 0;
	for (const match of text.matchAll(MODEL_SPECIAL_TOKEN_RE)) {
		const matched = match[0];
		const start = match.index ?? 0;
		const end = start + matched.length;
		out += text.slice(cursor, start);
		if (codeRegions.some((region) => start < region.end && end > region.start)) out += matched;
		else if (/(?:\p{L}|\p{M}|\p{N})$/u.test(out.slice(-2)) && /^[\p{L}\p{N}]/u.test(text.slice(end, end + 2))) out += " ";
		cursor = end;
	}
	out += text.slice(cursor);
	return out;
}
//#endregion
//#region src/shared/text/final-tags.ts
const FINAL_TAG_CANDIDATE_RE = /<[^<>]*>/g;
function isWhitespace(char) {
	return /\s/.test(char);
}
function parseAttributeList(text) {
	let index = 0;
	while (index < text.length) {
		while (index < text.length && isWhitespace(text[index] ?? "")) index += 1;
		if (index >= text.length) return true;
		const nameStart = index;
		while (index < text.length) {
			const char = text[index] ?? "";
			if (isWhitespace(char) || char === "=") break;
			if (char === "/" || char === "\"" || char === "'" || char === "<" || char === ">") return false;
			index += 1;
		}
		if (index === nameStart) return false;
		while (index < text.length && isWhitespace(text[index] ?? "")) index += 1;
		if (text[index] !== "=") continue;
		index += 1;
		while (index < text.length && isWhitespace(text[index] ?? "")) index += 1;
		if (index >= text.length) return false;
		const quote = text[index];
		if (quote === "\"" || quote === "'") {
			index += 1;
			const end = text.indexOf(quote, index);
			if (end === -1) return false;
			index = end + 1;
			continue;
		}
		const valueStart = index;
		while (index < text.length && !isWhitespace(text[index] ?? "")) {
			const char = text[index] ?? "";
			if (char === "\"" || char === "'" || char === "<" || char === ">") return false;
			index += 1;
		}
		if (index === valueStart) return false;
	}
	return true;
}
/** Parses a candidate `<final>` tag while rejecting lookalike names and malformed attributes. */
function parseFinalTag(text) {
	if (!text.startsWith("<") || !text.endsWith(">")) return null;
	let body = text.slice(1, -1).trimStart();
	let isClose = false;
	if (body.startsWith("/")) {
		isClose = true;
		body = body.slice(1).trimStart();
	}
	if (!body.toLowerCase().startsWith("final")) return null;
	const boundary = body[5] ?? "";
	if (boundary && !isWhitespace(boundary) && boundary !== "/") return null;
	let rest = body.slice(5);
	if (isClose) return rest.trim().length === 0 ? {
		isClose: true,
		isSelfClosing: false
	} : null;
	const trimmedRest = rest.trimEnd();
	const isSelfClosing = trimmedRest.endsWith("/");
	rest = isSelfClosing ? trimmedRest.slice(0, -1) : rest;
	if (!parseAttributeList(rest)) return null;
	return {
		isClose: false,
		isSelfClosing
	};
}
/** Finds valid `<final>` control tags so callers can strip only actual model markers. */
function findFinalTagMatches(text) {
	const matches = [];
	for (const match of text.matchAll(FINAL_TAG_CANDIDATE_RE)) {
		const tagText = match[0];
		const parsed = parseFinalTag(tagText);
		if (!parsed) continue;
		matches.push({
			index: match.index ?? 0,
			text: tagText,
			...parsed
		});
	}
	return matches;
}
/** Removes final-answer markers outside Markdown code while preserving their enclosed answer. */
function stripFinalTags(text) {
	const matches = findFinalTagMatches(text);
	if (matches.length === 0) return text;
	const codeRegions = findCodeRegions(text);
	let codeIndex = 0;
	let output = "";
	let lastIndex = 0;
	for (const match of matches) {
		let codeRegion = codeRegions[codeIndex];
		while (codeRegion && codeRegion.end <= match.index) {
			codeIndex += 1;
			codeRegion = codeRegions[codeIndex];
		}
		if (codeRegion && codeRegion.start <= match.index) continue;
		output += text.slice(lastIndex, match.index);
		lastIndex = match.index + match.text.length;
	}
	output += text.slice(lastIndex);
	return output;
}
//#endregion
//#region src/shared/text/reasoning-tags.ts
/** Detects whether a stray reasoning close tag separates two visible text regions. */
function hasOrphanReasoningCloseBoundary(params) {
	return params.before.trim().length > 0 && params.after.trim().length > 0;
}
/** Strips model reasoning/final tags from visible text while preserving literal code examples. */
function stripReasoningTagsFromText(text, options) {
	if (!text) return text;
	const mode = options?.mode ?? "strict";
	const trimMode = options?.trim ?? "both";
	const scope = options?.scope ?? "all";
	let cleaned = text;
	const matches = findFinalTagMatches(cleaned);
	if (matches.length > 0) cleaned = stripFinalTags(cleaned);
	const hasThinkingTag = scanReasoningTags(cleaned).tags.length > 0;
	if (matches.length === 0 && !hasThinkingTag) return text;
	const stripped = hasThinkingTag ? stripReasoningTagsFromMarkdown(cleaned, {
		mode,
		scope,
		recoverUnclosed: options?.recoverUnclosed
	}) : cleaned;
	if (trimMode === "none") return stripped;
	return trimMode === "start" ? stripped.trimStart() : stripped.trim();
}
//#endregion
//#region src/shared/text/assistant-visible-text.ts
const MEMORY_TAG_RE = /<\s*(\/?)\s*relevant[-_]memories\b[^<>]*>/gi;
const MEMORY_TAG_QUICK_RE = /<\s*\/?\s*relevant[-_]memories\b/i;
const LEGACY_BRACKET_TOOL_BLOCK_QUICK_RE = /\[\s*\/?\s*TOOL_(?:CALL|RESULT)\s*\]/i;
const INTERNAL_TRACE_LINE_QUICK_RE = /(?:📊|🛠️|📖|📝|🔍|🔎|⚙️|tool[-_ ]?call|tool[-_ ]?result|function[-_ ]?call)/i;
const INTERNAL_TRACE_LINE_RE = /^(?:>\s*)?(?:⚠️\s*)?(?:📊|🛠️|📖|📝|🔍|🔎|⚙️)\s*(?:Session Status|Exec|Read|Edit|Write|Patch|Search|Open|Click|Find|Screenshot|Update Plan|Tool Call|Tool Result|Function Call|Shell|Command)\s*:/i;
const INTERNAL_COMPACT_FAILURE_TRACE_LINE_RE = /^(?:>\s*)?⚠️\s*🛠️\s+(?:(?:Exec|Bash)\s+failed(?:(?:\s+\(exit\s+-?\d+\))|(?:\s*:[^\r\n]*))?|\S[^\r\n]*\s+\(agent\)`{0,2}\s+failed(?:\s*:[^\r\n]*)?)\s*$/i;
const INTERNAL_COMPACT_COMMAND_TRACE_LINE_RE = /^(?:>\s*)?🛠️\s*(?:(?:(?:elevated|pty)\b\s*(?:·|,)\s*)+)?(?:`{1,2}\s*\S|(?:run|check|fetch|pull|push|view|show|list|switch|create|merge|rebase|stage|restore|reset|stash|search|find|print|copy|move|remove|install|start|cd|git|pnpm|npm|yarn|bun|node|python|python3|bash|sh)\b)/i;
const INTERNAL_CHANNEL_TRACE_LINE_RE = /^(?:>\s*)?(?:tool[-_ ]?call|tool[-_ ]?result|function[-_ ]?call)\s*[:=]/i;
/**
* Strip XML-style tool call tags that models sometimes emit as plain text.
* This stateful pass hides content from an opening tag through the matching
* closing tag, or to end-of-string if the stream was truncated mid-tag.
*/
const TOOL_CALL_QUICK_RE = /<\s*\/?\s*(?:antml:)?(?:tool_call|tool_result|function_calls?|function_response|function|tool_calls|invoke|parameter)\b/i;
const TOOL_CALL_TAG_NAMES = /* @__PURE__ */ new Set([
	"tool_call",
	"tool_result",
	"function_call",
	"function_calls",
	"function_response",
	"function",
	"tool_calls",
	"antml:invoke",
	"antml:parameter"
]);
const TOOL_CALL_JSON_PAYLOAD_START_RE = /^(?:\s+[A-Za-z_:][-A-Za-z0-9_:.]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))*\s*(?:\r?\n\s*)?[[{]/;
const TOOL_CALL_XML_PAYLOAD_START_RE = /^\s*(?:\r?\n\s*)?<(?:antml:)?(?:function_call|tool_call|function|invoke|parameters?|arguments?)\b/i;
const NESTED_JSON_TOOL_CALL_PAYLOAD_START_RE = /^\s*(?:\r?\n\s*)?<(?:function_call|tool_call)\b/i;
function createQuotedStringScanner(text, start) {
	let quoteChar = null;
	let isEscaped = false;
	let cursor = start;
	return (end) => {
		for (; cursor < end; cursor += 1) {
			const char = text[cursor];
			if (quoteChar === null) {
				if (char === "\"" || char === "'") quoteChar = char;
			} else if (isEscaped) isEscaped = false;
			else if (char === "\\") isEscaped = true;
			else if (char === quoteChar) quoteChar = null;
		}
		return quoteChar !== null;
	};
}
const XML_TAG_HEAD_RE = /<\s*(?:(\/)\s*)?([A-Za-z_:][A-Za-z0-9_.:-]*)(?=$|[\s/>])/y;
function parseXmlTagAt(text, start) {
	XML_TAG_HEAD_RE.lastIndex = start;
	const match = XML_TAG_HEAD_RE.exec(text);
	if (!match) return null;
	const contentStart = XML_TAG_HEAD_RE.lastIndex;
	const isClose = match[1] === "/";
	const closeIndex = findTagCloseIndex(text, contentStart);
	const isTruncated = closeIndex === -1;
	return {
		contentStart,
		end: isTruncated ? text.length : closeIndex + 1,
		isClose,
		isSelfClosing: !isTruncated && !isClose && /\/\s*$/.test(text.slice(contentStart, closeIndex)),
		tagName: normalizeLowercaseStringOrEmpty(match[2]),
		isTruncated
	};
}
function findTagCloseIndex(text, start) {
	const isInsideQuote = createQuotedStringScanner(text, start);
	for (let idx = start; idx < text.length; idx += 1) {
		const char = text[idx];
		if ((char === "<" || char === ">") && !isInsideQuote(idx)) return char === ">" ? idx : -1;
	}
	return -1;
}
function detectToolCallPayloadKind(text, start) {
	const rest = text.slice(start);
	if (TOOL_CALL_JSON_PAYLOAD_START_RE.test(rest)) return "json";
	if (TOOL_CALL_XML_PAYLOAD_START_RE.test(rest)) return "xml";
	return null;
}
function startsWithNestedJsonToolCallPayload(text, start) {
	if (!NESTED_JSON_TOOL_CALL_PAYLOAD_START_RE.test(text.slice(start))) return false;
	const nestedTag = parseToolCallTagAt(text, skipWhitespace(text, start));
	if (!nestedTag || nestedTag.isClose || nestedTag.isSelfClosing || nestedTag.isTruncated || nestedTag.tagName !== "function_call" && nestedTag.tagName !== "tool_call") return false;
	return TOOL_CALL_JSON_PAYLOAD_START_RE.test(text.slice(nestedTag.end));
}
function isLikelyStandaloneFunctionToolCall(text, tagStart, tag) {
	if (tag.tagName !== "function" || tag.isClose || tag.isSelfClosing || tag.isTruncated) return false;
	if (!/\bname\s*=/.test(text.slice(tag.contentStart, tag.end))) return false;
	let idx = tagStart - 1;
	while (idx >= 0 && (text[idx] === " " || text[idx] === "	")) idx -= 1;
	return idx < 0 || text[idx] === "\n" || text[idx] === "\r" || /[.!?:]/.test(text.charAt(idx));
}
function isAdjacentToStrippedToolCallBlock(text, tagStart, lastStrippedBlockEnd) {
	if (lastStrippedBlockEnd === null || lastStrippedBlockEnd > tagStart) return false;
	for (let idx = lastStrippedBlockEnd; idx < tagStart; idx += 1) if (text[idx] !== " " && text[idx] !== "	" && text[idx] !== "\n" && text[idx] !== "\r") return false;
	return true;
}
function findMatchingToolCallCloseIndex(text, start, tagName) {
	for (let idx = start; idx < text.length; idx += 1) {
		if (text[idx] !== "<") continue;
		const tag = parseToolCallTagAt(text, idx);
		if (!tag) continue;
		if (tag.isClose && tag.tagName === tagName && !tag.isTruncated) return idx;
		idx = Math.max(idx, tag.end - 1);
	}
	return -1;
}
function findAdjacentOpeningToolCallTag(text, start, tagName) {
	const tag = parseToolCallTagAt(text, skipWhitespace(text, start));
	if (!tag || tag.isClose || tag.tagName !== tagName) return null;
	return tag;
}
function parseToolCallTagAt(text, start) {
	const tag = parseXmlTagAt(text, start);
	return tag && TOOL_CALL_TAG_NAMES.has(tag.tagName) ? tag : null;
}
function scanXmlTags(text, codeRegions) {
	const tags = [];
	const openTags = /* @__PURE__ */ new Map();
	for (let start = text.indexOf("<"); start !== -1; start = text.indexOf("<", start + 1)) {
		if (isInsideCode(start, codeRegions)) continue;
		const parsed = parseXmlTagAt(text, start);
		if (!parsed || parsed.isTruncated) continue;
		const tag = {
			...parsed,
			start,
			hasMatchingClose: false
		};
		tags.push(tag);
		const parents = openTags.get(tag.tagName);
		if (tag.isClose) {
			const opening = parents?.pop();
			if (opening) opening.hasMatchingClose = true;
		} else if (!tag.isSelfClosing) {
			if (parents) parents.push(tag);
			else openTags.set(tag.tagName, [tag]);
		}
		start = tag.end - 1;
	}
	return tags;
}
function isDanglingFunctionParameterParent(text, tag) {
	if (tag.tagName !== "function" || !/\bname\s*=/.test(text.slice(tag.contentStart, tag.end))) return false;
	const nextTag = parseXmlTagAt(text, skipWhitespace(text, tag.end));
	return nextTag?.tagName === "parameter" && !nextTag.isClose;
}
function trimImmediateLineBreakBefore(text, start, end) {
	if (end > start && text[end - 1] === "\n") return end - (end - 2 >= start && text[end - 2] === "\r" ? 2 : 1);
	return end > start && text[end - 1] === "\r" ? end - 1 : end;
}
function isLineStartAt(text, start) {
	let cursor = start - 1;
	while (cursor >= 0 && (text[cursor] === " " || text[cursor] === "	")) cursor -= 1;
	return cursor < 0 || text[cursor] === "\n" || text[cursor] === "\r";
}
function isLineEndAfter(text, end) {
	const cursor = skipHorizontalWhitespace(text, end);
	return cursor >= text.length || text[cursor] === "\n" || text[cursor] === "\r";
}
function unwrapStandaloneParameterTags(text) {
	if (!/<\s*\/?\s*parameter\b/i.test(text)) return text;
	const codeRegions = findCodeRegions(text);
	const openTags = [];
	let result = "";
	let lastIndex = 0;
	for (const tag of scanXmlTags(text, codeRegions)) {
		const idx = tag.start;
		if (tag.isClose) {
			const openIndex = openTags.findLastIndex((entry) => entry.name === tag.tagName);
			if (openIndex !== -1) {
				const opening = expectDefined(openTags[openIndex], "open tags entry at open index");
				if (opening.unwrap) {
					const contentEnd = opening.trimBoundaryLineBreaks && isLineStartAt(text, idx) && isLineEndAfter(text, tag.end) ? trimImmediateLineBreakBefore(text, lastIndex, idx) : idx;
					result += text.slice(lastIndex, contentEnd);
					lastIndex = tag.end;
				}
				openTags.splice(openIndex);
			}
		} else if (tag.isSelfClosing) {
			if (tag.tagName === "parameter" && openTags.length === 0) {
				result += text.slice(lastIndex, idx);
				lastIndex = tag.end;
			}
		} else if (tag.hasMatchingClose || isDanglingFunctionParameterParent(text, tag)) {
			const unwrap = tag.tagName === "parameter" && openTags.length === 0;
			let trimBoundaryLineBreaks = false;
			if (unwrap) {
				result += text.slice(lastIndex, idx);
				lastIndex = tag.end;
				const contentStart = isLineStartAt(text, idx) ? consumeLineBreak(text, lastIndex) : null;
				if (contentStart !== null) {
					lastIndex = contentStart;
					trimBoundaryLineBreaks = true;
				}
			}
			openTags.push({
				name: tag.tagName,
				unwrap,
				trimBoundaryLineBreaks
			});
		}
	}
	return result + text.slice(lastIndex);
}
function stripToolCallXmlTags(input, options = {}) {
	const text = input;
	if (!text || !TOOL_CALL_QUICK_RE.test(text)) return text;
	const codeRegions = findCodeRegions(text);
	let result = "";
	let lastIndex = 0;
	let isInsidePayloadQuote;
	let toolCallBlockStart = 0;
	let toolCallBlockTagName = null;
	let lastStrippedToolCallBlockEnd = null;
	const visibleTagBalance = /* @__PURE__ */ new Map();
	for (let idx = 0; idx < text.length; idx += 1) {
		if (text[idx] !== "<") continue;
		if (toolCallBlockTagName === null && isInsideCode(idx, codeRegions)) continue;
		const tag = parseToolCallTagAt(text, idx);
		if (!tag) continue;
		if (toolCallBlockTagName === null) {
			result += text.slice(lastIndex, idx);
			if (tag.isClose) {
				if (tag.isTruncated) {
					const preserveEnd = tag.contentStart;
					result += text.slice(idx, preserveEnd);
					lastIndex = preserveEnd;
					idx = Math.max(idx, preserveEnd - 1);
					continue;
				}
				const balance = visibleTagBalance.get(tag.tagName) ?? 0;
				if (balance > 0) {
					result += text.slice(idx, tag.end);
					visibleTagBalance.set(tag.tagName, balance - 1);
				}
				lastIndex = tag.end;
				idx = Math.max(idx, tag.end - 1);
				continue;
			}
			if (tag.isSelfClosing) {
				lastStrippedToolCallBlockEnd = tag.end;
				lastIndex = tag.end;
				idx = Math.max(idx, tag.end - 1);
				continue;
			}
			const payloadStart = tag.isTruncated ? tag.contentStart : tag.end;
			const isPluralToolCallWrapper = tag.tagName === "function_calls" || tag.tagName === "tool_calls";
			const matchingCloseStart = isPluralToolCallWrapper ? findMatchingToolCallCloseIndex(text, tag.end, tag.tagName) : -1;
			const matchingCloseTag = matchingCloseStart === -1 ? null : parseToolCallTagAt(text, matchingCloseStart);
			const shouldStripPluralWrapperBeforeResponse = options.stripFunctionResponseAfterPluralToolCalls === true && isPluralToolCallWrapper && matchingCloseTag !== null && findAdjacentOpeningToolCallTag(text, matchingCloseTag.end, "function_response") !== null;
			const payloadKind = tag.tagName === "tool_call" || tag.tagName === "function" || tag.tagName === "antml:invoke" || (options.stripFunctionCallsXmlPayloads === true || shouldStripPluralWrapperBeforeResponse) && isPluralToolCallWrapper ? detectToolCallPayloadKind(text, payloadStart) : TOOL_CALL_JSON_PAYLOAD_START_RE.test(text.slice(payloadStart)) ? "json" : null;
			const shouldStripStandaloneFunction = tag.tagName !== "function" || isLikelyStandaloneFunctionToolCall(text, idx, tag);
			const functionResponseCloseStart = tag.tagName === "function_response" ? findMatchingToolCallCloseIndex(text, tag.end, tag.tagName) : -1;
			const shouldStripStandaloneResult = tag.tagName === "function_response" && (isLineStartAt(text, idx) && isLineEndAfter(text, tag.end) || isAdjacentToStrippedToolCallBlock(text, idx, lastStrippedToolCallBlockEnd) || functionResponseCloseStart !== -1 && isLineStartAt(result, result.length) && isLineEndAfter(text, tag.end));
			if (payloadKind && shouldStripStandaloneFunction || shouldStripStandaloneResult) {
				isInsidePayloadQuote = payloadKind === "json" || payloadKind === "xml" && startsWithNestedJsonToolCallPayload(text, payloadStart) ? createQuotedStringScanner(text, tag.end) : void 0;
				toolCallBlockStart = idx;
				toolCallBlockTagName = tag.tagName;
				if (tag.isTruncated) {
					lastIndex = text.length;
					break;
				}
			} else {
				const preserveEnd = tag.isTruncated ? tag.contentStart : tag.end;
				result += text.slice(idx, preserveEnd);
				if (!tag.isTruncated) visibleTagBalance.set(tag.tagName, (visibleTagBalance.get(tag.tagName) ?? 0) + 1);
				lastIndex = preserveEnd;
				idx = Math.max(idx, preserveEnd - 1);
				continue;
			}
		} else if (tag.isClose && (tag.tagName === toolCallBlockTagName || toolCallBlockTagName === "tool_result" && tag.tagName === "tool_call") && !isInsidePayloadQuote?.(idx)) {
			isInsidePayloadQuote = void 0;
			toolCallBlockTagName = null;
			lastStrippedToolCallBlockEnd = tag.end;
		}
		lastIndex = tag.end;
		idx = Math.max(idx, tag.end - 1);
	}
	if (toolCallBlockTagName === null) result += text.slice(lastIndex);
	else if (toolCallBlockTagName === "function") result += text.slice(toolCallBlockStart);
	return unwrapStandaloneParameterTags(result);
}
/**
* Strip malformed Minimax tool invocations that leak into text content.
* Minimax sometimes embeds tool calls as XML in text blocks instead of
* proper structured tool calls.
*/
function stripMinimaxToolCallXml(text) {
	const encodedTransportBoundaryRe = /\]?<\]minimax\[>\[/g;
	const encodedToolCallOpenRe = /\]?<\]minimax\[>\[<tool_call>/g;
	const encodedToolCallCloseRe = /\]?<\]minimax\[>\[<\/tool_call>/g;
	if (!text || !/minimax:tool_call/i.test(text) && !encodedToolCallOpenRe.test(text)) return text;
	encodedToolCallOpenRe.lastIndex = 0;
	const sourceCodeRegions = findCodeRegions(text);
	let normalized = "";
	let envelopeCursor = 0;
	for (const openMatch of text.matchAll(encodedToolCallOpenRe)) {
		const start = openMatch.index;
		if (start < envelopeCursor || isInsideCode(start, sourceCodeRegions)) continue;
		encodedToolCallCloseRe.lastIndex = start + openMatch[0].length;
		let closeMatch = encodedToolCallCloseRe.exec(text);
		while (closeMatch && isInsideCode(closeMatch.index, sourceCodeRegions)) closeMatch = encodedToolCallCloseRe.exec(text);
		if (!closeMatch) break;
		const end = closeMatch.index + closeMatch[0].length;
		normalized += text.slice(envelopeCursor, start);
		if (sourceCodeRegions.some((region) => region.start >= start && region.end <= end)) {
			envelopeCursor = end;
			continue;
		}
		normalized += text.slice(start, end).replace(encodedTransportBoundaryRe, "");
		envelopeCursor = end;
	}
	normalized += text.slice(envelopeCursor);
	if (!/minimax:tool_call/i.test(normalized)) return normalized;
	const codeRegions = findCodeRegions(normalized);
	const minimaxToolXmlRe = /<invoke\b[^>]*>[\s\S]*?<\/invoke>|<\/?minimax:tool_call>/gi;
	let result = "";
	let cursor = 0;
	for (const match of normalized.matchAll(minimaxToolXmlRe)) {
		const start = match.index ?? 0;
		if (isInsideCode(start, codeRegions)) continue;
		result += normalized.slice(cursor, start);
		cursor = start + match[0].length;
	}
	result += normalized.slice(cursor);
	return result;
}
function isLegacyBracketToolCallPayload(value) {
	return /\btool\s*=>\s*["'][A-Za-z_][A-Za-z0-9_.:-]{0,119}["']/i.test(value) && /\bargs\s*=>/i.test(value);
}
function isLegacyBracketToolResultPayload(value) {
	return /^\s*[{[]/.test(value) || /\b(?:tool|result|output|content)\s*=>/i.test(value) || /\b(?:tool|result|output|content)\s*:/i.test(value);
}
function stripLegacyBracketToolCallBlocks(text) {
	if (!text || !LEGACY_BRACKET_TOOL_BLOCK_QUICK_RE.test(text)) return text;
	const codeRegions = findCodeRegions(text);
	let result = "";
	let cursor = 0;
	for (const openMatch of text.matchAll(/\[\s*TOOL_(CALL|RESULT)\s*\]/gi)) {
		const openStart = openMatch.index;
		if (openStart < cursor || isInsideCode(openStart, codeRegions)) continue;
		const payloadStart = openStart + openMatch[0].length;
		const isResult = openMatch[1]?.toUpperCase() === "RESULT";
		const closeRe = isResult ? /\[\s*\/\s*TOOL_RESULT\s*\]/gi : /\[\s*\/\s*TOOL_CALL\s*\]/gi;
		closeRe.lastIndex = payloadStart;
		const closeMatch = closeRe.exec(text);
		const closeStart = closeMatch && !isInsideCode(closeMatch.index, codeRegions) ? closeMatch.index : -1;
		const payload = text.slice(payloadStart, closeStart >= 0 ? closeStart : text.length);
		if (!(isResult ? isLegacyBracketToolResultPayload(payload) : isLegacyBracketToolCallPayload(payload))) continue;
		result += text.slice(cursor, openStart);
		cursor = closeStart >= 0 ? closeStart + (closeMatch?.[0].length ?? 0) : text.length;
		if (cursor === text.length) break;
	}
	return result + text.slice(cursor);
}
function stripRelevantMemoriesTags(text) {
	if (!text || !MEMORY_TAG_QUICK_RE.test(text)) return text;
	MEMORY_TAG_RE.lastIndex = 0;
	const codeRegions = findCodeRegions(text);
	let result = "";
	let lastIndex = 0;
	let inMemoryBlock = false;
	for (const match of text.matchAll(MEMORY_TAG_RE)) {
		const idx = match.index ?? 0;
		if (isInsideCode(idx, codeRegions)) continue;
		const isClose = match[1] === "/";
		if (!inMemoryBlock) {
			result += text.slice(lastIndex, idx);
			if (!isClose) inMemoryBlock = true;
		} else if (isClose) inMemoryBlock = false;
		lastIndex = idx + match[0].length;
	}
	if (!inMemoryBlock) result += text.slice(lastIndex);
	return result;
}
function stripAssistantInternalTraceLines(text) {
	if (!text || !INTERNAL_TRACE_LINE_QUICK_RE.test(text)) return text;
	return stripLinesOutsideCode(text, (line) => {
		const trimmed = line.trim();
		return INTERNAL_TRACE_LINE_RE.test(trimmed) || INTERNAL_COMPACT_FAILURE_TRACE_LINE_RE.test(trimmed) || INTERNAL_COMPACT_COMMAND_TRACE_LINE_RE.test(trimmed) || INTERNAL_CHANNEL_TRACE_LINE_RE.test(trimmed);
	});
}
const profileFilters = /* @__PURE__ */ new Map();
function assistantVisibleTextFilters(profile, streaming = false, options) {
	const key = `${profile}:${streaming}:${Boolean(options?.preserveTrailingWhitespace)}`;
	const cached = profileFilters.get(key);
	if (cached) return cached;
	const preserve = profile === "internal-scaffolding";
	const preserveCodeIndentation = profile === "delivery" || profile === "final-answer-delivery";
	const trim = preserve || profile === "history" ? "none" : options?.preserveTrailingWhitespace ? "start" : "both";
	const reasoning = {
		activationTokens: ["<"],
		transform: (text) => stripReasoningTagsFromText(text, {
			mode: preserve ? "preserve" : "strict",
			scope: profile === "final-answer-delivery" ? "leading" : "all",
			trim: preserveCodeIndentation ? "none" : trim,
			recoverUnclosed: !streaming
		})
	};
	const filters = [
		...!preserve ? [minimaxToolCallTextFilter] : [],
		{
			transform: stripModelSpecialTokens,
			activationTokens: ["<|", "<｜"]
		},
		{
			transform: stripRelevantMemoriesTags,
			activationTokens: ["relevant-memories", "relevant_memories"]
		},
		toolCallXmlTextFilter({
			stripFunctionCallsXmlPayloads: profile === "tool-progress",
			stripFunctionResponseAfterPluralToolCalls: profile === "delivery" || profile === "final-answer-delivery"
		}),
		...profile === "tool-progress" ? [] : [assistantTraceTextFilter],
		legacyBracketToolCallTextFilter,
		plainToolCallTextFilter,
		...!preserve ? [downgradedToolCallTextFilter(options)] : []
	];
	if (preserve) filters.unshift(reasoning);
	else filters.push(reasoning);
	filters.push(preserve ? leadingEmptyLinesTextFilter : trimTextFilter(trim, { preserveCodeIndentation }));
	profileFilters.set(key, filters);
	return filters;
}
const minimaxToolCallTextFilter = {
	transform: stripMinimaxToolCallXml,
	activationTokens: ["minimax:tool_call", "<]minimax[>[<tool_call>"]
};
function toolCallXmlTextFilter(options = {}) {
	return {
		transform: (text) => stripToolCallXmlTags(text, options),
		activationTokens: ["<"]
	};
}
const legacyBracketToolCallTextFilter = {
	transform: stripLegacyBracketToolCallBlocks,
	activationTokens: ["TOOL_CALL", "TOOL_RESULT"]
};
const assistantTraceTextFilter = {
	transform: stripAssistantInternalTraceLines,
	activationTokens: [
		"tool",
		"function",
		"📊",
		"🛠",
		"📖",
		"📝",
		"🔍",
		"🔎",
		"⚙"
	]
};
const plainToolCallTextFilter = {
	transform: (text) => stripPlainTextToolCallBlocks(text, { resolveProtectedRanges: findCodeRegions }),
	activationTokens: [
		"[",
		"<function=",
		"to="
	]
};
function sanitizeAssistantVisibleTextWithProfile(text, profile = "delivery", streaming = false) {
	return applyTextFilters(text, assistantVisibleTextFilters(profile, streaming));
}
function stripAssistantInternalScaffolding(text) {
	return sanitizeAssistantVisibleTextWithProfile(text, "internal-scaffolding");
}
/**
* Canonical user-visible assistant text sanitizer for delivery and history
* extraction paths. Keeps prose, removes internal scaffolding.
*/
function sanitizeAssistantVisibleText(text) {
	return sanitizeAssistantVisibleTextWithProfile(text, "delivery");
}
/** Sanitizes text already marked as final-answer prose by the agent runtime. */
function sanitizeAssistantFinalAnswerText(text) {
	return sanitizeAssistantVisibleTextWithProfile(text, "final-answer-delivery");
}
/**
* Backwards-compatible trim wrapper.
* Prefer sanitizeAssistantVisibleTextWithProfile for new call sites.
*/
function sanitizeAssistantVisibleTextWithOptions(text, options) {
	return sanitizeAssistantVisibleTextWithProfile(text, options?.trim === "none" ? "history" : "delivery");
}
//#endregion
export { stripFinalTags as _, plainToolCallTextFilter as a, sanitizeAssistantVisibleTextWithOptions as c, stripLegacyBracketToolCallBlocks as d, stripToolCallXmlTags as f, findFinalTagMatches as g, stripReasoningTagsFromText as h, minimaxToolCallTextFilter as i, sanitizeAssistantVisibleTextWithProfile as l, hasOrphanReasoningCloseBoundary as m, assistantVisibleTextFilters as n, sanitizeAssistantFinalAnswerText as o, toolCallXmlTextFilter as p, legacyBracketToolCallTextFilter as r, sanitizeAssistantVisibleText as s, assistantTraceTextFilter as t, stripAssistantInternalScaffolding as u, downgradedToolCallTextFilter as v, stripDowngradedToolCallText as y };
