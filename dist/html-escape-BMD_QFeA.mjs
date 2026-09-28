//#region src/shared/html-escape.ts
/** Escapes text for safe insertion into HTML text and quoted attribute values. */
function escapeHtml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
//#endregion
export { escapeHtml as t };
