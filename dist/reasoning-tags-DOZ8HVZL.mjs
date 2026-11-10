import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as fromMarkdown } from "./lib-BdF0Xu6y.mjs";
import { t as gfmTable } from "./syntax-DmBxU9t8.mjs";
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-table@2.0.0_supports-color@10.2.2/node_modules/mdast-util-gfm-table/lib/index.js
/**
* @typedef {import('mdast').InlineCode} InlineCode
* @typedef {import('mdast').Table} Table
* @typedef {import('mdast').TableCell} TableCell
* @typedef {import('mdast').TableRow} TableRow
*
* @typedef {import('markdown-table').Options} MarkdownTableOptions
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').State} State
* @typedef {import('mdast-util-to-markdown').Info} Info
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [tableCellPadding=true]
*   Whether to add a space of padding between delimiters and cells (default:
*   `true`).
* @property {boolean | null | undefined} [tablePipeAlign=true]
*   Whether to align the delimiters (default: `true`).
* @property {MarkdownTableOptions['stringLength'] | null | undefined} [stringLength]
*   Function to detect the length of table cell content, used when aligning
*   the delimiters between cells (optional).
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM tables in
* markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM tables.
*/
function gfmTableFromMarkdown() {
	return {
		enter: {
			table: enterTable,
			tableData: enterCell,
			tableHeader: enterCell,
			tableRow: enterRow
		},
		exit: {
			codeText: exitCodeText,
			table: exitTable,
			tableData: exit,
			tableHeader: exit,
			tableRow: exit
		}
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterTable(token) {
	const align = token._align;
	this.enter({
		type: "table",
		align: align.map(function(d) {
			return d === "none" ? null : d;
		}),
		children: []
	}, token);
	this.data.inTable = true;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitTable(token) {
	this.exit(token);
	this.data.inTable = void 0;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterRow(token) {
	this.enter({
		type: "tableRow",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exit(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterCell(token) {
	this.enter({
		type: "tableCell",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCodeText(token) {
	let value = this.resume();
	if (this.data.inTable) value = value.replace(/\\([\\|])/g, replace);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.value = value;
	this.exit(token);
}
/**
* @param {string} $0
* @param {string} $1
* @returns {string}
*/
function replace($0, $1) {
	return $1 === "|" ? $1 : $0;
}
//#endregion
//#region packages/markdown-core/src/reasoning-tag-parser.ts
const REASONING_TAG_NAMES = [
	"think",
	"thinking",
	"thought",
	"reasoning",
	"internal",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"antml:reasoning",
	"mm:think",
	"mm:thinking",
	"mm:thought",
	"mm:reasoning"
];
const REASONING_TAG_NAME_SET = new Set(REASONING_TAG_NAMES);
const DISABLE_HTML_MARKDOWN = { disable: { null: ["htmlFlow", "htmlText"] } };
/** Scans quote-aware provider reasoning tags with iterative malformed recovery. */
function scanReasoningTags(text, final = true) {
	const tags = [];
	let cursor = 0;
	while (cursor < text.length) {
		const start = text.indexOf("<", cursor);
		if (start === -1) break;
		const parsed = parseReasoningTagAt(text, start, final);
		if (parsed.kind === "tag") {
			tags.push(parsed.tag);
			cursor = parsed.tag.index + parsed.tag.text.length;
			continue;
		}
		if (parsed.kind === "pending") return {
			tags,
			pendingStart: start
		};
		cursor = parsed.next;
	}
	return { tags };
}
function parseReasoningTagName(text, start) {
	let cursor = skipTagWhitespace(text, start + 1);
	let isClose = false;
	if (text.charAt(cursor) === "/") {
		isClose = true;
		cursor = skipTagWhitespace(text, cursor + 1);
	}
	const nameStart = cursor;
	while (cursor < text.length && isTagNameCharacter(text.charCodeAt(cursor))) cursor += 1;
	const partialName = text.slice(nameStart, cursor).toLowerCase();
	if (!partialName) return { kind: cursor === text.length ? "pending" : "invalid" };
	if (!REASONING_TAG_NAME_SET.has(partialName)) {
		const canBecomeKnown = REASONING_TAG_NAMES.some((name) => name.startsWith(partialName));
		return { kind: cursor === text.length && canBecomeKnown ? "pending" : "invalid" };
	}
	if (cursor === text.length) return { kind: "pending" };
	const boundary = text.charAt(cursor);
	if (!isTagWhitespace(boundary) && boundary !== "/" && boundary !== ">") return { kind: "invalid" };
	return {
		kind: "name",
		end: cursor,
		isClose,
		isPrivate: partialName === "internal"
	};
}
function parseReasoningTagAt(text, start, final) {
	const name = parseReasoningTagName(text, start);
	if (name.kind !== "name") return name.kind === "pending" && !final ? { kind: "pending" } : invalidTag(text, start);
	let quote;
	let lastSignificant = "";
	for (let cursor = name.end; cursor < text.length; cursor += 1) {
		const char = text.charAt(cursor);
		if (quote) {
			if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (char === "<") return invalidTag(text, start);
		if (char === ">") {
			const end = cursor + 1;
			return {
				kind: "tag",
				tag: {
					index: start,
					text: text.slice(start, end),
					isClose: name.isClose,
					isSelfClosing: !name.isClose && lastSignificant === "/",
					isPrivate: name.isPrivate
				}
			};
		}
		if (!isTagWhitespace(char)) lastSignificant = char;
	}
	return final ? invalidTag(text, start) : { kind: "pending" };
}
function invalidTag(text, start) {
	const nested = text.indexOf("<", start + 1);
	return {
		kind: "invalid",
		next: nested === -1 ? text.length : nested
	};
}
function skipTagWhitespace(text, start) {
	let cursor = start;
	while (cursor < text.length && isTagWhitespace(text.charAt(cursor))) cursor += 1;
	return cursor;
}
function isTagWhitespace(char) {
	return /\s/u.test(char);
}
function isTagNameCharacter(code) {
	return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 58;
}
function findNextLineEnding(text, start) {
	const carriageReturn = text.indexOf("\r", start);
	const lineFeed = text.indexOf("\n", start);
	if (carriageReturn === -1) return lineFeed;
	return lineFeed === -1 ? carriageReturn : Math.min(carriageReturn, lineFeed);
}
function appendMarkdownSource(source, start, token, value) {
	const extra = value.length - (token.end.offset - token.start.offset);
	for (let cursor = start + source.offsets.length; cursor < token.end.offset; cursor += 1) {
		const consumed = cursor - token.start.offset;
		source.offsets.push(source.value.length + (consumed > 0 ? consumed + extra : 0));
	}
	source.value += value;
}
function captureInlineSources(text, sources) {
	const observe = function(token) {
		const start = this.stack.findLast((entry) => entry.type === "inlineCode")?.position?.start.offset;
		if (start === void 0) return;
		let source = sources.get(start);
		if (!source) {
			const inlineBlock = this.stack.findLast((entry) => entry.type === "paragraph" || entry.type === "heading");
			const begin = inlineBlock?.children[0]?.position?.start.offset;
			const containers = this.stack.filter((entry) => entry.type === "listItem" || entry.type === "blockquote");
			const prefixEnd = begin !== void 0 && containers.length ? begin : start;
			const prefixStart = containers.length ? Math.max(text.lastIndexOf("\n", prefixEnd - 1), text.lastIndexOf("\r", prefixEnd - 1)) + 1 : start;
			const prefix = containers.map((entry) => text.slice(entry.position?.start.offset, entry.children[0]?.position?.start.offset)).join("");
			source = {
				prefix: {
					start: prefixStart,
					end: prefixEnd,
					ownerStart: containers[0]?.position?.start.offset ?? start,
					text: prefix + (containers.length && inlineBlock?.type === "heading" ? text.slice(inlineBlock.position?.start.offset, begin) : "")
				},
				value: "",
				offsets: []
			};
			sources.set(start, source);
		}
		appendMarkdownSource(source, start, token, this.sliceSerialize(token));
	};
	return { enter: {
		codeTextData(token) {
			observe.call(this, token);
			expectDefined(this.config.enter.data, "Markdown data handler").call(this, token);
		},
		lineEnding: observe
	} };
}
function captureIndentedSources(text, sources, observeInlineLineEnding) {
	const observe = function(token) {
		if (!this.tokenStack.some(([parent]) => parent.type === "codeIndented")) return;
		const start = this.stack.findLast((entry) => entry.type === "code")?.position?.start.offset;
		if (start === void 0) return;
		let source = sources.get(start);
		if (!source) {
			const owner = this.stack.find((entry) => entry.type === "listItem" || entry.type === "blockquote");
			source = {
				value: "",
				offsets: [],
				context: text.slice(owner?.position?.start.offset ?? start, token.start.offset),
				ownerStart: owner?.position?.start.offset ?? start,
				nested: owner !== void 0
			};
			sources.set(start, source);
		}
		appendMarkdownSource(source, start, token, this.sliceSerialize(token));
	};
	return { enter: {
		codeFlowValue(token) {
			observe.call(this, token);
			expectDefined(this.config.enter.data, "Markdown data handler").call(this, token);
		},
		lineEnding(token) {
			observeInlineLineEnding?.call(this, token);
			observe.call(this, token);
		}
	} };
}
function parseMarkdownOwnership(text, options) {
	const paragraphs = options?.includeIndentedSource ? [] : void 0;
	if (!text) return {
		regions: [],
		codeSpans: [],
		textSpans: [],
		retainStart: 0,
		completedParagraphs: [],
		...paragraphs ? { paragraphs } : {}
	};
	const sources = /* @__PURE__ */ new Map();
	const indentedSources = options?.includeIndentedSource ? /* @__PURE__ */ new Map() : void 0;
	const inlineSourceExtension = options?.includeSource ? captureInlineSources(text, sources) : void 0;
	const tables = options?.syntax !== "commonmark";
	const tree = fromMarkdown(text, {
		extensions: [DISABLE_HTML_MARKDOWN, ...tables ? [gfmTable()] : []],
		mdastExtensions: [
			...tables ? [gfmTableFromMarkdown()] : [],
			...inlineSourceExtension ? [inlineSourceExtension] : [],
			...indentedSources ? [captureIndentedSources(text, indentedSources, inlineSourceExtension?.enter?.lineEnding)] : []
		]
	});
	const completedParagraphs = [];
	const regions = [];
	const textSpans = [];
	const blocks = tree.children ?? [];
	for (let index = 0; index < blocks.length; index += 1) {
		const block = expectDefined(blocks[index], "Markdown block");
		const next = blocks[index + 1]?.position?.start;
		const blockStart = block.position?.start?.offset;
		const endLine = block.position?.end?.line;
		const blockEnd = block.position?.end?.offset;
		if (paragraphs && block.type === "paragraph" && blockStart !== void 0 && blockEnd !== void 0) paragraphs.push({
			start: blockStart,
			end: blockEnd
		});
		let paragraph;
		if (block.type === "paragraph" && blockStart !== void 0 && endLine !== void 0 && next?.offset !== void 0 && next.line !== void 0 && next.line > endLine + 1) {
			paragraph = {
				start: blockStart,
				end: next.offset,
				hasReferenceCandidate: false
			};
			completedParagraphs.push(paragraph);
		}
		const pending = [block];
		while (pending.length > 0) {
			const node = expectDefined(pending.pop(), "Markdown ownership node");
			if (paragraph && node.type === "text" && node.value?.includes("[")) paragraph.hasReferenceCandidate = true;
			const start = node.position?.start?.offset;
			const end = node.position?.end?.offset;
			if (options?.includeText && node.type === "text" && start !== void 0 && end !== void 0) textSpans.push([start, end]);
			if ((node.type === "code" || node.type === "inlineCode") && start !== void 0 && end !== void 0) {
				const source = sources.get(start);
				if (source) while (source.offsets.length <= end - start) source.offsets.push(source.value.length);
				const indentedSource = indentedSources?.get(start);
				if (indentedSource) {
					indentedSource.value = node.value ?? "";
					while (indentedSource.offsets.length <= end - start) indentedSource.offsets.push(indentedSource.value.length);
					indentedSource.offsets.forEach((offset, sourceIndex) => {
						indentedSource.offsets[sourceIndex] = Math.min(offset, indentedSource.value.length);
					});
				}
				regions.push({
					start,
					end,
					block: node.type === "code",
					...source ? { source } : {},
					...indentedSource ? { indentedSource } : {}
				});
			}
			for (const child of node.children?.toReversed() ?? []) pending.push(child);
		}
	}
	regions.sort((left, right) => left.start - right.start);
	return {
		regions,
		codeSpans: regions.map(({ start, end }) => [start, end]),
		textSpans,
		retainStart: tree.children?.at(-1)?.position?.start?.offset ?? text.length,
		completedParagraphs,
		...paragraphs ? { paragraphs } : {}
	};
}
/** Returns parser-owned CommonMark/GFM code ranges with block ownership. */
function findMarkdownCodeRegions(text, options) {
	return /[`~\t]| {4}/u.test(text) ? parseMarkdownOwnership(text, options).regions : [];
}
/** Returns parser-owned CommonMark/GFM code ranges, including their delimiters. */
function findMarkdownCodeSpans(text) {
	if (!/[`~\t]| {4}/u.test(text)) return [];
	return parseMarkdownOwnership(text).codeSpans;
}
function isInsideCode(index, spans) {
	let low = 0;
	let high = spans.length - 1;
	while (low <= high) {
		const middle = Math.floor((low + high) / 2);
		const span = spans[middle];
		if (!span) return false;
		if (index < span[0]) high = middle - 1;
		else if (index >= span[1]) low = middle + 1;
		else return true;
	}
	return false;
}
function reduceReasoningText(text, codeSpans, state, options) {
	const output = [];
	const emit = (kind, value) => {
		if (!value) return;
		const previous = output.at(-1);
		if (previous?.kind === kind) previous.text += value;
		else output.push({
			kind,
			text: value
		});
		if (kind === "text" && value.trim()) state.visibleEver = true;
	};
	const append = (value) => {
		if (!value) return;
		if (state.depth > 0 && state.pending) {
			state.pending.content += value;
			state.pending.protectedClose ||= scanReasoningTags(value).tags.some((tag) => tag.isClose);
		} else emit("text", value);
	};
	const start = options.start ?? 0;
	const scan = scanReasoningTags(text.slice(start), options.final);
	const tags = [];
	for (const scannedTag of scan.tags) {
		const index = scannedTag.index + start;
		if (!isInsideCode(index, codeSpans)) tags.push({
			...scannedTag,
			index
		});
	}
	const mustParseRemainder = [];
	if (options.scope === "leading") {
		let mustParse = false;
		for (let index = tags.length - 1; index >= 0; index -= 1) {
			mustParse ||= tags[index]?.isPrivate === true;
			mustParseRemainder[index] = mustParse;
			mustParse ||= tags[index]?.isClose === true;
		}
	}
	let cursor = start;
	for (const [tagIndex, tag] of tags.entries()) {
		const beforeTag = text.slice(cursor, tag.index);
		append(beforeTag);
		const tagEnd = tag.index + tag.text.length;
		if (tag.isSelfClosing) {
			if (state.depth === 0 && options.scope === "leading" && state.visibleEver) {
				emit("text", text.slice(tag.index));
				cursor = text.length;
				break;
			}
			cursor = tagEnd;
			continue;
		}
		if (!tag.isClose) {
			if (state.depth === 0 && options.scope === "leading" && state.visibleEver && !mustParseRemainder[tagIndex]) {
				emit("text", text.slice(tag.index));
				cursor = text.length;
				break;
			}
			if (state.depth === 0) state.pending = {
				content: "",
				containsPrivate: tag.isPrivate,
				openTag: tag.text,
				protectedClose: false,
				visibleBefore: state.visibleEver
			};
			else if (state.pending) state.pending.containsPrivate ||= tag.isPrivate;
			state.depth += 1;
			cursor = tagEnd;
			continue;
		}
		if (state.depth > 0) {
			state.depth -= 1;
			if (state.depth === 0 && state.pending) {
				if (!state.pending.containsPrivate) emit("thinking", state.pending.content);
				state.pending = void 0;
			} else if (state.pending) state.pending.protectedClose = true;
			cursor = tagEnd;
			continue;
		}
		if (options.mode === "visible") append(tag.text);
		else {
			const after = text.slice(tagEnd);
			if (beforeTag.trim() && after.trim()) {
				const thinking = output.filter((delta) => delta.kind === "thinking");
				output.splice(0, output.length, ...thinking);
				state.visibleEver = false;
			}
		}
		cursor = tagEnd;
	}
	append(text.slice(cursor));
	if (options.final && state.depth > 0 && state.pending) {
		const pending = state.pending;
		if (!pending.containsPrivate) {
			if ((options.mode === "static-preserve" || options.mode === "static-strict" && !pending.visibleBefore && !pending.protectedClose || options.mode === "visible" && !pending.protectedClose) && options.recoverUnclosed !== false) emit("text", options.mode === "visible" && pending.visibleBefore ? pending.openTag + pending.content : pending.content);
			else emit("thinking", pending.content);
		}
		state.depth = 0;
		state.pending = void 0;
	}
	return output;
}
/** Strips reasoning tags using the same reducer as streamed partitioning. */
function stripReasoningTagsFromMarkdown(text, options) {
	return reduceReasoningText(text, findMarkdownCodeSpans(text), {
		depth: 0,
		visibleEver: false
	}, {
		final: true,
		mode: options.recoverUnclosed === false ? "hide" : options.mode === "preserve" ? "static-preserve" : "static-strict",
		scope: options.scope
	}).filter((delta) => delta.kind === "text").map((delta) => delta.text).join("");
}
//#endregion
//#region packages/markdown-core/src/reasoning-tags.ts
const MARKDOWN_CONTAINER_LINE_RE = /^(?: {0,3}(?:>|[-+*][\t ]|\d{1,9}[.)][\t ]))/mu;
function endsBlankBlock(text) {
	let cursor = text.length - 1;
	if (text[cursor] === "\n") cursor -= text[cursor - 1] === "\r" ? 2 : 1;
	else if (text[cursor] === "\r") cursor -= 1;
	else return false;
	while (text[cursor] === " " || text[cursor] === "	") cursor -= 1;
	return text[cursor] === "\n" || text[cursor] === "\r";
}
function advancePendingTagProbe(probe, text) {
	for (const char of text) {
		if (probe.quote) {
			if (char === probe.quote) probe.quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") probe.quote = char;
		else if (char === ">" || char === "<") {
			probe.resolved = true;
			return;
		}
	}
}
/** Creates a block-incremental parser that emits only Markdown-stable text. */
function createReasoningTagTextPartitioner() {
	const reduction = {
		depth: 0,
		visibleEver: false
	};
	let source = "";
	let endedBlankBlock = false;
	let blockStart = 0;
	let emitted = 0;
	let holdStart;
	let heldBacktickStart;
	let strictMode = false;
	let pendingTagProbe;
	let fastPathCheckedThrough = 0;
	let fastPathCodeSafe = false;
	let nonFinalFullParses = 0;
	let nonFinalCodeSpans;
	let nonFinalCodeSpansEnd = 0;
	let nonFinalOpenEndedCode = false;
	let nonFinalRetainStart = 0;
	let nonFinalCloseReparseUsed = false;
	const startPendingTagProbe = (start, end) => {
		pendingTagProbe = {
			nameResolved: false,
			resolved: false,
			scannedThrough: end,
			start
		};
		advancePendingTagProbe(pendingTagProbe, source.slice(start + 1, end));
	};
	const compactCommittedSource = (retainStart) => {
		source = source.slice(retainStart);
		endedBlankBlock = endsBlankBlock(source);
		blockStart = source.length;
		emitted = source.length;
		holdStart = void 0;
		heldBacktickStart = void 0;
		pendingTagProbe = void 0;
		fastPathCheckedThrough = 0;
		fastPathCodeSafe = false;
		nonFinalFullParses = 0;
		nonFinalCodeSpans = void 0;
		nonFinalCodeSpansEnd = 0;
		nonFinalOpenEndedCode = false;
		nonFinalRetainStart = 0;
		nonFinalCloseReparseUsed = false;
	};
	const merge = (target, additions) => {
		for (const addition of additions) {
			const previous = target.at(-1);
			if (previous?.kind === addition.kind) previous.text += addition.text;
			else target.push({ ...addition });
		}
	};
	const reduceSafePrefix = (start, end, probeEnd, output) => {
		const scan = scanReasoningTags(source.slice(start, end), false);
		const reduceEnd = scan.pendingStart === void 0 ? end : start + scan.pendingStart;
		merge(output, reduceReasoningText(source.slice(start, reduceEnd), [], reduction, {
			final: false,
			mode: "visible",
			scope: "all"
		}));
		emitted = reduceEnd;
		fastPathCheckedThrough = reduceEnd;
		if (scan.pendingStart !== void 0) startPendingTagProbe(reduceEnd, probeEnd);
		holdStart = reduction.depth > 0 || scan.pendingStart !== void 0 ? emitted : void 0;
	};
	const emitSafePrefix = (limit, output, appended) => {
		if (strictMode) {
			holdStart ??= emitted;
			return;
		}
		if (reduction.depth > 0) {
			holdStart ??= emitted;
			const segment = source.slice(emitted, limit);
			if (!fastPathCodeSafe || /[\r\n`]/u.test(segment)) return;
			reduceSafePrefix(emitted, limit, limit, output);
			return;
		}
		if (holdStart !== void 0 || emitted >= limit) return;
		const appendedStart = source.length - (appended?.length ?? 0);
		const useAppended = appended !== void 0 && emitted >= appendedStart;
		const scanSource = useAppended ? appended : source;
		const scanOffset = useAppended ? appendedStart : 0;
		while (emitted < limit && holdStart === void 0) {
			let special = -1;
			for (let index = emitted; index < limit; index += 1) {
				const char = scanSource.charAt(index - scanOffset);
				if (char === "<" || char === "`") {
					special = index;
					break;
				}
			}
			const end = special === -1 ? limit : special;
			if (special !== -1 && source.charAt(special) === "`") {
				heldBacktickStart = special;
				holdStart = emitted;
				return;
			}
			const text = scanSource.slice(emitted - scanOffset, end - scanOffset);
			if (text) {
				merge(output, [{
					kind: "text",
					text
				}]);
				if (text.trim()) reduction.visibleEver = true;
				emitted = end;
			}
			if (special === -1) return;
			const parsed = parseReasoningTagAt(source.slice(special, limit), 0, false);
			if (parsed.kind === "invalid") {
				merge(output, [{
					kind: "text",
					text: "<"
				}]);
				reduction.visibleEver = true;
				emitted = special + 1;
				continue;
			}
			holdStart = special;
			if (parsed.kind === "pending") {
				startPendingTagProbe(special, limit);
				return;
			}
			if (/[\r\n]/u.test(source.slice(blockStart, special))) return;
			const fastPathInvalidated = /[\r\n`]/u.test(source.slice(fastPathCheckedThrough, special));
			if (!fastPathCodeSafe || fastPathInvalidated) {
				if (nonFinalFullParses >= 1) return;
				nonFinalFullParses += 1;
				const ownership = parseMarkdownOwnership(source.slice(0, limit));
				nonFinalCodeSpans = ownership.codeSpans;
				nonFinalCodeSpansEnd = limit;
				nonFinalOpenEndedCode = nonFinalCodeSpans.some(([, spanEnd]) => spanEnd === limit);
				nonFinalRetainStart = ownership.retainStart;
				fastPathCodeSafe = !source.slice(blockStart, special).includes("`") && !isInsideCode(special, nonFinalCodeSpans);
			}
			if (!fastPathCodeSafe) return;
			const boundaries = [
				source.indexOf("`", special),
				source.indexOf("\r", special),
				source.indexOf("\n", special)
			].filter((index) => index !== -1 && index < limit);
			const safeLimit = boundaries.length > 0 ? Math.min(...boundaries) : limit;
			reduceSafePrefix(special, safeLimit, limit, output);
		}
	};
	const processBlock = (end, final, output, parsedCodeSpans, parsedRetainStart, recoverUnclosed = true) => {
		const previousBlockStart = blockStart;
		let blockCodeSpans = parsedCodeSpans;
		let blockRetainStart = parsedRetainStart;
		const finalizePending = () => {
			if (!final || reduction.depth === 0) return;
			merge(output, reduceReasoningText("", [], reduction, {
				final: true,
				recoverUnclosed,
				mode: strictMode ? "hide" : "visible",
				scope: "all"
			}));
		};
		if (end <= blockStart) {
			finalizePending();
			return;
		}
		if (end <= emitted) {
			finalizePending();
			blockStart = end;
			fastPathCheckedThrough = Math.max(fastPathCheckedThrough, end);
			return;
		}
		emitSafePrefix(end, output);
		if (holdStart !== void 0 && holdStart < end) {
			const held = source.slice(holdStart, end);
			if (!final) {
				if (pendingTagProbe && !pendingTagProbe.resolved) return;
				pendingTagProbe = void 0;
				const pendingStart = scanReasoningTags(held, false).pendingStart;
				if (pendingStart !== void 0) {
					startPendingTagProbe(holdStart + pendingStart, end);
					return;
				}
			}
			const block = source.slice(0, end);
			const start = holdStart;
			if (!blockCodeSpans) {
				const ownership = parseMarkdownOwnership(block);
				blockCodeSpans = ownership.codeSpans;
				blockRetainStart = ownership.retainStart;
			}
			merge(output, reduceReasoningText(block, blockCodeSpans, reduction, {
				final,
				recoverUnclosed,
				mode: strictMode ? "hide" : "visible",
				scope: "all",
				start
			}));
			emitted = end;
		} else if (emitted < end) {
			const text = source.slice(emitted, end);
			merge(output, [{
				kind: "text",
				text
			}]);
			if (text.trim()) reduction.visibleEver = true;
			emitted = end;
		}
		finalizePending();
		const processedText = source.slice(previousBlockStart, end);
		const lastLineStart = Math.max(source.lastIndexOf("\n", Math.max(0, end - 1)), source.lastIndexOf("\r", Math.max(0, end - 1))) + 1;
		const crossedLineBoundary = /[\r\n]/u.test(processedText);
		blockStart = crossedLineBoundary && lastLineStart < end ? lastLineStart : end;
		holdStart = strictMode || reduction.depth > 0 ? end : void 0;
		heldBacktickStart = void 0;
		if (reduction.depth === 0) nonFinalCloseReparseUsed = false;
		pendingTagProbe = void 0;
		fastPathCheckedThrough = end;
		fastPathCodeSafe = !final && !crossedLineBoundary && emitted === source.length && !blockCodeSpans?.some(([, spanEnd]) => spanEnd === source.length);
		if (!final && reduction.depth === 0 && emitted === source.length && endedBlankBlock && !MARKDOWN_CONTAINER_LINE_RE.test(source.slice(blockRetainStart ?? 0)) && !blockCodeSpans?.some(([, spanEnd]) => spanEnd === source.length)) compactCommittedSource(blockRetainStart ?? 0);
	};
	const consume = (appended, strict, final, recoverUnclosed = true) => {
		strictMode ||= strict;
		const previousEndedBlankBlock = endedBlankBlock;
		source += appended;
		if (appended) endedBlankBlock = (appended.endsWith("\n") || appended.endsWith("\r")) && endsBlankBlock(source);
		const appendedBlock = appended.replace(/^(?:\r\n|\r|\n)+/u, "");
		const appendedStartsTopLevelBlock = previousEndedBlankBlock && /^[^\t \r\n]/u.test(appendedBlock) && !MARKDOWN_CONTAINER_LINE_RE.test(appendedBlock);
		if (pendingTagProbe && !pendingTagProbe.resolved) {
			advancePendingTagProbe(pendingTagProbe, source.slice(pendingTagProbe.scannedThrough));
			pendingTagProbe.scannedThrough = source.length;
			if (!pendingTagProbe.nameResolved) {
				const name = parseReasoningTagName(source, pendingTagProbe.start);
				pendingTagProbe.nameResolved = name.kind === "name";
				pendingTagProbe.resolved ||= name.kind === "invalid";
			}
		}
		if (pendingTagProbe?.resolved && holdStart !== void 0) {
			pendingTagProbe = void 0;
			holdStart = void 0;
			heldBacktickStart = void 0;
		}
		const output = [];
		if (final) processBlock(source.length, true, output, void 0, void 0, recoverUnclosed);
		else {
			emitSafePrefix(source.length, output, appended);
			if (!strictMode && holdStart !== void 0 && holdStart < source.length) {
				const ownershipStart = heldBacktickStart ?? holdStart;
				const heldLineStart = Math.max(source.lastIndexOf("\n", Math.max(0, ownershipStart - 1)), source.lastIndexOf("\r", Math.max(0, ownershipStart - 1))) + 1;
				const heldLineEnd = findNextLineEnding(source, ownershipStart);
				const tableLookaheadPending = source.slice(heldLineStart, heldLineEnd === -1 ? source.length : heldLineEnd).includes("|") && (heldLineEnd === -1 || findNextLineEnding(source, heldLineEnd + (source.charAt(heldLineEnd) === "\r" && source.charAt(heldLineEnd + 1) === "\n" ? 2 : 1)) === -1);
				const completedBlankBlock = endedBlankBlock;
				const heldBacktick = heldBacktickStart !== void 0;
				let openingRunEnd = ownershipStart;
				while (source.charAt(openingRunEnd) === "`") openingRunEnd += 1;
				const hasLaterBacktick = !heldBacktick || source.includes("`", openingRunEnd);
				const terminatedBacktickTail = !heldBacktick || source.at(-1) !== "`";
				const shouldTryParser = pendingTagProbe ? pendingTagProbe.resolved : reduction.depth > 0 ? appended.includes("<") : !heldBacktick || hasLaterBacktick && terminatedBacktickTail || completedBlankBlock;
				const mayResolveHeldReasoning = reduction.depth > 0 && !nonFinalCloseReparseUsed && (appended.includes("<") || appended.includes(">")) && scanReasoningTags(source.slice(holdStart), false).tags.some((tag) => tag.isClose);
				const reusableCodeSpans = nonFinalCodeSpansEnd === source.length ? nonFinalCodeSpans : void 0;
				const mayCloseTopLevelBlock = completedBlankBlock && !nonFinalOpenEndedCode && (appendedStartsTopLevelBlock || !MARKDOWN_CONTAINER_LINE_RE.test(source.slice(nonFinalRetainStart)));
				if ((shouldTryParser || mayResolveHeldReasoning) && !tableLookaheadPending && (reusableCodeSpans !== void 0 || nonFinalFullParses < 1 || mayCloseTopLevelBlock || mayResolveHeldReasoning)) {
					if (!reusableCodeSpans) nonFinalFullParses += 1;
					const ownership = reusableCodeSpans ? void 0 : parseMarkdownOwnership(source);
					nonFinalCloseReparseUsed ||= mayResolveHeldReasoning;
					const codeSpans = reusableCodeSpans ?? ownership?.codeSpans ?? [];
					const retainStart = reusableCodeSpans ? nonFinalRetainStart : ownership?.retainStart ?? 0;
					nonFinalRetainStart = retainStart;
					nonFinalOpenEndedCode = codeSpans.some(([, spanEnd]) => spanEnd === source.length);
					const heldCodeSpan = codeSpans.find(([start, end]) => ownershipStart >= start && ownershipStart < end);
					const heldInOpenEndedCode = heldCodeSpan?.[1] === source.length;
					const stableCode = heldCodeSpan !== void 0 && !heldInOpenEndedCode;
					const stableNonDelimiter = heldBacktick && heldCodeSpan === void 0 && completedBlankBlock;
					if (!heldBacktick && !heldInOpenEndedCode || stableCode || stableNonDelimiter) {
						let processEnd = source.length;
						if (stableNonDelimiter || mayCloseTopLevelBlock) processEnd = source.length;
						else if (stableCode && heldCodeSpan) {
							processEnd = heldCodeSpan[1];
							while (processEnd < source.length) {
								const char = source.charAt(processEnd);
								if (char === "\r" || char === "\n" || char === "<" || char === "`") break;
								processEnd += 1;
							}
						} else {
							const nextBacktick = source.indexOf("`", holdStart);
							if (nextBacktick !== -1) processEnd = nextBacktick;
						}
						if (processEnd > holdStart) {
							const stableTagSuffix = processEnd < source.length && source.charAt(processEnd) === "<" && !isInsideCode(processEnd, codeSpans);
							processBlock(processEnd, false, output, codeSpans, retainStart);
							if (stableTagSuffix) {
								fastPathCodeSafe = true;
								fastPathCheckedThrough = processEnd;
								emitSafePrefix(source.length, output);
							}
						}
					}
				}
			}
			if (holdStart === void 0 && reduction.depth === 0 && emitted === source.length && endedBlankBlock && (!MARKDOWN_CONTAINER_LINE_RE.test(source.slice(nonFinalRetainStart)) || appendedStartsTopLevelBlock) && nonFinalFullParses < 1) {
				nonFinalFullParses += 1;
				const ownership = parseMarkdownOwnership(source);
				const codeSpans = ownership.codeSpans;
				nonFinalRetainStart = ownership.retainStart;
				nonFinalOpenEndedCode = codeSpans.some(([, spanEnd]) => spanEnd === source.length);
				if (!nonFinalOpenEndedCode) compactCommittedSource(ownership.retainStart);
			}
		}
		if (final) compactCommittedSource(source.length);
		return output;
	};
	return {
		markStrict() {
			strictMode = true;
			holdStart ??= emitted;
		},
		push(chunk) {
			return consume(chunk, true, false);
		},
		pushVisible(chunk) {
			return consume(chunk, false, false);
		},
		flush(options) {
			return consume("", strictMode, true, options?.recoverUnclosed);
		},
		hasPending() {
			return holdStart !== void 0 && holdStart < source.length || reduction.depth > 0 || emitted < source.length;
		},
		hasPendingSyntax() {
			return pendingTagProbe !== void 0 || heldBacktickStart !== void 0 || reduction.depth > 0;
		},
		isInsideReasoning() {
			return reduction.depth > 0;
		}
	};
}
//#endregion
export { scanReasoningTags as a, parseReasoningTagAt as i, findMarkdownCodeRegions as n, stripReasoningTagsFromMarkdown as o, parseMarkdownOwnership as r, createReasoningTagTextPartitioner as t };
