//#region src/shared/text/escape-markdown.ts
/** Encodes prepared text as literal CommonMark, including URL and HTML punctuation. */
function escapeMarkdownText(text) {
	return text.replace(/[!-/:-@[-`{-~]/g, "\\$&");
}
//#endregion
export { escapeMarkdownText as t };
