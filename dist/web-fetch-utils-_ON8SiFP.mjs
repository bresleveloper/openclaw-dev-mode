import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as stripInlineLinks } from "./markdown-plain-text-D0Mjik_o.mjs";
import { n as postprocess, r as parse, t as preprocess } from "./preprocess-CI6Hq5yj.mjs";
import { t as gfmTable } from "./syntax-DmBxU9t8.mjs";
import { t as stripInvisibleUnicode } from "./unicode-visibility-cJ_24BIl.mjs";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.mjs";
import { a as readRawTextBounds, c as skipHtmlComment, i as isTagNameChar, l as skipRawTextElement, n as findRawTextOpenTagStart, o as readRawTextOpenTagName, r as isAsciiWhitespace, s as readTagToken, t as RAW_TEXT_TAGS, u as startsLikeHtmlTag } from "./html-scanner-D3uZ17mp.mjs";
//#region packages/markdown-core/src/markdown-code-regions.ts
/** Read exact original UTF-16 code ranges without building a Markdown tree. */
function findMarkdownCodeRegions(text) {
	if (!/[`~\t]| {4}/u.test(text)) return [];
	const events = postprocess(parse({ extensions: [{ disable: { null: ["htmlFlow", "htmlText"] } }, gfmTable()] }).document().write(preprocess()(text, void 0, true)));
	const regions = [];
	let imageDepth = 0;
	for (const [phase, token] of events) {
		if (token.type === "image") imageDepth += phase === "enter" ? 1 : -1;
		if (phase === "enter" && imageDepth === 0 && (token.type === "codeText" || token.type === "codeFenced" || token.type === "codeIndented")) regions.push({
			start: token.start.offset,
			end: token.end.offset,
			block: token.type !== "codeText"
		});
	}
	return regions;
}
//#endregion
//#region src/agents/tools/web-fetch-attributes.ts
const RENDER_UNQUOTED_VALUE_BREAK = /["'=<>`]/;
/** Keep rendering's href grammar distinct from complete visibility attribute names. */
function readHtmlAttribute(input, attribute, mode = "visibility") {
	const rendering = mode === "render";
	let pos = 0;
	if (rendering) while (pos < input.length && !isAsciiWhitespace(input.charAt(pos))) pos += 1;
	while (pos < input.length) {
		while (pos < input.length && (isAsciiWhitespace(input.charAt(pos)) || input.charAt(pos) === "/")) pos += 1;
		const nameStart = pos;
		if (!rendering && input.charAt(pos) === "=") pos += 1;
		while (pos < input.length && (rendering ? isTagNameChar(input.charAt(pos)) : !isAsciiWhitespace(input.charAt(pos)) && input.charAt(pos) !== "/" && input.charAt(pos) !== "=")) pos += 1;
		if (pos === nameStart) {
			if (!rendering) break;
			pos = skipUnsupportedAttribute(input, pos);
			continue;
		}
		const name = input.slice(nameStart, pos).toLowerCase();
		while (pos < input.length && isAsciiWhitespace(input.charAt(pos))) pos += 1;
		let value = "";
		if (input.charAt(pos) === "=") {
			pos += 1;
			while (pos < input.length && isAsciiWhitespace(input.charAt(pos))) pos += 1;
			const quote = input.charAt(pos);
			if (quote === "\"" || quote === "'") {
				const valueStart = pos + 1;
				const valueEnd = input.indexOf(quote, valueStart);
				value = input.slice(valueStart, valueEnd === -1 ? void 0 : valueEnd);
				pos = valueEnd === -1 ? input.length : valueEnd + 1;
			} else {
				const valueStart = pos;
				while (pos < input.length && !isAsciiWhitespace(input.charAt(pos))) {
					if (rendering && RENDER_UNQUOTED_VALUE_BREAK.test(input.charAt(pos))) break;
					pos += 1;
				}
				value = input.slice(valueStart, pos);
			}
		}
		if (name === attribute) return value;
	}
}
function skipUnsupportedAttribute(input, start) {
	let pos = start;
	while (pos < input.length && !isAsciiWhitespace(input.charAt(pos))) {
		const quote = input.charAt(pos);
		if (quote === "\"" || quote === "'") {
			const valueEnd = input.indexOf(quote, pos + 1);
			pos = valueEnd === -1 ? input.length : valueEnd + 1;
			continue;
		}
		pos += 1;
	}
	return pos;
}
//#endregion
//#region src/agents/tools/web-fetch-visibility.ts
const HIDDEN_STYLE_PATTERNS = [
	["display", /^\s*none\s*$/i],
	["visibility", /^\s*hidden\s*$/i],
	["opacity", /^\s*0\s*$/],
	["font-size", /^\s*0(px|em|rem|pt|%)?\s*$/i],
	["text-indent", /^\s*-\d{4,}px\s*$/],
	["color", /^\s*transparent\s*$/i],
	["color", /^\s*rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(?:\.0+)?\s*\)\s*$/i],
	["color", /^\s*hsla\s*\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*0(?:\.0+)?\s*\)\s*$/i],
	["clip-path", /inset\s*\(\s*(?:0*\.\d+|[1-9]\d*(?:\.\d+)?)%/i],
	["left", /^\s*-\d{4,}px\s*$/i],
	["top", /^\s*-\d{4,}px\s*$/i]
].map(([prop, valuePattern]) => {
	const escapedProp = prop.replace(/-/g, "\\-");
	return [new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*([^;]+)`, "i"), valuePattern];
});
const HIDDEN_CLASS_NAMES = /* @__PURE__ */ new Set([
	"sr-only",
	"visually-hidden",
	"d-none",
	"hidden",
	"invisible",
	"screen-reader-only",
	"offscreen"
]);
const HTML_VOID_ELEMENTS = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
function hasHiddenClass(className) {
	return normalizeLowercaseStringOrEmpty(className).split(/\s+/).some((cls) => HIDDEN_CLASS_NAMES.has(cls));
}
function isTransformHidden(transform) {
	if (/translate[XY]\s*\(\s*-\d{4,}px\s*\)/i.test(transform)) return true;
	for (const match of transform.matchAll(/\b(scale(?:3d|[XY])?)\s*\(([^()]*)\)/gi)) {
		const name = match[1].toLowerCase();
		const values = match[2].split(",").map((value) => value.trim());
		if (!(name === "scale" ? values.length === 1 || values.length === 2 : values.length === (name === "scale3d" ? 3 : 1)) || !values.every((value) => /^[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?%?$/i.test(value))) continue;
		if (values.some((value, axis) => axis < 2 && Number.parseFloat(value) === 0)) return true;
	}
	return false;
}
function isStyleHidden(style) {
	for (const [propertyPattern, valuePattern] of HIDDEN_STYLE_PATTERNS) {
		const value = style.match(propertyPattern)?.at(1);
		if (value && valuePattern.test(value)) return true;
	}
	const transform = style.match(/(?:^|;)\s*transform\s*:\s*([^;]+)/i)?.[1];
	if (transform && isTransformHidden(transform)) return true;
	const width = style.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i);
	const height = style.match(/(?:^|;)\s*height\s*:\s*([^;]+)/i);
	const overflow = style.match(/(?:^|;)\s*overflow\s*:\s*([^;]+)/i);
	return Boolean(width && /^\s*0(px)?\s*$/i.test(width.at(1) ?? "") && height && /^\s*0(px)?\s*$/i.test(height.at(1) ?? "") && overflow && /^\s*hidden\s*$/i.test(overflow.at(1) ?? ""));
}
const VISIBILITY_ATTRIBUTE_HINT = /hidden|class|style|type|[\u0080-\uffff]/i;
function shouldRemoveElement(tagName, attrs) {
	if ([
		"meta",
		"template",
		"svg",
		"canvas",
		"iframe",
		"object",
		"embed"
	].includes(tagName)) return true;
	if (!VISIBILITY_ATTRIBUTE_HINT.test(attrs)) return false;
	if (tagName === "input" && normalizeOptionalLowercaseString(readHtmlAttribute(attrs, "type")) === "hidden" || normalizeOptionalLowercaseString(readHtmlAttribute(attrs, "aria-hidden")) === "true" || readHtmlAttribute(attrs, "hidden") !== void 0 || hasHiddenClass(readHtmlAttribute(attrs, "class") ?? "")) return true;
	const style = readHtmlAttribute(attrs, "style") ?? "";
	return style ? isStyleHidden(style) : false;
}
const LIST_CONTAINERS = /* @__PURE__ */ new Set([
	"ul",
	"ol",
	"menu"
]);
const OPAQUE_TEXT_ELEMENTS = /* @__PURE__ */ new Set([
	"script",
	"style",
	"noscript",
	"textarea",
	"title",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext"
]);
const MATH_TEXT_INTEGRATION_POINTS = /* @__PURE__ */ new Set([
	"mi",
	"mo",
	"mn",
	"ms",
	"mtext"
]);
const SVG_HTML_INTEGRATION_POINTS = /* @__PURE__ */ new Set([
	"foreignobject",
	"desc",
	"title"
]);
const SHARED_SCOPE_BOUNDARIES = [
	"article",
	"aside",
	"blockquote",
	"dd",
	"details",
	"dialog",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hgroup",
	"listing",
	"main",
	"menu",
	"nav",
	"ol",
	"plaintext",
	"pre",
	"search",
	"section",
	"table",
	"ul",
	"xmp"
];
const LIST_ITEM_BOUNDARIES = /* @__PURE__ */ new Set([
	...SHARED_SCOPE_BOUNDARIES,
	...OPAQUE_TEXT_ELEMENTS,
	"applet",
	"body",
	"button",
	"caption",
	"center",
	"colgroup",
	"dir",
	"frameset",
	"head",
	"html",
	"marquee",
	"math",
	"object",
	"select",
	"summary",
	"svg",
	"tbody",
	"td",
	"template",
	"tfoot",
	"th",
	"thead",
	"tr"
]);
const DEFINITION_ITEMS = /* @__PURE__ */ new Set(["dt", "dd"]);
const LIST_ITEMS = /* @__PURE__ */ new Set(["li"]);
const DEFINITION_CONTAINERS = /* @__PURE__ */ new Set(["dl"]);
const PARAGRAPH_CLOSE_START = /* @__PURE__ */ new Set([
	...SHARED_SCOPE_BOUNDARIES,
	"address",
	"div",
	"hr",
	"li",
	"p"
]);
const TABLE_SCOPE_BOUNDARIES = /* @__PURE__ */ new Set([
	"html",
	"math",
	"svg",
	"table",
	"template"
]);
const BUTTON_SCOPE_BOUNDARIES = /* @__PURE__ */ new Set([
	...TABLE_SCOPE_BOUNDARIES,
	"applet",
	"button",
	"caption",
	"marquee",
	"object",
	"td",
	"th"
]);
const PARAGRAPH_REQUIRED_END_PARENTS = /* @__PURE__ */ new Set([
	"a",
	"audio",
	"del",
	"ins",
	"map",
	"noscript",
	"video"
]);
const ROW_GROUPS = /* @__PURE__ */ new Set([
	"tbody",
	"thead",
	"tfoot"
]);
async function sanitizeHtml(html) {
	let output = "";
	let cursor = 0;
	const elements = [{
		name: "",
		previousSameName: void 0,
		special: 0,
		buttonBoundary: 0,
		tableBoundary: 0,
		selectOwner: -1,
		namespace: "html",
		childNamespace: "html"
	}];
	const positions = /* @__PURE__ */ new Map();
	let hiddenRoot = -1;
	function closeElements(index) {
		while (elements.length > index) {
			const element = elements.pop();
			if (element.previousSameName === void 0) positions.delete(element.name);
			else positions.set(element.name, element.previousSameName);
		}
	}
	function closeOptionalElement(index) {
		if (index > 0 && elements[index].namespace === "html" && (hiddenRoot < 0 || hiddenRoot <= index)) {
			closeElements(index);
			if (hiddenRoot === index) hiddenRoot = -1;
		}
	}
	function lastOpen(names) {
		let index = -1;
		for (const name of names) {
			const position = positions.get(name);
			if (position !== void 0 && position > index) index = position;
		}
		return index;
	}
	function scopedItem(items, owners) {
		const index = elements.at(-1).special;
		if (index > 0 && items.has(elements[index].name)) {
			const owner = elements[index - 1].special;
			if (owners.has(elements[owner].name)) return index;
		}
		return -1;
	}
	function paragraph() {
		const index = positions.get("p");
		return index !== void 0 && index > elements.at(-1).buttonBoundary ? index : -1;
	}
	function tableScope() {
		const table = elements.at(-1).tableBoundary;
		const owner = elements[table].name === "table" ? table : -1;
		const group = lastOpen([
			"tbody",
			"thead",
			"tfoot"
		]);
		const row = lastOpen(["tr"]);
		const cell = lastOpen(["td", "th"]);
		return {
			owner,
			group: owner >= 0 && group > owner ? group : owner,
			row: owner >= 0 && row > owner ? row : -1,
			cell: owner >= 0 && row > owner && cell > row ? cell : -1
		};
	}
	function optionScope() {
		const owner = elements.at(-1).selectOwner;
		const group = lastOpen(["optgroup"]);
		const option = lastOpen(["option"]);
		return {
			owner,
			group: owner >= 0 && group > owner ? group : -1,
			option: owner >= 0 && option > owner ? option : -1
		};
	}
	function closesOptionalElement(element, index) {
		if (element <= 0 || index >= element || elements[element].namespace !== "html") return false;
		const name = elements[element].name;
		if (name === "li" || DEFINITION_ITEMS.has(name)) return (name === "li" ? scopedItem(LIST_ITEMS, LIST_CONTAINERS) : scopedItem(DEFINITION_ITEMS, DEFINITION_CONTAINERS)) === element && elements[element - 1].special === index;
		if (name === "p") {
			const parent = elements[element - 1].name;
			return paragraph() === element && !PARAGRAPH_REQUIRED_END_PARENTS.has(parent) && !parent.includes("-") && (index === element - 1 || closesOptionalElement(element - 1, index));
		}
		if (name === "td" || name === "th" || name === "tr" || ROW_GROUPS.has(name)) {
			const scope = tableScope();
			if (name === "td" || name === "th") return scope.cell === element && [
				scope.row,
				scope.group,
				scope.owner
			].includes(index);
			if (name === "tr") return scope.row === element && [scope.group, scope.owner].includes(index);
			return scope.group === element && index === scope.owner;
		}
		if (name === "option" || name === "optgroup") {
			const scope = optionScope();
			return name === "option" ? scope.option === element && [scope.group, scope.owner].includes(index) : scope.group === element && index === scope.owner;
		}
		return false;
	}
	function closeForStart(name) {
		if (PARAGRAPH_CLOSE_START.has(name)) closeOptionalElement(paragraph());
		if (name === "li") closeOptionalElement(scopedItem(LIST_ITEMS, LIST_CONTAINERS));
		else if (DEFINITION_ITEMS.has(name)) closeOptionalElement(scopedItem(DEFINITION_ITEMS, DEFINITION_CONTAINERS));
		else if (name === "td" || name === "th" || name === "tr" || ROW_GROUPS.has(name)) {
			if (tableScope().cell > 0) closeOptionalElement(paragraph());
			closeOptionalElement(tableScope().cell);
			if (name === "tr" || ROW_GROUPS.has(name)) closeOptionalElement(tableScope().row);
			if (ROW_GROUPS.has(name)) {
				const scope = tableScope();
				if (scope.group > scope.owner) closeOptionalElement(scope.group);
			}
		} else if (name === "option" || name === "optgroup") {
			const scope = optionScope();
			const inSelect = scope.owner >= 0 && elements[scope.owner].name === "select";
			if (inSelect || elements.at(-1).name === "option") closeOptionalElement(scope.option);
			if (name === "optgroup" && inSelect) closeOptionalElement(scope.group);
		}
	}
	function openElement(name, attrs, namespace) {
		const parent = elements.at(-1);
		const index = elements.length;
		const foreign = name === "math" || name === "svg";
		const encoding = namespace === "math" && name === "annotation-xml" ? readHtmlAttribute(attrs, "encoding")?.toLowerCase() : void 0;
		const htmlChildren = namespace === "math" && (MATH_TEXT_INTEGRATION_POINTS.has(name) || encoding === "text/html" || encoding === "application/xhtml+xml") || namespace === "svg" && SVG_HTML_INTEGRATION_POINTS.has(name);
		elements.push({
			name,
			previousSameName: positions.get(name),
			special: name === "li" || LIST_ITEM_BOUNDARIES.has(name) ? index : parent.special,
			buttonBoundary: BUTTON_SCOPE_BOUNDARIES.has(name) ? index : parent.buttonBoundary,
			tableBoundary: TABLE_SCOPE_BOUNDARIES.has(name) ? index : parent.tableBoundary,
			selectOwner: name === "select" || name === "datalist" ? index : foreign || name === "html" || name === "template" ? -1 : parent.selectOwner,
			namespace,
			childNamespace: htmlChildren ? "html" : namespace
		});
		positions.set(name, index);
	}
	while (cursor < html.length) {
		const tagStart = html.indexOf("<", cursor);
		if (tagStart < 0) {
			if (hiddenRoot < 0) output += html.slice(cursor);
			break;
		}
		if (hiddenRoot < 0) output += html.slice(cursor, tagStart);
		if (html.startsWith("<!--", tagStart)) {
			cursor = skipHtmlComment(html, tagStart);
			continue;
		}
		if (!startsLikeHtmlTag(html, tagStart)) {
			if (hiddenRoot < 0) output += "<";
			cursor = tagStart + 1;
			continue;
		}
		const read = readTagToken(html, tagStart, "visibility");
		if (!read) {
			if (hiddenRoot < 0) output += html.slice(tagStart);
			break;
		}
		const token = html.slice(tagStart, read.next);
		const parsed = read.token;
		if (!parsed) {
			if (hiddenRoot < 0) output += token;
			cursor = read.next;
			continue;
		}
		const parent = elements.at(-1);
		let namespace = parent.childNamespace;
		if (parent.namespace === "math" && MATH_TEXT_INTEGRATION_POINTS.has(parent.name) && (parsed.name === "mglyph" || parsed.name === "malignmark")) namespace = "math";
		else if (namespace === "html" && (parsed.name === "math" || parsed.name === "svg")) namespace = parsed.name;
		if (!parsed.closing && namespace === "html" && OPAQUE_TEXT_ELEMENTS.has(parsed.name)) {
			closeForStart(parsed.name);
			const bounds = parsed.name === "plaintext" ? {
				contentEnd: html.length,
				end: html.length
			} : readRawTextBounds(html, parsed.name, read.next, "visibility");
			if (hiddenRoot < 0 && !shouldRemoveElement(parsed.name, parsed.attrs)) output += parsed.name === "script" ? token + html.slice(read.next, bounds.contentEnd).replace(/<!--[\s\S]*?(?:-->|$)/g, "<!---->") + html.slice(bounds.contentEnd, bounds.end) : html.slice(tagStart, bounds.end);
			cursor = bounds.end;
			continue;
		}
		if (parsed.closing) {
			const index = positions.get(parsed.name);
			const visible = hiddenRoot < 0;
			const closesHiddenOptional = index !== void 0 && closesOptionalElement(hiddenRoot, index);
			if (index !== void 0 && (visible || index >= hiddenRoot || closesHiddenOptional)) {
				closeElements(index);
				if (hiddenRoot >= index) hiddenRoot = -1;
			}
			if (visible || closesHiddenOptional) output += token;
		} else {
			if (namespace === "html") closeForStart(parsed.name);
			const hidden = hiddenRoot >= 0 || shouldRemoveElement(parsed.name, parsed.attrs);
			if (!hidden) output += token;
			if (!parsed.selfClosing && !HTML_VOID_ELEMENTS.has(parsed.name)) {
				if (hidden && hiddenRoot < 0) hiddenRoot = elements.length;
				openElement(parsed.name, parsed.attrs, namespace);
			}
		}
		cursor = read.next;
	}
	return output;
}
//#endregion
//#region src/agents/tools/web-fetch-utils.ts
const BLOCK_BREAK_TAGS = /* @__PURE__ */ new Set([
	"p",
	"div",
	"section",
	"article",
	"header",
	"footer",
	"table",
	"tr",
	"ul",
	"ol",
	"dl",
	"dt",
	"dd",
	"address",
	"aside",
	"blockquote",
	"caption",
	"center",
	"details",
	"dialog",
	"dir",
	"fieldset",
	"figcaption",
	"figure",
	"form",
	"hgroup",
	"legend",
	"main",
	"menu",
	"nav",
	"search",
	"summary"
]);
const MAX_RENDER_CONTEXT_DEPTH = 32;
const MAX_BLOCK_BREAK_LOOKBACK = 64;
function decodeEntities(value) {
	return decodeHtmlEntities(value.replace(/&nbsp;/gi, "\xA0")).replaceAll("\xA0", " ");
}
function readAnchorHref(rawTag) {
	const value = readHtmlAttribute(rawTag, "href", "render");
	return value === void 0 ? void 0 : decodeEntities(value);
}
function appendText(stack, value) {
	const context = stack[stack.length - 1];
	context?.parts.push(value);
	if (context?.kind === "anchor" && /\S/.test(value)) context.hasText = true;
}
function breakLineBeforeBlock(stack) {
	const parts = stack[stack.length - 1]?.parts ?? [];
	let budget = MAX_BLOCK_BREAK_LOOKBACK;
	for (let i = parts.length - 1; i >= 0 && budget > 0; i -= 1, budget -= 1) {
		const part = parts[i];
		for (let j = part.length - 1; j >= 0 && budget > 0; j -= 1, budget -= 1) if (part[j] !== " " && part[j] !== "	") {
			if (part[j] !== "\n") appendText(stack, "\n");
			return;
		}
	}
}
function closeContext(context, parent, state) {
	const label = normalizeWhitespace(context.parts.join(""));
	if (!label && context.kind !== "title" && !(context.kind === "anchor" && context.href)) return;
	if (context.kind === "title") {
		state.title ??= label || void 0;
		return;
	}
	if (parent.kind === "title") {
		parent.parts.push(label);
		return;
	}
	switch (context.kind) {
		case "root": return;
		case "anchor":
			parent.parts.push(!state.linksAsText && context.href && label ? `[${label}](${context.href})` : label || context.href || "");
			return;
		case "heading":
			if (parent.kind === "anchor") {
				parent.parts.push(label);
				parent.hasText ||= Boolean(label);
			} else parent.parts.push(`\n${"#".repeat(context.level)} ${label}\n`);
			return;
		case "list-item":
			if (parent.kind === "anchor") parent.hasText ||= Boolean(label);
			parent.parts.push(`\n- ${label}`);
	}
}
function closeTopContext(stack, state) {
	closeContext(stack.pop(), stack[stack.length - 1], state);
}
function closeThroughContext(stack, kind, state, requireAnchorText = false) {
	for (let i = stack.length - 1; i > 0; i -= 1) {
		const context = stack[i];
		if (context?.kind === kind) {
			if (requireAnchorText && context.kind === "anchor" && !context.hasText) return false;
			while (stack.length > i) closeTopContext(stack, state);
			return true;
		}
	}
	return false;
}
function pushContext(stack, context, state) {
	while (stack.length >= MAX_RENDER_CONTEXT_DEPTH) closeTopContext(stack, state);
	stack.push(context);
}
function htmlToMarkdown(html, options) {
	const root = {
		kind: "root",
		parts: []
	};
	const stack = [root];
	const state = { linksAsText: options?.linksAsText };
	for (let i = 0; i < html.length;) {
		if (html[i] !== "<") {
			const nextTag = html.indexOf("<", i);
			const end = nextTag === -1 ? html.length : nextTag;
			appendText(stack, decodeEntities(html.slice(i, end)));
			i = end;
			continue;
		}
		const rawTextTagName = readRawTextOpenTagName(html, i);
		if (rawTextTagName) {
			i = skipRawTextElement(html, i, rawTextTagName);
			continue;
		}
		if (!startsLikeHtmlTag(html, i)) {
			appendText(stack, "<");
			i += 1;
			continue;
		}
		const read = readTagToken(html, i);
		if (!read) {
			const rawTextStart = findRawTextOpenTagStart(html, i + 1, html.length);
			if (rawTextStart !== -1) {
				i = rawTextStart;
				continue;
			}
			break;
		}
		const { token, next } = read;
		i = next;
		if (!token) continue;
		const kind = token.name === "title" ? "title" : token.name === "a" ? "anchor" : /^h[1-6]$/.test(token.name) ? "heading" : token.name === "li" ? "list-item" : void 0;
		if (token.closing) {
			if (kind) closeThroughContext(stack, kind, state);
			else if (BLOCK_BREAK_TAGS.has(token.name)) appendText(stack, "\n");
			continue;
		}
		if (RAW_TEXT_TAGS.has(token.name)) {
			i = readRawTextBounds(html, token.name, i).end;
			continue;
		}
		if (BLOCK_BREAK_TAGS.has(token.name)) {
			if (closeThroughContext(stack, "anchor", state, true)) appendText(stack, " ");
			else breakLineBeforeBlock(stack);
		}
		if (token.name === "br" || token.name === "hr") {
			appendText(stack, "\n");
			continue;
		}
		if (!kind || token.selfClosing) continue;
		if (kind !== "title") closeThroughContext(stack, "anchor", state, kind !== "anchor");
		pushContext(stack, kind === "anchor" ? {
			kind,
			href: readAnchorHref(token.raw),
			hasText: false,
			parts: []
		} : kind === "heading" ? {
			kind,
			level: Number.parseInt(token.name[1] ?? "1", 10),
			parts: []
		} : {
			kind,
			parts: []
		}, state);
	}
	while (stack.length > 1) closeTopContext(stack, state);
	return {
		text: normalizeWhitespace(root.parts.join("")),
		title: state.title
	};
}
function normalizeWhitespace(value) {
	return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function readBacktickRunEnd(value, start) {
	let end = start + 1;
	while (value[end] === "`") end += 1;
	return end;
}
/**
* Inline code ownership is decided on the original Markdown, not on the prose that is
* left after fenced blocks are removed. The shared parser knows that backticks inside a
* link or image destination are not code delimiters, that code inside an image label is
* alt text, and that a span wrapping a fence-looking run is still one literal span.
* Hiding those ranges up front keeps their content literal without nesting the
* placeholders that fenced blocks already own.
*/
function createInlineCodeHider(markdown, codeBlocks) {
	const regions = findMarkdownCodeRegions(markdown).filter((region) => !region.block);
	const insideInline = (index) => regions.some((region) => index >= region.start && index < region.end);
	const emit = (from, to) => {
		let out = "";
		let cursor = from;
		for (const region of regions) {
			if (region.end <= from || region.start >= to) continue;
			const start = Math.max(region.start, from);
			const end = Math.min(region.end, to);
			if (start > cursor) out += markdown.slice(cursor, start).replaceAll("\0", "\0\0");
			if (start === region.start && end === region.end) {
				const delimiter = readBacktickRunEnd(markdown, region.start) - region.start;
				const literal = markdown.slice(region.start + delimiter, region.end - delimiter);
				if (literal) {
					out += `\0${codeBlocks.length}\0`;
					codeBlocks.push(literal);
				}
			} else out += markdown.slice(start, end).replaceAll("\0", "\0\0");
			cursor = end;
		}
		if (cursor < to) out += markdown.slice(cursor, to).replaceAll("\0", "\0\0");
		return out;
	};
	return {
		insideInline,
		emit
	};
}
function markdownToText(markdown) {
	const codeBlocks = [];
	const inline = createInlineCodeHider(markdown, codeBlocks);
	let text = "";
	const opener = /`{3,}|(?:^|\n) {0,3}(~{3,})/g;
	let pos = 0;
	while (pos < markdown.length) {
		let opening = null;
		let searchFrom = pos;
		while (searchFrom < markdown.length) {
			opener.lastIndex = searchFrom;
			const candidate = opener.exec(markdown);
			if (!candidate) break;
			const candidateIsTilde = candidate[1] !== void 0;
			const candidateOpen = candidate.index + (candidateIsTilde && candidate[0].startsWith("\n") ? 1 : 0);
			if (!inline.insideInline(candidateOpen)) {
				opening = candidate;
				break;
			}
			searchFrom = candidateOpen + 1;
		}
		if (!opening) {
			text += inline.emit(pos, markdown.length);
			break;
		}
		const isTilde = opening[1] !== void 0;
		const open = opening.index + (isTilde && opening[0].startsWith("\n") ? 1 : 0);
		text += inline.emit(pos, open);
		const afterOpen = opening.index + opening[0].length;
		const fenceLength = opening[1]?.length ?? afterOpen - open;
		let close;
		if (isTilde) {
			const closing = /(?:^|\n) {0,3}(~{3,})[ \t]*\r?(?=\n|$)/g;
			closing.lastIndex = afterOpen;
			for (let match = closing.exec(markdown); match; match = closing.exec(markdown)) if (match[1].length >= fenceLength) {
				close = {
					start: match.index + (match[0].startsWith("\n") ? 1 : 0),
					end: match.index + match[0].length
				};
				break;
			}
		} else {
			let closingStart = afterOpen;
			while (closingStart < markdown.length) {
				const start = markdown.indexOf("`", closingStart);
				if (start === -1) break;
				const end = readBacktickRunEnd(markdown, start);
				if (end - start >= fenceLength) {
					close = {
						start,
						end: start + fenceLength
					};
					break;
				}
				closingStart = end;
			}
		}
		const firstLineEnd = markdown.indexOf("\n", afterOpen);
		if (!close && !isTilde) {
			const lineStart = markdown.lastIndexOf("\n", open) + 1;
			if (firstLineEnd === -1 || !/^[ \t]*$/.test(markdown.slice(lineStart, open))) {
				text += inline.emit(open, markdown.length);
				break;
			}
		}
		const contentEnd = close?.start ?? markdown.length;
		const contentStart = isTilde && firstLineEnd === -1 ? markdown.length : firstLineEnd === -1 || firstLineEnd > contentEnd ? afterOpen : firstLineEnd + 1;
		const code = markdown.slice(contentStart, contentEnd);
		const lineEnd = /[\r\n\u2028\u2029]$/.test(code) ? code.slice(-1) : "";
		const literal = code.slice(0, code.length - lineEnd.length);
		if (literal) {
			text += `\0${codeBlocks.length}\0`;
			codeBlocks.push(literal);
		}
		text += lineEnd;
		pos = close?.end ?? markdown.length;
	}
	text = stripInlineLinks(text, { images: "omit" });
	text = text.replace(/`([^`]+)`/g, "$1");
	text = text.replace(/^#{1,6}\s+/gm, "");
	text = text.replace(/^[^\S\n]*[-*+]\s+/gm, "");
	text = text.replace(/^[^\S\n]*\d+\.\s+/gm, "");
	return normalizeWhitespace(text).replace(/\0(?:\0|(\d+)\0)/g, (_match, index) => index === void 0 ? "\0" : codeBlocks[Number(index)]);
}
function truncateWebFetchText(value, maxChars) {
	if (value.length <= maxChars) return {
		text: value,
		truncated: false
	};
	return {
		text: truncateUtf16Safe(value, maxChars),
		truncated: true
	};
}
async function extractBasicHtmlContent(params) {
	const rendered = htmlToMarkdown(await sanitizeHtml(params.html), { linksAsText: params.extractMode === "text" });
	const text = stripInvisibleUnicode(params.extractMode === "text" ? markdownToText(rendered.text) : rendered.text) || stripInvisibleUnicode(rendered.title ?? "") || stripInvisibleUnicode(rendered.text);
	return text ? {
		text,
		title: rendered.title
	} : null;
}
//#endregion
export { truncateWebFetchText as a, normalizeWhitespace as i, htmlToMarkdown as n, sanitizeHtml as o, markdownToText as r, extractBasicHtmlContent as t };
