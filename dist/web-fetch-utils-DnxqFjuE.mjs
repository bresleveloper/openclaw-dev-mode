import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as stripInvisibleUnicode } from "./unicode-visibility-cJ_24BIl.mjs";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.mjs";
import { a as readRawTextBounds, c as skipHtmlComment, i as isTagNameChar, l as skipRawTextElement, n as findRawTextOpenTagStart, o as readRawTextOpenTagName, r as isAsciiWhitespace, s as readTagToken, t as RAW_TEXT_TAGS, u as startsLikeHtmlTag } from "./html-scanner-3p55PREi.mjs";
//#region src/agents/tools/web-fetch-visibility.ts
/**
* HTML visibility sanitizers for web_fetch.
*
* Removes hidden or invisible content before readable-text extraction.
*/
const HIDDEN_STYLE_PATTERNS = [
	["display", /^\s*none\s*$/i],
	["visibility", /^\s*hidden\s*$/i],
	["opacity", /^\s*0\s*$/],
	["font-size", /^\s*0(px|em|rem|pt|%)?\s*$/i],
	["text-indent", /^\s*-\d{4,}px\s*$/],
	["color", /^\s*transparent\s*$/i],
	["color", /^\s*rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(?:\.0+)?\s*\)\s*$/i],
	["color", /^\s*hsla\s*\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*0(?:\.0+)?\s*\)\s*$/i]
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
function isStyleHidden(style) {
	for (const [propertyPattern, valuePattern] of HIDDEN_STYLE_PATTERNS) {
		const value = style.match(propertyPattern)?.at(1);
		if (value && valuePattern.test(value)) return true;
	}
	const clipPathValue = style.match(/(?:^|;)\s*clip-path\s*:\s*([^;]+)/i)?.at(1);
	if (clipPathValue && !/^\s*none\s*$/i.test(clipPathValue)) {
		if (/inset\s*\(\s*(?:0*\.\d+|[1-9]\d*(?:\.\d+)?)%/i.test(clipPathValue)) return true;
	}
	const transformValue = style.match(/(?:^|;)\s*transform\s*:\s*([^;]+)/i)?.at(1);
	if (transformValue) {
		if (/scale\s*\(\s*0\s*\)/i.test(transformValue)) return true;
		if (/translateX\s*\(\s*-\d{4,}px\s*\)/i.test(transformValue)) return true;
		if (/translateY\s*\(\s*-\d{4,}px\s*\)/i.test(transformValue)) return true;
	}
	const width = style.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i);
	const height = style.match(/(?:^|;)\s*height\s*:\s*([^;]+)/i);
	const overflow = style.match(/(?:^|;)\s*overflow\s*:\s*([^;]+)/i);
	if (width && /^\s*0(px)?\s*$/i.test(width.at(1) ?? "") && height && /^\s*0(px)?\s*$/i.test(height.at(1) ?? "") && overflow && /^\s*hidden\s*$/i.test(overflow.at(1) ?? "")) return true;
	const left = style.match(/(?:^|;)\s*left\s*:\s*([^;]+)/i);
	const top = style.match(/(?:^|;)\s*top\s*:\s*([^;]+)/i);
	if (left && /^\s*-\d{4,}px\s*$/i.test(left.at(1) ?? "")) return true;
	if (top && /^\s*-\d{4,}px\s*$/i.test(top.at(1) ?? "")) return true;
	return false;
}
function createAttributeReader(attribute) {
	return (attrs) => {
		let pos = 0;
		while (pos < attrs.length) {
			while (pos < attrs.length && (isAsciiWhitespace(attrs.charAt(pos)) || attrs.charAt(pos) === "/")) pos += 1;
			const nameStart = pos;
			if (attrs.charAt(pos) === "=") pos += 1;
			while (pos < attrs.length && !isAsciiWhitespace(attrs.charAt(pos)) && attrs.charAt(pos) !== "/" && attrs.charAt(pos) !== "=") pos += 1;
			if (pos === nameStart) break;
			const name = attrs.slice(nameStart, pos).toLowerCase();
			while (pos < attrs.length && isAsciiWhitespace(attrs.charAt(pos))) pos += 1;
			let value = "";
			if (attrs.charAt(pos) === "=") {
				pos += 1;
				while (pos < attrs.length && isAsciiWhitespace(attrs.charAt(pos))) pos += 1;
				const quote = attrs.charAt(pos);
				if (quote === "\"" || quote === "'") {
					const valueStart = pos + 1;
					const valueEnd = attrs.indexOf(quote, valueStart);
					value = valueEnd === -1 ? attrs.slice(valueStart) : attrs.slice(valueStart, valueEnd);
					pos = valueEnd === -1 ? attrs.length : valueEnd + 1;
				} else {
					const valueStart = pos;
					while (pos < attrs.length && !isAsciiWhitespace(attrs.charAt(pos))) pos += 1;
					value = attrs.slice(valueStart, pos);
				}
			}
			if (name === attribute) return value;
		}
	};
}
const readType = createAttributeReader("type");
const readAriaHidden = createAttributeReader("aria-hidden");
const readHidden = createAttributeReader("hidden");
const readClass = createAttributeReader("class");
const readStyle = createAttributeReader("style");
const readEncoding = createAttributeReader("encoding");
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
	if (tagName === "input" && normalizeOptionalLowercaseString(readType(attrs)) === "hidden" || normalizeOptionalLowercaseString(readAriaHidden(attrs)) === "true" || readHidden(attrs) !== void 0 || hasHiddenClass(readClass(attrs) ?? "")) return true;
	const style = readStyle(attrs) ?? "";
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
const LIST_ITEM_BOUNDARIES = /* @__PURE__ */ new Set([
	"applet",
	"article",
	"aside",
	"blockquote",
	"body",
	"button",
	"caption",
	"center",
	"colgroup",
	"dd",
	"details",
	"dialog",
	"dir",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"html",
	"iframe",
	"listing",
	"main",
	"marquee",
	"math",
	"menu",
	"nav",
	"noembed",
	"noframes",
	"noscript",
	"object",
	"ol",
	"plaintext",
	"pre",
	"script",
	"search",
	"section",
	"select",
	"style",
	"summary",
	"svg",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"title",
	"tr",
	"ul",
	"xmp"
]);
const DEFINITION_ITEMS = /* @__PURE__ */ new Set(["dt", "dd"]);
const LIST_ITEMS = /* @__PURE__ */ new Set(["li"]);
const DEFINITION_CONTAINERS = /* @__PURE__ */ new Set(["dl"]);
const PARAGRAPH_CLOSE_START = /* @__PURE__ */ new Set([
	"address",
	"article",
	"aside",
	"blockquote",
	"dd",
	"details",
	"dialog",
	"div",
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
	"hr",
	"li",
	"listing",
	"main",
	"menu",
	"nav",
	"ol",
	"p",
	"plaintext",
	"pre",
	"search",
	"section",
	"table",
	"ul",
	"xmp"
]);
const BUTTON_SCOPE_BOUNDARIES = /* @__PURE__ */ new Set([
	"applet",
	"button",
	"caption",
	"html",
	"marquee",
	"math",
	"object",
	"svg",
	"table",
	"td",
	"template",
	"th"
]);
const TABLE_SCOPE_BOUNDARIES = /* @__PURE__ */ new Set([
	"html",
	"math",
	"svg",
	"table",
	"template"
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
function removeMarkedElements(html) {
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
		const encoding = namespace === "math" && name === "annotation-xml" ? readEncoding(attrs)?.toLowerCase() : void 0;
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
async function sanitizeHtml(html) {
	return removeMarkedElements(html);
}
//#endregion
//#region src/agents/tools/web-fetch-utils.ts
/**
* web_fetch extraction utilities.
*
* Converts lightweight HTML into bounded markdown/text without pulling in a full renderer.
*/
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
	"ol"
]);
const MAX_RENDER_CONTEXT_DEPTH = 32;
function decodeEntities(value) {
	return decodeHtmlEntities(value.replace(/&nbsp;/gi, "\xA0")).replaceAll("\xA0", " ");
}
function readAttributeValue(rawTag, name) {
	const target = name.toLowerCase();
	let pos = 0;
	while (pos < rawTag.length && !isAsciiWhitespace(rawTag.charAt(pos))) pos += 1;
	while (pos < rawTag.length) {
		while (pos < rawTag.length && (isAsciiWhitespace(rawTag.charAt(pos)) || rawTag.charAt(pos) === "/")) pos += 1;
		const attrStart = pos;
		while (pos < rawTag.length && isTagNameChar(rawTag.charAt(pos))) pos += 1;
		if (pos === attrStart) {
			pos = skipUnsupportedAttribute(rawTag, pos);
			continue;
		}
		const attrName = rawTag.slice(attrStart, pos).toLowerCase();
		while (pos < rawTag.length && isAsciiWhitespace(rawTag.charAt(pos))) pos += 1;
		let value = "";
		if (rawTag[pos] === "=") {
			pos += 1;
			while (pos < rawTag.length && isAsciiWhitespace(rawTag.charAt(pos))) pos += 1;
			const quote = rawTag[pos];
			if (quote === "\"" || quote === "'") {
				const valueStart = pos + 1;
				const valueEnd = rawTag.indexOf(quote, valueStart);
				if (valueEnd === -1) {
					value = rawTag.slice(valueStart);
					pos = rawTag.length;
				} else {
					value = rawTag.slice(valueStart, valueEnd);
					pos = valueEnd + 1;
				}
			} else {
				const valueStart = pos;
				while (pos < rawTag.length && !isAsciiWhitespace(rawTag.charAt(pos)) && rawTag[pos] !== "\"" && rawTag[pos] !== "'" && rawTag[pos] !== "=" && rawTag[pos] !== "<" && rawTag[pos] !== ">" && rawTag[pos] !== "`") pos += 1;
				value = rawTag.slice(valueStart, pos);
			}
		}
		if (attrName === target) return decodeEntities(value);
	}
}
function skipUnsupportedAttribute(rawTag, start) {
	let pos = start;
	while (pos < rawTag.length && !isAsciiWhitespace(rawTag.charAt(pos))) {
		const quote = rawTag.charAt(pos);
		if (quote === "\"" || quote === "'") {
			const valueEnd = rawTag.indexOf(quote, pos + 1);
			pos = valueEnd === -1 ? rawTag.length : valueEnd + 1;
			continue;
		}
		pos += 1;
	}
	return pos;
}
function contextText(context) {
	return context.parts.join("");
}
function appendText(stack, value) {
	const context = stack[stack.length - 1];
	context?.parts.push(value);
	if (context?.kind === "anchor" && /\S/.test(value)) context.hasText = true;
}
function closeContext(context, parent, state) {
	const label = normalizeWhitespace(contextText(context));
	if (!label && context.kind !== "title" && !(context.kind === "anchor" && context.href)) return;
	switch (context.kind) {
		case "title":
			state.title ??= label || void 0;
			return;
		case "anchor":
			if (parent.kind === "title") parent.parts.push(label);
			else parent.parts.push(context.href && label ? `[${label}](${context.href})` : label || context.href || "");
			return;
		case "heading":
			if (parent.kind === "title") parent.parts.push(label);
			else if (parent.kind === "anchor") {
				parent.parts.push(label);
				parent.hasText ||= Boolean(label);
			} else parent.parts.push(`\n${"#".repeat(context.level)} ${label}\n`);
			return;
		case "list-item":
			if (parent.kind === "title") parent.parts.push(label);
			else {
				if (parent.kind === "anchor") parent.hasText ||= Boolean(label);
				parent.parts.push(`\n- ${label}`);
			}
			return;
		case "root": parent.parts.push(label);
	}
}
function closeTopContext(stack, state) {
	if (stack.length < 2) return false;
	const context = stack.pop();
	const parent = stack[stack.length - 1];
	if (!context || !parent) return false;
	closeContext(context, parent, state);
	return true;
}
function closeThroughContext(stack, kind, state) {
	for (let i = stack.length - 1; i > 0; i -= 1) if (stack[i]?.kind === kind) {
		while (stack.length > i) closeTopContext(stack, state);
		return true;
	}
	return false;
}
function pushContext(stack, context, state) {
	while (stack.length >= MAX_RENDER_CONTEXT_DEPTH) closeTopContext(stack, state);
	stack.push(context);
}
function closeOpenAnchorWithText(stack, state) {
	for (let i = stack.length - 1; i > 0; i -= 1) {
		const context = stack[i];
		if (context?.kind === "anchor") {
			if (!context.hasText) return false;
			while (stack.length > i) closeTopContext(stack, state);
			return true;
		}
	}
	return false;
}
function htmlFragmentToMarkdown(html) {
	const root = {
		kind: "root",
		parts: []
	};
	const stack = [root];
	const state = {};
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
		if (token.closing) {
			if (token.name === "title") closeThroughContext(stack, "title", state);
			else if (token.name === "a") closeThroughContext(stack, "anchor", state);
			else if (/^h[1-6]$/.test(token.name)) closeThroughContext(stack, "heading", state);
			else if (token.name === "li") closeThroughContext(stack, "list-item", state);
			else if (BLOCK_BREAK_TAGS.has(token.name)) appendText(stack, "\n");
			continue;
		}
		if (RAW_TEXT_TAGS.has(token.name)) {
			i = readRawTextBounds(html, token.name, i).end;
			continue;
		}
		if (BLOCK_BREAK_TAGS.has(token.name)) {
			if (closeOpenAnchorWithText(stack, state)) appendText(stack, " ");
		}
		if (token.name === "br" || token.name === "hr") {
			appendText(stack, "\n");
			continue;
		}
		if (token.name === "title" && !token.selfClosing) {
			pushContext(stack, {
				kind: "title",
				parts: []
			}, state);
			continue;
		}
		if (token.name === "a" && !token.selfClosing) {
			closeThroughContext(stack, "anchor", state);
			pushContext(stack, {
				kind: "anchor",
				href: readAttributeValue(token.raw, "href"),
				hasText: false,
				parts: []
			}, state);
			continue;
		}
		if (/^h[1-6]$/.test(token.name) && !token.selfClosing) {
			closeOpenAnchorWithText(stack, state);
			pushContext(stack, {
				kind: "heading",
				level: Number.parseInt(token.name[1] ?? "1", 10),
				parts: []
			}, state);
			continue;
		}
		if (token.name === "li" && !token.selfClosing) {
			closeOpenAnchorWithText(stack, state);
			pushContext(stack, {
				kind: "list-item",
				parts: []
			}, state);
		}
	}
	while (stack.length > 1) closeTopContext(stack, state);
	return {
		text: normalizeWhitespace(contextText(root)),
		title: state.title
	};
}
/** Collapses display whitespace while preserving paragraph breaks. */
function normalizeWhitespace(value) {
	return value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
/** Converts sanitized HTML into coarse markdown plus an optional title. */
function htmlToMarkdown(html) {
	return htmlFragmentToMarkdown(html);
}
/** Removes markdown decoration for plain text extraction. */
function markdownToText(markdown) {
	let text = markdown;
	text = text.replace(/!\[[^\]]*]\([^)]+\)/g, "");
	text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
	let unfenced = "";
	let pos = 0;
	while (pos < text.length) {
		const open = text.indexOf("```", pos);
		if (open === -1) {
			unfenced += text.slice(pos);
			break;
		}
		unfenced += text.slice(pos, open);
		const afterOpen = open + 3;
		const close = text.indexOf("```", afterOpen);
		if (close === -1) {
			unfenced += text.slice(open);
			break;
		}
		const firstLineEnd = text.indexOf("\n", afterOpen);
		const contentStart = firstLineEnd === -1 || firstLineEnd > close ? afterOpen : firstLineEnd + 1;
		unfenced += text.slice(contentStart, close);
		pos = close + 3;
	}
	text = unfenced;
	text = text.replace(/`([^`]+)`/g, "$1");
	text = text.replace(/^#{1,6}\s+/gm, "");
	text = text.replace(/^\s*[-*+]\s+/gm, "");
	text = text.replace(/^\s*\d+\.\s+/gm, "");
	return normalizeWhitespace(text);
}
/** Truncates text by characters and reports whether truncation occurred. */
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
/** Sanitizes HTML and extracts either markdown or plain text content. */
async function extractBasicHtmlContent(params) {
	const rendered = htmlToMarkdown(await sanitizeHtml(params.html));
	if (params.extractMode === "text") {
		const text = stripInvisibleUnicode(markdownToText(rendered.text)) || stripInvisibleUnicode(rendered.title ?? "") || stripInvisibleUnicode(rendered.text);
		return text ? {
			text,
			title: rendered.title
		} : null;
	}
	const text = stripInvisibleUnicode(rendered.text) || stripInvisibleUnicode(rendered.title ?? "");
	return text ? {
		text,
		title: rendered.title
	} : null;
}
//#endregion
export { truncateWebFetchText as a, normalizeWhitespace as i, htmlToMarkdown as n, sanitizeHtml as o, markdownToText as r, extractBasicHtmlContent as t };
