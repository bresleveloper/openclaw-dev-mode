//#region src/plugin-sdk/widget-html.ts
const COMPLETE_HTML_DOCUMENT_PATTERN = /^(?:<!doctype\s+html\b|<html\b)/i;
/** Public static assets available to widget documents; never a connect-src grant. */
const WIDGET_CDN_ORIGINS = Object.freeze([
	"https://cdnjs.cloudflare.com",
	"https://cdn.jsdelivr.net",
	"https://esm.sh",
	"https://unpkg.com",
	"https://fonts.googleapis.com",
	"https://fonts.gstatic.com",
	"https://fonts.bunny.net"
]);
/** Input error surfaced by tools that accept agent-supplied widget HTML. */
var WidgetHtmlInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ToolInputError";
	}
};
/** Returns true when HTML already contains its own document shell. */
function isCompleteHtmlDocument(html) {
	return COMPLETE_HTML_DOCUMENT_PATTERN.test(html.trimStart());
}
/** Enforces a widget HTML size limit while preserving the caller's input label and unit. */
function assertWidgetHtmlSize(html, maxSize, options = {}) {
	const inputName = options.inputName ?? "html";
	const unit = options.unit ?? "bytes";
	if ((unit === "bytes" ? new TextEncoder().encode(html).byteLength : html.length) > maxSize) throw new WidgetHtmlInputError(`${inputName} exceeds maximum size (${maxSize} ${unit})`);
}
//#endregion
export { isCompleteHtmlDocument as i, WidgetHtmlInputError as n, assertWidgetHtmlSize as r, WIDGET_CDN_ORIGINS as t };
